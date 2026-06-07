# 哥窑 · 主旨解读 PPT

> 窑火如歌，兄弟如线。
> 《哥窑》是关于"传承"的视觉史诗。

## 项目概览

这是一套基于 Web 的**交互式演示文稿（HTML PPT）** + **66 个分镜单页** + **14 个可复用组件**，
围绕用户提供的《哥窑》分镜脚本进行主旨解读与可视化呈现。

### 人物关系（修正后绝对设定）

| 角色 | 设定 | 核心特质 |
|------|------|----------|
| 哥哥 | **张寄** | 守护者 · 理性 · 承担 |
| 弟弟 | **张志元** | 探索者 · 感性 · 天赋 |

> 原脚本中"章生一"、"张志耀"为笔误。所有解读以"哥哥=张寄，弟弟=张志元"为准。

## ⬇ 可下载资源

| 文件 | 说明 | 链接 |
|------|------|------|
| **PPT 文稿** (.pptx) | 24 张幻灯片，可在 PowerPoint / Keynote 二次编辑 | [downloads/哥窑_主旨解读.pptx](file:///workspace/downloads/哥窑_主旨解读.pptx) |
| **HTML 源文件包** (.zip) | 105 份文件（HTML + CSS + JS），可本地直接打开 | [downloads/哥窑_主旨解读_HTML包.zip](file:///workspace/downloads/哥窑_主旨解读_HTML包.zip) |
| **单文件自包含 HTML** | 全部 CSS/JS 已内联，**双击即可在任意浏览器打开**，无需联网 | [downloads/哥窑_主旨解读_单文件.html](file:///workspace/downloads/哥窑_主旨解读_单文件.html) |
| **项目清单 JSON** | 结构化元数据（113 项 · 文件用途/大小/统计），适合二次开发 | [downloads/哥窑_项目清单.json](file:///workspace/downloads/哥窑_项目清单.json) |
| **PDF（打印导出）** | 在 [ppt.html](file:///workspace/ppt.html) 文稿模式下按 <kbd>Ctrl/Cmd + P</kbd> 另存为 PDF | — |

> 完整导出门户：[export.html](file:///workspace/export.html) — 6 张导出卡片 + 项目结构可视化。

## 📦 组件库（v1.0）

[components.html](file:///workspace/components.html) — 14 个可复用 CSS 组件 + 完整设计令牌。

| 编号 | 组件 | CSS 文件 | 用途 |
|------|------|----------|------|
| 01 | Button 按钮 | `button.css` | 主/次/幽灵/印章/链接按钮 |
| 02 | Celadon 青瓷 | `celadon.css` | 釉色圆盘（带 SVG 开片纹理） |
| 03 | Seal 印章 | `seal.css` | 红色印章 · 朱印效果 |
| 04 | Eyebrow 章节头 | `eyebrow-quote.css` | 序号 + 中英小标 |
| 05 | Pull-quote 引用 | `eyebrow-quote.css` | 重点引文 + 来源 |
| 06 | Table 表格 | `table.css` | 视觉对比表 |
| 07 | Card 卡片 | `card.css` | 通用卡片 · hover 高亮 |
| 08 | Compare 对比卡 | `card.css` | 双栏并置对比 |
| 09 | Timeline 时间轴 | `timeline.css` | 节点 + 连接线 |
| 10 | TOC 目录 | `toc.css` | 章节跳转导航 |
| 11 | Dialogue 对话 | `dialogue.css` | 角色对话气泡 + 引语条 |
| 12 | Badge 徽章 | `badge.css` | 标签 · 标记 |
| 13 | Flame 窑火 | `flame.css` | 火焰动画 + 控制 |
| 14 | KBD 键位 | `kbd.css` | 键位提示 · 分割线 |
| 15 | Navbar 导航 | `navbar.css` | 顶栏 · 控制按钮 |

> 全部组件由 `assets/css/components/tokens.css` 中的设计令牌驱动；修改一个变量，全站同步。
> JS 组件仅两个：[flame.js](file:///workspace/assets/js/components/flame.js) + [toc.js](file:///workspace/assets/js/components/toc.js)，均无依赖。

## 文件清单（共 79 个 HTML）

| 类别 | 文件 |
|------|------|
| **主 PPT 入口（正式文稿）** | [ppt.html](file:///workspace/ppt.html) — **24 张幻灯片**，含发言稿 / 文稿模式 / 计时器 / 打印 PDF / **下载按钮** |
| 主 PPT 旧版 | [index.html](file:///workspace/index.html) — 14 张幻灯片 |
| 主旨专题 | [theme.html](file:///workspace/theme.html) |
| 深度解读 | [essay.html](file:///workspace/essay.html) |
| 资源索引 | [gallery.html](file:///workspace/gallery.html) |
| 角色档案 | [character-zhangji.html](file:///workspace/character-zhangji.html) · [character-zhangzhiyuan.html](file:///workspace/character-zhangzhiyuan.html) |
| 三幕分幕 | [act-1.html](file:///workspace/act-1.html) · [act-2.html](file:///workspace/act-2.html) · [act-3.html](file:///workspace/act-3.html) |
| **组件库** | [components.html](file:///workspace/components.html) — **Storybook 风格** |
| **项目导出** | [export.html](file:///workspace/export.html) — 4 种格式 · 6 张导出卡片 |
| 66 个分镜 | `shot-01.html` ~ `shot-66.html` |

## 启动预览

```bash
cd /workspace
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000/ppt.html        （正式文稿，含下载）
# 或       http://localhost:8000/components.html  （组件库）
# 或       http://localhost:8000/                  （旧版入口）
```

## 正式文稿 ppt.html 操作

### 翻页
- `→` / `Space` / `PageDown` — 下一页
- `←` / `PageUp` — 上一页
- `Home` / `End` — 跳到首/末页
- 鼠标点击右下角 ‹ › 按钮

### 增强功能
- `N` — 切换发言稿面板（演讲时显示每页备注）
- `D` — 切换文稿模式（所有幻灯片连续滚动）
- `P` — 打印 / 导出 PDF
- 顶部"发言稿"按钮 / "文稿模式"按钮
- 底部计时器（演讲计时）
- 顶部 **`↓ PPT`** / **`↓ ZIP`** — 一键下载可分发的资源

### 24 张幻灯片目录
1. 封面
2. 致辞
3. 目录
4. 序章·黑场
5. 现代伏笔·碎瓷
6. 主旨总纲
7. 人物关系修正
8. 人物对照
9. 哥哥·四个守的瞬间
10. 弟弟·四个听的瞬间
11. 三幕结构
12. 第一幕·开篇
13. 第一幕·寻土
14. 第一幕·起窑
15. 第一幕·未开片
16. 第二幕·开篇
17. 第二幕·兄弟之印 ⭐
18. 第二幕·证据
19. 第三幕·开篇
20. 第三幕·如一人 ⭐
21. 第三幕·金丝铁线
22. 主旨升华
23. 主题字幕
24. 致谢·片尾（含下载入口）

### 音频播放（Web Audio 合成）
- 古琴单音 — `data-sound="guqin"`
- 窑火轰鸣 — `data-sound="kiln"`
- 战鼓 — `data-sound="drum"`
- 马蹄 — `data-sound="hooves"`
- 鸟鸣 — `data-sound="bird"`
- 风 — `data-sound="wind"`

## 目录结构

```
/workspace
├── index.html                       # 主 PPT（14 张）
├── ppt.html                         # 正式文稿（24 张，含下载）
├── theme.html · essay.html · gallery.html
├── character-zhangji.html · character-zhangzhiyuan.html
├── act-1.html · act-2.html · act-3.html
├── components.html                  # 组件库演示（Storybook）
├── export.html                      # 项目导出门户（4 种格式）
├── shot-01.html … shot-66.html      # 66 个分镜
├── downloads/                       # ⬇ 5 种可下载资源
│   ├── 哥窑_主旨解读.pptx
│   ├── 哥窑_主旨解读_HTML包.zip
│   ├── 哥窑_主旨解读_单文件.html
│   └── 哥窑_项目清单.json
├── .trae/documents/                 # PRD + 技术文档
├── assets/
│   ├── css/                         # base / deck / ppt / character / shot / components
│   │   └── components/              # 14 个模块化组件 CSS + tokens.css
│   ├── js/                          # deck / audio / components
│   │   └── components/              # flame.js · toc.js
│   └── img/
└── scripts/
    ├── generate_shots.py            # 批量生成分镜页
    ├── generate_pptx.py             # 生成 .pptx 文件
    ├── build_zip.py                 # 打包 HTML ZIP
    ├── build_single.py              # 生成单文件自包含 HTML
    └── generate_manifest.py         # 生成项目清单 JSON
```

## 设计风格

- **色彩**：墨黑 `#0c0a09` · 青瓷釉 `#7ea89a` · 窑火金 `#d99a52` · 宣纸白 `#f1ebe0`
- **字体**：思源宋体（中文标题）· 思源黑体（中文正文）· Cormorant Garamond（英文/数字）
- **视觉**：水墨晕染 · 瓷器开片 · 窑火动画 · 古琴合成 · 噪点纹理
- **设计令牌**：所有色彩/字号/间距/阴影/动画 都集中在 [tokens.css](file:///workspace/assets/css/components/tokens.css) — 改一处，全站同步

## 依赖

- 浏览器：现代浏览器（Chrome 90+ / Safari 14+ / Firefox 88+）
- 无构建依赖，零 npm
- 仅在生成下载包时需要 `python3` + `python-pptx`

```bash
# 重新打包
python3 scripts/build_zip.py
# 重新生成 .pptx
python3 scripts/generate_pptx.py
# 重新生成单文件自包含 HTML
python3 scripts/build_single.py
# 重新生成项目清单 JSON
python3 scripts/generate_manifest.py
```

任何静态文件服务器即可运行（`python3 -m http.server` / `npx serve` / VS Code Live Server 等）。
