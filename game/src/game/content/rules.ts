// 规则库 —— 复杂度控制的"白箱"
// 所有"如果X则Y"集中于此：硬规则裁决合法性，produce 把命令翻译为结构化 Effect
// P0 实现：出牌 / 回合 / 时代门禁 / 抽牌 四类规则

import type { Effect, EntityId, Era, Verdict } from '../types';
import type { Rule } from '../engine/RuleEngine';
import { World as WorldClass } from '../ecs/World';
import { canAdvanceTo, isEraUsable } from './eras';
import { CARD_TEMPLATES, getCard, SELF, TARGET } from './cards';

const deny = (reason: string): Verdict => ({ ok: false, reason });
const ok = (): Verdict => ({ ok: true });

// ===== 出牌规则 =====
const playCardRule: Rule = {
  id: 'play-card',
  on: 'PLAY_CARD',
  priority: 10,
  layer: 'hard',
  authorize(cmd, world) {
    const cardInstanceId = cmd.payload.cardInstanceId as EntityId;
    const targetFactionId = cmd.payload.targetFactionId as EntityId | undefined;
    if (!cardInstanceId) return deny('缺少卡牌实例');

    const card = world.getComponent(cardInstanceId, 'CardInstance');
    if (!card) return deny('卡牌不存在');

    const factionId = card.ownerFaction;
    const hand = world.getComponent(factionId, 'Hand');
    if (!hand || !hand.cardIds.includes(cardInstanceId)) return deny('该卡不在手牌中');

    const tpl = getCard(card.templateId);
    if (!tpl) return deny('卡牌模板不存在');

    // 时代门禁：卡牌须为当前时代或更早（已掌握的文明成果）
    if (!isEraUsable(tpl.era, world.meta().era)) return deny(`${tpl.name} 属于更晚时代，尚不可用`);

    // 资源校验（硬规则）
    const eco = world.getComponent(factionId, 'Economic');
    if (!eco) return deny('势力无经济组件');
    if ((tpl.cost.gold ?? 0) > eco.gold) return deny('金币不足');
    if ((tpl.cost.food ?? 0) > eco.food) return deny('粮草不足');

    // 需要目标的卡（含 TARGET 效果）必须指定目标
    const needsTarget = tpl.effects.some((e) => 'entity' in e && e.entity === TARGET);
    if (needsTarget && !targetFactionId) return deny('该卡需要指定目标势力');

    return ok();
  },
  produce(cmd, world) {
    const cardInstanceId = cmd.payload.cardInstanceId as EntityId;
    const targetFactionId = cmd.payload.targetFactionId as EntityId | undefined;
    const card = world.getComponent(cardInstanceId, 'CardInstance')!;
    const factionId = card.ownerFaction;
    const tpl = getCard(card.templateId)!;

    const effects: Effect[] = [];

    // 1. 扣除费用
    if (tpl.cost.gold) effects.push({ kind: 'MODIFY_FIELD', entity: factionId, component: 'Economic', field: 'gold', delta: -tpl.cost.gold });
    if (tpl.cost.food) effects.push({ kind: 'MODIFY_FIELD', entity: factionId, component: 'Economic', field: 'food', delta: -tpl.cost.food });

    // 2. 卡牌效果（替换 SELF/TARGET 占位为实际实体）
    for (const e of tpl.effects) {
      if ('entity' in e) {
        const resolved = e.entity === SELF ? factionId : e.entity === TARGET ? (targetFactionId as EntityId) : e.entity;
        effects.push({ ...e, entity: resolved } as Effect);
      } else {
        effects.push(e);
      }
    }

    // 3. 移出手牌
    effects.push({ kind: 'REMOVE_CARD_FROM_HAND', faction: factionId, card: cardInstanceId });

    return effects;
  },
};

// ===== 回合结束规则：推进回合 + 全势力资源产出 + 士气衰减（负反馈雏形）=====
const endTurnRule: Rule = {
  id: 'end-turn',
  on: 'END_TURN',
  priority: 20,
  layer: 'hard',
  produce(_cmd, world) {
    const effects: Effect[] = [];
    effects.push({ kind: 'ADVANCE_TURN' });
    for (const fid of world.query('Faction')) {
      // 资源产出（正反馈：发展滚雪球，需腐败制衡——P1 接反馈回路）
      effects.push({ kind: 'MODIFY_FIELD', entity: fid, component: 'Economic', field: 'gold', delta: 10 });
      effects.push({ kind: 'MODIFY_FIELD', entity: fid, component: 'Economic', field: 'food', delta: 8 });
      // 士气自然回落（平衡环）
      effects.push({ kind: 'MODIFY_FIELD', entity: fid, component: 'Military', field: 'morale', delta: -2 });
    }
    return effects;
  },
};

// ===== 时代跃迁规则（硬规则：前置 + 不可倒退）=====
const advanceEraRule: Rule = {
  id: 'advance-era',
  on: 'ADVANCE_ERA',
  priority: 30,
  layer: 'hard',
  authorize(cmd, world) {
    const target = cmd.payload.era as Era;
    if (!canAdvanceTo(world.meta().era, target)) return deny('时代前置未满足或不可倒退');
    return ok();
  },
  produce(cmd) {
    const era = cmd.payload.era as Era;
    return [
      { kind: 'ADVANCE_ERA', era },
      // 文明熵增长（不确定性锥收窄）
      { kind: 'MODIFY_FIELD', entity: 'world', component: 'WorldMeta', field: 'entropy', delta: 10 },
      { kind: 'LOG_FLAVOR', text: `历史迈入新的纪元` },
    ] as Effect[];
  },
};

// ===== 抽牌规则：从牌库抽一张当前可用卡到手牌 =====
const drawCardRule: Rule = {
  id: 'draw-card',
  on: 'DRAW_CARD',
  priority: 40,
  layer: 'hard',
  authorize(cmd, world) {
    const factionId = cmd.payload.factionId as EntityId;
    if (!world.hasComponent(factionId, 'Hand')) return deny('势力不存在');
    return ok();
  },
  produce(cmd, world) {
    const factionId = cmd.payload.factionId as EntityId;
    const era = world.meta().era;
    const pool = Object.values(CARD_TEMPLATES).filter((t) => isEraUsable(t.era, era));
    const tpl = pool[Math.floor(Math.random() * pool.length)];
    if (!tpl) return [];
    const cardId = WorldClass.entityId('card');
    return [
      { kind: 'CREATE_CARD', card: cardId, templateId: tpl.id, ownerFaction: factionId },
      { kind: 'ADD_CARD_TO_HAND', faction: factionId, card: cardId },
      { kind: 'LOG_FLAVOR', text: `抽到一张【${tpl.name}】` },
    ] as Effect[];
  },
};

export const RULES: Rule[] = [playCardRule, endTurnRule, advanceEraRule, drawCardRule];
