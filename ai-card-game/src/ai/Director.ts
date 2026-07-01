import type {
  DirectorDirective,
  World,
  CausalGraph,
} from "@/types";
import { aiService } from "./AIService";
import { DirectorDirectiveSchema } from "./schemas";
import { directorFallback } from "./fallbacks";

export interface DirectorInput {
  turn: number;
  rng: () => number;
}

/**
 * Director AI（导演）— 多智能体编排器。
 * 它是"元 AI"——不生成游戏内容，而是生成"约束其他 AI 的元规则"。
 *
 * 职责：
 * - 叙事张力曲线：维持"张力—释放—再积聚"节奏（三幕剧节拍器）
 * - 主题一致性：确保本局有贯穿主题
 * - 节奏控制：动态调节事件密度
 * - 预算分配：在 token 预算内决定哪些节点调用强模型
 */
export class Director {
  private current: DirectorDirective | null = null;

  async direct(input: DirectorInput): Promise<DirectorDirective> {
    const fallback = directorFallback({ turn: input.turn, rng: input.rng });
    const { data, trace } = await aiService.request<DirectorDirective>({
      task: "director",
      input: { turn: input.turn },
      schema: DirectorDirectiveSchema,
      fallback,
      tier: "fast",
    });
    this.current = data;
    void trace;
    return data;
  }

  currentDirective(): DirectorDirective | null {
    return this.current;
  }

  /** 评估叙事张力是否达到目标 */
  evaluateTension(graph: CausalGraph, world: World): number {
    // 简化：用近期事件密度与冲突类型估算张力
    const recentTurns = 3;
    let tension = 20;
    const nodes = Array.from(graph.nodes.values()).slice(-recentTurns * 4);
    for (const e of nodes) {
      if (e.type === "WAR_DECLARED" || e.type === "REBELLION") tension += 15;
      if (e.type === "ALLIANCE_FORMED") tension -= 5;
      if (e.type === "TECH_BREAKTHROUGH") tension += 3;
    }
    return Math.min(100, Math.max(0, tension));
  }
}
