// 萤幕 v1 — 内置剧本 Skill 片段 + 宏
import type { SkillRecord } from "@/types";

function sk(
  id: string,
  name: string,
  key: string,
  category: SkillRecord["category"],
  type: SkillRecord["type"],
  content: string,
  description: string,
  tags: string[] = []
): SkillRecord {
  return {
    id,
    name,
    key,
    category,
    type,
    content,
    description,
    tags,
    isBuiltin: 1,
    createdAt: 1,
    updatedAt: 1,
  };
}

export const SEED_SKILLS: SkillRecord[] = [
  // ==== 片段 (Fragment) — 直接拖入提示词的整段文本 ====
  sk(
    "sk_hook_coldopen",
    "冷开场 · 三秒抓住",
    "cold-open",
    "hook",
    "fragment",
    `# 冷开场
用一句极具画面感的台词或动作开场，禁止铺陈背景。第一行台词 / 动作必须是观众"不看到最后一秒就划不走"的钩子。

示例：
- 「把这封遗书烧了」——她把打火机塞进女儿手里。
- 子弹穿过婚纱的瞬间，新郎笑了。`,
    "在第一场戏内用一句话 / 一个动作锁住观众注意力。",
    ["开场", "短片", "高密度"]
  ),
  sk(
    "sk_char_dossier",
    "人物档案 · 三栏式",
    "char-dossier",
    "character",
    "fragment",
    `# 人物档案
- 姓名 / 年龄 / 外在特征（一句话可识别）
- 内在伤口（一句话：他最怕失去什么？）
- 表面欲望 / 真实欲望
- 弧光起点 → 弧光终点`,
    "标准化人物卡，适合做多主角对照。",
    ["人物", "结构"]
  ),
  sk(
    "sk_twist_triple",
    "反转三连",
    "twist-triple",
    "twist",
    "fragment",
    `# 反转三连
1. 物理反转：身份 / 物件 / 地点的暴露
2. 心理反转：主角对自身信念的颠覆
3. 关系反转：敌友阵营重组

三连必须**逐级放大**，且至少一连让观众"想回去重看一遍"。`,
    "短剧本中常用的反转结构。",
    ["反转", "钩子"]
  ),
  sk(
    "sk_ending_echo",
    "回声式收束",
    "echo-end",
    "ending",
    "fragment",
    `# 回声式收束
最后一幕必须是开场画面的**变奏**——同场景、同物件、同台词结构，但意义反转。

例：开场她烧掉一封信 → 结尾她烧掉同一封信，但内容换了。`,
    "用重复制造「啊原来如此」的顿悟感。",
    ["结尾", "主题"]
  ),
  sk(
    "sk_world_white",
    "环境白描",
    "env-white",
    "scene",
    "fragment",
    `# 环境白描
- 视觉：2 个最具反差感的色彩 / 光影
- 听觉：1 个持续性背景音
- 嗅觉 / 触觉：1 个让观众"身临其境"的细节

**绝不**超过 5 行——把笔墨留给人物。`,
    "快速建立电影感场景。",
    ["场景", "氛围"]
  ),

  // ==== 宏 (Macro) — 含变量的动态模板，渲染时展开 ====
  sk(
    "sk_macro_beat",
    "节拍宏",
    "beat",
    "pacing",
    "macro",
    `## 节拍 {{beat_no}} · {{beat_name}}
- 时长：约 {{duration}} 秒
- 目标：让观众感受「{{emotion}}」
- 关键冲突：{{conflict}}
- 出场人物：{{characters}}
- 关键动作 / 台词：{{hook_line}}`,
    "在节拍板中点击节拍节点时，按此模板自动生成提示词。",
    ["节拍", "结构化"]
  ),
  sk(
    "sk_macro_scene",
    "场景宏",
    "scene",
    "scene",
    "macro",
    `## 场景 · {{scene_name}}
### 环境
- 时间：{{time}}
- 地点：{{location}}
- 氛围：{{mood}}

### 人物
{{protagonist}} 与 {{antagonist}} 的交锋。

### 冲突
{{conflict}}

### 钩子
{{hook}}`,
    "生成分场提示词的统一模板。",
    ["场景", "分场"]
  ),
  sk(
    "sk_macro_motif",
    "母题宏",
    "motif",
    "monologue",
    "macro",
    `## 母题 · {{motif_name}}
- 物件：{{object}}
- 出现节点：
{{appearances}}
- 隐喻意义：{{metaphor}}

请在剧本中将此母题贯穿始终，并在**关键转折点**做变形。`,
    "用物件 / 台词贯穿主题。",
    ["母题", "主题"]
  ),
];

export const SKILL_CATEGORY_LABEL: Record<SkillRecord["category"], string> = {
  hook: "开场钩子",
  character: "人物塑造",
  scene: "场景描写",
  twist: "反转转折",
  climax: "高潮决斗",
  ending: "收束",
  monologue: "独白旁白",
  dialogue: "对话",
  world: "世界观",
  pacing: "节奏",
  other: "其他",
};
