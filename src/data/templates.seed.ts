// 模板市场种子数据 - 12 个高质量剧本模板
import type { Template, Category } from '../types';

export const CATEGORIES: { key: Category; label: string; sub: string; hue: string }[] = [
  { key: 'short-video', label: '短视频', sub: '15-60s 钩子文案', hue: '#E8B14A' },
  { key: 'ad',          label: '种草广告', sub: '小红书/品牌向', hue: '#C0392B' },
  { key: 'livestream',  label: '直播口播', sub: '暖场 · 逼单 · 互动', hue: '#3A8E8E' },
  { key: 'novel',       label: '小说故事', sub: '开篇钩子 · 反转', hue: '#A876C8' },
  { key: 'storyboard',  label: '分镜脚本', sub: '九宫格 · 短片', hue: '#6FB07F' },
];

const author = (id: string, name: string) => ({ id, name });

const aStudio = author('u_studio', '剧幕工坊');
const aLin = author('u_lin', '林川');
const aYu = author('u_yu', '余白工作室');
const aZhao = author('u_zhao', '赵编剧');
const aMo = author('u_mo', '莫问');
const aNuan = author('u_nuan', '暖意');
const aYun = author('u_yun', '云上');
const aLi = author('u_li', '李七');

const now = '2025-09-12T10:00:00.000Z';
const recent = '2025-10-08T08:00:00.000Z';

export const SEED_TEMPLATES: Template[] = [
  {
    id: 't_001',
    title: '抖音爆款带货 · 30 秒口播钩子',
    description: '三段式钩子结构，专治划走。前 3 秒反差 + 7 秒痛点 + 20 秒逼单，复制即用。',
    category: 'short-video',
    tags: ['钩子', '带货', '30秒', '口播'],
    author: aLin,
    cover: 't_001',
    body: `# 角色设定
你是一位有 6 年经验的抖音爆款文案操盘手，擅长把"产品卖点"翻译成"用户立刻想买"的钩子句。

# 任务
为我正在销售的「{{product_name}}」撰写一条 {{duration}} 秒的口播带货脚本，目标受众是 {{target_audience}}，他们最痛的点是 {{pain_point}}。

# 钩子结构（务必遵守）
1. **前 3 秒反差钩**：用「你以为...其实...」或「停一下！别划走！」打破滑屏惯性。
2. **第 4-10 秒痛点放大**：把 {{pain_point}} 描述到一个具体场景，让用户感觉"这说的就是我"。
3. **第 11-{{duration}} 秒价值递进 + 逼单**：3 个利益点 + 价格锚定 + 紧迫感（限量/限时）。

# 输出要求
- 全程口语化、像朋友在安利，不要营销腔。
- 每句话不超过 14 个字，便于竖屏字幕。
- 结尾必须有一句可复制的"原声转发"金句。
- 字数控制在 {{word_count}} 字以内。

# 反面示例（避免）
- "亲，这款产品非常好用哦～"（太广告）
- "今天给大家带来..."（太开场白）

# 现在开始
直接输出脚本，不要解释。`,
    variables: [
      { key: 'product_name', label: '产品名称', type: 'text', required: true, hint: '如：免煮螺蛳粉', group: '基础信息' },
      { key: 'target_audience', label: '目标人群', type: 'text', required: true, hint: '如：25-30 岁独居打工人', group: '基础信息' },
      { key: 'pain_point', label: '核心痛点', type: 'text', required: true, hint: '用户购买前最头疼的问题', group: '基础信息' },
      { key: 'duration', label: '时长(秒)', type: 'enum', required: true, options: ['15', '30', '45', '60'], defaultValue: '30', group: '节奏' },
      { key: 'word_count', label: '字数上限', type: 'number', required: false, defaultValue: '120', hint: '建议 100-180', group: '节奏' },
    ],
    examples: [
      { id: 'e1', name: '免煮螺蛳粉 · 25-30岁女生', values: { product_name: '免煮螺蛳粉', target_audience: '25-30岁独居打工人', pain_point: '加班到深夜、又馋又累不敢点外卖', duration: '30', word_count: '140' } },
      { id: 'e2', name: '便携筋膜枪 · 久坐程序员', values: { product_name: '口袋筋膜枪', target_audience: '30-40岁久坐办公族', pain_point: '肩颈酸痛但没时间跑按摩店', duration: '45', word_count: '180' } },
    ],
    versions: [
      { id: 'v1', createdAt: '2025-08-20T10:00:00Z', snapshot: '初版钩子' },
      { id: 'v2', createdAt: '2025-09-15T10:00:00Z', snapshot: '加入反差钩变体' },
    ],
    stats: { uses: 1283, favorites: 286 },
    isPublic: true,
    createdAt: now,
    updatedAt: recent,
  },

  {
    id: 't_002',
    title: '小红书种草笔记 · 四段式爆款',
    description: '钩子标题 + 痛点共鸣 + 自用体验 + 利益收尾，已验证多篇万赞笔记结构。',
    category: 'ad',
    tags: ['小红书', '种草', '四段式', '万赞'],
    author: aYu,
    cover: 't_002',
    body: `# 角色
你是一位小红书万粉博主，擅长把普通产品写成"看了就想买"的种草笔记。文风亲切、有真实感。

# 任务
为我写一篇关于「{{product_name}}」的小红书种草笔记。

# 笔记结构
## 1. 钩子标题（5 个备选）
格式：emoji + 反差感 + 数字 + 关键词
例：🔥 谁懂啊！挖到一件 {{category}} 用了 3 个月才敢推荐

## 2. 痛点共鸣（开篇 2-3 句）
描述 {{target_user}} 在 {{pain_scenario}} 时的真实崩溃感。越具体越好。

## 3. 自用体验（主体 5-7 段）
- 第一次接触的契机
- 真实使用 {{usage_duration}} 的细节（触感、味道、效果）
- 一两个小缺点（增加真实感）
- 和其他 {{category}} 的对比

## 4. 利益收尾
- 适合人群
- 价格 / 链接话术
- 1 句引导互动的钩子（如"评论区蹲蹲"）

# 风格要求
- 标题字数 ≤ 20
- 全文 600-800 字
- 段落短，多换行，多 emoji
- 不要硬广口吻，结尾不要"点击购买"

# 关键词
- 主关键词：{{product_name}}
- 场景词：{{scene_tags}}
- 痛点词：{{pain_point}}`,
    variables: [
      { key: 'product_name', label: '产品/品牌', type: 'text', required: true, group: '产品' },
      { key: 'category', label: '品类', type: 'text', required: true, hint: '如：面霜、耳机、零食', group: '产品' },
      { key: 'target_user', label: '目标用户', type: 'text', required: true, group: '用户' },
      { key: 'pain_scenario', label: '使用场景/痛点', type: 'textarea', required: true, group: '用户' },
      { key: 'usage_duration', label: '使用时长', type: 'text', required: false, defaultValue: '2 周', hint: '如：3 天 / 2 周 / 1 个月', group: '体验' },
      { key: 'scene_tags', label: '场景关键词', type: 'text', required: false, hint: '逗号分隔', group: 'SEO' },
      { key: 'pain_point', label: '痛点词', type: 'text', required: false, group: 'SEO' },
    ],
    examples: [
      { id: 'e1', name: '某新锐面霜', values: { product_name: '某新锐面霜', category: '面霜', target_user: '25-30岁熬夜敏感肌', pain_scenario: '加班到凌晨，第二天脸垮到不想照镜子', usage_duration: '28天', scene_tags: '熬夜肌,敏感肌,平价面霜', pain_point: '暗沉' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 842, favorites: 211 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_003',
    title: '直播间暖场 · 三分钟留存脚本',
    description: '开播头三分钟的留人结构。卡问候、抽福袋、预告爆款节奏，让人不舍得划走。',
    category: 'livestream',
    tags: ['直播', '暖场', '留人', '福袋'],
    author: aMo,
    cover: 't_003',
    body: `# 角色
你是一位有 5 年经验的直播运营，主攻服饰/美妆品类。熟悉抖音、视频号、小红书直播节奏。

# 任务
为 {{anchor_name}} 撰写一场直播的开播前 {{warmup_minutes}} 分钟的暖场口播脚本，主题品类是 {{category}}，今日主推爆款是 {{hero_product}}。

# 节奏要求
## 第 1 分钟：欢迎 + 自我介绍
- 三句问候不同人群（{{target_groups}}）
- 简短的"今天福利"预告（不要剧透价格）

## 第 2 分钟：互动 + 福袋
- 引导关注 + 评论关键词
- 福袋规则：{{giftbag_rule}}

## 第 3 分钟：爆款预告
- 用一句话制造悬念
- 预告 {{hero_product}} 的开价时间（{{price_time}}）

# 风格
- 语速稍快、情绪饱满
- 多用"家人们"、"姐妹们"、"老铁们"
- 每 15 秒必须有一次"互动点"（提问 / 扣字 / 点赞）

# 输出
按时间分段，每段标清楚"建议时长"，并标注【停留钩】在哪里。`,
    variables: [
      { key: 'anchor_name', label: '主播昵称', type: 'text', required: true, group: '主播' },
      { key: 'category', label: '直播品类', type: 'enum', required: true, options: ['服饰', '美妆', '美食', '3C数码', '母婴', '家居'], group: '主播' },
      { key: 'target_groups', label: '目标人群', type: 'text', required: true, hint: '如：宝妈、上班族、学生党', group: '用户' },
      { key: 'hero_product', label: '今日主推', type: 'text', required: true, group: '商品' },
      { key: 'giftbag_rule', label: '福袋规则', type: 'textarea', required: true, hint: '如：关注+评论"想要"抽 3 份', group: '互动' },
      { key: 'warmup_minutes', label: '暖场时长', type: 'number', required: true, defaultValue: '3', group: '节奏' },
      { key: 'price_time', label: '爆款开价时间', type: 'text', required: false, defaultValue: '开播后 25 分钟', group: '节奏' },
    ],
    examples: [
      { id: 'e1', name: '美妆主播 · 小美', values: { anchor_name: '小美', category: '美妆', target_groups: '上班族、辣妈、学生', hero_product: '某精华液', giftbag_rule: '关注+扣"想要"抽 5 份小样', warmup_minutes: '3', price_time: '开播后 20 分钟' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 514, favorites: 132 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_004',
    title: '短篇小说开篇钩子 · 黄金三段',
    description: '让读者 30 秒内放不下的开篇结构。冲突前置 + 角色亮相 + 致命悬念。',
    category: 'novel',
    tags: ['开篇', '钩子', '短篇', '悬念'],
    author: aZhao,
    cover: 't_004',
    body: `# 角色
你是一位长年发表于《收获》《小说月报》的成熟作家，擅长都市悬疑与情感题材。

# 任务
为我的短篇小说撰写开篇 {{word_count}} 字。

# 故事设定
- 类型：{{genre}}
- 主角：{{protagonist}}
- 时代背景：{{era}}
- 核心冲突：{{core_conflict}}
- 风格基调：{{tone}}

# 黄金三段结构
## 第一段（50-80 字）：环境 + 异常
- 用一个反常的细节开场（不是"这是一个阳光明媚的早晨"）。
- 让读者立刻感到"有什么不对劲"。

## 第二段（80-150 字）：主角出场
- 通过一个动作或一句话让 {{protagonist}} 立起来。
- 必须暴露一个弱点或执念。

## 第三段（剩余字数）：致命悬念
- 引出 {{core_conflict}}，但不解释。
- 结尾用一句"未完成"的话（被打断、未回应、突然出现）结束。
- 禁止写"我从未想过..."这类老套过渡。

# 风格
- 句式短促，多用动词，少用形容词。
- 视角：第一人称 {{protagonist}}。
- 禁止出现的词：突然、竟然、不可思议、冥冥之中`,
    variables: [
      { key: 'genre', label: '题材', type: 'enum', required: true, options: ['都市悬疑', '情感', '现实主义', '科幻', '历史'], group: '故事' },
      { key: 'protagonist', label: '主角', type: 'text', required: true, hint: '含职业 / 身份', group: '故事' },
      { key: 'era', label: '时代', type: 'text', required: true, defaultValue: '当代', group: '故事' },
      { key: 'core_conflict', label: '核心冲突', type: 'textarea', required: true, group: '故事' },
      { key: 'tone', label: '风格基调', type: 'enum', required: true, options: ['冷峻', '温情', '黑色幽默', '诗意', '凌厉'], defaultValue: '冷峻', group: '故事' },
      { key: 'word_count', label: '字数', type: 'number', required: true, defaultValue: '500', group: '节奏' },
    ],
    examples: [
      { id: 'e1', name: '女刑警 · 雨夜', values: { genre: '都市悬疑', protagonist: '32岁女刑警', era: '当代', core_conflict: '十年未破的连环案与新受害者指向同一个人', tone: '冷峻', word_count: '500' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 367, favorites: 198 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_005',
    title: '分镜脚本 · 九宫格标准格式',
    description: '短视频分镜九宫格：镜号/景别/画面/对白/音效/时长 一目了然，可直接交付。',
    category: 'storyboard',
    tags: ['分镜', '九宫格', '短视频', '拍摄'],
    author: aStudio,
    cover: 't_005',
    body: `# 角色
你是资深分镜师，已为多支千万播放量短片提供过脚本。

# 任务
把以下创意撰写为 {{shot_count}} 镜的 {{aspect_ratio}} 分镜脚本。

# 创意
- 故事梗概：{{synopsis}}
- 主角色：{{protagonist}}
- 场景：{{location}}
- 关键道具：{{props}}
- 情绪弧线：{{emotion_arc}}

# 输出格式（每镜一行）
| 镜号 | 景别 | 运镜 | 画面内容 | 对白/旁白 | 音效/音乐 | 时长(s) |
|------|------|------|----------|-----------|-----------|---------|

# 景别选项
- ECU 极特写 / CU 特写 / MCU 中特写 / MS 中景 / WS 远景 / EWS 大远景

# 运镜选项
- 固定 / 推 / 拉 / 摇 / 移 / 跟 / 升 / 降 / 希区柯克 / 手持

# 风格要求
- 每个镜头的"画面内容"必须可视化、可拍摄，避免抽象描述。
- 对白要短，每镜最多 1-2 句。
- 时长合计 = {{total_duration}} 秒。
- 最后一镜必须留"钩尾"，引导关注。`,
    variables: [
      { key: 'synopsis', label: '故事梗概', type: 'textarea', required: true, group: '创意' },
      { key: 'protagonist', label: '主角色', type: 'text', required: true, group: '创意' },
      { key: 'location', label: '场景', type: 'text', required: true, group: '创意' },
      { key: 'props', label: '关键道具', type: 'text', required: false, group: '创意' },
      { key: 'emotion_arc', label: '情绪弧线', type: 'text', required: false, hint: '如：平静→焦虑→震惊→释然', group: '创意' },
      { key: 'shot_count', label: '镜头数', type: 'number', required: true, defaultValue: '9', group: '规格' },
      { key: 'aspect_ratio', label: '画幅', type: 'enum', required: true, options: ['9:16', '16:9', '1:1', '4:3'], defaultValue: '9:16', group: '规格' },
      { key: 'total_duration', label: '总时长(秒)', type: 'number', required: true, defaultValue: '45', group: '规格' },
    ],
    examples: [
      { id: 'e1', name: '咖啡店偶遇', values: { synopsis: '独居女生加班后第一次去咖啡店，遇到陌生男孩点了一杯和她一样的咖啡', protagonist: '独居女生 / 陌生男孩', location: '深夜咖啡店', props: '拿铁、玻璃杯、笔记本', emotion_arc: '孤独 → 好奇 → 心跳', shot_count: '9', aspect_ratio: '9:16', total_duration: '45' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 729, favorites: 245 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_006',
    title: '品牌故事片 · 3 分钟情绪短片',
    description: '品牌片 "从困境到绽放" 的情绪曲线脚本，含分镜结构、旁白、关键画面。',
    category: 'storyboard',
    tags: ['品牌片', '情绪', '旁白', 'TVC'],
    author: aNuan,
    cover: 't_006',
    body: `# 角色
你是一位品牌短片导演，作品多次入选 One Show、戛纳国际创意节短名单。

# 任务
为品牌「{{brand_name}}」撰写一条 {{duration}} 分钟的品牌情绪短片脚本。

# 品牌信息
- 行业：{{industry}}
- 品牌调性：{{tone}}
- 目标受众：{{audience}}
- 想传达的核心情感：{{core_emotion}}

# 情绪曲线
必须遵循 4 段结构：建立 → 压抑 → 转折 → 释放
- 建立（{{pct_setup}}）：日常与重复，铺陈品牌使用场景
- 压抑（{{pct_dark}}）：一个意外 / 阻碍 / 转折点
- 转折（{{pct_turn}}）：产品的关键时刻，{{brand_name}} 出现
- 释放（{{pct_release}}）：用户/场景的新状态

# 输出结构
## 1. 概念（一句话）
## 2. 旁白脚本（含时间码）
## 3. 关键画面（每段 2-3 个画面描述）
## 4. 音乐与音效建议
## 5. 结尾 slogan

# 风格
- 旁白克制、有呼吸感。
- 避免直接夸产品，让产品在画面里"自然存在"。
- 结尾留白多于信息。`,
    variables: [
      { key: 'brand_name', label: '品牌名', type: 'text', required: true, group: '品牌' },
      { key: 'industry', label: '行业', type: 'text', required: true, group: '品牌' },
      { key: 'tone', label: '品牌调性', type: 'text', required: true, hint: '如：克制、温度、锋利', group: '品牌' },
      { key: 'audience', label: '目标受众', type: 'text', required: true, group: '品牌' },
      { key: 'core_emotion', label: '核心情感', type: 'text', required: true, hint: '如：归属感、自我和解、勇气', group: '创意' },
      { key: 'duration', label: '时长(分钟)', type: 'number', required: true, defaultValue: '3', group: '规格' },
      { key: 'pct_setup', label: '建立段占比', type: 'number', required: false, defaultValue: '25', group: '规格' },
      { key: 'pct_dark', label: '压抑段占比', type: 'number', required: false, defaultValue: '25', group: '规格' },
      { key: 'pct_turn', label: '转折段占比', type: 'number', required: false, defaultValue: '25', group: '规格' },
      { key: 'pct_release', label: '释放段占比', type: 'number', required: false, defaultValue: '25', group: '规格' },
    ],
    examples: [
      { id: 'e1', name: '某香薰品牌', values: { brand_name: '某香薰品牌', industry: '生活方式', tone: '克制、温度', audience: '25-35岁城市独居女性', core_emotion: '归属感', duration: '3', pct_setup: '25', pct_dark: '25', pct_turn: '25', pct_release: '25' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 215, favorites: 89 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_007',
    title: '知识口播 · 5 分钟深度拆解',
    description: '知识博主向：钩子 → 反共识 → 论据三段 → 收束行动。',
    category: 'livestream',
    tags: ['知识', '口播', '深度', '拆解'],
    author: aYun,
    cover: 't_007',
    body: `# 角色
你是一位百万粉丝知识区博主，擅长把复杂概念讲得"像跟朋友聊天"。

# 任务
围绕「{{topic}}」写一条 {{duration}} 分钟的口播脚本。

# 受众
- 画像：{{audience}}
- 现有认知：{{prior_knowledge}}

# 结构
1. **钩子（0:00-0:15）**：用反共识结论 / 颠覆性观点开场
   - 例："关于 {{topic}}，99% 的人都想错了。"
2. **背景（0:15-1:00）**：1 个具体场景让目标用户"对号入座"
3. **三段论据（1:00-{{transition_time}}）**：
   - 段 1：{{arg1}}
   - 段 2：{{arg2}}
   - 段 3：{{arg3}}
4. **收束行动（{{transition_time}}-end）**：1 个可立即执行的动作

# 风格
- 禁用"小伙伴们"、"家人们"。
- 段落间有"呼吸句"，让剪辑点清晰。
- 论据必须有 1 个具体数据 / 案例。
- 结尾留一句"我下次想讲..."做钩子。`,
    variables: [
      { key: 'topic', label: '主题', type: 'text', required: true, group: '内容' },
      { key: 'audience', label: '受众画像', type: 'text', required: true, group: '内容' },
      { key: 'prior_knowledge', label: '现有认知', type: 'text', required: true, hint: '他们对此话题已知道什么', group: '内容' },
      { key: 'arg1', label: '论据 1', type: 'text', required: true, group: '论据' },
      { key: 'arg2', label: '论据 2', type: 'text', required: true, group: '论据' },
      { key: 'arg3', label: '论据 3', type: 'text', required: true, group: '论据' },
      { key: 'duration', label: '时长(分钟)', type: 'number', required: true, defaultValue: '5', group: '规格' },
      { key: 'transition_time', label: '论据结束时间', type: 'text', required: false, defaultValue: '4:00', group: '规格' },
    ],
    examples: [
      { id: 'e1', name: '深度工作', values: { topic: '深度工作', audience: '互联网产品经理', prior_knowledge: '听说过但没系统实践', arg1: '心流不是天赋是训练', arg2: '环境设计 > 意志力', arg3: '"无聊训练" 30 天实验', duration: '5', transition_time: '4:00' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 491, favorites: 167 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_008',
    title: '公众号长文 · 万阅读开篇',
    description: '公众号长文专用：开头悬念 → 故事化 → 观点 → 行动呼吁。',
    category: 'ad',
    tags: ['公众号', '长文', '开篇', '观点'],
    author: aLi,
    cover: 't_008',
    body: `# 角色
你是一位 10w+ 阅读量的公众号主笔，擅长观点类与故事类结合的长文。

# 任务
围绕「{{topic}}」写一篇 {{word_count}} 字的公众号长文。

# 目标
- 让 {{audience}} 在前 200 字内决定"继续读下去"。
- 引导他们在结尾完成 {{cta}}。

# 结构
## 1. 开头（200 字内）
- 用一个反常的事实 / 场景 / 数据开场
- 不要用"近日"开篇

## 2. 故事化展开
- 引出主角：{{protagonist}}
- 关键事件：{{key_event}}
- 转折点：{{turning_point}}

## 3. 观点提炼
- 主论点：{{main_argument}}
- 三个支撑点

## 4. 行动呼吁
- 1 个低门槛行动
- 1 个互动话题

# 风格
- 段落 4-6 行即换。
- 关键句加粗（用 **）。
- 避免"我们"、"大家"等无差别称呼，多用"你"。
- 引用不超过 2 处。`,
    variables: [
      { key: 'topic', label: '主题', type: 'text', required: true, group: '内容' },
      { key: 'audience', label: '目标读者', type: 'text', required: true, group: '内容' },
      { key: 'protagonist', label: '故事主角', type: 'text', required: true, group: '故事' },
      { key: 'key_event', label: '关键事件', type: 'textarea', required: true, group: '故事' },
      { key: 'turning_point', label: '转折点', type: 'text', required: true, group: '故事' },
      { key: 'main_argument', label: '主论点', type: 'text', required: true, group: '观点' },
      { key: 'cta', label: '结尾行动', type: 'text', required: true, hint: '如：留言区写下你的故事', group: '收尾' },
      { key: 'word_count', label: '字数', type: 'number', required: true, defaultValue: '2500', group: '规格' },
    ],
    examples: [
      { id: 'e1', name: '内卷', values: { topic: '内卷的尽头', audience: '30+职场人', protagonist: '某大厂P7', key_event: '主动降薪转行', turning_point: '发现另一种活法', main_argument: '内卷不是问题本身，问题是怕失去', cta: '留言你的"第一次不想卷"', word_count: '2500' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 388, favorites: 124 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_009',
    title: '直播逼单 · 黄金 60 秒',
    description: '价格揭晓时的逼单话术。痛感 + 价值 + 紧迫感三件套，可直接套用。',
    category: 'livestream',
    tags: ['直播', '逼单', '价格', '紧迫感'],
    author: aMo,
    cover: 't_009',
    body: `# 角色
你是一位擅长美妆 / 服饰品类的直播运营，已带出多个百万 GMV 单品。

# 任务
为「{{product_name}}」撰写 {{duration}} 秒的"价格揭晓"逼单话术。

# 产品信息
- 原价：{{original_price}}
- 直播价：{{sale_price}}
- 赠品：{{gift}}
- 库存：{{stock}}

# 节奏（务必遵守）

## 第一步：原价铺垫（{{p1}}s）
"姐姐们，平时咱们去专柜……"

## 第二步：价差冲击（{{p2}}s）
- 给出具体节省金额
- 用 {{anchor_object}} 做对比

## 第三步：赠品叠加（{{p3}}s）
- 赠品 {{gift}} 的具体价值
- 强调"买一送 X"

## 第四步：紧迫感（{{p4}}s）
- 库存 {{stock}} 限购
- "3、2、1 上链接" 节奏

# 风格
- 多用"姐妹们"、"真的"、"算过账"
- 价格必须用阿拉伯数字，不要"百来块"
- 关键数字要重复两遍`,
    variables: [
      { key: 'product_name', label: '产品名', type: 'text', required: true, group: '商品' },
      { key: 'original_price', label: '原价', type: 'text', required: true, group: '商品' },
      { key: 'sale_price', label: '直播价', type: 'text', required: true, group: '商品' },
      { key: 'gift', label: '赠品', type: 'text', required: true, group: '商品' },
      { key: 'stock', label: '库存数', type: 'number', required: true, group: '商品' },
      { key: 'anchor_object', label: '价差对比物', type: 'text', required: false, defaultValue: '一顿火锅', group: '话术' },
      { key: 'duration', label: '总时长(秒)', type: 'number', required: true, defaultValue: '60', group: '节奏' },
      { key: 'p1', label: '铺垫(秒)', type: 'number', required: false, defaultValue: '15', group: '节奏' },
      { key: 'p2', label: '价差(秒)', type: 'number', required: false, defaultValue: '15', group: '节奏' },
      { key: 'p3', label: '赠品(秒)', type: 'number', required: false, defaultValue: '15', group: '节奏' },
      { key: 'p4', label: '紧迫(秒)', type: 'number', required: false, defaultValue: '15', group: '节奏' },
    ],
    examples: [
      { id: 'e1', name: '精华液', values: { product_name: '某精华液', original_price: '599', sale_price: '299', gift: '5 片面膜 + 化妆包', stock: '200', anchor_object: '一顿火锅', duration: '60', p1: '15', p2: '15', p3: '15', p4: '15' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 612, favorites: 173 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_010',
    title: '反派角色 · 人物小传',
    description: '为长篇/短片打造立体反派的角色卡：动机、伤口、底线、关键时刻。',
    category: 'novel',
    tags: ['角色', '反派', '人物小传', '深度'],
    author: aZhao,
    cover: 't_010',
    body: `# 角色
你是一位剧作顾问，参与过多部院线电影的角色构建。

# 任务
为我的故事「{{story_title}}」撰写反派「{{villain_name}}」的完整人物小传。

# 故事信息
- 类型：{{genre}}
- 主角：{{protagonist}}
- 反派与主角关系：{{relationship}}
- 故事主题：{{theme}}

# 小传结构
## 1. 表面身份
- 职业 / 外在 / 公开形象

## 2. 核心伤口
- 童年 / 创伤 / 未愈合的执念
- 这一伤口如何驱动了他的"反派逻辑"

## 3. 行事哲学
- 1 句他自己的座右铭
- 他如何说服自己"我做的是对的"

## 4. 行为模式
- 5 个习惯动作
- 3 句口头禅
- 不会做的 1 件事（划清底线）

## 5. 与主角的镜像
- 主角最缺的东西，反派最不缺
- 反派最缺的东西，主角最不缺
- 这构成的核心冲突

## 6. 关键转折
- 故事中 {{turning_point}} 时反派会做什么
- 他"差点变好"的瞬间

# 风格
- 不要脸谱化。
- 让读者合上书后仍然记得这个反派。`,
    variables: [
      { key: 'story_title', label: '故事名', type: 'text', required: true, group: '故事' },
      { key: 'villain_name', label: '反派名', type: 'text', required: true, group: '故事' },
      { key: 'protagonist', label: '主角', type: 'text', required: true, group: '故事' },
      { key: 'relationship', label: '反派与主角关系', type: 'text', required: true, hint: '如：导师 / 同事 / 父亲', group: '故事' },
      { key: 'genre', label: '类型', type: 'enum', required: true, options: ['都市', '古装', '悬疑', '科幻', '武侠'], group: '故事' },
      { key: 'theme', label: '故事主题', type: 'text', required: true, group: '故事' },
      { key: 'turning_point', label: '关键转折', type: 'text', required: true, group: '结构' },
    ],
    examples: [
      { id: 'e1', name: '导师变反派', values: { story_title: '某电影', villain_name: '林远', protagonist: '陈然', relationship: '前导师 / 现公司高管', genre: '都市', theme: '理想主义的代价', turning_point: '陈然递交辞呈那天' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 297, favorites: 142 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_011',
    title: '产品种草视频 · 测评口播',
    description: '"客观测评"包装的种草：缺点先说 → 优点放大 → 购买建议。',
    category: 'short-video',
    tags: ['测评', '种草', '口播', '真实感'],
    author: aYu,
    cover: 't_011',
    body: `# 角色
你是一位 3C / 生活类测评博主，视频风格"先说缺点再说优点"。

# 任务
为「{{product_name}}」写一条 {{duration}} 秒的"测评种草"口播脚本。

# 产品
- 品类：{{category}}
- 价格：{{price}}
- 主要卖点：{{highlights}}
- 真实缺点：{{flaws}}

# 结构

## 1. 钩子（0-3 秒）
"用了 {{days_used}} 天，这玩意儿我要跟你说实话。"

## 2. 缺点先说（3-15 秒）
- 提 1-2 个 {{flaws}}
- 但每说一个缺点，紧跟一句"但是 / 不过"
- 保持中立感

## 3. 优点放大（15-{{benefit_end}}s）
- 选 {{highlights}} 中最强的 1-2 点
- 用具体场景演示（不要堆参数）

## 4. 适合人群 + 价格
- 谁买最值
- 谁别买
- {{price}} 的价格锚定

# 风格
- 多用"说真的"、"哥们"、"姐妹们"
- 参数表绝对不要念
- 全程像聊天，不要"大家好我是 XXX"`,
    variables: [
      { key: 'product_name', label: '产品名', type: 'text', required: true, group: '产品' },
      { key: 'category', label: '品类', type: 'text', required: true, group: '产品' },
      { key: 'price', label: '价格', type: 'text', required: true, group: '产品' },
      { key: 'highlights', label: '主要卖点', type: 'textarea', required: true, hint: '逗号或换行分隔', group: '产品' },
      { key: 'flaws', label: '真实缺点', type: 'textarea', required: true, group: '产品' },
      { key: 'days_used', label: '使用天数', type: 'number', required: true, defaultValue: '14', group: '体验' },
      { key: 'duration', label: '时长(秒)', type: 'number', required: true, defaultValue: '60', group: '规格' },
      { key: 'benefit_end', label: '优点段结束时间', type: 'number', required: false, defaultValue: '45', group: '规格' },
    ],
    examples: [
      { id: 'e1', name: '某降噪耳机', values: { product_name: '某降噪耳机', category: '降噪耳机', price: '1299', highlights: '降噪深度\n佩戴舒适\n多设备切换', flaws: '续航一般\n塑料感', days_used: '21', duration: '60', benefit_end: '45' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 423, favorites: 151 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },

  {
    id: 't_012',
    title: '播客开场 · 30 秒抓住听众',
    description: '播客节目前 30 秒：问候 + 钩子 + 本期预告 + 引导关注。',
    category: 'livestream',
    tags: ['播客', '开场', '钩子', '音频'],
    author: aYun,
    cover: 't_012',
    body: `# 角色
你是一位播客主理人，节目在 Apple Podcasts 中文区稳定 TOP 50。

# 任务
为播客「{{podcast_name}}」撰写一期节目的开场 30 秒口播。

# 本期信息
- 期号：第 {{episode_no}} 期
- 主题：{{topic}}
- 嘉宾：{{guest}}
- 3 个核心问题：{{questions}}

# 30 秒结构

## 0-5 秒：问候
"你好，欢迎收听 {{podcast_name}}，我是 {{host_name}}。"

## 5-15 秒：钩子
用 1 句话挑动好奇心
- 例："今天的嘉宾说了一句让我愣住 3 秒的话……"

## 15-25 秒：本期预告
- 嘉宾 {{guest}} 是谁
- 围绕 {{topic}} 的 3 个问题

## 25-30 秒：关注引导
- 关注、订阅、留言

# 风格
- 声音感强，少用书面词。
- 不要"在节目中"、"本期我们将"。
- 让听众感觉"被邀请进一个对话"。`,
    variables: [
      { key: 'podcast_name', label: '播客名', type: 'text', required: true, group: '节目' },
      { key: 'episode_no', label: '期号', type: 'text', required: true, group: '节目' },
      { key: 'host_name', label: '主理人', type: 'text', required: true, group: '节目' },
      { key: 'topic', label: '主题', type: 'text', required: true, group: '本期' },
      { key: 'guest', label: '嘉宾', type: 'text', required: true, group: '本期' },
      { key: 'questions', label: '核心问题', type: 'textarea', required: true, hint: '逗号或换行分隔', group: '本期' },
    ],
    examples: [
      { id: 'e1', name: '采访独立游戏制作人', values: { podcast_name: '深夜慢谈', episode_no: '42', host_name: '小柯', topic: '独立游戏如何活过第一年', guest: '某独立游戏制作人', questions: '为什么放弃大厂\n第一个月怎么活\n最难的决定' } },
    ],
    versions: [{ id: 'v1', createdAt: now, snapshot: '初版' }],
    stats: { uses: 188, favorites: 76 },
    isPublic: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const FOLDERS_SEED = [
  { id: 'f_default', name: '我的剧库', parentId: null, userId: 'u_demo', createdAt: now },
  { id: 'f_short',   name: '短视频脚本', parentId: 'f_default', userId: 'u_demo', createdAt: now },
  { id: 'f_ad',      name: '品牌广告',   parentId: 'f_default', userId: 'u_demo', createdAt: now },
  { id: 'f_novel',   name: '故事灵感',   parentId: 'f_default', userId: 'u_demo', createdAt: now },
];
