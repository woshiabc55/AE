import { EventEmitter } from 'events';
import { Router } from './providers';
import type { Workflow, RunEvent } from './types';

export class ExecutionEngine {
  private bus = new EventEmitter();
  private router = new Router();
  private aborted = new Set<string>();
  // 缓冲:执行早于订阅时缓存事件,订阅后回放
  private buffer = new Map<string, RunEvent[]>();

  runId(workflow: Workflow, inputs: Record<string, string>): string {
    const id = 'run_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    this.aborted.delete(id);
    this.buffer.set(id, []);
    queueMicrotask(() => this.execute(id, workflow, inputs));
    return id;
  }

  abort(id: string) {
    this.aborted.add(id);
  }

  subscribe(id: string, fn: (e: RunEvent) => void) {
    const handler = (e: RunEvent) => fn(e);
    this.bus.on(id, handler);
    // 回放缓冲
    const buffered = this.buffer.get(id);
    if (buffered) {
      for (const e of buffered) fn(e);
      this.buffer.delete(id);
    }
    return () => this.bus.off(id, handler);
  }

  private emit(id: string, e: RunEvent) {
    // 缓冲尚未订阅的事件
    const buffered = this.buffer.get(id);
    if (buffered) {
      buffered.push(e);
      if (e.type === 'end' || e.type === 'error') {
        // 终止事件也保留,等待订阅时回放
      }
    }
    this.bus.emit(id, e);
    // 终止后清理缓冲
    if (e.type === 'end') {
      // 给一个缓冲时间让订阅者收完
      setTimeout(() => this.buffer.delete(id), 1000);
    }
  }

  // 拓扑排序(Kahn)
  private topo(workflow: Workflow): string[] {
    const inDeg = new Map<string, number>();
    workflow.nodes.forEach((n) => inDeg.set(n.id, 0));
    workflow.edges.forEach((e) => inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1));
    const q: string[] = [];
    inDeg.forEach((d, id) => {
      if (d === 0) q.push(id);
    });
    const order: string[] = [];
    const outgoing = new Map<string, string[]>();
    workflow.nodes.forEach((n) => outgoing.set(n.id, []));
    workflow.edges.forEach((e) => outgoing.get(e.source)!.push(e.target));
    while (q.length) {
      const cur = q.shift()!;
      order.push(cur);
      for (const nx of outgoing.get(cur) || []) {
        const d = (inDeg.get(nx) || 0) - 1;
        inDeg.set(nx, d);
        if (d === 0) q.push(nx);
      }
    }
    return order.length === workflow.nodes.length ? order : [];
  }

  private async execute(id: string, workflow: Workflow, inputs: Record<string, string>) {
    this.emit(id, { type: 'start', payload: { workflowId: workflow.id, total: workflow.nodes.length } });
    const order = this.topo(workflow);
    if (order.length === 0) {
      this.emit(id, { type: 'error', payload: { message: '工作流存在环路或无节点' } });
      this.emit(id, { type: 'end' });
      return;
    }
    const out = new Map<string, string>();
    // 输入节点以用户输入填充
    Object.entries(inputs).forEach(([k, v]) => out.set(k, v));

    for (const nodeId of order) {
      if (this.aborted.has(id)) {
        this.emit(id, { type: 'error', payload: { message: '已中止' } });
        break;
      }
      const node = workflow.nodes.find((n) => n.id === nodeId)!;
      this.emit(id, { type: 'node-start', nodeId, payload: { kind: (node.data?.kind as any), label: node.data?.label as any } });

      // 收集上游输出
      const upstream = workflow.edges
        .filter((e) => e.target === nodeId)
        .map((e) => ({ from: e.source, text: out.get(e.source) || '' }));

      try {
        const text = await this.invokeNode(id, node, upstream);
        out.set(nodeId, text);
        this.emit(id, { type: 'node-end', nodeId, payload: { text } });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.emit(id, { type: 'error', nodeId, payload: { message } });
        this.emit(id, { type: 'end' });
        return;
      }
    }
    this.emit(id, { type: 'end', payload: { outputs: Object.fromEntries(out) } });
  }

  private async invokeNode(
    runId: string,
    node: { id: string; data?: any },
    upstream: { from: string; text: string }[],
  ): Promise<string> {
    const data = node.data || {};
    const kind = data.kind;
    if (kind === 'input') {
      return data.value || '';
    }
    if (kind === 'condition') {
      const cond = (data.expression || '').toLowerCase();
      const left = upstream[0]?.text || '';
      // 简单包含判断
      return cond && left.toLowerCase().includes(cond) ? 'true' : 'false';
    }
    if (kind === 'output') {
      return upstream[0]?.text || '';
    }
    if (kind === 'tool') {
      // 模拟工具
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 200));
      return `[${data.tool || 'tool'}] 已处理 ${upstream[0]?.text?.length || 0} 字符`;
    }
    if (kind === 'llm') {
      const prompt = (data.prompt || '请用一句话总结以下内容:') + '\n\n' +
        upstream.map((u) => u.text).filter(Boolean).join('\n---\n');
      const req = {
        provider: data.provider || 'mock',
        model: data.model || 'mock-pro',
        prompt,
        temperature: data.temperature ?? 0.7,
        maxTokens: data.maxTokens ?? 512,
      };
      let acc = '';
      const gen = this.router.stream(req);
      for await (const tk of gen) {
        if (tk.type === 'token' && tk.text) {
          acc += tk.text;
          // 通过 run 通道转发 token,保证控制台能拿到流式片段
          this.emit(runId, { type: 'token', nodeId: node.id, text: tk.text });
        } else if (tk.type === 'error') {
          throw new Error(tk.error);
        }
      }
      return acc;
    }
    return '';
  }
}
