# Game Asset Reference Hub | 游戏素材参考库

一个面向二次创作与设定参考的现代化游戏素材可视化收录工具。支持多游戏分类、标签筛选、搜索、收藏、备注、导入导出等功能。

## 快速开始

1. 启动本地服务器：
   ```bash
   python3 -m http.server 8080
   ```
2. 浏览器访问 http://localhost:8080/

或者直接双击 `index.html` 用浏览器打开（部分浏览器可能因本地文件安全策略无法加载 JSON，建议用本地服务器）。

## 项目结构

```
/workspace/
├── index.html          # 主页面
├── styles.css          # 样式与主题
├── app.js              # 应用逻辑
├── data/
│   └── sample.json     # 示例数据（占位图，非真实官方素材）
└── .trae/documents/
    ├── PRD.md          # 产品需求文档
    └── TechnicalArchitecture.md  # 技术架构文档
```

## 功能说明

- **分类浏览**：左侧边栏按游戏与分类（英雄/皮肤/设定集等）组织素材。
- **全局搜索**：顶部搜索框支持角色、皮肤、标签、游戏名搜索，快捷键 `Ctrl/⌘ + K`。
- **标签筛选**：热门标签云可快速筛选同类素材。
- **视图切换**：网格视图 / 瀑布流视图。
- **收藏与备注**：点击卡片进入详情抽屉，可收藏并添加参考备注，数据保存在浏览器本地。
- **导入导出**：支持 JSON 文本或 JSON 文件导入，也可将当前库导出备份。
- **主题切换**：深色 / 浅色主题。

## 数据格式

导入的 JSON 需包含 `games` 与 `assets` 数组：

```json
{
  "games": [
    {
      "id": "honor-of-kings",
      "name": "王者荣耀",
      "categories": ["英雄", "皮肤", "设定集"],
      "accentColor": "#ff2a6d"
    }
  ],
  "assets": [
    {
      "id": "hok-001",
      "name": "李白",
      "game": "王者荣耀",
      "category": "英雄",
      "character": "李白",
      "tags": ["刺客", "剑客"],
      "sourceUrl": "https://example.com/source",
      "imageUrl": "https://example.com/image.jpg",
      "placeholderColor": "#00f0ff",
      "addedAt": "2026-06-18T00:00:00Z"
    }
  ]
}
```

- `imageUrl` 为空时，将使用 `placeholderColor` 生成占位图。
- `sourceUrl` 用于标注素材来源，建议使用官方或授权来源链接。

## 版权说明

- 本工具内置的示例数据使用程序生成的占位图，**不包含任何真实官方游戏素材**。
- 真实游戏角色、皮肤、设定图等版权归各游戏厂商所有。
- 用户自行导入或引用图片时，需确保拥有合法权利或符合官方使用规范。
- 工具鼓励通过 `sourceUrl` 字段标注素材出处。

## 技术栈

- 纯原生 HTML / CSS / JavaScript，无构建步骤，零外部运行时依赖。
- 使用 localStorage 保存收藏、备注、主题与视图偏好。
