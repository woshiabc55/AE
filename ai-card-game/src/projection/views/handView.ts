import type { CardTemplate } from "@/types";
import type { GameContext as GCtx } from "@/game";
import { getComponent } from "@/ecs/World";
import type { HandC } from "@/types";
import { CARD_BY_ID } from "@/game/cards";

export interface HandView {
  cards: CardTemplate[];
  count: number;
}

/**
 * Projection（读模型）— 手牌视图。
 * UI 需要的视图由事件投影重算，可缓存、可版本化。读写分离让复杂 UI 不阻塞核心循环。
 * Projection 只读，不触发命令。
 */
export function computeHandView(ctx: GCtx): HandView {
  const actor = ctx.playerEntity;
  if (!actor) return { cards: [], count: 0 };
  const hand = getComponent<HandC>(ctx.world, actor, "HandC");
  const cards = (hand?.cards ?? [])
    .map((id) => CARD_BY_ID.get(id))
    .filter((c): c is CardTemplate => Boolean(c));
  return { cards, count: cards.length };
}
