// StateManager：状态机 + 事件溯源 + 快照重放
// - timeline 是真相来源（不可变事件日志）
// - undo 用快照栈回退（最简单可靠）
// - replay 从空 World 重放 timeline，验证确定性（P0 兑现"可重放"承诺）

import type { Command, ComponentDelta, Effect, Era, GameEvent, EventType } from '../types';
import { World } from '../ecs/World';
import { CausalGraph } from './EventBus';

export interface ApplyOptions {
  commandType?: Command['type'];
  source?: GameEvent['source'];
  causedBy?: string;
  flavor?: string;
  eventType?: EventType;
}

export class StateManager {
  world: World;
  timeline: GameEvent[] = [];
  private snapshots: WorldSnapshotRef[] = []; // undo 快照栈
  graph = new CausalGraph();
  private initialSnapshot: import('../ecs/World').WorldSnapshot;

  constructor(world?: World) {
    this.world = world ?? new World();
    // 记录初始快照：bootstrap 直接构建的初始状态（未走事件流）。
    // replay 从此快照重放 timeline，保证重建结果与当前状态一致。
    this.initialSnapshot = this.world.snapshot();
  }

  /** 应用一组 Effect：先存快照 → 应用到 World → 封装为不可变事件 → 入因果图 */
  applyEffects(effects: Effect[], opt: ApplyOptions = {}): GameEvent {
    // 1. 存快照（undo 用）
    this.snapshots.push({ snap: this.world.snapshot(), len: this.timeline.length });

    // 2. 应用效果到 World，收集结构化 Delta
    const deltas: ComponentDelta[] = [];
    let flavor = opt.flavor;
    for (const e of effects) {
      if (e.kind === 'LOG_FLAVOR') {
        flavor = flavor ? `${flavor}\n${e.text}` : e.text;
        continue;
      }
      deltas.push(...this.world.applyEffect(e));
    }

    // 3. 封装为不可变事件
    const meta = this.world.meta();
    const event: GameEvent = {
      id: World.eventId(),
      type: opt.eventType ?? 'GAME_EVENT',
      turn: meta.turn,
      era: meta.era as Era,
      source: opt.source ?? 'system',
      causedBy: opt.causedBy,
      commandType: opt.commandType,
      deltas,
      flavor,
      ts: Date.now(),
    };

    // 4. 入 timeline + 因果图
    this.timeline.push(event);
    this.graph.add(event);
    return event;
  }

  /** 回滚最近一个事件（快照回退，O(1) 重建） */
  undo(): GameEvent | null {
    const event = this.timeline.pop();
    if (!event) return null;
    const ref = this.snapshots.pop();
    if (ref) this.world.restore(ref.snap);
    return event;
  }

  /** 回滚到指定事件数（批量 undo） */
  rollbackTo(targetLen: number): void {
    while (this.timeline.length > targetLen) this.undo();
  }

  /** 全量重放：从初始快照重建状态。验证确定性（AI 输出已随事件持久化，不重新调用） */
  replay(events?: GameEvent[]): World {
    const list = events ?? this.timeline;
    const w = new World();
    w.restore(this.initialSnapshot);
    for (const e of list) {
      for (const d of e.deltas) w.applyDelta(d);
    }
    return w;
  }

  /** 一致性自检：重放结果应与当前 World 快照等价（P0 验收用） */
  verifyReplay(): boolean {
    const rebuilt = this.replay();
    const a = JSON.stringify(this.world.snapshot());
    const b = JSON.stringify(rebuilt.snapshot());
    return a === b;
  }

  turn(): number {
    return this.world.meta().turn;
  }
  era(): Era {
    return this.world.meta().era;
  }
}

interface WorldSnapshotRef {
  snap: import('../ecs/World').WorldSnapshot;
  len: number;
}
