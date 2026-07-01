import type { CardTemplate, Era, EntityId } from "@/types";
import { aiService } from "../AIService";
import { CardTemplateSchema } from "../schemas";
import { cardFallback } from "../fallbacks";
import type { CausalHook } from "@/types";
import type { DirectorDirective } from "@/types";

export interface CardAgentInput {
  era: Era;
  pool: CardTemplate[];
  rng: () => number;
  causalHooks?: CausalHook[];
  directive?: DirectorDirective;
}

/**
 * 卡牌 AI 智能体 — 卡牌即历史命题。
 * AI 生成新卡时，必须声明它"回应"了哪个历史因果钩子——
 * 卡牌不是凭空出现，而是历史情境的可玩化产物。
 */
export async function generateCard(input: CardAgentInput): Promise<CardTemplate> {
  const fallback = cardFallback({ era: input.era, pool: input.pool, rng: input.rng });
  const { data } = await aiService.request<CardTemplate>({
    task: "card_generate",
    input: { era: input.era, pool: input.pool.map((c) => c.id) },
    schema: CardTemplateSchema,
    causalContext: input.causalHooks,
    directorConstraints: input.directive,
    fallback,
    tier: "fast",
  });
  return data;
}

/** 给实体发牌（从牌池抽卡） */
export async function dealCards(
  entity: EntityId,
  pool: CardTemplate[],
  era: Era,
  rng: () => number,
  count: number
): Promise<CardTemplate[]> {
  const dealt: CardTemplate[] = [];
  for (let i = 0; i < count; i++) {
    const card = await generateCard({ era, pool, rng });
    dealt.push(card);
  }
  return dealt;
}
