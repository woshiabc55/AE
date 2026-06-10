// 预置剧本模板种子数据
import type { TemplateRecord, ScriptFieldDef } from "@/types";

const now = Date.now();
const SYSTEM_BASE = `你是一位资深编剧，擅长将结构化提示词转化为高完成度的中文剧本。
要求：
- 输出语言：中文，电影感叙述
- 保留所有专业术语（Logline / Beat / Conflict / Voice-over）
- 严格遵循指定节拍模型与场次节奏
- 兼顾画面感与台词张力，避免流水账
`;

const fieldsMovie: ScriptFieldDef[] = [
  { key: "title", label: "片名", type: "text", placeholder: "《回声巷》", required: true },
  { key: "logline", label: "一句话故事 (Logline)", type: "longtext", placeholder: "当 X 想要 Y，却遇到 Z，因此必须 W。", required: true, helper: "不超过 30 字，包含主角、目标、阻碍、转折。" },
  { key: "world", label: "世界观 / 时代", type: "longtext", placeholder: "1990s 的江南小镇，雨季绵延，潮湿的青石板路……", required: true },
  { key: "protagonist", label: "主角小传", type: "struct", required: true, helper: "请填写姓名、年龄、外在、内在、欲望、伤口、弧光。" },
  { key: "antagonist", label: "对手 / 反派", type: "struct", required: false, helper: "明确对抗力量的具象与抽象层面。" },
  { key: "beats", label: "节拍表（三幕 / 救猫咪）", type: "list", required: true, helper: "12-15 个节拍，每条 20-50 字。" },
  { key: "tone", label: "风格参考", type: "text", placeholder: "王家卫 + 是枝裕和；湿漉漉的胶片质感。" },
  { key: "twist", label: "核心反转 / 钩子", type: "longtext", placeholder: "在第二幕末，主角发现她以为的母亲其实是……" },
  { key: "scene", label: "关键场景描述", type: "longtext", placeholder: "Scene 12: 内景 / 雨夜阁楼 / 烛光摇曳……", required: true },
];

const fieldsShort: ScriptFieldDef[] = [
  { key: "title", label: "短剧名", type: "text", required: true, placeholder: "《一念》" },
  { key: "hook", label: "三秒钩子", type: "longtext", required: true, helper: "前三秒必须抓住观众。" },
  { key: "protagonist", label: "主角速写", type: "struct", required: true },
  { key: "conflict", label: "核心冲突", type: "longtext", required: true },
  { key: "turns", label: "情绪转折点", type: "list", required: true, helper: "3-5 个关键情绪节点。" },
  { key: "ending", label: "结尾落点", type: "text", required: true, placeholder: "反转 / 留白 / 温暖" },
  { key: "duration", label: "目标时长", type: "text", required: true, placeholder: "90 秒 / 3 分钟" },
];

const fieldsVideo: ScriptFieldDef[] = [
  { key: "title", label: "短视频标题", type: "text", required: true },
  { key: "platform", label: "投放平台", type: "text", placeholder: "抖音 / 视频号 / YouTube Shorts" },
  { key: "niche", label: "选题垂类", type: "text", placeholder: "美妆 / 财经 / 知识 / 剧情" },
  { key: "hook", label: "开头 3 秒台词", type: "longtext", required: true },
  { key: "structure", label: "内容结构", type: "list", required: true, helper: "钩子 / 痛点 / 案例 / 总结 / CTA" },
  { key: "cta", label: "行动号召", type: "text", placeholder: "评论区告诉我你的答案。" },
  { key: "duration", label: "时长", type: "text", required: true, placeholder: "45-60 秒" },
];

const fieldsInteractive: ScriptFieldDef[] = [
  { key: "title", label: "互动剧名", type: "text", required: true },
  { key: "form", label: "载体形式", type: "text", placeholder: "互动影视 / 文字冒险 / H5" },
  { key: "world", label: "世界设定", type: "longtext", required: true },
  { key: "branches", label: "分支树", type: "list", required: true, helper: "关键节点 A → B/C → ……描述每个选项的后果。" },
  { key: "protagonist", label: "玩家视角", type: "struct", required: true },
  { key: "endings", label: "结局数量与差异", type: "longtext", required: true },
  { key: "stakes", label: "赌注与张力", type: "longtext", required: true },
];

const promptTplMovie = `# 任务
请基于下列结构化字段，撰写一部**中文长片剧本**的开场 5 场戏（约 2500 字），需有画面、有台词、有节拍节奏。

# 剧本信息
- **片名**：{{title}}
- **Logline**：{{logline}}
- **世界观 / 时代**：{{world}}
- **风格基调**：{{tone}}
- **核心反转 / 钩子**：{{twist}}

# 角色
## 主角
{{protagonist}}

## 对手
{{antagonist}}

# 节拍表（请严格遵循节奏）
{{beats}}

# 关键场景
{{scene}}

# 输出要求
1. 以标准的剧本格式输出：场次（INT./EXT. 地点 时间）+ 动作 + 角色名 + 台词。
2. 前 5 场必须建立：人物、关系、世界规则、核心冲突的伏笔。
3. 节奏遵循三幕结构。
4. 中文输出，台词自然不翻译腔。`;

const promptTplShort = `# 任务
请基于以下结构化信息，撰写一部**中文短剧**的完整剧本（约 1500-2500 字），节奏紧凑，结尾有力。

# 短剧信息
- **短剧名**：{{title}}
- **目标时长**：{{duration}}
- **三秒钩子**：{{hook}}
- **核心冲突**：{{conflict}}
- **结尾落点**：{{ending}}

# 主角
{{protagonist}}

# 情绪转折点
{{turns}}

# 输出要求
1. 完整剧本格式输出。
2. 节奏快、对白锋利、画面感强。
3. 结尾必须呼应钩子。
4. 中文输出。`;

const promptTplVideo = `# 任务
请基于以下结构化信息，撰写一份**短视频脚本**（含分镜、口播文案、字幕、CTA），可直接用于拍摄。

# 信息
- **标题**：{{title}}
- **平台**：{{platform}}
- **垂类**：{{niche}}
- **时长**：{{duration}}
- **开头 3 秒台词**：{{hook}}
- **行动号召**：{{cta}}

# 内容结构
{{structure}}

# 输出要求
1. 输出格式：分镜编号 + 画面描述 + 旁白/台词 + 字幕 + 时长。
2. 前 3 秒必须命中钩子。
3. 节奏匹配 {{duration}} 的密度。
4. 中文输出。`;

const promptTplInteractive = `# 任务
请基于以下结构化信息，撰写一份**互动叙事**剧本的第一幕（5000 字内），含至少 3 个玩家选择点，每个选择导向不同分支。

# 互动剧
- **剧名**：{{title}}
- **载体**：{{form}}
- **世界设定**：{{world}}
- **赌注 / 张力**：{{stakes}}
- **结局数量与差异**：{{endings}}

# 玩家视角
{{protagonist}}

# 分支树
{{branches}}

# 输出要求
1. 第一幕剧本（场景、台词、玩家选项）。
2. 选项以 \`[选择 A] / [选择 B]\` 标注，并标注每个选项将导向的分支方向。
3. 中文输出。`;

export const SEED_TEMPLATES: TemplateRecord[] = [
  {
    id: "tpl_movie_three_act",
    title: "三幕结构 · 电影长片开场",
    slug: "three-act-feature",
    logline: "当一个失忆的女摄影师返回故乡小镇，企图拼凑童年真相，却撞见仍在等待她归来的「假母亲」。",
    genre: "movie",
    beatModel: "three-act",
    tone: "湿冷胶片 · 文艺悬疑 · 王家卫 + 是枝裕和",
    cover: "from-amber/40 via-ink-700 to-reel/30",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 1284,
    version: 1,
    createdAt: now - 7 * 86400000,
    updatedAt: now - 1 * 86400000,
    fields: fieldsMovie,
    promptTpl: promptTplMovie,
    systemPrompt: SYSTEM_BASE,
    tags: ["电影", "三幕", "悬疑", "文艺"],
    description: "经典三幕结构长片开场模板，附带角色小传、节拍表、关键场景描述字段。",
  },
  {
    id: "tpl_hero_journey",
    title: "英雄之旅 · 12 节拍奇幻开场",
    slug: "hero-journey-fantasy",
    logline: "一个靠画符为生的杂货店少年，被一封来自地下的信召唤，踏上他本不相信的旅程。",
    genre: "movie",
    beatModel: "hero-journey",
    tone: "东方奇幻 · 宫崎骏 + 乌尔善 · 浓郁色彩",
    cover: "from-reel/40 via-ink-700 to-amber/30",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 982,
    version: 1,
    createdAt: now - 12 * 86400000,
    updatedAt: now - 2 * 86400000,
    fields: fieldsMovie,
    promptTpl: promptTplMovie,
    systemPrompt: SYSTEM_BASE,
    tags: ["电影", "英雄之旅", "奇幻"],
    description: "英雄之旅 12 节拍模板，强化「召唤 / 拒绝 / 导师 / 试炼」结构。",
  },
  {
    id: "tpl_save_the_cat",
    title: "救猫咪 · 15 节拍商业剧本",
    slug: "save-the-cat-blockbuster",
    logline: "一个即将退休的拆弹专家，被迫与新来的 AI 机器人搭档拆除一枚具有自我意识的炸弹。",
    genre: "movie",
    beatModel: "save-the-cat",
    tone: "硬核商业 · 诺兰 + 迈克尔贝",
    cover: "from-amber/30 via-ink-700 to-reel/40",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 1532,
    version: 1,
    createdAt: now - 14 * 86400000,
    updatedAt: now - 3 * 86400000,
    fields: fieldsMovie,
    promptTpl: promptTplMovie,
    systemPrompt: SYSTEM_BASE,
    tags: ["电影", "救猫咪", "商业", "动作"],
    description: "Blake Snyder 救猫咪节拍，强调「猫咪 / 坑」与 B 故事冲突。",
  },
  {
    id: "tpl_short_drama",
    title: "竖屏短剧 · 90 秒反转",
    slug: "short-drama-90s",
    logline: "外卖小哥为赶最后一单冲进暴雨，却发现下单的人是五年前不告而别的母亲。",
    genre: "short",
    beatModel: "short-form",
    tone: "情感强反转 · 余华 + 贾樟柯",
    cover: "from-reel/50 via-ink-700 to-amber/30",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 4210,
    version: 1,
    createdAt: now - 10 * 86400000,
    updatedAt: now - 1 * 86400000,
    fields: fieldsShort,
    promptTpl: promptTplShort,
    systemPrompt: SYSTEM_BASE,
    tags: ["短剧", "反转", "情感", "竖屏"],
    description: "竖屏短剧 90 秒模板，3-5 个情绪转折，结尾必反转或留白。",
  },
  {
    id: "tpl_short_comedy",
    title: "喜剧短剧 · 三翻四抖",
    slug: "short-comedy",
    logline: "一个总演不好哭戏的演员，误闯了一场真实葬礼，结果越演越糟。",
    genre: "short",
    beatModel: "short-form",
    tone: "荒诞喜剧 · 宁浩 + 周星驰",
    cover: "from-amber/40 via-ink-700 to-amber/10",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 2104,
    version: 1,
    createdAt: now - 6 * 86400000,
    updatedAt: now - 86400000,
    fields: fieldsShort,
    promptTpl: promptTplShort,
    systemPrompt: SYSTEM_BASE,
    tags: ["短剧", "喜剧", "荒诞"],
    description: "三翻四抖喜剧短剧，节拍紧凑，包袱密集。",
  },
  {
    id: "tpl_video_knowledge",
    title: "知识口播 · 60 秒干货",
    slug: "video-knowledge",
    logline: "用三幕化结构讲清一个抽象概念，让观众从「听不懂」到「能讲给别人听」。",
    genre: "video",
    beatModel: "short-form",
    tone: "知识 · 理性 · 友好 · 罗翔 + 半佛仙人",
    cover: "from-amber/30 via-ink-700 to-amber/40",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 6854,
    version: 1,
    createdAt: now - 20 * 86400000,
    updatedAt: now - 4 * 86400000,
    fields: fieldsVideo,
    promptTpl: promptTplVideo,
    systemPrompt: SYSTEM_BASE,
    tags: ["短视频", "知识", "口播"],
    description: "60 秒知识口播模板，钩子 + 痛点 + 案例 + 总结 + CTA。",
  },
  {
    id: "tpl_video_story",
    title: "剧情号 · 情感共鸣",
    slug: "video-story",
    logline: "用一段生活切片讲一个让人破防的小故事，结尾给出可转发的金句。",
    genre: "video",
    beatModel: "short-form",
    tone: "温情 · 真实 · 共鸣",
    cover: "from-reel/30 via-ink-700 to-amber/30",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 3120,
    version: 1,
    createdAt: now - 8 * 86400000,
    updatedAt: now - 2 * 86400000,
    fields: fieldsVideo,
    promptTpl: promptTplVideo,
    systemPrompt: SYSTEM_BASE,
    tags: ["短视频", "剧情", "情感"],
    description: "情感剧情号模板，强调「第一句话就要击中」。",
  },
  {
    id: "tpl_interactive_branches",
    title: "互动影视 · 多分支第一幕",
    slug: "interactive-branches",
    logline: "玩家扮演一名失忆的外科医生，在一艘密闭的太空医院中醒来，每一个选择都决定谁能活到最后。",
    genre: "interactive",
    beatModel: "interactive",
    tone: "悬疑科幻 · 密室 · 选择驱动",
    cover: "from-amber/40 via-ink-700 to-reel/40",
    authorId: "system",
    authorName: "Lumière Studio",
    isPublic: 1,
    usageCount: 720,
    version: 1,
    createdAt: now - 16 * 86400000,
    updatedAt: now - 5 * 86400000,
    fields: fieldsInteractive,
    promptTpl: promptTplInteractive,
    systemPrompt: SYSTEM_BASE,
    tags: ["互动", "分支", "密室"],
    description: "互动叙事模板，第一幕含 3+ 选择点，每个选择导向不同分支。",
  },
];

export const GENRE_LABEL: Record<string, string> = {
  movie: "电影",
  short: "短剧",
  video: "短视频",
  interactive: "互动",
};

export const BEAT_MODEL_LABEL: Record<string, string> = {
  "three-act": "三幕结构",
  "hero-journey": "英雄之旅",
  "save-the-cat": "救猫咪",
  "short-form": "短篇 / 短剧",
  interactive: "互动分支",
};
