// CQRS 读模型：从 World 投影出 UI 需要的视图快照
// 投影是纯函数、只读、可缓存。UI 只订阅投影，不直接接触 World/engine。
import type { EntityId, Era } from '../types';
import type { World } from '../ecs/World';
import { ERAS } from '../content/eras';
import { getCard } from '../content/cards';
import { isEraUsable } from '../content/eras';

export interface FactionView {
  id: EntityId;
  name: string;
  color: string;
  isPlayer: boolean;
  gold: number;
  food: number;
  troops: number;
  morale: number;
  prestige: number;
  handCount: number;
}

export interface CardView {
  instanceId: EntityId;
  templateId: string;
  name: string;
  type: string;
  era: Era;
  cost: { gold?: number; food?: number };
  flavor?: string;
  historicalRef?: string;
  needsTarget: boolean;
  playable: boolean; // 资源够且时代可用
  playBlockedReason?: string;
}

export interface GameView {
  turn: number;
  era: Era;
  eraName: string;
  entropy: number;
  playerFactionId: EntityId;
  factions: FactionView[];
  hand: CardView[];
  /** 时代跃迁是否可用 + 下一时代 */
  nextEra?: { era: Era; name: string };
}

/** 投影整个游戏视图（store 每次 dispatch 后调用） */
export function projectGame(world: World, playerFactionId: EntityId): GameView {
  const meta = world.meta();
  const factions: FactionView[] = world.query('Faction').map((id) => {
    const f = world.getComponent(id, 'Faction')!;
    const eco = world.getComponent(id, 'Economic')!;
    const mil = world.getComponent(id, 'Military')!;
    const cul = world.getComponent(id, 'Cultural')!;
    const hand = world.getComponent(id, 'Hand')!;
    return {
      id,
      name: f.name,
      color: f.color,
      isPlayer: f.isPlayer,
      gold: eco.gold,
      food: eco.food,
      troops: mil.troops,
      morale: mil.morale,
      prestige: cul.prestige,
      handCount: hand.cardIds.length,
    };
  });

  // 玩家手牌详情 + 可出牌判定（投影里预算 playable，UI 直接渲染）
  const playerEco = world.getComponent(playerFactionId, 'Economic')!;
  const playerHand = world.getComponent(playerFactionId, 'Hand')!;
  const hand: CardView[] = playerHand.cardIds.map((cid) => {
    const inst = world.getComponent(cid, 'CardInstance')!;
    const tpl = getCard(inst.templateId)!;
    const eraOk = isEraUsable(tpl.era, meta.era);
    const goldOk = (tpl.cost.gold ?? 0) <= playerEco.gold;
    const foodOk = (tpl.cost.food ?? 0) <= playerEco.food;
    const needsTarget = tpl.effects.some((e) => 'entity' in e && (e.entity as string) === 'TARGET');
    let playBlockedReason: string | undefined;
    if (!eraOk) playBlockedReason = '时代未到';
    else if (!goldOk) playBlockedReason = '金币不足';
    else if (!foodOk) playBlockedReason = '粮草不足';
    return {
      instanceId: cid,
      templateId: tpl.id,
      name: tpl.name,
      type: tpl.type,
      era: tpl.era,
      cost: tpl.cost,
      flavor: tpl.flavor,
      historicalRef: tpl.historicalRef,
      needsTarget,
      playable: eraOk && goldOk && foodOk,
      playBlockedReason,
    };
  });

  // 下一时代（不确定性锥）
  const nextEraOrder = ERAS[meta.era].order + 1;
  const nextEraDef = Object.values(ERAS).find((e) => e.order === nextEraOrder);

  return {
    turn: meta.turn,
    era: meta.era,
    eraName: ERAS[meta.era].name,
    entropy: meta.entropy,
    playerFactionId,
    factions,
    hand,
    nextEra: nextEraDef ? { era: nextEraDef.id, name: nextEraDef.name } : undefined,
  };
}
