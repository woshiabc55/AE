# 技术架构 - Skill Forge 技能工坊

## 1. 架构设计
```mermaid
graph LR
  subgraph Frontend["前端 (纯静态)"]
    A[React 18 + Vite] --> B[首页 / 工具网格]
    A --> C[工具详情页]
    A --> D[代码查看器]
    A --> E[实时预览沙箱]
  end
  B --> F[工具元数据 (静态 JSON)]
  E --> G[iframe / 内联渲染]
  D --> H[Prism / 自研高亮]
```

## 2. 技术说明
- **前端**：React 18 + Vite 5 + TailwindCSS 3
- **初始化工具**：Vite 官方 React 模板
- **路由**：React Router v6 (HashRouter 适合静态部署)
- **样式**：TailwindCSS + 自定义 CSS 变量
- **代码高亮**：自实现轻量级高亮（避免引入大依赖）
- **后端**：无（纯静态站点，可托管在 Vercel / Netlify / GitHub Pages）
- **数据库**：无；工具数据使用本地 `src/data/tools.ts` 维护

## 3. 路由定义
| 路由 | 用途 |
|-------|---------|
| `/` | 首页，工具网格 + 分类筛选 |
| `/tool/:slug` | 工具详情页（预览 + 源码） |
| `/about` | 关于页 |
| `/category/:name` | 按分类筛选的首页 |

## 4. 数据结构
工具数据在 `src/data/tools.ts` 中以 TypeScript 对象数组形式存储：

```ts
interface Tool {
  slug: string;        // 唯一标识
  name: string;        // 工具名称
  category: 'visual' | 'interaction' | 'animation' | 'generator' | 'experiment';
  tags: string[];
  description: string; // 简短描述
  preview: React.FC;   // 实时预览组件
  code: string;        // 完整 HTML/CSS/JS 源码
  createdAt: string;
}
```

## 5. 组件结构
```
src/
├── App.tsx               # 路由根
├── main.tsx              # 入口
├── pages/
│   ├── Home.tsx          # 首页
│   ├── ToolDetail.tsx    # 工具详情
│   └── About.tsx         # 关于页
├── components/
│   ├── ToolCard.tsx      # 工具卡片
│   ├── CategoryBar.tsx   # 分类筛选
│   ├── CodeBlock.tsx     # 代码展示
│   ├── SearchBar.tsx     # 搜索框
│   └── preview/          # 各工具预览组件
│       ├── GlassMorphism.tsx
│       ├── NoiseTexture.tsx
│       ├── ... (20+ 个)
├── data/
│   └── tools.ts          # 工具数据
├── styles/
│   └── globals.css       # 全局样式
└── lib/
    └── highlight.ts      # 简易代码高亮
```

## 6. 设计令牌
```css
:root {
  --bg: #0a0a0a;
  --fg: #f5f1e8;
  --accent-yellow: #f0ff00;
  --accent-pink: #ff3da5;
  --accent-cyan: #00e5ff;
  --border: 2px solid #f5f1e8;
  --shadow-offset: 4px 4px 0 #f0ff00;
}
```

## 7. 部署
- 静态构建：`npm run build` 输出至 `dist/`
- 可托管：Vercel / Netlify / GitHub Pages
- 无环境变量、无服务端密钥

## 8. 性能预算
- 首屏 LCP < 2s（本地），通过懒加载详情页与预览组件实现
- 工具网格使用 `content-visibility: auto` 优化长列表滚动
- 图片全部本地，避免外部请求
