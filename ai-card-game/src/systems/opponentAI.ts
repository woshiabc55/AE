import type { GameEvent, ComponentDelta } from "@/types";
import type { GameContext } from "@/game";
import { applyDelta } from "@/ecs/World";
import { getComponent } from "@/ecs/World";
import type { FactionC } from "@/types";
import { decideOpponent } from "@/ai/agents/opponentAgent";
import { director } from "./historyEngine";
import { createRng } from "@/lib/rng";
import { CommandBus } from "@/engine/CommandBus";
import { addEvent } from "@/engine/CausalGraph";

/**
 * 对手 AI 系统（opponentAI）— 效用系统 + 关键节点 LLM 介入。
 * 对手决策可解释。对手在导演约束下生成提议。
 */
export async function runOpponentTurns(ctx: GameContext): Promise<GameEvent[]> {
  const events: GameEvent[] = [];
  const directive = director.currentDirective() ?? undefined;

  for (const [entityId, comps] of ctx.world.entities) {
    const faction = comps.FactionC as FactionC | undefined;
    // 跳过玩家势力
    if (!faction || faction.isPlayer) continue;

    const rng = createRng(ctx.world.seed + ctx.world.turn * 17 + entityId.length);
    const decision = await decideOpponent({
      world: ctx.world,
      selfId: entityId,
      rng,
      directive,
    });

    const deltas: ComponentDelta[] = decision.deltas;
    const event = CommandBus.buildEvent({
      type: "COMPONENT_PATCHED",
      turn: ctx.world.turn,
      era: ctx.world.era,
      source: "ai",
      entityDeltas: deltas,
      narrative: `${faction.name}：${decision.reasoning}（行动：${decision.action}）`,
      aiTrace: {
        traceId: `opp_${entityId}_${ctx.world.turn}`,
        tier: "fast",
        tokens: 0,
        usedFallback: true,
        reasoning: decision.reasoning,
        directorDirective: directive?.theme,
      },
      metadata: { action: decision.action, faction: faction.name },
    });
    addEvent(ctx.graph, event);
    await ctx.eventStore.append(event);
    ctx.eventBus.emit(event);

    for (const delta of deltas) {
      applyDelta(ctx.world, delta);
    }
    events.push(event);
  }

  return events;
}

export { getComponent };
