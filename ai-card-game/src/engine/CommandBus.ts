import { nanoid } from "nanoid";
import type { GameCommand, GameEvent, World, CausalGraph, ComponentDelta, EventId } from "@/types";
import type { RuleEngine } from "./RuleEngine";
import type { EventBus } from "./EventBus";
import type { EventStore } from "@/db/eventStore";
import type { CausalGraph as CG } from "@/types";
import { addEvent } from "./CausalGraph";

export interface CommandResult {
  accepted: boolean;
  events: GameEvent[];
  reason: string;
  degradedDeltas: ComponentDelta[];
}

/**
 * CommandBus（写路径）— CQRS 的命令总线。
 * 玩家/AI 发起命令 → 规则引擎裁决 → 产出事件 → 入库。
 * 写路径严格、可验证。
 */
export class CommandBus {
  constructor(
    private ruleEngine: RuleEngine,
    private eventBus: EventBus,
    private eventStore: EventStore,
    private graph: CG
  ) {}

  /**
   * 派发命令：裁决 → 产出事件 → 持久化 → 广播。
   * @param produceEvents 由各 system 注入：根据命令+裁决结果生成事件
   */
  async dispatch(
    cmd: GameCommand,
    world: World,
    produceEvents: (cmd: GameCommand, degradedDeltas: ComponentDelta[]) => GameEvent[]
  ): Promise<CommandResult> {
    // 1. 规则引擎三重校验
    const { verdict, degradedDeltas } = this.ruleEngine.validate(cmd, world, this.graph);

    if (verdict.level === "reject") {
      return { accepted: false, events: [], reason: verdict.reason, degradedDeltas: [] };
    }

    // 2. 生成事件（应用降级修正）
    const events = produceEvents(cmd, degradedDeltas);

    // 3. 接入因果图 + 持久化 + 广播
    for (const event of events) {
      addEvent(this.graph, event);
      await this.eventStore.append(event);
      this.eventBus.emit(event);
    }

    return { accepted: true, events, reason: verdict.reason, degradedDeltas };
  }

  /** 构造事件的辅助函数（system 共用） */
  static buildEvent(
    partial: Omit<GameEvent, "id"> & { id?: string }
  ): GameEvent {
    return { id: partial.id ?? `evt_${nanoid(12)}`, ...partial };
  }
}

export type { EventId };
