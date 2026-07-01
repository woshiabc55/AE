import { describe, it, expect } from "vitest";
import { resolveBattle } from "@/game/battle";
import { checkVictory, VICTORY_CONDITIONS, victoryProgress } from "@/game/victory";
import { computeLogisticsDeltas, computeFoodConsumption, computeLevyCap } from "@/game/logistics";
import { createWorld, spawnEntity, setComponent } from "@/ecs/World";
import type {
  MilitaryC,
  EconomicC,
  CulturalC,
  EntropyC,
  FactionC,
  PopulationC,
} from "@/types";

function mkFaction(
  world: ReturnType<typeof createWorld>,
  name: string,
  opts: Partial<{
    troops: number;
    morale: number;
    techLevel: number;
    gold: number;
    food: number;
    prestige: number;
    entropy: number;
    population: number;
    happiness: number;
  }>
) {
  const e = spawnEntity(world);
  setComponent<FactionC>(world, e, "FactionC", { name, color: "#000", isPlayer: false });
  setComponent<MilitaryC>(world, e, "MilitaryC", {
    troops: opts.troops ?? 50,
    morale: opts.morale ?? 60,
    techLevel: opts.techLevel ?? 2,
  });
  setComponent<EconomicC>(world, e, "EconomicC", {
    gold: opts.gold ?? 100,
    food: opts.food ?? 60,
    tradeRoutes: [],
  });
  setComponent<CulturalC>(world, e, "CulturalC", {
    prestige: opts.prestige ?? 30,
    ideas: [],
  });
  setComponent<EntropyC>(world, e, "EntropyC", { entropy: opts.entropy ?? 20 });
  setComponent<PopulationC>(world, e, "PopulationC", {
    population: opts.population ?? 50,
    growth: 1.5,
    happiness: opts.happiness ?? 60,
  });
  return e;
}

describe("战斗结算系统", () => {
  it("强方胜率高于弱方", () => {
    const world = createWorld(42);
    const strong = mkFaction(world, "强", { troops: 100, morale: 90, techLevel: 3 });
    const weak = mkFaction(world, "弱", { troops: 30, morale: 40, techLevel: 1 });
    let strongWins = 0;
    for (let i = 0; i < 50; i++) {
      const result = resolveBattle(world, strong, weak, () => Math.random());
      if (result.victor === strong) strongWins++;
    }
    expect(strongWins).toBeGreaterThan(35); // 强方应胜多数
  });

  it("败方伤亡大于胜方", () => {
    const world = createWorld(42);
    const a = mkFaction(world, "甲", { troops: 80, morale: 70, techLevel: 2 });
    const b = mkFaction(world, "乙", { troops: 60, morale: 60, techLevel: 2 });
    const result = resolveBattle(world, a, b, () => 0.5);
    const loserLosses = result.victor === a ? result.defenderLosses : result.attackerLosses;
    const winnerLosses = result.victor === a ? result.attackerLosses : result.defenderLosses;
    expect(loserLosses).toBeGreaterThanOrEqual(winnerLosses);
  });

  it("战斗生成叙事文本", () => {
    const world = createWorld(42);
    const a = mkFaction(world, "秦", { troops: 90, morale: 85 });
    const b = mkFaction(world, "赵", { troops: 70, morale: 75 });
    const result = resolveBattle(world, a, b, () => 0.3);
    expect(result.narrative).toContain("秦");
    expect(result.narrative).toContain("赵");
  });

  it("冬季战斗力衰减", () => {
    const world = createWorld(42);
    world.season = "winter";
    const a = mkFaction(world, "攻", { troops: 80, morale: 70 });
    const b = mkFaction(world, "守", { troops: 60, morale: 60 });
    const result = resolveBattle(world, a, b, () => 0.5);
    // 冬季守方优势更大（攻方战力受季节影响）
    expect(result.attackerPower).toBeLessThan(80 * 1.5);
  });
});

describe("后勤补给系统", () => {
  it("兵力越多粮草消耗越大", () => {
    const world = createWorld(42);
    const small = mkFaction(world, "小", { troops: 30 });
    const large = mkFaction(world, "大", { troops: 100 });
    const smallCons = computeFoodConsumption(world, small);
    const largeCons = computeFoodConsumption(world, large);
    expect(largeCons).toBeGreaterThan(smallCons);
  });

  it("冬季消耗加倍", () => {
    const world = createWorld(42);
    const e = mkFaction(world, "测试", { troops: 50 });
    world.season = "autumn";
    const autumnCons = computeFoodConsumption(world, e);
    world.season = "winter";
    const winterCons = computeFoodConsumption(world, e);
    expect(winterCons).toBeGreaterThan(autumnCons);
  });

  it("征兵上限基于人口", () => {
    const world = createWorld(42);
    const small = mkFaction(world, "小", { population: 40 });
    const large = mkFaction(world, "大", { population: 100 });
    expect(computeLevyCap(world, large)).toBeGreaterThan(computeLevyCap(world, small));
  });

  it("后勤 delta 生成正确", () => {
    const world = createWorld(42);
    mkFaction(world, "甲", { troops: 50, population: 60, happiness: 70 });
    const deltas = computeLogisticsDeltas(world);
    expect(deltas.length).toBeGreaterThan(0);
    // 应包含 EconomicC（粮草消耗）和 PopulationC（人口动态）
    expect(deltas.some((d) => d.component === "EconomicC")).toBe(true);
    expect(deltas.some((d) => d.component === "PopulationC")).toBe(true);
  });
});

describe("胜利条件系统", () => {
  it("军事胜利：消灭所有敌对势力", () => {
    const world = createWorld(42);
    const winner = mkFaction(world, "胜方", { troops: 80 });
    mkFaction(world, "败方A", { troops: 0 });
    mkFaction(world, "败方B", { troops: 0 });
    const result = checkVictory(world);
    expect(result).not.toBeNull();
    expect(result?.type).toBe("military");
    expect(result?.entity).toBe(winner);
  });

  it("经济胜利：黄金达 500", () => {
    const world = createWorld(42);
    const rich = mkFaction(world, "富", { gold: 520, troops: 30 });
    mkFaction(world, "贫", { gold: 50, troops: 40 });
    const result = checkVictory(world);
    expect(result?.type).toBe("economic");
    expect(result?.entity).toBe(rich);
  });

  it("文化胜利：威望达 95", () => {
    const world = createWorld(42);
    const cultured = mkFaction(world, "文", { prestige: 96, troops: 30 });
    mkFaction(world, "武", { prestige: 20, troops: 50 });
    const result = checkVictory(world);
    expect(result?.type).toBe("cultural");
    expect(result?.entity).toBe(cultured);
  });

  it("科技胜利：科技等级达 6", () => {
    const world = createWorld(42);
    const tech = mkFaction(world, "技", { techLevel: 6, troops: 30 });
    mkFaction(world, "凡", { techLevel: 2, troops: 50 });
    const result = checkVictory(world);
    expect(result?.type).toBe("technological");
    expect(result?.entity).toBe(tech);
  });

  it("无势力达成条件时返回 null", () => {
    const world = createWorld(42);
    mkFaction(world, "甲", { troops: 50, gold: 100, prestige: 30, techLevel: 2 });
    mkFaction(world, "乙", { troops: 60, gold: 80, prestige: 25, techLevel: 1 });
    expect(checkVictory(world)).toBeNull();
  });

  it("胜利进度计算合理", () => {
    const world = createWorld(42);
    const e = mkFaction(world, "甲", { gold: 250, troops: 50 });
    const prog = victoryProgress(world, e, "economic");
    expect(prog).toBeGreaterThan(0.4);
    expect(prog).toBeLessThan(0.6);
  });

  it("所有胜利条件都已定义", () => {
    expect(VICTORY_CONDITIONS.length).toBe(5);
  });
});
