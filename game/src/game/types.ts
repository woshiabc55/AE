// AI 战略卡牌对话游戏 — 核心类型契约（P0 地基）
// 设计哲学：AI 提议 / 规则裁决 / 事件演化。本文件不含任何 AI 依赖，纯确定性数据。

// ===== 基础标识 =====
export type EntityId = string;
export type EventId = string;

// ===== 历史时代（不确定性锥：越往后路径依赖越强）=====
export type Era =
  | 'stone'
  | 'bronze'
  | 'iron'
  | 'classical'
  | 'medieval'
  | 'gunpowder'
  | 'industrial'
  | 'modern';

export interface EraDef {
  id: Era;
  name: string;
  order: number;
  prereqs: Era[]; // 必须已达成的前置时代
}

// ===== ECS 组件 =====
// 实体只是 ID，含义由挂载的组件决定。新增维度只加组件，不改继承链。
export type ComponentKind =
  | 'Faction'
  | 'Economic'
  | 'Military'
  | 'Cultural'
  | 'Territory'
  | 'Hand'
  | 'CardInstance'
  | 'WorldMeta';

export interface FactionC {
  name: string;
  color: string;
  isPlayer: boolean;
}
export interface EconomicC {
  gold: number;
  food: number;
}
export interface MilitaryC {
  troops: number;
  morale: number; // 士气 0~100
}
export interface CulturalC {
  prestige: number; // 威望
}
export interface TerritoryC {
  provinces: string[];
}
export interface HandC {
  cardIds: EntityId[];
}
export interface CardInstanceC {
  templateId: string;
  ownerFaction: EntityId;
}
export interface WorldMetaC {
  turn: number;
  era: Era;
  entropy: number; // 文明熵：随历史推进增长，崩溃事件可重置（王朝周期律）
}

// 组件类型映射 —— 让 World.getComponent<T> 能推断类型
export interface ComponentMap {
  Faction: FactionC;
  Economic: EconomicC;
  Military: MilitaryC;
  Cultural: CulturalC;
  Territory: TerritoryC;
  Hand: HandC;
  CardInstance: CardInstanceC;
  WorldMeta: WorldMetaC;
}

// ===== Effect：规则引擎产出的结构化效果，统一应用到 World =====
export type Effect =
  | { kind: 'MODIFY_FIELD'; entity: EntityId; component: ComponentKind; field: string; delta: number }
  | { kind: 'SET_FIELD'; entity: EntityId; component: ComponentKind; field: string; value: unknown }
  | { kind: 'CREATE_CARD'; card: EntityId; templateId: string; ownerFaction: EntityId }
  | { kind: 'ADD_CARD_TO_HAND'; faction: EntityId; card: EntityId }
  | { kind: 'REMOVE_CARD_FROM_HAND'; faction: EntityId; card: EntityId }
  | { kind: 'ADVANCE_ERA'; era: Era }
  | { kind: 'ADVANCE_TURN' }
  | { kind: 'LOG_FLAVOR'; text: string };

// ===== Command：玩家/AI 发起的命令（写路径入口）=====
export type CommandType = 'PLAY_CARD' | 'END_TURN' | 'ADVANCE_ERA' | 'DRAW_CARD';
export interface Command {
  type: CommandType;
  payload: Record<string, unknown>;
  source: 'player' | 'ai' | 'system';
}

// ===== Event：事件溯源基础单元（不可变，真相来源）=====
export type EventType =
  | 'CARD_PLAYED'
  | 'TURN_ENDED'
  | 'ERA_ADVANCED'
  | 'CARD_DRAWN'
  | 'GAME_EVENT';

export interface ComponentDelta {
  entity: EntityId;
  component: ComponentKind;
  patch: Record<string, unknown>; // 结构化增量快照
}

export interface AITrace {
  traceId: string;
  tier: 'strong' | 'fast' | 'rule';
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
  source: Command['source'] | 'rule';
  causedBy?: EventId; // 因果图谱边：直接前因事件
  commandType?: CommandType;
  deltas: ComponentDelta[];
  flavor?: string;
  aiTrace?: AITrace; // 若源自 AI，附完整调用链；重放时不重新调用 LLM
  ts: number;
}

// ===== 规则裁决结果 =====
// 软规则违反不拒绝命令，而是降级/触发补偿事件
export type Verdict = { ok: true } | { ok: false; reason: string; soft?: boolean };

// ===== 卡牌模板（静态内容，P0 用表；P3 起由 AI 在规则区间内生成）=====
export type CardType = 'unit' | 'building' | 'action' | 'policy';
export interface ResourceCost {
  gold?: number;
  food?: number;
}
export interface CardTemplate {
  id: string;
  name: string;
  type: CardType;
  era: Era; // 所属时代（规则约束可用时代）
  cost: ResourceCost;
  effects: Effect[]; // 规则引擎消费
  flavor?: string;
  historicalRef?: string;
  evolvesFrom?: string; // 演化谱系（P3）
}

// ===== 反馈回路（P1 启用，P0 先留接口）=====
export type FeedbackKind = 'reinforcing' | 'balancing' | 'delayed';
export interface FeedbackLoop {
  id: string;
  kind: FeedbackKind;
  participants: EntityId[];
  variables: string[];
  // constraint: (graph, state) => Verdict;  // P1 接入因果图后实现
}
