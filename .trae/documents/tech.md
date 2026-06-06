# 《哥窑》主旨解读 PPT — 技术架构

## 1. 架构设计
```mermaid
flowchart TB
  A[index.html\n(单页入口)] --> B[CSS 主题层\n(slide.css)]
  A --> C[JS 控制层\n(slide.js)]
  B --> D[Google Fonts\nNoto Serif SC / Cormorant]
  C --> E[键盘/滚轮事件]
  C --> F[页面状态机\n(5 张 slide)]
  F --> G[封面 Slide 0]
  F --> H[总纲 Slide 1]
  F --> I[证据链 Slide 2]
  F --> J[主旨升华 Slide 3]
  F --> K[结语 Slide 4]
  A -.烟雾/火星粒子.-> L[CSS Animation]
```

## 2. 技术说明
- **前端**：原生 HTML5 + CSS3 + 原生 ES6 JavaScript（无构建工具）。
- **初始化方式**：直接生成 `index.html` / `styles.css` / `script.js` 三个静态文件。
- **后端**：无（纯静态）。
- **数据库**：无。
- **字体**：通过 Google Fonts CDN 引入 Noto Serif SC 与 Cormorant Garamond。
- **图标**：少量内联 SVG（古琴、窑火、火星），不引入第三方图标库。
- **部署**：`python3 -m http.server 8000` 提供本地预览。

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| `/` | 唯一入口，渲染 5 张 slide |
| `#slide-N` | 锚点直接定位到第 N 张（可选增强） |

## 4. API 定义
- 不涉及后端 API，所有数据内联在 HTML。

## 5. 交互事件
| 事件 | 行为 |
|------|------|
| `keydown ArrowRight / Space / PageDown` | 下一张 |
| `keydown ArrowLeft / PageUp` | 上一张 |
| `keydown Home` | 回到封面 |
| `keydown End` | 跳到结语 |
| `wheel` 节流 800ms | 翻页（防误触） |
| `click .nav-next / .nav-prev` | 翻页按钮 |
| 进度条 | 实时反映当前 slide 比例 |

## 6. 文件结构
```
/workspace
├── index.html
├── styles.css
├── script.js
├── .trae/documents/
│   ├── prd.md
│   └── tech.md
└── README.md
```

## 7. 视觉动效清单
1. **封面窑火光晕**：CSS `radial-gradient` + `filter: blur()` 缓动呼吸。
2. **墨色扩散**：SVG mask + `stroke-dasharray` 描线动画。
3. **粒子火星**：约 30 个 `<span>` 浮动，CSS keyframes 不同延时。
4. **翻页过渡**：`transform: translateX()` + `opacity` 800ms cubic-bezier。
5. **进度条**：`scaleX` 0→1 在 400ms 内完成。

## 8. 性能预算
- 首屏 JS < 20KB（gzipped）。
- CSS < 30KB。
- 字体通过 `font-display: swap` 异步加载。
- 移动端通过 `@media` 隐藏粒子以保 60fps。
