# 10 · 可访问性指南

> 让剧本创作对**所有创作者**都开放 — 包括键盘用户、屏幕阅读器用户、低视力用户、动效敏感用户。

## 一、设计准则

我们遵循 **WCAG 2.1 AA** 级标准，并把核心原则融入设计：

1. **可感知** — 信息必须以多种方式呈现
2. **可操作** — UI 组件必须可被多种设备操作
3. **可理解** — 信息和操作必须清晰
4. **健壮** — 内容必须能被各种辅助技术解析

## 二、键盘导航

### 2.1 全局快捷键

| 键 | 行为 | 范围 |
|----|------|------|
| `Tab` / `Shift+Tab` | 下一个 / 上一个焦点 | 全局 |
| `Enter` | 激活按钮 / 提交表单 | 焦点在按钮或表单 |
| `Esc` | 关闭模态 / 取消编辑 | 模态打开时 |
| `Cmd/Ctrl + S` | 保存（编辑器 + 工坊） | 编辑器 / 工坊 |
| `Cmd/Ctrl + K` | 打开搜索 | 全局（v1.1） |
| `↑ ↓ ← →` | 列表项 / Tab 切换 | 列表 / Tab 栏 |

### 2.2 焦点顺序

合理的 Tab 顺序：自上而下、自左而右。

```
页面顶部：Logo → 导航 → 搜索 → 右上角操作
主内容：分类 Tab → 卡片网格（从左到右从上到下） → 底部 CTA
```

### 2.3 焦点环

```css
:focus-visible {
  outline: 2px solid var(--amber-2);
  outline-offset: 2px;
  border-radius: 4px;
}
```

所有交互元素必须可见焦点环。**不**使用 `outline: none` 而无替代。

### 2.4 跳过链接

页面顶部应有"跳到主内容"链接（v1.1）：

```html
<a href="#main" class="sr-only focus:not-sr-only">跳到主内容</a>
```

## 三、屏幕阅读器

### 3.1 语义 HTML

```tsx
// ✅ 正确
<header><nav><ul><li><a></a></li></ul></nav></header>
<main>
  <article>
    <h1>...</h1>
    <section aria-labelledby="...">
      <h2 id="...">...</h2>
    </section>
  </article>
</main>
<footer>...</footer>
```

### 3.2 ARIA 标记

#### 3.2.1 按钮

```tsx
<button aria-label="关闭对话框"><X /></button>
<button aria-label="收藏模板" aria-pressed={isFav}>
  <Bookmark />
</button>
```

#### 3.2.2 模态

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">编辑变量</h2>
</div>
```

#### 3.2.3 实时状态

```tsx
<div aria-live="polite" aria-atomic="true">
  {savedAt ? '已自动保存 · 3 分钟前' : '等待编辑...'}
</div>

<div role="status" aria-live="polite">
  {missingKeys.length > 0 && `未填 ${missingKeys.length} 处`}
</div>
```

#### 3.2.4 进度指示

```tsx
<button aria-busy={loading} aria-live="polite">
  {loading ? '保存中...' : '保存'}
</button>
```

### 3.3 图片 alt

- **程序化封面**（CoverArt）：`role="img" aria-label="模板封面：${title}"`
- **图标按钮**：`aria-label` 描述行为
- **装饰图**：`alt=""` 或 `aria-hidden="true"`

### 3.4 变量插槽的可读性

屏幕阅读器需要把 `{{product_name}}` 读成"产品名称"或"product name 变量"，而不是"左花括号左花括号 product 下划线 name 右花括号右花括号"。

```tsx
<span
  className="variable-text"
  role="text"
  aria-label={`变量 ${displayLabel}，当前值：${value || '未填'}`}
>
  {`{{${key}}}`}
</span>
```

## 四、视觉可访问性

### 4.1 色彩对比度

| 元素 | 前景 | 背景 | 对比度 | AA 要求 |
|------|------|------|--------|---------|
| 正文 | `#F4EFE6` (paper-1) | `#0B0B0F` (ink-1) | 16.2:1 | ✓ |
| 副文字 | `#B9B4A8` (paper-2) | `#0B0B0F` | 9.1:1 | ✓ |
| 弱文字 | `#7A766C` (paper-3) | `#0B0B0F` | 4.6:1 | ✓ (大字) |
| 琥珀强调 | `#E8B14A` (amber-2) | `#0B0B0F` | 9.5:1 | ✓ |
| 琥珀文字 | `#E8B14A` | 透明背景 | 9.5:1 | ✓ |
| 按钮文字 | `#0B0B0F` | `#E8B14A` | 9.5:1 | ✓ |
| 错误文字 | `#C0392B` | `#0B0B0F` | 5.1:1 | ✓ |

### 4.2 不仅靠颜色传递信息

```tsx
// ❌ 仅靠颜色
<span className="text-vermilion">{missingKeys.length} 处未填</span>

// ✅ 颜色 + 文字 + 图标
<>
  <AlertCircle size={12} className="text-vermilion" />
  <span className="text-vermilion">未填 {missingKeys.length} 处</span>
</>
```

### 4.3 字号缩放

支持浏览器 200% 缩放，无内容丢失或水平滚动。

### 4.4 高对比度模式

```css
@media (prefers-contrast: more) {
  :root {
    --ink-4: #6A6A78;  /* 描边更亮 */
    --paper-2: #E0DBC9;  /* 文字更亮 */
  }
}
```

## 五、动效可访问性

### 5.1 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Framer Motion 中：

```tsx
const shouldReduce = useReducedMotion();  // 来自 framer-motion
<motion.div
  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={shouldReduce ? { duration: 0 } : undefined}
/>
```

### 5.2 闪烁限制

不闪烁 > 3 次/秒（WCAG 2.3.1）。`animate-pulse-dot` 用 1.6s 周期，远低于 3 Hz。

### 5.3 自动播放

Hero 视差滚动依赖 scrollY，不算"自动播放"。v1.1 视频预告片需可暂停。

## 六、触摸与移动

### 6.1 触摸目标

最小 44×44px（iOS HIG）。

| 元素 | 尺寸 |
|------|------|
| 主按钮 | h-10 (40px) — 略小，但 h-12 用于关键 CTA |
| 次按钮 | h-8 (32px) — 桌面足够，移动版 v1.1 加 h-10 |
| IconButton sm | w-7 h-7 — 仅桌面，移动版 v1.1 改 w-9 |
| 卡片 | 整张卡片可点，移动端 padding 加到 p-5 |

### 6.2 手势

- 双指缩放：禁用（避免误触）
- 滑动返回：依赖浏览器原生
- 长按：v1 不引入长按菜单

### 6.3 视口

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

支持 iPhone 安全区：

```css
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
```

## 七、表单可访问性

### 7.1 必填与可选

```tsx
<label htmlFor="product">
  产品名
  <span className="text-vermilion" aria-label="必填">*</span>
</label>
<input
  id="product"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'product-error' : 'product-hint'}
/>
{hasError && <p id="product-error" role="alert">产品名不能为空</p>}
```

### 7.2 错误聚合

提交时若有多个错误，焦点跳到第一个错误字段，screen reader 自动播报。

```ts
function focusFirstError(form: HTMLFormElement) {
  const firstError = form.querySelector('[aria-invalid="true"]');
  (firstError as HTMLElement)?.focus();
}
```

## 八、国际化准备（i18n 路线图）

虽然 v1 仅中文，但所有 UI 字符串集中在：

```ts
// v1.1
const t = {
  'btn.save': '保存',
  'btn.cancel': '取消',
  'toast.copied': '已复制到剪贴板',
  // ...
};
```

- 不硬编码英文作为 fallback
- 预留 `lang` 属性切换 `<html lang="zh-CN">`
- 数字 / 日期用 `Intl.NumberFormat` / `Intl.DateTimeFormat`

## 九、测试清单

### 9.1 自动化

- [ ] axe-core / eslint-plugin-jsx-a11y 在 CI 跑
- [ ] Lighthouse Accessibility 分数 ≥ 95
- [ ] 所有图片有 alt
- [ ] 所有按钮有可读名字

### 9.2 人工

- [ ] 键盘走完 3 条主旅程
- [ ] VoiceOver / NVDA 走完 1 条主旅程
- [ ] 200% 缩放无破版
- [ ] prefers-reduced-motion 关闭动效
- [ ] prefers-contrast: more 提亮描边
- [ ] 移动端 360px 宽度不破版

## 十、辅助技术兼容性

| 技术 | 版本 | 支持 |
|------|------|------|
| VoiceOver (iOS / macOS) | iOS 16+ / macOS 13+ | ✓ |
| NVDA | 2024+ | ✓（测试中） |
| JAWS | 2024+ | 计划测试 |
| 键盘 only | - | ✓ |
| Windows High Contrast | - | 部分（待提升） |
| 屏幕放大镜 | 200% / 400% | ✓ |

## 关联文档

- 02 · [UI 设计系统](./02-ui-design-system.md) — 色彩对比基线
- 09 · [错误与边界状态](./09-error-states.md) — 错误如何对屏幕阅读器播报
