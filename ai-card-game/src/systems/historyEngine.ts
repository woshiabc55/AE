import { nanoid } from "nanoid";
import type { GameEvent, ComponentDelta, EventId } from "@/types";
import type { GameContext } from "@/game";
import { applyDelta } from "@/ecs/World";
import { getComponent } from "@/ecs/World";
import type { EntropyC, Era } from "@/types";
import { ERA_ORDER } from "@/types";
import { Director } from "@/ai/Director";
import { advanceHistory, evaluateEraTransition } from "@/ai/agents/historyAgent";
import { createRng, chance } from "@/lib/rng";
import { CommandBus } from "@/engine/CommandBus";
import { addEvent } from "@/engine/CausalGraph";

const director = new Director();

/**
 * 历史推演引擎（historyEngine）— 多尺度历史推演。
 * 这是 AI 与 engine 的交汇点之一：
 * 1. Director AI 下达剧本约束
 * 2. 历史 AI 在约束下生成提议（必然趋势 + 偶然事件）
 * 3. 偶然事件按概率封装为事件 → 规则引擎校验 → 持久化 → 应用到世界
 * 4. 检查时代跃迁
 */
export async function advanceTurn(ctx: GameContext): Promise<GameEvent[]> {
  const { world } = ctx;
  const rng = createRng(world.seed + world.turn * 7919);

  // 1. Director 下达剧本约束
  const directive = await director.direct({ turn: world.turn, rng });

  // 2. 历史 AI 生成提议
  const advance = await advanceHistory({ world, graph: ctx.graph, rng, directive });

  const producedEvents: GameEvent[] = [];
  const causedByRoot: EventId | undefined = undefined;

  // 3. 回合推进事件
  const turnEvent = CommandBus.buildEvent({
    type: "TURN_ADVANCE",
    turn: world.turn,
    era: world.era,
    source: "system",
    causedBy: causedByRoot,
    entityDeltas: [],
    narrative: advance.narrativeSeed,
    metadata: { directive: directive.theme, pacing: directive.pacing },
  });
  producedEvents.push(turnEvent);

  // 4. 偶然事件按概率触发
  for (const con of advance.meso.contingencies) {
    if (!chance(rng, con.probability)) continue;
    const event = CommandBus.buildEvent({
      type: con.type as GameEvent["type"],
      turn: world.turn,
      era: world.era,
      source: "ai",
      causedBy: turnEvent.id,
      entityDeltas: con.deltas,
      narrative: con.description,
      aiTrace: {
        traceId: nanoid(8),
        tier: "fast",
        tokens: 0,
        usedFallback: true,
        directorDirective: directive.theme,
      },
    });
    producedEvents.push(event);
  }

  // 5. 应用事件到世界（直接应用，因为是系统事件；玩家命令走 commandBus）
  for (const event of producedEvents) {
    for (const delta of event.entityDeltas) {
      applyDelta(world, delta);
    }
    // 接入因果图 + 持久化 + 广播
    addEvent(ctx.graph, event);
    await ctx.eventStore.append(event);
    ctx.eventBus.emit(event);
  }

  world.turn += 1;

  // 6. 文明熵自然增长
  for (const [entity] of world.entities) {
    const entropy = getComponent<EntropyC>(world, entity, "EntropyC");
    if (entropy) {
      applyDelta(world, {
        entity,
        component: "EntropyC",
        patch: { entropy: entropy.entropy + 1 + Math.floor(rng() * 3) },
      });
    }
  }

  // 7. 时代跃迁
  const nextEra = evaluateEraTransition(world);
  if (nextEra) {
    const idx = ERA_ORDER.indexOf(world.era);
    const threshold = [30, 60, 85, 100][idx];
    const playerEntropy = ctx.playerEntity
      ? getComponent<EntropyC>(world, ctx.playerEntity, "EntropyC")
      : undefined;
    if ((playerEntropy?.entropy ?? 0) >= threshold) {
      world.era = nextEra as Era;
      const eraEvent = CommandBus.buildEvent({
        type: "ERA_TRANSITION",
        turn: world.turn,
        era: world.era,
        source: "system",
        causedBy: turnEvent.id,
        entityDeltas: [],
        narrative: `时代跃迁：进入${nextEra}。`,
      });
      addEvent(ctx.graph, eraEvent);
      await ctx.eventStore.append(eraEvent);
      ctx.eventBus.emit(eraEvent);
      producedEvents.push(eraEvent);
    }
  }

  ctx.stateManager.record(producedEvents);
  if (world.turn % 5 === 0) ctx.stateManager.takeSnapshot(world);

  return producedEvents;
}

export { director };
export type { ComponentDelta };
