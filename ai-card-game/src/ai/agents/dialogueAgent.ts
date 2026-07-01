import type { DialogueTurn, NPCModel, EntityId } from "@/types";
import { aiService } from "../AIService";
import { DialogueTurnSchema } from "../schemas";
import { dialogueFallback } from "../fallbacks";
import type { CausalHook } from "@/types";
import type { DirectorDirective } from "@/types";

export interface DialogueAgentInput {
  npc: NPCModel;
  rng: () => number;
  causalHooks?: CausalHook[];
  directive?: DirectorDirective;
}

/**
 * 对话 AI 智能体 — 对话即博弈。
 * NPC 不是无脑应答器，而是有目标与信息不对称的博弈方。
 * 对话选项由 AI 在导演约束下生成，但必须服从 NPC 的目标与心智模型——避免 OOC。
 */
export async function generateDialogue(input: DialogueAgentInput): Promise<DialogueTurn> {
  const { npc, rng } = input;
  const fallback = dialogueFallback({
    npcName: npc.persona.name,
    npcTitle: npc.persona.title,
    archetype: npc.persona.archetype,
    rng,
  });
  const { data } = await aiService.request<DialogueTurn>({
    task: "dialogue",
    input: {
      persona: npc.persona,
      goals: npc.goals,
      theoryOfMind: npc.theoryOfMind,
      secrets: npc.secrets.map((s) => s.content),
    },
    schema: DialogueTurnSchema,
    causalContext: input.causalHooks,
    directorConstraints: input.directive,
    fallback,
    tier: "strong",
  });
  return data;
}

/** NPC 对玩家的心智模型更新（信任度调整） */
export function updateBelief(
  npc: NPCModel,
  playerId: EntityId,
  trustDelta: number
): void {
  const existing = npc.theoryOfMind[playerId] ?? { trust: 0, intent: "未知" };
  npc.theoryOfMind[playerId] = {
    ...existing,
    trust: Math.max(-100, Math.min(100, existing.trust + trustDelta)),
  };
}
