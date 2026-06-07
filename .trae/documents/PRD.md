# 哥窑·6 段结构与 PPT 展示站点 —— 产品需求文档 (PRD)

> **修订版（v2）**：依据用户提供的新结构（**完全替换** 旧 4 幕），本项目采用 **6 段结构** 重新组织。

## 0. 结构总览（v2）

| 段 | 标签 | 主题 | 时长 | 性质 |
|---|------|------|------|------|
| **前幕** | preface | 制作组 · 自白介绍 | 24s | meta |
| **第一章** | chapter-1 | 角色 · 离别-入梦 | 36s | 镜 1–9 |
| **第二章** | chapter-2 | 梦中 · 制窑-入境-反思 | 51s | 镜 11–33 |
| **第三章** | chapter-3 | 弟归 | 30s | 镜 36–47 |
| **第四章** | chapter-4 | 共窑-传名 | 12s | 镜 48–66 |
| **尾幕** | epilogue | 展开 PPT | — | 入口 |

**总时长**：24 + 36 + 51 + 30 + 12 = **153 秒**（约 2.5 分钟）

## 1. 产品概述

本项目以短片《哥窑》6 段结构为核心：
- **前幕**为制作组自白（meta 层）
- **第一~四章** 顺序展开"离别-入梦 → 制窑-反思 → 弟归 → 共窑-传名"
- **尾幕**作为整站收束：内嵌完整 11 页 PPT

- 主要用途：影视/文化类提案、分镜展示、制作组背书、主旨解读
- 目标用户：导演/制片/评委/学生/爱好者

## 2. 核心功能

### 2.1 6 段页面 + 通用页
| 段 / 页 | 路径 | 功能 |
|---------|------|------|
| 前幕·制作组 | `preface.html` | 自白介绍 + 制作组信息 |
| 第一章·角色 | `chapter-1.html` | 36s 段落：镜 1–9 |
| 第二章·梦中 | `chapter-2.html` | 51s 段落：镜 11–33 |
| 第三章·弟归 | `chapter-3.html` | 30s 段落：镜 36–47 |
| 第四章·共窑 | `chapter-4.html` | 12s 段落：镜 48–66 |
| 尾幕·展开PPT | `epilogue.html` | 入口：跳转到 PPT 内嵌页 |
| 尾幕·内嵌PPT | `epilogue-ppt.html` | 11 页 PPT 完整内嵌可独立翻页 |
| 通用 | `index.html` `storyboard.html` `shot.html` `analysis.html` `about.html` | 全站导航 / 分镜长卷 / 单镜 / 主旨 / 关于 |

### 2.2 顶部导航
6 段入口（前幕/第一/二/三/四章/尾幕）+ 通用（首页/分镜/解读/关于）

## 3. 核心流程

```
首页 index.html
 ├→ 前幕 preface.html (24s)
 ├→ 第一章 chapter-1.html (镜 1-9, 36s)
 │   └→ 单镜 shot.html?shot=N
 ├→ 第二章 chapter-2.html (镜 11-33, 51s)
 ├→ 第三章 chapter-3.html (镜 36-47, 30s)
 ├→ 第四章 chapter-4.html (镜 48-66, 12s)
 ├→ 尾幕 epilogue.html
 │   └→ epilogue-ppt.html (完整 PPT 内嵌)
 ├→ 分镜长卷 storyboard.html (按新章节分组)
 ├→ 主旨解读 analysis.html
 └→ 关于 about.html
```

## 4. 章节配色与图标
- **前幕**（制作组）— 墨黑 #0e0e10 + 宣纸白 #f4ecd8
- **第一章**（离别-入梦）— 青瓷釉 #6b8e7f
- **第二章**（制窑-反思）— 紫金土 #8a4a2c
- **第三章**（弟归）— 朱印红 #b53028
- **第四章**（共窑-传名）— 窑火橙 #d96b27
- **尾幕**（PPT）— 墨黑底 + 窑火橙

## 5. 数据结构

`data/structure.json`（新增）：

```ts
type Structure = {
  totalDuration: string;     // "153s"
  totalShots: number;        // 62
  preface: Preface;          // 前幕元数据
  chapters: Chapter[];       // 第一~四章
  epilogue: Epilogue;        // 尾幕元数据
};

type Preface = {
  id: 'preface';
  title: '前幕';
  subtitle: '制作组 · 自白介绍';
  duration: '24s';
  team: TeamMember[];        // 制作组成员
  intro: string;             // 自白文本
};

type Chapter = {
  id: 'ch1' | 'ch2' | 'ch3' | 'ch4';
  chapterNum: number;        // 1, 2, 3, 4
  title: string;             // "第一章"
  subtitle: string;          // "角色 · 离别-入梦"
  duration: string;          // "36s"
  shotRange: [number, number]; // 起始/结束镜号
  shots: number[];           // 包含的镜号
  color: string;             // 主题色
  desc: string;              // 章节描述
};

type Epilogue = {
  id: 'epilogue';
  title: '尾幕';
  subtitle: '展开 PPT';
  pptHref: 'epilogue-ppt.html';
};
```

`data/shots.json` 更新：
- `act` 字段从 `prologue/act1/act2/act3` 改为 `preface/ch1/ch2/ch3/ch4`
- `actName` 字段从 `序幕·现代/第一幕·历史回溯/...` 改为 `前幕·制作组/第一章·角色/...`
