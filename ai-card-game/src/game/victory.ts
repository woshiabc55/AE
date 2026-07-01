import type { World, EntityId, VictoryCondition, VictoryType } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, CulturalC, EntropyC, FactionC } from "@/types";
import { ERA_ORDER } from "@/types";

/**
 * 胜利条件系统 — 多路线胜利，贴合历史多样性。
 *
 * 考究：历史不是只有"一统天下"一种结局。
 *   - 军事征服（秦始皇式）：消灭所有敌对势力
 *   - 经济霸权（齐国式）：财富累积称雄
 *   - 文化鼎盛（楚国式）：威望远播
 *   - 科技领先（工业革命式）：科技遥遥领先
 *   - 文明跃迁（近代化式）：完成时代演进，熵达峰值
 *
 * 每回合检查，首个达成的势力获胜。
 */

/** 军事征服：消灭所有敌对势力（兵力归零或无势力实体） */
const MILITARY_VICTORY: VictoryCondition = {
  type: "military",
  label: "一统天下",
  description: "消灭所有敌对势力，成就霸业",
  check: (world: World, entity: EntityId): boolean => {
    const myMilitary = getComponent<MilitaryC>(world, entity, "MilitaryC");
    if (!myMilitary || myMilitary.troops <= 0) return false;

    // 检查所有其他势力是否兵力归零
    for (const [other, comps] of world.entities) {
      if (other === entity) continue;
      const faction = comps.FactionC as FactionC | undefined;
      if (!faction) continue;
      const military = comps.MilitaryC as MilitaryC | undefined;
      if (military && military.troops > 0) return false;
    }
    return true;
  },
};

/** 经济霸权：黄金累积达 500 */
const ECONOMIC_VICTORY: VictoryCondition = {
  type: "economic",
  label: "富甲天下",
  description: "黄金累积达 500，以经济力称雄",
  check: (world: World, entity: EntityId): boolean => {
    const economic = getComponent<EconomicC>(world, entity, "EconomicC");
    return (economic?.gold ?? 0) >= 500;
  },
};

/** 文化鼎盛：威望达 95 */
const CULTURAL_VICTORY: VictoryCondition = {
  type: "cultural",
  label: "礼乐复兴",
  description: "威望达 95，文化光照四海",
  check: (world: World, entity: EntityId): boolean => {
    const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
    return (cultural?.prestige ?? 0) >= 95;
  },
};

/** 科技领先：科技等级达 6（远超时代） */
const TECH_VICTORY: VictoryCondition = {
  type: "technological",
  label: "器物革新",
  description: "科技等级达 6，开创技术新纪元",
  check: (world: World, entity: EntityId): boolean => {
    const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
    return (military?.techLevel ?? 0) >= 6;
  },
};

/** 文明跃迁：进入变革纪元且熵达 90 */
const ENTROPY_VICTORY: VictoryCondition = {
  type: "entropy",
  label: "文明跃迁",
  description: "推进至变革纪元且文明熵达 90",
  check: (world: World, entity: EntityId): boolean => {
    if (world.era !== "modern") return false;
    const entropy = getComponent<EntropyC>(world, entity, "EntropyC");
    return (entropy?.entropy ?? 0) >= 90;
  },
};

/** 所有胜利条件 */
export const VICTORY_CONDITIONS: VictoryCondition[] = [
  MILITARY_VICTORY,
  ECONOMIC_VICTORY,
  CULTURAL_VICTORY,
  TECH_VICTORY,
  ENTROPY_VICTORY,
];

/** 检查是否有势力达成胜利条件，返回胜者与胜利类型 */
export function checkVictory(world: World): { entity: EntityId; type: VictoryType } | null {
  for (const [entity] of world.entities) {
    const faction = getComponent<FactionC>(world, entity, "FactionC");
    if (!faction) continue;
    for (const cond of VICTORY_CONDITIONS) {
      if (cond.check(world, entity)) {
        return { entity, type: cond.type };
      }
    }
  }
  return null;
}

/** 获取某势力的胜利进度（0-1） */
export function victoryProgress(world: World, entity: EntityId, type: VictoryType): number {
  switch (type) {
    case "military": {
      const myMil = getComponent<MilitaryC>(world, entity, "MilitaryC");
      if (!myMil || myMil.troops <= 0) return 0;
      let alive = 0;
      for (const [other, comps] of world.entities) {
        if (other === entity) continue;
        const m = comps.MilitaryC as MilitaryC | undefined;
        if (m && m.troops > 0) alive++;
      }
      return alive === 0 ? 1 : 1 - alive / 3;
    }
    case "economic": {
      const eco = getComponent<EconomicC>(world, entity, "EconomicC");
      return Math.min(1, (eco?.gold ?? 0) / 500);
    }
    case "cultural": {
      const cul = getComponent<CulturalC>(world, entity, "CulturalC");
      return Math.min(1, (cul?.prestige ?? 0) / 95);
    }
    case "technological": {
      const mil = getComponent<MilitaryC>(world, entity, "MilitaryC");
      return Math.min(1, (mil?.techLevel ?? 0) / 6);
    }
    case "entropy": {
      const ent = getComponent<EntropyC>(world, entity, "EntropyC");
      const eraProgress = ERA_ORDER.indexOf(world.era) / (ERA_ORDER.length - 1);
      const entProgress = Math.min(1, (ent?.entropy ?? 0) / 90);
      return eraProgress * entProgress;
    }
  }
}
