// EventBus：所有状态变更通知的唯一出口（读模型投影订阅此处）
// 注意：状态写入由 StateManager 完成，EventBus 仅负责广播已落地的事件。

import type { EventId, GameEvent, EventType } from '../types';

type Handler = (e: GameEvent) => void;

export class EventBus {
  private handlers = new Map<EventType | '*', Set<Handler>>();

  on(type: EventType | '*', fn: Handler): () => void {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(fn);
    return () => set!.delete(fn);
  }

  emit(e: GameEvent): void {
    this.handlers.get(e.type)?.forEach((fn) => fn(e));
    this.handlers.get('*')?.forEach((fn) => fn(e));
  }

  clear(): void {
    this.handlers.clear();
  }
}

// 因果图谱：记录事件间 causedBy 关系，支持祖先链/影响范围查询（P1 反事实推演基础）
export class CausalGraph {
  private nodes = new Map<EventId, GameEvent>();
  private children = new Map<EventId, Set<EventId>>(); // causedBy → 后续事件

  add(e: GameEvent): void {
    this.nodes.set(e.id, e);
    if (e.causedBy) {
      let kids = this.children.get(e.causedBy);
      if (!kids) {
        kids = new Set();
        this.children.set(e.causedBy, kids);
      }
      kids.add(e.id);
    }
  }

  /** 祖先链：沿 causedBy 回溯 */
  ancestors(id: EventId): GameEvent[] {
    const chain: GameEvent[] = [];
    let cur = this.nodes.get(id);
    while (cur?.causedBy) {
      const parent = this.nodes.get(cur.causedBy);
      if (!parent) break;
      chain.push(parent);
      cur = parent;
    }
    return chain;
  }

  /** 后续影响范围：以 id 为因的全部后代 */
  descendants(id: EventId): GameEvent[] {
    const out: GameEvent[] = [];
    const stack = [id];
    const seen = new Set<EventId>();
    while (stack.length) {
      const cur = stack.pop()!;
      if (seen.has(cur)) continue;
      seen.add(cur);
      for (const child of this.children.get(cur) ?? []) {
        const node = this.nodes.get(child);
        if (node) {
          out.push(node);
          stack.push(child);
        }
      }
    }
    return out;
  }

  size(): number {
    return this.nodes.size;
  }
}
