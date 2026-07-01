# AI 战略卡牌对话游戏 — 框架设计文档（升华版）

> 定位：AI 驱动历史推演 · 卡牌即历史命题 · 对话即博弈
> 平台：Web
> 一句话哲学：**让 AI 负责涌现，让规则负责约束，让事件负责演化。**

---

## 0. 设计哲学的三重升华

普通做法是"AI 直接生成游戏内容"，这会陷入不可控、不可调试、不可平衡的泥潭。本框架在三个维度上升华：

### 升华一：从"AI 驱动"到"涌现—约束—演化"三元结构

| 维度 | 角色 | 隐喻 | 确定性 |
|---|---|---|---|
| **涌现（Emergence）** | AI 生成有创意的提议 | 变异 | 非确定 |
| **约束（Constraint）** | 规则引擎裁决合法性 | 选择压力 | 完全确定 |
| **演化（Evolution）** | 事件溯源累积历史 | 遗传与漂变 | 完全确定，可重放 |

借鉴进化论：AI 是变异源，规则是环境选择压力，事件日志是基因库。游戏历史 = 一条被规则筛选过的变异链条。**复杂度不是被消除，而是被"有方向地释放"**——在规则约束的相空间内让 AI 涌现惊喜，但不越界。

### 升华二：从"状态管理"到"系统动力学"

战略游戏的灵魂不是状态，而是**反馈回路**。引入系统动力学建模：

- **正反馈回路（增强环）**：技术→生产力→研究投入→技术（滚雪球，需用负反馈制衡）
- **负反馈回路（平衡环）**：扩张→腐败→稳定度下降→内乱→收缩（自我调节）
- **延迟反馈**：政策的后果在 N 回合后才显现（历史感的核心来源）

规则引擎不只校验"合不合法"，更建模"反馈结构"。AI 生成的事件必须服从当前反馈结构，避免破坏战略游戏的内在张力。

### 升华三：从"线性时间轴"到"不确定性锥 + 因果图谱"

历史不是线性事件流，而是**因果网络**：

- **不确定性锥（Cone of Uncertainty）**：远古时代可能性空间巨大（AI 自由度高），越接近现代，路径依赖越强，可能性收窄（AI 受历史因果约束更强）。这天然映射到"早期自由叙事、后期精密博弈"的游戏节奏。
- **因果图谱（Causal Graph）**：每个事件节点记录 `causedBy`（直接原因）和 `enables`（后续可能）。AI 推演时不是无记忆生成，而是在因果图谱上做"受约束的扩展"，保证历史一致性。

---

## 1. 架构总览：ECS + 事件溯源 + CQRS 融合

单纯的分层架构不足以承载复杂游戏状态。采用游戏业成熟的 **ECS（实体-组件-系统）** 建模游戏世界，叠加 **事件溯源** 做演化留痕，再用 **CQRS** 分离命令与查询。

```
┌──────────────────────────────────────────────────────────┐
│  Projection (读模型)   UI 订阅的视图快照，按需重算          │
├──────────────────────────────────────────────────────────┤
│  Systems (业务)        历史/卡牌/对话/对手 — 编排 AI+规则   │
├──────────────────────────────────────────────────────────┤
│  CQRS  ┌─ CommandBus (写) ─→ RuleEngine ─→ EventStore    │
│        └─ QueryBus (读) ───→ Projection ←─ EventBus       │
├──────────────────────────────────────────────────────────┤
│  ECS Core   Entity = id；Component = 数据；System = 逻辑   │
│  World Store: Map<EntityId, Component[]>  (单一真相快照)   │
├──────────────────────────────────────────────────────────┤
│  Director AI   多智能体编排器（见 §5）— 协调各 AI 的提议    │
├──────────────────────────────────────────────────────────┤
│  AI Ensemble   历史 / 卡牌 / 对话 / 对手 四类智能体         │
│             结构化输出 · 因果感知 · 降级 · 缓存 · 可解释     │
├──────────────────────────────────────────────────────────┤
│  Persistence   EventStore(IDB) + World Snapshots + 因果图 │
└──────────────────────────────────────────────────────────┘
```

### 为什么用 ECS

- **组合优于继承**：一个实体可以是 `Faction + Military + Cultural + Diplomatic` 组件的组合，新增维度只加组件，不改继承链。
- **数据局部性 + 易扩展**：系统按组件类型查询，新增系统（如"瘟疫系统"）零侵入。
- **天然适配事件溯源**：组件状态变更 = 一组 `ComponentDelta` 事件，重放即重建世界。

### CQRS 的价值

- **写路径**（CommandBus）：玩家/AI 发起命令 → 规则引擎裁决 → 产出事件 → 入库。写路径严格、可验证。
- **读路径**（Projection）：UI 需要的视图（手牌列表、势力面板）由事件投影重算，可缓存、可版本化。读写分离让复杂 UI 不阻塞核心循环。

---

## 2. 核心数据模型（ECS 化）

### 2.1 实体与组件

```ts
type EntityId = string;

// 实体只是 ID，含义由挂载的组件决定
interface FactionC { name: string; color: string; isPlayer: boolean; }
interface MilitaryC { troops: number; morale: number; techLevel: number; }
interface EconomicC { gold: number; food: number; tradeRoutes: string[]; }
interface CulturalC { prestige: number; ideas: string[]; }
interface TerritoryC { provinces: string[]; }
interface MemoryC { facts: Fact[]; summary: string; relationship: Map<EntityId, number>; }
// …更多组件按需挂载
```

### 2.2 事件（事件溯源 + 因果）

```ts
interface GameEvent {
  id: string;
  type: EventType;
  turn: number; era: Era;
  source: 'player' | 'ai' | 'rule' | 'system';
  causedBy?: string;          // 直接前因事件 ID（因果图谱边）
  entityDeltas: ComponentDelta[]; // 对 ECS 组件的结构化变更
  aiTrace?: AITrace;          // 若源自 AI，附完整调用链
}

interface ComponentDelta {
  entity: EntityId;
  component: string;          // 'MilitaryC' | 'EconomicC' | ...
  patch: Record<string, unknown>; // 结构化增量
}
```

### 2.3 因果图谱

```ts
interface CausalGraph {
  nodes: Map<EventId, GameEvent>;
  edges: Map<EventId, EventId[]>; // causedBy → enables
  // 支持：路径查询、祖先链、影响范围传播、反事实推演
}
```

因果图谱让"如果当时没打那场仗"成为可计算的反事实查询，为悔棋、多结局回溯、AI 一致性校验提供基础。

---

## 3. 多尺度历史推演引擎

历史不是单一粒度。推演在三个尺度上进行，AI 在不同尺度用不同 prompt 与约束：

```
宏观 Macro    时代跃迁 · 文明熵 · 世界格局        ← 每时代推演一次
中观 Meso     势力消长 · 战争/结盟/科技突破        ← 每回合推演
微观 Micro    具体事件 · 人物对话 · 卡牌触发        ← 实时按需
```

### 3.1 文明熵模型

每个势力有 `entropy`（文明复杂度）：

- 熵低 → 可发生的事件类型少（部落冲突、迁徙），AI 自由度低但选择空间集中
- 熵高 → 事件类型丰富（革命、文化复兴、科技爆炸），AI 自由度高但需更多约束
- **熵随历史推进单调增长，但可通过"崩溃事件"重置**（王朝周期律）→ 天然产生战略游戏的兴衰节奏

### 3.2 必然性 vs 偶然性

AI 推演时区分两类输出：

```ts
interface HistoryAdvance {
  macro: {
    trend: Trend[];           // 必然趋势（规则强约束：如铁器时代必来）
    nextEraCandidate?: Era;   // 时代跃迁候选
  };
  meso: {
    contingencies: Contingency[]; // 偶然事件（AI 自由生成，规则宽松校验）
  };
  narrativeSeed: string;
  causalHooks: CausalHook[];  // 声明本次推演的因果前提，写入因果图
}
```

必然性保证历史大方向可信，偶然性保证每局不同。这是"控制结构化复杂"的关键辩证：**管住大趋势，放开小细节**。

### 3.3 推演流程（因果感知）

1. 从因果图谱提取"当前可扩展的因果钩子"（前因后果未闭合的节点）
2. 结合世界快照 + 文明熵 + 不确定性锥宽度，构造 prompt
3. AI 返回结构化 `HistoryAdvance`
4. 规则引擎三重校验：
   - **合法性**：数值/时代/科技前置
   - **因果一致性**：是否与已有因果链矛盾
   - **反馈结构**：是否破坏既定正/负反馈回路
5. 通过部分封装为事件，附 `causedBy` 接入因果图

---

## 4. 反馈回路与规则引擎（复杂度控制内核）

规则引擎升级为"反馈结构感知"：

```ts
interface FeedbackLoop {
  id: string;
  kind: 'reinforcing' | 'balancing' | 'delayed';
  participants: EntityId[];
  variables: string[];          // 涉及的状态变量
  constraint: (graph: CausalGraph, state: World) => Verdict;
  // 例：扩张速度不得超过腐败治理能力（负反馈平衡环）
}
```

规则分三层：

| 层 | 作用 | 示例 |
|---|---|---|
| **硬规则** | 不可违反的物理/逻辑约束 | 时代不可倒退、资源不可负 |
| **软规则** | 反馈回路约束，违反则降级而非拒绝 | 扩张过快触发腐败事件而非直接禁止 |
| **涌现规则** | 由历史推演动态生成 | 某次"宗教改革"事件后注入新规则 |

涌现规则让规则库本身随历史演化——这是复杂度"有方向释放"的终极机制：规则不是静态铁律，而是历史的沉淀物。

---

## 5. 多智能体编排：Director AI 模式

四类 AI 智能体若各自为政会产生冲突（对手 AI 想打仗、叙事 AI 想和平）。引入 **Director AI（导演）** 做编排：

```
        ┌────────── Director AI（导演）──────────┐
        │  输入：当前叙事张力、节奏、玩家情绪曲线   │
        │  输出：本回合"剧本约束"（张力目标/节奏）  │
        └──┬───────┬───────┬────────┬────────────┘
           ▼       ▼       ▼        ▼
       历史AI   卡牌AI   对话AI   对手AI
       (各自在导演约束下生成提议)
```

### Director AI 的职责

- **叙事张力曲线**：维持"张力—释放—再积聚"的节奏（三幕剧 / 英雄之旅的节拍器）
- **主题一致性**：确保本局有一个贯穿主题（如"中央集权 vs 地方自治"），各 AI 提议不跑题
- **节奏控制**：检测玩家是否疲劳/无聊，动态调节事件密度
- **预算分配**：在 token 预算内决定哪些节点值得调用强模型

Director AI 是"元 AI"——它不生成游戏内容，而是生成"约束其他 AI 的元规则"。这把多智能体冲突问题转化为一个可设计的编排问题。

### 三层 AI 调用模型

```ts
interface AIRequest<T> {
  task: AITask;
  input: unknown;
  schema: ZodSchema<T>;         // 结构化契约
  causalContext?: CausalHook[]; // 因果感知
  directorConstraints?: DirectorDirective; // 导演约束
  fallback: T;
  tier: 'strong' | 'fast' | 'rule'; // 三级：强模型/快模型/纯规则兜底
}

interface AITrace {
  traceId: string;
  tier: 'strong' | 'fast' | 'rule';
  tokens: number;
  usedFallback: boolean;
  reasoning?: string;           // 可解释性
  directorDirective?: string;   // 该次调用受导演的什么约束
}
```

---

## 6. 卡牌系统升华：卡牌即历史命题

卡牌不再是孤立的数值卡，而是**历史命题的可玩化封装**：

### 6.1 卡牌演化树

卡牌随时代演化，形成演化谱系：

```
[青铜剑] → [铁剑] → [钢剑] → [火绳枪] → [步枪] → [突击步枪]
   └→ [青铜礼器]（文化分支，不再演化军事）
```

每张卡有 `evolvesFrom` 与 `evolvesTo`，时代跃迁时旧卡可"升级"为新卡。这把卡牌系统与历史推演深度耦合。

### 6.2 卡牌语义网络

卡牌之间有语义关系（克制/协同/演化/对立），构成图谱：

```ts
interface CardTemplate {
  id: string; name: string; type: CardType; era: Era;
  cost: ResourceCost; effects: Effect[];
  evolvesFrom?: string;          // 演化谱系
  semanticEdges: SemanticEdge[]; // 克制/协同/对立关系
  historicalRef?: string;        // 对应的历史原型（可展示给玩家学习）
  flavor?: string;
}
```

### 6.3 卡牌生成的因果一致性

AI 生成新卡时，必须声明它"回应"了哪个历史因果钩子——卡牌不是凭空出现，而是历史情境的可玩化产物。这让玩家的每一手牌都有历史叙事重量。

---

## 7. 对话系统升华：对话即博弈

NPC 不是无脑应答器，而是有自己目标与信息不对称的博弈方：

```ts
interface NPCModel {
  id: EntityId;
  persona: Persona;            // 人设
  goals: Goal[];               // 目标（有优先级）
  secrets: Secret[];           // 秘密（信息不对称）
  memory: MemoryC;             // 记忆组件
  theoryOfMind: Map<EntityId, Belief>; // 对他人的心智模型
}
```

- **信息不对称**：NPC 知道玩家不知道的事，对话中可透露/隐瞒/欺骗
- **心智模型**：NPC 对玩家有"信念"，随对话更新（玩家是否可信？）
- **对话即谈判**：每次对话选择都是一次微小博弈，影响关系与信息

对话选项由 AI 在导演约束下生成，但必须服从 NPC 的目标与心智模型——避免 NPC "OOC"（人设崩坏）。

---

## 8. 状态管理与可复现性

- **World Store**：ECS 快照，Zustand 持有，UI 订阅投影
- **EventStore**：事件日志（IDB），唯一真相来源
- **CausalGraph**：因果图谱，支持反事实查询与一致性校验
- **快照 + 重放**：定期快照 + 增量事件重放，平衡性能与可回溯
- **可复现性**：AI 输出随事件持久化（`aiTrace`），重放不重新调用 LLM；Director 决策也持久化
- **RNG 种子**：所有确定性随机源用种子，保证纯规则路径完全可复现

---

## 9. 复杂度控制的形式化

把"控制结构化复杂"升级为可度量的工程目标：

| 度量 | 定义 | 控制手段 |
|---|---|---|
| **状态空间规模** | 可达世界状态数 | 规则硬约束 + 组件枚举值域 |
| **因果深度** | 因果链平均长度 | 不确定性锥收窄 + 延迟反馈有界 |
| **AI 自由度** | 单次 AI 输出的可选空间 | Schema 约束 + 导演指令 + 时代熵 |
| **反馈环数** | 活跃反馈回路数 | 软规则 + 涌现规则注入上限 |
| **token 预算** | 每回合 AI 成本 | Director 分级调度 + 缓存 + 摘要 |

每项都有阈值告警，超出则 Director 自动降级（如 AI 自由度过高 → 收紧 schema、改用规则兜底）。复杂度从"玄学"变成"可观测、可调节"的工程指标。

---

## 10. 技术栈（复用 + 最小新增）

| 用途 | 选型 | 备注 |
|---|---|---|
| 框架 | React 18 + TypeScript + Vite | 现有栈 |
| 状态 | Zustand | 现有栈，World Store |
| 样式/动画 | Tailwind + Framer Motion | 卡牌动画、过渡 |
| 持久化 | IndexedDB（idb） | 现有栈，EventStore |
| 契约校验 | **Zod**（新增） | AI 输出契约 + 运行时校验 |
| ID | **nanoid**（新增） | 实体/事件 ID |
| 图算法 | 轻量自实现（因果图操作简单） | 避免引入重依赖 |
| AI | fetch → LLM API | 结构化输出 / tool calling |

---

## 11. 项目目录结构

```
src/
  ecs/                     # ECS 核心
    Entity.ts  Component.ts  World.ts  System.ts
  engine/                  # 确定性引擎（不依赖 ai）
    EventBus.ts  CommandBus.ts  QueryBus.ts
    RuleEngine.ts           # 硬/软/涌现三层规则
    FeedbackLoops.ts        # 反馈回路注册
    CausalGraph.ts          # 因果图谱
    StateManager.ts         # 快照 + 重放
  ai/                      # 非确定隔离层
    AIService.ts            # 三级调用 + 降级 + 缓存
    Director.ts             # 导演 AI（编排器）
    agents/                 # 历史/卡牌/对话/对手 智能体
    prompts/  schemas/  fallbacks.ts
  game/                    # 静态内容
    eras/  factions/  cards/  rules/  loops/
  systems/                 # 业务编排（唯一接触 ai+engine）
    historyEngine.ts  cardSystem.ts
    dialogueSystem.ts  opponentAI.ts
  projection/              # CQRS 读模型
    views/                 # 手牌/势力/地图 视图投影
  store/                   # Zustand
  components/              # UI
  db/  types/
```

**边界纪律**：
- `ecs/` `engine/` 纯确定、零 AI 依赖、可单测
- `ai/` 不直接写状态，只产提议
- `systems/` 是 ai 与 engine 的唯一交汇点
- `projection/` 只读，不触发命令
- `components/` 只订阅 projection/store

---

## 12. 实施路线图

| 阶段 | 目标 | 验收 |
|---|---|---|
| **P0 地基** | ECS + 事件溯源 + 规则引擎骨架 | 纯规则可跑通"命令→事件→状态→投影"，零 AI |
| **P1 因果与反馈** | 因果图谱 + 反馈回路 + 涌现规则注入 | 可重放、可回滚、反馈环可观测 |
| **P2 多尺度历史** | 历史 AI 接入（mock→真实）+ Director 雏形 | 单时代推演闭环，因果一致 |
| **P3 卡牌演化** | 卡牌生成 + 演化树 + 语义网络 | 出牌→事件→规则→状态闭环 |
| **P4 对话博弈** | NPC 心智模型 + 信息不对称 + 导演节奏 | 对话影响剧情分支 |
| **P5 对手 AI** | 效用系统 + 关键节点 LLM 介入 | 对手决策可解释 |
| **P6 整合调优** | 多时代串接 + 复杂度度量仪表盘 + 平衡 | 完整对局，复杂度指标在阈值内 |

**P0 是地基中的地基**：用 mock/纯规则跑通"出牌→事件→规则裁决→ECS 状态变更→UI 投影"全链路，并证明可重放、可回滚。**这是"控制结构化复杂"承诺的兑现点**——如果纯规则路径跑不通，AI 接入后只会更不可控。

---

## 13. 升华总结

| 维度 | 普通做法 | 本框架升华 |
|---|---|---|
| AI 角色 | 直接生成内容 | 涌涌现源，规则做选择压力，事件做演化 |
| 时间 | 线性事件流 | 不确定性锥 + 因果图谱 |
| 复杂度 | 凭感觉控制 | 系统动力学反馈回路 + 可度量指标 |
| 多 AI | 各自为政 | Director 编排，冲突可设计 |
| 卡牌 | 孤立数值卡 | 历史命题 + 演化树 + 语义网络 |
| 对话 | 应答器 | 信息不对称的博弈方 + 心智模型 |
| 状态 | 对象树 | ECS + 事件溯源 + CQRS |
| 规则 | 静态铁律 | 硬/软/涌现三层，随历史演化 |

**一句话**：把游戏世界建成一个"有因果记忆、有反馈张力、有导演节奏"的演化系统，AI 是其中的变异源，规则是选择压力，玩家是在因果图谱上做选择的造史者。
