import { z } from "zod";
import type { ComponentName } from "@/types";

/**
 * Zod 结构化契约 — 约束 AI 输出，控制"AI 自由度"（复杂度度量之一）。
 * AI 返回的数据必须通过 schema 校验，否则降级到 fallback。
 */

export const ComponentNameSchema = z.enum([
  "FactionC",
  "MilitaryC",
  "EconomicC",
  "CulturalC",
  "TerritoryC",
  "MemoryC",
  "EntropyC",
  "HandC",
]);

export const ComponentDeltaSchema = z.object({
  entity: z.string(),
  component: ComponentNameSchema,
  patch: z.record(z.string(), z.unknown()),
});

export const TrendSchema = z.object({
  id: z.string(),
  description: z.string(),
  era: z.enum(["ancient", "classical", "medieval", "modern"]),
  inevitability: z.number().min(0).max(1),
});

export const ContingencySchema = z.object({
  id: z.string(),
  description: z.string(),
  type: z.string(),
  deltas: z.array(ComponentDeltaSchema),
  probability: z.number().min(0).max(1),
});

export const CausalHookSchema = z.object({
  eventId: z.string(),
  description: z.string(),
  expectedOutcome: z.string().optional(),
});

export const HistoryAdvanceSchema = z.object({
  macro: z.object({
    trend: z.array(TrendSchema),
    nextEraCandidate: z
      .enum(["ancient", "classical", "medieval", "modern"])
      .optional(),
  }),
  meso: z.object({
    contingencies: z.array(ContingencySchema),
  }),
  narrativeSeed: z.string(),
  causalHooks: z.array(CausalHookSchema),
});

export const DirectorDirectiveSchema = z.object({
  tensionTarget: z.number().min(0).max(100),
  theme: z.string(),
  pacing: z.enum(["tense", "release", "build"]),
  budgetAllocation: z.object({
    strong: z.number(),
    fast: z.number(),
  }),
});

export const CardTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["military", "economic", "cultural", "diplomatic", "event"]),
  era: z.enum(["ancient", "classical", "medieval", "modern"]),
  cost: z.record(z.string(), z.number()),
  effects: z.array(z.unknown()),
  evolvesFrom: z.string().optional(),
  semanticEdges: z.array(z.unknown()),
  historicalRef: z.string().optional(),
  flavor: z.string().optional(),
});

export const DialogueOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  asymmetricInfo: z.string().optional(),
  consequences: z.string().optional(),
});

export const DialogueTurnSchema = z.object({
  id: z.string(),
  speaker: z.string(),
  text: z.string(),
  options: z.array(DialogueOptionSchema).optional(),
});

export type { ComponentName };
