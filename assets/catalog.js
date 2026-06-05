/* =========================================
   SkillBox · 1000+ 工具配置目录
   架构：数据驱动 + 模板引擎
   ========================================= */

// 工具模板类型：
//  - counter    : 文本输入 → 计数指标
//  - transform  : 文本输入 → 转换输出
//  - converter  : 双栏输入输出 + 格式互转
//  - encoder    : encode/decode 双向
//  - generator  : 参数 → 生成输出
//  - calculator : 多输入表单 → 数值结果
//  - lookup     : 速查表 + 搜索
//  - validator  : 输入 + 校验
//  - color      : 颜色选择器
//  - chart      : 数据输入 + 图表
//  - timer      : 计时器 / 倒计时
//  - game       : 小游戏
//  - reference  : 静态知识表
//  - form       : 多字段表单
//  - picker     : 选择/选项
//  - board      : 画板

const TOOL_DEFS = [];
let _id = 0;
const T = (def) => { def.id = def.id || ("t" + (++_id)); TOOL_DEFS.push(def); return def; };

/* ============ 1. 文本处理 (60) ============ */
const _TEXT_OPS = [
  "字数统计", "字符统计", "字节统计", "行数统计", "行最大长度", "行平均长度",
  "词频统计", "字符频率", "Bigram 频率", "Trigram 频率", "元音统计", "辅音统计",
  "中文字数", "英文词数", "数字字符数", "空格字符数", "标点字符数", "行末空白检查",
  "唯一字符数", "唯一词数", "最长行", "最短行", "最长单词", "最短单词",
  "倒序排列", "乱序排列", "去重行", "去空行", "去重复词", "按长度排序",
  "按字典序排序", "按数字排序", "首字母大写", "全大写", "全小写", "首字母缩略",
  "反转字符", "反转单词", "反转行序", "行随机化", "列转行 (CSV展平)", "行转列",
  "提取数字", "提取邮箱", "提取URL", "提取IP", "提取手机号", "提取身份证",
  "提取中文", "提取英文", "提取表情", "提取十六进制", "提取金额", "提取日期",
  "字符替换", "正则替换", "行过滤", "正则过滤", "行截取", "去重连续"
];
_TEXT_OPS.forEach(name => T({
  cat: "文本处理", icon: "📝", name, desc: "对文本执行：" + name,
  tpl: "counter", tags: ["文本","处理", name.split(" ")[0]],
  sample: "Hello, SkillBox!\n这是一段测试文本，包含 123 数字、邮箱 user@example.com 和URL https://skillbox.dev。\n第三行用于测试。",
  op: name
}));

/* ============ 2. 编码转换 (50) ============ */
const _ENC_OPS = [
  ["Base64 编码", "encode", "btoa"],
  ["Base64 解码", "decode", "btoa"],
  ["URL 编码", "encode", "url"],
  ["URL 解码", "decode", "url"],
  ["HTML 实体编码", "encode", "html"],
  ["HTML 实体解码", "decode", "html"],
  ["Hex 编码", "encode", "hex"],
  ["Hex 解码", "decode", "hex"],
  ["二进制字符串", "encode", "bin"],
  ["二进制 → 文本", "decode", "bin"],
  ["Unicode 转义", "encode", "uni"],
  ["Unicode 反转义", "decode", "uni"],
  ["ROT13", "encode", "rot13"],
  ["ROT5", "encode", "rot5"],
  ["ROT47", "encode", "rot47"],
  ["Caesar Cipher (凯撒)", "encode", "caesar"],
  ["Atbash Cipher", "encode", "atbash"],
  ["Morse 编码", "encode", "morse"],
  ["Morse 解码", "decode", "morse"],
  ["Pig Latin 编码", "encode", "piglatin"],
  ["反向字符串", "encode", "reverse"],
  ["字符串 XOR 加密", "encode", "xor"],
  ["SHA-1 哈希", "hash", "sha1"],
  ["SHA-256 哈希", "hash", "sha256"],
  ["SHA-512 哈希", "hash", "sha512"],
  ["MD5 哈希", "hash", "md5"],
  ["HMAC-SHA256", "hash", "hmac"],
  ["CRC32 校验", "hash", "crc32"],
  ["JWT 编码", "encode", "jwt"],
  ["JWT 解码", "decode", "jwt"],
  ["字符串转 ASCII 码", "encode", "ascii"],
  ["ASCII 码转字符串", "decode", "ascii"],
  ["Base32 编码", "encode", "b32"],
  ["Base32 解码", "decode", "b32"],
  ["Base58 编码", "encode", "b58"],
  ["Base58 解码", "decode", "b58"],
  ["Quoted-printable 编码", "encode", "qp"],
  ["Quoted-printable 解码", "decode", "qp"],
  ["UTF-7 编码", "encode", "utf7"],
  ["UUencode", "encode", "uu"],
  ["XXencode", "encode", "xx"],
  ["Yenc 编码", "encode", "yenc"],
  ["Brainfuck 编码", "encode", "bf"],
  ["Ook! 编码", "encode", "ook"],
  ["二进制 (8位补码)", "encode", "twos"],
  ["Punycode 编码", "encode", "puny"],
  ["Punycode 解码", "decode", "puny"],
  ["Base85 编码", "encode", "b85"],
  ["Base85 解码", "decode", "b85"],
  ["String.toBase64URL", "encode", "b64u"]
];
_ENC_OPS.forEach(([name, dir, algo]) => T({
  cat: "编码转换", icon: "🔐", name, desc: name,
  tpl: "encoder", algo, dir,
  tags: ["编码","转换", algo, dir === "encode" ? "encode" : "decode"]
}));

/* ============ 3. 单位换算 (80) ============ */
const _UNITS = [
  { cat: "长度", icon: "📏", units: [
    {n:"米",r:1}, {n:"千米",r:1000}, {n:"厘米",r:0.01}, {n:"毫米",r:0.001}, {n:"微米",r:1e-6},
    {n:"英寸",r:0.0254}, {n:"英尺",r:0.3048}, {n:"码",r:0.9144}, {n:"英里",r:1609.344}, {n:"海里",r:1852},
    {n:"光年",r:9.461e15}, {n:"天文单位",r:1.496e11}, {n:"皮卡",r:4.218e-5}, {n:"秒差距",r:3.086e16}, {n:"里",r:500},
    {n:"尺",r:0.3333}, {n:"寸",r:0.0333}, {n:"分",r:0.00333}
  ]},
  { cat: "质量", icon: "⚖", units: [
    {n:"克",r:1}, {n:"千克",r:1000}, {n:"吨",r:1e6}, {n:"毫克",r:0.001}, {n:"微克",r:1e-6},
    {n:"磅",r:453.592}, {n:"盎司",r:28.35}, {n:"英石",r:6350.29}, {n:"担",r:50000}, {n:"斤",r:500},
    {n:"两",r:50}, {n:"钱",r:5}, {n:"克拉",r:0.2}, {n:"金衡盎司",r:31.1035}
  ]},
  { cat: "时间", icon: "⏰", units: [
    {n:"秒",r:1}, {n:"毫秒",r:0.001}, {n:"微秒",r:1e-6}, {n:"纳秒",r:1e-9},
    {n:"分钟",r:60}, {n:"小时",r:3600}, {n:"天",r:86400}, {n:"周",r:604800},
    {n:"月(30天)",r:2592000}, {n:"年(365天)",r:31536000}, {n:"十年",r:315360000}, {n:"世纪",r:3153600000}
  ]},
  { cat: "温度", icon: "🌡", units: [
    {n:"摄氏度",r:1,off:0}, {n:"华氏度",r:1,off:0, fn: "f"}, {n:"开尔文",r:1,off:0, fn:"k"}
  ]},
  { cat: "面积", icon: "⬜", units: [
    {n:"平方米",r:1}, {n:"平方千米",r:1e6}, {n:"平方厘米",r:0.0001}, {n:"公顷",r:10000}, {n:"亩",r:666.67},
    {n:"英亩",r:4046.86}, {n:"平方英尺",r:0.0929}, {n:"平方英寸",r:0.000645}, {n:"平方英里",r:2590000}
  ]},
  { cat: "体积", icon: "🧊", units: [
    {n:"升",r:1}, {n:"毫升",r:0.001}, {n:"立方米",r:1000}, {n:"立方厘米",r:0.001},
    {n:"加仑(美)",r:3.785}, {n:"加仑(英)",r:4.546}, {n:"品脱",r:0.473}, {n:"盎司(液)",r:0.0296},
    {n:"桶(石油)",r:158.987}
  ]},
  { cat: "速度", icon: "💨", units: [
    {n:"米/秒",r:1}, {n:"千米/小时",r:0.2778}, {n:"英里/小时",r:0.447}, {n:"节",r:0.5144},
    {n:"马赫",r:343}, {n:"光速(c)",r:3e8}, {n:"英尺/秒",r:0.3048}
  ]},
  { cat: "数据存储", icon: "💾", units: [
    {n:"位(bit)",r:1}, {n:"字节(B)",r:8}, {n:"KB",r:8192}, {n:"MB",r:8.39e6}, {n:"GB",r:8.59e9},
    {n:"TB",r:8.796e12}, {n:"PB",r:9.007e15}, {n:"EB",r:9.22e18}
  ]},
  { cat: "功率", icon: "⚡", units: [
    {n:"瓦特",r:1}, {n:"千瓦",r:1000}, {n:"马力",r:745.7}, {n:"BTU/小时",r:0.2931}
  ]},
  { cat: "压力", icon: "💨", units: [
    {n:"帕斯卡",r:1}, {n:"千帕",r:1000}, {n:"兆帕",r:1e6}, {n:"巴",r:1e5},
    {n:"标准大气压",r:101325}, {n:"PSI",r:6894.76}, {n:"毫米汞柱",r:133.322}, {n:"英寸汞柱",r:3386.39}
  ]},
  { cat: "能量", icon: "🔋", units: [
    {n:"焦耳",r:1}, {n:"千焦",r:1000}, {n:"卡路里",r:4.184}, {n:"千卡",r:4184},
    {n:"瓦时",r:3600}, {n:"千瓦时",r:3.6e6}, {n:"电子伏特",r:1.602e-19}, {n:"BTU",r:1055.06}
  ]},
  { cat: "角度", icon: "📐", units: [
    {n:"度",r:1}, {n:"弧度",r:57.2958}, {n:"分(角)",r:0.01667}, {n:"秒(角)",r:0.000278}, {n:"梯度",r:0.9}
  ]}
];
let _uc = 0;
_UNITS.forEach(group => {
  // 全组合：每对单位做一个工具
  for (let i = 0; i < group.units.length; i++) {
    for (let j = 0; j < group.units.length; j++) {
      if (i === j) continue;
      T({
        cat: "单位换算", icon: group.icon, name: group.units[i].n + " → " + group.units[j].n,
        desc: group.cat + "换算",
        tpl: "calculator", op: "unit", from: group.units[i], to: group.units[j], group: group.cat,
        tags: ["换算", group.cat, "单位"]
      });
    }
  }
});

/* ============ 4. 数字系统 (30) ============ */
const _NUM_SYS = [
  ["二进制", 2], ["八进制", 8], ["十进制", 10], ["十六进制", 16], ["三十二进制", 32],
  ["三十六进制", 36], ["六十二进制", 62], ["罗马数字", "roman"]
];
_NUM_SYS.forEach(([n, b]) => T({
  cat: "数字系统", icon: "🔢", name: "十进制 → " + n, desc: n + " 转换",
  tpl: "calculator", op: "baseConvert", fromBase: 10, toBase: b, targetName: n,
  tags: ["进制", "数字", n]
}));
_NUM_SYS.forEach(([n, b]) => T({
  cat: "数字系统", icon: "🔢", name: n + " → 十进制", desc: n + " 转十进制",
  tpl: "calculator", op: "baseConvert", fromBase: b, toBase: 10, targetName: n,
  tags: ["进制", "数字", n]
}));

/* ============ 5. 数学计算 (40) ============ */
const _MATH = [
  ["百分比计算器", "%", "percent"],
  ["百分比变化", "Δ%", "percentChange"],
  ["最大公约数 GCD", "GCD", "gcd"],
  ["最小公倍数 LCM", "LCM", "lcm"],
  ["质数判断", "P?", "primeCheck"],
  ["质数生成", "Pn", "primes"],
  ["斐波那契数列", "Fn", "fib"],
  ["阶乘", "n!", "factorial"],
  ["排列 P(n,k)", "P", "perm"],
  ["组合 C(n,k)", "C", "comb"],
  ["等差数列求和", "Σa", "arithSum"],
  ["等比数列求和", "Σg", "geoSum"],
  ["一元二次方程", "ax²+bx+c", "quad"],
  ["距离公式 (2D)", "d₂", "dist2"],
  ["距离公式 (3D)", "d₃", "dist3"],
  ["圆面积", "πr²", "circleArea"],
  ["圆周长", "2πr", "circleCirc"],
  ["球体积", "4/3πr³", "sphereVol"],
  ["球表面积", "4πr²", "sphereArea"],
  ["圆柱体积", "πr²h", "cylVol"],
  ["直角三角形", "abc", "rightTri"],
  ["BMI 计算", "BMI", "bmi"],
  ["平均数", "μ", "mean"],
  ["加权平均", "μw", "wmean"],
  ["中位数", "M", "median"],
  ["方差", "σ²", "variance"],
  ["标准差", "σ", "std"],
  ["对数 (log)", "log", "log"],
  ["自然对数 (ln)", "ln", "ln"],
  ["指数 (e^x)", "eˣ", "exp"],
  ["平方根", "√", "sqrt"],
  ["立方根", "∛", "cbrt"],
  ["阶乘 nPr", "nPr", "npr"],
  ["求和 Σx", "Σ", "sum"],
  ["求积 ∏x", "∏", "product"],
  ["向上取整", "⌈x⌉", "ceil"],
  ["向下取整", "⌊x⌋", "floor"],
  ["四舍五入", "≈", "round"],
  ["绝对值", "|x|", "abs"],
  ["取最大", "max", "max"]
];
_MATH.forEach(([name, glyph, op]) => T({
  cat: "数学计算", icon: "🧮", name, desc: name,
  tpl: "calculator", op, glyph,
  tags: ["数学", "计算", op]
}));

/* ============ 6. 金融计算 (30) ============ */
[
  ["贷款月供", "loan"], ["等额本金", "loanP"], ["等额本息总利息", "loanI"],
  ["投资复利", "compound"], ["年化收益率", "apy"], ["内部收益率 IRR", "irr"],
  ["每月储蓄目标", "saveGoal"], ["退休储蓄", "retire"], ["通胀调整", "inflate"],
  ["所得税", "tax"], ["增值税", "vat"], ["折扣价", "discount"],
  ["小费计算", "tip"], ["AA 制分账", "split"], ["汇率换算", "fx"],
  ["信用卡最低还款", "minPay"], ["还清信用卡月数", "payoff"], ["房屋贷款资格", "mortQual"],
  ["月供 vs 一次性", "lumpVs"], ["复利 vs 单利", "ciVsSi"],
  ["汽车贷款", "car"], ["学生贷款", "student"], ["个人贷款", "personal"],
  ["投资回报率 ROI", "roi"], ["净资产", "netWorth"], ["应急基金", "emergency"],
  ["房屋可负担", "afford"], ["房租 vs 买房", "rentVsBuy"],
  ["薪资时薪换算", "hrly"]
].forEach(([name, op]) => T({
  cat: "金融财务", icon: "💰", name, desc: name,
  tpl: "calculator", op, glyph: "💵",
  tags: ["金融", "财务", op, "计算"]
}));

/* ============ 7. 日期时间 (40) ============ */
[
  ["日期差", "diff"], ["日期+N天", "add"], ["日期-N天", "sub"],
  ["年龄计算", "age"], ["到生日天数", "bday"], ["工作日数量", "workdays"],
  ["周末数量", "weekends"], ["闰年判断", "leap"], ["一年第几天", "doy"],
  ["一年第几周", "woy"], ["星期几", "dow"], ["中文星期", "dowCN"],
  ["生肖", "zodiac"], ["星座", "star"], ["干支", "ganzhi"],
  ["农历转公历", "l2s"], ["公历转农历", "s2l"],
  ["日期格式化", "fmt"], ["ISO 8601", "iso"], ["RFC 2822", "rfc"],
  ["时间戳→日期", "ts2d"], ["日期→时间戳", "d2ts"],
  ["时分秒相加", "addT"], ["时分秒相减", "subT"],
  ["时间差", "tDiff"], ["日期范围", "range"],
  ["本月日历", "cal"], ["上月日历", "calPrev"], ["下月日历", "calNext"],
  ["本周日历", "calW"], ["季度", "quarter"], ["年中第几周", "woyFull"],
  ["本月天数", "daysM"], ["本年天数", "daysY"], ["本年进度", "yProg"],
  ["本月进度", "mProg"], ["本日进度", "dProg"],
  ["节日倒计时", "holiday"], ["节气", "solarTerm"], ["日出日落", "sun"],
  ["农历闰月", "lLeap"]
].forEach(([name, op]) => T({
  cat: "日期时间", icon: "📅", name, desc: name,
  tpl: "calculator", op, glyph: "📆",
  tags: ["日期","时间", op]
}));

/* ============ 8. 颜色 (40) ============ */
[
  ["HEX→RGB", "hex2rgb"], ["RGB→HEX", "rgb2hex"],
  ["HEX→HSL", "hex2hsl"], ["HSL→HEX", "hsl2hex"],
  ["HEX→HSV", "hex2hsv"], ["HSV→HEX", "hsv2hex"],
  ["HEX→CMYK", "hex2cmyk"], ["CMYK→HEX", "cmyk2hex"],
  ["HEX→OKLCH", "hex2oklch"], ["OKLCH→HEX", "oklch2hex"],
  ["HEX→LAB", "hex2lab"], ["LAB→HEX", "lab2hex"],
  ["HEX→LCH", "hex2lch"], ["LCH→HEX", "lch2hex"],
  ["HEX→XYZ", "hex2xyz"], ["XYZ→HEX", "xyz2hex"],
  ["HEX→P3", "hex2p3"], ["P3→HEX", "p32hex"],
  ["HEX→YUV", "hex2yuv"], ["YUV→HEX", "yuv2hex"],
  ["HEX→HWB", "hex2hwb"], ["HWB→HEX", "hwb2hex"],
  ["色名查找", "name"],
  ["HEX 加亮", "lighten"], ["HEX 变暗", "darken"],
  ["HEX 饱和", "sat"], ["HEX 灰度", "gray"],
  ["HEX 反色", "inv"],
  ["HEX 混合", "mix"],
  ["对比度计算", "contrast"],
  ["可访问性评级", "wcag"],
  ["随机颜色", "rand"],
  ["HEX → Tailwind 类", "tw"],
  ["HEX → CSS 变量", "css"],
  ["HEX → SCSS 变量", "scss"],
  ["HEX → SVG fill", "svg"],
  ["HEX → Android XML", "axml"],
  ["HEX → iOS Swift", "swift"],
  ["HEX → 调色板", "palette"],
  ["HEX → 命名颜色", "n2hex"],
  ["HEX → 颜色温度", "temp"]
].forEach(([name, op]) => T({
  cat: "颜色设计", icon: "🎨", name, desc: name,
  tpl: "color", op,
  tags: ["颜色", op]
}));

/* ============ 9. 提示词 AI (40) ============ */
const _PROMPT_CATS = [
  "写作", "编程", "翻译", "总结", "头脑风暴", "角色扮演", "面试", "邮件",
  "营销文案", "社交媒体", "产品命名", "Logo 设计", "UI 文案", "SEO", "广告",
  "教育辅导", "学术研究", "数据分析", "图表绘制", "代码审查", "调试", "重构",
  "测试用例", "API 设计", "数据库设计", "架构建议", "安全审计", "性能优化", "文档", "注释",
  "故事创作", "诗歌", "剧本", "歌词", "笑话", "谜语", "谚语", "翻译润色"
];
_PROMPT_CATS.forEach(name => T({
  cat: "AI 提示词", icon: "🤖", name: name + " 提示词", desc: "AI 辅助：" + name,
  tpl: "form", kind: "prompt", topic: name,
  tags: ["AI", "提示词", name]
}));

/* ============ 10. 学习参考 (50) ============ */
[
  ["HTML 速查", "html", "HTML 元素与属性速查表"],
  ["CSS 速查", "css", "CSS 属性速查表"],
  ["JavaScript 速查", "js", "JS 语法速查表"],
  ["Python 速查", "py", "Python 语法速查"],
  ["Git 速查", "git", "Git 命令速查"],
  ["Linux 命令", "linux", "Linux 常用命令"],
  ["SQL 速查", "sql", "SQL 语句速查"],
  ["Vim 速查", "vim", "Vim 快捷键"],
  ["VSCode 速查", "vscode", "VSCode 快捷键"],
  ["Markdown 速查", "md", "Markdown 语法速查"],
  ["正则速查", "regex", "正则表达式速查"],
  ["HTTP 状态码", "http", "HTTP 状态码速查"],
  ["HTTP 头", "httpHdr", "HTTP Headers 速查"],
  ["MIME 类型", "mime", "MIME 类型表"],
  ["HTML 字符实体", "entity", "HTML 字符实体"],
  ["ASCII 表", "ascii", "ASCII 字符表"],
  ["希腊字母", "greek", "希腊字母表"],
  ["数学符号", "mathSym", "数学符号表"],
  ["Emoji 速查", "emoji", "Emoji 速查表"],
  ["国家代码", "country", "ISO 国家代码"],
  ["语言代码", "lang", "ISO 语言代码"],
  ["时区代码", "tz", "IANA 时区代码"],
  ["货币代码", "cur", "ISO 4217 货币代码"],
  ["机场代码", "airport", "IATA 机场代码"],
  ["元素周期表", "elem", "化学元素周期表"],
  ["行星数据", "planet", "太阳系行星数据"],
  ["键盘布局", "kbd", "键盘按键编码"],
  ["颜色名", "color", "CSS 颜色名"],
  ["单位换算", "unitT", "常用单位换算表"],
  ["键盘快捷键", "hotkey", "通用快捷键"],
  ["Windows 快捷键", "winhk", "Windows 快捷键"],
  ["Mac 快捷键", "machk", "Mac 快捷键"],
  ["Excel 函数", "excel", "Excel 常用函数"],
  ["Word 快捷键", "wordhk", "Word 快捷键"],
  ["PowerPoint 快捷键", "pphk", "PPT 快捷键"],
  ["Photoshop 快捷键", "pshk", "PS 快捷键"],
  ["Figma 快捷键", "fighk", "Figma 快捷键"],
  ["Docker 命令", "docker", "Docker 命令速查"],
  ["npm 命令", "npm", "npm 命令速查"],
  ["curl 命令", "curl", "curl 速查"],
  ["tar 命令", "tar", "tar 速查"],
  ["SSH 命令", "ssh", "SSH 速查"],
  ["Cron 表达式", "cronRef", "Cron 字段含义"],
  ["JSON Schema", "jsonschema", "JSON Schema 语法"],
  ["YAML 速查", "yaml", "YAML 速查"],
  ["TOML 速查", "toml", "TOML 速查"],
  ["GraphQL 速查", "gql", "GraphQL 速查"],
  ["WebSocket 协议", "ws", "WebSocket 协议"],
  ["OAuth 流程", "oauth", "OAuth 2.0 流程"]
].forEach(([name, k, desc]) => T({
  cat: "学习参考", icon: "📚", name, desc, tpl: "reference", key: k,
  tags: ["速查", "参考", k]
}));

/* ============ 11. 趣味游戏 (40) ============ */
[
  ["骰子", "dice"], ["抛硬币", "coin"], ["抽签", "lottery"], ["随机点名", "picker"],
  ["石头剪刀布", "rps"], ["猜数字 1-100", "guess"], ["21 点", "bj21"], ["老虎机", "slot"],
  ["记忆翻牌", "memo"], ["扫雷 (迷你)", "mines"], ["贪吃蛇", "snake"], ["俄罗斯方块", "tetris"],
  ["井字棋", "ttt"], ["五子棋", "gomoku"], ["数独 (4x4)", "sudoku4"],
  ["黑白棋", "reversi"], ["24 点", "t24"], ["Bingo", "bingo"],
  ["转盘", "wheel"], ["老虎", "tiger"], ["扑克比大小", "poker"],
  ["三公", "threegong"], ["麻将胡牌", "mahjong"], ["斗地主发牌", "doudizhu"],
  ["UNO 发牌", "uno"], ["谁是卧底", "spy"],
  ["真心话大冒险", "truth"], ["惩罚转盘", "punish"],
  ["随机笑话", "joke"], ["随机谜语", "riddle"], ["随机脑筋急转弯", "brain"],
  ["随机冷知识", "fact"], ["随机名言", "quote"], ["随机土味情话", "love"],
  ["随机梗", "meme"], ["emoji 拼句", "emoji"], ["成语接龙", "idiom"],
  ["藏头诗生成", "acrostic"], ["随机梦境", "dream"], ["运势抽签", "fortune"]
].forEach(([name, k]) => T({
  cat: "趣味游戏", icon: "🎲", name, desc: name,
  tpl: "game", key: k,
  tags: ["游戏", "趣味", k]
}));

/* ============ 12. 健康健身 (20) ============ */
[
  ["BMI 计算", "bmi"], ["BMR 基础代谢", "bmr"], ["TDEE 每日消耗", "tdee"],
  ["理想体重", "idealW"], ["体脂率 (海军)", "bf"], ["每日饮水量", "water"],
  ["心率区间", "hr"], ["最大心率", "maxHr"], ["靶心率", "thr"],
  ["跑步配速", "pace"], ["步数公里", "stepK"], ["卡路里→脂肪", "calFat"],
  ["蛋白质需求", "protein"], ["碳水需求", "carb"], ["睡眠周期", "sleepC"],
  ["起床时间", "wakeup"], ["月经周期", "mc"], ["孕期计算", "preg"],
  ["戒烟节省", "noSmoke"], ["戒酒节省", "noAlc"]
].forEach(([name, k]) => T({
  cat: "健康健身", icon: "💪", name, desc: name,
  tpl: "calculator", op: k, glyph: "🏃",
  tags: ["健康", "健身", k]
}));

/* ============ 13. 图表可视化 (40) ============ */
[
  "柱状图", "折线图", "饼图", "环形图", "散点图", "雷达图",
  "热力图", "词云", "漏斗图", "桑基图", "仪表盘", "进度条",
  "K 线图", "面积图", "堆叠图", "箱线图", "小提琴图", "瀑布图",
  "玫瑰图", "矩形树图", "极坐标图", "旭日图", "子弹图", "甘特图",
  "3D 柱状图", "3D 散点图", "3D 曲面图", "3D 饼图", "3D 折线", "3D 气泡",
  "地图", "热力地图", "路径地图", "迁徙地图", "统计地图",
  "树图", "力导向图", "和弦图", "圆形打包", "矩形树图"
].forEach(name => T({
  cat: "图表可视化", icon: "📊", name, desc: "基于 ECharts 渲染：" + name,
  tpl: "chart", chart: name,
  tags: ["图表", "可视化", name]
}));

/* ============ 14. 文字排版 (30) ============ */
[
  ["字符间距调整", "letter"], ["行高计算", "lineH"], ["字号 px/pt/em/rem", "fontSize"],
  ["颜色对比度", "contrast"], ["黄金比例", "golden"], ["斐波那契排版", "fib"],
  ["网格系统", "grid"], ["间距尺度 (8pt)", "spacing"], ["阴影生成", "shadow"],
  ["圆角生成", "radius"], ["渐变生成", "gradient"], ["玻璃拟态", "glass"],
  ["按钮生成", "btn"], ["CSS 动画", "anim"], ["CSS 过渡", "trans"],
  ["SVG 占位图", "svg"], ["Favicon 生成", "fav"], ["PWA Manifest", "pwa"],
  ["Lottie 预览", "lot"], ["CSS 变量生成", "var"], ["Tailwind 转换", "twConv"],
  ["SCSS 嵌套扁平化", "scss2css"], ["CSS 单位转换", "cssUnit"],
  ["CSS 压缩", "cssMin"], ["CSS 美化", "cssFmt"], ["HTML 美化", "htmlFmt"],
  ["HTML 压缩", "htmlMin"], ["JS 压缩", "jsMin"], ["JS 美化", "jsFmt"],
  ["SVG 优化", "svgOpt"], ["HTML 实体", "entity"]
].forEach(([name, k]) => T({
  cat: "文字排版", icon: "🎭", name, desc: name,
  tpl: "form", kind: "design", key: k,
  tags: ["排版", "设计", k]
}));

/* ============ 15. 网络工具 (30) ============ */
[
  ["URL 解析", "urlP"], ["URL 编码", "urlE"], ["URL 缩短 (mock)", "urlS"],
  ["URL 拼接", "urlB"], ["User-Agent 解析", "ua"], ["Referer 解析", "ref"],
  ["Cookie 解析", "cookie"], ["JWT 解析", "jwtP"], ["HTTP 请求测试", "httpT"],
  ["DNS 查询", "dns"], ["WHOIS 查询", "whois"], ["IP 反查", "ipRev"],
  ["IP 计算", "ipCalc"], ["子网划分", "subnet"], ["CIDR 展开", "cidr"],
  ["端口扫描 (mock)", "port"], ["ping 模拟", "ping"], ["traceroute 模拟", "trace"],
  ["Base64 → 图片", "b64img"], ["图片 → Base64", "imgB64"],
  ["MIME 探测", "mime"], ["Charset 探测", "charset"], ["TLS 证书信息", "cert"],
  ["Curl 命令生成", "curlG"], ["HTTP 头美化", "hdrF"], ["HTTP 头压缩", "hdrC"],
  ["HTTP/2 帧", "h2"], ["WebSocket 帧", "wsf"], ["MQTT 报文", "mqtt"]
].forEach(([name, k]) => T({
  cat: "网络工具", icon: "🌐", name, desc: name,
  tpl: "form", kind: "net", key: k,
  tags: ["网络", k]
}));

/* ============ 16. 文档办公 (30) ============ */
[
  ["Markdown 预览", "mdPrev"], ["Markdown 转 HTML", "md2html"], ["HTML 转 Markdown", "h2md"],
  ["Word 计数器", "wc"], ["阅读时间估算", "readT"], ["字数计算 (中)", "wcCN"],
  ["段落格式化", "paraF"], ["列表创建", "listC"], ["TODO 列表", "todo"],
  ["会议纪要模板", "meet"], ["简历模板", "resume"], ["求职信模板", "cover"],
  ["合同模板", "contract"], ["发票模板", "invoice"], ["报价单模板", "quote"],
  ["日程模板", "sched"], ["周报模板", "weekly"], ["月报模板", "monthly"],
  ["邮件签名", "sig"], ["便签", "sticky"], ["便签加密", "stickyE"],
  ["PDF 元数据", "pdfM"], ["PPT 模板", "pptT"], ["Excel 模板", "xlT"],
  ["思维导图 (mock)", "mind"], ["流程图 (mock)", "flow"], ["甘特图 (mock)", "gantt"],
  ["时间轴", "tl"], ["公告模板", "notice"]
].forEach(([name, k]) => T({
  cat: "文档办公", icon: "📄", name, desc: name,
  tpl: "form", kind: "office", key: k,
  tags: ["文档", "办公", k]
}));

/* ============ 17. 编程开发 (40) ============ */
[
  ["JSON 格式化", "jsonF"], ["JSON 美化", "jsonP"], ["JSON 压缩", "jsonM"],
  ["JSON 校验", "jsonV"], ["JSON 转 YAML", "j2y"], ["YAML 转 JSON", "y2j"],
  ["JSON 转 CSV", "j2c"], ["CSV 转 JSON", "c2j"], ["JSON Diff", "jDiff"],
  ["JSONPath 查询", "jp"], ["JSON Schema 生成", "jsg"], ["JSON 树视图", "jTree"],
  ["正则测试", "regT"], ["正则可视化", "regV"], ["正则生成器", "regG"],
  ["Cron 解析", "cronP"], ["Cron 下次运行", "cronN"], ["Cron 生成器", "cronG"],
  ["UUID v1", "u1"], ["UUID v4", "u4"], ["UUID v7", "u7"],
  ["随机数生成", "rand"], ["随机字符串", "randS"], ["随机密码", "randP"],
  ["雪花 ID", "snow"], ["ULID 生成", "ulid"], ["Nano ID", "nano"],
  ["Lorem 文本", "lorem"], ["Lorem 中文", "loremCN"], ["Lorem 单词", "loremW"],
  ["SQL 格式化", "sqlF"], ["SQL 美化", "sqlP"], ["SQL 模板", "sqlT"],
  ["API 响应模拟", "apiM"], ["Mock 数据", "mock"], ["假数据生成", "fake"],
  ["Cron 上次运行", "cronL"], ["Base64 → 文件", "b64f"], ["文件 → Base64", "fB64"]
].forEach(([name, k]) => T({
  cat: "编程开发", icon: "💻", name, desc: name,
  tpl: "form", kind: "code", key: k,
  tags: ["编程", "开发", k]
}));

/* ============ 18. 测验问答 (30) ============ */
[
  ["数学口算", "math"], ["英语单词", "en"], ["汉语拼音", "pinyin"],
  ["成语接龙", "idiom"], ["古诗背诵", "poem"], ["中国历史", "history"],
  ["世界地理", "geo"], ["化学元素", "elem"], ["物理公式", "phys"],
  ["生物知识", "bio"], ["计算机基础", "cs"], ["法律常识", "law"],
  ["医学常识", "med"], ["心理学", "psych"], ["经济学", "econ"],
  ["哲学入门", "phil"], ["艺术鉴赏", "art"], ["音乐基础", "music"],
  ["体育常识", "sport"], ["电影知识", "film"], ["图书知识", "book"],
  ["新闻时事", "news"], ["科技前沿", "tech"], ["AI 知识", "ai"],
  ["常识判断", "common"], ["逻辑推理", "logic"], ["图形推理", "visual"],
  ["数字推理", "num"], ["言语理解", "lang"], ["资料分析", "data"],
  ["定义判断", "def"]
].forEach(([name, k]) => T({
  cat: "测验问答", icon: "❓", name, desc: "测验：" + name,
  tpl: "game", key: k, kind: "quiz",
  tags: ["测验", "知识", k]
}));

/* ============ 19. 速查手册 (40) ============ */
[
  ["键盘按键码", "keycode", "key→code 速查"],
  ["HTML 字符实体", "entity", "字符实体速查"],
  ["ASCII 控制字符", "ctrlChar", "0-31 字符含义"],
  ["MIME 类型", "mimeRef", "MIME 类型速查"],
  ["HTTP 头", "hdrRef", "HTTP Headers 速查"],
  ["HTTP 方法", "method", "HTTP 方法含义"],
  ["HTTP 状态码", "statusRef", "HTTP 状态码速查"],
  ["端口号", "portRef", "常用端口号速查"],
  ["协议端口", "protoPort", "协议-端口对应"],
  ["国家代码", "countryRef", "ISO 国家代码"],
  ["时区缩写", "tzAbbr", "时区缩写含义"],
  ["货币符号", "curSym", "货币符号速查"],
  ["文件扩展名", "ext", "文件扩展名含义"],
  ["魔法数字", "magic", "文件魔数速查"],
  ["字节序", "endian", "大端小端速查"],
  ["颜色名", "colorRef", "CSS 颜色名速查"],
  ["网页安全色", "webSafe", "216 网页安全色"],
  ["X11 颜色", "x11", "X11 颜色名"],
  ["Tailwind 颜色", "twCol", "Tailwind 调色板"],
  ["Material 颜色", "mui", "Material 调色板"],
  ["Bootstrap 颜色", "bs", "Bootstrap 颜色"],
  ["iOS 颜色", "ios", "iOS 系统色"],
  ["Solarized 配色", "solar", "Solarized 配色"],
  ["Monokai 配色", "monokai", "Monokai 配色"],
  ["Dracula 配色", "drac", "Dracula 配色"],
  ["Nord 配色", "nord", "Nord 配色"],
  ["字体回退", "fallback", "系统字体回退"],
  ["图标库索引", "iconLib", "常见图标库"],
  ["CDN 资源", "cdn", "常用 CDN 资源"],
  ["包管理器命令", "pkg", "npm/pnpm/yarn/cargo"],
  ["浏览器引擎", "engine", "浏览器引擎速查"],
  ["JS 引擎", "jseng", "JS 引擎速查"],
  ["GPU 厂商", "gpu", "GPU 厂商速查"],
  ["CPU 架构", "cpu", "CPU 架构速查"],
  ["操作系统", "os", "操作系统速查"],
  ["Linux 发行版", "distro", "Linux 发行版速查"],
  ["移动操作系统", "mobile", "移动 OS 速查"],
  ["数据库", "db", "数据库速查"],
  ["消息队列", "mq", "消息队列速查"],
  ["CI/CD 工具", "cicd", "CI/CD 工具速查"]
].forEach(([name, k, desc]) => T({
  cat: "速查手册", icon: "🔍", name, desc, tpl: "reference", key: k,
  tags: ["速查", k]
}));

/* ============ 20. 决策辅助 (20) ============ */
[
  ["决策矩阵", "dmatrix"], ["加权评分", "wscore"], ["Topsis", "topsis"],
  ["SWOT 分析", "swot"], ["PEST 分析", "pest"], ["波特五力", "porter"],
  ["波士顿矩阵", "bcg"], ["Ansoff 矩阵", "ansoff"], [" Eisenhower 矩阵", "eisen"],
  ["四象限", "4q"], ["九宫格", "9g"], ["六顶思考帽", "6hats"],
  ["5 Why 分析", "5why"], ["鱼骨图", "fish"], ["甘特图决策", "ganttD"],
  ["风险评估", "risk"], ["成本效益", "cba"], ["投票决策", "vote"],
  ["A/B 决策", "ab"], ["优先级排序", "prio"]
].forEach(([name, k]) => T({
  cat: "决策辅助", icon: "🎯", name, desc: "决策工具：" + name,
  tpl: "form", kind: "decision", key: k,
  tags: ["决策", k]
}));

/* ============ 21. 项目管理 (20) ============ */
[
  ["WBS 分解", "wbs"], ["任务清单", "task"], ["里程碑", "mile"],
  ["风险登记", "riskR"], ["燃尽图数据", "burn"], ["速度计算", "velocity"],
  ["周期时间", "cycle"], ["前置时间", "lead"], ["CFD 数据", "cfd"],
  ["故事点估算", "story"], ["计划扑克", "planning"], ["T-shirt 估算", "tshirt"],
  ["番茄数量", "pomoN"], ["OKR 生成", "okr"], ["KPI 设定", "kpi"],
  ["RACI 矩阵", "raci"], ["RACI 简化", "raciS"], ["时间盒", "timebox"],
  ["回顾会议", "retro"], ["站会模板", "standup"]
].forEach(([name, k]) => T({
  cat: "项目管理", icon: "📋", name, desc: "项目管理：" + name,
  tpl: "form", kind: "pm", key: k,
  tags: ["项目", "管理", k]
}));

/* ============ 22. 文本分析 (20) ============ */
[
  ["可读性 (Flesch)", "flesch"], ["可读性 (Gunning Fog)", "fog"],
  ["可读性 (SMOG)", "smog"], ["可读性 (ARI)", "ari"],
  ["情感分析", "sentiment"], ["关键词提取 (TF-IDF)", "tfidf"],
  ["关键词提取 (TextRank)", "textrank"], ["摘要 (Lead-3)", "lead3"],
  ["摘要 (TextRank)", "ts"], ["语言检测", "langDet"],
  ["作者风格分析", "style"], ["文本相似度 (Jaccard)", "jaccard"],
  ["文本相似度 (余弦)", "cosine"], ["Levenshtein 距离", "lev"],
  ["编辑距离", "edit"], ["Jaccard 系数", "jac"],
  ["Shannon 熵", "entropy"], ["压缩率估计", "comp"],
  ["词性标注 (mock)", "pos"], ["命名实体识别 (mock)", "ner"]
].forEach(([name, k]) => T({
  cat: "文本分析", icon: "🔬", name, desc: "分析：" + name,
  tpl: "form", kind: "analysis", key: k,
  tags: ["分析", k]
}));

/* ============ 23. 系统工具 (20) ============ */
[
  ["UUID v4", "u4"], ["UUID v7", "u7"], ["Nano ID", "nano"],
  ["随机字节", "randB"], ["随机 Token", "randT"], ["随机十六进制", "randH"],
  ["Base64 编码", "b64e"], ["Base64 解码", "b64d"],
  ["URL 编码", "urle"], ["URL 解码", "urld"],
  ["HTML 实体", "he"], ["HTML 反实体", "hed"],
  ["JWT 签发 (HS256)", "jwtI"], ["JWT 验证 (HS256)", "jwtV"],
  ["HMAC-SHA256", "hmacS"], ["HMAC-SHA512", "hmacL"],
  ["PBKDF2 派生", "pbkdf2"], ["bcrypt 哈希 (mock)", "bcrypt"],
  ["scrypt 哈希 (mock)", "scrypt"], ["Argon2 哈希 (mock)", "argon2"]
].forEach(([name, k]) => T({
  cat: "系统工具", icon: "🛠", name, desc: name,
  tpl: "encoder", algo: k, dir: "auto",
  tags: ["系统", k]
}));

/* ============ 24. 教育学习 (20) ============ */
[
  ["乘法口诀", "times"], ["加法练习", "add"], ["减法练习", "sub"],
  ["英语音标", "phon"], ["英文字母", "alpha"], ["拼音方案", "pinyin"],
  ["笔画笔顺", "stroke"], ["偏旁部首", "radical"], ["汉字结构", "struct"],
  ["GRE 词汇", "gre"], ["TOEFL 词汇", "toefl"], ["IELTS 词汇", "ielts"],
  ["考研词汇", "kaoyan"], ["CET4 词汇", "cet4"], ["CET6 词汇", "cet6"],
  ["日语 N5", "jp5"], ["日语 N1", "jp1"], ["韩语 TOPIK", "topik"],
  ["法语入门", "fr"], ["德语入门", "de"]
].forEach(([name, k]) => T({
  cat: "教育学习", icon: "🎓", name, desc: name,
  tpl: "reference", key: k, kind: "edu",
  tags: ["教育", k]
}));

/* ============ 25. 图片媒体 (20) ============ */
[
  ["图片→Base64", "i2b"], ["Base64→图片", "b2i"],
  ["图片 EXIF (mock)", "exif"], ["图片压缩", "icmp"],
  ["图片缩放", "irsz"], ["图片裁剪", "icrp"],
  ["图片旋转", "irot"], ["图片水印", "iwmk"], ["图片拼接", "imrg"],
  ["图片转字符画", "ascii"], ["图片色板", "ipal"],
  ["图片取色", "ipx"], ["图片直方图", "ihist"],
  ["图片格式转换", "icvt"], ["图片→ICO", "iico"],
  ["图片→SVG", "isvg"], ["二维码生成", "qr"], ["二维码识别 (mock)", "qrR"],
  ["条形码生成", "bar"]
].forEach(([name, k]) => T({
  cat: "图片媒体", icon: "🖼", name, desc: name,
  tpl: "form", kind: "image", key: k,
  tags: ["图片", k]
}));

/* ============ 26. 声音音频 (20) ============ */
[
  ["BPM 计算", "bpm"], ["节拍器", "metro"], ["音阶生成", "scale"],
  ["和弦分析", "chord"], ["音频时长", "audDur"],
  ["音频格式", "audFmt"], ["音频码率", "audBr"],
  ["dB 转换", "db"], ["Hz ↔ 音符", "hzNote"],
  ["十二平均律", "12TET"], ["五度相生律", "pyth"],
  ["音频→Base64", "audB64"], ["MIDI 解析", "midi"],
  ["波形生成", "wave"], ["频谱图 (mock)", "spec"],
  ["噪声生成", "noise"], ["白噪", "wht"], ["粉噪", "pnk"], ["棕噪", "brn"]
].forEach(([name, k]) => T({
  cat: "声音音频", icon: "🎵", name, desc: name,
  tpl: "form", kind: "audio", key: k,
  tags: ["声音", "音频", k]
}));

// 输出实际数量
window.TOOL_COUNT = TOOL_DEFS.length;
