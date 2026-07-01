// 世界初始化：创建势力、初始资源、初始手牌
// 这是 P0 的"新对局"入口。所有初始实体经此创建，初始状态可被快照/重放复现。

import type { EntityId } from '../types';
import { World } from '../ecs/World';
import { CARD_TEMPLATES } from './cards';

export interface BootstrapResult {
  world: World;
  playerFactionId: EntityId;
  aiFactionId: EntityId;
}

function createFaction(
  world: World,
  id: EntityId,
  data: { name: string; color: string; isPlayer: boolean },
  eco: { gold: number; food: number },
  military: { troops: number; morale: number },
): EntityId {
  world.createEntity(id);
  world.addComponent(id, 'Faction', { name: data.name, color: data.color, isPlayer: data.isPlayer });
  world.addComponent(id, 'Economic', { ...eco });
  world.addComponent(id, 'Military', { ...military });
  world.addComponent(id, 'Cultural', { prestige: 0 });
  world.addComponent(id, 'Territory', { provinces: [] });
  world.addComponent(id, 'Hand', { cardIds: [] });
  return id;
}

/** 初始化一个新对局世界：玩家部落 vs 敌对部落（石器时代开局） */
export function bootstrapWorld(): BootstrapResult {
  const world = new World();
  // 时代已由 World 构造函数设为 stone

  const playerFactionId = createFaction(
    world,
    'faction_player',
    { name: '我的部落', color: '#ff6b35', isPlayer: true },
    { gold: 30, food: 25 },
    { troops: 12, morale: 70 },
  );
  const aiFactionId = createFaction(
    world,
    'faction_ai',
    { name: '蛮族', color: '#6b8cff', isPlayer: false },
    { gold: 30, food: 25 },
    { troops: 12, morale: 70 },
  );

  // 初始手牌：双方各发 3 张石器时代可用卡
  const starterTemplateIds = ['militia', 'farm', 'raid'];
  for (const tid of starterTemplateIds) {
    const tpl = CARD_TEMPLATES[tid];
    for (const fid of [playerFactionId, aiFactionId]) {
      const cardId = World.entityId('card');
      world.createEntity(cardId);
      world.addComponent(cardId, 'CardInstance', { templateId: tpl.id, ownerFaction: fid });
      const hand = world.getComponent(fid, 'Hand')!;
      hand.cardIds.push(cardId);
    }
  }

  return { world, playerFactionId, aiFactionId };
}
