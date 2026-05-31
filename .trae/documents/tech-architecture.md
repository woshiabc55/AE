## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        "React App" --> "GameCanvas 组件"
        "GameCanvas 组件" --> "GameEngine 游戏引擎"
        "GameEngine 游戏引擎" --> "Renderer 渲染器"
        "GameEngine 游戏引擎" --> "Physics 物理系统"
        "GameEngine 游戏引擎" --> "InputManager 输入管理"
        "GameEngine 游戏引擎" --> "GameState 状态管理"
    end
    subgraph "渲染层"
        "Renderer 渲染器" --> "SpriteRenderer 精灵渲染"
        "Renderer 渲染器" --> "BackgroundRenderer 背景渲染"
        "Renderer 渲染器" --> "HUDRenderer HUD渲染"
        "Renderer 渲染器" --> "EffectRenderer 特效渲染"
    end
    subgraph "游戏逻辑层"
        "GameState 状态管理" --> "Mecha 机甲实体"
        "Mecha 机甲实体" --> "StateMachine 状态机"
        "GameState 状态管理" --> "BattleSystem 战斗系统"
        "BattleSystem 战斗系统" --> "HitBox 碰撞检测"
    end
```

## 2. 技术说明

- 前端：React@18 + TypeScript + Vite + TailwindCSS
- 初始化工具：vite-init
- 后端：无（纯前端游戏）
- 数据库：无
- 渲染引擎：HTML5 Canvas 2D（程序化像素绘制）
- 状态管理：Zustand（管理游戏全局状态）

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 游戏主页面（包含开始/战斗/结算三个阶段） |

## 4. 核心代码结构

```
src/
├── components/
│   ├── GameCanvas.tsx          # Canvas容器组件
│   └── GameUI.tsx              # 开始/结算UI覆盖层
├── game/
│   ├── engine.ts               # 游戏主循环
│   ├── renderer.ts             # 渲染器（背景/精灵/HUD/特效）
│   ├── input.ts                # 键盘输入管理
│   ├── physics.ts              # 碰撞检测与物理
│   ├── mecha.ts                # 机甲实体类
│   ├── sprites.ts              # 像素精灵数据定义
│   ├── effects.ts              # 特效系统（粒子/震屏）
│   └── types.ts                # 游戏类型定义
├── store/
│   └── gameStore.ts            # Zustand游戏状态
├── pages/
│   └── Home.tsx                # 主页面
├── App.tsx
└── main.tsx
```

## 5. 游戏系统设计

### 5.1 机甲状态机

```mermaid
stateDiagram-v2
    [*] --> "IDLE"
    "IDLE" --> "WALK" : 按下移动键
    "WALK" --> "IDLE" : 松开移动键
    "IDLE" --> "ATTACK" : 按下攻击键
    "WALK" --> "ATTACK" : 按下攻击键
    "IDLE" --> "DEFEND" : 按下防御键
    "WALK" --> "DEFEND" : 按下防御键
    "ATTACK" --> "IDLE" : 动作结束
    "DEFEND" --> "IDLE" : 松开防御键
    "IDLE" --> "HURT" : 被击中
    "HURT" --> "IDLE" : 硬直结束
    "HURT" --> "DEAD" : 血量归零
    "ATTACK" --> "HURT" : 被击中(攻击不可中断)
```

### 5.2 战斗数值

| 参数 | 数值 |
|------|------|
| 初始血量 | 100 |
| 普通攻击伤害 | 10 |
| 防御减伤 | 70%（受击仅扣3点） |
| 攻击消耗能量 | 15 |
| 防御消耗能量 | 每帧0.3 |
| 能量恢复速度 | 每帧0.15 |
| 最大能量 | 100 |
| 攻击持续帧数 | 20帧（前5帧前摇，中间5帧判定，后10帧后摇） |
| 受伤硬直帧数 | 15帧 |
| 移动速度 | 3像素/帧 |
| 对战时间 | 99秒 |

### 5.3 碰撞检测

- 攻击判定框：机甲前方延伸的区域，仅在攻击动画的判定帧激活
- 防御判定：防御状态下受击触发减伤
- 角色碰撞：两机甲不可重叠，存在推挤力
