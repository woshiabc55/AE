import type { GameContext as GCtx } from "@/game";
import type { GameEvent, EventId } from "@/types";
import { getAncestors, getDescendants, counterfactualImpact } from "@/engine/CausalGraph";

export interface CausalNodeView {
  id: EventId;
  type: string;
  turn: number;
  narrative?: string;
  source: string;
  parents: EventId[];
  children: EventId[];
}

export interface CausalView {
  nodes: CausalNodeView[];
  edges: { from: EventId; to: EventId }[];
  depth: number;
}

/** Projection — 因果图谱视图（供因果图谱界面渲染力导向图） */
export function computeCausalView(ctx: GCtx): CausalView {
  const nodes: CausalNodeView[] = [];
  const edges: { from: EventId; to: EventId }[] = [];

  for (const [id, event] of ctx.graph.nodes) {
    const parents = event.causedBy ? [event.causedBy] : [];
    const children = ctx.graph.edges.get(id) ?? [];
    nodes.push({
      id,
      type: event.type,
      turn: event.turn,
      narrative: event.narrative,
      source: event.source,
      parents,
      children: [...children],
    });
    for (const child of children) {
      edges.push({ from: id, to: child });
    }
  }

  // 按回合排序
  nodes.sort((a, b) => a.turn - b.turn);
  return { nodes, edges, depth: nodes.length === 0 ? 0 : 1 };
}

/** 反事实推演：假设移除某事件的影响范围 */
export function computeCounterfactual(ctx: GCtx, eventId: EventId): EventId[] {
  return counterfactualImpact(ctx.graph, eventId);
}

export function computeAncestors(ctx: GCtx, eventId: EventId): EventId[] {
  return getAncestors(ctx.graph, eventId);
}

export function computeDescendants(ctx: GCtx, eventId: EventId): EventId[] {
  return getDescendants(ctx.graph, eventId);
}

/** 最近 N 条事件（事件日志视图） */
export function computeEventLog(ctx: GCtx, limit = 30): GameEvent[] {
  return ctx.stateManager.allEvents().slice(-limit).reverse();
}
