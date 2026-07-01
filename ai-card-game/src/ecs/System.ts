import type { World, GameEvent } from "@/types";

/**
 * System（系统）= 逻辑。
 * 系统按组件类型查询，编排 AI 提议 + 规则裁决。
 * 业务系统（systems/）是 ai 与 engine 的唯一交汇点。
 */
export interface System {
  name: string;
  /** 每回合推演时调用 */
  update(world: World, events: GameEvent[]): void;
}

/** 系统注册表 */
export class SystemRegistry {
  private systems: System[] = [];

  register(system: System): void {
    this.systems.push(system);
  }

  updateAll(world: World, events: GameEvent[]): void {
    for (const sys of this.systems) {
      sys.update(world, events);
    }
  }
}
