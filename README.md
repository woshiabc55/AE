# 铁链惊蛰 · 分镜工坊

> 「铁链惊蛰 · 黄忌出阵」四镜 · 60 秒 IMAX 战斗分镜可视化与 AI 提示词工作站。

将分镜脚本中的时序、动作、视觉导向、节奏波形、粒子轨迹与英文 AI 提示词整合到单一交互式界面，便于分镜师、导演与 AI 视频创作者快速对照与导出。

## 功能页面

| 页面 | 路径 | 作用 |
|------|------|------|
| 总览页 | `/` | Hero、时序条、节奏波形卡、动态导向总线对照表 |
| 分镜详情 | `/scene/:id` | 单镜分镜表、运镜图示、AI 提示词卡 |
| 动态总线 | `/motion-bus` | 横向 60 格时间线 + 四镜节奏波形 + 视觉导向 + 粒子轨迹 |
| 提示词库 | `/prompts` | 四镜可折叠提示词卡片，支持单镜/全部复制 |
| 粒子演示 | `/particles` | 6 类 Canvas 粒子循环预览 |

## 启动

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 打包
npm run preview  # 预览
```

## 技术栈
- Vue 3 + TypeScript + Vite 5
- vue-router 4（hash 模式）
- Pinia（数据缓存）
- 原生 CSS + CSS 变量（暗色调战火 / 青铜 / 血红）
- Google Fonts: Cinzel / Noto Serif SC / Inter / JetBrains Mono
- Canvas 2D 粒子循环（无第三方动画库）

## 目录结构

```
src/
├── main.ts
├── App.vue                    # 根布局（侧栏 + RouterView）
├── router/index.ts
├── stores/storyboard.ts
├── data/storyboard.json       # 四镜完整数据 + 粒子元数据
├── views/
│   ├── OverviewView.vue
│   ├── SceneDetailView.vue
│   ├── MotionBusView.vue
│   ├── PromptsView.vue
│   └── ParticlesView.vue
├── components/
│   ├── TimelineBar.vue
│   ├── BeatCard.vue
│   ├── ShotTable.vue
│   ├── CameraDiagram.vue
│   ├── PromptCard.vue
│   ├── CopyButton.vue
│   └── ParticleCanvas.vue
└── styles/
    ├── tokens.css
    ├── base.css
    └── animations.css
```

## 设计基调
- **主色**：墨黑 `#0B0B0F` · 战甲青铜 `#B08D57` · 血红 `#C5302B` · 烟尘灰 `#7A7368`
- **强调色**：刀光冷白 `#E6F0FF` · 铁链青火星 `#3FB8AF` · 惊蛰金光 `#E0A82E`
- **字体**：标题 Cinzel、中文 Noto Serif SC、正文 Inter、等宽 JetBrains Mono
- **动效**：分镜段落切角、滚动渐入、扫描光、复选反馈弹性缩放
