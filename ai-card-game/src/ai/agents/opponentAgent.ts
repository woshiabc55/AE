import type { World, EntityId, ComponentDelta } from "@/types";
import { aiService } from "../AIService";
import { opponentFallback } from "../fallbacks";
import type { CausalHook } from "@/types";
import type { DirectorDirective } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC } from "@/types";

export interface OpponentInput {
  world: World;
  selfId: EntityId;
  rng: () => number;
  causalHooks?: CausalHook[];
  directive?: DirectorDirective;
}

export interface OpponentDecision {
  action: string;
  reasoning: string;
  deltas: ComponentDelta[];
}

/**
 * 对手 AI 智能体 — 效用系统 + 关键节点 LLM 介入。
 * 对手决策可解释。
 */
export async function decideOpponent(input: OpponentInput): Promise<OpponentDecision> {
  const { world, selfId, rng } = input;
  const military = getComponent<MilitaryC>(world, selfId, "MilitaryC");
  const economic = getComponent<EconomicC>(world, selfId, "EconomicC");

  const fb = opponentFallback({ selfId, rng });

  // 根据状态细化决策与影响
  let deltas: ComponentDelta[] = [];
  if (fb.action === "EXPAND") {
    const cost = Math.min(5, military?.troops ?? 0);
    deltas = [
      { entity: selfId, component: "MilitaryC", patch: { troops: -cost } },
      { entity: selfId, component: "EconomicC", patch: { food: -10 } },
    ];
  } else if (fb.action === "FORTIFY") {
    deltas = [{ entity: selfId, component: "MilitaryC", patch: { morale: 5 } }];
  } else if (fb.action === "RAID") {
    deltas = [{ entity: selfId, component: "EconomicC", patch: { gold: 10 } }];
  } else {
    deltas = [{ entity: selfId, component: "CulturalC", patch: { prestige: 3 } }];
  }

  return {
    action: fb.action,
    reasoning: fb.reasoning,
    deltas,
  };
}
