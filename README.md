# 哥窑 · 主旨解读 PPT

> 窑火如歌，兄弟如线。
> 《哥窑》是关于"传承"的视觉史诗。

## 项目概览

这是一套基于 Web 的**交互式演示文稿（HTML PPT）** + **66 个分镜单页**，
围绕用户提供的《哥窑》分镜脚本进行主旨解读与可视化呈现。

### 人物关系（修正后绝对设定）

| 角色 | 设定 | 核心特质 |
|------|------|----------|
| 哥哥 | **张寄** | 守护者 · 理性 · 承担 |
| 弟弟 | **张志元** | 探索者 · 感性 · 天赋 |

> 原脚本中"章生一"、"张志耀"为笔误。所有解读以"哥哥=张寄，弟弟=张志元"为准。

## 文件清单（共 76 个 HTML）

| 类别 | 文件 |
|------|------|
| **主 PPT 入口（正式文稿）** | [ppt.html](file:///workspace/ppt.html) — **24 张幻灯片**，含发言稿 / 文稿模式 / 计时器 / 打印 PDF |
| 主 PPT 旧版 | [index.html](file:///workspace/index.html) — 14 张幻灯片 |
| 主旨专题 | [theme.html](file:///workspace/theme.html) |
| 深度解读 | [essay.html](file:///workspace/essay.html) |
| 资源索引 | [gallery.html](file:///workspace/gallery.html) |
| 角色档案 | [character-zhangji.html](file:///workspace/character-zhangji.html) · [character-zhangzhiyuan.html](file:///workspace/character-zhangzhiyuan.html) |
| 三幕分幕 | [act-1.html](file:///workspace/act-1.html) · [act-2.html](file:///workspace/act-2.html) · [act-3.html](file:///workspace/act-3.html) |
| 66 个分镜 | `shot-01.html` ~ `shot-66.html` |

## 启动预览

```bash
cd /workspace
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000/ppt.html  （正式文稿）
# 或       http://localhost:8000/             （旧版入口）
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
24. 致谢·片尾

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
├── theme.html                       # 主旨专题
├── essay.html                       # 深度解读
├── gallery.html                     # 资源索引
├── character-zhangji.html           # 哥哥档案
├── character-zhangzhiyuan.html      # 弟弟档案
├── act-1.html · act-2.html · act-3.html
├── shot-01.html … shot-66.html      # 66 个分镜
├── .trae/documents/                 # PRD + 技术文档
├── assets/
│   ├── css/                         # base / deck / character / shot
│   ├── js/                          # deck / audio
│   └── img/
└── scripts/
    └── generate_shots.py            # 批量生成分镜页
```

## 设计风格

- **色彩**：墨黑 `#0c0a09` · 青瓷釉 `#7ea89a` · 窑火金 `#d99a52` · 宣纸白 `#f1ebe0`
- **字体**：思源宋体（中文标题）· 思源黑体（中文正文）· Cormorant Garamond（英文/数字）
- **视觉**：水墨晕染 · 瓷器开片 · 窑火动画 · 古琴合成 · 噪点纹理

## 依赖

无构建依赖，零 npm。
任何静态文件服务器即可运行（`python3 -m http.server` / `npx serve` / VS Code Live Server 等）。
