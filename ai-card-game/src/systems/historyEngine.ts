import { nanoid } from "nanoid";
import type { GameEvent, ComponentDelta, EventId } from "@/types";
import type { GameContext } from "@/game";
import { applyDelta } from "@/ecs/World";
import { getComponent } from "@/ecs/World";
import type { EntropyC, Era, FactionC, CulturalC, MilitaryC } from "@/types";
import { ERA_ORDER } from "@/types";
import { Director } from "@/ai/Director";
import { advanceHistory, evaluateEraTransition } from "@/ai/agents/historyAgent";
import { createRng, chance } from "@/lib/rng";
import { CommandBus } from "@/engine/CommandBus";
import { addEvent } from "@/engine/CausalGraph";
import { computeProduction } from "@/game/economy";

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

  // 6. 经济基础产出（每回合 gold+food 产出，防止资源枯竭）
  const prodDeltas: ComponentDelta[] = [];
  for (const [entity, comps] of world.entities) {
    const faction = comps.FactionC as FactionC | undefined;
    if (!faction) continue;
    const prod = computeProduction(world, entity);
    if (prod.gold > 0 || prod.food > 0) {
      prodDeltas.push({
        entity,
        component: "EconomicC",
        patch: { gold: prod.gold, food: prod.food },
      });
    }
  }
  if (prodDeltas.length > 0) {
    const prodEvent = CommandBus.buildEvent({
      type: "TURN_ADVANCE",
      turn: world.turn,
      era: world.era,
      source: "system",
      causedBy: turnEvent.id,
      entityDeltas: prodDeltas,
      narrative: "秋收冬藏，百业流转，各邦入账。",
      metadata: { kind: "economic_production" },
    });
    for (const delta of prodEvent.entityDeltas) {
      applyDelta(world, delta);
    }
    addEvent(ctx.graph, prodEvent);
    await ctx.eventStore.append(prodEvent);
    ctx.eventBus.emit(prodEvent);
    producedEvents.push(prodEvent);
  }

  world.turn += 1;

  // 7. 文明熵差异化增长：文化/科技驱动而非纯随机
  //    基础 +1（时间流逝），文化繁荣 +1（prestige>50），科技每级 +0.5（向下取整）
  //    文化/科技先进的势力熵增更快，更早触发时代跃迁——贴合"复杂文明先转型"的历史逻辑
  for (const [entity] of world.entities) {
    const entropy = getComponent<EntropyC>(world, entity, "EntropyC");
    if (!entropy) continue;
    const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
    const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
    let growth = 1; // 基础：时间流逝
    if ((cultural?.prestige ?? 0) > 50) growth += 1; // 文化繁荣驱动
    growth += Math.floor((military?.techLevel ?? 0) * 0.5); // 科技复杂度
    if (rng() < 0.3) growth += 1; // 小幅随机扰动（非主导）
    applyDelta(world, {
      entity,
      component: "EntropyC",
      patch: { entropy: growth },
    });
  }

  // 8. 时代跃迁
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
