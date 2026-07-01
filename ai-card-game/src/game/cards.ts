import type { CardTemplate, Era } from "@/types";

/**
 * 卡牌库 — 卡牌即历史命题。
 *
 * 考究：演化谱系对齐中国冶铸史与社会制度史，每张卡有真实历史原型。
 *   军事链：青铜剑→铁剑→钢剑→火绳枪（冶铸技术演进）
 *   经济链：井田→初税亩/商鞅→均田/丝路→一条鞭法（土地制度演进）
 *   文化链：礼器→百家/稷下→科举/佛法→印刷/西学（知识形态演进）
 *   事件卡：长平之战、合纵连横、焚书坑儒等历史转折点
 *
 * 强度曲线：封建+5~8 / 变法+10~15 / 帝国+15~25 / 变革+20~30（随时代递增）
 * 演化关系：evolvesFrom 指向直接前代，semanticEdges 标注克制/协同/对立
 */
export const CARD_TEMPLATES: CardTemplate[] = [
  // ============ 封建纪元（西周—春秋）============
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
    historicalRef: "商周青铜兵器，青铜冶铸成熟期的产物，礼乐与征伐的物化象征。",
    flavor: "青光凛冽，铸造一个时代的杀伐。",
  },
  {
    id: "clan_gathering",
    name: "部族集结",
    type: "military",
    era: "ancient",
    cost: { food: 12 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 8, morale: 5 } },
    ],
    semanticEdges: [
      { to: "cavalry_reform", relation: "evolve" },
      { to: "harvest_rite", relation: "synergy" },
    ],
    historicalRef: "春秋以前按血缘部族集结兵力，'族'既是血缘也是军事单位。",
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
    historicalRef: "先民对自然力的崇拜与感恩，'国之大事，在祀与戎'，祭祀维系部族凝聚力。",
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
    semanticEdges: [
      { to: "jixia_academy", relation: "evolve" },
      { to: "bronze_sword", relation: "synergy" },
    ],
    historicalRef: "鼎簋之器，礼乐文明的物化象征。'问鼎轻重'即问天命所归。",
    flavor: "问鼎轻重，可知天命所归？",
  },
  {
    id: "well_field",
    name: "井田之制",
    type: "economic",
    era: "ancient",
    cost: { gold: 8 },
    effects: [{ kind: "modify_component", component: "EconomicC", patch: { food: 20 } }],
    semanticEdges: [
      { to: "reform_taxation", relation: "evolve" },
      { to: "harvest_rite", relation: "synergy" },
    ],
    historicalRef: "相传周代井田制，公田私田之分，是早期土地国有与劳役地租形态。",
    flavor: "方里而井，井九百亩。",
  },

  // ============ 变法纪元（战国）============
  {
    id: "iron_sword",
    name: "铁剑",
    type: "military",
    era: "classical",
    cost: { gold: 18 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 10, techLevel: 1 } },
    ],
    evolvesFrom: "bronze_sword",
    semanticEdges: [
      { to: "steel_sword", relation: "evolve" },
      { to: "bronze_sword", relation: "counter" },
    ],
    historicalRef: "战国铁器普及，韩卒超足、楚铁剑皆为利器。铁器改变了战争与生产效率。",
    flavor: "锻铁为兵，列国争锋自此更烈。",
  },
  {
    id: "cavalry_reform",
    name: "胡服骑射",
    type: "military",
    era: "classical",
    cost: { gold: 25, food: 10 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 12, morale: 10, techLevel: 1 } },
    ],
    evolvesFrom: "clan_gathering",
    semanticEdges: [{ to: "clan_gathering", relation: "evolve" }],
    historicalRef: "赵武灵王前307 年改革，易胡服、习骑射，骑兵取代车阵，赵军自此冠绝北疆。",
    flavor: "变衣冠、习骑射，赵骑冠绝天下。",
  },
  {
    id: "trade_caravan",
    name: "商队通衢",
    type: "economic",
    era: "classical",
    cost: { gold: 12 },
    effects: [{ kind: "modify_component", component: "EconomicC", patch: { gold: 30 } }],
    semanticEdges: [{ to: "silk_road", relation: "evolve" }],
    historicalRef: "战国商人贩运列国，子贡、范蠡以商致富。中原商道初成网络。",
    flavor: "驵侩往来，通货九州。",
  },
  {
    id: "shang_yang_reform",
    name: "商鞅变法",
    type: "event",
    era: "classical",
    cost: { gold: 30, prestige: 5 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 8, morale: 8, techLevel: 1 } },
      { kind: "modify_component", component: "EconomicC", patch: { gold: 20 } },
      { kind: "modify_component", component: "CulturalC", patch: { prestige: -10 } },
    ],
    semanticEdges: [{ to: "reform_taxation", relation: "synergy" }],
    historicalRef: "前356 商鞅变法，废井田、奖耕战、行军功爵。秦由此富强，然法严酷，士人怨。",
    flavor: "废井田、开阡陌，耕战立国。",
  },
  {
    id: "reform_taxation",
    name: "初税亩",
    type: "economic",
    era: "classical",
    cost: { gold: 10 },
    effects: [{ kind: "modify_component", component: "EconomicC", patch: { gold: 15, food: 10 } }],
    evolvesFrom: "well_field",
    semanticEdges: [{ to: "well_field", relation: "evolve" }],
    historicalRef: "前594 鲁国初税亩，按亩征税，承认私田，井田制瓦解之始。",
    flavor: "履亩而税，公私之分始定。",
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
    semanticEdges: [{ to: "imperial_exam", relation: "evolve" }],
    historicalRef: "轴心时代，儒墨道法诸子并起，稷下学宫为学术中心。",
    flavor: "诸子百家，各执一端而天下理。",
  },
  {
    id: "jixia_academy",
    name: "稷下学宫",
    type: "cultural",
    era: "classical",
    cost: { gold: 25 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 25 } },
      { kind: "modify_component", component: "EconomicC", patch: { gold: 10 } },
    ],
    evolvesFrom: "bronze_rite_vessel",
    semanticEdges: [{ to: "imperial_exam", relation: "evolve" }],
    historicalRef: "齐桓公田午立稷下学宫，聚天下学者论学议政，百家之学荟萃于此。",
    flavor: "学宫论道，不治而议论。",
  },

  // ============ 帝国纪元（秦汉—隋唐）============
  {
    id: "steel_sword",
    name: "百炼钢剑",
    type: "military",
    era: "medieval",
    cost: { gold: 35 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 15, techLevel: 1 } },
    ],
    evolvesFrom: "iron_sword",
    semanticEdges: [
      { to: "matchlock", relation: "evolve" },
      { to: "iron_sword", relation: "counter" },
    ],
    historicalRef: "东汉至南北朝百炼钢技术，'五十炼''七十二炼'之剑为冷兵器巅峰。",
    flavor: "百炼成钢，吹毛断发。",
  },
  {
    id: "great_wall",
    name: "长城戍防",
    type: "military",
    era: "medieval",
    cost: { gold: 40, food: 25 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { morale: 20 } },
    ],
    semanticEdges: [{ to: "cavalry_reform", relation: "oppose" }],
    historicalRef: "秦汉修筑长城御匈奴，'却匈奴七百余里'，农耕帝国对游牧的防御体系。",
    flavor: "高墙深堑，据险以守。",
  },
  {
    id: "silk_road",
    name: "丝绸之路",
    type: "economic",
    era: "medieval",
    cost: { gold: 30 },
    effects: [
      { kind: "modify_component", component: "EconomicC", patch: { gold: 50 } },
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 10 } },
    ],
    evolvesFrom: "trade_caravan",
    semanticEdges: [{ to: "trade_caravan", relation: "evolve" }],
    historicalRef: "汉武通西域，张骞凿空，丝路贯通东西，商贸文化双交流。",
    flavor: "驼铃叮当，连通东西方的血脉。",
  },
  {
    id: "equal_field",
    name: "均田之制",
    type: "economic",
    era: "medieval",
    cost: { gold: 20 },
    effects: [{ kind: "modify_component", component: "EconomicC", patch: { food: 30 } }],
    evolvesFrom: "reform_taxation",
    semanticEdges: [{ to: "single_whip_law", relation: "evolve" }],
    historicalRef: "北魏至唐行均田制，计口授田，'耕者有其田'，奠定府兵制基础。",
    flavor: "计口授田，耕者有田。",
  },
  {
    id: "imperial_exam",
    name: "科举取士",
    type: "cultural",
    era: "medieval",
    cost: { gold: 30 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 30 } },
      { kind: "modify_component", component: "EntropyC", patch: { entropy: 10 } },
    ],
    evolvesFrom: "philosophy",
    semanticEdges: [
      { to: "printing_press", relation: "evolve" },
      { to: "jixia_academy", relation: "evolve" },
    ],
    historicalRef: "隋唐立科举，'朝为田舍郎，暮登天子堂'，打破门阀垄断，知识官僚制成熟。",
    flavor: "开科取士，布衣可至卿相。",
  },
  {
    id: "buddhism_spread",
    name: "佛法东渐",
    type: "cultural",
    era: "medieval",
    cost: { gold: 25 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 25 } },
      { kind: "modify_component", component: "EconomicC", patch: { gold: -10 } },
    ],
    semanticEdges: [{ to: "philosophy", relation: "synergy" }],
    historicalRef: "东汉至南北朝佛教东传，'南朝四百八十寺'，儒释道并立而文化鼎盛。",
    flavor: "白马驮经，法雨东渐。",
  },
  {
    id: "book_burning",
    name: "焚书坑儒",
    type: "event",
    era: "medieval",
    cost: { prestige: 20 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: -30 } },
      { kind: "modify_component", component: "EntropyC", patch: { entropy: 15 } },
      { kind: "modify_component", component: "MilitaryC", patch: { morale: 5 } },
    ],
    semanticEdges: [{ to: "imperial_exam", relation: "oppose" }],
    historicalRef: "秦始皇焚书坑儒，钳制思想以固一统。文化重创而集权强化，熵增而威望降。",
    flavor: "偶语诗书者弃市，思想归于一律。",
  },

  // ============ 变革纪元（宋元明清—近代）============
  {
    id: "matchlock",
    name: "火绳枪",
    type: "military",
    era: "modern",
    cost: { gold: 50 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: 20, techLevel: 2 } },
    ],
    evolvesFrom: "steel_sword",
    semanticEdges: [
      { to: "steel_sword", relation: "counter" },
      { to: "great_wall", relation: "counter" },
    ],
    historicalRef: "明嘉靖年间火绳枪（鸟铳）传入，火器普及终结冷兵器时代。",
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
    evolvesFrom: "imperial_exam",
    semanticEdges: [{ to: "western_learning", relation: "evolve" }],
    historicalRef: "北宋毕昇发明活字印刷，知识传播民主化，引爆思想革命。",
    flavor: "字模排布，撼动千年的权威。",
  },
  {
    id: "single_whip_law",
    name: "一条鞭法",
    type: "economic",
    era: "modern",
    cost: { gold: 25 },
    effects: [
      { kind: "modify_component", component: "EconomicC", patch: { gold: 40 } },
      { kind: "modify_component", component: "EntropyC", patch: { entropy: 10 } },
    ],
    evolvesFrom: "equal_field",
    semanticEdges: [{ to: "equal_field", relation: "evolve" }],
    historicalRef: "明张居正行一条鞭法，赋役合并征银，简化税制，白银货币化。",
    flavor: "赋役合一，折银征课。",
  },
  {
    id: "western_learning",
    name: "西学东渐",
    type: "cultural",
    era: "modern",
    cost: { gold: 30 },
    effects: [
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 20 } },
      { kind: "modify_component", component: "MilitaryC", patch: { techLevel: 2 } },
    ],
    evolvesFrom: "printing_press",
    semanticEdges: [{ to: "revolution", relation: "synergy" }],
    historicalRef: "明清之际西学传入，利玛窦、徐光启译《几何原本》，开近代科学之窗。",
    flavor: "泰西之学，启东方之蒙。",
  },
  {
    id: "maritime_ban",
    name: "海禁闭关",
    type: "event",
    era: "modern",
    cost: { gold: 10 },
    effects: [
      { kind: "modify_component", component: "EconomicC", patch: { gold: -20 } },
      { kind: "modify_component", component: "CulturalC", patch: { prestige: 15 } },
    ],
    semanticEdges: [{ to: "silk_road", relation: "oppose" }],
    historicalRef: "明清海禁与闭关锁国，'片板不许下海'，短期维稳而长远闭塞。",
    flavor: "寸板不许下海，闭关以求安。",
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
    historicalRef: "辛亥革命终结帝制，'天下为公'，社会结构剧变，旧秩序瓦解。",
    flavor: "自由、平等，掀翻一切冠冕。",
  },

  // ============ 历史转折事件卡（跨时代，特定条件触发）============
  {
    id: "changping_battle",
    name: "长平之战",
    type: "event",
    era: "classical",
    cost: { gold: 40, food: 30 },
    effects: [
      { kind: "modify_component", component: "MilitaryC", patch: { troops: -30, morale: -15 } },
      { kind: "modify_component", component: "EconomicC", patch: { gold: -20 } },
    ],
    semanticEdges: [{ to: "iron_sword", relation: "synergy" }],
    historicalRef:
      "前260 秦赵长平之战，赵括纸上谈兵，白起坑赵卒四十万。赵自此元气大伤，秦独强。",
    flavor: "纸上谈兵，四十万骨血同尽。",
  },
  {
    id: "hezong_lianhe",
    name: "合纵连横",
    type: "diplomatic",
    era: "classical",
    cost: { gold: 15, prestige: 5 },
    effects: [{ kind: "modify_component", component: "CulturalC", patch: { prestige: 10 } }],
    semanticEdges: [{ to: "trade_caravan", relation: "synergy" }],
    historicalRef:
      "苏秦合纵、张仪连横，纵横家以舌辩搅动天下。六国合纵抗秦，或连横事秦。",
    flavor: "纵成则楚王，横成则秦帝。",
  },
];

/** 卡牌索引 */
export const CARD_BY_ID = new Map(CARD_TEMPLATES.map((c) => [c.id, c]));

/** 获取某时代的卡牌 */
export function cardsByEra(era: Era): CardTemplate[] {
  return CARD_TEMPLATES.filter((c) => c.era === era);
}

/** 获取演化谱系（祖先链） */
export function evolutionChain(cardId: string): CardTemplate[] {
  const chain: CardTemplate[] = [];
  const seen = new Set<string>();
  let current = CARD_BY_ID.get(cardId);
  while (current && !seen.has(current.id)) {
    chain.unshift(current);
    seen.add(current.id);
    current = current.evolvesFrom ? CARD_BY_ID.get(current.evolvesFrom) : undefined;
  }
  return chain;
}

/** 获取某卡牌的所有后代（演化树分支） */
export function evolutionDescendants(cardId: string): CardTemplate[] {
  return CARD_TEMPLATES.filter((c) => c.evolvesFrom === cardId);
}

/** 卡牌所需科技等级（用于规则前置校验） */
export const CARD_TECH_REQUIREMENT: Record<string, number> = {
  bronze_sword: 0,
  iron_sword: 2,
  steel_sword: 3,
  matchlock: 5,
  cavalry_reform: 2,
  great_wall: 2,
  printing_press: 3,
  western_learning: 4,
};
