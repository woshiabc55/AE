# 技术架构文档

## 1. 技术选型

- **构建工具**：无构建步骤，纯静态 HTML/CSS/JS，单文件可离线运行。
- **框架/库**：原生 JavaScript（ES2020+），不引入 React/Vue/Angular，保证零依赖、低加载成本。
- **样式**：原生 CSS，使用 CSS Variables 管理主题。
- **存储**：浏览器 localStorage 保存收藏、备注、视图偏好。
- **数据格式**：JSON，便于用户导入/导出。
- **图标**：内联 SVG，无需外部图标库。

## 2. 项目结构

```
/workspace/
├── index.html          # 主入口，包含完整界面结构
├── styles.css          # 全局样式、主题变量、动画
├── app.js              # 应用逻辑、数据管理、渲染、交互
├── data/
│   └── sample.json     # 示例数据（占位图 + 游戏/角色/皮肤元数据）
└── .trae/documents/
    ├── PRD.md
    └── TechnicalArchitecture.md
```

## 3. 数据模型

### 3.1 素材对象（Asset）

```json
{
  "id": "asset-unique-id",
  "name": "青莲剑仙 李白",
  "game": "王者荣耀",
  "category": "皮肤",
  "character": "李白",
  "tags": ["刺客", "水墨", "传说皮肤"],
  "sourceUrl": "https://example.com/source",
  "imageUrl": "https://example.com/image.jpg",
  "placeholderColor": "#00f0ff",
  "note": "",
  "favorited": false,
  "addedAt": "2026-06-18T00:00:00Z"
}
```

### 3.2 游戏对象（Game）

```json
{
  "id": "honor-of-kings",
  "name": "王者荣耀",
  "categories": ["英雄", "皮肤", "设定集"],
  "accentColor": "#ff2a6d"
}
```

### 3.3 用户偏好

- 当前视图模式（grid / masonry）
- 当前主题（dark / light）
- 收藏列表
- 自定义备注

## 4. 核心模块

### 4.1 DataManager
- 加载示例数据。
- 从 localStorage 读取/写入用户数据。
- 提供搜索、筛选、排序接口。
- 导入/导出 JSON。

### 4.2 Renderer
- 渲染侧边栏游戏分类树。
- 渲染素材卡片网格/瀑布流。
- 渲染标签云、收藏列表、空状态。
- 渲染右侧详情抽屉。

### 4.3 InteractionController
- 处理搜索输入、分类点击、标签筛选。
- 处理卡片点击、收藏切换、备注保存。
- 处理视图切换、主题切换、导入导出。

### 4.4 LazyLoader
- 使用 IntersectionObserver 实现图片懒加载。
- 未加载前显示 SVG 占位图。

## 5. 关键交互流程

### 5.1 页面初始化
1. 加载 CSS/JS。
2. DataManager 初始化示例数据，合并 localStorage 中的收藏与备注。
3. Renderer 渲染侧边栏与全部素材。
4. LazyLoader 开始监听卡片图片。

### 5.2 筛选流程
1. 用户点击分类/输入搜索/点击标签。
2. InteractionController 更新当前筛选状态。
3. DataManager 根据状态过滤数据。
4. Renderer 重新渲染主内容区并播放过渡动画。

### 5.3 导入流程
1. 用户点击“导入”按钮，弹出模态框。
2. 用户粘贴 JSON 或选择本地 JSON 文件。
3. DataManager 校验并合并数据。
4. Renderer 刷新全部视图。

## 6. 性能策略

- 图片懒加载：仅视口内图片加载真实 URL。
- 虚拟滚动预留：当前版本数据量小，先使用分页或分页加载，后续可接入虚拟滚动。
- CSS 动画尽量使用 transform/opacity，避免重排。
- 搜索使用防抖，避免高频过滤。

## 7. 安全与版权

- 不内置任何自动抓取/下载逻辑。
- 用户导入数据时，仅做 JSON 结构校验，不主动请求外部图片服务器。
- 详情页展示来源链接字段，鼓励标注版权出处。
- 示例数据全部使用程序生成的占位图，不引用任何真实官方素材。

## 8. 部署方式

- 直接打开 `index.html` 即可使用。
- 可部署到任意静态托管（GitHub Pages、Vercel、Netlify 等）。
- 可后续扩展为 PWA，通过 Service Worker 缓存离线使用。
