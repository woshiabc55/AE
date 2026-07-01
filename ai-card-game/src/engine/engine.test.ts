import { describe, it, expect } from "vitest";
import {
  createCausalGraph,
  addEvent,
  getAncestors,
  getDescendants,
  counterfactualImpact,
  getOpenHooks,
} from "@/engine/CausalGraph";
import { RuleEngine } from "@/engine/RuleEngine";
import { FeedbackLoopRegistry } from "@/engine/FeedbackLoops";
import { HARD_RULES, SOFT_RULES } from "@/game/rules";
import { RELATION_RULES } from "@/game/relations";
import { FEEDBACK_LOOPS } from "@/game/loops";
import { createWorld, spawnEntity, setComponent } from "@/ecs/World";
import type { GameCommand, GameEvent, MilitaryC, EconomicC, CulturalC, HandC, Era } from "@/types";

/**
 * P0 地基验证 — 确定性引擎：因果图谱 + 规则引擎三重校验。
 * 这是"涌现—约束—演化"中的约束（规则裁决）与演化（因果留痕）内核。
 */
describe("CausalGraph 因果图谱", () => {
  it("建立因果边并查询祖先/后代链", () => {
    const g = createCausalGraph();
    const e1 = mkEvent("e1", 1);
    const e2 = mkEvent("e2", 2, "e1");
    const e3 = mkEvent("e3", 3, "e2");
    addEvent(g, e1);
    addEvent(g, e2);
    addEvent(g, e3);

    expect(getAncestors(g, "e3")).toEqual(["e2", "e1"]);
    expect(getDescendants(g, "e1")).toEqual(["e2", "e3"]);
  });

  it("反事实推演：移除根事件影响全部后代", () => {
    const g = createCausalGraph();
    addEvent(g, mkEvent("root", 1));
    addEvent(g, mkEvent("a", 2, "root"));
    addEvent(g, mkEvent("b", 3, "root"));
    addEvent(g, mkEvent("c", 4, "a"));
    const impact = counterfactualImpact(g, "root");
    expect(impact.sort()).toEqual(["a", "b", "c"]);
  });

  it("提取未闭合的因果钩子", () => {
    const g = createCausalGraph();
    addEvent(g, mkEvent("e1", 1));
    addEvent(g, mkEvent("e2", 2, "e1"));
    const hooks = getOpenHooks(g);
    // e2 是叶子节点 → 可扩展钩子
    expect(hooks.some((h) => h.eventId === "e2")).toBe(true);
  });
});

describe("RuleEngine 规则引擎三重校验", () => {
  function setup() {
    const feedback = new FeedbackLoopRegistry();
    for (const loop of FEEDBACK_LOOPS) feedback.register(loop);
    const engine = new RuleEngine(feedback);
    for (const r of HARD_RULES) engine.register(r);
    for (const r of SOFT_RULES) engine.register(r);
    for (const r of RELATION_RULES) engine.register(r);
    return engine;
  }

  function mkWorld(era: Era = "classical") {
    const world = createWorld(7);
    world.era = era;
    const player = spawnEntity(world);
    setComponent<EconomicC>(world, player, "EconomicC", { gold: 50, food: 50, tradeRoutes: [] });
    setComponent<CulturalC>(world, player, "CulturalC", { prestige: 10, ideas: [] });
    setComponent<MilitaryC>(world, player, "MilitaryC", { troops: 30, morale: 60, techLevel: 1 });
    setComponent<HandC>(world, player, "HandC", { cards: ["trade_caravan", "revolution", "clan_gathering", "bronze_sword"] });
    return { world, player };
  }

  it("硬规则：黄金不足拒绝出牌", () => {
    const engine = setup();
    const { world, player } = mkWorld();
    setComponent<EconomicC>(world, player, "EconomicC", { gold: 5, food: 50, tradeRoutes: [] });
    const cmd: GameCommand = {
      id: "c1", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "trade_caravan" },
    };
    const g = createCausalGraph();
    const { verdict } = engine.validate(cmd, world, g);
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("黄金");
  });

  it("硬规则：威望不足拒绝革命", () => {
    const engine = setup();
    const { world, player } = mkWorld("modern");
    const cmd: GameCommand = {
      id: "c2", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "revolution" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("威望");
  });

  it("合法命令通过校验", () => {
    const engine = setup();
    const { world, player } = mkWorld();
    const cmd: GameCommand = {
      id: "c3", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "trade_caravan" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("ok");
  });

  it("硬规则：卡牌时代不可超前（ancient 纪元不可打 classical 卡）", () => {
    const engine = setup();
    const { world, player } = mkWorld("ancient");
    const cmd: GameCommand = {
      id: "c5", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "trade_caravan" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("时代未至");
  });

  it("硬规则：科技等级不足拒绝高阶卡牌", () => {
    const engine = setup();
    const { world, player } = mkWorld();
    setComponent<HandC>(world, player, "HandC", { cards: ["iron_sword"] });
    const cmd: GameCommand = {
      id: "c6", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "iron_sword" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("科技等级");
  });

  it("硬规则：兵力归零不可出牌（亡国不可兴兵）", () => {
    const engine = setup();
    const { world, player } = mkWorld();
    setComponent<MilitaryC>(world, player, "MilitaryC", { troops: 0, morale: 50, techLevel: 1 });
    const cmd: GameCommand = {
      id: "c7", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "trade_caravan" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("兵力已竭");
  });

  it("硬规则：出牌须持有该牌", () => {
    const engine = setup();
    const { world, player } = mkWorld();
    setComponent<HandC>(world, player, "HandC", { cards: ["bronze_sword"] });
    const cmd: GameCommand = {
      id: "c8", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "trade_caravan" },
    };
    const { verdict } = engine.validate(cmd, world, createCausalGraph());
    expect(verdict.level).toBe("reject");
    expect(verdict.reason).toContain("不在手中");
  });

  it("软规则：扩张过快触发腐败降级", () => {
    const engine = setup();
    const { world, player } = mkWorld("ancient");
    setComponent<MilitaryC>(world, player, "MilitaryC", { troops: 110, morale: 60, techLevel: 1 });
    const cmd: GameCommand = {
      id: "c4", type: "PLAY_CARD", actor: player, turn: 1, payload: { cardId: "clan_gathering" },
    };
    const { verdict, degradedDeltas } = engine.validate(cmd, world, createCausalGraph());
    expect(degradedDeltas.some((d) => d.component === "MilitaryC")).toBe(true);
    expect(verdict.level).toBe("ok"); // 软规则不阻止
  });

  it("涌现规则可动态注入", () => {
    const engine = setup();
    const injected = {
      id: "emergent_reform",
      layer: "emergent" as const,
      description: "宗教改革后注入的新规则",
      validate: () => ({ level: "ok" as const, reason: "通过" }),
    };
    engine.injectRule(injected, "evt_reform_001");
    expect(engine.list().some((r) => r.id === "emergent_reform")).toBe(true);
  });
});

function mkEvent(id: string, turn: number, causedBy?: string): GameEvent {
  return {
    id,
    type: "COMPONENT_PATCHED",
    turn,
    era: "ancient",
    source: "system",
    causedBy,
    entityDeltas: [],
    narrative: `事件 ${id}`,
  };
}
