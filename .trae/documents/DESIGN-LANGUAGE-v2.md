# 深渊恐惧 v2 — 设计语言：铁锈剧本 × 现代化 × 立体感

## 0. 概念来源

> "铁锈剧本" — 一份在海水中浸泡过的、被时间氧化的金属质感脚本。

工业铁锈（rust）= 血红 + 锈橙 + 青铜 + 古铜
现代化 = 大字号、玻璃态、Bento 网格、跑马灯数据
立体感 = 多层 Z 轴、倾斜透视、悬浮投影、边光高光

## 1. 色彩系统（v2）

| Token | HEX | 用途 |
|-------|-----|------|
| `--bg-abyss` | `#050810` | 主背景（保持） |
| `--bg-iron` | `#0A0E14` | 铁黑（新增，比 abyss 更冷） |
| `--bg-oxide` | `#1A1410` | 氧化底（新增，暖深） |
| `--text-bone` | `#E8E8E8` | 主文字 |
| `--text-fog` | `#7A8B99` | 副文字 |
| `--accent-blood` | `#E63946` | 血红 |
| `--accent-rust` | `#C95A2B` | 锈橙（新增，主强调色） |
| `--accent-bronze` | `#8B5A3C` | 青铜（新增，次强调） |
| `--accent-patina` | `#4A6741` | 铜绿（新增，弱强调） |
| `--accent-sun` | `#F4A261` | 夕色（仅镜头 25 收尾） |
| `--edge-light` | `rgba(255,255,255,0.08)` | 玻璃面板顶边光 |
| `--edge-dark` | `rgba(0,0,0,0.4)` | 玻璃面板底边影 |

**新强调色策略**：
- 血红 `#E63946` 用于警告/REC/血线
- 锈橙 `#C95A2B` 用于主强调（替代部分血色的位置）
- 青铜 `#8B5A3C` 用于次要标记
- 铜绿 `#4A6741` 用于"已通过"状态（如时间轴上过去的镜头）

## 2. 立体感工具类

```
.perspective-*         → transform-style: preserve-3d; perspective
.tilt-*                → rotateX/Y/Z tilt
.layer-z-1 .. -5       → z-axis depth + matching shadow
.glass                 → backdrop-blur + 半透背景 + 双层边框
.glass-rust            → 锈橙渐变玻璃
.metal                 → 金属渐变背景 + 边光
.depth-shadow-*        → 1/2/3 层不同强度的投影
```

## 3. 模块化缩放（v2，更激进）

| Token | 像素 | 用途 |
|-------|------|------|
| `text-xs` | 12 | 标签 |
| `text-sm` | 15 | 正文 |
| `text-base` | 19 | 段落 |
| `text-lg` | 24 | 子标题 |
| `text-xl` | 30 | 标题 |
| `text-2xl` | 37 | H2 |
| `text-3xl` | 47 | H1 |
| `text-4xl` | 59 | 章节 |
| `text-5xl` | 74 | 面板大 |
| `text-6xl` | 92 | 节标 |
| `text-7xl` | 115 | 巨字 |
| `text-8xl` | 145 | 章节巨 |
| `text-9xl` | 180 | 主标 |
| `text-hero` | 240 | Hero 巨标 |
| `text-mega` | 320 | 终极 |

## 4. 立体感场景层次（5 层 Z）

```
Z5  (最远) - 背景点阵 + 暗角 + 漂移
Z4         - 大型几何体（背景雕塑、曲线）
Z3         - 中型面板（Agenda Bento 块）
Z2         - 卡片（ShotCard、字段卡）
Z1  (最近) - HUD、按钮、REC 指示
```

每层有不同模糊度 + 投影深度 + 视差速度。

## 5. 现代化组件库

### Bento 网格
不规则 4-6 块网格，混合大字号 / 小数据 / 图标 / 图表。无统一卡片宽度。

### 跑马灯 TC 条
顶部持续从右向左跑动的 timecode + 项目信息带。

### 玻璃面板
```css
background: rgba(232, 232, 232, 0.02);
backdrop-filter: blur(20px);
border: 1px solid rgba(232, 232, 232, 0.08);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.05),
  inset 0 -1px 0 rgba(0, 0, 0, 0.4),
  0 1px 2px rgba(0, 0, 0, 0.4),
  0 8px 24px rgba(0, 0, 0, 0.4),
  0 32px 80px rgba(0, 0, 0, 0.6);
```

### 金属面板
```css
background: linear-gradient(135deg,
  rgba(201, 90, 43, 0.1) 0%,
  rgba(10, 14, 20, 0.6) 50%,
  rgba(139, 90, 60, 0.1) 100%);
border: 1px solid rgba(201, 90, 43, 0.3);
```

### 边光
```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.1),     /* 顶边光 */
  inset 1px 0 0 rgba(255, 255, 255, 0.05),     /* 左边光 */
  inset -1px 0 0 rgba(0, 0, 0, 0.3),           /* 右边影 */
  inset 0 -1px 0 rgba(0, 0, 0, 0.4);           /* 底边影 */
```

## 6. 铁锈纹理

噪点 + 锈斑 SVG mask 叠加，仅在面板边缘和重点位置出现。

```css
.rust-texture {
  background-image:
    radial-gradient(circle at 20% 80%, rgba(201, 90, 43, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 80% 20%, rgba(139, 90, 60, 0.1) 0%, transparent 25%),
    url("data:image/svg+xml;utf8,<svg ...feTurbulence.../>");
}
```

## 7. 动画时长（v2 更分层）

| 级别 | 时长 | 用途 |
|------|------|------|
| micro | 0.15s | 悬停 |
| small | 0.3s | 状态切换 |
| medium | 0.6s | 卡片浮现 |
| large | 1.2s | 大块入场 |
| mega | 2s | 巨字描边、整场收尾 |

## 8. 关键改造目标

| 组件 | v1 | v2 |
|------|----|----|
| Hero 主标 | 200px 平面 | 320px 3D 倾斜 + 锈色边光 |
| Agenda | 3 列均匀 | Bento 5-6 块不规则 |
| ShotCard 顶条 | 普通边框 | 玻璃态 + 跑马灯 TC |
| ShotCard 镜号 | 18px 点阵 | 120px 巨型 3D 倾斜 |
| EndScreen 标题 | 140px 平面 | 180px + 3D 投影 + 锈色渐变 |
| 按钮 | 1px 边框 | 3D 金属按钮（多重阴影） |
| 切换标签 | 平面 | 玻璃胶囊（圆角 + 投影） |
| 时间轴 | 平面圆点 | 立体药丸（投影 + 高光） |

## 9. 信息架构（保持）

```
[HERO 标题页]
   ↓
[AGENDA Bento 目录页]
   ↓
[SHOT 21-25 5 镜头]
   ↓
[END 收尾页]
```

## 10. 不要做的事（v2 新增）

- ❌ 平面无投影的卡片
- ❌ 1px 单色边框（应用 inset 边光）
- ❌ 静态无悬浮的元素
- ❌ 字号 < 240px 的主标
- ❌ 单一光源（应用多向投影）
