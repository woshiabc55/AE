import { nanoid } from "nanoid";
import type { GameCommand, GameEvent, CardTemplate, ComponentDelta } from "@/types";
import type { GameContext } from "@/game";
import { getComponent, setComponent, applyDelta } from "@/ecs/World";
import { CARD_BY_ID } from "@/game/cards";
import type { EconomicC, HandC, CulturalC } from "@/types";
import { CommandBus } from "@/engine/CommandBus";
import { addEvent } from "@/engine/CausalGraph";

/**
 * 卡牌系统（cardSystem）— 出牌即历史命题的可玩化。
 * 出牌流程：构造命令 → CommandBus 派发 → 规则引擎三重校验 → 产出事件 → 应用效果。
 * 卡牌效果触发"命令→事件→规则→状态变更→UI 投影"全链路。
 */
export async function playCard(
  ctx: GameContext,
  cardId: string,
  targetEntity?: string
): Promise<{ accepted: boolean; reason: string; events: GameEvent[] }> {
  const card = CARD_BY_ID.get(cardId);
  if (!card) {
    return { accepted: false, reason: "卡牌不存在。", events: [] };
  }

  const actor = ctx.playerEntity;
  if (!actor) {
    return { accepted: false, reason: "无玩家实体。", events: [] };
  }

  // 检查手牌
  const hand = getComponent<HandC>(ctx.world, actor, "HandC");
  if (hand && !hand.cards.includes(cardId)) {
    return { accepted: false, reason: "该卡牌不在手中。", events: [] };
  }

  // 扣除资源
  const economic = getComponent<EconomicC>(ctx.world, actor, "EconomicC");
  const cultural = getComponent<CulturalC>(ctx.world, actor, "CulturalC");
  if (card.cost.gold && (economic?.gold ?? 0) < card.cost.gold) {
    return { accepted: false, reason: "黄金不足。", events: [] };
  }
  if (card.cost.prestige && (cultural?.prestige ?? 0) < card.cost.prestige) {
    return { accepted: false, reason: "威望不足。", events: [] };
  }

  const cmd: GameCommand = {
    id: `cmd_${nanoid(10)}`,
    type: "PLAY_CARD",
    actor,
    turn: ctx.world.turn,
    payload: { cardId, target: targetEntity },
  };

  // 通过 CommandBus 派发：规则引擎三重校验 → 产出事件
  const result = await ctx.commandBus.dispatch(cmd, ctx.world, (c, degradedDeltas) => {
    const deltas: ComponentDelta[] = [];

    // 资源消耗
    if (card.cost.gold) {
      deltas.push({
        entity: actor,
        component: "EconomicC",
        patch: { gold: -(card.cost.gold) },
      });
    }
    if (card.cost.prestige) {
      deltas.push({
        entity: actor,
        component: "CulturalC",
        patch: { prestige: -(card.cost.prestige) },
      });
    }
    if (card.cost.food) {
      deltas.push({
        entity: actor,
        component: "EconomicC",
        patch: { food: -(card.cost.food) },
      });
    }

    // 卡牌效果（修改组件）
    for (const effect of card.effects) {
      if (effect.kind === "modify_component" && effect.component && effect.patch) {
        const target = effect.target ?? targetEntity ?? actor;
        deltas.push({
          entity: target,
          component: effect.component,
          patch: effect.patch,
        });
      }
    }

    // 应用降级修正
    deltas.push(...degradedDeltas);

    // 移除手牌
    if (hand) {
      const newCards = hand.cards.filter((c) => c !== cardId);
      deltas.push({ entity: actor, component: "HandC", patch: { cards: newCards } });
    }

    const event: GameEvent = CommandBus.buildEvent({
      type: "CARD_PLAYED",
      turn: c.turn,
      era: ctx.world.era,
      source: "player",
      causedBy: c.causedBy,
      entityDeltas: deltas,
      narrative: `${actor} 打出【${card.name}】。${card.flavor ?? ""}`,
      metadata: { cardId: card.id, cardType: card.type },
    });
    return [event];
  });

  // 应用事件到世界（commandBus 已持久化+广播，这里更新内存世界）
  if (result.accepted) {
    for (const event of result.events) {
      for (const delta of event.entityDeltas) {
        applyDelta(ctx.world, delta);
      }
    }
  }

  return {
    accepted: result.accepted,
    reason: result.reason,
    events: result.events,
  };
}

/** 抽牌（从时代牌池补手牌） */
export async function drawCard(ctx: GameContext, count = 1): Promise<GameEvent[]> {
  const actor = ctx.playerEntity;
  if (!actor) return [];
  const events: GameEvent[] = [];
  const hand = getComponent<HandC>(ctx.world, actor, "HandC");
  const pool = Array.from(CARD_BY_ID.values()).filter((c) => c.era === ctx.world.era);
  if (pool.length === 0) return events;

  const currentCards = [...(hand?.cards ?? [])];
  for (let i = 0; i < count; i++) {
    const drawn = pool[Math.floor(Math.random() * pool.length)];
    currentCards.push(drawn.id);
    const event = CommandBus.buildEvent({
      type: "CARD_DRAWN",
      turn: ctx.world.turn,
      era: ctx.world.era,
      source: "system",
      entityDeltas: [{ entity: actor, component: "HandC", patch: { cards: currentCards.slice() } }],
      narrative: `抽到【${drawn.name}】。`,
      metadata: { cardId: drawn.id },
    });
    events.push(event);
    setComponent(ctx.world, actor, "HandC", { cards: currentCards.slice() });
    addEvent(ctx.graph, event);
    await ctx.eventStore.append(event);
    ctx.eventBus.emit(event);
  }
  return events;
}

export type { CardTemplate };
