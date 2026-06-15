import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type NodeMouseHandler,
  ReactFlowProvider,
} from '@xyflow/react';
import { useStore, nodeDefinitions } from '@/store';
import ForgeNode from './ForgeNode';
import type { NodeData, RunEvent } from '@/types';
import { startRun, subscribeRun, abortRun, pingProvider, fetchProviders } from '@/api';
import { Play, Square, Save, FolderOpen, Plus, FlaskConical } from 'lucide-react';

const nodeTypes = { forge: ForgeNode };

interface Props {
  mode: 'design' | 'runtime';
}

function CanvasInner({ mode }: Props) {
  const wf = useStore((s) => s.workflow) as any;
  const onNodesChange = useStore((s) => s.onNodesChange) as any;
  const onEdgesChange = useStore((s) => s.onEdgesChange) as any;
  const onConnect = useStore((s) => s.onConnect) as any;
  const setSelected = useStore((s) => s.setSelected);
  const selectedId = useStore((s) => s.selectedNodeId);
  const setMode = useStore((s) => s.setMode);
  const isRunning = useStore((s) => s.isRunning);
  const runId = useStore((s) => s.runId);
  const setRunning = useStore((s) => s.setRunning);
  const clearStatuses = useStore((s) => s.clearStatuses);
  const setNodeStatus = useStore((s) => s.setNodeStatus);
  const updateNodeData = useStore((s) => s.updateNodeData);
  const appendLog = useStore((s) => s.appendLog);
  const providers = useStore((s) => s.providers);
  const setProviders = useStore((s) => s.setProviders);
  const nodeStatus = useStore((s) => s.nodeStatus);

  const [pingResults, setPingResults] = useState<Record<string, { ok: boolean; latencyMs: number }>>({});

  // 加载 providers
  useEffect(() => {
    fetchProviders().then(setProviders).catch(() => undefined);
  }, [setProviders]);

  // 状态注入到节点 data(运行时使用)
  const nodes = useMemo(
    () =>
      wf.nodes.map((n: any) => ({
        ...n,
        draggable: mode === 'design',
        selectable: true,
        data: { ...n.data, status: nodeStatus[n.id] || n.data.status || 'idle' },
      })),
    [wf.nodes, mode, nodeStatus],
  );

  const edges = useMemo(
    () =>
      wf.edges.map((e: any) => ({
        ...e,
        animated: mode === 'runtime' && (nodeStatus[e.source] === 'success' || nodeStatus[e.source] === 'running'),
        style:
          mode === 'runtime' && nodeStatus[e.source] === 'running'
            ? { stroke: '#7DF9FF', strokeWidth: 1.6 }
            : undefined,
      })),
    [wf.edges, mode, nodeStatus],
  );

  const onClickNode: NodeMouseHandler = (_e, n) => setSelected(n.id);

  const handleRun = async () => {
    if (isRunning || wf.nodes.length === 0) return;
    clearStatuses();
    appendLog({ level: 'info', message: `▶ 启动执行 — ${wf.nodes.length} 个节点` });

    // 收集 input 节点的初始值
    const inputs: Record<string, string> = {};
    wf.nodes.forEach((n: any) => {
      if (n.data.kind === 'input' && n.data.value) inputs[n.id] = n.data.value;
    });

    try {
      const { runId: id } = await startRun(wf, inputs);
      setRunning(id);
      const unsub = subscribeRun(id, (e: RunEvent) => {
        if (e.type === 'start') {
          appendLog({ level: 'info', message: `· run ${id} started (${e.payload?.total} nodes)` });
        } else if (e.type === 'node-start') {
          setNodeStatus(e.nodeId, 'running');
          appendLog({ level: 'info', nodeId: e.nodeId, message: `→ ${e.payload?.label || e.nodeId} (${e.payload?.kind})` });
        } else if (e.type === 'token') {
          const cur = useStore.getState().workflow.nodes.find((n) => n.id === e.nodeId)?.data?.output || '';
          updateNodeData(e.nodeId, { output: cur + e.text });
          appendLog({ level: 'token', nodeId: e.nodeId, message: e.text });
        } else if (e.type === 'node-end') {
          setNodeStatus(e.nodeId, 'success');
          updateNodeData(e.nodeId, { output: e.payload?.text });
          appendLog({ level: 'info', nodeId: e.nodeId, message: `✔ 完成 (${e.payload?.text?.length || 0} chars)` });
        } else if (e.type === 'error') {
          setNodeStatus(e.nodeId || '', 'error');
          appendLog({ level: 'error', nodeId: e.nodeId, message: `✘ ${e.payload?.message}` });
        } else if (e.type === 'end') {
          appendLog({ level: 'info', message: `■ 执行结束` });
          setRunning(null);
          unsub();
        }
      });
    } catch (err) {
      appendLog({ level: 'error', message: '✘ 启动失败:后端未就绪' });
    }
  };

  const handleAbort = async () => {
    if (!runId) return;
    await abortRun(runId);
    appendLog({ level: 'warn', message: '■ 已中止' });
    setRunning(null);
  };

  const handlePing = async (id: string) => {
    const r = await pingProvider(id);
    setPingResults((p) => ({ ...p, [id]: r }));
  };

  // 拖拽添加节点
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('application/flowforge-node') as NodeData['kind'];
    if (!kind) return;
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const def = nodeDefinitions.find((d) => d.kind === kind)!;
    const id = useStore.getState().addNode(
      {
        kind: def.kind,
        label: def.label,
        ...(def.kind === 'llm' ? { provider: 'mock', model: 'mock-pro', prompt: '请基于以下输入给出简洁总结:', temperature: 0.7, maxTokens: 512 } : {}),
        ...(def.kind === 'input' ? { value: '示例输入:可在此节点直接填入文本' } : {}),
        ...(def.kind === 'tool' ? { tool: 'http.get' } : {}),
        ...(def.kind === 'condition' ? { expression: 'success' } : {}),
      },
      { x: e.clientX - bounds.left - 110, y: e.clientY - bounds.top - 30 },
    );
    setSelected(id);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="relative w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onClickNode}
        nodesDraggable={mode === 'design'}
        nodesConnectable={mode === 'design'}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(125,249,255,0.08)" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(11,15,20,0.7)"
          nodeStrokeColor="#1e2a39"
          nodeColor="#1B2330"
        />
      </ReactFlow>

      {/* 浮动工具条 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 panel-strong rounded-md flex items-center gap-1 px-1 h-9">
        <button
          className={`btn-ghost h-7 ${mode === 'design' ? 'text-signal-cyan' : ''}`}
          onClick={() => setMode('design')}
        >
          <FlaskConical className="w-3.5 h-3.5" /> 设计画布
        </button>
        <span className="w-px h-4 bg-edge mx-1" />
        <button
          className={`btn-ghost h-7 ${mode === 'runtime' ? 'text-signal-magenta' : ''}`}
          onClick={() => setMode('runtime')}
        >
          <Play className="w-3.5 h-3.5" /> 运行时
        </button>
        <span className="w-px h-4 bg-edge mx-1" />
        {!isRunning ? (
          <button className="btn-primary" onClick={handleRun} disabled={wf.nodes.length === 0}>
            <Play className="w-3.5 h-3.5" /> 运行
          </button>
        ) : (
          <button className="btn !text-signal-red !border-signal-red/40" onClick={handleAbort}>
            <Square className="w-3.5 h-3.5" /> 停止
          </button>
        )}
      </div>

      {/* 厂商快速 ping 浮窗 */}
      <div className="absolute top-3 right-3 z-10 panel rounded-md p-2 w-56">
        <div className="label mb-1.5">大模型选取</div>
        <div className="space-y-1">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePing(p.id)}
              className="w-full flex items-center justify-between text-[11px] font-mono px-2 h-7 rounded border border-edge hover:bg-ink-700/40 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    pingResults[p.id] ? (pingResults[p.id].ok ? 'bg-signal-lime' : 'bg-signal-red') : 'bg-ink-500'
                  }`}
                />
                {p.name}
              </span>
              <span className="text-text-dim">
                {pingResults[p.id] ? `${pingResults[p.id].latencyMs}ms` : '—'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 空状态 */}
      {wf.nodes.length === 0 && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-sm animate-fadeUp">
            <div className="text-[11px] font-mono text-text-dim tracking-[0.3em] mb-2">// EMPTY CANVAS</div>
            <div className="text-text-secondary text-sm">从左侧节点库拖入第一个节点,开始编排工作流</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Canvas({ mode }: Props) {
  return (
    <ReactFlowProvider>
      <CanvasInner mode={mode} />
    </ReactFlowProvider>
  );
}
