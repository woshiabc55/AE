// 模板市场种子数据 - 16 个高质量剧本模板
import type { Template, Category } from '../types';

export const CATEGORIES: { key: Category; label: string; sub: string; hue: string }[] = [
  { key: 'short-video', label: '短视频', sub: '15-60s 钩子文案', hue: '#E8B14A' },
  { key: 'ad',          label: '种草广告', sub: '小红书/品牌向', hue: '#C0392B' },
  { key: 'livestream',  label: '直播口播', sub: '暖场 · 逼单 · 互动', hue: '#3A8E8E' },
  { key: 'viral',       label: '大流量', sub: '爆款 · 钩子 · 情绪', hue: '#FF4D6D' },
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
const aHuo = author('u_huo', '火舞');
const aBo = author('u_bo', '波波');
const aXin = author('u_xin', '心流实验室');

const now = '2025-09-12T10:00:00.000Z';
const recent = '2025-10-08T08:00:00.000Z';
const viralRecent = '2025-11-20T08:00:00.000Z';

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
  {
    id: 't_013',
    title: '抖音爆款标题 · 9 宫格公式',
    description: '9 种被验证的高点击率标题公式，3 秒决定完播率。覆盖情感、悬念、反差、数字、金句等所有爆点。',
    category: 'viral',
    tags: ['爆款', '标题', '钩子', '高CTR'],
    author: aHuo,
    cover: 't_013',
    body: `# 角色
你是抖音头部 MCN 的爆款操盘手，旗下账号单条最高 8000w 播放。你能用最简短的语言制造最大的点击冲动。

# 任务
为「{{topic}}」生成 {{count}} 个 15 字以内的抖音爆款标题，必须分别使用以下 9 种公式中选 {{formula_count}} 种。

# 9 大爆款公式
1. **数字冲击**：「一辈子一定要做的 {{n}} 件事」
2. **反差冲突**：「{{subject_a}} 的人，最后都 {{verb_b}}」
3. **悬念钩子**：「{{opening}}，我至今不敢说」
4. **身份代入**：「{{identity}} 一定要知道的事」
5. **金句断言**：「成年人的世界：{{truth}}」
6. **痛点共鸣**：「{{pain}} 的人，才会懂」
7. **利益承诺**：「学会这招，{{benefit}}」
8. **争议观点**：「为什么我劝你别 {{action}}」
9. **时间紧迫**：「再不看就 {{consequence}}」

# 平台调性
- 抖音用户平均停留 {{stay_seconds}} 秒。标题要在 0.5 秒内完成「捕获」。
- 不要用「震惊体」、「标题党」等已过时的套路。
- 优先制造「情绪」而非「信息」。

# 适配场景
- 目标受众：{{target}}
- 发布时段：{{publish_time}}
- 账号定位：{{positioning}}

# 输出要求
- 每行一个标题，前面用 [公式序号] 标注
- 选中的公式必须彼此不同，避免重复套路
- 全部完成后给出一句话总结：这些标题共同的「情绪引爆点」是什么

# 现在开始
直接给 {{count}} 条标题，不要解释。`,
    variables: [
      { key: 'topic', label: '主题/选题', type: 'text', required: true, hint: '如：副业、自律、护肤', group: '选题' },
      { key: 'count', label: '生成数量', type: 'number', required: true, defaultValue: '9', group: '规格' },
      { key: 'formula_count', label: '公式种类数', type: 'number', required: true, defaultValue: '9', hint: '建议 5-9，过少会重复', group: '规格' },
      { key: 'target', label: '目标受众', type: 'text', required: true, hint: '如：25-35岁职场妈妈', group: '受众' },
      { key: 'publish_time', label: '发布时段', type: 'enum', required: true, options: ['早 7-9 点通勤', '午 12-14 点', '晚 18-20 点下班', '晚 21-23 点睡前', '深夜 23-1 点'], defaultValue: '晚 21-23 点睡前', group: '受众' },
      { key: 'positioning', label: '账号定位', type: 'text', required: true, hint: '如：个人成长、知识干货、情感博主', group: '受众' },
      { key: 'stay_seconds', label: '用户停留(秒)', type: 'number', required: false, defaultValue: '8', group: '规格' },
      { key: 'n', label: '数字', type: 'text', required: false, defaultValue: '10', group: '辅助' },
      { key: 'subject_a', label: '反差主体 A', type: 'text', required: false, group: '辅助' },
      { key: 'verb_b', label: '反差动作 B', type: 'text', required: false, group: '辅助' },
      { key: 'opening', label: '悬念开场', type: 'text', required: false, group: '辅助' },
      { key: 'identity', label: '身份标签', type: 'text', required: false, group: '辅助' },
      { key: 'truth', label: '金句真相', type: 'text', required: false, group: '辅助' },
      { key: 'pain', label: '痛点人群', type: 'text', required: false, group: '辅助' },
      { key: 'benefit', label: '利益承诺', type: 'text', required: false, group: '辅助' },
      { key: 'action', label: '争议动作', type: 'text', required: false, group: '辅助' },
      { key: 'consequence', label: '紧迫后果', type: 'text', required: false, group: '辅助' },
    ],
    examples: [
      { id: 'e1', name: '副业话题', values: { topic: '副业赚钱', count: '9', formula_count: '9', target: '25-35岁上班族', publish_time: '晚 21-23 点睡前', positioning: '个人成长', stay_seconds: '8', n: '5', subject_a: '月入 3000', verb_b: '月入 3 万', opening: '三年前我穷得吃不起外卖', identity: '想搞副业的打工人', truth: '没有人会为你的情绪买单', pain: '每天通勤两小时', benefit: '30 天多挣 1 万', action: '裸辞', consequence: '永远错过这波红利' } },
      { id: 'e2', name: '自律话题', values: { topic: '自律', count: '9', formula_count: '6', target: '学生', publish_time: '早 7-9 点通勤', positioning: '学习方法', stay_seconds: '6', n: '7', subject_a: '天天躺平', verb_b: '悄悄拿了国奖', opening: '我大一差点被退学', identity: '拖延症晚期', truth: '能拯救你的从来不是自律', pain: '凌晨两点还在刷手机', benefit: '一年时间彻底改命', action: '早起', consequence: '再也不知道怎么开始' } },
    ],
    versions: [{ id: 'v1', createdAt: viralRecent, snapshot: '初版 9 公式' }],
    stats: { uses: 3421, favorites: 892 },
    isPublic: true,
    createdAt: viralRecent,
    updatedAt: viralRecent,
  },

  {
    id: 't_014',
    title: '小红书爆款笔记 · 封面+标题+正文',
    description: '小红书 10w+ 笔记验证结构：高 CTR 封面 + 18 字以内标题 + 4 段式正文 + 强互动钩子。',
    category: 'viral',
    tags: ['小红书', '爆款', '10w+', '种草'],
    author: aBo,
    cover: 't_014',
    body: `# 角色
你是一位小红书万粉博主，擅长把普通产品写成"刷到就停不下来"的爆款笔记。多篇笔记单月 10w+ 曝光。

# 任务
为「{{product_name}}」写一篇小红书爆款笔记，目标 {{target_users}}，核心痛点是 {{pain_point}}。

# 三件套输出

## 一、5 个高 CTR 封面文案
要求：≤ 12 字，对比/数字/反问为主
格式：「封面 - 钩子元素 - 适用风格」
例：「暴击! 同事都问的皮肤 - 数字 + 疑问 - 痛点风」

## 二、3 个候选标题（≤ 20 字）
必须满足：
- 含数字或 emoji
- 有「身份标签」或「痛点」
- 不要"亲测"、"巨好用"等老套词
- 例：🔥 用了 30 天，眼纹真的淡了（28 岁熬夜党）

## 三、正文（600-900 字，4 段式）
### 第 1 段：钩子共鸣（80-100 字）
- 用 {{scene}} 场景切入，让 {{target_users}} 立刻对号入座
- 不要用"姐妹们"开场

### 第 2 段：自用体验（300-400 字）
- 第 {{usage_days}} 天的真实变化（具体、可量化）
- 1 个核心卖点 + 2 个细节
- 提 1 个真实小缺点（增加信任）

### 第 3 段：使用 tips（150-200 字）
- 3 个 {{usage_tips}}
- 1 个适合 / 不适合人群

### 第 4 段：互动钩子（80-120 字）
- 1 个具体提问
- 1 个福利钩（评论关键词抽奖 / 私信领资料）
- 必须@ 1-2 个相关博主话题

# 标签（10 个）
混合：{{product_name}} + 1 个大词（{{big_tag}}）+ 2 个长尾词（{{long_tail}}）+ 2 个场景词

# 风格
- 段落 2-3 行就换行，方便手机阅读
- emoji 5-8 个，不过度
- 结尾禁用"点击购买"、"私我"等硬广`,
    variables: [
      { key: 'product_name', label: '产品名', type: 'text', required: true, group: '产品' },
      { key: 'target_users', label: '目标用户', type: 'text', required: true, group: '产品' },
      { key: 'pain_point', label: '核心痛点', type: 'text', required: true, group: '产品' },
      { key: 'scene', label: '痛点场景', type: 'textarea', required: true, hint: '用户具体在什么场景下会遇到这个痛点', group: '内容' },
      { key: 'usage_days', label: '使用天数', type: 'number', required: true, defaultValue: '30', group: '内容' },
      { key: 'usage_tips', label: '使用 tips', type: 'text', required: true, hint: '逗号分隔, 如: 晚上用, 按摩 30s, 薄涂', group: '内容' },
      { key: 'big_tag', label: '大词标签', type: 'text', required: true, hint: '如: 平价护肤', group: 'SEO' },
      { key: 'long_tail', label: '长尾词', type: 'text', required: true, hint: '逗号分隔, 如: 敏感肌精华, 抗老眼霜', group: 'SEO' },
    ],
    examples: [
      { id: 'e1', name: '某新锐眼霜', values: { product_name: '某新锐眼霜', target_users: '25-30 岁熬夜党', pain_point: '眼下细纹 + 暗沉', scene: '凌晨 2 点还在改方案，第二天化妆眼下卡纹', usage_days: '30', usage_tips: '无名指点压, 少量多次, 配美容仪', big_tag: '平价眼霜', long_tail: '熬夜眼霜, 抗初老精华' } },
    ],
    versions: [{ id: 'v1', createdAt: viralRecent, snapshot: '初版三件套' }],
    stats: { uses: 2103, favorites: 567 },
    isPublic: true,
    createdAt: viralRecent,
    updatedAt: viralRecent,
  },

  {
    id: 't_015',
    title: '知乎高赞答案 · 三段式爆点',
    description: '知乎万赞答案结构：故事钩子 + 反共识干货 + 升华金句。已被验证多篇千赞答案。',
    category: 'viral',
    tags: ['知乎', '高赞', '故事', '反共识'],
    author: aXin,
    cover: 't_015',
    body: `# 角色
你是一位知乎高赞答主，擅长把专业知识包装成"读完忍不住点赞"的长答案。

# 任务
围绕问题「{{question}}」写一篇 {{word_count}} 字的知乎答案。

# 答案结构

## 1. 故事钩子（前 100 字）
- 用 {{protagonist}} 的真实经历切入
- 必须有一个"反常识"细节
- 让读者产生「这答案不一样」的第一印象

## 2. 反共识干货（主体 60% 字数）
- 给出 {{main_argument}} 个「与多数人认知相反」的观点
- 每个观点配 1 个真实数据 / 案例
- 用"我自己踩过这个坑"等亲历感表达
- 适当分段、加粗

## 3. 升华金句（结尾 200 字）
- 回到 {{protagonist}} 的故事
- 给出一个让读者"想要收藏"的金句
- 引导点赞/关注的话术

# 风格
- 知乎体 + 一点点"过来人"的谦逊
- 段落短，多用 1-2 行的段落
- 关键论点加粗 (**)
- 禁用"我反对"、"恕我直言"等对抗性表达
- 全文 1-2 个表情包即可

# 数据要求
- 至少引用 {{data_count}} 个具体数据
- 数据来源使用"据 XX 报告 / 据我观察"模糊化
- 不要编造精确数字`,
    variables: [
      { key: 'question', label: '知乎问题', type: 'textarea', required: true, hint: '完整复制问题', group: '内容' },
      { key: 'protagonist', label: '故事主角', type: 'text', required: true, hint: '可以是你自己、朋友、客户', group: '内容' },
      { key: 'main_argument', label: '反共识观点数', type: 'number', required: true, defaultValue: '3', group: '结构' },
      { key: 'word_count', label: '总字数', type: 'number', required: true, defaultValue: '1500', group: '结构' },
      { key: 'data_count', label: '数据引用数', type: 'number', required: false, defaultValue: '3', group: '结构' },
    ],
    examples: [
      { id: 'e1', name: '自律问题', values: { question: '为什么懂了很多道理，还是过不好这一生？', protagonist: '我那个 32 岁才转行的朋友', main_argument: '3', word_count: '1500', data_count: '3' } },
      { id: 'e2', name: '副业问题', values: { question: '普通人如何开始第一个副业？', protagonist: '我那个从月入 5000 到月入 5 万的同事', main_argument: '4', word_count: '2000', data_count: '4' } },
    ],
    versions: [{ id: 'v1', createdAt: viralRecent, snapshot: '初版三段式' }],
    stats: { uses: 1587, favorites: 423 },
    isPublic: true,
    createdAt: viralRecent,
    updatedAt: viralRecent,
  },

  {
    id: 't_016',
    title: '视频号爆款 · 情感共鸣口播',
    description: '视频号爆款公式：父辈/家乡/童年/遗憾/重逢 五大情感母题，转发率 30%+。',
    category: 'viral',
    tags: ['视频号', '情感', '转发', '母题'],
    author: aHuo,
    cover: 't_016',
    body: `# 角色
你是一位视频号情感博主，单条视频最高 200w+ 转发，擅长"父辈叙事 + 当代共鸣"。

# 任务
基于「情感母题：{{theme}}」写一条 {{duration}} 秒的视频号口播脚本。

# 五大情感母题（选 {{theme}}）
- **父辈**：上一代人的沉默与付出
- **家乡**：离开与回归的张力
- **童年**：回不去的纯真
- **遗憾**：来不及说出口的话
- **重逢**：多年后重逢的瞬间

# 脚本结构（务必遵守）

## 0-3 秒：钩子
- 制造一个"画面感"开头（不是"大家好"）
- 例："我翻到一张 1998 年的照片，我爸那年 {{age}} 岁。"

## 4-15 秒：场景
- 一个具体到时间、地点、声音的细节
- 调动视觉 + 听觉 + 嗅觉至少 2 种感官
- 让{{target_viewer}}瞬间回到自己的记忆

## 16-{{turning}} 秒：转折
- 那个瞬间发生了什么
- 必须有"动作"而非"心理活动"

## {{turning}}-end：共鸣金句
- 一句可以截图转发的话
- 必须是"我们这一代人"的共同感受
- 例："爸妈不会用智能手机，但他们学会了拍视频说想你。"

# 风格
- 多用"我们"、"那个年代"
- 不煽情、不说教
- 让情绪自然升起
- 结尾 1 句引导转发："这条视频，转给那个你最想见的人。"

# 适配
- 目标观众：{{target_viewer}}（如：35-50 岁，父辈/同辈）
- 目标平台：视频号（强调转发、轻互动）`,
    variables: [
      { key: 'theme', label: '情感母题', type: 'enum', required: true, options: ['父辈', '家乡', '童年', '遗憾', '重逢'], group: '内容' },
      { key: 'target_viewer', label: '目标观众', type: 'text', required: true, hint: '如：35-45 岁上有老下有小', group: '受众' },
      { key: 'duration', label: '时长(秒)', type: 'number', required: true, defaultValue: '60', group: '规格' },
      { key: 'turning', label: '转折点(秒)', type: 'number', required: false, defaultValue: '40', group: '规格' },
      { key: 'age', label: '父辈年龄', type: 'number', required: false, defaultValue: '35', group: '辅助' },
    ],
    examples: [
      { id: 'e1', name: '父辈母题', values: { theme: '父辈', target_viewer: '30-40 岁职场人', duration: '60', turning: '40', age: '35' } },
      { id: 'e2', name: '家乡母题', values: { theme: '家乡', target_viewer: '25-35 岁北漂沪漂', duration: '90', turning: '60', age: '40' } },
    ],
    versions: [{ id: 'v1', createdAt: viralRecent, snapshot: '初版五大母题' }],
    stats: { uses: 1832, favorites: 671 },
    isPublic: true,
    createdAt: viralRecent,
    updatedAt: viralRecent,
  },
];

export const FOLDERS_SEED = [
  { id: 'f_default', name: '我的剧库', parentId: null, userId: 'u_demo', createdAt: now },
  { id: 'f_short',   name: '短视频脚本', parentId: 'f_default', userId: 'u_demo', createdAt: now },
  { id: 'f_ad',      name: '品牌广告',   parentId: 'f_default', userId: 'u_demo', createdAt: now },
  { id: 'f_novel',   name: '故事灵感',   parentId: 'f_default', userId: 'u_demo', createdAt: now },
];
