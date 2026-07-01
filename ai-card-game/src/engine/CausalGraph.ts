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

/** 添加事件节点并建立因果边（含因果强度计算） */
export function addEvent(graph: CausalGraph, event: GameEvent): void {
  // 若未显式指定因果强度，按事件类型与影响范围估算
  if (event.causalWeight === undefined) {
    event.causalWeight = computeCausalWeight(event);
  }
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

/** 计算因果强度：影响后续事件的潜在程度 0-1 */
function computeCausalWeight(event: GameEvent): number {
  // 大事件类型权重高（战争、变法、跃迁）
  const typeWeights: Record<string, number> = {
    ERA_TRANSITION: 1.0,
    BATTLE_RESOLVED: 0.85,
    REBELLION: 0.75,
    RULE_INJECTED: 0.7,
    TECH_BREAKTHROUGH: 0.6,
    WAR_DECLARED: 0.55,
    ALLIANCE_FORMED: 0.5,
    CARD_PLAYED: 0.4,
    DIALOGUE_RESOLVED: 0.35,
    TURN_ADVANCE: 0.2,
    NARRATIVE_SEED: 0.15,
  };
  let w = typeWeights[event.type] ?? 0.3;
  // 影响实体越多，权重越高
  const impactCount = event.entityDeltas.length;
  w += Math.min(0.2, impactCount * 0.04);
  // 悬念事件权重加成（埋伏笔的事件影响深远）
  if (event.foreshadows?.length) w += 0.15;
  return Math.min(1, w);
}

/** 获取因果边强度：从父事件到子事件的因果强度 */
export function getEdgeWeight(
  graph: CausalGraph,
  fromId: EventId,
  toId: EventId
): number {
  const child = graph.nodes.get(toId);
  return child?.causalWeight ?? 0.3;
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

/** 获取所有未揭示的悬念（悬疑叙事核心查询） */
export function getUnresolvedSuspense(graph: CausalGraph): GameEvent[] {
  const result: GameEvent[] = [];
  for (const event of graph.nodes.values()) {
    if (event.suspense && !event.suspense.revealed) {
      result.push(event);
    }
  }
  return result;
}

/** 获取已到揭示时机的悬念（应在当前回合揭示） */
export function getDueSuspense(graph: CausalGraph, currentTurn: number): GameEvent[] {
  return getUnresolvedSuspense(graph).filter((e) => {
    const revealBy = e.suspense?.revealByTurn;
    return revealBy !== undefined && currentTurn >= revealBy;
  });
}

/** 标记某悬念已揭示，并建立揭示因果链 */
export function markRevealed(graph: CausalGraph, suspenseEventId: EventId, revealEventId: EventId): void {
  const event = graph.nodes.get(suspenseEventId);
  if (event) {
    if (event.suspense) {
      event.suspense.revealed = true;
    }
    event.foreshadows = [...(event.foreshadows ?? []), revealEventId];
  }
  const revealEvent = graph.nodes.get(revealEventId);
  if (revealEvent) {
    revealEvent.reveals = [...(revealEvent.reveals ?? []), suspenseEventId];
  }
}

/** 获取某事件的伏笔链：所有它埋下且已揭示的伏笔对 */
export function getForeshadowChain(graph: CausalGraph, eventId: EventId): { seed: EventId; revealed: EventId }[] {
  const event = graph.nodes.get(eventId);
  if (!event?.foreshadows) return [];
  return event.foreshadows.map((revealedId) => ({ seed: eventId, revealed: revealedId }));
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
