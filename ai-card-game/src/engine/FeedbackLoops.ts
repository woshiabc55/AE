import type { FeedbackLoop, World, CausalGraph, Verdict } from "@/types";

/**
 * 反馈回路（Feedback Loop）注册表。
 * 规则引擎升级为"反馈结构感知"：建模正/负/延迟反馈回路。
 * - 正反馈（reinforcing）：技术→生产力→研究投入→技术（滚雪球，需负反馈制衡）
 * - 负反馈（balancing）：扩张→腐败→稳定度下降→内乱→收缩（自我调节）
 * - 延迟反馈（delayed）：政策后果在 N 回合后显现（历史感核心来源）
 */
export class FeedbackLoopRegistry {
  private loops = new Map<string, FeedbackLoop>();

  register(loop: FeedbackLoop): void {
    this.loops.set(loop.id, loop);
  }

  unregister(id: string): void {
    this.loops.delete(id);
  }

  get(id: string): FeedbackLoop | undefined {
    return this.loops.get(id);
  }

  list(): FeedbackLoop[] {
    return Array.from(this.loops.values());
  }

  /** 评估所有活跃反馈回路，返回软规则违反的降级建议 */
  evaluate(graph: CausalGraph, state: World): Verdict[] {
    const verdicts: Verdict[] = [];
    for (const loop of this.loops.values()) {
      const v = loop.constraint(graph, state);
      if (v.level !== "ok") verdicts.push(v);
    }
    return verdicts;
  }

  /** 活跃反馈回路数（复杂度度量） */
  count(): number {
    return this.loops.size;
  }
}
