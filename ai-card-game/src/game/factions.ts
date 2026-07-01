import type { Component, FactionC, MilitaryC, EconomicC, CulturalC, EntropyC, HandC } from "@/types";

export interface FactionTemplate {
  id: string;
  name: string;
  color: string;
  title: string;
  description: string;
  components: {
    FactionC: FactionC;
    MilitaryC: MilitaryC;
    EconomicC: EconomicC;
    CulturalC: CulturalC;
    EntropyC: EntropyC;
    HandC: HandC;
  };
}

/** 可选势力模板 */
export const FACTION_TEMPLATES: FactionTemplate[] = [
  {
    id: "zhao",
    name: "赵",
    color: "#8B2E1F",
    title: "尚武之邦",
    description: "骑兵雄劲，民风剽悍，然农桑不足。",
    components: {
      FactionC: { name: "赵", color: "#8B2E1F", isPlayer: false },
      MilitaryC: { troops: 80, morale: 75, techLevel: 2 },
      EconomicC: { gold: 120, food: 60, tradeRoutes: ["代地商道"] },
      CulturalC: { prestige: 30, ideas: ["胡服骑射"] },
      EntropyC: { entropy: 20 },
      HandC: { cards: ["bronze_sword", "clan_gathering"] },
    },
  },
  {
    id: "qi",
    name: "齐",
    color: "#3E5C4D",
    title: "海王之国",
    description: "鱼盐之利甲天下，富庶冠于列邦。",
    components: {
      FactionC: { name: "齐", color: "#3E5C4D", isPlayer: false },
      MilitaryC: { troops: 60, morale: 60, techLevel: 2 },
      EconomicC: { gold: 200, food: 90, tradeRoutes: ["东海盐道", "临淄商埠"] },
      CulturalC: { prestige: 50, ideas: ["稷下学宫"] },
      EntropyC: { entropy: 25 },
      HandC: { cards: ["trade_caravan", "harvest_rite"] },
    },
  },
  {
    id: "chu",
    name: "楚",
    color: "#C9A24B",
    title: "南方雄邦",
    description: "地广人众，巫风炽盛，文化灿若云霞。",
    components: {
      FactionC: { name: "楚", color: "#C9A24B", isPlayer: false },
      MilitaryC: { troops: 70, morale: 70, techLevel: 1 },
      EconomicC: { gold: 100, food: 80, tradeRoutes: ["汉水通道"] },
      CulturalC: { prestige: 70, ideas: ["楚辞", "巫觋文化"] },
      EntropyC: { entropy: 22 },
      HandC: { cards: ["harvest_rite", "clan_gathering"] },
    },
  },
  {
    id: "qin",
    name: "秦",
    color: "#4A4A4A",
    title: "虎狼之国",
    description: "耕战立国，法度森严，东出函谷而有吞并天下之志。",
    components: {
      FactionC: { name: "秦", color: "#4A4A4A", isPlayer: false },
      MilitaryC: { troops: 90, morale: 80, techLevel: 3 },
      EconomicC: { gold: 80, food: 70, tradeRoutes: ["渭水商道"] },
      CulturalC: { prestige: 20, ideas: ["商鞅变法"] },
      EntropyC: { entropy: 28 },
      HandC: { cards: ["iron_sword", "bronze_sword"] },
    },
  },
];

/** NPC 模板（对话博弈方） */
export const NPC_TEMPLATES = [
  {
    persona: {
      name: "范雎",
      title: "秦国客卿",
      description: "深谋远虑的纵横家，主张远交近攻。",
      archetype: "谋士",
    },
    goals: [
      { id: "g1", description: "促成秦王采纳远交近攻之策", priority: 5 },
      { id: "g2", description: "削弱政敌在国内的影响", priority: 3 },
    ],
    secrets: [
      { id: "s1", content: "范雎化名张禄入秦，旧日仇家仍在中原寻其踪迹。", revealedTo: [] },
    ],
  },
] as const;
