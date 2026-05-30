export interface ConceptSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
}

export interface LaunchPlatform {
  name: string;
  logo: string;
  url: string;
  tier: string;
  bandwidth: string;
  buildTime: string;
  buildCount: string;
  domain: string;
  cnAccess: string;
  ssl: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  deployCmd: string;
  pricing: string;
}

export interface LaunchStep {
  phase: string;
  title: string;
  steps: string[];
  duration: string;
}

export const conceptSections: ConceptSection[] = [
  {
    id: "philosophy",
    title: "设计哲学",
    subtitle: "DESIGN PHILOSOPHY",
    content:
      "本提示词系统的核心哲学是「双重性对话」——在每一组设计决策中植入传统与现代、秩序与混沌、保存与解构的对立统一。方案A代表「档案保存者」的视角：精确、有序、忠实还原，如同博物馆研究员用镊子夹起一片瓷片放入恒温展柜。方案B代表「数字考古者」的视角：解构、重组、故障美学，如同在废墟中扫描碎片并用算法重建失落的信息。两套提示词并非优劣之分，而是同一主题的两种认知路径——一种试图完美保存，另一种试图创造性解读。这种双重性本身即是对青花瓷这一媒介的致敬：釉下彩的蓝在烧制过程中同样经历不可控的窑变，每一次出窑都是保存与变异的共存。",
    tags: ["双重性", "传统×现代", "保存×解构", "窑变隐喻"],
  },
  {
    id: "methodology",
    title: "方法论框架",
    subtitle: "METHODOLOGY FRAMEWORK",
    content:
      "提示词构建采用「7层递进法」：①本体层（Subject）定义核心视觉对象及其几何属性；②纹饰层（Pattern）定义文化符号系统及其与本体几何的映射关系；③风格层（Style）定义整体美学倾向和色彩体系；④构图层（Composition）定义空间布局和信息架构；⑤浮动层（Floating）定义动态注释元素和UI碎片；⑥文字层（Typography）定义标题、标签和辅助文字的排版规则；⑦装饰层（Decoration）定义角括号、圆点、边框等视觉标点。每一层都是独立可替换的模块——更换纹饰层即可将青花瓷替换为粉彩或珐琅彩，更换风格层即可将离线档案替换为赛博朋克或新艺术运动。这种模块化设计使提示词系统具备可扩展性和可复用性。",
    tags: ["7层递进法", "模块化", "可替换层", "可扩展"],
  },
  {
    id: "dual-strategy",
    title: "双策略分化逻辑",
    subtitle: "DUAL STRATEGY DIVERGENCE",
    content:
      "方案A与方案B在第③风格层和第④构图层产生关键分化。方案A坚持「对称展板式」构图和「后数字保存」风格，追求视觉秩序和信息完整性——12栏网格、中央60%主体区、左右各15%信息面板、3%图标工具栏，每一像素都有其网格归属。方案B采用「非对称编辑版面」构图和「粗野主义档案」风格，追求视觉张力和阅读体验——黄金分割点偏移、右侧1/3文字列、几何覆层注释、色调反转窗口，刻意制造不平衡以激发观看者的主动解读。在纹饰层，方案A忠实还原传统缠枝莲和海水纹，方案B则将同一纹饰经数字故障透镜处理——扫描线中断、像素偏移、数据损坏覆层——这是对「窑变」概念的数字化转译：不可控的变异不再是缺陷，而是特征。",
    tags: ["对称×非对称", "秩序×张力", "忠实×故障", "窑变数字化"],
  },
  {
    id: "color-theory",
    title: "色彩理论",
    subtitle: "COLOR THEORY",
    content:
      "两套方案共享「灰阶+单色强调」的色彩约束，但在灰阶色温和蓝色域上产生分化。方案A采用暖灰阶（#f0eeeb底调），模拟成都潮湿雾气的氛围，钴蓝色域从#1a3a6b到#a8c8e8，忠实还原传统青花料的发色范围。方案B采用冷灰阶（蓝灰底调），配合靛蓝到电光青的更广色域，暗示数字屏幕的色域而非窑火的色域。这一差异的深层逻辑：方案A的蓝来自矿物钴料在1280°C还原焰中的发色——这是地球化学的色彩；方案B的蓝来自sRGB色域中#1a3a6b到#00e5ff的像素映射——这是算法的色彩。同一主题，两种色彩来源，两种认知体系。",
    tags: ["暖灰×冷灰", "钴蓝×电光青", "矿物色×算法色", "单色约束"],
  },
  {
    id: "spatial-logic",
    title: "空间逻辑",
    subtitle: "SPATIAL LOGIC",
    content:
      "方案A的空间逻辑是「展柜式」——所有元素如同博物馆展柜中的标本，有固定的陈列位置、标签和编号。深度通过纸质层叠和柔和阴影实现，暗示物理档案的触感。方案B的空间逻辑是「桌面式」——如同设计师的工作桌面，文件重叠、旋转、部分遮挡，创造一种「正在被使用」的动态感。几何覆层（圆、三角、方形）不是装饰，而是分析工具——如同建筑图纸上的红线批注。毛边和咖啡环水印进一步强化「物理接触」的痕迹。两种空间逻辑的区别在于：方案A的空间是「被整理过的」，方案B的空间是「正在被研究的」。",
    tags: ["展柜式×桌面式", "被整理×被研究", "层叠深度×覆层注释", "触感痕迹"],
  },
  {
    id: "cultural-encoding",
    title: "文化编码",
    subtitle: "CULTURAL ENCODING",
    content:
      "成都主题的植入采用「低频编码」策略——不出现任何直白的成都符号（无火锅、无宽窄巷子、无熊猫大图），而是通过氛围和隐喻传递地域信息。方案A的编码路径：竹叶水印（2%不透明度）→自然植被暗示；「产地:蜀」元数据→历史地理标记；灰阶暖色调→盆地气候体感；8px熊猫线描→需要放大才能识别的彩蛋。方案B的编码路径：四川盆地等高线→地理拓扑；「蜀道」文字列条目→文化路径；蜀锦织纹覆层→纺织工艺关联。两种编码的区别：方案A是「氛围式」的——你感受到成都但说不清为什么；方案B是「文本式」的——你可以读到成都但需要主动联想。",
    tags: ["低频编码", "氛围式×文本式", "竹叶×等高线", "隐喻传递"],
  },
  {
    id: "prompt-engineering",
    title: "提示词工程策略",
    subtitle: "PROMPT ENGINEERING STRATEGY",
    content:
      "方案A采用「密集描述式」策略——将所有视觉参数以自然语言段落连续输出，依靠AI模型的语言理解能力将描述性文本转化为视觉输出。优势：兼容性最强（Midjourney、Stable Diffusion、DALL·E均支持），无需特殊语法。劣势：参数优先级不明确，AI可能忽略后半段的细节。方案B采用「关键词冲击式」策略——在连续描述中嵌入更多专业术语和视觉指令（如「brutalist」「glitch lens」「tonal inversion」），利用AI模型对特定风格词的高敏感度引导输出方向。优势：风格词权重高，更容易获得目标美学。劣势：对模型版本敏感，不同模型对同一风格词的理解可能不同。两套方案均提供反向提示词（Negative Prompt），用于排除不期望出现的视觉元素，这是控制输出质量的第二道防线。",
    tags: ["密集描述×关键词冲击", "兼容性×敏感度", "反向提示词", "双防线"],
  },
  {
    id: "extensibility",
    title: "可扩展性设计",
    subtitle: "EXTENSIBILITY DESIGN",
    content:
      "本提示词系统的7层架构设计为即插即用式扩展预留了接口。纹饰层替换：将青花瓷纹饰替换为粉彩（Fencai）纹饰——修改蓝色域为粉彩色域（#e8a0b0, #b0d8e8, #f0e0a0），将缠枝莲替换为折枝花卉，将冰裂纹替换为开片纹。风格层替换：将离线档案替换为赛博朋克——修改灰阶为霓虹暗色，将纸质标签替换为全息投影标签，将技术网格替换为电路板图案。构图层替换：将展板式替换为杂志封面式——修改12栏网格为黄金螺旋布局，将信息面板替换为头条区，将角括号替换为出血线。文化层替换：将成都替换为京都——修改竹叶为枫叶，将蜀道改为茶道，将盆地等高线改为盆地庭院平面图。每一次替换都是一次新的创作，而7层架构保证了替换的局部性和可控性。",
    tags: ["7层即插即用", "粉彩替换", "赛博朋克替换", "京都替换"],
  },
];

export const launchPlatforms: LaunchPlatform[] = [
  {
    name: "Cloudflare Pages",
    logo: "☁️",
    url: "https://pages.cloudflare.com",
    tier: "免费版 / Free",
    bandwidth: "无限",
    buildTime: "500次/月",
    buildCount: "500次/月",
    domain: "yourname.pages.dev",
    cnAccess: "优秀 — 香港/首尔/东京等亚洲边缘节点，国内访问最快最稳定",
    ssl: "免费自动",
    pros: [
      "无限带宽，零流量成本",
      "全球300+城市CDN节点，国内访问友好",
      "Workers边缘计算集成",
      "R2存储无出口费",
      "免费DDoS防护和WAF",
      "支持Docker容器（2026新功能）",
    ],
    cons: [
      "构建速度偶尔不如Vercel快",
      "Next.js需OpenNext适配器",
      "开发者体验不如Vercel精致",
      "免费版Workers CPU限制50ms",
    ],
    bestFor: "高流量静态站、国内用户为主、追求性价比",
    deployCmd: "npx wrangler pages deploy ./dist",
    pricing: "免费版无限带宽；付费版$20/月",
  },
  {
    name: "Vercel",
    logo: "▲",
    url: "https://vercel.com",
    tier: "Hobby免费 / Pro $20/月",
    bandwidth: "100 GB/月",
    buildTime: "6000分钟/月",
    buildCount: "无限",
    domain: "yourname.vercel.app",
    cnAccess: "较差 — *.vercel.app已被屏蔽，自定义域名国内访问不稳定",
    ssl: "免费自动",
    pros: [
      "最佳Next.js/React开发体验",
      "零配置自动部署",
      "Fluid Compute节省95%成本",
      "预览部署+协作工具",
      "边缘函数冷启动优化",
      "Analytics和监控集成",
    ],
    cons: [
      "国内访问是硬伤",
      "Hobby版禁止商业用途",
      "Pro版超量后$0.15/GB带宽费",
      "大规模使用成本高",
    ],
    bestFor: "Next.js全栈项目、海外用户为主、追求开发体验",
    deployCmd: "npx vercel --prod",
    pricing: "Hobby免费(100GB)；Pro $20/月(1TB)",
  },
  {
    name: "Netlify",
    logo: "🚀",
    url: "https://www.netlify.com",
    tier: "免费版 / Personal $9/月",
    bandwidth: "100 GB/月",
    buildTime: "300分钟/月(信用点制)",
    buildCount: "无限",
    domain: "yourname.netlify.app",
    cnAccess: "一般 — 比Vercel稍好，但不如Cloudflare",
    ssl: "免费自动",
    pros: [
      "拖拽上传部署（无需Git）",
      "内置表单处理（无需后端）",
      "A/B测试功能",
      "分支预览部署",
      "Build Plugin生态系统",
      "支持商业用途（免费版也允许）",
    ],
    cons: [
      "构建时间免费额度较少",
      "2025年9月改为信用点计费，不直观",
      "Next.js支持需适配器",
      "国内访问速度一般",
    ],
    bestFor: "需要表单功能、Jamstack项目、非技术用户",
    deployCmd: "npx netlify-cli deploy --prod",
    pricing: "免费(300信用点)；Personal $9/月(1000信用点)",
  },
  {
    name: "GitHub Pages",
    logo: "🐙",
    url: "https://pages.github.com",
    tier: "完全免费",
    bandwidth: "100 GB/月",
    buildTime: "10分钟/次",
    buildCount: "10次/小时",
    domain: "yourname.github.io",
    cnAccess: "一般 — 国内访问速度不稳定",
    ssl: "需手动配置",
    pros: [
      "完全免费，无付费版本",
      "与GitHub深度集成",
      "支持Jekyll自动构建",
      "开源项目首选",
    ],
    cons: [
      "构建限制严格（10次/小时）",
      "不支持服务端代码",
      "功能最基础",
      "自定义域名SSL需手动配置",
    ],
    bestFor: "开源项目主页、个人博客、简单静态站",
    deployCmd: "git push origin main",
    pricing: "完全免费",
  },
  {
    name: "腾讯云CloudBase",
    logo: "☁️",
    url: "https://cloud.tencent.com/product/tcb",
    tier: "按量付费（免费额度）",
    bandwidth: "5 GB/月（免费）",
    buildTime: "—",
    buildCount: "—",
    domain: "自定义域名",
    cnAccess: "极佳 — 北上广深成5大可用区+200+CDN边缘节点",
    ssl: "免费自动",
    pros: [
      "国内节点覆盖最全",
      "ICP备案辅导（控制台一键提交）",
      "云函数+数据库+AI模板即用",
      "微信/QQ内可直接打开",
      "全栈无缝升级",
    ],
    cons: [
      "免费额度较小（5GB流量/月）",
      "超量后0.21元/GB",
      "需ICP备案",
      "绑定腾讯云生态",
    ],
    bestFor: "国内用户为主、需备案、需Serverless扩展",
    deployCmd: "tcb hosting deploy -e envId",
    pricing: "免费1GB存储+5GB流量；超量0.21元/GB",
  },
];

export interface DomesticPlatform {
  name: string;
  logo: string;
  url: string;
  category: string;
  coreProduct: string;
  cnNodes: string;
  freeQuota: string;
  icpSupport: string;
  ssl: string;
  cdnNodes: string;
  deployCmd: string;
  pricing: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  serverless: string;
  ecosystem: string;
}

export const domesticPlatforms: DomesticPlatform[] = [
  {
    name: "腾讯云 CloudBase",
    logo: "☁️",
    url: "https://cloud.tencent.com/product/tcb",
    category: "云开发平台",
    coreProduct: "云开发 CloudBase + 静态网站托管",
    cnNodes: "北上广深成5大可用区 + 200+CDN边缘节点",
    freeQuota: "3000资源点/月（免费体验版），含1GB存储+5GB流量",
    icpSupport: "✅ 控制台一键提交ICP备案",
    ssl: "免费自动（Let's Encrypt）",
    cdnNodes: "2000+国内CDN节点",
    deployCmd: "tcb hosting deploy -e envId",
    pricing: "免费体验版0元/月；个人版5.9元/月起",
    pros: [
      "国内节点覆盖最全，首包时间<50ms",
      "ICP备案辅导，微信/QQ内可直接打开",
      "云函数+数据库+AI模板即用，全栈无缝升级",
      "CLI一行命令部署，2分钟全球CDN预热",
      "资源点计费模式灵活，用多少扣多少",
      "与微信小程序生态深度集成",
    ],
    cons: [
      "免费额度较小（5GB流量/月）",
      "超量后0.21元/GB，高流量场景成本上升",
      "需ICP备案（国内域名必需）",
      "绑定腾讯云生态，迁移成本较高",
    ],
    bestFor: "国内用户为主、需备案、微信生态、全栈Serverless扩展",
    serverless: "云函数（Node.js/Python/PHP）+ 云数据库 + 云存储",
    ecosystem: "微信小程序、腾讯云COS、TDSQL、混元大模型",
  },
  {
    name: "阿里云 OSS + CDN",
    logo: "🟠",
    url: "https://www.aliyun.com/product/oss",
    category: "对象存储 + CDN",
    coreProduct: "对象存储OSS + CDN加速 + 函数计算FC",
    cnNodes: "华北/华东/华南/西南多可用区 + 2800+CDN节点",
    freeQuota: "新用户免费额度：50GB存储3个月 + CDN流量包",
    icpSupport: "✅ 阿里云备案系统（国内最成熟）",
    ssl: "免费DV证书 + 自动续签",
    cdnNodes: "2800+全球节点，国内覆盖所有省份",
    deployCmd: "ossutil cp -r ./dist oss://bucket-name/ --force",
    pricing: "OSS标准存储0.12元/GB/月；CDN流量0.24元/GB起",
    pros: [
      "市场份额第一，产品矩阵最完整",
      "全球化布局优秀，东南亚/欧洲节点优化",
      "传输加速功能，跨国上传速度快30-40%",
      "函数计算FC支持SSR/SSG自动化部署",
      "云效DevOps平台集成CI/CD",
      "图片处理API功能强大（缩略/水印/格式转换）",
    ],
    cons: [
      "无免费无限额度，所有资源按量计费",
      "低频存储有30天最短保留期限制",
      "配置复杂度较高（OSS+CDN+FC需分别配置）",
      "需ICP备案",
    ],
    bestFor: "企业级项目、全球化布局、需图片处理、阿里云生态用户",
    serverless: "函数计算FC（Node.js/Python/Java/Go）+ API网关",
    ecosystem: "阿里云全家桶、云效DevOps、通义千问、PolarDB",
  },
  {
    name: "华为云 OBS + CDN",
    logo: "🔴",
    url: "https://www.huaweicloud.com/product/obs.html",
    category: "对象存储 + CDN",
    coreProduct: "对象存储OBS + CDN加速 + FunctionGraph",
    cnNodes: "全国多可用区 + 2000+国内CDN节点",
    freeQuota: "新用户12个月免费：50GB OBS + CDN流量包",
    icpSupport: "✅ 华为云备案系统",
    ssl: "免费证书 + 自动续签",
    cdnNodes: "2000+国内节点，全网带宽180Tbps",
    deployCmd: "obsutil cp -r ./dist obs://bucket-name/ -f",
    pricing: "OBS标准存储0.099元/GB/月；CDN流量0.20元/GB起",
    pros: [
      "政企信创适配最优，全栈自研（鲲鹏+昇腾+EulerOS）",
      "CDN国内节点2000+，覆盖所有省份运营商",
      "AICache技术，缓存命中率高",
      "新用户12个月免费额度充足",
      "ModelArts AI平台集成",
      "GaussDB自研数据库能力强",
    ],
    cons: [
      "免费额度仅12个月，到期后需付费",
      "开发者体验不如阿里云/腾讯云",
      "海外节点相对较少",
      "生态工具链不如阿里云丰富",
      "需ICP备案",
    ],
    bestFor: "政企项目、信创要求、国产化替代、华为生态",
    serverless: "FunctionGraph（Node.js/Python/Java）+ APIG网关",
    ecosystem: "华为云全家桶、DevCloud、ModelArts、GaussDB",
  },
  {
    name: "七牛云 Kodo + CDN",
    logo: "🟣",
    url: "https://www.qiniu.com/products/kodo",
    category: "对象存储 + CDN",
    coreProduct: "对象存储Kodo + CDN加速 + 云函数",
    cnNodes: "华东/华北多可用区 + 融合CDN",
    freeQuota: "每月10GB存储 + 10GB CDN流量（长期免费）",
    icpSupport: "✅ 支持备案",
    ssl: "免费证书 + 自动续签",
    cdnNodes: "融合CDN（多厂商节点）",
    deployCmd: "qshell qupload2 --src-dir=./dist --bucket=bucket-name",
    pricing: "存储0.148元/GB/月；CDN流量0.29元/GB起",
    pros: [
      "长期免费额度（10GB存储+10GB流量/月）",
      "价格实惠，对成本敏感用户友好",
      "融合CDN多厂商节点，稳定性好",
      "丰富的API和SDK，自动化部署方便",
      "图片/音视频处理能力强",
      "Webhook触发部署，CI/CD集成简单",
    ],
    cons: [
      "免费额度较小，高流量不够用",
      "节点覆盖不如阿里云/华为云广",
      "Serverless能力较弱",
      "控制台体验不如大厂",
      "需ICP备案",
    ],
    bestFor: "成本敏感、中小型项目、音视频处理、个人开发者",
    serverless: "云函数（轻量级）",
    ecosystem: "七牛云全家桶、Pandora数据分析平台",
  },
  {
    name: "又拍云 USS + CDN",
    logo: "🟢",
    url: "https://www.upyun.com/products/oss",
    category: "对象存储 + CDN",
    coreProduct: "云存储USS + CDN加速",
    cnNodes: "全国多节点 + 融合CDN",
    freeQuota: "联盟计划：网站底部标注又拍云可获免费CDN额度",
    icpSupport: "✅ 支持备案",
    ssl: "免费证书",
    cdnNodes: "融合CDN多厂商节点",
    deployCmd: "upx sync ./dist /",
    pricing: "存储0.12元/GB/月；CDN流量0.29元/GB起",
    pros: [
      "联盟计划可获免费CDN额度",
      "API/SDK丰富，自动化部署方便",
      "支持HTTP/2和HTTPS",
      "图片处理功能完善",
      "价格透明，无隐藏费用",
    ],
    cons: [
      "免费额度需联盟计划（需标注品牌）",
      "Serverless能力基本无",
      "节点覆盖不如大厂",
      "社区和文档不如大厂完善",
      "需ICP备案",
    ],
    bestFor: "个人博客、小型展示站、成本极度敏感",
    serverless: "无原生Serverless",
    ecosystem: "又拍云CDN、图片处理、视频转码",
  },
  {
    name: "Coding Pages",
    logo: "🔷",
    url: "https://coding.net/pages",
    category: "代码托管内置",
    coreProduct: "Coding Pages（腾讯云旗下）",
    cnNodes: "国内服务器",
    freeQuota: "免费版提供基础Pages服务",
    icpSupport: "✅ 支持备案",
    ssl: "免费自动",
    cdnNodes: "腾讯云CDN节点",
    deployCmd: "git push coding main",
    pricing: "免费版0元；团队版按需",
    pros: [
      "国内访问速度快，服务器在国内",
      "与Git集成紧密，push即部署",
      "支持CI/CD流水线",
      "免费版即可使用",
      "腾讯云旗下，可无缝对接腾讯云服务",
    ],
    cons: [
      "免费版功能有限制",
      "自定义域名需备案",
      "构建速度不如Vercel",
      "生态不如GitHub丰富",
    ],
    bestFor: "国内个人博客、开源项目文档、学生项目",
    serverless: "无原生Serverless（可对接腾讯云SCF）",
    ecosystem: "Coding DevOps、腾讯云COS、SCF",
  },
];

export const launchSteps: LaunchStep[] = [
  {
    phase: "第一阶段",
    title: "代码准备与构建优化",
    steps: [
      "运行 npm run build 确认生产构建无错误",
      "检查 dist/ 目录产物大小，优化图片和字体资源",
      "确认 vite.config.ts 中 base 路径配置正确",
      "添加 .nojekyll 文件防止GitHub Pages忽略下划线文件",
      "配置 robots.txt 和 sitemap.xml",
    ],
    duration: "1-2小时",
  },
  {
    phase: "第二阶段",
    title: "代码仓库与CI/CD配置",
    steps: [
      "创建GitHub仓库并推送代码",
      "配置 .github/workflows/deploy.yml 自动部署工作流",
      "设置环境变量（如图片API地址）",
      "配置分支保护规则（main分支需PR合并）",
      "测试CI/CD流水线：push → build → deploy 全链路",
    ],
    duration: "2-3小时",
  },
  {
    phase: "第三阶段",
    title: "平台部署与域名配置",
    steps: [
      "首选Cloudflare Pages：连接GitHub仓库，配置构建命令 npm run build，输出目录 dist",
      "备选Vercel：导入GitHub仓库，自动识别Vite框架",
      "配置自定义域名（如 qinghua.design）",
      "配置DNS解析：CNAME指向平台提供的域名",
      "等待SSL证书自动签发并验证HTTPS",
    ],
    duration: "2-4小时",
  },
  {
    phase: "第四阶段",
    title: "性能优化与监控",
    steps: [
      "配置Cloudflare缓存规则（静态资源长期缓存）",
      "启用Brotli压缩",
      "配置HTTP/2 Server Push",
      "添加Web Analytics（Cloudflare Web Analytics或Vercel Analytics）",
      "运行Lighthouse审计，目标：Performance > 90",
    ],
    duration: "2-3小时",
  },
  {
    phase: "第五阶段",
    title: "上线发布与推广",
    steps: [
      "最终全功能回归测试",
      "配置自定义404页面",
      "社交媒体发布（小红书/微博/即刻：青花瓷×AI提示词工具）",
      "提交到Product Hunt / HelloGitHub等平台",
      "建立用户反馈渠道（GitHub Issues / 邮件）",
    ],
    duration: "1-2天",
  },
];

export const recommendedPlan = {
  primary: "Cloudflare Pages（海外）",
  reason:
    "本项目为纯静态前端（React+Vite构建产物），无服务端渲染需求。Cloudflare Pages提供无限带宽、亚洲边缘节点覆盖、免费DDoS防护，且对纯静态项目零成本运行，是海外用户访问的最优选择。",
  secondary: "腾讯云 CloudBase（国内）",
  secondaryReason:
    "面向国内用户的首选方案。CloudBase提供国内5大可用区+200+CDN边缘节点，首包时间<50ms，支持ICP备案辅导，微信/QQ内可直接打开。免费体验版3000资源点/月足够个人项目使用，全栈Serverless能力便于后续扩展。",
  domain: "qinghua.design（海外） / qinghua.cn（国内备案）",
  estimatedCost: "海外0元/月（Cloudflare免费版）；国内0-5.9元/月（CloudBase免费/个人版）",
  sla: "Cloudflare SLA 99.99% / 腾讯云 SLA 99.95%",
  domesticNote: "如需纯国产化部署（信创要求），推荐华为云OBS+CDN方案，全栈自研、政企适配最优。",
};
