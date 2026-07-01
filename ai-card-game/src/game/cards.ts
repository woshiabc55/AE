import type { CardTemplate } from "@/types";

/**
 * 卡牌模板 — 卡牌即历史命题。
 * 卡牌随时代演化，形成演化谱系：
 *   [青铜剑] → [铁剑] → [钢剑] → [火绳枪] → [步枪]
 * 卡牌之间有语义关系（克制/协同/演化/对立），构成图谱。
 * 每张卡有 historicalRef（对应的历史原型）。
 */
export const CARD_TEMPLATES: CardTemplate[] = [
  // ===== 远古纪元 =====
  {
    id: "bronze_sword",
    name: "青铜剑",
    type: "military",
    era: "ancient",
    cost: { gold: 10 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { troops: 5 } }],
    evolvesFrom: undefined,
    semanticEdges: [
      { to: "iron_sword", relation: "evolve" },
      { to: "bronze_rite_vessel", relation: "synergy" },
    ],
    historicalRef: "商周青铜兵器，标志着青铜冶铸技术的成熟。",
    flavor: "青光凛冽，铸造一个时代的杀伐。",
  },
  {
    id: "clan_gathering",
    name: "部族集结",
    type: "military",
    era: "ancient",
    cost: { food: 10 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { troops: 8, morale: 5 } }],
    semanticEdges: [{ to: "harvest_rite", relation: "synergy" }],
    historicalRef: "早期部族按血缘集结兵力的方式。",
    flavor: "同宗同源，举族为兵。",
  },
  {
    id: "harvest_rite",
    name: "丰收祭祀",
    type: "cultural",
    era: "ancient",
    cost: { gold: 5 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 8 } },
      { kind: "modify_component", component: "EconomicC", patch: { food: 15 } },
    ],
    semanticEdges: [{ to: "philosophy", relation: "evolve" }],
    historicalRef: "先民对自然力的崇拜与感恩，维系部族凝聚力。",
    flavor: "钟鼓喤喤，馨香上达。",
  },
  {
    id: "bronze_rite_vessel",
    name: "青铜礼器",
    type: "cultural",
    era: "ancient",
    cost: { gold: 15 },
    effects: [{ kind: "modify_component", component: "CulturalC", patch: { prestige: 12 } }],
    evolvesFrom: undefined,
    semanticEdges: [{ to: "bronze_sword", relation: "synergy" }],
    historicalRef: "鼎簋之器，礼乐文明的物化象征。",
    flavor: "问鼎轻重，可知天命所归？",
  },

  // ===== 古典纪元（青铜→铁的演化分支） =====
  {
    id: "iron_sword",
    name: "铁剑",
    type: "military",
    era: "classical",
    cost: { gold: 18 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { troops: 10, techLevel: 1 } }],
    evolvesFrom: "bronze_sword",
    semanticEdges: [
      { to: "steel_sword", relation: "evolve" },
      { to: "bronze_sword", relation: "counter" },
    ],
    historicalRef: "铁器普及改变了战争形态与生产效率。",
    flavor: "锻铁为兵，列国争锋自此更烈。",
  },
  {
    id: "trade_caravan",
    name: "商队通衢",
    type: "economic",
    era: "classical",
    cost: { gold: 12 },
    effects: [{ kind: "modify_component", component: "EconomicC", patch: { gold: 30 } }],
    semanticEdges: [{ to: "philosophy", relation: "synergy" }],
    historicalRef: "丝绸之路与东海盐铁之利，催生商业阶层。",
    flavor: "驼铃叮当，连通东西方的血脉。",
  },
  {
    id: "philosophy",
    name: "百家争鸣",
    type: "cultural",
    era: "classical",
    cost: { gold: 20 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 20 } },
      { kind: "modify_component", component: "EntropyC", patch: { entropy: 8 } },
    ],
    evolvesFrom: "harvest_rite",
    semanticEdges: [{ to: "harvest_rite", relation: "evolve" }],
    historicalRef: "轴心时代，儒墨道法诸子并起。",
    flavor: "诸子百家，各执一端而天下理。",
  },

  // ===== 中世纪 =====
  {
    id: "steel_sword",
    name: "钢剑",
    type: "military",
    era: "medieval",
    cost: { gold: 30 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { troops: 15, techLevel: 1 } }],
    evolvesFrom: "iron_sword",
    semanticEdges: [{ to: "matchlock", relation: "evolve" }],
    historicalRef: "百炼钢技术，冷兵器的巅峰。",
    flavor: "百炼成钢，吹毛断发。",
  },
  {
    id: "castle",
    name: "筑城设防",
    type: "military",
    era: "medieval",
    cost: { gold: 40, food: 20 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { morale: 15 } }],
    semanticEdges: [{ to: "crusade", relation: "oppose" }],
    historicalRef: "封建时代城堡与坞堡的防御体系。",
    flavor: "高墙深堑，据险以守。",
  },
  {
    id: "crusade",
    name: "圣战号召",
    type: "event",
    era: "medieval",
    cost: { prestige: 15 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 12, morale: 10 } },
      { kind: "modify_component", component: "EconomicC", patch: { gold: -10 } },
    ],
    semanticEdges: [{ to: "castle", relation: "oppose" }],
    historicalRef: "宗教战争动员了跨地域的力量。",
    flavor: "以神之名，举兵远征。",
  },

  // ===== 近代纪元 =====
  {
    id: "matchlock",
    name: "火绳枪",
    type: "military",
    era: "modern",
    cost: { gold: 50 },
    effects: [{ kind: "modify_component", component: "MilitaryC", patch: { troops: 20, techLevel: 2 } }],
    evolvesFrom: "steel_sword",
    semanticEdges: [{ to: "steel_sword", relation: "counter" }],
    historicalRef: "火器普及终结了冷兵器时代。",
    flavor: "铅丸与硝烟，终结旧日的荣光。",
  },
  {
    id: "printing_press",
    name: "活字印刷",
    type: "cultural",
    era: "modern",
    cost: { gold: 35 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 25 } },
      { kind: "modify_component", component: "EntropyC", patch: { entropy: 15 } },
    ],
    evolvesFrom: "philosophy",
    semanticEdges: [{ to: "philosophy", relation: "evolve" }],
    historicalRef: "知识传播的民主化，引爆思想革命。",
    flavor: "字模排布，撼动千年的权威。",
  },
  {
    id: "revolution",
    name: "革命风暴",
    type: "event",
    era: "modern",
    cost: { prestige: 30 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { morale: 20 } },
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 15 } },
      { kind: "shift_entropy" },
    ],
    semanticEdges: [{ to: "printing_press", relation: "synergy" }],
    historicalRef: "社会结构的剧变，旧秩序瓦解。",
    flavor: "自由、平等，掀翻一切冠冕。",
  },
];

/** 卡牌索引 */
export const CARD_BY_ID = new Map(CARD_TEMPLATES.map((c) => [c.id, c]));

/** 获取某时代的卡牌 */
export function cardsByEra(era: import("@/types").Era): CardTemplate[] {
  return CARD_TEMPLATES.filter((c) => c.era === era);
}

/** 获取演化谱系（祖先链） */
export function evolutionChain(cardId: string): CardTemplate[] {
  const chain: CardTemplate[] = [];
  let current = CARD_BY_ID.get(cardId);
  while (current) {
    chain.unshift(current);
    current = current.evolvesFrom ? CARD_BY_ID.get(current.evolvesFrom) : undefined;
  }
  return chain;
}
