# 07 · 用户旅程与流程

## 一、用户角色

```mermaid
graph TB
    Guest((访客<br/>未登录))
    User((注册创作者))
    Demo((演示账号))

    Guest -->|体验演示| Demo
    Guest -->|登录/注册| User
    Demo -->|退出| Guest
    User -->|退出| Guest
```

| 角色 | 入口 | 核心动机 |
|------|------|----------|
| **访客** | 直接访问首页 | 浏览、试用、判断是否值得注册 |
| **注册创作者** | 邮箱注册 | 创建 / 管理 / 复用模板 |
| **演示账号** | 一键登录 | 完整体验，无持久担忧 |

## 二、九条核心用户旅程

### 旅程 1 · 访客首访 → 试跑模板

```mermaid
sequenceDiagram
    autonumber
    participant U as 访客
    participant H as Home
    participant G as Gallery
    participant D as TemplateDetail
    participant W as Workshop

    U->>H: 打开首页
    H->>U: Hero + 数据 + 精选
    U->>G: 点击"浏览模板展厅"
    G->>U: 6 大分类卡片网格
    U->>D: 点击感兴趣模板
    D->>U: 4 Tab 详情
    U->>W: 点击"立即使用"
    W->>U: 左侧表单（示例已填）
    U->>W: 改 1-2 个变量
    W->>U: 实时预览右侧
    U->>W: 点"复制"
    W-->>U: Toast "已复制"
    U->>U: 粘贴到外部 AI 工具 ✓
```

**关键节点**
- 第 5 步：分类卡片 Hover 应有 lift 效果（已实现 `whileHover={{ y: -4 }}`）
- 第 8 步：工坊打开后默认填充 examples[0]（已实现）
- 第 10 步：右侧预览应实时（已实现 `useMemo`）

**潜在摩擦**
- 必填变量未填 → 红底脉冲 + "未填 N 处"
- 变量太多 → 分组 Tab 切换

### 旅程 2 · 创作者创建空白模板

```mermaid
sequenceDiagram
    autonumber
    participant U as 创作者
    participant E as Editor
    participant LS as localStorage
    participant API as TemplateService
    participant W as Workshop

    U->>E: 点击"剧本编辑器" 导航
    E->>U: 空白编辑器 + 占位剧本
    U->>E: 输入标题
    U->>E: 写剧本 + 插入 {{variable}}
    Note over E: 800ms 防抖<br/>localStorage 自动保存
    E->>LS: 写入 ps_editor_new
    U->>E: 右侧变量面板自动出现 {{variable}}
    U->>E: 编辑变量（改类型/分组/必填）
    U->>E: 插入片段（左侧库）
    U->>E: 点"保存"
    E->>API: create(input, user.id, user.name)
    API->>LS: push 到 ps_templates_v1
    API-->>E: Template{id}
    E->>E: nav('/editor/' + id)
    E->>U: Toast "已保存到云端"
    U->>E: 点"立即使用"
    E->>W: nav('/workshop/' + id)
    W->>U: 工坊界面
```

**关键节点**
- 步骤 4：自动保存通过 useEffect + setTimeout 800ms 防抖
- 步骤 5：变量自动从 body 抽取（`extractVariableKeys`）
- 步骤 7：保存前若未登录会拦截并提示

### 旅程 3 · 老用户复用已有模板

```mermaid
sequenceDiagram
    autonumber
    participant U as 老用户
    participant L as Library
    participant E as Editor
    participant W as Workshop

    U->>L: 打开"我的剧库"
    L->>U: 文件夹树 + 模板网格
    U->>L: 找到目标模板
    alt 修改变量后使用
        U->>E: 点击模板
        E->>U: 编辑器
        U->>E: 改动剧本
        U->>E: 点"立即使用"
        E->>W: 进入工坊
    else 直接使用
        U->>W: 长按模板 → "立即使用"
        W->>U: 工坊界面（值已加载）
    end
    W->>U: 一键复制
```

### 旅程 4 · Fork 公开模板

```mermaid
flowchart LR
    A[详情页] -->|点 Fork 按钮| B{已登录?}
    B -->|否| C[跳登录页]
    C -->|登录成功| D
    B -->|是| D[TemplateService.fork id]
    D --> E[复制 body + variables + examples]
    E --> F[新建 isPublic=false 模板]
    F --> G[nav /editor/新id]
    G --> H[用户继续编辑]
```

### 旅程 5 · 收藏与组织

```mermaid
sequenceDiagram
    participant U as 用户
    participant Card as 模板卡片
    participant App as useApp
    participant LS as LS

    U->>Card: 点击 <Bookmark>
    Card->>App: toggleFavorite(id)
    App->>LS: add/remove from ps_favorites_v1
    App->>App: set({ favorites: newSet })
    Card->>U: 按钮立即变实心
    App-->>U: Toast "已收藏"

    Note over U,LS: 之后访问 /library
    U->>App: 切到"收藏" Tab
    App->>LS: 读 ps_favorites_v1
    LS-->>U: 收藏的模板列表
```

### 旅程 6 · 搜索 / 筛选 / 排序

```mermaid
flowchart TB
    A[打开展厅] --> B[6 个分类 Tab]
    B --> C{操作}
    C -->|搜索| D[输入框]
    D --> E[TemplateService.list search=q]
    C -->|点分类| F[params cat=xxx]
    F --> E
    C -->|排序| G[select newest/popular/fav]
    G --> E
    C -->|筛选| H[标签 chips]
    H --> E
    E --> I[渲染网格]
    I --> J[Hover 卡片 上浮]
    J --> K[点击进入详情]
```

**性能**：所有筛选在客户端完成，< 16ms。`useMemo` 缓存 allTags。

### 旅程 7 · 草稿恢复

```mermaid
sequenceDiagram
    participant U as 用户
    participant W as Workshop
    participant LS as LS

    Note over U,LS: 上次填写到一半
    U->>W: 重新打开同一模板
    W->>LS: 读 ps_draft_${tplId}
    LS-->>W: { values: {...} }
    W->>W: setValues(draft)
    W->>U: 显示上次填写 ✓
    U->>W: 继续 / 修改
    W->>LS: 防抖 600ms 自动保存
```

**异常路径**：
- LS 损坏 → `try/catch` 静默失败，回退到示例 1
- 模板已删除 → 路由回退 + toast

### 旅程 8 · 退出登录 / 切换账号

```mermaid
sequenceDiagram
    participant U as 用户
    participant Menu as UserMenu
    participant App as useApp
    participant LS as LS

    U->>Menu: 点击头像
    Menu->>U: 下拉菜单
    U->>Menu: 点击"退出登录"
    Menu->>App: logout()
    App->>LS: removeItem('ps_user_v1')
    App->>U: Toast "已退出登录"
    App->>App: set({ user: null })
    Note over U,App: 顶栏变为<br/>"登录/注册"按钮
```

### 旅程 9 · 错误恢复

| 错误 | 表现 | 恢复 |
|------|------|------|
| 网络断开（演示环境） | sleep 永远不返回 | 暂无超时，建议加 5s 超时 |
| localStorage 满 | 写入抛错 | try/catch 静默 + toast 提示"本地空间已满" |
| 剪贴板权限拒 | CopyButton 视觉反馈卡住 | 显示"请手动复制" |
| 模板 body 含非法 JSON | 解析失败 | 不暴露给用户，编辑器显示原始 |
| 用户输入超大文本（>100KB） | 渲染卡顿 | 限流 + 警告（v1.1） |

## 三、关键页面停留时长目标

| 页面 | 目标停留 | 体验基线 |
|------|----------|----------|
| Home | 30s 决定去展厅 | 视差 Hero + 数据滚动 + 5 类 |
| Gallery | 90s 找到模板 | 6 类切换 + 标签筛选 |
| TemplateDetail | 45s 决定使用 | 4 Tab + 示例套用 |
| Workshop | 90s 完成填写 | 实时预览 + 套用示例 |
| Editor | 30min 完成搭建 | 片段库 + 自动保存 |
| Library | 15s 找到目标 | 文件夹树 + 搜索 |

## 四、转化漏斗

```mermaid
funnel
    访问首页 → 浏览展厅 → 打开详情 → 进入工坊 → 完成填写 → 复制成功
    100%       60%         40%          25%          20%         18%
```

**优化点**
- Home → Gallery：CTA 按钮 + 6 类展示
- Gallery → Detail：卡片悬停 + 标题摘要
- Detail → Workshop：「立即使用」主 CTA
- Workshop → 完成：实时预览反馈
- 完成 → 复制：复制按钮 + 视觉确认

## 五、关键交互反馈清单

| 反馈点 | 实现 |
|--------|------|
| 卡片 hover | translateY(-4px) + 描边亮起 + 阴影 |
| 收藏 toggle | 实心 / 空心 + Toast |
| 变量插入 | Toast "已插入 {{key}}" |
| 片段插入 | Toast "已插入「开场」" + 焦点回到画布 |
| 自动保存 | 顶部状态条 "已自动保存 · 3 分钟前" |
| 复制成功 | CopyButton 1.5s 内变绿打勾 |
| 必填缺失 | 红底 + 脉冲呼吸 |
| 网络中 | sleep 模拟，loading spinner |
| 跳转路由 | 模态入场，stagger children |

## 关联文档

- 04 · [架构与数据流](./04-architecture.md) — 旅程背后触发的服务调用
- 09 · [错误与边界状态](./09-error-states.md) — 异常态如何被处理
