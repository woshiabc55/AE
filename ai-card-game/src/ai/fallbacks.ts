import type {
  HistoryAdvance,
  DirectorDirective,
  CardTemplate,
  DialogueTurn,
  Era,
  World,
  ComponentDelta,
  EventType,
  AITier,
  SuspenseDirective,
} from "@/types";
import { ERA_ORDER, ERA_LABELS } from "@/types";
import { selectHistoricalEvents } from "@/game/events";

/**
 * 纯规则兜底（tier: rule）— 当 LLM 不可用或降级时使用。
 * 这是"涌现—约束—演化"中的约束兜底：保证游戏可运行，复杂度可控。
 * 所有兜底均为确定性，配合种子 RNG 可复现。
 */

/** 通用事件兜底（当无历史事件匹配时使用） */
const GENERIC_EVENTS: {
  type: EventType;
  desc: string;
  deltas: (e: string) => ComponentDelta[];
}[] = [
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

/** 历史 AI 规则兜底 — 优先使用历史事件库，集成悬疑叙事 */
export function historyFallback(opts: {
  world: World;
  rng: () => number;
  suspense?: SuspenseDirective;
}): HistoryAdvance {
  const { world, rng, suspense } = opts;
  const { era, turn } = world;
  const entities = Array.from(world.entities.keys());
  const idx = ERA_ORDER.indexOf(era);
  const next = ERA_ORDER[idx + 1];

  // 优先从历史事件库选取（带真实触发条件）
  let contingencies = selectHistoricalEvents(world, rng, 2);

  // 若无历史事件匹配，回退到通用事件（保证每回合有事件发生）
  if (contingencies.length === 0 && entities.length > 0) {
    contingencies = entities.slice(0, 2).map((e) => {
      const tpl = GENERIC_EVENTS[Math.floor(rng() * GENERIC_EVENTS.length)];
      return {
        id: `con_${turn}_${e}`,
        description: tpl.desc,
        type: tpl.type,
        deltas: tpl.deltas(e),
        probability: 0.3 + rng() * 0.4,
      };
    });
  }

  // 悬疑叙事集成：将伏笔种子转化为额外的 contingencies
  if (suspense?.foreshadowsToPlant.length) {
    for (const seed of suspense.foreshadowsToPlant) {
      contingencies.push({
        id: `foreshadow_${turn}_${seed.arcId}`,
        description: seed.hint,
        type: "NARRATIVE_SEED",
        deltas: [],
        probability: 0.9,
        narrativeLayer: "hidden",
        foreshadowTheme: seed.theme,
        involvesNpc: seed.involvesNpc,
      });
    }
  }

  // 悬疑揭示：将揭示事件加入 contingencies
  if (suspense?.suspenseToReveal.length) {
    for (const reveal of suspense.suspenseToReveal) {
      contingencies.push({
        id: `reveal_${turn}_${reveal.arcId}`,
        description: reveal.truth,
        type: "NARRATIVE_SEED",
        deltas: [],
        probability: 1.0,
        narrativeLayer: "deep",
        revealsSeed: reveal.seedEventId,
        involvesNpc: reveal.involvesNpc,
      });
    }
  }

  // 悬疑化的叙事种子：根据张力等级选择不同语气
  const tension = suspense?.tensionLevel ?? 20;
  let narrativeSeed: string;
  if (tension > 70) {
    narrativeSeed = `第 ${turn + 1} 回合，${ERA_LABELS[era]}风云骤紧。暗流汹涌，变局在即。`;
  } else if (tension > 40) {
    narrativeSeed = `第 ${turn + 1} 回合，${ERA_LABELS[era]}的局势渐趋微妙，疑云暗生。`;
  } else if (suspense?.asymmetricHints.length) {
    narrativeSeed = `第 ${turn + 1} 回合，${ERA_LABELS[era]}看似平静，然细察之下，似有隐情。${suspense.asymmetricHints[0]}`;
  } else {
    narrativeSeed = `第 ${turn + 1} 回合，${ERA_LABELS[era]}的画卷徐徐展开。`;
  }

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
    narrativeSeed,
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

/** 卡牌 AI 规则兜底 — 加权抽取，按时代相关度与稀有度 */
export function cardFallback(opts: {
  era: Era;
  pool: CardTemplate[];
  rng: () => number;
}): CardTemplate {
  const { era, pool, rng } = opts;

  // 计算每张卡的权重：
  //   - 当前时代卡：权重 5（最易获得）
  //   - 前一时代卡：权重 2（遗留技术仍可用）
  //   - 后一时代卡：权重 0.3（超前技术罕见）
  //   - 类型稀有度：事件卡 0.6（事件牌少出），其余 1.0
  const eraIdx = (e: Era) => ERA_ORDER.indexOf(e);
  const currentIdx = eraIdx(era);

  const weighted = pool.map((card) => {
    const cardIdx = eraIdx(card.era);
    const diff = cardIdx - currentIdx;
    let eraWeight: number;
    if (diff === 0) eraWeight = 5;
    else if (diff === -1) eraWeight = 2;
    else if (diff > 0) eraWeight = 0.3;
    else eraWeight = 0.8; // 更早的遗留
    const rarityWeight = card.type === "event" ? 0.6 : 1.0;
    return { card, weight: eraWeight * rarityWeight };
  });

  const total = weighted.reduce((s, w) => s + w.weight, 0);
  if (total <= 0) return pool[0];
  let r = rng() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.card;
  }
  return pool[pool.length - 1];
}

/** 对话台词库 — 按 NPC archetype 分类，贴合各色人物口吻 */
const DIALOGUE_LINES: Record<string, string[]> = {
  谋士: [
    "{name}目光如炬，声调低沉：「权柄之要，在于制人而非制于人。阁下以为然否？」",
    "「天下之事，非黑即白者寡，灰色地带方是角力之所。」{name}捻须而言。",
    "{name}展开一卷竹简，指尖轻叩地图：「远交近攻，此乃并吞天下之要略。」",
    "「法、术、势，三者不可偏废。」{name}正色道，「阁下欲以何者先行？」",
    "{name}微微前倾，压低嗓音：「庙堂之上，刀兵之外，方寸之间即是战场。」",
  ],
  国相: [
    "{name}整衣正冠，神色端肃：「邦交之道，以信为本，以利为辅。」",
    "「将相和，则国安；将相失，则国危。」{name}语重心长。",
    "{name}轻抚长须：「兵者不祥之器，不得已而用之。阁下以为当下可避此祸？」",
    "「完璧归赵、渑池之会，皆赖智勇。」{name}叹道，「然今日之势，更胜往昔。」",
    "{name}拱手道：「君之视臣如手足，则臣视君如腹心。愿闻阁下之志。」",
  ],
  学士: [
    "{name}手中拂尘轻摆，谈笑风生：「五德终始，天命流转，阁下可知今为何德？」",
    "「学以致道，非以致用。」{name}摇头叹息，「然世人皆汲汲于功利，悲夫。」",
    "{name}指天画地：「阴阳消长，气数使然。齐之盛衰，观星象可知。」",
    "「稷下论道，百家争鸣。」{name}眉飞色舞，「今日得遇阁下，可愿一辩？」",
    "{name}抚须含笑：「大道至简，然世人好径。阁下所求，为何道也？」",
  ],
};

/** 对话 AI 规则兜底 — 按 archetype 取贴合口吻的台词 */
export function dialogueFallback(opts: {
  npcName: string;
  npcTitle: string;
  archetype: string;
  rng: () => number;
}): DialogueTurn {
  const { npcName, npcTitle, archetype, rng } = opts;
  const pool = DIALOGUE_LINES[archetype] ?? DIALOGUE_LINES["谋士"];
  const template = pool[Math.floor(rng() * pool.length)];
  const text = template.replace(/\{name\}/g, npcName);
  return {
    id: `dia_${npcName}_${Math.floor(rng() * 1e6)}`,
    speaker: npcName,
    text,
    options: [
      { id: "o1", text: "陈述己方立场，争取合作", consequences: "关系改善" },
      { id: "o2", text: "暗示对方弱点，施加压力", consequences: "信息暴露" },
      {
        id: "o3",
        text: "保持沉默，观察其反应",
        consequences: "心智模型更新",
        asymmetricInfo: `${npcTitle}似有隐瞒`,
      },
      {
        id: "o4",
        text: "以利相诱，许以城池财货",
        consequences: "信任度变化",
        asymmetricInfo: `${archetype}类人物对此反应难料`,
      },
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
