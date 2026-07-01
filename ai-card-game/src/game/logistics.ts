import type { World, EntityId, ComponentDelta } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, PopulationC, MemoryC, Season } from "@/types";
import { SEASON_FOOD_MULT, SEASON_WAR_MULT, SEASON_ORDER } from "@/types";

/**
 * 后勤补给系统 — 每回合粮草消耗 + 人口动态 + 季节效应。
 *
 * 考究：古代行军"日费千金，十万之师举矣"（孙子）。
 *   兵力越多，粮草消耗越大；远征比守备更费粮。
 *   人口影响征兵上限与产出基数；民心影响稳定度。
 *
 * 现实细化维度：
 *   1. 粮草消耗 = 兵力 × 消耗率 × 季节系数
 *   2. 人口增长 = 人口 × 增长率 × 民心系数（民心低则人口流失）
 *   3. 征兵上限 = 人口 × 比例（防止超征）
 *   4. 季节推进：每回合推进一个季节
 */

/** 每兵每回合基础粮草消耗（0.3 单位/兵） */
const FOOD_PER_TROOP = 0.3;

/** 征兵占人口上限比例（5%） */
const LEVY_RATIO = 0.05;

/** 关系衰减率：每回合向 0 回归 5% */
const RELATION_DECAY = 0.05;

/** 计算某势力本回合的粮草消耗 */
export function computeFoodConsumption(world: World, entity: EntityId): number {
  const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
  if (!military) return 0;
  // 季节消耗系数（与产出独立）：春秋正常，夏略增（暑热腐坏），冬加倍（取暖+草料紧俏）
  const seasonConsumptionMult: Record<Season, number> = {
    spring: 1.0,
    summer: 1.1,
    autumn: 1.0,
    winter: 1.6,
  };
  const mult = seasonConsumptionMult[world.season];
  return Math.ceil(military.troops * FOOD_PER_TROOP * mult);
}

/** 计算征兵上限（基于人口） */
export function computeLevyCap(world: World, entity: EntityId): number {
  const population = getComponent<PopulationC>(world, entity, "PopulationC");
  if (!population) return 0;
  return Math.floor(population.population * LEVY_RATIO);
}

/** 计算季节对军事行动的战力修正 */
export function computeSeasonalWarModifier(season: Season): number {
  return SEASON_WAR_MULT[season];
}

/** 推进季节：每回合轮转一次 */
export function advanceSeason(world: World): Season {
  const idx = SEASON_ORDER.indexOf(world.season);
  world.season = SEASON_ORDER[(idx + 1) % SEASON_ORDER.length];
  return world.season;
}

/**
 * 生成每回合后勤消耗的 ComponentDelta 数组。
 *   - 粮草消耗（兵力 × 消耗率 × 季节）
 *   - 人口增长（人口 × 增长率 × 民心系数）
 *   - 民心回归（向 50 中性回归）
 */
export function computeLogisticsDeltas(world: World): ComponentDelta[] {
  const deltas: ComponentDelta[] = [];

  for (const [entity, comps] of world.entities) {
    const military = comps.MilitaryC as MilitaryC | undefined;
    const economic = comps.EconomicC as EconomicC | undefined;
    const population = comps.PopulationC as PopulationC | undefined;

    // 1. 粮草消耗
    if (military && economic) {
      const consumption = computeFoodConsumption(world, entity);
      if (consumption > 0) {
        deltas.push({
          entity,
          component: "EconomicC",
          patch: { food: -consumption },
        });
      }
    }

    // 2. 人口动态：增长（民心高）或流失（民心低）
    if (population) {
      const happinessFactor = population.happiness / 50; // 50 为中性
      const popGrowth = Math.round(population.population * population.growth * 0.01 * happinessFactor);
      // 民心向 50 回归（民意随时间淡化）
      const happinessDecay = Math.round((50 - population.happiness) * 0.1);
      deltas.push({
        entity,
        component: "PopulationC",
        patch: {
          population: popGrowth,
          happiness: happinessDecay,
        },
      });
    }
  }

  return deltas;
}

/**
 * 外交关系衰减：每回合向中立（0）回归。
 *   - |relation| > 10 时衰减 5%
 *   - 模拟"时过境迁，恩怨渐淡"
 *   注意：applyPatch 对对象是替换语义，故每实体合并为单个 delta
 */
export function computeRelationDecay(world: World): ComponentDelta[] {
  const deltas: ComponentDelta[] = [];
  for (const [entity, comps] of world.entities) {
    const memory = comps.MemoryC as MemoryC | undefined;
    if (!memory?.relationship) continue;
    let changed = false;
    const newRel = { ...memory.relationship };
    for (const [target, value] of Object.entries(newRel)) {
      if (Math.abs(value) < 10) continue;
      const decay = Math.round(value * RELATION_DECAY);
      if (decay !== 0) {
        newRel[target] = value - decay;
        changed = true;
      }
    }
    if (changed) {
      deltas.push({
        entity,
        component: "MemoryC",
        patch: { relationship: newRel },
      });
    }
  }
  return deltas;
}
