# 03 · 组件库文档

> 23 个核心组件的 API、用法、最佳实践。组件源码位于 `src/components/ui.tsx` 与 `src/components/layout.tsx`。

## 目录

- [按钮与触发](#1-按钮与触发)
- [表单输入](#2-表单输入)
- [数据展示](#3-数据展示)
- [反馈与状态](#4-反馈与状态)
- [装饰元素](#5-装饰元素)
- [布局组件](#6-布局组件)

---

## 1. 按钮与触发

### 1.1 `<Button>`

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" icon={<Save />} loading={false} onClick={...}>
  保存
</Button>
```

**Props**

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `variant` | `primary` / `secondary` / `ghost` / `danger` / `outline-amber` | `secondary` | 视觉变体 |
| `size` | `sm` (h-8) / `md` (h-10) / `lg` (h-12) | `md` | 尺寸 |
| `loading` | boolean | `false` | 显示加载 spinner |
| `icon` / `iconRight` | ReactNode | - | 左侧/右侧图标 |
| `disabled` | boolean | `false` | 禁用态 |
| `onClick` | function | - | 点击回调 |

**Variant 用法**

| 场景 | 推荐 |
|------|------|
| 最重要的下一步 | `primary` 琥珀金 |
| 次要操作 | `secondary` 暗灰 |
| 视觉上需要弱化 | `ghost` 透明 |
| 危险操作（删除） | `danger` 砚红 |
| 次级 CTA / 引导 | `outline-amber` 描边 |

### 1.2 `<IconButton>`

紧凑图标按钮。带 `title` 属性提升可访问性。

```tsx
<IconButton icon={<X size={16} />} variant="ghost" size="md" title="关闭" />
```

---

## 2. 表单输入

### 2.1 `<Input>`

```tsx
<Input
  label="产品名称"
  hint="如：免煮螺蛳粉"
  prefix={<Search size={14} />}
  suffix={null}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  maxLength={50}
  required
/>
```

**特点**
- 自带 label + hint + 字数计数布局
- 支持 `prefix`（左侧图标）和 `suffix`（右侧装饰）
- focus 态自动应用琥珀描边 + 光晕

### 2.2 `<Textarea>`

```tsx
<Textarea
  label="描述"
  hint="一句话说明这个模板"
  showCount
  maxLength={140}
  rows={3}
  value={desc}
  onChange={...}
/>
```

### 2.3 `<Select>`

```tsx
<Select
  label="分类"
  value={category}
  onChange={setCategory}
  options={CATEGORIES.map(c => ({ value: c.key, label: c.label }))}
/>
```

下拉项用 `var(--ink-2)` 背景，与原页面融合。

### 2.4 `<SearchInput>`

```tsx
<SearchInput value={search} onChange={setSearch} placeholder="搜索..." />
```

内置左侧搜索图标 + 右侧一键清除按钮。

### 2.5 `<FormField>`（工坊专用）

见 [Workshop.tsx](../src/pages/Workshop.tsx) — 根据 `Variable.type` 智能切换 Input/Textarea/Select/Number。

---

## 3. 数据展示

### 3.1 `<Card>`

```tsx
<Card hoverable padding="md">
  ...
</Card>
```

**Props**：`hoverable`（启用悬浮上浮 + 描边亮起）、`padding`（none / sm / md / lg）。

### 3.2 `<Badge>`

```tsx
<Badge variant="amber">必填</Badge>
<Badge variant="teal">钩子</Badge>
<Badge variant="vermilion">删除</Badge>
<Badge>默认</Badge>
```

### 3.3 `<CoverArt>`

```tsx
<CoverArt seed={tpl.cover} category={tpl.category} size="md" />
```

**Props**：`seed`（任意字符串）、`category`（决定左侧色条）、`size`（sm / md / lg / xl / `aspect-[16/9]`）。

> seed 决定视觉内容，相同 seed 永远生成相同封面。这是"程序化封面"的核心特性。

### 3.4 `<CategoryTag>`

```tsx
<CategoryTag category="short-video" withDot />
```

显示"短视频"中文 + 类别色点（可选）。

### 3.5 `<Stat>`

```tsx
<Stat value={1283} label="累计调用" />
```

大字号 mono 数字 + eyebrow 标签。

### 3.6 `<TabBar>`

```tsx
const [tab, setTab] = useState<'preview' | 'examples' | 'versions' | 'variables'>('preview');
<TabBar
  value={tab}
  onChange={setTab}
  tabs={[
    { value: 'preview', label: '剧本预览' },
    { value: 'variables', label: `变量 (${count})`, count: 5 },
  ]}
/>
```

下划线使用 `framer-motion` `layoutId` 实现平滑滑动。

### 3.7 `<FilmStrip>`

```tsx
<FilmStrip className="opacity-40" />
```

80 个胶片孔的横向装饰条，可放页脚或装饰带。

---

## 4. 反馈与状态

### 4.1 `<Toast>`

通过 `useApp().pushToast({...})` 调用：

```tsx
pushToast({ kind: 'success', message: '已保存到云端' });
pushToast({ kind: 'warn', message: '请先登录' });
pushToast({ kind: 'error', message: '保存失败' });
pushToast({ kind: 'info', message: '已套用示例' });
```

默认 2.4s 自动消失，左侧 2px 强调条。

### 4.2 `<Modal>`

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="标题">
  内容
</Modal>
```

- ESC 键关闭
- 背景点击关闭
- 内容从 y+20 → 0 + scale 0.96 → 1

### 4.3 `<EmptyState>`

```tsx
<EmptyState
  title="空空如也"
  hint="从展厅挑选一个模板"
  icon={<FileText size={24} />}
  action={<Button>从零搭建</Button>}
/>
```

### 4.4 `<CopyButton>`

```tsx
<CopyButton text={promptText} label="复制" successLabel="已复制" />
```

自动使用 `navigator.clipboard.writeText`，含视觉反馈。

---

## 5. 装饰元素

### 5.1 `<Modal>` / `<Toast>` / `<Card>`（已上）

### 5.2 字符装饰类

| 类名 | 效果 |
|------|------|
| `text-cinematic` | 大字号白→米黄 渐变（Hero 标题） |
| `text-cinematic-shadow` | 大字号琥珀色 15% 透明（Hero 投影） |
| `eyebrow` / `eyebrow-amber` | 11px 大写间距 0.18em（章节小标） |
| `mono` | 切换为等宽字体 |
| `hairline` | 横/竖发丝线 |

### 5.3 动画类

| 类名 | 效果 |
|------|------|
| `animate-fade-up` | 单次 fade + 12px up（700ms） |
| `animate-pulse-dot` | 透明度 1→0.3 循环 |
| `animate-spin-slow` | 24s 慢转一圈 |
| `stagger-children > *` | 10 个子元素依次入场（80ms 间隔） |

---

## 6. 布局组件

### 6.1 `<AppShell>`

位于 `src/components/layout.tsx`。包含：
- 顶部 sticky 导航（毛玻璃背景）
- 用户菜单（下拉）
- 移动端汉堡菜单
- 页脚
- `<ToastContainer />`

**使用**：在 App.tsx 中包裹所有 `<Route>`：

```tsx
<AppShell>
  <Routes>...</Routes>
</AppShell>
```

### 6.2 `<UserMenu>`

未登录：展示「体验演示」+「登录/注册」按钮。
已登录：展示头像缩写 + 下拉（剧库 / 编辑器 / 退出）。

### 6.3 内部布局模式

| 模式 | 用法 |
|------|------|
| 顶栏 sticky | `sticky top-0 z-30 backdrop-blur-md bg-[rgba(11,11,15,0.78)]` |
| 分类 sticky | 展厅用 `sticky top-16`（顶栏下方 64px） |
| 内容最大宽 | `max-w-[1440px] mx-auto px-5 lg:px-8` |
| 区块间距 | `py-20` 或 `py-24` |

---

## 7. 复合组件（业务封装）

### 7.1 `<Marquee>`（Home 装饰）

```tsx
<Marquee />  // 横向无限滚动剧目类型
```

### 7.2 `<NumberRoll>`（Home 数据）

```tsx
<NumberRoll target={1283} suffix="" />
```

使用 `requestAnimationFrame` 实现 easeOutCubic 数字滚动。

### 7.3 `<Hero>` / `<StatsBanner>` / `<FeaturedTemplates>` / `<CategoryShowcase>` / `<ValueProp>` / `<Workflow>` / `<Testimonial>` / `<CTASection>`

均位于 `src/pages/Home.tsx`，由 8 个独立区块组合而成，便于在别的页面复用部分区块。

---

## 8. 最佳实践

### ✅ DO
- 永远用组件库按钮，不要写自定义 `<button className="bg-amber-500">`
- 图标统一用 lucide-react，描边 1.5px
- 长文本使用 `<Textarea showCount maxLength>` 强制边界
- 列表项使用 `motion.div` + `initial/animate` + 60-80ms 错位

### ❌ DON'T
- 不要在 inline style 中硬编码颜色，用 CSS 变量
- 不要混用 Tailwind 颜色和 CSS 变量（容易出现色值漂移）
- 不要在 `<button>` 内放 `<button>`（无障碍会报警）
- 不要忘记给 IconButton 加 `title` 属性

---

## 关联文档

- 02 · [UI 设计系统](./02-ui-design-system.md) — 令牌来源
- 04 · [架构与数据流](./04-architecture.md) — 组件如何与状态/服务层通信
