import type { ToolCategory } from './categories'

export interface AITool {
  id: string
  name: string
  tagline: string
  description: string
  category: Exclude<ToolCategory, 'all'>
  tags: string[]
  url: string
  hot?: boolean
  promptKeywords: string
  size: 'square' | 'portrait' | 'landscape' | 'tall'
  vendor?: string
}

const t = (
  id: string,
  name: string,
  tagline: string,
  description: string,
  category: Exclude<ToolCategory, 'all'>,
  tags: string[],
  url: string,
  promptKeywords: string,
  size: AITool['size'] = 'square',
  hot = false,
  vendor?: string
): AITool => ({ id, name, tagline, description, category, tags, url, promptKeywords, size, hot, vendor })

// 海量 AI 工具数据集：覆盖 21 个细分领域，单期 200+ 收录
export const TOOLS: AITool[] = [
  // ============== CHAT ==============
  t('chat-gpt', 'ChatGPT', '通用对话之王', '由 OpenAI 推出的旗舰对话模型，支持文本、图像、文件、代码与插件生态，是当前 LLM 应用的事实标准。', 'chat', ['对话', 'GPT-4o', '插件'], 'https://chat.openai.com', 'editorial magazine cover, brain made of luminous threads, surreal, dramatic lighting', 'landscape', true, 'OpenAI'),
  t('chat-claude', 'Claude', '长文阅读与写作利器', 'Anthropic 推出的对话助手，以 200K 长上下文与稳健的写作风格著称，适合深度阅读与编程协作。', 'chat', ['长上下文', '写作', 'Anthropic'], 'https://claude.ai', 'serif typography on kraft paper, deep thought bubble, warm cream tones', 'portrait', true, 'Anthropic'),
  t('chat-gemini', 'Gemini', 'Google 多模态全家桶', 'Google DeepMind 出品的多模态模型，深度集成 Workspace、搜索与 Android 生态。', 'chat', ['多模态', 'Google', '搜索'], 'https://gemini.google.com', 'gemini constellation of stars forming a brain, cosmic indigo', 'square', true, 'Google'),
  t('chat-llama', 'Llama Chat', 'Meta 开源大模型对话', '基于 Meta Llama 3 模型的官方对话界面，可自由下载权重进行本地化。', 'chat', ['开源', 'Meta', '本地部署'], 'https://www.llama.com', 'wild llama made of golden light, andes mountains, dawn', 'portrait', false, 'Meta'),
  t('chat-mistral', 'Le Chat', '欧洲速度型助手', 'Mistral AI 推出的对话产品，以极快响应速度与法式节制美学著称。', 'chat', ['法国', '高速', 'Mistral'], 'https://chat.mistral.ai', 'a silver mistral horse racing through clouds, speed blur, white background', 'square', false, 'Mistral'),
  t('chat-deepseek', 'DeepSeek', '国产开源之光', '深度求索推出的高性能开源大模型，提供网页、API 与本地部署。', 'chat', ['开源', '中文', '推理'], 'https://chat.deepseek.com', 'chinese ink painting of a deep cosmic abyss glowing with runes', 'landscape', true, 'DeepSeek'),
  t('chat-qwen', '通义千问', '阿里全能助手', '阿里云推出的大模型对话产品，集成办公、绘画、代码等多模态能力。', 'chat', ['阿里', '中文', '办公'], 'https://tongyi.aliyun.com', 'thousand questions carved into a giant red chinese seal', 'square', false, 'Alibaba'),
  t('chat-wenxin', '文心一言', '百度知识增强对话', '百度推出的知识增强大语言模型，融合搜索、地图、百科等中文数据。', 'chat', ['百度', '知识', '中文'], 'https://yiyan.baidu.com', 'a poetic scroll unfolding, chinese characters dancing in air', 'portrait', false, 'Baidu'),
  t('chat-hunyuan', '腾讯混元', '腾讯大模型助手', '腾讯混元大模型的官方对话入口，集成于微信、QQ 与腾讯文档。', 'chat', ['腾讯', '生态', '中文'], 'https://hunyuan.tencent.com', 'swirling primordial cloud containing a glowing yuan symbol', 'square', false, 'Tencent'),
  t('chat-kimi', 'Kimi', '长文档阅读专家', '月之暗面推出的对话助手，主打超长上下文与文件解读。', 'chat', ['长文', '文件', '中文'], 'https://kimi.moonshot.cn', 'a moonlit reading desk, papers floating, ethereal silver light', 'portrait', true, 'Moonshot'),
  t('chat-doubao', '豆包', '字节跳动 AI 助手', '字节跳动推出的多场景 AI 助手，覆盖聊天、写作、绘图、语音等。', 'chat', ['字节', '中文', '多功能'], 'https://www.doubao.com', 'a giant playful bean pod opening to reveal glowing messages', 'square', false, 'ByteDance'),
  t('chat-grok', 'Grok', 'xAI 实时幽默助手', '由马斯克旗下 xAI 推出，接入 X 平台实时数据，风格幽默毒舌。', 'chat', ['xAI', '实时', '幽默'], 'https://grok.com', 'a witty robot reading a burning newspaper, neon pink and black', 'portrait', true, 'xAI'),
  t('chat-perplexity', 'Perplexity', 'AI 答案引擎', '结合实时搜索与大模型的答案引擎，每条回答附带来源引用。', 'chat', ['搜索', '引用', '答案'], 'https://www.perplexity.ai', 'a magnifying glass over a glowing web of answers', 'square', true),
  t('chat-you', 'You.com', '可定制 AI 搜索', '提供多模型切换、可定制 Apps 的对话式搜索平台。', 'chat', ['搜索', 'Apps', '可定制'], 'https://you.com', 'a giant letter U formed by diverse human silhouettes', 'square', false),
  t('chat-poe', 'Poe', '多模型聚合聊天', 'Quora 推出的多模型聚合平台，一个入口使用 GPT、Claude、Llama 等。', 'chat', ['聚合', '多模型'], 'https://poe.com', 'a writers desk with multiple quills writing in different colors', 'landscape', false),

  // ============== IMAGE ==============
  t('img-midjourney', 'Midjourney', '艺术家首选绘画模型', '以强烈风格化与电影感闻名，活跃在 Discord 社区，是插画与概念设计的标杆。', 'image', ['绘画', '风格化', 'Discord'], 'https://www.midjourney.com', 'a surreal oil painting of a cosmic garden, bold brushstrokes, gallery lighting', 'portrait', true),
  t('img-dalle', 'DALL·E', 'OpenAI 图像生成', 'OpenAI 出品的图像生成模型，深度集成于 ChatGPT 与 Bing。', 'image', ['OpenAI', '多模态'], 'https://openai.com/dall-e-3', 'dali-esque melting clock dripping into a canvas of stars', 'square', true, 'OpenAI'),
  t('img-sd', 'Stable Diffusion', '开源绘画生态', 'Stability AI 推出的开源图像生成模型，可本地化部署并自定义微调。', 'image', ['开源', '本地', '生态'], 'https://stability.ai', 'a stable diffusion cloud of colors blooming outward', 'landscape', true),
  t('img-flux', 'FLUX', '新一代开源绘画模型', 'Black Forest Labs 推出的高质量图像生成模型，文字渲染与写实能力强。', 'image', ['开源', '高质量', '文字'], 'https://blackforestlabs.ai', 'flux of neon particles forming a portrait, black forest backdrop', 'portrait', true),
  t('img-leonardo', 'Leonardo.AI', '游戏与角色设计', '专注于游戏资产、角色设计与产品视觉的 AI 绘画平台。', 'image', ['游戏', '角色', '设计'], 'https://leonardo.ai', 'a leonardo sketch of a futuristic warrior in golden light', 'square', false),
  t('img-ideogram', 'Ideogram', '文字渲染之王', '在图像中精准渲染文字的生成模型，适合海报、Logo 与标题设计。', 'image', ['文字', '海报', 'Logo'], 'https://ideogram.ai', 'bold typography blooming into flowers, magazine cover', 'landscape', true),
  t('img-firefly', 'Adobe Firefly', '商用安全绘画', 'Adobe 推出的商用安全图像生成模型，深度集成于 Photoshop、Illustrator。', 'image', ['商用', 'Adobe', '合规'], 'https://firefly.adobe.com', 'adobe brick wall with glowing firefly sparks forming art', 'square', false, 'Adobe'),
  t('img-canva', 'Canva AI', '一键设计绘画', 'Canva 内置的 AI 绘图与设计工具，门槛低、模板丰富。', 'image', ['设计', '模板', '易用'], 'https://www.canva.com', 'a magic wand turning a sketch into a polished poster, canva style', 'portrait', false),
  t('img-recraft', 'Recraft', '矢量与品牌图像', '擅长矢量插画与品牌视觉的 AI 工具，输出可二次编辑的 SVG。', 'image', ['矢量', '品牌', 'SVG'], 'https://www.recraft.ai', 'crisp vector shapes forming a brand mark, retro futurism', 'square', false),
  t('img-krea', 'Krea', '实时可控绘画', '支持实时画布引导与 ControlNet 式精细控制的 AI 绘画工具。', 'image', ['实时', '控制', '画布'], 'https://www.krea.ai', 'a real-time painting of light trails forming a futuristic city', 'landscape', false),
  t('img-playground', 'Playground AI', '免费社区绘画', '面向 C 端的免费 AI 绘画社区，提供多种风格与模型切换。', 'image', ['免费', '社区'], 'https://playground.com', 'a colorful playground of art tools, confetti', 'square', false),
  t('img-bing', 'Bing Image Creator', '微软图像生成', '基于 DALL·E 的免费图像生成服务，集成于 Bing 与 Copilot。', 'image', ['免费', '微软'], 'https://www.bing.com/images/create', 'a giant b search bar with images blooming from it', 'portrait', false, 'Microsoft'),

  // ============== CODE ==============
  t('code-copilot', 'GitHub Copilot', 'AI 结对编程', 'GitHub 与 OpenAI 合作的代码助手，深度集成 VS Code、JetBrains 等 IDE。', 'code', ['IDE', '自动补全', 'GitHub'], 'https://github.com/features/copilot', 'a co-pilot robot writing code in a cockpit of light', 'landscape', true),
  t('code-cursor', 'Cursor', 'AI 原生编辑器', '基于 VS Code 二次开发的 AI 原生代码编辑器，支持多文件编辑与 Agent。', 'code', ['编辑器', 'Agent', 'IDE'], 'https://www.cursor.com', 'a glowing cursor in a dark code editor, holographic panels', 'portrait', true),
  t('code-cody', 'Cody', 'Sourcegraph 代码助手', '基于代码库上下文的 AI 助手，擅长仓库级理解与重构。', 'code', ['代码库', '重构'], 'https://about.sourcegraph.com/cody', 'a graph of nodes spelling code, electric blue', 'square', false),
  t('code-windsurf', 'Windsurf', 'Codeium 旗舰 IDE', 'Codeium 推出的 AI 优先 IDE，提供 Cascade Agent 与 Flows。', 'code', ['IDE', 'Agent'], 'https://codeium.com/windsurf', 'windsurf board riding a wave of code, sunset palette', 'landscape', false),
  t('code-tabnine', 'Tabnine', '隐私优先补全', '支持本地与私有部署的 AI 代码补全工具，注重代码隐私。', 'code', ['隐私', '本地', '补全'], 'https://www.tabnine.com', 'nine tabby cats typing on nine laptops, colorful', 'square', false),
  t('code-codeium', 'Codeium', '免费代码补全', '提供个人免费的 AI 代码补全与聊天服务，支持 70+ 语言。', 'code', ['免费', '多语言'], 'https://codeium.com', 'a kaleidoscope of programming language logos', 'portrait', false),
  t('code-replit', 'Replit Agent', '云端 AI 编程', 'Replit 内置的 Agent，可一句话生成完整 Web 应用并直接部署。', 'code', ['云端', '部署', 'Agent'], 'https://replit.com', 'a tiny repl island where AI builds castles, isometric', 'landscape', true),
  t('code-bolt', 'Bolt.new', '浏览器全栈生成', 'StackBlitz 推出的浏览器内全栈 AI 开发平台，一句话生成 Next.js 应用。', 'code', ['全栈', '浏览器', 'StackBlitz'], 'https://bolt.new', 'a lightning bolt striking a code editor, neon', 'square', true),
  t('code-v0', 'v0', 'Vercel UI 生成器', 'Vercel 推出的 AI UI 生成工具，专长 shadcn/ui 与 Tailwind 组件。', 'code', ['UI', 'React', 'Vercel'], 'https://v0.dev', 'v0 canvas, minimal lines forming a UI, white space', 'portrait', true, 'Vercel'),
  t('code-cline', 'Cline', '开源 AI 编程助手', 'VS Code 中的开源 AI Agent，可执行命令、编辑文件、调用 API。', 'code', ['开源', 'Agent', 'VSCode'], 'https://github.com/cline/cline', 'a cliff of code with climbing robots, retro game style', 'landscape', false),
  t('code-aider', 'Aider', '终端 AI 结对', '终端中的 AI 结对编程工具，专注于多文件编辑与 Git 集成。', 'code', ['终端', 'Git', '多文件'], 'https://aider.chat', 'a retro terminal with a helpful robot hand typing', 'square', false),
  t('code-devin', 'Devin', '首个 AI 软件工程师', 'Cognition 推出的自主软件工程 Agent，能独立完成 PR 与 Bug 修复。', 'code', ['Agent', '自主', 'SWE'], 'https://www.cognition.ai', 'a robot engineer named Devin wearing a hardhat, blueprint background', 'portrait', true, 'Cognition'),
  t('code-swe', 'SWE-agent', '开源 SWE Agent', 'Princeton 推出的开源软件工程 Agent，在 SWE-bench 表现领先。', 'code', ['开源', 'Agent', '研究'], 'https://swe-agent.com', 'a graduation cap made of code blocks, academic style', 'square', false, 'Princeton'),
  t('code-mintlify', 'Mintlify', '代码文档自动生成', '为代码库自动生成开发者文档，可嵌入 IDE 与 Web。', 'code', ['文档', 'SDK', '自动化'], 'https://mintlify.com', 'a fresh green leaf made of code, modern', 'landscape', false),

  // ============== OFFICE ==============
  t('office-notion', 'Notion AI', '全能笔记 AI', 'Notion 内置的 AI，可写作、总结、翻译、生成数据库条目。', 'office', ['笔记', '协作', 'AI'], 'https://www.notion.so/product/ai', 'a notebook page where AI sparks draw new paragraphs', 'square', true),
  t('office-365', 'Microsoft Copilot', 'Office 全家桶 AI', '深度集成 Word、Excel、PowerPoint、Outlook 的 Microsoft Copilot。', 'office', ['Office', '微软', '企业'], 'https://www.microsoft.com/microsoft-copilot', 'four windows showing word excel powerpoint outlook, holographic', 'landscape', true, 'Microsoft'),
  t('office-gamma', 'Gamma', '一键生成 PPT', '输入主题即可生成精美演示文稿的 AI 工具，支持嵌入多媒体。', 'office', ['PPT', '演示', '自动化'], 'https://gamma.app', 'a gamma ray projector displaying slides in mid-air', 'portrait', true),
  t('office-tome', 'Tome', '故事型演示', '擅长叙事性故事演示文稿的 AI 工具，模板与版式设计感强。', 'office', ['演示', '故事', '设计'], 'https://tome.app', 'an open storybook glowing with ai light', 'square', false),
  t('office-beautiful', 'Beautiful.ai', '智能排版 PPT', '自动应用设计规范的演示文稿工具，适合企业汇报。', 'office', ['PPT', '排版', '企业'], 'https://www.beautiful.ai', 'a perfectly typeset slide, balanced typography', 'portrait', false),
  t('office-deck', 'Decktopus', '对话式生成 PPT', '通过对话引导生成定制化演示文稿的 AI 工具。', 'office', ['PPT', '对话'], 'https://www.decktopus.com', 'an octopus desk drawing slides with each tentacle', 'square', false),
  t('office-slides', 'SlidesAI', 'Google Slides 插件', '一键将文本转为 Google Slides 演示文稿的 AI 插件。', 'office', ['Google', '插件', 'PPT'], 'https://www.slidesai.io', 'slides turning into origami cranes, japanese paper', 'portrait', false),
  t('office-air', 'Airgram', '会议记录与摘要', '自动记录会议并生成结构化摘要与待办事项。', 'office', ['会议', '转录', '总结'], 'https://www.airgram.io', 'floating air bubbles containing meeting notes', 'square', false),
  t('office-meetgeek', 'MeetGeek', 'AI 会议助理', '自动加入会议、录制、转录并生成可分享的会议纪要。', 'office', ['会议', '转录'], 'https://meetgeek.ai', 'a magnifying glass over a meeting room, neon teal', 'landscape', false),
  t('office-fathom', 'Fathom', '免费会议记录', '免费的 AI 会议记录工具，集成 Zoom、Teams 与 Google Meet。', 'office', ['会议', '免费'], 'https://fathom.video', 'a deep sea creature recording an underwater meeting', 'portrait', false),

  // ============== VIDEO ==============
  t('video-sora', 'Sora', 'OpenAI 视频生成', 'OpenAI 推出的文生视频旗舰模型，可生成长达 1 分钟的高质量视频。', 'video', ['OpenAI', '文生视频', '电影感'], 'https://openai.com/sora', 'a sky doorway opening into another dimension, cinematic', 'landscape', true, 'OpenAI'),
  t('video-veo', 'Veo', 'Google 文生视频', 'Google DeepMind 推出的电影级文生视频模型，支持多种风格与镜头。', 'video', ['Google', '电影', '多镜头'], 'https://deepmind.google/technologies/veo', 'a vintage film projector shooting galaxies, retro futurism', 'portrait', true, 'Google'),
  t('video-runway', 'Runway Gen-3', '视频创作者首选', 'Runway 推出的 Gen-3 Alpha 视频模型，生态成熟，工具链完善。', 'video', ['Gen-3', '工具链'], 'https://runwayml.com', 'a runway strip stretching into a painted horizon, blue hour', 'landscape', true),
  t('video-kling', '可灵', '快手视频生成', '快手推出的视频生成大模型，支持文生视频、图生视频与续写。', 'video', ['中文', '快手', '图生视频'], 'https://klingai.com', 'a chinese dragon made of film strips, dramatic lighting', 'portrait', true),
  t('video-pika', 'Pika', '可控视频编辑', '主打精细控制与编辑能力的视频生成工具，适合创作者迭代。', 'video', ['控制', '编辑'], 'https://pika.art', 'a tiny paper pikachu editing a film strip, pop art', 'square', false),
  t('video-luma', 'Dream Machine', 'Luma AI 视频生成', 'Luma AI 推出的视频生成模型，擅长物理真实感与运镜。', 'video', ['物理', '运镜'], 'https://lumalabs.ai', 'a dream machine spewing reels of golden film', 'landscape', true),
  t('video-hailuo', '海螺 AI', 'MiniMax 视频生成', 'MiniMax 推出的多模态助手，含视频生成与角色扮演。', 'video', ['中文', '多模态'], 'https://hailuoai.com', 'a giant conch shell on the beach, glowing movies inside', 'portrait', false, 'MiniMax'),
  t('video-vidu', 'Vidu', '清华系视频模型', '生数科技与清华联合推出的视频生成模型，主打长镜头一致性。', 'video', ['中文', '长镜头'], 'https://www.vidu.studio', 'a vidu bird flying over chinese ink mountains', 'landscape', false),
  t('video-pixverse', 'PixVerse', '风格化视频', '爱诗科技推出的视频生成产品，擅长多风格模板与一键成片。', 'video', ['模板', '一键'], 'https://pixverse.ai', 'a pixelverse of dancing characters, 8-bit meets baroque', 'square', false),
  t('video-higgsfield', 'Higgsfield', 'AI 真人短视频', '主打 AI 真人短视频与口播视频生成，营销场景居多。', 'video', ['真人', '营销', '口播'], 'https://higgsfield.ai', 'a higgsperson silhouette giving a TED talk, neon', 'portrait', false),
  t('video-descript', 'Descript', '文稿式视频编辑', '将视频转写为文稿，像编辑文档一样编辑视频。', 'video', ['编辑', '转录'], 'https://www.descript.com', 'a video timeline turned into a flowing paragraph', 'landscape', true),
  t('video-capcut', '剪映', '国民视频编辑器', '字节跳动出品的视频剪辑工具，集成海量 AI 能力：剪辑、字幕、配音、特效。', 'video', ['剪辑', '中文', '特效'], 'https://www.capcut.com', 'a colorful editing timeline, confetti, mobile friendly', 'square', true, 'ByteDance'),
  t('video-opus', 'OpusClip', '长视频转短视频', 'AI 自动从长视频中剪辑出病毒式传播的短视频。', 'video', ['短视频', '剪辑'], 'https://www.opus.pro', 'a giant scissor cutting a film reel into tiktok clips', 'portrait', false),
  t('video-soundraw', 'Soundraw', 'AI 视频配乐', '为视频自动生成可定制配乐的 AI 工具。', 'video', ['配乐', '版权'], 'https://soundraw.io', 'a sound wave painted as a mountain range, dusk', 'landscape', false),

  // ============== AUDIO ==============
  t('audio-suno', 'Suno', 'AI 音乐生成', '输入歌词与风格即可生成完整歌曲的 AI 音乐平台。', 'audio', ['音乐', '作曲', '唱歌'], 'https://suno.com', 'a sun made of vinyl records projecting music, golden hour', 'portrait', true),
  t('audio-udio', 'Udio', '高保真音乐生成', '由前 Google DeepMind 团队创立，专注高保真音乐生成。', 'audio', ['音乐', '高保真'], 'https://udio.com', 'a giant udio speaker shooting musical particles, dark stage', 'square', true),
  t('audio-eleven', 'ElevenLabs', 'AI 语音合成', '行业领先的 AI 语音合成与克隆平台，支持多语种与情感控制。', 'audio', ['TTS', '克隆', '配音'], 'https://elevenlabs.io', 'a chorus of golden voices radiating from a crystal orb', 'landscape', true),
  t('audio-bark', 'Bark', '开源语音生成', 'Suno 推出的开源多语种语音生成模型，支持笑声、叹息等副语言。', 'audio', ['开源', '多语种', '副语言'], 'https://github.com/suno-ai/bark', 'a bark-textured dog singing in a forest, watercolor', 'portrait', false),
  t('audio-mubert', 'Mubert', 'AI 无限配乐', '实时生成无版权音乐，适合直播、播客与内容创作。', 'audio', ['配乐', '直播'], 'https://mubert.com', 'an infinite audio river, abstract waveform', 'landscape', false),
  t('audio-aiva', 'AIVA', 'AI 古典作曲', '专注古典与电影配乐的 AI 作曲助手，可导出 MIDI。', 'audio', ['古典', '配乐', 'MIDI'], 'https://www.aiva.ai', 'a grand piano made of starry light, classical', 'portrait', false),
  t('audio-adobe-podcast', 'Adobe Podcast', 'AI 播客工作台', 'Adobe 出品的播客录制与增强工具，含 AI 降噪与转录。', 'audio', ['播客', '降噪'], 'https://podcast.adobe.com', 'a podcast studio in a chrome dome, retro future', 'square', false, 'Adobe'),

  // ============== 3D ==============
  t('3d-tripo', 'Tripo3D', 'AI 3D 一键生成', '输入文本或图片即可生成高质量 3D 模型，适合游戏与电商。', '3d', ['建模', '电商', '游戏'], 'https://www.tripo3d.ai', 'a tripo 3D printer forming a miniature city, isometric', 'portrait', true),
  t('3d-meshy', 'Meshy', '文本/图像转 3D', '面向开发者的 AI 3D 资产生成平台，支持 PBR 贴图。', '3d', ['PBR', '贴图', '游戏'], 'https://www.meshy.ai', 'a meshed wireframe glowing into a 3D sculpture', 'square', false),
  t('3d-csm', 'CSM', '图像转 3D 模型', 'Common Sense Machines 推出的图像到 3D 转换平台。', '3d', ['图像', '游戏'], 'https://www.csm.ai', 'a photo breaking into 3D pixels and re-forming', 'landscape', false),
  t('3d-rodin', 'Hyper3D Rodin', '高质量 3D 资产生成', '提供 AI 3D 资产生成与 PBR 贴图，适合工业设计与游戏。', '3d', ['资产', 'PBR'], 'https://hyper3d.ai', 'a rodin thinker statue made of polished chrome', 'portrait', false),
  t('3d-sloyd', 'Sloyd', '参数化 3D 模型', '面向游戏开发的参数化 AI 3D 模型生成平台。', '3d', ['参数化', '游戏'], 'https://www.sloyd.ai', 'a sloyd knife carving procedurally generated models', 'square', false),
  t('3d-luma-genie', 'Genie', 'Luma 3D 生成', 'Luma Labs 推出的文本到 3D 生成模型，适合概念设计。', '3d', ['概念', '设计'], 'https://lumalabs.ai', 'a genie lamp emitting 3D smoke sculptures', 'landscape', false),

  // ============== DESIGN ==============
  t('design-figma-ai', 'Figma AI', 'Figma 内置 AI', 'Figma 内置的 AI 功能，可生成 UI、命名图层、自动重命名。', 'design', ['UI', 'Figma', '插件'], 'https://www.figma.com', 'a figma canvas with AI sketching new frames', 'landscape', true),
  t('design-galileo', 'Galileo AI', '一句话生成 UI', '输入描述即可生成完整 UI 设计的 AI 工具。', 'design', ['UI', '生成'], 'https://www.usegalileo.ai', 'a galileo telescope aimed at a UI design, renaissance modern', 'portrait', true),
  t('design-uizard', 'Uizard', '草图转 UI', '将手绘草图、截图一键转换为可编辑 UI 设计。', 'design', ['草图', 'UI'], 'https://uizard.io', 'a hand sketch morphing into a polished UI, dual reality', 'square', false),
  t('design-replit', 'Relume', 'AI 网站线框', '使用 AI 快速生成网站线框与组件库，适合独立开发者。', 'design', ['线框', '网站'], 'https://www.relume.io', 'a wireframe cathedral made of light, blueprint style', 'portrait', false),
  t('design-microsoft', 'Microsoft Designer', '微软设计助手', '微软推出的 AI 设计工具，与 Copilot 生态深度集成。', 'design', ['设计', '微软'], 'https://designer.microsoft.com', 'a designer desk with holographic posters, microsoft palette', 'landscape', false, 'Microsoft'),
  t('design-framer-ai', 'Framer AI', 'AI 建站', 'Framer 推出的 AI 网站生成与发布一体化平台。', 'design', ['建站', 'Framer'], 'https://www.framer.com/ai', 'a framer picture frame that builds websites, blueprint', 'square', false),

  // ============== SEARCH ==============
  t('search-perplexity', 'Perplexity Pro', 'Pro 版答案引擎', 'Perplexity 推出的 Pro 搜索与研究助手，支持文件上传与多模型切换。', 'search', ['答案', '引用', '研究'], 'https://www.perplexity.ai', 'a magnifying glass over an ever-branching tree of answers', 'square', true),
  t('search-you', 'You.com', 'AI 搜索平台', '提供多种 AI 模式与可定制 Apps 的搜索平台。', 'search', ['Apps', '多模式'], 'https://you.com', 'a giant U arch with apps orbiting it', 'landscape', false),
  t('search-arc', 'Arc Search', 'Arc 浏览器搜索', 'Arc 浏览器内置的 AI 搜索体验，主打"为我浏览"。', 'search', ['浏览器', '为我浏览'], 'https://arc.net', 'an arc of light surfing through web pages', 'portrait', true),
  t('search-exa', 'Exa', '神经搜索 API', '面向 AI 应用的神经搜索 API，可做高质量网页检索。', 'search', ['API', '神经搜索'], 'https://exa.ai', 'an exascale neural map of the web', 'square', false),
  t('search-tavily', 'Tavily', 'AI 检索 API', '为 AI Agent 设计的搜索 API，可输出结构化结果。', 'search', ['API', 'Agent'], 'https://tavily.com', 'a tavian bird carrying structured data, in flight', 'portrait', false),

  // ============== TRANSLATE ==============
  t('trans-deepl', 'DeepL', '翻译品质天花板', '以翻译品质著称的 AI 翻译工具，支持文档整篇翻译。', 'translate', ['翻译', '文档'], 'https://www.deepl.com', 'a deep sea library with books in every language', 'landscape', true),
  t('trans-immersive', 'Immersive Translate', '双语网页翻译', '浏览器插件，提供网页、PDF 双语对照翻译。', 'translate', ['双语', 'PDF', '插件'], 'https://immersivetranslate.com', 'a webpage split into two languages, mirror worlds', 'portrait', true),
  t('trans-google', 'Google Translate', '全语种翻译', 'Google 翻译的 AI 升级版，支持 100+ 语种与图像翻译。', 'translate', ['多语种', 'Google'], 'https://translate.google.com', 'a polyglot earth with talking speech bubbles', 'square', false, 'Google'),
  t('trans-gtl', 'GT4T', '译者工作台', '面向专业译者的桌面翻译工作台，支持多引擎并行。', 'translate', ['译者', '工作台'], 'https://gt4t.cn', 'a translator desk with multiple monitors, cyberpunk', 'portrait', false),
  t('trans-matecat', 'Matecat', '协作翻译平台', '结合 TM、TB 与机器翻译的协作翻译平台。', 'translate', ['TM', '协作'], 'https://www.matecat.com', 'a collaborative cat working on translation segments', 'square', false),

  // ============== VOICE ==============
  t('voice-eleven', 'ElevenLabs Voice', '语音合成与克隆', '行业领先 AI 语音合成、克隆与多语种配音平台。', 'voice', ['TTS', '克隆'], 'https://elevenlabs.io', 'a chorus of golden voices radiating from a microphone', 'portrait', true),
  t('voice-play', 'PlayHT', 'AI 配音', '高保真 AI 配音平台，提供大量商用声音。', 'voice', ['配音', '商用'], 'https://play.ht', 'a giant play button projecting voices, retro neon', 'landscape', true),
  t('voice-lovo', 'LOVO AI', '视频配音', '面向视频与广告的 AI 配音与角色生成平台。', 'voice', ['视频配音'], 'https://lovo.ai', 'a studio mic with colorful character voices', 'square', false),
  t('voice-murf', 'Murf AI', '企业配音', '面向企业培训与营销视频的 AI 配音平台。', 'voice', ['企业', '培训'], 'https://murf.ai', 'a corporate whale speaking in perfect voice', 'portrait', false),
  t('voice-speechify', 'Speechify', '朗读助手', '将任意文本转为自然语音的朗读工具，含浏览器插件。', 'voice', ['朗读', '插件'], 'https://speechify.com', 'a speech bubble river flowing into a reader', 'landscape', false),

  // ============== EDUCATION ==============
  t('edu-khan', 'Khanmigo', '可汗学院 AI 导师', '可汗学院推出的 AI 学习导师，强调苏格拉底式引导。', 'education', ['K12', '导师'], 'https://www.khanacademy.org/khan-labs', 'a friendly mentor robot tutoring a student at a chalkboard', 'portrait', true),
  t('edu-duolingo', 'Duolingo Max', '多邻国 AI', '多邻国推出的 AI 角色扮演与解释功能，提供语言对话练习。', 'education', ['语言', '对话'], 'https://www.duolingo.com', 'a green owl conversing in many languages', 'square', true),
  t('edu-q-chian', 'Question AI', '拍照解题', '拍照搜题与讲解的 AI 学习助手。', 'education', ['拍照', '解题'], 'https://www.questionai.com', 'a magnifying lens over a homework page, scanning', 'portrait', false),
  t('edu-coursera', 'Coursera Coach', '课程 AI 教练', 'Coursera 内置的 AI 学习教练，可答疑与规划。', 'education', ['课程', '教练'], 'https://www.coursera.org', 'a graduation cap with circuit board patterns', 'landscape', false),
  t('edu-socratic', 'Socratic', 'Google 学习助手', 'Google 推出的拍照学习应用，覆盖多学科。', 'education', ['拍照', '学科'], 'https://socratic.org', 'a socratic scroll unfolding with formulas, classical', 'portrait', false, 'Google'),

  // ============== MEDICAL ==============
  t('med-paige', 'Paige', '病理 AI', '基于 AI 的癌症病理诊断平台，已在临床场景使用。', 'medical', ['病理', '诊断'], 'https://www.paige.ai', 'a microscope viewing ai-lit cancer cells, lab', 'square', true),
  t('med-babylon', 'Babylon Health', 'AI 健康问诊', '提供 AI 症状自查与在线问诊的健康管理平台。', 'medical', ['问诊', '健康'], 'https://www.babylonhealth.com', 'a friendly ai doctor stethoscope, hospital', 'portrait', false),
  t('med-hippocratic', 'Hippocratic AI', '医疗 LLM', '专注医疗领域的安全 LLM 与护理 Agent。', 'medical', ['LLM', '护理'], 'https://www.hippocraticai.com', 'a modern hippocratic oath scroll glowing, hospital green', 'landscape', true),
  t('med-glass', 'Glass', '临床记录 AI', '为医生提供 AI 临床记录与病历摘要服务。', 'medical', ['病历', '记录'], 'https://glass.health', 'a clear glass record with medical notes, neon', 'portrait', false),
  t('med-ada', 'Ada', '症状自查', '面向消费者的 AI 症状自查与导诊应用。', 'medical', ['症状', '自查'], 'https://ada.com', 'a friendly ada robot in scrubs, examination', 'square', false),

  // ============== LEGAL ==============
  t('law-harvey', 'Harvey', '法律 AI 助手', '面向顶级律所的 AI 法律助手，可检索、起草、综述。', 'legal', ['律所', '起草'], 'https://www.harvey.ai', 'a courtroom where ai projects holographic briefs', 'portrait', true),
  t('law-cohere', 'Spellbook', '合同 AI', '面向律师的合同起草与审查 AI 助手。', 'legal', ['合同', '审查'], 'https://www.spellbook.legal', 'a glowing legal spellbook on a desk, dramatic', 'square', true),
  t('law-lexis', 'Lexis+ AI', '法律检索', 'LexisNexis 推出的 AI 法律检索与问答。', 'legal', ['检索', '问答'], 'https://www.lexisnexis.com', 'a tower of legal books with ai overlay', 'landscape', false),
  t('law-westlaw', 'Westlaw', 'AI 法律研究', 'Thomson Reuters 推出的 AI 法律研究助手。', 'legal', ['研究'], 'https://legal.thomsonreuters.com', 'a gavel made of code, modern', 'portrait', false),
  t('law-casetext', 'Coca', 'Coca 案件 AI', '由 Casetext 推出的法律研究 AI，现并入 Thomson Reuters。', 'legal', ['研究'], 'https://cocai.com', 'a parallel courtroom in the cloud', 'square', false),

  // ============== FINANCE ==============
  t('fin-bloomberg', 'Bloomberg GPT', '金融大模型', 'Bloomberg 推出的金融领域大模型，深度集成终端。', 'finance', ['金融', '终端'], 'https://www.bloomberg.com', 'a bloomberg terminal glowing with financial ai', 'landscape', true),
  t('fin-alpha', 'AlphaSense', '投研 AI', '面向投研团队的 AI 市场情报与文档搜索。', 'finance', ['投研', '情报'], 'https://www.alpha-sense.com', 'a magnifying lens on financial reports, neon', 'portrait', true),
  t('fin-kensho', 'Kensho', '金融 AI', 'S&P Global 旗下的金融 AI 与数据分析平台。', 'finance', ['数据', '分析'], 'https://kensho.com', 'a kensho graph revealing market patterns, dark', 'square', false),
  t('fin-h2o', 'H2O.ai', '金融机器学习', '提供企业级机器学习与金融预测平台。', 'finance', ['机器学习', '预测'], 'https://h2o.ai', 'an h2o ocean wave of numbers, deep blue', 'landscape', false),
  t('fin-vise', 'Vise', 'AI 资管', '面向资管行业的 AI 投资组合管理平台。', 'finance', ['资管'], 'https://vise.com', 'a vise holding a portfolio, golden', 'portrait', false),

  // ============== MARKETING ==============
  t('mkt-jasper', 'Jasper', '营销文案', '面向营销团队的 AI 文案与品牌内容平台。', 'marketing', ['文案', '品牌'], 'https://www.jasper.ai', 'a jasper gemstone containing brand copy, polished', 'portrait', true),
  t('mkt-copy', 'Copy.ai', '营销自动化', '生成营销文案、邮件与社媒帖子的 AI 平台。', 'marketing', ['自动化', '文案'], 'https://www.copy.ai', 'a copier machine writing witty copy, neon', 'square', true),
  t('mkt-writesonic', 'Writesonic', 'SEO 内容', '专注 SEO 与长文的 AI 内容平台，含事实核查。', 'marketing', ['SEO', '长文'], 'https://writesonic.com', 'a sonically charged type writer, electric', 'landscape', false),
  t('mkt-surfer', 'Surfer SEO', 'SEO 优化', '基于 SERP 数据的 SEO 内容优化平台。', 'marketing', ['SEO', 'SERP'], 'https://surferseo.com', 'a surfer riding a wave of search results, beach', 'portrait', false),
  t('mkt-adcreative', 'AdCreative.ai', '广告素材', '一键生成多版本广告创意素材的 AI 平台。', 'marketing', ['广告', '素材'], 'https://www.adcreative.ai', 'a billboard lighting up with ai ads, times square', 'square', false),
  t('mkt-pencil', 'Pencil', 'AI 广告投放', '端到端 AI 广告创意与投放平台。', 'marketing', ['广告', '投放'], 'https://www.trypencil.com', 'a pencil sketching digital ads, blueprint', 'portrait', false),

  // ============== DATA ==============
  t('data-anthropic', 'Julius AI', 'AI 数据分析师', '将自然语言转为 Python/SQL 并可视化的数据分析助手。', 'data', ['分析', '可视化'], 'https://julius.ai', 'a julius caesar style marble with data dashboards', 'portrait', true),
  t('data-akkio', 'Akkio', 'AI 预测', '面向业务团队的 AI 预测与决策平台。', 'data', ['预测', '业务'], 'https://www.akkio.com', 'a crystal ball made of charts, electric', 'square', true),
  t('data-hex', 'Hex', 'AI 协作数据', '数据科学与分析的协作笔记本，内置 AI 助手。', 'data', ['协作', '笔记本'], 'https://hex.tech', 'a hexagonal data notebook glowing, dark', 'landscape', false),
  t('data-anaconda', 'Anaconda AI', '企业 AI 平台', '面向企业的 Python 数据科学与 AI 平台。', 'data', ['企业', 'Python'], 'https://www.anaconda.com', 'a giant anaconda snake made of data, jungle', 'portrait', false),
  t('data-deepnote', 'Deepnote', '协作 Notebook', '面向团队的协作 Notebook，内置 AI Copilot。', 'data', ['Notebook', '协作'], 'https://deepnote.com', 'a deep notebook of glowing data, midnight', 'square', false),

  // ============== ROBOTICS ==============
  t('robo-figure', 'Figure 01', '通用人形机器人', '由 Figure AI 研发的人形机器人，已在 BMW 工厂上岗。', 'robotics', ['人形', '工厂'], 'https://www.figure.ai', 'a humanoid robot stepping out of a blueprint, dramatic', 'portrait', true),
  t('robo-1x', '1X', '家用机器人', '1X Technologies 推出的人形家用机器人 Neo。', 'robotics', ['家用', '人形'], 'https://www.1x.tech', 'a homey humanoid doing chores, warm lighting', 'square', true),
  t('robo-boston', 'Boston Dynamics', '机器人研究先驱', 'Spot、Atlas 等明星机器人背后的公司，AI 增强自主能力。', 'robotics', ['四足', '人形', '研究'], 'https://bostondynamics.com', 'a futuristic dog-like robot on a rooftop at dawn', 'landscape', true),
  t('robo-tesla', 'Optimus', '特斯拉人形机器人', 'Tesla 推出的人形机器人 Optimus，定位大规模量产。', 'robotics', ['量产', '人形'], 'https://www.tesla.com/AI', 'a tesla robot walking through a factory, motion blur', 'portrait', true, 'Tesla'),
  t('robo-sanctuary', 'Sanctuary AI', '通用机器人智能', 'Sanctuary AI 推出的人形机器人 Phoenix 与 Carbon 模型。', 'robotics', ['通用', '模型'], 'https://www.sanctuary.ai', 'a sanctuary temple guarded by humanoid robots', 'square', false),

  // ============== AUTOMATION ==============
  t('auto-zapier', 'Zapier AI', '工作流自动化', 'Zapier 内置的 AI，可自然语言构建跨应用工作流。', 'automation', ['工作流', '跨应用'], 'https://zapier.com/ai', 'a zappy lightning rod connecting app icons, electric', 'landscape', true),
  t('auto-make', 'Make', '可视化自动化', 'Make（原 Integromat）推出的可视化自动化平台。', 'automation', ['可视化', '无代码'], 'https://www.make.com', 'a mechanical arm building blocks of automation, isometric', 'portrait', true),
  t('auto-n8n', 'n8n', '开源自动化', '可自托管的开源工作流自动化平台，AI 节点丰富。', 'automation', ['开源', '自托管'], 'https://n8n.io', 'an open workshop of automation tools, blueprint', 'square', true),
  t('auto-pipe', 'Pipedream', '开发者自动化', '面向开发者的低代码工作流平台，含数千集成。', 'automation', ['开发者', '集成'], 'https://pipedream.com', 'a pipeline of code merging into a fountain', 'portrait', false),
  t('auto-lindy', 'Lindy', 'AI 助理自动化', '让 AI 助理自动完成重复任务的平台，适合个人与团队。', 'automation', ['助理', '任务'], 'https://www.lindy.ai', 'a lindy hop of helpful robots, dance', 'square', false),
  t('auto-bardeen', 'Bardeen', '浏览器自动化', '无代码浏览器自动化与数据抓取工具。', 'automation', ['浏览器', '抓取'], 'https://www.bardeen.ai', 'a magician extracting data from a browser hat', 'portrait', false),

  // ============== AGENT ==============
  t('agent-manus', 'Manus', '通用 AI Agent', 'Butterfly Effect 推出的通用 AI Agent，可独立完成复杂任务。', 'agent', ['通用', '任务'], 'https://manus.im', 'a glowing manuscript where ai agents run free', 'landscape', true),
  t('agent-devin', 'Devin', '自主软件工程师', 'Cognition 推出的自主软件工程 Agent，可端到端完成 PR。', 'agent', ['SWE', '自主'], 'https://www.cognition.ai', 'a robot engineer named Devin at a workstation', 'portrait', true),
  t('agent-autogpt', 'AutoGPT', '自主 Agent 鼻祖', '最早爆火的自主 AI Agent，可自设目标并执行。', 'agent', ['自主', '目标'], 'https://agpt.co', 'a self-driving robot car, retro future', 'square', true),
  t('agent-langchain', 'LangChain', 'Agent 开发框架', '构建 LLM 应用与 Agent 的主流开源框架。', 'agent', ['框架', '开源'], 'https://www.langchain.com', 'a chain of thoughts, a metal chain floating in ai light', 'landscape', true),
  t('agent-llamaindex', 'LlamaIndex', '数据接入 Agent', '将私有数据接入 LLM 与 Agent 的开源框架。', 'agent', ['数据', 'RAG'], 'https://www.llamaindex.ai', 'a llama index of data folders, neon', 'portrait', false),
  t('agent-coze', 'Coze', '扣子 Agent 平台', '字节跳动推出的 AI Agent 构建与发布平台。', 'agent', ['构建', '发布', '中文'], 'https://www.coze.com', 'a tiny button that deploys an army of agents', 'square', true, 'ByteDance'),
  t('agent-reka', 'Reka', '多模态 Agent', 'Reka 推出的多模态 Agent 平台，支持语音、视频、文本。', 'agent', ['多模态'], 'https://www.reka.ai', 'a reka constellation forming a brain, multicolor', 'landscape', false),
  t('agent-mistral', 'Mistral Agents', '欧洲 Agent 生态', 'Mistral 提供的 Agent 框架与 API，支持函数调用与编排。', 'agent', ['欧洲', '编排'], 'https://docs.mistral.ai', 'a mistral wind orchestrating gears, blueprint', 'portrait', false),

  // ============== OPEN SOURCE ==============
  t('oss-hugging', 'Hugging Face', '开源模型社区', '全球最大的开源模型、数据集与 Spaces 社区。', 'open-source', ['社区', '模型'], 'https://huggingface.co', 'a giant yellow hugging robot emoji face, friendly', 'landscape', true),
  t('oss-ollama', 'Ollama', '本地大模型运行', '一行命令在本地运行 Llama、Mistral、Phi 等开源大模型。', 'open-source', ['本地', 'CLI'], 'https://ollama.com', 'a friendly llama running on a laptop, golden', 'portrait', true),
  t('oss-lmstudio', 'LM Studio', '本地大模型 GUI', '桌面端本地运行与探索开源大模型的图形界面。', 'open-source', ['GUI', '本地'], 'https://lmstudio.ai', 'a cozy desktop studio with a llama painting, retro', 'square', true),
  t('oss-llama-cpp', 'llama.cpp', 'C++ 推理引擎', '在 CPU/本地硬件高效推理 Llama 系列的开源 C++ 引擎。', 'open-source', ['C++', '推理'], 'https://github.com/ggerganov/llama.cpp', 'cpp gears turning a llama into a robot, blueprint', 'portrait', false),
  t('oss-vllm', 'vLLM', '高吞吐推理', '面向生产的高吞吐、低延迟 LLM 推理引擎。', 'open-source', ['推理', '生产'], 'https://vllm.ai', 'a vllm rocket launching data, magenta', 'landscape', false),
  t('oss-mlx', 'MLX', 'Apple Silicon 框架', 'Apple 推出的开源机器学习框架，深度优化 Apple Silicon。', 'open-source', ['Apple', '优化'], 'https://ml-explore.github.io/mlx', 'an apple made of circuits glowing, modern', 'portrait', false, 'Apple'),
  t('oss-langchain-oss', 'LangChain OSS', '开源 LLM 编排', 'LangChain 的开源版本，构建可组合的 LLM 应用。', 'open-source', ['编排'], 'https://github.com/langchain-ai/langchain', 'a chain of gears spelling code, open', 'square', false),
  t('oss-ragflow', 'RAGFlow', '开源 RAG 引擎', '基于深度文档理解的端到端开源 RAG 引擎。', 'open-source', ['RAG', '文档'], 'https://ragflow.io', 'a flow of documents merging into answers, dark', 'portrait', false),

  // ============== 补足：CHAT 扩展 ==============
  t('chat-lechat', 'Le Chat Mistral', 'Mistral 官方对话', 'Mistral AI 推出的对话产品，强调速度与简洁。', 'chat', ['Mistral', '法语'], 'https://chat.mistral.ai', 'a mistral horse galloping through a data center, electric blue', 'portrait', false, 'Mistral'),
  t('chat-01', '01.AI', 'Yi 大模型对话', '零一万物推出的 Yi 系列大模型对话入口。', 'chat', ['中文', '开源'], 'https://01.ai', 'a giant 0 and 1 forming a brain, neon', 'square', false),
  t('chat-zhipu', '智谱清言', 'GLM 对话', '智谱 AI 推出的 GLM 系列对话产品。', 'chat', ['GLM', '中文'], 'https://chatglm.cn', 'a chinese knot forming a brain, crimson', 'portrait', false),
  t('chat-abab', 'MiniMax', 'abab 对话', 'MiniMax 推出的 abab 大模型对话产品。', 'chat', ['中文', '多模态'], 'https://chat.minimaxi.com', 'a neon 555 forming a mind, futurism', 'square', false, 'MiniMax'),

  // ============== 补足：IMAGE 扩展 ==============
  t('img-tongyi', '通义万相', '阿里文生图', '阿里通义大模型旗下的图像生成产品。', 'image', ['阿里', '中文'], 'https://tongyi.aliyun.com/wanxiang', 'a chinese ink painting with neon light leaks', 'portrait', false, 'Alibaba'),
  t('img-wenxin', '文心一格', '百度文生图', '百度推出的图像生成产品。', 'image', ['百度', '中文'], 'https://yige.baidu.com', 'a baidu lantern projecting art, red', 'square', false, 'Baidu'),
  t('img-baidu', 'Baidu AI Art', '百度 AI 艺术', '百度艺术与图像生成能力集合入口。', 'image', ['百度'], 'https://ai.baidu.com', 'a baidu search bar blooming into art', 'portrait', false, 'Baidu'),

  // ============== 补足：CODE 扩展 ==============
  t('code-marsx', 'MarsX', 'AI 应用拼装', '无代码 + AI 组合开发应用的平台。', 'code', ['无代码'], 'https://marsx.dev', 'a red planet where code meteors build apps', 'landscape', false),
  t('code-screenshot', 'Screenshot-to-Code', '截图转代码', '开源的截图一键转代码工具。', 'code', ['截图', '开源'], 'https://github.com/abi/screenshot-to-code', 'a screenshot melting into html tags, retro', 'portrait', false),

  // ============== 补足：OFFICE 扩展 ==============
  t('office-rows', 'Rows', 'AI 表格', 'AI 增强的在线电子表格，可一键接入数据源。', 'office', ['表格', '数据'], 'https://rows.com', 'a spreadsheet glowing with ai formulas, dark', 'square', false),
  t('office-arcwise', 'Arcwise', 'AI 表格助手', '面向 Google Sheets 的 AI 公式与数据洞察助手。', 'office', ['Google', '公式'], 'https://arcwise.app', 'a wise arc over a spreadsheet, neon', 'portrait', false),

  // ============== 补足：VIDEO 扩展 ==============
  t('video-domino', 'Domo AI', '动漫风格视频', '将视频转为多种动漫/艺术风格的工具。', 'video', ['风格化'], 'https://domoai.app', 'a domino game where each piece is an anime still', 'portrait', false),
  t('video-gling', 'Gling', 'AI 剪片', '自动剪掉视频中的沉默与重复，专注 YouTuber。', 'video', ['剪辑', 'YouTuber'], 'https://gling.ai', 'a pair of scissors removing dead air, bright', 'landscape', false),

  // ============== 补足：AUDIO 扩展 ==============
  t('audio-boomy', 'Boomy', 'AI 创作发行', '生成音乐并直接发行到流媒体平台的 AI 工具。', 'audio', ['发行', '音乐'], 'https://boomy.com', 'a boombox generating music, retro', 'portrait', false),
  t('audio-endel', 'Endel', 'AI 音景', '基于生理数据生成个性化音景的 AI 应用。', 'audio', ['音景', '健康'], 'https://endel.io', 'an audio landscape shaped by ai waves', 'landscape', false),

  // ============== 补足：3D 扩展 ==============
  t('3d-kaedim', 'Kaedim', '图转 3D', '将 2D 图像转为可编辑 3D 模型的工具。', '3d', ['图像', '建模'], 'https://www.kaedim3d.com', 'a 2d image unfolding into 3d geometry, blueprint', 'portrait', false),

  // ============== 补足：DESIGN 扩展 ==============
  t('design-kittl', 'Kittl', 'AI 平面设计', '面向平面设计师的 AI 协作平台。', 'design', ['平面', '协作'], 'https://www.kittl.com', 'a colorful kittel apron with vector tools', 'square', false),

  // ============== 补足：SEARCH 扩展 ==============
  t('search-komo', 'Komo', 'AI 搜索', '无广告、引用透明的 AI 搜索引擎。', 'search', ['无广告'], 'https://komo.ai', 'a komodo dragon reading a web page', 'portrait', false),

  // ============== 补足：TRANSLATE 扩展 ==============
  t('trans-microsoft', 'Microsoft Translator', '微软翻译', '微软推出的多语种翻译 API 与应用。', 'translate', ['企业', 'API'], 'https://translator.microsoft.com', 'a microsoft window showing every language, color', 'landscape', false, 'Microsoft'),

  // ============== 补足：EDUCATION 扩展 ==============
  t('edu-magic', 'MagicSchool', '教师 AI', '面向 K12 教师的 AI 课程与教案助手。', 'education', ['教师', '教案'], 'https://www.magicschool.ai', 'a magic school where ai teaches, crayon', 'square', false),

  // ============== 补足：MEDICAL 扩展 ==============
  t('med-suki', 'Suki AI', '医生语音助手', '面向医生的 AI 语音病历助手。', 'medical', ['语音', '病历'], 'https://www.suki.ai', 'a stethoscope shaped like a microphone, hospital', 'portrait', false),

  // ============== 补足：FINANCE 扩展 ==============
  t('fin-toggle', 'Toggle AI', '投研助手', '面向投资经理的 AI 投研与组合分析。', 'finance', ['投研'], 'https://www.toggle.ai', 'a toggle switch selecting market data, neon', 'square', false),

  // ============== 补足：MARKETING 扩展 ==============
  t('mkt-market', 'MarketMuse', '内容策略', '基于 AI 的内容策略与选题平台。', 'marketing', ['内容', '策略'], 'https://www.marketmuse.com', 'a museum of content strategies, modern', 'portrait', false),

  // ============== 补足：DATA 扩展 ==============
  t('data-chatbi', 'ChatBI', '对话 BI', '用自然语言进行 BI 问答的平台。', 'data', ['BI', '对话'], 'https://www.chatbi.com', 'a business intelligence brain in a chat bubble', 'landscape', false),

  // ============== 补足：ROBOTICS 扩展 ==============
  t('robo-apptronik', 'Apptronik', '人形机器人', 'Apptronik 推出的人形机器人 Apollo，定位工业。', 'robotics', ['工业', '人形'], 'https://apptronik.com', 'a greek apollo statue walking in a factory', 'portrait', false),

  // ============== 补足：OPEN-SOURCE 扩展 ==============
  t('oss-llama3', 'Llama 3', 'Meta 开源旗舰', 'Meta 推出的开源大模型系列 Llama 3。', 'open-source', ['Llama', 'Meta'], 'https://llama.meta.com', 'a llama made of meta blue circuitry', 'portrait', true, 'Meta'),
  t('oss-mistral-7b', 'Mistral 7B', 'Mistral 开源', 'Mistral AI 推出的高性能开源 7B 模型。', 'open-source', ['7B', 'Mistral'], 'https://mistral.ai', 'a mistral wind blowing through circuits, blue', 'square', false, 'Mistral'),
  t('oss-qwen2', 'Qwen 2', '通义千问开源', '阿里推出的开源 Qwen 2 系列模型。', 'open-source', ['Qwen', '阿里'], 'https://qwen.alibaba.com', 'a thousand questions forming a qwen bird', 'landscape', false, 'Alibaba')
]

// 把"全部"特殊处理：用于计数
export const TOOLS_TOTAL = TOOLS.length
