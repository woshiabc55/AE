# 航线指令·烬海初航 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────┐
│         浏览器单页（无后端）              │
├─────────────────────────────────────────┤
│  HTML5 语义化结构                        │
│  ├─ <header>  章节时间轴                  │
│  ├─ <main>    全屏滚动剧场                │
│  │   ├─ 开场幕（墨染）                   │
│  │   ├─ 角色幕（三档案）                 │
│  │   ├─ 第一幕（烬海）                   │
│  │   ├─ 第二幕（古码）                   │
│  │   ├─ 第三幕（抉择）                   │
│  │   ├─ 第四幕（初航）                   │
│  │   ├─ 设计备忘（表格）                 │
│  │   └─ 尾幕（字幕）                     │
│  └─ <footer>  钟声余韵                    │
├─────────────────────────────────────────┤
│  CSS3（原生，无框架）                     │
│  ├─ 设计变量（CSS Custom Properties）    │
│  ├─ @keyframes（墨染/漂浮/分裂/钟声）    │
│  ├─ scroll-driven animations             │
│  └─ backdrop-filter / mix-blend-mode    │
├─────────────────────────────────────────┤
│  JavaScript（原生 ES2020）                │
│  ├─ IntersectionObserver 章节触发         │
│  ├─ requestAnimationFrame 粒子系统        │
│  ├─ Web Audio API 钟声/风铃生成           │
│  └─ Custom Cursor 鼠标星尘               │
└─────────────────────────────────────────┘
```

## 2. 技术说明

- **前端**：纯 HTML5 + CSS3 + 原生 JavaScript（ES2020）
- **构建工具**：无需 Vite（单文件项目，直接静态部署）
- **字体**：Google Fonts CDN（Noto Serif SC + Ma Shan Zheng + JetBrains Mono）
- **音频**：Web Audio API 程序化合成（无外部音频文件），钟声/风铃/引擎共鸣
- **图片**：使用 `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image` 生成IMAX氛围图（深空、金属坟场、江南雨巷、地球海岸线）
- **响应式**：CSS Grid + Flexbox + clamp() 字体缩放

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` 或 `index.html` | 单页面全屏滚动剧场 |

## 4. 数据模型

无后端，所有数据为剧本静态内容（已硬编码于 HTML）。

## 5. 文件结构

```
/workspace/
├── index.html              # 主页面（HTML + CSS + JS 内联或外联）
├── README.md
└── .trae/documents/
    ├── PRD.md
    └── TECH.md
```

## 6. 性能优化
- 使用 CSS `will-change` 标记动画属性
- 滚动监听使用 IntersectionObserver 而非 scroll 事件
- 粒子数根据视口大小自适应（PC: 60，移动: 20）
- 字体子集化（Noto Serif SC 通过 `&text=` 参数仅加载剧本涉及字符）
- 图片懒加载 + 渐进式增强

## 7. 浏览器兼容
- Chrome 90+ / Edge 90+ / Safari 14+ / Firefox 88+
- 不支持 backdrop-filter 时回退至半透明黑
