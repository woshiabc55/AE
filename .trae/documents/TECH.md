# 游戏官方设定图收录与可视化画廊 —— 技术架构文档

## 1. 技术栈
- **抓取端**：Python 3.10+、httpx/requests、BeautifulSoup4、lxml
- **展示端**：原生 HTML5、CSS3、Vanilla JS（无构建步骤）
- **数据格式**：JSON
- **存储**：本地文件系统（`assets/` 目录）

## 2. 目录结构

```
/workspace/game-assets-gallery/
├── .trae/documents/        # PRD、技术架构
├── assets/                 # 下载的图片（运行时生成）
│   ├── data.json           # 资源索引
│   └── <game-id>/          # 按游戏分目录
│       └── <character>/    # 按角色分目录
│           └── *.jpg
├── games.json              # 游戏分类与抓取配置清单
├── scraper.py              # 通用抓取脚本
├── index.html              # 可视化画廊
└── README.md               # 使用说明
```

## 3. 数据模型

### 3.1 games.json（源配置）
```json
{
  "categories": ["MOBA", "开放世界/RPG", "射击/FPS", "策略/卡牌", "动作/格斗"],
  "games": [
    {
      "id": "honor-of-kings",
      "name": "王者荣耀",
      "category": "MOBA",
      "brandColor": "#f4c430",
      "sources": ["https://pvp.qq.com/"],
      "enabled": true,
      "parser": "honor_of_kings"
    }
  ]
}
```

### 3.2 assets/data.json（资源索引）
```json
[
  {
    "id": "honor-of-kings-hero-001",
    "gameId": "honor-of-kings",
    "gameName": "王者荣耀",
    "category": "MOBA",
    "type": "hero",
    "name": "李白",
    "subName": "青莲剑仙",
    "localPath": "assets/honor-of-kings/hero/李白/...",
    "remoteUrl": "https://...",
    "tags": ["刺客", "男"]
  }
]
```

## 4. 抓取架构

### 4.1 核心组件
- `ScraperEngine`：会话管理、下载队列、限速、重试、日志。
- `BaseParser`：解析器基类，定义 `parse_index()`、`parse_detail()`、`download()` 接口。
- `HonorOfKingsParser`：王者荣耀示例解析器。
- `GameRegistry`：根据 games.json 中 `parser` 字段分发到对应解析器。

### 4.2 抓取流程
1. 读取 `games.json`，筛选 `enabled: true` 的游戏。
2. 对每个游戏实例化对应解析器。
3. 解析器先抓索引页，得到角色/皮肤列表与详情页 URL。
4. 进入详情页解析高清图片 URL。
5. `ScraperEngine` 下载图片到 `assets/<game-id>/<type>/<name>/`。
6. 生成 `assets/data.json` 索引。

### 4.3 反爬与友好策略
- 请求间隔：默认 0.5~1.5 秒随机延迟。
- User-Agent 轮换：使用常见浏览器 UA。
- Referer 设置：与来源站点一致。
- 失败重试：指数退避，最多 3 次。
- 去重：按 URL MD5 与文件名双重去重。

## 5. 展示架构

### 5.1 页面结构
- `header`：品牌标题 + 搜索框 + 分类筛选栏。
- `main`：瀑布流/网格画廊。
- `lightbox`：全屏大图查看层。
- `footer`：版权说明与免责声明。

### 5.2 关键交互
- 分类筛选：点击分类按钮过滤当前游戏与资源。
- 搜索：实时按游戏名、角色名、皮肤名过滤。
- 灯箱：点击卡片打开，左右键/按钮切换，ESC 关闭。
- 懒加载：使用 `IntersectionObserver` 加载可视区图片。

### 5.3 样式策略
- CSS 变量定义颜色、间距、圆角、阴影。
- 响应式断点：mobile < 640px、tablet 640-1024px、desktop > 1024px。
- 使用 CSS Grid + Masonry-like 自动填充实现非对称画廊。
- 卡片 hover 时显示角色/皮肤名称、所属游戏、分类标签。

## 6. 扩展指南

### 6.1 新增游戏
1. 在 `games.json` 中追加游戏项，指定 `parser` 名称。
2. 在 `scraper.py` 中新建 `XXXParser(BaseParser)`。
3. 实现 `parse_index()` 与 `parse_detail()`。
4. 在 `GameRegistry` 中注册。
5. 重新运行 `python scraper.py`。

### 6.2 新增分类
在 `games.json` 的 `categories` 数组中添加，前端会自动渲染筛选按钮。

## 7. 安全与合规
- 抓取脚本不内置任何受版权保护的资源链接，仅提供可配置的解析示例。
- 用户需自行确认目标站点的 `robots.txt` 与使用条款。
- 公开部署前必须获得图片权利方授权，或使用自有/授权素材。
