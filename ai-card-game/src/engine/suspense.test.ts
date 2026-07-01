import { describe, it, expect } from "vitest";
import {
  createCausalGraph,
  addEvent,
  getEdgeWeight,
  getUnresolvedSuspense,
  getDueSuspense,
  markRevealed,
  getForeshadowChain,
} from "@/engine/CausalGraph";
import { CommandBus } from "@/engine/CommandBus";
import type { GameEvent } from "@/types";

function mkEvent(overrides: Partial<GameEvent>): GameEvent {
  return CommandBus.buildEvent({
    type: "NARRATIVE_SEED",
    turn: 0,
    era: "ancient",
    source: "ai",
    entityDeltas: [],
    ...overrides,
  });
}

describe("因果图悬疑系统", () => {
  it("事件因果强度按类型自动计算", () => {
    const graph = createCausalGraph();
    const warEvent = mkEvent({ type: "BATTLE_RESOLVED", turn: 1 });
    const turnEvent = mkEvent({ type: "TURN_ADVANCE", turn: 1 });
    addEvent(graph, warEvent);
    addEvent(graph, turnEvent);
    const warWeight = graph.nodes.get(warEvent.id)?.causalWeight ?? 0;
    const turnWeight = graph.nodes.get(turnEvent.id)?.causalWeight ?? 0;
    expect(warWeight).toBeGreaterThan(turnWeight); // 战斗事件强度 > 回合推进
  });

  it("埋伏笔事件因果强度加成", () => {
    const graph = createCausalGraph();
    const seedEvent = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 1,
      foreshadows: ["evt_future_reveal"],
    });
    const plainEvent = mkEvent({ type: "NARRATIVE_SEED", turn: 1 });
    addEvent(graph, seedEvent);
    addEvent(graph, plainEvent);
    const seedWeight = graph.nodes.get(seedEvent.id)?.causalWeight ?? 0;
    const plainWeight = graph.nodes.get(plainEvent.id)?.causalWeight ?? 0;
    expect(seedWeight).toBeGreaterThan(plainWeight); // 伏笔事件强度更高
  });

  it("getEdgeWeight 返回子事件因果强度", () => {
    const graph = createCausalGraph();
    const parent = mkEvent({ type: "TURN_ADVANCE", turn: 1 });
    const child = mkEvent({ type: "BATTLE_RESOLVED", turn: 2, causedBy: parent.id });
    addEvent(graph, parent);
    addEvent(graph, child);
    const weight = getEdgeWeight(graph, parent.id, child.id);
    expect(weight).toBeGreaterThan(0.5); // 战斗事件强度高
  });

  it("getUnresolvedSuspense 返回未揭示悬念", () => {
    const graph = createCausalGraph();
    const suspenseEvent = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 1,
      narrativeLayer: "hidden",
      suspense: {
        question: "谁是内奸？",
        revealByTurn: 5,
        revealed: false,
      },
    });
    const revealedEvent = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 2,
      suspense: {
        question: "秦王为何犹豫？",
        revealByTurn: 3,
        revealed: true,
      },
    });
    addEvent(graph, suspenseEvent);
    addEvent(graph, revealedEvent);
    const unresolved = getUnresolvedSuspense(graph);
    expect(unresolved.length).toBe(1);
    expect(unresolved[0].suspense?.question).toBe("谁是内奸？");
  });

  it("getDueSuspense 返回已到揭示时机的悬念", () => {
    const graph = createCausalGraph();
    const dueEvent = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 1,
      suspense: { question: "Q1", revealByTurn: 3, revealed: false },
    });
    const notYetEvent = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 1,
      suspense: { question: "Q2", revealByTurn: 10, revealed: false },
    });
    addEvent(graph, dueEvent);
    addEvent(graph, notYetEvent);
    const due = getDueSuspense(graph, 5);
    expect(due.length).toBe(1);
    expect(due[0].suspense?.question).toBe("Q1");
  });

  it("markRevealed 标记悬念已揭示并建立因果链", () => {
    const graph = createCausalGraph();
    const seed = mkEvent({
      type: "NARRATIVE_SEED",
      turn: 1,
      suspense: { question: "Q", revealByTurn: 5, revealed: false },
    });
    const reveal = mkEvent({ type: "NARRATIVE_SEED", turn: 5 });
    addEvent(graph, seed);
    addEvent(graph, reveal);
    markRevealed(graph, seed.id, reveal.id);
    expect(graph.nodes.get(seed.id)?.suspense?.revealed).toBe(true);
    expect(graph.nodes.get(seed.id)?.foreshadows).toContain(reveal.id);
    expect(graph.nodes.get(reveal.id)?.reveals).toContain(seed.id);
  });

  it("getForeshadowChain 返回伏笔揭示对", () => {
    const graph = createCausalGraph();
    const seed = mkEvent({ type: "NARRATIVE_SEED", turn: 1 });
    const reveal = mkEvent({ type: "NARRATIVE_SEED", turn: 5 });
    addEvent(graph, seed);
    addEvent(graph, reveal);
    markRevealed(graph, seed.id, reveal.id);
    const chain = getForeshadowChain(graph, seed.id);
    expect(chain.length).toBe(1);
    expect(chain[0].seed).toBe(seed.id);
    expect(chain[0].revealed).toBe(reveal.id);
  });

  it("叙事层级三态：surface/hidden/deep", () => {
    const graph = createCausalGraph();
    const surface = mkEvent({ type: "TURN_ADVANCE", turn: 1, narrativeLayer: "surface" });
    const hidden = mkEvent({ type: "NARRATIVE_SEED", turn: 2, narrativeLayer: "hidden" });
    const deep = mkEvent({ type: "NARRATIVE_SEED", turn: 3, narrativeLayer: "deep" });
    addEvent(graph, surface);
    addEvent(graph, hidden);
    addEvent(graph, deep);
    expect(graph.nodes.get(surface.id)?.narrativeLayer).toBe("surface");
    expect(graph.nodes.get(hidden.id)?.narrativeLayer).toBe("hidden");
    expect(graph.nodes.get(deep.id)?.narrativeLayer).toBe("deep");
  });
});
