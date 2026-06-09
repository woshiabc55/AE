# 02 · UI 设计系统

## 设计语言：墨黑剧场

剧幕的视觉灵感来自**电影排片场**——黑场里的琥珀色聚光灯、菲林孔的节奏感、衬线字体的印刷品质感。我们把"创作"这件事隐喻为"排片"，把"提示词"隐喻为"剧本"。

## 一、设计令牌（Design Tokens）

所有令牌以 CSS 变量定义在 `src/index.css` 的 `:root` 中。

### 1. 颜色 · 调色板

```
墨黑 ink-0 ~ ink-6   ── 6 阶深度，从 #07070A 到 #4A4A56
纸白 paper-0 ~ paper-4 ── 5 阶文字，从 #FAF7F0 到 #4F4C44
琥珀 amber-0 ~ amber-4 ── 5 阶强调，从 #FFE4A8 到 #8C6515
辅助 verilion / teal-1 / teal-2 / jade
```

#### 类别色（每类剧本一种 hue）

| 类别 | 色值 | 隐喻 |
|------|------|------|
| 短视频 | `#E8B14A` 琥珀金 | 钩子之光 |
| 种草广告 | `#C0392B` 砚红 | 行动力 |
| 直播口播 | `#3A8E8E` 湖青 | 互动场 |
| 小说故事 | `#A876C8` 紫罗兰 | 想象 |
| 分镜脚本 | `#6FB07F` 苔绿 | 镜头语言 |
| 大流量 | `#FF4D6D` 玫红 | 爆点 |

### 2. 字体

| 用途 | 字体 | 备用 |
|------|------|------|
| 标题 Display | Fraunces | Songti SC, STSong, serif |
| 正文 Body | Geist | PingFang SC, Microsoft YaHei |
| 变量/代码 Mono | JetBrains Mono | ui-monospace, SF Mono |

字号阶梯（rem 基准 15px）：

```
text-[10px]  0.667rem  eyebrow / meta
text-[11px]  0.733rem  tag / hint
text-[12px]  0.8rem    caption
text-[13px]  0.867rem  small body
text-[14px]  0.933rem  body
text-[15px]  1rem      default
text-[16px]  1.067rem  lede
text-[18px]  1.2rem    h6
text-[20px]  1.333rem  h5
text-[24px]  1.6rem    h4
text-[30px]  2rem      h3
text-[36px]  2.4rem    h2
text-[48px]  3.2rem    h1
text-[80px]+           hero display
```

### 3. 节奏

```
--r-1 4px   圆角最小
--r-2 8px   圆角标准
--r-3 12px  卡片
--r-4 16px  浮层
--r-5 24px  大容器
--r-6 32px  区块
```

### 4. 阴影

```
--shadow-1  1px 内描边 + 微外阴影，浮起微动效
--shadow-2  12px 模糊 + 32px 偏移，中等浮起
--shadow-3  24px 模糊 + 64px 偏移，模态/抽屉
--glow-amber  琥珀光晕，用于激活态
```

## 二、视觉元素库

### 1. 变量插槽 · 聚光灯（核心元素）

```css
.variable-chip {
  background: linear-gradient(180deg, var(--amber-1), var(--amber-2));
  color: var(--ink-0);
  border-radius: 3px;
  font-family: var(--font-mono);
  box-shadow: 0 0 14px rgba(232, 177, 74, 0.4);
}
```

三种状态：
- **filled**：琥珀底黑字
- **empty**：暗灰底，脉冲动画
- **readonly**：透明底 + 琥珀描边

### 2. 胶片孔 · 装饰条

出现在：卡片底部、Hero 背景、模板详情头部装饰。
- 8 个 `18×12px` 圆角矩形
- 黑色填充 + 1px 描边

### 3. 程序化封面

每个模板有 1 个 `cover` 字符串作为种子，通过 HSL 色彩空间生成确定的渐变：
- 3 个径向渐变（角点+中心）
- 1 个线性渐变（深→浅）
- 叠加噪点纹理
- 中心字符（首字母）半透明大字号
- 底部胶片孔
- 左侧类别色条

> 这种"程序化封面"让 16+ 个模板视觉各异，但视觉语言一致。

### 4. 分割线 · 发丝线

```css
.hairline {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ink-4) 20%, var(--ink-4) 80%, transparent);
}
```

横/竖两个变体。

## 三、动效原则

### 入场（最高优先级）

- 首屏 staggered fade + 8-12px upward
- stagger 间隔 60-80ms
- 缓动 `cubic-bezier(0.2, 0.7, 0.2, 1)`（前快后慢）
- 总时长 ≤ 800ms

### 交互

| 元素 | 触发 | 效果 |
|------|------|------|
| 按钮 | hover | 背景变浅 1 阶 + transform 不变 |
| 按钮 | active | translateY(1px) |
| 卡片 | hover | translateY(-4px) + 描边亮起 + 阴影加深 |
| 变量插槽 | empty | 脉冲呼吸 |
| Toast | 入场 | 从右滑入 + scale 0.95 → 1 |
| Modal | 入场 | 背景 fade + 内容 scale 0.96 + y -20 |

### 滚动

- 横向滚动：模板精选、片段库
- 错位滚动：数字滚动入场（首页数据看板）
- 视差滚动：Hero 区装饰封面（用 framer-motion `useScroll` + `useTransform`）

## 四、布局栅格

- **桌面优先**：1440px 设计稿，1280px 起步
- **最大宽度**：`max-w-[1440px]` 居中
- **栏间距**：`gap-4` (16px) / `gap-5` (20px) / `gap-6` (24px) / `gap-8` (32px) / `gap-10` (40px)
- **章节间距**：`py-20` (80px) 或 `py-24` (96px)
- **左右内边距**：`px-5 lg:px-8`

### 常用栅格模板

| 页面 | 桌面布局 |
|------|----------|
| 首页 Hero | 7-5 栏（标题 + 装饰） |
| 模板展厅 | 4 栏卡片（lg 以上） |
| 模板详情 | 8-4 栏（内容 + 侧栏） |
| 工坊 | 5-7 栏（表单 + 预览） |
| 编辑器 | 3 栏（片段库 240 + 画布 自适应 + 变量 288） |

## 五、图标

- 全部使用 [lucide-react](https://lucide.dev/)
- 描边宽度默认 1.5-2px
- 尺寸阶梯：13 / 14 / 15 / 16 / 18 / 20 / 24
- 全部 1px 内描边对齐
- 自定义场景（Film 标）使用纯 SVG

## 六、可复用装饰类

```css
.text-cinematic  /* 大字号渐变白 */
.text-cinematic-shadow  /* 投影文本（首页） */
.eyebrow / .eyebrow-amber  /* 章节小标 */
.tag / .tag-amber / .tag-teal / .tag-vermilion  /* 标签 */
.film-strip / .hole  /* 胶片孔 */
.cover-*  /* 程序化封面（按 seed 生成） */
```

## 七、深色 vs 浅色

当前**仅深色**。原因：
1. 墨黑剧场美学是产品灵魂
2. 琥珀金聚光灯在深色下更聚焦
3. 创作者长时间工作更不刺眼

未来如要浅色：保留墨黑为底，纸白为文字主，琥珀金不动。

## 八、设计参考与灵感来源

- **Linear / Vercel**：干净的几何与留白
- **Notion**：结构化文本编辑
- **Type Studio / 乐高排片场**：剧场隐喻
- **Figma / Pitch**：演示叙事

## 关联文档

- 03 · [组件库文档](./03-component-library.md) — 令牌如何应用在具体组件
- 04 · [架构与数据流](./04-architecture.md) — 令牌在代码中的承载形式
