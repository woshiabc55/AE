import type {
  HistoryAdvance,
  DirectorDirective,
  CardTemplate,
  DialogueTurn,
  Era,
  ComponentDelta,
  EventType,
  AITier,
} from "@/types";
import { ERA_ORDER, ERA_LABELS } from "@/types";

/**
 * 纯规则兜底（tier: rule）— 当 LLM 不可用或降级时使用。
 * 这是"涌现—约束—演化"中的约束兜底：保证游戏可运行，复杂度可控。
 * 所有兜底均为确定性，配合种子 RNG 可复现。
 */

const ARMY_VERBS = ["集结", "征召", "整饬", "操练"];
const EVENTS: { type: EventType; desc: string; deltas: (e: string) => ComponentDelta[] }[] = [
  {
    type: "TECH_BREAKTHROUGH",
    desc: "工匠们在反复试验中改良了冶铁工艺。",
    deltas: (e) => [{ entity: e, component: "MilitaryC", patch: { techLevel: 1 } }],
  },
  {
    type: "FAMINE",
    desc: "连年旱灾席卷乡野，粮仓告急。",
    deltas: (e) => [{ entity: e, component: "EconomicC", patch: { food: -20 } }],
  },
  {
    type: "REBELLION",
    desc: "苛政之下，地方豪强揭竿而起。",
    deltas: (e) => [
      { entity: e, component: "MilitaryC", patch: { morale: -10 } },
      { entity: e, component: "EconomicC", patch: { gold: -15 } },
    ],
  },
];

/** 历史 AI 规则兜底 */
export function historyFallback(opts: {
  era: Era;
  turn: number;
  entities: string[];
  rng: () => number;
}): HistoryAdvance {
  const { era, turn, entities, rng } = opts;
  const idx = ERA_ORDER.indexOf(era);
  const next = ERA_ORDER[idx + 1];
  const contingencies = entities.slice(0, 2).map((e) => {
    const tpl = EVENTS[Math.floor(rng() * EVENTS.length)];
    return {
      id: `con_${turn}_${e}`,
      description: tpl.desc,
      type: tpl.type,
      deltas: tpl.deltas(e),
      probability: 0.3 + rng() * 0.4,
    };
  });

  return {
    macro: {
      trend: [
        {
          id: `trend_${turn}`,
          description: `${ERA_LABELS[era]}的生产力缓慢积累，向更复杂的组织形态演进。`,
          era,
          inevitability: 0.7,
        },
      ],
      nextEraCandidate: turn >= 8 && next ? next : undefined,
    },
    meso: { contingencies },
    narrativeSeed: `第 ${turn + 1} 回合，${ERA_LABELS[era]}的画卷徐徐展开。`,
    causalHooks: [],
  };
}

/** Director AI 规则兜底 — 三幕剧节拍器 */
export function directorFallback(opts: {
  turn: number;
  rng: () => number;
}): DirectorDirective {
  const { turn, rng } = opts;
  // 张力—释放—再积聚 的节奏
  const phase = turn % 6;
  const pacing: DirectorDirective["pacing"] =
    phase < 2 ? "build" : phase < 4 ? "tense" : "release";
  const tensionTarget =
    pacing === "build" ? 30 + rng() * 20 : pacing === "tense" ? 70 + rng() * 20 : 20 + rng() * 15;
  return {
    tensionTarget: Math.round(tensionTarget),
    theme: "中央集权与地方自治的张力",
    pacing,
    budgetAllocation: { strong: 200, fast: 800 },
  };
}

/** 卡牌 AI 规则兜底 — 从演化树中取当前时代卡 */
export function cardFallback(opts: {
  era: Era;
  pool: CardTemplate[];
  rng: () => number;
}): CardTemplate {
  const { era, pool, rng } = opts;
  const candidates = pool.filter((c) => c.era === era);
  if (candidates.length === 0) return pool[0];
  return candidates[Math.floor(rng() * candidates.length)];
}

/** 对话 AI 规则兜底 */
export function dialogueFallback(opts: {
  npcName: string;
  npcTitle: string;
  rng: () => number;
}): DialogueTurn {
  const { npcName, npcTitle, rng } = opts;
  const lines = [
    `${npcName}微微颔首，目光深邃："局势瞬息万变，阁下有何高见？"`,
    `"天下熙熙，皆为利来。"${npcName}捻须而言，"阁下此来，所求为何？"`,
    `${npcName}轻叩案几："兵者，国之大事。不可不察。"`,
    `"礼崩乐坏久矣。"${npcName}叹道，"吾辈当何以自处？"`,
  ];
  const text = lines[Math.floor(rng() * lines.length)];
  return {
    id: `dia_${npcName}_${Math.floor(rng() * 1e6)}`,
    speaker: npcName,
    text,
    options: [
      { id: "o1", text: "陈述己方立场，争取合作", consequences: "关系改善" },
      { id: "o2", text: "暗示对方弱点，施加压力", consequences: "信息暴露" },
      { id: "o3", text: "保持沉默，观察其反应", consequences: "心智模型更新", asymmetricInfo: `${npcTitle}似有隐瞒` },
    ],
  };
}

/** 对手 AI 规则兜底 — 简单效用决策 */
export function opponentFallback(opts: {
  selfId: string;
  rng: () => number;
}): { action: string; reasoning: string } {
  const { rng } = opts;
  const actions = [
    { action: "EXPAND", reasoning: "趁势扩张领土，积累实力。" },
    { action: "FORTIFY", reasoning: "加固防御，等待时机。" },
    { action: "ALLY", reasoning: "寻求结盟以制衡强敌。" },
    { action: "RAID", reasoning: "袭扰敌方补给线，削弱其经济。" },
  ];
  return actions[Math.floor(rng() * actions.length)];
}

export function tierFor(budget: number, fallbackThreshold = 0): AITier {
  // 预算不足时降级到规则兜底
  return budget <= fallbackThreshold ? "rule" : "fast";
}
