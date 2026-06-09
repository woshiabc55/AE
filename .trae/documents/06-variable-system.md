# 06 · 变量系统设计

## 一、设计目标

> 让"任意位置的占位文本"变成"可声明、可校验、可填写的结构化输入"。

具体：
- ✅ 在剧本中用 `{{key}}` 即可自动出现在工坊表单
- ✅ 表单字段类型明确（文本/多行/枚举/数字/滑块）
- ✅ 必填校验、提示说明、分组展示
- ✅ 实时预览渲染结果
- ✅ 一键复制、Token 估算

## 二、变量类型

### 2.1 5 种类型

| Type | 输入 | UI | 典型用途 |
|------|------|----|----------|
| `text` | 单行文本 | `<Input>` | 产品名、目标人群、关键词 |
| `textarea` | 多行文本 | `<Textarea>` | 痛点场景、使用 tips、问题描述 |
| `enum` | 下拉单选 | `<Select>` | 时长、母题、平台 |
| `number` | 数字 | `<Input type=number>` | 字数、天数、镜头数 |
| `slider` | 数值范围 | 滑块（v2） | 情感强度、节奏快慢 |

### 2.2 类型推断（v2 路线图）

编辑器未来可以根据 `{{variable_name}}` 出现的位置与上下文自动推断类型：
- `{{duration}} 秒` → 数字
- `{{theme}}` 在枚举上下文中 → enum
- `{{name}}` 默认 text

当前 v1 全部为 `text`，用户在"变量编辑"Modal 中手动调整。

## 三、变量声明

### 3.1 隐式声明（推荐）

在剧本正文中写 `{{product_name}}`，编辑器自动：
1. 用 `extractVariableKeys` 提取所有 key
2. 与现有 variables 数组合并
3. 新增的 key 默认为 `{ key, label: key, type: 'text', required: true }`

### 3.2 显式声明（变量编辑 Modal）

点击变量面板上的 ✏️ 按钮，弹出 Modal：

```
┌─ 编辑变量 · product_name ─────────────┐
│ 变量名 (key)                          │
│ [product_name________________]        │
│                                       │
│ 显示名                                │
│ [产品名称____________________]        │
│                                       │
│ 类型    默认值                        │
│ [文本▾] [____________]                │
│                                       │
│ 枚举选项（仅 enum）                   │
│ [______, ______, ______]              │
│                                       │
│ 分组                                  │
│ [基础信息________________]            │
│                                       │
│ 提示说明                              │
│ [____________________________]        │
│ [____________________________]        │
│                                       │
│ ☑ 必填                                │
│                                       │
│                       [取消]  [保存]  │
└───────────────────────────────────────┘
```

### 3.3 同步到 body

当用户保存变量时，如果该 key 尚未在 body 中出现，自动追加 `\n{{key}}` 到 body 末尾。

## 四、解析与渲染

### 4.1 解析（extract）

```ts
function extractVariableKeys(text: string): string[] {
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) set.add(m[1]);
  return [...set];
}
```

### 4.2 渲染（render）

```ts
function renderTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g, (_, key) => {
    const v = values[key];
    if (!v || !v.trim()) return `{{${key}}}`;  // 保留原样
    return v;
  });
}
```

### 4.3 缺失检测

```ts
const missingKeys = extractVariableKeys(rendered);
// rendered 仍是带 {{key}} 形式，对应 values[k] 为空
```

用于：
- 工坊顶部状态条「未填 N 处」
- 必填变量红底 + 脉冲

## 五、UI 形态

### 5.1 三种状态

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ FILLED               │ EMPTY                │ READONLY             │
│ {{product_name}}     │ {{product_name}}     │ {{product_name}}     │
│ 琥珀底黑字           │ 暗灰底 + 脉冲        │ 透明底 + 琥珀描边    │
│ mono 字体 0.88em     │ 文字镂空             │ mono 字体            │
│ 14px box-shadow      │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

### 5.2 在编辑器画布中的渲染

编辑器使用 `<textarea>` 作为输入源以获得最佳性能与原生编辑体验。**不在编辑时高亮变量**（避免输入态跳变），仅在预览模式（`<PreviewBody>`）中渲染。

```tsx
{preview ? (
  <PreviewBody body={body} values={...} />
) : (
  <textarea ref={taRef} value={body} onChange={...} />
)}
```

### 5.3 在工坊实时预览中的渲染

工坊右侧实时渲染：使用 `renderTemplate` 替换后，**再二次扫描**找出未填的 `{{key}}`，对未填的 key 使用 `.is-empty` 样式。

```tsx
{body.split(/(\{\{[^}]+\}\})/g).map((p, i) => {
  if (m) {
    const v = values[key];
    return <span className={cn('variable-text', !v && 'is-empty')}>
      {v || `{{${key}}}`}
    </span>;
  }
  return <span>{p}</span>;
})}
```

### 5.4 在变量面板中的渲染

右侧变量面板（编辑器）展示：
- Key 胶囊（点击插入到画布光标）
- 显示名
- 类型徽标
- 必填标记
- hover 出现编辑 / 删除按钮

## 六、工坊表单

### 6.1 智能字段渲染

```tsx
function FormField({ v, value, onChange }) {
  if (v.type === 'textarea') return <Textarea ... />;
  if (v.type === 'enum') return <Select ... />;
  if (v.type === 'number') return <Input type="number" ... />;
  return <Input ... />;
}
```

### 6.2 分组

按 `Variable.group` 字段分组，顶部 Tab 切换：

```
[全部 12] [基础信息 3] [受众 2] [结构 4] [辅助 3]
```

未指定 group 的归入"全部"。

### 6.3 必填校验

未填 + 必填 → 整块淡红背景 + 顶部徽标「必填」。

```tsx
className={cn(
  'rounded-[8px] p-3 -m-3',
  isMissing && v.required && 'bg-[var(--vermilion-soft)]'
)}
```

### 6.4 草稿自动保存

```ts
useEffect(() => {
  const t = setTimeout(() => {
    localStorage.setItem(`ps_draft_${tplId}`, JSON.stringify(values));
    setSavedAt(new Date());
  }, 600);
  return () => clearTimeout(t);
}, [values, tplId]);
```

- 防抖 600ms
- 顶部状态条「已自动保存 · 3 分钟前」
- 离开页面 / 切换模板 时再读取草稿覆盖

## 七、示例套用

每个模板的 `examples: Example[]` 数组可一键套用：

```ts
{ id: 'e1', name: '免煮螺蛳粉 · 25-30岁女生', values: { product_name: '免煮螺蛳粉', ... } }
```

工坊底部示例胶囊：

```
套用示例：[免煮螺蛳粉] [便携筋膜枪]
```

点击 → `setValues({...ex.values})` + toast「已套用：xxx」。

## 八、变量使用的最佳实践

### ✅ DO

1. **变量名即语义**：`{{target_audience}}` 而非 `{{ta}}`
2. **互斥概念用不同变量**：`{{opening}}` + `{{turning}}` + `{{closing}}`
3. **枚举用短选项**：`15 / 30 / 45 / 60` 而非 `15秒 / 30秒`
4. **为变量写 hint**：告诉使用者"填什么"

### ❌ DON'T

1. **不要用变量表达"逻辑"**：`{{if x then y}}`（AI 会乱解释）
2. **不要在变量中嵌套变量**：`{{name_{{lang}}}}`（解析器不支持）
3. **不要用变量传递代码**：`{{python_code}}`（容易注入）
4. **不要在变量名中用动词**：`{{use}}` `{{do}}`

## 九、变量系统路线图

| 版本 | 能力 |
|------|------|
| v1.0（当前） | 5 类型、显式声明、必填校验、草稿 |
| v1.1 | 类型自动推断 |
| v1.2 | 变量依赖（A 填了才能填 B） |
| v1.3 | 条件插槽（`{{?optional}}...{{/}}`） |
| v2.0 | 跨模板变量共享（团队级） |
| v2.0 | 变量市场（社区贡献） |

## 关联文档

- 05 · [剧本格式规范](./05-script-format.md) — body 中变量的语法
- 04 · [架构与数据流](./04-architecture.md) — 变量如何在 store 中流转
