import type { GameEvent, EventId, CausalGraph, CausalHook } from "@/types";

/**
 * 因果图谱（Causal Graph）
 * 每个事件节点记录 causedBy（直接原因）和 enables（后续可能）。
 * AI 推演时不是无记忆生成，而是在因果图谱上做"受约束的扩展"，保证历史一致性。
 */
export function createCausalGraph(): CausalGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
  };
}

/** 添加事件节点并建立因果边 */
export function addEvent(graph: CausalGraph, event: GameEvent): void {
  graph.nodes.set(event.id, event);
  if (event.causedBy) {
    const children = graph.edges.get(event.causedBy) ?? [];
    children.push(event.id);
    graph.edges.set(event.causedBy, children);
  }
  if (!graph.edges.has(event.id)) {
    graph.edges.set(event.id, []);
  }
}

/** 获取事件的所有后续（enables） */
export function getEnabled(graph: CausalGraph, eventId: EventId): EventId[] {
  return graph.edges.get(eventId) ?? [];
}

/** 获取祖先链（causedBy 递归） */
export function getAncestors(graph: CausalGraph, eventId: EventId): EventId[] {
  const chain: EventId[] = [];
  let current = graph.nodes.get(eventId)?.causedBy;
  const guard = new Set<EventId>();
  while (current && !guard.has(current)) {
    chain.push(current);
    guard.add(current);
    current = graph.nodes.get(current)?.causedBy;
  }
  return chain;
}

/** 获取一个事件的影响范围传播（enables 递归） */
export function getDescendants(graph: CausalGraph, eventId: EventId): EventId[] {
  const result: EventId[] = [];
  const stack = [...(graph.edges.get(eventId) ?? [])];
  const seen = new Set<EventId>([eventId]);
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(id);
    stack.push(...(graph.edges.get(id) ?? []));
  }
  return result;
}

/** 提取当前可扩展的因果钩子（叶子节点 + 未闭合） */
export function getOpenHooks(graph: CausalGraph, limit = 5): CausalHook[] {
  const hooks: CausalHook[] = [];
  // 叶子节点（无 enables）是潜在的扩展点
  const leaves: EventId[] = [];
  for (const [id, children] of graph.edges) {
    if (children.length === 0) leaves.push(id);
  }
  for (const id of leaves.slice(-limit)) {
    const event = graph.nodes.get(id);
    if (event) {
      hooks.push({
        eventId: id,
        description: event.narrative ?? `${event.type} @ T${event.turn}`,
        expectedOutcome: "未闭合",
      });
    }
  }
  return hooks;
}

/** 因果深度：最长祖先链平均长度（复杂度度量） */
export function causalDepth(graph: CausalGraph): number {
  let total = 0;
  let count = 0;
  for (const id of graph.nodes.keys()) {
    total += getAncestors(graph, id).length;
    count++;
  }
  return count === 0 ? 0 : total / count;
}

/** 反事实推演：假设移除某事件，计算影响传播范围 */
export function counterfactualImpact(
  graph: CausalGraph,
  eventId: EventId
): EventId[] {
  // 移除该事件后，所有以其为祖先的事件都会受影响
  return getDescendants(graph, eventId);
}

/** 序列化（用于持久化到 IndexedDB） */
export function serializeGraph(graph: CausalGraph): string {
  return JSON.stringify({
    nodes: Array.from(graph.nodes.entries()),
    edges: Array.from(graph.edges.entries()),
  });
}

export function deserializeGraph(data: string): CausalGraph {
  const parsed = JSON.parse(data);
  return {
    nodes: new Map(parsed.nodes as [EventId, GameEvent][]),
    edges: new Map(parsed.edges as [EventId, EventId[]][]),
  };
}
