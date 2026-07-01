import type {
  Rule,
  GameCommand,
  World,
  CausalGraph,
  Verdict,
  ComponentDelta,
  EventId,
} from "@/types";
import type { FeedbackLoopRegistry } from "./FeedbackLoops";

/**
 * 规则引擎（RuleEngine）— 复杂度控制内核。
 * 规则分三层：
 * - 硬规则：不可违反的物理/逻辑约束（时代不可倒退、资源不可负）
 * - 软规则：反馈回路约束，违反则降级而非拒绝
 * - 涌现规则：由历史推演动态生成（某次"宗教改革"事件后注入新规则）
 *
 * 涌现规则让规则库本身随历史演化——这是复杂度"有方向释放"的终极机制：
 * 规则不是静态铁律，而是历史的沉淀物。
 */
export class RuleEngine {
  private hardRules: Rule[] = [];
  private softRules: Rule[] = [];
  private emergentRules: Rule[] = [];
  private feedback: FeedbackLoopRegistry;

  constructor(feedback: FeedbackLoopRegistry) {
    this.feedback = feedback;
  }

  register(rule: Rule): void {
    if (rule.layer === "hard") this.hardRules.push(rule);
    else if (rule.layer === "soft") this.softRules.push(rule);
    else this.emergentRules.push(rule);
  }

  /** 涌现规则注入：由历史事件触发 */
  injectRule(rule: Rule, injectedBy: EventId): void {
    this.emergentRules.push({ ...rule, layer: "emergent", injectedBy });
  }

  list(): Rule[] {
    return [...this.hardRules, ...this.softRules, ...this.emergentRules];
  }

  /**
   * 三重校验：合法性 → 因果一致性 → 反馈结构
   * 返回裁决结果与可能的降级修正。
   */
  validate(
    cmd: GameCommand,
    state: World,
    graph: CausalGraph
  ): { verdict: Verdict; degradedDeltas: ComponentDelta[] } {
    const degradedDeltas: ComponentDelta[] = [];

    // 1. 硬规则：违反即 reject
    for (const rule of this.hardRules) {
      const v = rule.validate(cmd, state, graph);
      if (v.level === "reject") {
        return { verdict: v, degradedDeltas: [] };
      }
    }

    // 2. 软规则：违反则降级
    for (const rule of this.softRules) {
      const v = rule.validate(cmd, state, graph);
      if (v.level === "warn" && v.degradeTo) {
        degradedDeltas.push(...v.degradeTo);
      }
    }

    // 3. 涌现规则：与软规则同等处理
    for (const rule of this.emergentRules) {
      const v = rule.validate(cmd, state, graph);
      if (v.level === "reject") {
        return { verdict: v, degradedDeltas: [] };
      }
      if (v.level === "warn" && v.degradeTo) {
        degradedDeltas.push(...v.degradeTo);
      }
    }

    // 4. 反馈回路评估
    const feedbackVerdicts = this.feedback.evaluate(graph, state);
    const blocking = feedbackVerdicts.find((v) => v.level === "reject");
    if (blocking) {
      return { verdict: blocking, degradedDeltas: [] };
    }
    for (const v of feedbackVerdicts) {
      if (v.degradeTo) degradedDeltas.push(...v.degradeTo);
    }

    return { verdict: { level: "ok", reason: "通过" }, degradedDeltas };
  }
}
