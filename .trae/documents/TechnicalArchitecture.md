## 1. 架构设计

```mermaid
flowchart TD
    subgraph "React 应用层"
        "App[路由 App.tsx]" --> "Pages[页面]"
    end
    subgraph "游戏页面 GamePage"
        "Pages --> GP[GamePage 容器]"
        "GP --> "Canvas[Canvas 战斗画布]"
        "GP --> "HUD[HUD 浮层组件]"
        "GP --> "TitleUI[标题/结算界面]"
    end
    subgraph "游戏引擎层 (game/engine)"
        "Engine[GameLoop 主循环]" --> "World[World 世界状态]"
        "World --> "Player[骑士实体]"
        "World --> "Enemy[骷髅实体]"
        "World --> "Particles[粒子系统]"
        "World --> "Camera[摄像机 + 视差]"
        "Engine --> "Renderer[渲染器]"
        "Renderer --> "Sprite[像素精灵绘制]"
        "Renderer --> "Light[光照/阴影层]"
        "Renderer --> "PostFX[后处理 CRT/暗角]"
    end
    subgraph "输入层"
        "Input[Input 键鼠/触控]" --> "Engine"
    end
    subgraph "状态层"
        "GP --> "Store[Zustand 游戏状态]"
        "Store --> "GameStore[血量/分数/波次/阶段]"
    end
```

## 2. 技术说明
- **前端框架**：React@18 + TypeScript + Vite@5（复用现有项目）
- **样式方案**：TailwindCSS@3 + CSS Variables（HUD / 界面层）
- **状态管理**：Zustand（游戏元状态：阶段、分数、血量；引擎内部状态用纯对象，不入 React 避免重渲染）
- **渲染方案**：原生 Canvas 2D API（多层离屏 Canvas 合成：场景层 → 实体层 → 光照层 → 后处理层）
- **游戏循环**：`requestAnimationFrame` 固定步长更新 + 插值渲染
- **资产方案**：程序化像素精灵（运行时 Canvas 绘制 + OffscreenCanvas 缓存），无外部图片
- **初始化工具**：复用现有 Vite React TS 模板
- **后端**：无（纯前端，分数仅本地内存）

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| `/` | 原拼豆工坊（保留） |
| `/game` | 像素骑士砍杀游戏 |

## 4. 游戏状态机
```typescript
type GamePhase = "title" | "playing" | "paused" | "victory" | "defeat";
```
- **title**：标题界面，点击开始 → playing
- **playing**：主战斗循环，受击死亡 → defeat，清空全部波次 → victory
- **victory/defeat**：结算界面，重新开始 → playing（或返回 → title）

## 5. 核心引擎模块设计

### 5.1 目录结构（新增）
```
src/
├── game/                       # 游戏项目根
│   ├── engine/                  # 引擎核心
│   │   ├── GameLoop.ts          # 主循环（rAF + 固定步长）
│   │   ├── Input.ts             # 输入管理（键鼠/触控）
│   │   ├── Camera.ts            # 摄像机 + 视差滚动
│   │   ├── Renderer.ts          # 多层渲染合成
│   │   ├── Lighting.ts          # 光照/阴影/体积光
│   │   └── PostFX.ts            # CRT/暗角/色调后处理
│   ├── entities/                 # 实体
│   │   ├── Player.ts             # 骑士（状态机 + 连斩）
│   │   ├── Enemy.ts              # 骷髅战士（AI 状态机）
│   │   └── Projectile.ts         # 飞行物/剑气（预留）
│   ├── world/                    # 关卡
│   │   ├── Level.ts              # 关卡数据 + 地形碰撞
│   │   ├── Parallax.ts           # 多层视差背景绘制
│   │   └── Spawner.ts            # 敌人波次刷新
│   ├── fx/                       # 特效
│   │   ├── Particles.ts          # 粒子系统（血/火花/尘）
│   │   └── ScreenShake.ts        # 屏幕震动
│   ├── sprites/                  # 程序化像素精灵
│   │   ├── knight.ts             # 骑士各姿态像素图
│   │   ├── skeleton.ts           # 骷髅像素图
│   │   ├── tiles.ts              # 古堡瓦片
│   │   └── pixelArt.ts           # 像素绘制工具（按调色板索引画格子）
│   ├── store/
│   │   └── useGameStore.ts       # Zustand 游戏元状态
│   ├── config.ts                 # 常量（重力/速度/伤害/调色板）
│   ├── types.ts                  # 游戏类型
│   └── GameEngine.ts             # 引擎门面：组装上述模块
├── pages/
│   └── Game.tsx                  # 游戏页面（挂载 Canvas + HUD + 标题/结算）
└── components/
    └── game/
        ├── HUD.tsx               # 血条/连击/分数/波次
        ├── TitleScreen.tsx       # 标题界面
        └── ResultScreen.tsx      # 结算界面
```

### 5.2 实体状态机
```typescript
// 骑士
type PlayerState = "idle" | "run" | "jump" | "fall" | "attack1" | "attack2"
  | "attack3" | "dash" | "hurt" | "block" | "dead";

// 骷髅敌人
type EnemyState = "idle" | "patrol" | "chase" | "attack" | "hurt" | "dead";
```

### 5.3 战斗判定
- 攻击命中使用 AABB + 攻击判定盒（朝向偏移的矩形）与敌人碰撞盒相交
- 命中后：敌人受击击退、扣血、生成血粒子、屏幕震动、连击 +1、连击计时器重置
- 连击在 1.5s 内不攻击则归零；连击数影响分数倍率

## 6. 数据模型

### 6.1 引擎内部状态（纯对象，非持久化）
```typescript
interface PlayerStateData {
  x: number; y: number;          // 世界坐标
  vx: number; vy: number;        // 速度
  facing: 1 | -1;                // 朝向
  hp: number; maxHp: number;
  state: PlayerState;
  attackIndex: number;            // 当前连斩段 0-2
  attackTimer: number;
  comboCount: number; comboTimer: number;
  invincibleTimer: number;       // 无敌帧（冲刺/受击）
  grounded: boolean;
  jumpsLeft: number;
}
```

### 6.2 React 元状态（Zustand，驱动 HUD）
```typescript
interface GameStoreState {
  phase: GamePhase;
  hp: number; maxHp: number;
  combo: number; maxCombo: number;
  score: number;
  wave: number; totalWaves: number;
  enemiesLeft: number;
  // actions
  setPhase(p: GamePhase): void;
  syncFromEngine(s: EngineSnapshot): void;
  reset(): void;
}
```
引擎每帧通过 `syncFromEngine` 将快照推入 Zustand，HUD 订阅更新；高频实体坐标不进 React。

## 7. 性能与工程约束
- 引擎内部状态用普通 JS 对象 + requestAnimationFrame，避免 React 重渲染
- 仅元状态（血量/分数/波次/阶段）通过 Zustand 同步，节流至每帧或变化时
- 像素精灵使用 `imageSmoothingEnabled = false` 保持硬边像素
- 离屏 Canvas 缓存静态层（远景天空 / 城堡剪影），仅摄像机移动时偏移
- 同屏粒子上限 200，超出丢弃最旧
- 逻辑分辨率固定 1280×720，CSS 缩放铺满容器，保持像素整数倍

## 8. 2.5D（像素 2 渲 3）实现要点
- **视差纵深**：4 层背景以不同系数（0.2 / 0.4 / 0.7 / 1.0）随摄像机横移滚动
- **动态光照**：月光方向光 + 火把/剑光点光源，用径向渐变叠加 `lighter` 合成模式
- **角色阴影**：脚下椭圆软阴影，随跳跃高度缩放透明度
- **体积光**：火把光柱用半透明梯形 + 噪声扰动
- **后处理**：离屏全屏画布叠加扫描线、暗角、色调曲线、轻微色差
- **景深暗示**：远景层降低饱和度 + 轻微模糊 + 雾色叠加
