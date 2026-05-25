import { EventEmitter } from "events";

type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

interface EventSubscription {
  eventId: string;
  handler: EventHandler;
  once: boolean;
}

interface EventRecord {
  eventId: string;
  payload: unknown;
  timestamp: number;
}

interface EventBusOptions {
  maxHistorySize: number;
  maxListenersPerEvent: number;
  asyncTimeout: number;
}

const DEFAULT_OPTIONS: EventBusOptions = {
  maxHistorySize: 1000,
  maxListenersPerEvent: 50,
  asyncTimeout: 30000,
};

class EventBus {
  private emitter: EventEmitter;
  private subscriptions: Map<string, Set<EventSubscription>>;
  private history: EventRecord[];
  private options: EventBusOptions;

  constructor(options: Partial<EventBusOptions> = {}) {
    this.emitter = new EventEmitter();
    this.subscriptions = new Map();
    this.history = [];
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  on<T = unknown>(eventId: string, handler: EventHandler<T>): () => void {
    this.validateListenerCount(eventId);
    const subscription: EventSubscription = {
      eventId,
      handler: handler as EventHandler,
      once: false,
    };
    if (!this.subscriptions.has(eventId)) {
      this.subscriptions.set(eventId, new Set());
    }
    this.subscriptions.get(eventId)!.add(subscription);
    this.emitter.on(eventId, handler as EventHandler);
    return () => {
      this.off(eventId, handler);
    };
  }

  once<T = unknown>(eventId: string, handler: EventHandler<T>): () => void {
    this.validateListenerCount(eventId);
    const wrappedHandler: EventHandler<T> = (payload: T) => {
      this.removeSubscription(eventId, handler as EventHandler);
      handler(payload);
    };
    const subscription: EventSubscription = {
      eventId,
      handler: wrappedHandler as EventHandler,
      once: true,
    };
    if (!this.subscriptions.has(eventId)) {
      this.subscriptions.set(eventId, new Set());
    }
    this.subscriptions.get(eventId)!.add(subscription);
    this.emitter.once(eventId, wrappedHandler as EventHandler);
    return () => {
      this.removeSubscription(eventId, wrappedHandler as EventHandler);
      this.emitter.removeListener(eventId, wrappedHandler as EventHandler);
    };
  }

  off<T = unknown>(eventId: string, handler: EventHandler<T>): void {
    this.removeSubscription(eventId, handler as EventHandler);
    this.emitter.removeListener(eventId, handler as EventHandler);
  }

  emit<T = unknown>(eventId: string, payload: T): boolean {
    this.recordHistory(eventId, payload);
    return this.emitter.emit(eventId, payload);
  }

  async emitAsync<T = unknown>(eventId: string, payload: T): Promise<void> {
    this.recordHistory(eventId, payload);
    const listeners = this.emitter.listeners(eventId) as EventHandler<T>[];
    const promises = listeners.map((handler) => {
      const result = handler(payload);
      if (result instanceof Promise) {
        return Promise.race([
          result,
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Async handler timeout for event: ${eventId}`)),
              this.options.asyncTimeout
            )
          ),
        ]);
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  }

  removeAllListeners(eventId?: string): void {
    if (eventId) {
      this.subscriptions.delete(eventId);
      this.emitter.removeAllListeners(eventId);
    } else {
      this.subscriptions.clear();
      this.emitter.removeAllListeners();
    }
  }

  listenerCount(eventId: string): number {
    return this.emitter.listenerCount(eventId);
  }

  eventNames(): string[] {
    return this.emitter.eventNames() as string[];
  }

  getHistory(eventId?: string): EventRecord[] {
    if (eventId) {
      return this.history.filter((record) => record.eventId === eventId);
    }
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  waitFor<T = unknown>(eventId: string, timeoutMs: number = 5000): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for event: ${eventId}`));
      }, timeoutMs);

      this.once<T>(eventId, (payload: T) => {
        clearTimeout(timer);
        resolve(payload);
      });
    });
  }

  private removeSubscription(eventId: string, handler: EventHandler): void {
    const subs = this.subscriptions.get(eventId);
    if (subs) {
      for (const sub of subs) {
        if (sub.handler === handler) {
          subs.delete(sub);
          break;
        }
      }
      if (subs.size === 0) {
        this.subscriptions.delete(eventId);
      }
    }
  }

  private recordHistory(eventId: string, payload: unknown): void {
    this.history.push({
      eventId,
      payload,
      timestamp: Date.now(),
    });
    if (this.history.length > this.options.maxHistorySize) {
      this.history.shift();
    }
  }

  private validateListenerCount(eventId: string): void {
    const currentCount = this.listenerCount(eventId);
    if (currentCount >= this.options.maxListenersPerEvent) {
      throw new Error(
        `Maximum listeners (${this.options.maxListenersPerEvent}) reached for event: ${eventId}`
      );
    }
  }
}

const globalEventBus = new EventBus();

export { EventBus, globalEventBus };
export type { EventHandler, EventSubscription, EventRecord, EventBusOptions };
