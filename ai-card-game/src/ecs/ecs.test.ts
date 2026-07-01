import { describe, it, expect } from "vitest";
import {
  createWorld,
  spawnEntity,
  setComponent,
  getComponent,
  queryEntities,
  applyDelta,
  snapshot,
  restore,
} from "@/ecs/World";
import { createRng } from "@/lib/rng";
import type { MilitaryC, EconomicC, FactionC } from "@/types";

/**
 * P0 地基验证 — ECS 核心纯确定、零 AI 依赖、可单测。
 * 验证：实体生成 → 组件挂载/查询 → 事件增量应用 → 快照/重建。
 */
describe("ECS World", () => {
  it("生成实体并挂载组件", () => {
    const world = createWorld(42);
    const e = spawnEntity(world);
    setComponent<MilitaryC>(world, e, "MilitaryC", { troops: 50, morale: 70, techLevel: 1 });
    const comp = getComponent<MilitaryC>(world, e, "MilitaryC");
    expect(comp?.troops).toBe(50);
    expect(comp?.morale).toBe(70);
  });

  it("按组件类型查询实体", () => {
    const world = createWorld(1);
    spawnEntity(world, { FactionC: { name: "秦", color: "#444", isPlayer: false } });
    spawnEntity(world, { FactionC: { name: "赵", color: "#8B2E1F", isPlayer: false } });
    const factions = Array.from(queryEntities<FactionC>(world, "FactionC"));
    expect(factions).toHaveLength(2);
    expect(factions.map((f) => f.component.name).sort()).toEqual(["秦", "赵"]);
  });

  it("applyDelta 数值增量（事件溯源核心）", () => {
    const world = createWorld(1);
    const e = spawnEntity(world, { EconomicC: { gold: 100, food: 50, tradeRoutes: [] } });
    // gold: -10 → 扣除 10
    applyDelta(world, { entity: e, component: "EconomicC", patch: { gold: -10 } });
    expect(getComponent<EconomicC>(world, e, "EconomicC")?.gold).toBe(90);
    // gold: 25 → 增加 25
    applyDelta(world, { entity: e, component: "EconomicC", patch: { gold: 25 } });
    expect(getComponent<EconomicC>(world, e, "EconomicC")?.gold).toBe(115);
    // 数组替换语义
    applyDelta(world, { entity: e, component: "EconomicC", patch: { tradeRoutes: ["东海"] } });
    expect(getComponent<EconomicC>(world, e, "EconomicC")?.tradeRoutes).toEqual(["东海"]);
  });

  it("快照与重建（可复现性）", () => {
    const world = createWorld(99);
    const e = spawnEntity(world, {
      EconomicC: { gold: 200, food: 50, tradeRoutes: ["东海"] },
    });
    const snap = snapshot(world);
    expect(snap.turn).toBe(0);
    expect(snap.era).toBe("ancient");

    const restored = restore(snap, 99);
    const comp = getComponent<EconomicC>(restored, e, "EconomicC");
    expect(comp?.gold).toBe(200);
    expect(comp?.tradeRoutes).toEqual(["东海"]);
  });

  it("RNG 种子可复现", () => {
    const r1 = createRng(123);
    const r2 = createRng(123);
    expect(r1()).toBe(r2());
    expect(r1()).toBe(r2());
  });
});
