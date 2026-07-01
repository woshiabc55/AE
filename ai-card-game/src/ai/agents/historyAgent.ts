import type {
  HistoryAdvance,
  World,
  CausalHook,
  Era,
  CausalGraph,
  DirectorDirective,
  SuspenseDirective,
  NarrativeLayer,
} from "@/types";
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
  /** 悬疑叙事指令（来自 Director.orchestrateSuspense） */
  suspense?: SuspenseDirective;
}

/**
 * 历史 AI 智能体 — 多尺度历史推演 + 悬疑叙事生成。
 *
 * 本质重构：从"平淡叙述历史"升级为"生成悬疑故事"。
 *
 * 悬疑生成的核心：
 * 1. 表层叙事（surface）：玩家可见的事件描述
 * 2. 暗层叙事（hidden）：动机暗示，埋伏笔
 * 3. 隐藏层（deep）：真相，仅在揭示时显现
 *
 * 每个生成的事件可携带：
 * - narrativeLayer：标记属于哪一层
 * - foreshadows：指向未来揭示事件
 * - suspense：悬念问题
 */
export async function advanceHistory(input: HistoryAgentInput): Promise<HistoryAdvance> {
  const { world, graph, rng, directive, suspense } = input;
  const hooks: CausalHook[] = getOpenHooks(graph, 3);

  const fallback = historyFallback({
    world,
    rng,
    suspense,
  });

  const { data } = await aiService.request<HistoryAdvance>({
    task: "history_meso",
    input: {
      era: world.era,
      turn: world.turn,
      openHooks: hooks,
      directive,
      suspense,
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

/**
 * 根据悬疑指令决定事件的叙事层级。
 * - 伏笔种子 → hidden 层
 * - 揭示事件 → deep 层
 * - 普通事件 → surface 层
 */
export function resolveNarrativeLayer(
  suspense?: SuspenseDirective,
  isForeshadow = false,
  isReveal = false
): NarrativeLayer {
  if (!suspense) return "surface";
  if (isReveal) return "deep";
  if (isForeshadow) return "hidden";
  return "surface";
}
