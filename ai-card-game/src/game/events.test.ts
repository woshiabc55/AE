import { describe, it, expect } from "vitest";
import { HISTORICAL_EVENTS, selectHistoricalEvents } from "@/game/events";
import { createWorld, spawnEntity, setComponent } from "@/ecs/World";
import type {
  MilitaryC,
  EconomicC,
  CulturalC,
  EntropyC,
  FactionC,
  HandC,
} from "@/types";

/**
 * 历史事件库验证 — 触发条件 + 时代匹配 + 事件选取。
 */
function mkFaction(
  world: ReturnType<typeof createWorld>,
  name: string,
  opts: Partial<{ troops: number; morale: number; techLevel: number; gold: number; food: number; prestige: number; entropy: number }>
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
  setComponent<HandC>(world, e, "HandC", { cards: [] });
  return e;
}

describe("历史事件库", () => {
  it("商鞅变法：农耕型低威望势力可触发", () => {
    const world = createWorld(42);
    world.era = "classical";
    mkFaction(world, "秦", { prestige: 15, troops: 90, gold: 80 });
    const rng = () => 0; // 必定触发
    const events = selectHistoricalEvents(world, rng, 5);
    const shangYang = events.find((e) => e.id.includes("shang_yang"));
    expect(shangYang).toBeDefined();
    expect(shangYang!.description).toContain("商鞅变法");
  });

  it("胡服骑射：军事型势力可触发", () => {
    const world = createWorld(42);
    world.era = "classical";
    mkFaction(world, "赵", { troops: 85, morale: 80 });
    const rng = () => 0;
    const events = selectHistoricalEvents(world, rng, 5);
    const cavalry = events.find((e) => e.id.includes("cavalry_reform"));
    expect(cavalry).toBeDefined();
    expect(cavalry?.description).toContain("胡服骑射");
  });

  it("长平之战：两强并立即可触发", () => {
    const world = createWorld(42);
    world.era = "classical";
    world.turn = 5;
    mkFaction(world, "秦", { troops: 95 });
    mkFaction(world, "赵", { troops: 85 });
    const rng = () => 0;
    const events = selectHistoricalEvents(world, rng, 5);
    const changping = events.find((e) => e.id.includes("changping"));
    expect(changping).toBeDefined();
  });

  it("时代过滤：ancient 纪元不触发 classical 事件", () => {
    const world = createWorld(42);
    world.era = "ancient";
    mkFaction(world, "秦", { prestige: 15, troops: 90 });
    const rng = () => 0;
    const events = selectHistoricalEvents(world, rng, 10);
    const shangYang = events.find((e) => e.id.includes("shang_yang"));
    expect(shangYang).toBeUndefined();
  });

  it("概率过滤：高 RNG 值不触发低概率事件", () => {
    const world = createWorld(42);
    world.era = "classical";
    mkFaction(world, "秦", { prestige: 15, troops: 90 });
    const rng = () => 0.99; // 大于所有事件概率
    const events = selectHistoricalEvents(world, rng, 10);
    expect(events.length).toBe(0);
  });

  it("事件库覆盖各时代", () => {
    const eras = new Set(HISTORICAL_EVENTS.map((e) => e.era));
    expect(eras.has("ancient")).toBe(true);
    expect(eras.has("classical")).toBe(true);
    expect(eras.has("medieval")).toBe(true);
    expect(eras.has("modern")).toBe(true);
  });
});
