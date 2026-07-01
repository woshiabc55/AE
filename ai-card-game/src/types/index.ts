// ============================================================================
// 核心类型定义 — AI 战略卡牌对话游戏
// 涌现（AI 提议） · 约束（规则裁决） · 演化（事件溯源）
// ============================================================================

export type EntityId = string;
export type EventId = string;
export type CardId = string;

// ============================================================================
// 时代与文明熵
// ============================================================================
export type Era = "ancient" | "classical" | "medieval" | "modern";

export const ERA_ORDER: Era[] = ["ancient", "classical", "medieval", "modern"];

export const ERA_LABELS: Record<Era, string> = {
  ancient: "封建纪元",
  classical: "变法纪元",
  medieval: "帝国纪元",
  modern: "变革纪元",
};

/** 季节：每 4 回合一轮，影响粮食产出与军事行动 */
export type Season = "spring" | "summer" | "autumn" | "winter";

export const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_LABELS: Record<Season, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

/** 季节对粮食产出的乘数：春耕、秋收、冬藏 */
export const SEASON_FOOD_MULT: Record<Season, number> = {
  spring: 0.6, // 春耕：投入期，产出少
  summer: 0.9, // 夏耘：略有产出
  autumn: 1.6, // 秋收：丰收
  winter: 0.3, // 冬藏：产出极少
};

/** 季节对军事行动的影响：冬征困难，秋高马肥宜战 */
export const SEASON_WAR_MULT: Record<Season, number> = {
  spring: 1.0,
  summer: 1.0,
  autumn: 1.15, // 秋高马肥，战力加成
  winter: 0.6, // 冬征困难，战力衰减
};

/** 不确定性锥宽度：越接近现代，路径依赖越强，AI 自由度越低 */
export const ERA_UNCERTAINTY: Record<Era, number> = {
  ancient: 0.9,
  classical: 0.7,
  medieval: 0.5,
  modern: 0.3,
};

// ============================================================================
// ECS 组件（Component）— 实体含义由挂载的组件决定
// ============================================================================
export interface FactionC {
  name: string;
  color: string;
  isPlayer: boolean;
}

export interface MilitaryC {
  troops: number;
  morale: number; // 0-100
  techLevel: number;
}

export interface EconomicC {
  gold: number;
  food: number;
  tradeRoutes: string[];
}

export interface CulturalC {
  prestige: number; // 0-100
  ideas: string[];
}

export interface TerritoryC {
  provinces: string[];
}

export interface Fact {
  id: string;
  text: string;
  turn: number;
  source?: EntityId;
}

export interface MemoryC {
  facts: Fact[];
  summary: string;
  relationship: Record<string, number>; // EntityId -> 关系值 -100~100
}

export interface EntropyC {
  entropy: number; // 文明复杂度，随历史推进单调增长
  collapsedAt?: number; // 王朝周期重置点
}

export interface HandC {
  cards: CardId[]; // 当前持有的卡牌模板 ID
}

/** 人口组件：人口决定征兵上限与产出基数，随民生起伏 */
export interface PopulationC {
  population: number; // 人口数（万为单位）
  growth: number; // 年增长率（每回合）
  happiness: number; // 民心 0-100
}

/** 组件名 → 组件类型映射 */
export type ComponentName =
  | "FactionC"
  | "MilitaryC"
  | "EconomicC"
  | "CulturalC"
  | "TerritoryC"
  | "MemoryC"
  | "EntropyC"
  | "HandC"
  | "PopulationC";

export type Component =
  | FactionC
  | MilitaryC
  | EconomicC
  | CulturalC
  | TerritoryC
  | MemoryC
  | EntropyC
  | HandC
  | PopulationC;

// ============================================================================
// 事件溯源 + 因果
// ============================================================================
export type EventSource = "player" | "ai" | "rule" | "system";

export type EventType =
  | "TURN_ADVANCE"
  | "ERA_TRANSITION"
  | "CARD_PLAYED"
  | "CARD_DRAWN"
  | "ENTITY_SPAWNED"
  | "COMPONENT_PATCHED"
  | "WAR_DECLARED"
  | "BATTLE_RESOLVED"
  | "ALLIANCE_FORMED"
  | "TECH_BREAKTHROUGH"
  | "FAMINE"
  | "REBELLION"
  | "DIALOGUE_CHOICE"
  | "ENTROPY_SHIFT"
  | "RULE_INJECTED"
  | "NARRATIVE_SEED";

export interface ComponentDelta {
  entity: EntityId;
  component: ComponentName;
  patch: Record<string, unknown>;
}

export interface AITrace {
  traceId: string;
  tier: "strong" | "fast" | "rule";
  tokens: number;
  usedFallback: boolean;
  reasoning?: string;
  directorDirective?: string;
}

export interface GameEvent {
  id: EventId;
  type: EventType;
  turn: number;
  era: Era;
  source: EventSource;
  causedBy?: EventId; // 直接前因事件 ID（因果图谱边）
  entityDeltas: ComponentDelta[];
  aiTrace?: AITrace;
  narrative?: string; // 人类可读的叙事描述
  metadata?: Record<string, unknown>;

  // ===== 悬疑叙事层（本质新增）=====
  /** 叙事层级：表层(可见)/暗层(动机)/隐藏层(真相) */
  narrativeLayer?: NarrativeLayer;
  /** 该事件埋下的伏笔（指向未来揭示事件 ID） */
  foreshadows?: EventId[];
  /** 该事件揭示的伏笔（指向过去埋伏笔事件 ID） */
  reveals?: EventId[];
  /** 因果强度 0-1：影响后续事件的程度（决定可视化边粗细） */
  causalWeight?: number;
  /** 悬念标记：未闭合的疑问点 */
  suspense?: SuspenseMarker;
}

/** 叙事层级 — 悬疑故事的核心架构 */
export type NarrativeLayer = "surface" | "hidden" | "deep";

/** 悬念标记 — 未解之谜的元数据 */
export interface SuspenseMarker {
  /** 悬念问题（如"谁是内奸？""秦王为何犹豫？"） */
  question: string;
  /** 揭示时机：建议在第几回合揭示 */
  revealByTurn?: number;
  /** 是否已揭示 */
  revealed: boolean;
  /** 涉及的 NPC（信息不对称标记） */
  involves?: string[];
}

/** 故事弧线 — 悬疑叙事的多层结构（Director 编排） */
export interface StoryArc {
  /** 弧线 ID */
  id: string;
  /** 弧线主题（如"远交近攻的暗流""商鞅之死""合纵破灭"） */
  theme: string;
  /** 三段式：伏笔—悬念—揭示 */
  phases: {
    /** 伏笔阶段：埋下线索的回合范围 */
    foreshadow: { startTurn: number; endTurn: number };
    /** 悬念阶段：制造疑问的回合范围 */
    suspense: { startTurn: number; endTurn: number };
    /** 揭示阶段：真相大白的回合范围 */
    reveal: { startTurn: number; endTurn: number };
  };
  /** 涉及的 NPC（信息不对称方） */
  involvedNpcs?: string[];
  /** 涉及的势力 */
  involvedFactions?: string[];
  /** 当前阶段 */
  currentPhase: "foreshadow" | "suspense" | "reveal" | "closed";
  /** 弧线状态 */
  status: "pending" | "active" | "resolved";
  /** 隐藏真相（仅 Director 知晓，揭示时方显） */
  hiddenTruth?: string;
  /** 埋伏笔的事件 ID 列表 */
  seedEvents?: EventId[];
  /** 揭示事件 ID */
  revealEvent?: EventId;
}

/** 悬疑叙事生成指令 — Director 下发给 historyAgent */
export interface SuspenseDirective {
  /** 本回合应激活的故事弧线 */
  activeArcs: StoryArc[];
  /** 本回合应埋下的伏笔 */
  foreshadowsToPlant: ForeshadowSeed[];
  /** 本回合应揭示的悬念 */
  suspenseToReveal: SuspenseReveal[];
  /** 张力等级 0-100 */
  tensionLevel: number;
  /** 信息不对称提示（玩家未知但 NPC 已知的情报） */
  asymmetricHints: string[];
}

/** 伏笔种子 — 待埋入历史事件的伏笔 */
export interface ForeshadowSeed {
  /** 伏笔主题 */
  theme: string;
  /** 关联的弧线 ID */
  arcId: string;
  /** 伏笔文本（模糊暗示） */
  hint: string;
  /** 涉及的 NPC */
  involvesNpc?: string;
  /** 计划揭示回合 */
  revealByTurn: number;
}

/** 悬念揭示 — 真相大白的事件 */
export interface SuspenseReveal {
  /** 关联的弧线 ID */
  arcId: string;
  /** 揭示文本（真相） */
  truth: string;
  /** 被揭示的伏笔事件 ID */
  seedEventId: EventId;
  /** 涉及的 NPC（信息状态变更） */
  involvesNpc?: string;
}

// ============================================================================
// 因果图谱
// ============================================================================
export interface CausalHook {
  /** 当前可扩展的因果钩子：前因后果未闭合的事件节点 */
  eventId: EventId;
  description: string;
  expectedOutcome?: string;
}

export interface CausalGraph {
  nodes: Map<EventId, GameEvent>;
  edges: Map<EventId, EventId[]>; // causedBy → enables
}

// ============================================================================
// 反馈回路（系统动力学）
// ============================================================================
export type FeedbackKind = "reinforcing" | "balancing" | "delayed";

export type VerdictLevel = "ok" | "warn" | "reject";

export interface Verdict {
  level: VerdictLevel;
  reason: string;
  /** 软规则违反时的降级修正建议 */
  degradeTo?: ComponentDelta[];
}

export interface FeedbackLoop {
  id: string;
  kind: FeedbackKind;
  participants: EntityId[];
  variables: string[];
  description?: string;
  /** 例：扩张速度不得超过腐败治理能力（负反馈平衡环） */
  constraint: (graph: CausalGraph, state: World) => Verdict;
}

// ============================================================================
// 规则引擎（三层：硬/软/涌现）
// ============================================================================
export type RuleLayer = "hard" | "soft" | "emergent";

export interface Rule {
  id: string;
  layer: RuleLayer;
  description: string;
  /** 校验命令合法性，硬规则违反则 reject，软规则违反则 warn/degrade */
  validate: (cmd: GameCommand, state: World, graph: CausalGraph) => Verdict;
  /** 该规则注入的历史事件 ID（涌现规则来源） */
  injectedBy?: EventId;
}

export type CommandType =
  | "PLAY_CARD"
  | "ADVANCE_TURN"
  | "DECLARE_WAR"
  | "FORM_ALLIANCE"
  | "RESEARCH_TECH"
  | "DIALOGUE"
  | "INJECT_RULE";

export interface GameCommand {
  id: string;
  type: CommandType;
  actor: EntityId;
  turn: number;
  payload: Record<string, unknown>;
  causedBy?: EventId;
}

// ============================================================================
// 卡牌系统 — 卡牌即历史命题
// ============================================================================
export type CardType = "military" | "economic" | "cultural" | "diplomatic" | "event";

export interface ResourceCost {
  gold?: number;
  food?: number;
  prestige?: number;
}

export type EffectKind =
  | "modify_component"
  | "spawn_event"
  | "draw_card"
  | "inject_rule"
  | "shift_entropy";

export interface CardEffect {
  kind: EffectKind;
  target?: EntityId; // 目标实体，省略则作用于出牌者
  component?: ComponentName;
  patch?: Record<string, unknown>;
  eventType?: EventType;
  ruleId?: string;
}

export type SemanticRelation = "counter" | "synergy" | "oppose" | "evolve";

export interface SemanticEdge {
  to: CardId;
  relation: SemanticRelation;
}

export interface CardTemplate {
  id: CardId;
  name: string;
  type: CardType;
  era: Era;
  cost: ResourceCost;
  effects: CardEffect[];
  evolvesFrom?: CardId; // 演化谱系
  semanticEdges: SemanticEdge[]; // 克制/协同/对立关系
  historicalRef?: string; // 对应的历史原型
  flavor?: string;
}

// ============================================================================
// NPC 与对话系统 — 对话即博弈
// ============================================================================
export interface Persona {
  name: string;
  title: string;
  description: string;
  archetype: string; // 人设原型（君主/谋士/军阀...）
}

export interface Goal {
  id: string;
  description: string;
  priority: number; // 1-5
  fulfilled?: boolean;
}

export interface Secret {
  id: string;
  content: string;
  revealedTo: EntityId[];
}

export interface Belief {
  /** NPC 对他人的心智模型：是否可信、意图判断 */
  trust: number; // -100~100
  intent: string;
}

export interface NPCModel {
  id: EntityId;
  persona: Persona;
  goals: Goal[];
  secrets: Secret[];
  memory: MemoryC;
  theoryOfMind: Record<EntityId, Belief>;
}

export interface DialogueOption {
  id: string;
  text: string;
  /** 标记信息不对称：玩家未知/NPC 隐瞒的信息 */
  asymmetricInfo?: string;
  /** 该选项触发的命令 */
  command?: Partial<GameCommand>;
  consequences?: string;
}

export interface DialogueTurn {
  id: string;
  speaker: EntityId;
  text: string;
  options?: DialogueOption[];
  chosenOption?: string;
}

// ============================================================================
// AI 智能体
// ============================================================================
export type AITask =
  | "history_macro"
  | "history_meso"
  | "card_generate"
  | "dialogue"
  | "opponent_decision"
  | "director";

export type AITier = "strong" | "fast" | "rule";

export interface AIRequest<T> {
  task: AITask;
  input: unknown;
  /** Zod 结构化契约；保留运行时校验，解析结果强转为 T */
  schema: import("zod").ZodSchema;
  causalContext?: CausalHook[];
  directorConstraints?: DirectorDirective;
  fallback: T;
  tier: AITier;
}

export interface AIResponse<T> {
  data: T;
  trace: AITrace;
}

/** Director AI 输出：剧本约束（元规则，约束其他 AI） */
export interface DirectorDirective {
  tensionTarget: number; // 本回合叙事张力目标 0-100
  theme: string; // 贯穿主题
  pacing: "tense" | "release" | "build";
  budgetAllocation: { strong: number; fast: number };
  /** 导演对各类 AI 的具体约束 */
  constraints?: Record<AITask, string>;
}

export interface Trend {
  id: string;
  description: string;
  era: Era;
  inevitability: number; // 0-1，必然性强度
}

export interface Contingency {
  id: string;
  description: string;
  type: EventType;
  deltas: ComponentDelta[];
  probability: number;
  /** 悬疑叙事层（本质新增）*/
  narrativeLayer?: NarrativeLayer;
  /** 伏笔主题（埋伏笔时标记） */
  foreshadowTheme?: string;
  /** 揭示的伏笔事件 ID（揭示事件时标记） */
  revealsSeed?: EventId;
  /** 涉及的 NPC */
  involvesNpc?: string;
  /** 悬念问题（制造悬念时标记） */
  suspenseQuestion?: string;
}

export interface HistoryAdvance {
  macro: {
    trend: Trend[];
    nextEraCandidate?: Era;
  };
  meso: {
    contingencies: Contingency[];
  };
  narrativeSeed: string;
  causalHooks: CausalHook[];
}

// ============================================================================
// 复杂度控制度量
// ============================================================================
export interface ComplexityMetrics {
  stateSpaceSize: number;
  causalDepth: number;
  aiFreedom: number;
  activeFeedbackLoops: number;
  tokenBudgetUsed: number;
  thresholdWarnings: string[];
}

// ============================================================================
// World 快照
// ============================================================================
export interface WorldSnapshot {
  turn: number;
  era: Era;
  season: Season;
  entities: Record<EntityId, Partial<Record<ComponentName, Component>>>;
  causalGraphVersion: number;
  ts: number;
}

// ============================================================================
// ECS World（单一真相快照）
// ============================================================================
export interface World {
  turn: number;
  era: Era;
  /** 当前季节：turn % 4 映射到春夏秋冬 */
  season: Season;
  entities: Map<EntityId, Partial<Record<ComponentName, Component>>>;
  /** RNG 种子，保证纯规则路径完全可复现 */
  seed: number;
  /** 已达成胜利条件的势力（若有） */
  victor?: EntityId;
  victoryType?: VictoryType;
}

// ============================================================================
// 胜利条件 — 多路线胜利，贴合历史多样性
// ============================================================================
export type VictoryType =
  | "military" // 军事征服：消灭所有敌对势力
  | "economic" // 经济霸权：财富累积达阈值
  | "cultural" // 文化鼎盛：威望达阈值
  | "technological" // 科技领先：科技等级达阈值
  | "entropy"; // 文明跃迁：熵达阈值并完成时代演进

export interface VictoryCondition {
  type: VictoryType;
  label: string;
  description: string;
  check: (world: World, entity: EntityId) => boolean;
}
