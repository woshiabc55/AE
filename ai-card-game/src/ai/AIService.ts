import { nanoid } from "nanoid";
import type { AIRequest, AIResponse, AITrace, AITier } from "@/types";
import type { ZodSchema } from "zod";
import { getDB } from "@/db/database";

/**
 * AIService — 三级调用模型 + 降级 + 缓存。
 * tier: 'strong'（强模型）| 'fast'（快模型）| 'rule'（纯规则兜底）
 *
 * 关键约束：AI 不直接写状态，只产提议。systems 是 ai 与 engine 的唯一交汇点。
 * 可解释性：每次调用附 AITrace，持久化于事件中，重放不重新调用 LLM。
 */

export interface LLMConfig {
  endpoint?: string;
  apiKey?: string;
  strongModel?: string;
  fastModel?: string;
  /** 预算耗尽时自动降级到 rule */
  budgetThreshold?: number;
}

export class AIService {
  private tokensUsed = 0;
  private config: LLMConfig;

  constructor(config: LLMConfig = {}) {
    this.config = { budgetThreshold: 0, ...config };
  }

  configure(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 调用 AI：校验 → 缓存命中 → 调用 LLM（或规则兜底）→ schema 校验 → 降级
   */
  async request<T>(req: AIRequest<T>): Promise<AIResponse<T>> {
    // 缓存命中（hash input + directive）
    const cacheKey = await this.cacheKey(req);
    const cached = await this.loadCache(cacheKey);
    if (cached) {
      return {
        data: cached.data as T,
        trace: { ...cached.trace, traceId: nanoid(8), usedFallback: cached.trace.usedFallback },
      };
    }

    const tier = this.resolveTier(req);
    let data: T | undefined;
    let reasoning: string | undefined;

    if (tier !== "rule" && this.config.endpoint) {
      try {
        const llmResult = await this.callLLM(req, tier);
        const parsed = req.schema.safeParse(llmResult);
        if (parsed.success) {
          data = parsed.data;
          reasoning = llmResult?.reasoning;
        }
      } catch {
        // 调用失败，降级
      }
    }

    const usedFallback = data === undefined;
    if (usedFallback) {
      data = req.fallback;
    }

    const trace: AITrace = {
      traceId: nanoid(8),
      tier,
      tokens: tier === "rule" ? 0 : 100,
      usedFallback,
      reasoning,
      directorDirective: req.directorConstraints?.theme,
    };
    this.tokensUsed += trace.tokens;

    await this.saveCache(cacheKey, data, trace);
    return { data, trace };
  }

  private resolveTier<T>(req: AIRequest<T>): AITier {
    if (req.tier === "rule") return "rule";
    if (!this.config.endpoint) return "rule"; // 无 LLM 端点，纯规则
    if (this.tokensUsed >= (this.config.budgetThreshold ?? Infinity)) return "rule";
    return req.tier;
  }

  private async callLLM(req: AIRequest<unknown>, tier: AITier): Promise<any> {
    const model = tier === "strong" ? this.config.strongModel : this.config.fastModel;
    const res = await fetch(`${this.config.endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: this.buildSystemPrompt(req) },
          { role: "user", content: JSON.stringify(req.input) },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const json = await res.json();
    return JSON.parse(json.choices?.[0]?.message?.content ?? "{}");
  }

  private buildSystemPrompt(req: AIRequest<unknown>): string {
    const parts = [`任务: ${req.task}`];
    if (req.causalContext?.length) {
      parts.push(`因果上下文: ${JSON.stringify(req.causalContext)}`);
    }
    if (req.directorConstraints) {
      parts.push(`导演约束: 张力目标 ${req.directorConstraints.tensionTarget}, 主题 ${req.directorConstraints.theme}, 节奏 ${req.directorConstraints.pacing}`);
    }
    return parts.join("\n");
  }

  private async cacheKey(req: AIRequest<unknown>): Promise<string> {
    const input = JSON.stringify({ task: req.task, input: req.input, tier: req.tier });
    return input;
  }

  private async loadCache(key: string): Promise<{ data: unknown; trace: AITrace } | null> {
    try {
      const db = await getDB();
      const hit = await db.get("aiCache", key);
      return hit ?? null;
    } catch {
      return null;
    }
  }

  private async saveCache(key: string, data: unknown, trace: AITrace): Promise<void> {
    try {
      const db = await getDB();
      await db.put("aiCache", { key, data, trace, ts: Date.now() });
    } catch {
      // 缓存失败不阻塞
    }
  }

  tokensUsedSoFar(): number {
    return this.tokensUsed;
  }

  resetBudget(): void {
    this.tokensUsed = 0;
  }
}

/** 全局单例 */
export const aiService = new AIService();
