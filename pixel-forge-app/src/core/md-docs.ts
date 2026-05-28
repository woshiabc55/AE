export interface MdDocument {
  id: string
  title: string
  category: string
  tags: string[]
  content: string
  images: { alt: string; url: string; caption: string }[]
}

export const MD_DOCUMENTS: MdDocument[] = [
  {
    id: 'overview',
    title: '稻锊 模型 编辑器 · 概览',
    category: '系统',
    tags: ['概述', '架构', '入门'],
    images: [
      { alt: '系统架构图', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20architecture%20diagram%20of%20a%20modular%20image%20processing%20system%20with%20canvas%20pixel%20editor%20neon%20green%20on%20dark%20background&image_size=landscape_16_9', caption: '图1: 稻锊系统架构总览' },
    ],
    content: `# 稻锊 模型 编辑器

> DAOLUE · MODEL EDITOR · Canvas Pixel System

## 系统概述

**稻锊** 是一个基于 Canvas Pixel 的图像处理与模型编辑系统，支持像素化、离子化消散、波浪纹线条等核心效果，以及完整的文生图训练数据制作流程。

## 核心模块

| 模块 | 功能 | 技术栈 |
|------|------|--------|
| 像素编辑器 | 5种效果实时渲染 | Canvas 2D API |
| 模型编辑器 | 图层管理 + 画笔工具 | Canvas Pixel |
| 数据集标注 | 图文→标注数据制作 | DatasetManager API |
| 训练管线 | Node节点编排 + 模拟训练 | TrainingPipeline |
| 空链后端 | 无状态云端处理流水线 | EmptyChain |
| MCOP文档 | 7种标记格式文档框架 | .selena .kelex .skill .hermes .agent .opic .rpa |

## 架构设计

\`\`\`
前端 (Vue 3 + TypeScript + Vite)
  ├── 路由层 (vue-router 4)
  ├── 组件层 (PixelEditor / ModelEditor / DatasetView / TrainingNodeView)
  ├── 核心层 (EventBus / effects / renderer / agents / datasets / training)
  └── 代理层 (GENT Agent System)

后端 (Express + Node.js)
  ├── AssetManager    → 文件CRUD
  ├── SceneManager    → 场景管理
  ├── EffectRegistry  → 效果注册
  ├── DocPlanner      → 文档规划
  ├── DatasetManager  → 数据集+标注
  ├── TrainingPipeline → 节点训练
  └── EmptyChain      → 空链处理
\`\`\`

## 版本迭代

- **v1-core**: 基础像素化效果
- **v2-chain**: 效果链式组合
- **v3-blend**: 多效果混合模式
- **v4-interactive**: 交互式控制
- **v5-plugin**: 效果扩展系统
- **v6-physics3d**: 3D物理解算
- **v7-software-model**: 软件实体建模`,
  },
  {
    id: 'effects-guide',
    title: '效果系统 · 技术文档',
    category: '效果',
    tags: ['像素化', '离子化', '波浪纹', '故障', '色差'],
    images: [
      { alt: '像素化效果', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20pixelation%20effect%20on%20landscape%20image%20retro%208bit%20style%20neon%20green%20grid%20overlay&image_size=landscape_16_9', caption: '图1: 像素化效果示意' },
      { alt: '离子化消散', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20ionization%20dissolve%20effect%20particles%20scattering%20from%20image%20cyberpunk%20neon&image_size=landscape_16_9', caption: '图2: 离子化消散效果示意' },
      { alt: '波浪纹线条', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20wave%20line%20distortion%20effect%20sine%20wave%20pattern%20retro%20synthwave&image_size=landscape_16_9', caption: '图3: 波浪纹线条效果示意' },
    ],
    content: `# 效果系统 · 技术文档

## 1. 像素化 (Pixelate)

将图像分割为区域块，每个块取平均颜色值。

**参数：**
- \`blockSize\` (2-64): 像素块大小，值越大越模糊
- \`preserveEdges\` (bool): 是否保留边缘细节

**算法：**
\`\`\`typescript
for each block(x, y, blockSize):
  avg = mean(pixels in block)
  fill block with avg color
\`\`\`

![像素化效果](effect-pixelate)

---

## 2. 离子化消散 (Ionize)

将像素转化为粒子，模拟物理消散效果。

**参数：**
- \`particleDensity\` (1-100): 粒子密度
- \`spreadForce\` (1-50): 扩散力度
- \`gravity\` (0-20): 重力系数
- \`lifetime\` (10-300): 粒子生命周期(帧)

**算法：**
\`\`\`typescript
for each pixel:
  if random() < density:
    create particle at (x, y) with velocity
    apply force(gravity, spread)
    update position each frame
\`\`\`

![离子化消散](effect-ionize)

---

## 3. 波浪纹线条 (Wave)

行级正弦位移，产生波浪纹效果。

**参数：**
- \`amplitude\` (1-50): 波浪振幅
- \`frequency\` (0.01-0.5): 波浪频率
- \`speed\` (0.1-10): 动画速度

**算法：**
\`\`\`typescript
for each row y:
  offset = amplitude * sin(y * frequency + time * speed)
  shift row by offset pixels
\`\`\`

![波浪纹线条](effect-wave)

---

## 4. 故障偏移 (Glitch)

行级随机位移 + RGB通道偏移。

**参数：**
- \`intensity\` (1-100): 故障强度
- \`lineShift\` (bool): 行级位移开关
- \`colorSplit\` (bool): 色彩分离开关

---

## 5. 色差 (Chromatic Aberration)

RGB三通道独立位移，产生色散效果。

**参数：**
- \`offsetR\` (-20~20): 红色通道偏移
- \`offsetG\` (-20~20): 绿色通道偏移
- \`offsetB\` (-20~20): 蓝色通道偏移`,
  },
  {
    id: 'dataset-pipeline',
    title: '数据集处理 · 训练管线',
    category: '训练',
    tags: ['数据集', '标注', '训练', '空链'],
    images: [
      { alt: '数据标注流程', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20data%20annotation%20pipeline%20flowchart%20with%20images%20and%20text%20labels%20neon%20dark%20background&image_size=landscape_16_9', caption: '图1: 数据标注处理流程' },
    ],
    content: `# 数据集处理 · 训练管线

## 数据流

\`\`\`
图像 + 文本 → 标注计算 → 训练集合 → Node训练 → 模型输出
\`\`\`

## 1. 数据集创建

支持三种类型：
- **图文对** (image-text): 图像+文本配对标注
- **仅图像** (image-only): 纯图像标注
- **仅文本** (text-only): 纯文本标注

## 2. 标注计算引擎

标注计算分为7个步骤：

1. 扫描数据集图像文件
2. 扫描数据集文本文件
3. 提取图像特征关键词
4. 匹配文本语义标签
5. 生成标注条目 (prompt + caption)
6. 计算质量评分 (0-1)
7. 写入标注数据

### 自动标签分类

| 类别 | 关键词 |
|------|--------|
| 人物 | portrait, face, person, character |
| 风景 | landscape, nature, outdoor |
| 建筑 | building, architecture, city |
| 像素 | pixel, 8bit, retro, sprite |
| 科技 | tech, digital, cyber, scifi |

## 3. 训练管线节点

8种节点类型：

| 节点 | 功能 | 输入/输出 |
|------|------|-----------|
| 预处理 | 图像归一化+文本清洗 | raw → cleaned |
| 编码 | CLIP/ViT特征提取 | cleaned → embeddings |
| 分词 | 文本Token化 | text → tokens |
| 嵌入 | 向量空间映射 | tokens → vectors |
| 训练 | 模型参数优化 | vectors → model |
| 评估 | 精度/损失计算 | model → metrics |
| 增强 | 数据增广 | dataset → augmented |
| 导出 | 模型导出ONNX/PB | model → file |

## 4. 空链处理

7种空链环节：preprocess → encode → tokenize → embed → predict → decode → validate

空链是无状态处理管线，每个环节独立执行，上下文通过链式传递。

![数据标注流程](dataset-pipeline)`,
  },
  {
    id: 'mcop-formats',
    title: 'MCOP 文档格式规范',
    category: '文档',
    tags: ['MCOP', '.selena', '.kelex', '.skill', '.hermes', '.agent', '.opic', '.rpa'],
    images: [
      { alt: 'MCOP格式', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel%20art%20document%20format%20icons%20seven%20different%20file%20types%20colorful%20neon%20dark%20background&image_size=landscape_16_9', caption: '图1: MCOP 7种文档格式' },
    ],
    content: `# MCOP 文档格式规范

## 格式总览

| 格式 | 扩展名 | 用途 | 颜色 |
|------|--------|------|------|
| Selena | .selena | 场景选择 | #44ddff |
| Kelex | .kelex | 效果变换 | #ff6b9d |
| Skill | .skill | 能力技能 | #7cff6b |
| Hermes | .hermes | 通信事件 | #ffaa00 |
| Agent | .agent | 模块代理 | #a29bfe |
| Opic | .opic | 视觉纹理 | #ff3366 |
| RPA | .rpa | 渲染管线 | #00ff88 |

## .selena — 场景选择

定义3D场景配置，包括几何体、力场、材质等。

\`\`\`json
{
  "format": "selena/1.0",
  "scene": {
    "geometry": "plane",
    "force": "gravity",
    "material": "pixel-default"
  }
}
\`\`\`

## .kelex — 效果变换

定义图像效果参数和变换规则。

\`\`\`json
{
  "format": "kelex/1.0",
  "effect": {
    "type": "pixelate",
    "params": { "blockSize": 8, "preserveEdges": true }
  }
}
\`\`\`

## .skill — 能力技能

定义技能包的能力范围和依赖关系。

## .hermes — 通信事件

定义模块间EventBus通信协议。

## .agent — 模块代理

定义GENT代理系统的Agent注册和通信。

## .opic — 视觉纹理

定义程序化纹理生成参数。

## .rpa — 渲染管线

定义效果渲染管线的节点连接和执行顺序。

![MCOP格式](mcop-formats)`,
  },
  {
    id: 'agent-system',
    title: 'GENT 代理系统',
    category: '代理',
    tags: ['Agent', 'EventBus', '通信', 'core', 'effect', 'arch'],
    images: [],
    content: `# GENT 代理系统

## 三层架构

| 层级 | 颜色 | 职责 |
|------|------|------|
| Core | #a29bfe | 核心模块 (EventBus, CoreModule, UIModule) |
| Effect | #ff6b9d | 效果模块 (Pixelate, Ionize, Wave, Glitch, Chromatic) |
| Arch | #44ddff | 架构模块 (Pipeline, Compositor, Physics, Scene3D) |

## 通信协议

Agent间通过EventBus发布/订阅模式通信：

\`\`\`typescript
sendMessage(from: string, to: string, event: string, data: unknown)
\`\`\`

## 注册表

所有Agent在 AGENT_REGISTRY 中注册，支持按层级查询：

\`\`\`typescript
getAgentsByLayer('core')    // → [EventBus, CoreModule, UIModule]
getAgentsByLayer('effect')  // → [PixelateEffect, IonizeEffect, ...]
getAgentsByLayer('arch')    // → [Pipeline, Compositor, ...]
\`\`\``,
  },
]

export const MD_CATEGORIES = [
  { id: '系统', label: '系统', color: '#ffaa00', icon: '⌂' },
  { id: '效果', label: '效果', color: '#ff6b9d', icon: '◈' },
  { id: '训练', label: '训练', color: '#a29bfe', icon: '⬡' },
  { id: '文档', label: '文档', color: '#44ddff', icon: '▣' },
  { id: '代理', label: '代理', color: '#7cff6b', icon: '⬡' },
]