import type { Era } from "@/types";

export interface EraDefinition {
  era: Era;
  label: string;
  description: string;
  /** 熵阈值：达到后可跃迁 */
  entropyThreshold: number;
  /** 起始可用卡牌类型 */
  unlockCards: string[];
}

export const ERAS: Record<Era, EraDefinition> = {
  ancient: {
    era: "ancient",
    label: "远古纪元",
    description: "部族初立，青铜与口耳相传构筑最初的世界。",
    entropyThreshold: 30,
    unlockCards: ["bronze_sword", "clan_gathering", "harvest_rite"],
  },
  classical: {
    era: "classical",
    label: "古典纪元",
    description: "城邦与帝国崛起，铁器、律法与哲学照亮地中海与东方。",
    entropyThreshold: 60,
    unlockCards: ["iron_sword", "trade_caravan", "philosophy"],
  },
  medieval: {
    era: "medieval",
    label: "中世纪",
    description: "封建与宗教交织，城堡与骑士定义了权力的形态。",
    entropyThreshold: 85,
    unlockCards: ["steel_sword", "castle", "crusade"],
  },
  modern: {
    era: "modern",
    label: "近代纪元",
    description: "火药与印刷术引爆旧秩序，民族国家与科学革命登场。",
    entropyThreshold: 100,
    unlockCards: ["matchlock", "printing_press", "revolution"],
  },
};
