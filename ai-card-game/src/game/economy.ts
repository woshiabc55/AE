import type { World, Era, EntityId } from "@/types";
import { SEASON_FOOD_MULT } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, FactionC, PopulationC } from "@/types";
import { FACTION_TEMPLATES, type FactionTrait } from "@/game/factions";

/**
 * 经济模型 — 每回合基础产出。
 *
 * 考究：原设计资源只减不增，数回合即枯竭。补入"每回合基础产出"模拟
 *   农业收获与商贸流转，使资源经济形成"产出—消耗—积累"循环。
 *
 * 产出构成：
 *   1. 势力特质基础值（反映经济结构：齐重商、秦重农、赵苦寒、楚地广）
 *   2. 时代乘数（生产力随文明进步而提升）
 *   3. 士气效率因子（民力凋敝则产出骤降，"民为邦本，本固邦宁"）
 *   4. 科技加成（冶铸/农具进步提升粮食产出）
 *   5. 商道加成（每条商道额外产金）
 */

/** 势力特质 → 基础产出（每回合） */
const BASE_PRODUCTION: Record<FactionTrait, { gold: number; food: number }> = {
  agrarian: { gold: 6, food: 12 }, // 秦：耕战立国，重农
  militarist: { gold: 5, food: 4 }, // 赵：代地苦寒，农桑不足
  mercantile: { gold: 16, food: 8 }, // 齐：鱼盐之利，富甲天下
  cultural: { gold: 8, food: 10 }, // 楚：地广人众，农桑为本
};

/** 时代乘数：生产力随文明形态演进而提升 */
const ERA_MULTIPLIER: Record<Era, number> = {
  ancient: 1.0, // 封建纪元：青铜农具，产出有限
  classical: 1.2, // 变法纪元：铁器普及，耕作效率提升
  medieval: 1.5, // 帝国纪元：均田、水利、农技成熟
  modern: 2.0, // 变革纪元：商品经济与近代农业
};

/** 势力名 → 特质查找表（运行时构建，避免修改 FactionC 类型） */
export const TRAIT_BY_NAME = new Map<string, FactionTrait>(
  FACTION_TEMPLATES.map((t) => [t.components.FactionC.name, t.trait])
);

export interface Production {
  gold: number;
  food: number;
  /** 产出来源说明（供叙事/调试） */
  breakdown: string;
}

/**
 * 计算某势力本回合的基础产出。
 * 纯函数，不修改世界状态。
 */
export function computeProduction(world: World, entity: EntityId): Production {
  const faction = getComponent<FactionC>(world, entity, "FactionC");
  const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
  const economic = getComponent<EconomicC>(world, entity, "EconomicC");
  const population = getComponent<PopulationC>(world, entity, "PopulationC");

  if (!faction || !military || !economic) {
    return { gold: 0, food: 0, breakdown: "无有效经济实体" };
  }

  // 1. 势力特质基础值
  const trait = TRAIT_BY_NAME.get(faction.name) ?? "agrarian";
  const base = BASE_PRODUCTION[trait];

  // 2. 时代乘数
  const eraMult = ERA_MULTIPLIER[world.era];

  // 3. 士气效率因子：0.3 ~ 1.2
  const moraleFactor = Math.max(0.3, Math.min(1.2, 0.3 + (military.morale / 100) * 0.9));

  // 4. 科技加成：每级科技 +1 粮
  const techFoodBonus = military.techLevel;

  // 5. 商道加成：每条商道 +2 金
  const tradeGoldBonus = (economic.tradeRoutes?.length ?? 0) * 2;

  // 6. 季节乘数（春耕、秋收、冬藏）
  const seasonFoodMult = SEASON_FOOD_MULT[world.season];

  // 7. 人口乘数：人口越多，产出基数越大（人口×0.02）
  const popMult = population ? 1 + population.population * 0.005 : 1;

  const gold = Math.floor(base.gold * eraMult * moraleFactor * popMult + tradeGoldBonus);
  const food = Math.floor(base.food * eraMult * moraleFactor * popMult * seasonFoodMult + techFoodBonus);

  const breakdown =
    `基础(${trait}) 金${base.gold}/粮${base.food} × 时代${eraMult} × 士气${moraleFactor.toFixed(2)}` +
    ` × 季节${seasonFoodMult} × 人口${popMult.toFixed(2)}` +
    ` + 商道${tradeGoldBonus}金 + 科技${techFoodBonus}粮 = 金${gold}/粮${food}`;

  return { gold, food, breakdown };
}

/** 计算所有势力的本回合产出（聚合视图） */
export function computeAllProduction(world: World): Map<EntityId, Production> {
  const result = new Map<EntityId, Production>();
  for (const [entity] of world.entities) {
    const faction = getComponent<FactionC>(world, entity, "FactionC");
    if (faction) {
      result.set(entity, computeProduction(world, entity));
    }
  }
  return result;
}
