import type { GameEvent, World, WorldSnapshot, EventId } from "@/types";
import { restore, applyDelta, snapshot } from "@/ecs/World";
import type { CausalGraph } from "@/types";
import { addEvent, createCausalGraph } from "./CausalGraph";

/**
 * StateManager — 快照 + 增量事件重放。
 * 定期快照 + 增量事件重放，平衡性能与可回溯。
 * 可复现性：AI 输出随事件持久化（aiTrace），重放不重新调用 LLM。
 */
export class StateManager {
  private snapshots = new Map<number, WorldSnapshot>();
  private events: GameEvent[] = [];

  /** 记录事件流 */
  record(events: GameEvent[]): void {
    this.events.push(...events);
  }

  /** 定期快照 */
  takeSnapshot(world: World): void {
    this.snapshots.set(world.turn, snapshot(world));
  }

  /** 获取最近快照 */
  latestSnapshot(): WorldSnapshot | undefined {
    const turns = Array.from(this.snapshots.keys()).sort((a, b) => b - a);
    return this.snapshots.get(turns[0] ?? -1);
  }

  /** 从快照 + 增量事件重建世界（可回滚到指定回合） */
  replayTo(turn: number, seed: number, causalGraph?: CausalGraph): World {
    // 找到 <= turn 的最近快照
    const snapTurns = Array.from(this.snapshots.keys())
      .filter((t) => t <= turn)
      .sort((a, b) => b - a);
    const snap = this.snapshots.get(snapTurns[0] ?? -1);

    const world = snap ? restore(snap, seed) : { ...createWorldFresh(seed) };
    const graph = causalGraph ?? createCausalGraph();

    // 重放快照之后、<= turn 的事件
    const startTurn = snap ? snap.turn + 1 : 0;
    for (const event of this.events) {
      if (event.turn < startTurn) {
        addEvent(graph, event); // 重建因果图
        continue;
      }
      if (event.turn > turn) break;
      // 应用增量到世界
      for (const delta of event.entityDeltas) {
        applyDelta(world, delta);
      }
      world.turn = event.turn;
      world.era = event.era;
      addEvent(graph, event);
    }
    return world;
  }

  /** 所有事件（用于投影重算） */
  allEvents(): GameEvent[] {
    return this.events;
  }

  /** 按回合获取事件 */
  eventsByTurn(turn: number): GameEvent[] {
    return this.events.filter((e) => e.turn === turn);
  }

  /** 按来源获取事件 */
  eventsBySource(source: GameEvent["source"]): GameEvent[] {
    return this.events.filter((e) => e.source === source);
  }
}

function createWorldFresh(seed: number): World {
  return {
    turn: 0,
    era: "ancient",
    season: "spring",
    entities: new Map(),
    seed,
  };
}

export type { EventId };
