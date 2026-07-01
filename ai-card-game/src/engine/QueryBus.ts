import type { WorldSnapshot } from "@/types";

/**
 * QueryBus（读路径）— CQRS 的查询总线。
 * UI 需要的视图（手牌列表、势力面板）由事件投影重算，可缓存、可版本化。
 * 读写分离让复杂 UI 不阻塞核心循环。
 *
 * Projection 只读，不触发命令。
 */
export interface Projection<T = unknown> {
  name: string;
  /** 重算投影（从事件流重建视图快照） */
  recompute(): T;
  /** 获取当前投影值 */
  get(): T;
}

export class QueryBus {
  private projections = new Map<string, Projection>();

  register(projection: Projection): void {
    this.projections.set(projection.name, projection);
  }

  get<T>(name: string): Projection<T> | undefined {
    return this.projections.get(name) as Projection<T> | undefined;
  }

  /** 重算所有投影 */
  recomputeAll(): void {
    for (const p of this.projections.values()) {
      p.recompute();
    }
  }

  list(): string[] {
    return Array.from(this.projections.keys());
  }
}

/** 存档元数据（用于续局书架） */
export interface SaveMeta {
  saveId: string;
  turn: number;
  era: string;
  factionName: string;
  ts: number;
  snapshot?: WorldSnapshot;
}

export type { WorldSnapshot };
