import type { GameEvent } from "@/types";
import { getDB } from "./database";

/**
 * EventStore — 事件日志，唯一真相来源。
 * 持久化到 IndexedDB，支持追加、按回合查询、全量加载。
 * 可复现性：AI 输出随事件持久化（aiTrace），重放不重新调用 LLM。
 */
export class EventStore {
  private cache: GameEvent[] = [];
  private loaded = false;

  async append(event: GameEvent): Promise<void> {
    const db = await getDB();
    await db.put("events", event);
    this.cache.push(event);
  }

  async appendMany(events: GameEvent[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction("events", "readwrite");
    await Promise.all(events.map((e) => tx.store.put(e)));
    await tx.done;
    this.cache.push(...events);
  }

  async load(): Promise<GameEvent[]> {
    if (this.loaded) return this.cache;
    const db = await getDB();
    this.cache = await db.getAll("events");
    this.cache.sort((a, b) => a.turn - b.turn);
    this.loaded = true;
    return this.cache;
  }

  async byTurn(turn: number): Promise<GameEvent[]> {
    const db = await getDB();
    return db.getAllFromIndex("events", "by-turn", turn);
  }

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear("events");
    this.cache = [];
    this.loaded = true;
  }

  inMemory(): GameEvent[] {
    return this.cache;
  }
}
