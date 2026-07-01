// RuleEngine：复杂度控制内核
// 三层规则：硬规则(authorize, 不可违反) / 软规则(降级不拒绝) / 涌现规则(动态注册)
// 规则是"白箱"：所有"如果X则Y"集中于此，可枚举、可测试、可热加载。AI 只生成提议，规则裁决。

import type { Command, Effect, Verdict } from '../types';
import type { World } from '../ecs/World';

export interface Rule {
  id: string;
  on: Command['type'] | '*'; // 订阅的命令类型
  priority: number; // 多规则冲突时的裁决顺序（升序）
  layer: 'hard' | 'soft' | 'emergent';
  /** 硬规则：裁决命令合法性。返回 ok:false 则命令被拒绝 */
  authorize?: (cmd: Command, world: World) => Verdict;
  /** 产出效果：把命令翻译为结构化 Effect 列表（规则白箱的核心） */
  produce?: (cmd: Command, world: World) => Effect[];
}

export class RuleEngine {
  private rules: Rule[] = [];
  private emergent = new Map<string, Rule>(); // 涌现规则：随历史动态注入

  register(rule: Rule): () => void {
    this.rules.push(rule);
    this.sort();
    return () => {
      this.rules = this.rules.filter((r) => r.id !== rule.id);
    };
  }

  /** 涌现规则注入/移除（历史沉淀物，如"宗教改革"后注入新规则） */
  injectEmergent(rule: Rule): void {
    this.emergent.set(rule.id, rule);
    this.register(rule);
  }
  retractEmergent(id: string): void {
    this.emergent.delete(id);
    this.rules = this.rules.filter((r) => r.id !== id);
  }

  private sort(): void {
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  /** 裁决：硬规则全过才合法。软规则违反不拒绝（仅记录，P1 接反馈回路） */
  authorize(cmd: Command, world: World): Verdict {
    for (const r of this.matching(cmd.type)) {
      if (r.layer !== 'hard' || !r.authorize) continue;
      const v = r.authorize(cmd, world);
      if (!v.ok) return v;
    }
    return { ok: true };
  }

  /** 产出效果：所有匹配规则的 produce 按 priority 合并 */
  produce(cmd: Command, world: World): Effect[] {
    const effects: Effect[] = [];
    for (const r of this.matching(cmd.type)) {
      if (r.produce) effects.push(...r.produce(cmd, world));
    }
    return effects;
  }

  private matching(type: Command['type']): Rule[] {
    return this.rules.filter((r) => r.on === type || r.on === '*');
  }

  list(): readonly Rule[] {
    return this.rules;
  }
}
