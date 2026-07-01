import { nanoid } from "nanoid";
import type { GameEvent, NPCModel, EntityId, DialogueTurn } from "@/types";
import type { GameContext } from "@/game";
import { generateDialogue, updateBelief } from "@/ai/agents/dialogueAgent";
import { director } from "./historyEngine";
import { createRng } from "@/lib/rng";
import { CommandBus } from "@/engine/CommandBus";
import { addEvent } from "@/engine/CausalGraph";

const npcStore = new Map<EntityId, NPCModel>();

/**
 * 对话系统（dialogueSystem）— 对话即博弈。
 * NPC 有目标与信息不对称，对话选项由 AI 在导演约束下生成。
 * 每次对话选择都是一次微小博弈，影响关系与信息。
 */
export function registerNPC(npc: NPCModel): void {
  npcStore.set(npc.id, npc);
}

export function getNPC(id: EntityId): NPCModel | undefined {
  return npcStore.get(id);
}

export async function startDialogue(
  ctx: GameContext,
  npcId: EntityId
): Promise<DialogueTurn> {
  const npc = npcStore.get(npcId);
  if (!npc) throw new Error(`NPC ${npcId} 未注册`);
  const rng = createRng(ctx.world.seed + ctx.world.turn * 31 + npcId.length);
  const directive = director.currentDirective() ?? undefined;
  const turn = await generateDialogue({ npc, rng, directive });
  return turn;
}

/** 处理玩家选择的对话选项 → 更新心智模型 + 产出事件 */
export async function chooseDialogueOption(
  ctx: GameContext,
  npcId: EntityId,
  optionId: string,
  turn: DialogueTurn
): Promise<{ event: GameEvent; nextTurn?: DialogueTurn }> {
  const npc = npcStore.get(npcId);
  if (!npc) throw new Error(`NPC ${npcId} 未注册`);
  const option = turn.options?.find((o) => o.id === optionId);

  // 更新心智模型（信任度根据选项调整）
  let trustDelta = 0;
  if (option?.text.includes("合作") || option?.text.includes("陈述")) trustDelta = 5;
  if (option?.text.includes("施压") || option?.text.includes("暗示")) trustDelta = -8;
  if (option?.text.includes("沉默")) trustDelta = -2;
  if (ctx.playerEntity) {
    updateBelief(npc, ctx.playerEntity, trustDelta);
  }

  const event = CommandBus.buildEvent({
    type: "DIALOGUE_CHOICE",
    turn: ctx.world.turn,
    era: ctx.world.era,
    source: "player",
    entityDeltas: [],
    narrative: `与 ${npc.persona.name} 对话：${option?.text ?? ""}（${npc.persona.name}信任度${trustDelta > 0 ? "上升" : trustDelta < 0 ? "下降" : "不变"}）`,
    metadata: {
      npcId,
      optionId,
      trustDelta,
      asymmetricInfo: option?.asymmetricInfo,
    },
  });
  addEvent(ctx.graph, event);
  await ctx.eventStore.append(event);
  ctx.eventBus.emit(event);

  // 生成下一轮对话
  const rng = createRng(ctx.world.seed + ctx.world.turn * 31 + optionId.length);
  const directive = director.currentDirective() ?? undefined;
  const nextTurn = await generateDialogue({ npc, rng, directive });

  return { event, nextTurn };
}

export type { DialogueTurn };
