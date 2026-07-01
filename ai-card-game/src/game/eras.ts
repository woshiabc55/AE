import type { Era } from "@/types";

/**
 * 时代体系 — 重新映射为中国历史内涵的纪元。
 *
 * 考究：原 ancient/classical/medieval/modern 是西方分期，与战国七雄(前5-3世纪)时空错位。
 * 现以中国社会形态演进为主线，4 个纪元对应 4 种文明组织形态：
 *   封建纪元（西周-春秋）→ 变法纪元（战国）→ 帝国纪元（秦汉-隋唐）→ 变革纪元（宋元明清-近代）
 *
 * 不确定性锥：早期可能性空间大（AI 自由度高），越后期路径依赖越强。
 * 文明熵阈值：积累到此方可跃迁，对应历史"质变"节点。
 */
export interface EraDefinition {
  era: Era;
  label: string;
  /** 历史时间映射（用于真实性考据展示） */
  period: string;
  description: string;
  /** 熵阈值：达到后可跃迁到下一纪元 */
  entropyThreshold: number;
  /** 不确定性锥宽度 0-1，决定 AI 自由度 */
  uncertainty: number;
  /** 该纪元起始解锁的卡牌 */
  unlockCards: string[];
  /** 跃迁所需的历史质变标志 */
  transitionMarker: string;
}

export const ERAS: Record<Era, EraDefinition> = {
  ancient: {
    era: "ancient",
    label: "封建纪元",
    period: "西周—春秋（约前1046—前475）",
    description:
      "青铜礼乐维系天下，封建诸侯各守其土。礼崩乐坏之际，铁器初兴，思想在裂变中萌芽。",
    entropyThreshold: 30,
    uncertainty: 0.9,
    unlockCards: ["bronze_sword", "bronze_rite_vessel", "clan_gathering", "harvest_rite", "well_field"],
    transitionMarker: "礼崩乐坏，列国变法图强",
  },
  classical: {
    era: "classical",
    label: "变法纪元",
    period: "战国（约前475—前221）",
    description:
      "铁器普及催生耕战，变法重塑国家。商鞅、申不害、胡服骑射——七雄以制度角力，兼并渐烈。",
    entropyThreshold: 60,
    uncertainty: 0.6,
    unlockCards: ["iron_sword", "trade_caravan", "philosophy", "shang_yang_reform", "reform_taxation"],
    transitionMarker: "六合为一，帝国肇建",
  },
  medieval: {
    era: "medieval",
    label: "帝国纪元",
    period: "秦汉—隋唐（前221—907）",
    description:
      "大一统帝国以律令、郡县、科举维系。百炼钢兴，丝路通商，儒释道并立而文化鼎盛。",
    entropyThreshold: 85,
    uncertainty: 0.35,
    unlockCards: ["steel_sword", "imperial_exam", "silk_road", "great_wall", "buddhism_spread"],
    transitionMarker: "均田崩坏，社会结构重组",
  },
  modern: {
    era: "modern",
    label: "变革纪元",
    period: "宋元明清—近代（960—1912）",
    description:
      "印刷术与火器引爆旧秩序，商业革命与思想启蒙交织。一条鞭法、洋务、变法——制度屡更。",
    entropyThreshold: 100,
    uncertainty: 0.2,
    unlockCards: ["matchlock", "printing_press", "single_whip_law", "revolution", "maritime_ban"],
    transitionMarker: "帝制终结，近代国家登场",
  },
};

/** 时代标签简称（用于横幅紧凑展示） */
export const ERA_SHORT: Record<Era, string> = {
  ancient: "封建",
  classical: "变法",
  medieval: "帝国",
  modern: "变革",
};
