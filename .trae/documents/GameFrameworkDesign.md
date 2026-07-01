# AI 战略卡牌对话游戏 — 框架设计文档

> 定位：AI 驱动历史推演 + 卡牌 + 对话的战略游戏
> 平台：Web
> 核心理念：**AI 提议，规则裁决，事件留痕**（用确定性的规则引擎作为地基本底，AI 在其约束内发挥，从而"控制结构化复杂"）

---

## 1. 核心设计哲学：如何"控制结构化复杂"

AI 强大但非确定性，直接让 AI 自由驱动整个游戏会导致状态漂移、历史不一致、无法调试。本框架的核心策略：

| 层 | 职责 | 确定性 |
|---|---|---|
| 规则引擎（地基） | 定义合法变更、触发条件、数值约束 | **完全确定** |
| AI 服务（填充） | 生成提议（卡牌、事件、对话、决策） | 非确定，但被结构化约束 |
| 事件溯源（留痕） | 所有状态变更落地为不可变事件 | 完全确定，可重放/回滚 |

**数据流闭环**：`AI 生成结构化提议 → 规则引擎验证合法性 → 通过则发布为事件 → 状态机消费事件更新状态`。AI 永远不直接写状态，只通过"提议→裁决"间接影响。

---

## 2. 技术栈选型（复用现有栈）

| 用途 | 选型 | 理由 |
|---|---|---|
| 框架 | React 18 + TypeScript | 现有栈，组件化适合卡牌/UI |
| 构建 | Vite | 现有栈 |
| 状态管理 | Zustand | 现有栈，轻量，适合游戏状态 |
| 样式 | Tailwind CSS + Framer Motion | 卡牌动画、过渡 |
| 持久化 | IndexedDB（idb） | 现有栈，存档/事件日志 |
| AI 调用 | fetch → LLM API（OpenAI/Anthropic 兼容） | 结构化输出（JSON Schema / function calling） |
| 校验 | Zod | 运行时校验 AI 输出契约 |

> 新增依赖建议：`zod`（契约校验）、`framer-motion`（卡牌动画）、`nanoid`（ID 生成）。

---

## 3. 分层架构总览

```
┌─────────────────────────────────────────────┐
│  UI Layer      卡牌/对话框/地图/HUD/时间轴    │
├─────────────────────────────────────────────┤
│  Interaction   玩家命令 → CommandBus          │
├─────────────────────────────────────────────┤
│  Systems       卡牌/对话/对手AI/历史推演       │  ← 业务编排
├─────────────────────────────────────────────┤
│  Game Core     EventBus + RuleEngine + State │  ← 确定性地基
├─────────────────────────────────────────────┤
│  AI Service    结构化I/O · Prompt · 降级·缓存  │  ← 非确定隔离层
├─────────────────────────────────────────────┤
│  Persistence   IndexedDB（事件日志 + 存档）    │
└─────────────────────────────────────────────┘
```

**关键边界**：`AI Service` 是唯一的非确定来源，所有 AI 调用必须经它；`Game Core` 不依赖 AI，纯函数化、可单测。

---

## 4. 核心数据模型

### 4.1 游戏状态（GameState）

```ts
interface GameState {
  turn: number;
  era: Era;                    // 当前历史时代
  timeline: GameEvent[];       // 事件溯源日志（真相来源）
  world: WorldState;           // 资源、科技、地理
  factions: Faction[];         // 所有势力（含玩家与AI对手）
  player: PlayerState;         // 玩手牌、政策、资源
  cards: CardInstance[];       // 场上/手牌实例
  narrative: NarrativeContext; // 叙事上下文（供AI）
}
```

### 4.2 事件（Event Sourcing 基础单元）

```ts
interface GameEvent {
  id: string;
  type: EventType;             // 'CARD_PLAYED' | 'ERA_ADVANCE' | 'DIALOGUE_CHOICE' | ...
  turn: number;
  ts: number;
  source: 'player' | 'ai' | 'rule' | 'system';
  causedBy?: string;           // 触发实体ID
  payload: Record<string, unknown>;
  // 事件不可变，状态由重放 timeline 重建
}
```

### 4.3 规则（Rule）

```ts
interface Rule {
  id: string;
  on: EventType | '*';         // 订阅的事件
  when: (s: GameState, e: GameEvent) => boolean;  // 触发条件
  apply: (s: GameState, e: GameEvent) => Effect[]; // 产生的效果
  priority: number;            // 多规则冲突时的裁决顺序
}
```

---

## 5. 核心子系统设计

### 5.1 历史推演引擎（AI 驱动 + 规则护栏）

**职责**：每个时代/回合推进时，AI 生成"下一阶段历史变更"，规则引擎验证后落地。

**AI 输出契约（强结构化）**：

```ts
interface HistoryAdvance {
  nextEra?: Era;               // 时代跃迁（规则校验：不可倒退）
  worldEvents: WorldEvent[];   // 该阶段发生的历史事件
  factionDeltas: FactionDelta[]; // 势力消长
  emergentTech: Tech[];        // 涌现科技（规则校验：依赖前置科技）
  narrativeSeed: string;       // 供叙事系统使用的种子
  reasoning?: string;          // 可解释性（调试用）
}
```

**流程**：
1. 收集 `GameState 摘要 + 近 N 个事件 + 当前时代约束` → 喂给 AI
2. AI 返回 `HistoryAdvance`（JSON Schema 强约束）
3. `RuleEngine.validate(advance)` 逐条校验（时代不可倒退、科技依赖、势力上限…）
4. 校验失败的字段降级为默认/重试，不整体丢弃
5. 通过的部分封装为 `ERA_ADVANCE` 事件发布

### 5.2 事件驱动 + 规则引擎（复杂度控制核心）

```ts
// EventBus：所有状态变更唯一入口
class EventBus {
  emit(event: GameEvent): void;        // 发布
  on(type: EventType, fn: Handler): void;
}

// RuleEngine：订阅事件，条件触发，产出效果
class RuleEngine {
  register(rule: Rule): void;
  process(state: GameState, event: GameEvent): Effect[]; // 按priority裁决
}
```

**为什么这样控制复杂度**：
- 所有"如果 X 则 Y"的逻辑集中在规则库（`game/rules/`），可枚举、可测试、可热加载
- AI 生成的卡牌效果、事件后果都先变成 `Effect`，再由规则引擎统一应用
- 复杂度从"AI 黑箱"转移到"规则白箱"，AI 只负责生成有创意的 *提议*

**规则示例**：
```ts
// 时代跃迁规则：必须满足前置条件
const eraAdvanceRule: Rule = {
  id: 'era-gate',
  on: 'ERA_ADVANCE',
  when: (s, e) => checkEraPrereqs(s, e.payload.nextEra),
  apply: (s, e) => [{ kind: 'SET_ERA', era: e.payload.nextEra }],
  priority: 100,
};
```

### 5.3 卡牌系统

```ts
interface CardTemplate {
  id: string;
  name: string;
  type: 'unit' | 'building' | 'action' | 'policy' | 'event';
  era: Era;                    // 所属时代（规则约束可用时代）
  cost: ResourceCost;
  effects: Effect[];           // 规则引擎消费
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tags: string[];              // 文化/科技标签
  flavor?: string;             // AI 生成的风味文本
}
```

**生成流程**：`当前局势 + 时代 + 势力特征 → AI 生成 CardTemplate（Schema约束）→ 平衡规则校验（cost-effects 比值区间）→ 入牌库`
**平衡控制**：规则引擎定义每个时代的 cost 上限、效果强度区间；AI 在区间内生成，超出则降级。

### 5.4 对话与叙事系统

```ts
interface DialogueNode {
  id: string;
  npcId: string;
  lines: string;               // AI 生成（输入：人设+记忆+局势）
  choices: DialogueChoice[];   // AI 生成选项（结构化）
}

interface NPCMemory {
  npcId: string;
  facts: string[];             // 结构化事实
  relationship: number;        // 与玩家关系值
  summary: string;             // AI 滚动摘要（控成本）
}
```

**上下文管理**：NPC 记忆用"结构化事实 + 滚动摘要"，避免对话历史无限增长导致 token 爆炸。玩家选择 → `DIALOGUE_CHOICE` 事件 → 规则引擎更新关系值/触发剧情分支。

### 5.5 AI 对手 / NPC 行为

**双轨制**：
- **效用系统（Utility AI）骨架**：对每个可选行动打分（资源、威胁、机会），确定性、可解释、零成本
- **AI 关键决策介入**：在重大节点（战争/结盟/叛变）调用 LLM 生成"有创意的非标准决策"，附带 `reasoning`

```ts
interface OpponentDecision {
  action: ActionType;
  target?: string;
  reasoning?: string;          // AI 决策的理由（可展示给玩家）
  utilityScore: number;        // 效用系统打分（兜底）
}
```

---

## 6. AI 集成层（最关键的设计）

把所有非确定性隔离在此层，对上层暴露纯异步接口。

```ts
interface AIRequest<T> {
  task: AITask;                // 'history_advance' | 'card_gen' | 'dialogue' | 'opponent_decide'
  input: unknown;
  outputSchema: ZodSchema<T>;  // Zod 契约
  constraints: string[];       // 规则约束（写进 prompt）
  fallback: T;                 // 降级默认值（保证游戏不卡）
  model?: 'strong' | 'fast';   // 分级调用控成本
}

interface AIResponse<T> {
  data: T;
  validated: boolean;          // 是否通过 Zod + 规则校验
  usedFallback: boolean;
  tokens: number;
  traceId: string;             // 全链路追踪
}

class AIService {
  async call<T>(req: AIRequest<T>): Promise<AIResponse<T>>;
}
```

**关键机制**：
1. **结构化输出**：用 LLM 的 JSON Schema / tool calling 模式，Zod 二次校验
2. **降级链**：强模型 → 快模型 → 规则默认值，保证永不停摆
3. **缓存**：相同 `(task, inputHash)` 命中缓存（历史推演、卡牌生成可缓存）
4. **Prompt 版本化**：`ai/prompts/*.v{n}.ts`，便于 A/B 与回归
5. **Token 预算**：每回合预算上限，超额自动降级到快模型/规则兜底
6. **可观测**：每次调用记录 traceId、tokens、是否降级，存入事件日志便于调试

---

## 7. 状态管理与事件溯源

- **Zustand store** 持有当前 `GameState`（快照，供 UI 订阅）
- **timeline**（`GameEvent[]`）是真相来源，存 IndexedDB
- **回滚/重放**：从 timeline 任意点重放事件重建状态（调试、读档、悔棋）
- **存档**：序列化 `{ gameState, timelineTail, rngSeed }`，RNG 种子保证 AI 行为可复现

> 注意：AI 调用结果要随事件一起持久化（缓存命中而非重新调用），否则重放时 LLM 输出不一致。

---

## 8. 关键难点与对策

| 难点 | 对策 |
|---|---|
| AI 输出不稳定/越界 | Zod 契约 + 规则校验 + 降级默认值，字段级容错不整体丢弃 |
| 历史一致性 | 事件不可变 + 时代/科技前置规则 + 状态可重放 |
| 复杂度爆炸 | 规则引擎作为白箱地基，AI 仅生成提议；规则可枚举可测试 |
| Token/成本 | 缓存 + 摘要 + 分级模型（重要决策用强模型）+ 回合预算 |
| AI 行为不可复现 | 持久化 AI 输出到事件 payload，重放不重新调用 |
| 调试困难 | traceId 全链路 + 事件日志 + 可关闭 AI 的规则兜底模式 |

---

## 9. 项目目录结构

```
src/
  ai/                      # AI 集成层（非确定隔离区）
    AIService.ts
    prompts/               # 版本化 prompt 模板
    schemas/               # Zod 输出契约
    fallbacks.ts           # 各任务降级默认值
    cache.ts
  engine/                  # 游戏核心（纯确定，可单测）
    EventBus.ts
    RuleEngine.ts
    StateManager.ts        # 状态机 + 事件重放
    effects.ts             # Effect 应用器
  game/                    # 静态游戏内容
    eras/                  # 时代定义与前置条件
    factions/
    rules/                 # 规则库（白箱复杂度）
    cards/                 # 基础卡牌池
  systems/                 # 业务编排（调用 ai + engine）
    historyEngine.ts
    cardSystem.ts
    dialogueSystem.ts
    opponentAI.ts
  store/                   # Zustand stores
    useGameStore.ts
  components/              # UI 层
    cards/
    dialogue/
    map/
    hud/
  types/
  db/                      # IndexedDB（事件日志 + 存档）
```

**模块边界纪律**：
- `engine/` 不 import `ai/`（核心必须无 AI 可运行）
- `systems/` 是唯一同时接触 `ai/` 和 `engine/` 的层
- `components/` 只读 store，不直接调 ai/engine

---

## 10. 实施路线图

| 阶段 | 目标 | 产出 |
|---|---|---|
| **P1 地基** | 跑通确定性地基 | GameState/Event/Rule 类型 + EventBus + RuleEngine + StateManager + AI Service（mock 返回固定 JSON） |
| **P2 历史推演** | 单时代 AI 推进闭环 | historyEngine 接真实 LLM + Zod 契约 + 规则校验 + 降级 |
| **P3 卡牌系统** | 生成+使用循环 | cardSystem + 平衡规则 + 牌库 UI |
| **P4 对话系统** | NPC 对话闭环 | dialogueSystem + 记忆摘要 + 选项分支 |
| **P5 AI 对手** | 对手决策 | 效用系统 + 关键节点 LLM 介入 |
| **P6 整合** | 完整对局 + 平衡 | 多时代串接 + 存档 + 调试面板 |

**P1 验收标准**：用 mock AI 能完成"发起事件 → 规则裁决 → 状态更新 → UI 渲染"全链路，且关闭 mock 后纯规则仍可运行。这是"控制结构化复杂"的地基保证。

---

## 11. 下一步建议

本文档为框架设计，确认后建议按 P1 优先落地：
1. 先建 `types/` 核心数据模型与 Zod 契约
2. 实现 `engine/` 三件套（EventBus / RuleEngine / StateManager）并配单测
3. 搭 `ai/AIService.ts` 的 mock 版本
4. 用一个最小 UI 跑通"玩家出牌 → 事件 → 规则 → 状态 → UI"闭环

待 P1 地基验证通过，再接入真实 LLM 推演历史。
