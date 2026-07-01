// CommandBus：写路径唯一入口
// 流程：命令 → RuleEngine.authorize(硬规则裁决) → RuleEngine.produce(产出Effect) → StateManager.applyEffects → EventBus.emit
// AI 永远不直接写状态，只通过命令/提议经此入口间接影响。

import type { Command, GameEvent, Verdict } from '../types';
import type { World } from '../ecs/World';
import type { RuleEngine } from './RuleEngine';
import type { StateManager } from './StateManager';
import type { EventBus } from './EventBus';

export interface DispatchResult {
  ok: boolean;
  reason?: string;
  event?: GameEvent;
}

const EVENT_TYPE_BY_COMMAND: Record<Command['type'], GameEvent['type']> = {
  PLAY_CARD: 'CARD_PLAYED',
  END_TURN: 'TURN_ENDED',
  ADVANCE_ERA: 'ERA_ADVANCED',
  DRAW_CARD: 'CARD_DRAWN',
};

export class CommandBus {
  constructor(
    private rules: RuleEngine,
    private state: StateManager,
    private bus: EventBus,
  ) {}

  get world(): World {
    return this.state.world;
  }

  dispatch(cmd: Command): DispatchResult {
    // 1. 硬规则裁决合法性
    const verdict: Verdict = this.rules.authorize(cmd, this.state.world);
    if (!verdict.ok) return { ok: false, reason: (verdict as { reason: string }).reason };

    // 2. 规则产出结构化效果（白箱）
    const effects = this.rules.produce(cmd, this.state.world);

    // 3. 应用效果 → 事件 → 广播
    const event = this.state.applyEffects(effects, {
      commandType: cmd.type,
      source: cmd.source,
      eventType: EVENT_TYPE_BY_COMMAND[cmd.type],
    });
    this.bus.emit(event);

    return { ok: true, event };
  }
}
