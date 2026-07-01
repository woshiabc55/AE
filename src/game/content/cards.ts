// 基础卡牌池（P0 静态内容；P3 起由 AI 在规则区间内生成，演化树 + 语义网络）
// 卡牌即"历史命题的可玩化封装"——每张卡是某历史情境的可玩化产物
import type { CardTemplate } from '../types';

// 卡牌效果中的 entity 占位符：产出时由规则替换为实际实体
//   'SELF'   → 出牌方势力
//   'TARGET' → payload.targetFactionId（劫掠/外交类卡用）
export const SELF = 'SELF';
export const TARGET = 'TARGET';

export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  militia: {
    id: 'militia',
    name: '民兵',
    type: 'unit',
    era: 'stone',
    cost: { food: 3 },
    effects: [{ kind: 'MODIFY_FIELD', entity: SELF, component: 'Military', field: 'troops', delta: 5 }],
    flavor: '召集部落青壮，守土安民。',
    historicalRef: '氏族社会的武装化',
  },
  farm: {
    id: 'farm',
    name: '农田',
    type: 'building',
    era: 'stone',
    cost: { gold: 8 },
    effects: [{ kind: 'MODIFY_FIELD', entity: SELF, component: 'Economic', field: 'food', delta: 15 }],
    flavor: '刀耕火种，定居的开端。',
    historicalRef: '农业革命',
  },
  raid: {
    id: 'raid',
    name: '劫掠',
    type: 'action',
    era: 'stone',
    cost: { food: 4 },
    effects: [
      { kind: 'MODIFY_FIELD', entity: TARGET, component: 'Military', field: 'troops', delta: -6 },
      { kind: 'MODIFY_FIELD', entity: SELF, component: 'Economic', field: 'gold', delta: 12 },
      { kind: 'LOG_FLAVOR', text: '劫掠得手，敌军溃散，掠得财物。' },
    ],
    flavor: '袭击邻族，以战养战。',
    historicalRef: '部落冲突',
  },
  shrine: {
    id: 'shrine',
    name: '神庙',
    type: 'building',
    era: 'bronze',
    cost: { gold: 20 },
    effects: [
      { kind: 'MODIFY_FIELD', entity: SELF, component: 'Cultural', field: 'prestige', delta: 12 },
      { kind: 'MODIFY_FIELD', entity: SELF, component: 'Military', field: 'morale', delta: 8 },
    ],
    flavor: '敬天法祖，凝聚人心。',
    historicalRef: '神权政治',
  },
  trade: {
    id: 'trade',
    name: '商队',
    type: 'policy',
    era: 'iron',
    cost: { gold: 15 },
    effects: [{ kind: 'MODIFY_FIELD', entity: SELF, component: 'Economic', field: 'gold', delta: 40 }],
    flavor: '通商四方，财货流转。',
    historicalRef: '丝绸之路雏形',
  },
  legion: {
    id: 'legion',
    name: '军团',
    type: 'unit',
    era: 'iron',
    cost: { gold: 25, food: 10 },
    effects: [
      { kind: 'MODIFY_FIELD', entity: SELF, component: 'Military', field: 'troops', delta: 15 },
      { kind: 'MODIFY_FIELD', entity: SELF, component: 'Military', field: 'morale', delta: 10 },
    ],
    flavor: '纪律与铁器，帝国之锋。',
    historicalRef: '罗马军团',
  },
};

export function getCard(id: string): CardTemplate | undefined {
  return CARD_TEMPLATES[id];
}
