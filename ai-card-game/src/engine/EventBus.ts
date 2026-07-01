import type { GameEvent, EventType } from "@/types";

type Handler = (event: GameEvent) => void;

/**
 * EventBus — 事件分发。
 * EventStore 写入后广播，Projection 订阅重算视图。
 */
export class EventBus {
  private handlers = new Map<EventType | "*", Set<Handler>>();

  on(event: EventType | "*", handler: Handler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: EventType | "*", handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: GameEvent): void {
    // 精确订阅
    this.handlers.get(event.type)?.forEach((h) => h(event));
    // 通配订阅
    this.handlers.get("*")?.forEach((h) => h(event));
  }
}
