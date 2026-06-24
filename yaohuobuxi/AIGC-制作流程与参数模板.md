# 《窑火不息·追迹》AIGC 制作流程与参数模板

---

## 一、制作类型定义

| 维度 | 规格 |
|:---|:---|
| **作品类型** | AIGC 东方文明叙事短片 |
| **创作范式** | 文本驱动 · 视觉生成 · 声音合成 · 三合一 |
| **AI 引擎** | Midjourney V6（图像）/ ElevenLabs / Suno（声音） |
| **后期平台** | Runway / Pika Labs（动态化） / DaVinci Resolve（剪辑调色） |
| **总时长** | 约15分钟 |
| **总镜数** | 25镜（序12 + 一2 + 二4 + 三2 + 四2 + 五3） |

---

## 二、AIGC 创作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    AIGC 创作管线 (Pipeline)                      │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  文字层  │  图像层  │  动态层  │  声音层  │  剪辑层  │  调色层  │
│  TEXT    │  IMAGE   │  MOTION  │  AUDIO   │  EDIT    │  COLOR   │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 文学剧本 │ MJ V6    │ Runway   │ 拟音合成 │ DaVinci  │ 色彩演进 │
│ 分镜表   │ --style  │ Pika     │ 旁白TTS  │ Resolve  │ 总谱套用 │
│ 对话范式 │ raw      │ Labs     │ 环境声   │ 转场实现 │ LUT制作  │
│ 哲学注释 │ --s 值   │ 关键帧   │ 留白设计 │ 节奏控制 │ 情感映射 │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 三、分镜 AI 提示词模板

### 3.1 标准模板结构

```
[主体描述] + [环境氛围] + [光影条件] + [色彩基调] + [构图风格] + [技术参数]
```

### 3.2 全镜提示词速查表

| 镜号 | 场景 | 核心提示词 | 参数 |
|:---|:---|:---|:---|
| 0-1~0-3 | 黑场 | 无需AI生成（纯黑） | — |
| 0-4 | 淡·光生 | `museum display cabinet, warm light emerging from total darkness, dust particles in light beam, minimalist composition, cinematic lighting, photorealistic` | `--ar 16:9 --style raw --s 200` |
| 0-5 | 裂·纹出 | `extreme macro shot of Ge kiln ceramic crackle glaze surface, golden crack lines spreading like rivers, celadon gray-green background, museum lighting, dust motes floating` | `--ar 16:9 --style raw --s 250` |
| 0-6 | 瓷·器立 | `Southern Song Dynasty Ge kiln celadon double-handled incense burner, museum display case, warm spotlight, dust particles in Tyndall beam, sacred artifact atmosphere, 8K photorealistic` | `--ar 16:9 --style raw --s 250` |
| 0-7~0-12 | 序·言 | `Ge kiln ceramic crackle glaze detail, golden crack lines, warm museum light, depth of field on crack intersections, cinematic stillness` | `--ar 16:9 --style raw --s 250` |
| 1-1 | 暴雨夜 | `ancient Chinese Longquan kiln in heavy rainstorm at night, warm orange kiln fire glow inside, cold blue rain outside, craftsman throwing clay on pottery wheel, sweat on muscular back, cinematic chiaroscuro, 8K photorealistic` | `--ar 16:9 --style raw --s 300` |
| 1-2 | 清晨出窑 | `early morning mist, ancient Chinese kiln door opening, white steam billowing out, celadon porcelain being carefully removed, crowd of craftsmen in brown robes, foggy atmosphere, deep focus composition` | `--ar 16:9 --style raw --s 300` |
| 2-1 | 窑旁对话 | `two figures near ancient kiln at night, flames casting dramatic orange light, one figure illuminated face, other half in shadow, sparks flying, emotional tension, cinematic composition` | `--ar 16:9 --style raw --s 250` |
| 2-2 | 闪回 | `childhood memory scene, father teaching two young boys pottery, warm nostalgic yellow light, soft focus, ancient Chinese kiln workshop, handcrafted ceramic bowls, emotional atmosphere` | `--ar 16:9 --style raw --s 200` |
| 2-3 | 伤疤 | `extreme macro shot of burn scars on human back, textured keloid scars like dried cracked earth, raindrops falling on scarred skin, dark red and gray-brown tones, low angle hell lighting, photorealistic skin texture` | `--ar 16:9 --style raw --s 350` |
| 2-4 | 泼水 | `moment of water splashing into blazing kiln fire, mushroom cloud of white steam explosion, slow motion, man screaming with veins visible, crimson flames versus white water, dramatic chiaroscuro, emotional peak` | `--ar 16:9 --style raw --s 400 --v 6` |
| 3-1 | 出窑 | `celadon ceramic bowl with crackle lines spreading like living creatures, morning light streaming through cracks creating golden beams, man holding bowl up to sunlight, low angle shot, divine light, spiritual atmosphere` | `--ar 16:9 --style raw --s 350` |
| 3-2 | 对坐 | `two brothers sitting facing each other by kiln fire, cracked ceramic bowl between them as altar, warm orange firelight, symmetrical composition, intimate atmosphere, ancient Chinese interior` | `--ar 16:9 --style raw --s 250` |
| 4-1 | 看火 | `close-up of man's face illuminated by firelight, tears streaming down cheek, tear tracks like ceramic crackle lines, warm orange skin tones, single side lighting, extreme emotional close-up` | `--ar 16:9 --style raw --s 300 --v 6` |
| 4-2 | 茶寮 | `elderly man with white hair in traditional Chinese tea house, snow falling outside window, warm yellow interior light, old wooden box, celadon ceramic bowl with crackle patterns, nostalgic atmosphere, 8K photorealistic` | `--ar 16:9 --style raw --s 300` |
| 5-1 | 茶室 | `Japanese tea ceremony room, snow falling in garden visible through shoji screen, celadon bowl with golden kintsugi staples, elderly hands placing bowl down reverently, serene atmosphere, soft lighting` | `--ar 16:9 --style raw --s 250` |
| 5-2 | 定格 | `extreme close-up of kintsugi repaired ceramic bowl, golden staples on celadon green surface, macro detail, warm and soft lighting, zen aesthetic, meditative stillness` | `--ar 16:9 --style raw --s 300 --v 6` |
| 5-3 | 黑场 | 无需AI生成（纯黑+字幕） | — |

---

## 四、AI 参数矩阵

| 参数 | 含义 | 范围 | 本片使用 |
|:---|:---|:---|:---|
| `--ar 16:9` | 画幅比 | 16:9 | 全片统一 |
| `--style raw` | 风格基准 | raw | 全片统一（现实主义） |
| `--s` | 风格化强度 | 0-1000 | 200-400（平均280） |
| `--v 6` | 模型版本 | V6 | 标注镜（2-4, 4-1, 5-2） |
| `--chaos` | 多样性 | 0-100 | 40（仅关键镜） |
| `--weird` | 怪异度 | 0-3000 | 100（伤疤/泼水镜） |

### S值分配逻辑

| S值 | 场景 | 理由 |
|:---|:---|:---|
| 200 | 序章淡入/闪回 | 低风格化，保持现实感 |
| 250 | 展柜凝视/日常 | 标准叙事风格 |
| 300 | 暴雨夜/出窑/情感 | 增强戏剧性 |
| 350 | 伤疤/耶稣光 | 强视觉冲击 |
| 400 | 泼水核爆 | 最大风格化强度 |

---

## 五、声音设计参数

### 5.1 拟音层

| 镜号 | 声音元素 | 频率范围 | 动态范围 | 混响 |
|:---|:---|:---|:---|:---|
| 0-2 | 火声"噼啪" | 200-800Hz | -30dB → -20dB | 温暖混响 |
| 0-3 | 开片"咔" | 4-6kHz | 0.3秒线性衰减 | 无混响（干声） |
| 1-1 | 暴雨 | 高频环绕 | -25dB 环境 | 室外混响 |
| 1-1 | 窑火轰鸣 | 中低频 | -20dB | 室内混响 |
| 2-3 | 雨滴打伤疤 | 中高频 | -15dB "嗒" | 近场干声 |
| 2-4 | 泼水"嗤" | 全频段 | 峰值 -5dB | 爆炸式 |
| 3-2 | 敲碗"叮" | 2-4kHz | -18dB | RT60=2.5s |
| 4-1 | 眼泪落地 | 中高频 | 强化至 -30dB | 近场 |
| 5-2 | "叮"延续 | 2-4kHz | -20dB → -50dB | 8秒衰减 |

### 5.2 旁白参数

| 参数 | 规格 |
|:---|:---|
| 发声方式 | 气声（声带不完全闭合） |
| 基频 | 90Hz（可降至80Hz） |
| 混响 | RT60=1.8秒 |
| 动态 | 从-20dB渐弱至-40dB |
| 语言 | 中文（南宋官话韵味） |
| 节奏 | 破折号=1.5秒停顿，句尾留白2-3秒 |

---

## 六、剪辑与转场工作流

### 6.1 转场类型与实现

| 转场类型 | 镜号 | 实现方式 | 时长 |
|:---|:---|:---|:---|
| 黑场起片 | 0-1 | 纯黑画面 | 0s |
| 声音先行 | 0-2→0-3 | 音频预加载 | 3s |
| Fade In | 0-4 | 透明度0→100% | 3s |
| 裂纹溶解 | 0-5→0-6 | 裂纹纹理作为遮罩 | 2s |
| 硬切 | 0-6→0-7 | 直接切换 | 0s |
| 慢划像 | 1-2开头 | 晨雾纹理方向性擦除 | 3s |
| Crash Zoom | 1-2中段 | 电子变焦+后期加速 | 6s |
| 溶解 | 2-1 | 交叉淡化 | 2s |
| 闪白 | 2-3 | 白场0.5秒 | 0.5s |
| 快速摇镜+黑场 | 2-4结尾 | 运动模糊+黑场 | 1s |
| 裂纹转场 | 4-2 | 裂纹纹理划像 | 2s |
| 慢划像(Snow) | 5-1 | 雪花纹理划像 | 3s |
| Freeze Frame | 5-2 | 定格帧 | 持续 |
| 淡出 | 5-3 | 透明度100→0% | 3s |

### 6.2 节奏控制

| 幕 | 平均镜长 | 节奏特征 |
|:---|:---|:---|
| 序 | 6.1s | 慢→中→慢，冥想节奏 |
| 一 | 27.5s | 中速，叙事建立 |
| 二 | 25s | 加速→爆发，情绪递进 |
| 三 | 30s | 减速，顿悟时刻 |
| 四 | 37.5s | 中慢，情感沉淀 |
| 五 | 18.3s | 渐慢→定格，文明回响 |

---

## 七、调色 LUT 设计

### 7.1 色彩演进总谱 LUT 序列

| LUT编号 | 对应段落 | 色温 | 主要调整 |
|:---|:---|:---|:---|
| LUT-00 | 序章 | 3200K→5600K渐变 | 青灰+金丝铁线 |
| LUT-01 | 第一幕·火 | 2800K | 深蓝暗部+琥珀高光 |
| LUT-02 | 第一幕·冷落 | 4200K | 青白中灰+褐黑阴影 |
| LUT-03 | 第二幕·疼痛 | 2500K | 暗红中间调+灰褐暗部 |
| LUT-04 | 第二幕·爆发 | 2000K | 炽红高光+惨白亮部 |
| LUT-05 | 第三幕·惊愕 | 3800K | 青釉基色+黑纹暗部 |
| LUT-06 | 第三幕·顿悟 | 4500K | 青釉基色+金色高光 |
| LUT-07 | 第四幕·和解 | 2800K | 暖橙+暗褐 |
| LUT-08 | 第四幕·怀旧 | 3500K | 暖黄+冷白 |
| LUT-09 | 第五幕·传承 | 4000K | 青釉+金锔钉+雪白 |
| LUT-10 | 终场 | 3200K→0K | 青绿→黑 |

---

## 八、字幕与字体设计

| 元素 | 规格 |
|:---|:---|
| 片中字幕 | 不出现（纯视听叙事） |
| 片尾字幕 | 黑场白字，宋体/楷体 |
| 浮现速度 | 逐字0.5秒 |
| 字距 | 宽松（letter-spacing: 4px） |
| 行距 | 2倍行高 |
| 动画 | 书法动力学缓入 |

---

## 九、文件交付清单

```
yaohuobuxi/
├── storyboard/
│   └── 适配分镜表_v1.0.md          # 完整分镜表
├── design-assets/
│   ├── 01-color-evolution-spectrum.svg    # 色彩演进总谱
│   ├── 02-narrative-structure.svg         # 五幕叙事结构
│   ├── 03-dash-dialogue-paradigm.svg      # 破折号对话范式
│   ├── 04-visual-metaphor-system.svg      # 视觉隐喻体系
│   └── 05-aigc-workflow.svg              # AIGC制作流程
├── prompts/
│   └── shot-prompts-catalog.md           # 分镜提示词目录
├── audio/
│   └── sound-design-spec.md              # 声音设计规格
├── color/
│   └── lut-sequence.md                   # 调色LUT序列
└── delivery/
    └── production-checklist.md           # 制作交付清单
```

---

## 十、AIGC 创作概念

### 10.1 核心创作理念

**"AI 不是工具，是窑火"**

- 人类创作者 = 章生一（拉坯者）：提供结构、意图、哲学框架
- AI 生成引擎 = 窑火（不可控变量）：提供纹理、偶然、超出预期的"裂纹"
- 最终成品 = 哥窑开片：人类意图与 AI 偶然性的共生产物

### 10.2 人机协作范式

```
人类层：文学剧本 → 分镜设计 → 哲学注释 → 对话范式 → 剪辑决策
  │          │          │          │          │
  ▼          ▼          ▼          ▼          ▼
AI 层：  提示词生成 → 图像生成 → 动态化 → 声音合成 → 调色辅助
  │          │          │          │          │
  └──────────┴──────────┴──────────┴──────────┘
                    ▼
            最终成品：窑变后的开片
```

### 10.3 "缺陷即神性" 的 AI 美学

本片的核心命题"真正活过的东西，都会留下裂痕"同样适用于 AIGC 创作：

- **不追求完美生成**：AI 的"错误"（手指变形、光影异常）被视为数字时代的"窑变"
- **保留生成痕迹**：不修掉所有 AI 痕迹，让"裂纹"（生成瑕疵）成为作品的肌理
- **破折号美学**：AI 生成之间的"停顿"（加载时间、迭代过程）被纳入叙事节奏

---

*文档版本：v1.0 | 制作日期：2026-06-24 | 项目：窑火不息·追迹*