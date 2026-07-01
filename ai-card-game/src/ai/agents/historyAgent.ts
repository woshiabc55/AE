import type { HistoryAdvance, World, CausalHook, Era, CausalGraph, DirectorDirective } from "@/types";
import { ERA_ORDER } from "@/types";
import { aiService } from "../AIService";
import { HistoryAdvanceSchema } from "../schemas";
import { historyFallback } from "../fallbacks";
import { getOpenHooks } from "@/engine/CausalGraph";

export interface HistoryAgentInput {
  world: World;
  graph: CausalGraph;
  rng: () => number;
  directive?: DirectorDirective;
}

/**
 * 历史 AI 智能体 — 多尺度历史推演。
 * 宏观 Macro：时代跃迁 · 文明熵 · 世界格局（每时代一次）
 * 中观 Meso：势力消长 · 战争/结盟/科技突破（每回合）
 * 微观 Micro：具体事件（按需）
 *
 * 必然性 vs 偶然性：
 * - 必然趋势（规则强约束）：保证历史大方向可信
 * - 偶然事件（AI 自由生成）：保证每局不同
 */
export async function advanceHistory(input: HistoryAgentInput): Promise<HistoryAdvance> {
  const { world, graph, rng, directive } = input;
  const entities = Array.from(world.entities.keys());
  const hooks: CausalHook[] = getOpenHooks(graph, 3);

  const fallback = historyFallback({
    era: world.era,
    turn: world.turn,
    entities,
    rng,
  });

  const { data } = await aiService.request<HistoryAdvance>({
    task: "history_meso",
    input: {
      era: world.era,
      turn: world.turn,
      openHooks: hooks,
      directive,
    },
    schema: HistoryAdvanceSchema,
    causalContext: hooks,
    directorConstraints: directive,
    fallback,
    tier: "fast",
  });

  return data;
}

/** 时代跃迁候选评估 */
export function evaluateEraTransition(world: World): Era | null {
  const idx = ERA_ORDER.indexOf(world.era);
  if (world.turn >= 8 && idx < ERA_ORDER.length - 1) {
    return ERA_ORDER[idx + 1];
  }
  return null;
}
