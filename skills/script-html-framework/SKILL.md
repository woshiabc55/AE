---
name: script-html-framework
description: "Use this skill after a script or story has been designed. It converts the design output (outline, characters, structure, arcs, beats) into a clean, interactive HTML framework diagram for visualization, review, and sharing."
---

# Script to HTML Framework

## When To Use
- The user says "整理", "生成框架图", "html 框架图", "可视化", "结构图", "时间线图", "角色关系图" after a script design session.
- The user wants to turn a completed story/character/outline design into a visual HTML page.
- The user needs a shareable or previewable framework of the script.

## Input To Gather
- The completed script design content (outline, characters, beats, relationships, etc.).
- What diagrams are needed:
  - Structure chart (three-act / Save the Cat / sequence timeline).
  - Character relationship map.
  - Emotional arc / tension curve.
  - Plot beat timeline.
  - Scene breakdown table.
- Preferred visual style (minimal, cinematic, dark mode, light mode, brand colors).
- Whether interactivity is needed (tabs, collapsible sections, hover tooltips).

## Design Rules
- The HTML must be self-contained: single file with embedded CSS and minimal inline JS.
- Use semantic HTML and CSS for layout; prefer no external dependencies.
- Optional: include Mermaid.js via CDN for complex diagrams if the user asks.
- Read the source design carefully and extract real data; do not invent beats or characters.
- Keep typography readable and information hierarchy clear.
- Provide a printable / full-screen friendly layout.

## Output Format
Return a complete HTML file inside a markdown code block:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>{作品名} - 剧本框架图</title>
  <style>
    /* 全局、布局、卡片、时间线、关系图、响应式 */
  </style>
</head>
<body>
  <header>...</header>
  <nav>...</nav>
  <main>
    <section id="structure">...</section>
    <section id="characters">...</section>
    <section id="timeline">...</section>
    <section id="tension">...</section>
  </main>
  <script>
    // 可选：简单的标签切换、滚动高亮
  </script>
</body>
</html>
```

## Required Sections
1. **标题与元信息**：作品名、类型、时长、主题一句。
2. **结构总览**：三幕/五幕/序列的视觉块，标注页码/时长比例。
3. **角色卡片**：头像占位、目标/缺陷/弧线、关系标签。
4. **时间线/节拍表**：关键情节点按顺序排列，含激励事件、中点、高潮。
5. **情感/张力曲线**：用折线或柱状图展示情绪起伏。
6. **场景清单**（可选）：表格或卡片列表。

## Framework Templates
- For short video scripts: vertical swipe-style timeline with hook/CTA highlights.
- For feature films: horizontal three-act timeline with Save the Cat beats.
- For game narratives: branching quest map with choice nodes.
- For ensemble casts: relationship network grid + character arc mini-charts.

## Tone
- Clean, organized, and professional; the HTML itself should be a polished deliverable.
- After generating the HTML, briefly explain how to view it (open in browser, save as `.html`).

## Example Trigger Phrases
- "把刚才的剧本整理成 HTML 框架图"
- "生成一个可视化的故事结构图"
- "设计完了，给我出一份 html 看板"
- "整理成框架图"
