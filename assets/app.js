/* =========================================
   SkillBox — 工具导航 + 同质化检索索引
   ========================================= */

const NAV = [
  {
    title: "概览",
    items: [
      { name: "首页",         icon: "🏠", href: "/index.html" },
      { name: "🔍 同质化检索", icon: "🔍", href: "/search.html" }
    ]
  },
  {
    title: "文本处理 (10)",
    items: [
      { name: "字符统计",          icon: "🔢", href: "/tools/text/stats.html",     tags: ["统计","字数","词数","行数","字节","字符","text","count"] },
      { name: "格式转换",          icon: "🔁", href: "/tools/text/format.html",    tags: ["json","yaml","csv","xml","转换","format"] },
      { name: "文本对比 Diff",     icon: "🆚", href: "/tools/text/diff.html",      tags: ["对比","差异","diff","文本","比较"] },
      { name: "Markdown 实时预览", icon: "📝", href: "/tools/text/markdown.html",  tags: ["markdown","md","预览","排版"] },
      { name: "大小写转换",        icon: "🔤", href: "/tools/text/case.html",      tags: ["大小写","驼峰","下划线","case","camel","snake","kebab"] },
      { name: "批量查找替换",      icon: "🔍", href: "/tools/text/replace.html",   tags: ["替换","查找","正则","regex","replace"] },
      { name: "Base64 编解码",     icon: "🔐", href: "/tools/text/base64.html",    tags: ["base64","编码","解码","encode","decode","加密"] },
      { name: "URL 编解码",        icon: "🌐", href: "/tools/text/urlcode.html",   tags: ["url","编码","百分比","encode","decode","encodeURI"] },
      { name: "正则测试",          icon: ".*", href: "/tools/text/regex.html",     tags: ["正则","regex","匹配","tester","pattern"] },
      { name: "文本去重 / 排序",   icon: "🧹", href: "/tools/text/dedup.html",     tags: ["去重","排序","重复","sort","unique"] }
    ]
  },
  {
    title: "数据可视化 (10)",
    items: [
      { name: "柱状图",        icon: "📊", href: "/tools/viz/bar.html",      tags: ["柱状","bar","对比","分类","chart"] },
      { name: "折线图",        icon: "📈", href: "/tools/viz/line.html",     tags: ["折线","line","趋势","时间"] },
      { name: "饼图 / 环形图", icon: "🥧", href: "/tools/viz/pie.html",      tags: ["饼图","环形","pie","占比","比例"] },
      { name: "散点图",        icon: "✨", href: "/tools/viz/scatter.html",  tags: ["散点","scatter","相关性","分布"] },
      { name: "雷达图",        icon: "🛡", href: "/tools/viz/radar.html",   tags: ["雷达","radar","多维","能力"] },
      { name: "热力图",        icon: "🔥", href: "/tools/viz/heatmap.html",  tags: ["热力","heatmap","矩阵","密度"] },
      { name: "词云",          icon: "☁️",  href: "/tools/viz/wordcloud.html", tags: ["词云","wordcloud","关键词","高频"] },
      { name: "漏斗图",        icon: "🔻", href: "/tools/viz/funnel.html",   tags: ["漏斗","funnel","转化","流程"] },
      { name: "桑基图",        icon: "🌊", href: "/tools/viz/sankey.html",   tags: ["桑基","sankey","流向","流量"] },
      { name: "仪表盘",        icon: "🎯", href: "/tools/viz/gauge.html",    tags: ["仪表盘","gauge","进度","完成度"] }
    ]
  },
  {
    title: "实用工具 (10)",
    items: [
      { name: "调色器",          icon: "🎨", href: "/tools/util/color.html",      tags: ["颜色","色板","调色","hex","rgb","hsl","color"] },
      { name: "二维码生成",      icon: "🔲", href: "/tools/util/qrcode.html",     tags: ["二维码","qr","qrcode"] },
      { name: "JSON 格式化",     icon: "{ }", href: "/tools/util/json.html",     tags: ["json","格式化","美化","压缩","校验"] },
      { name: "时间戳转换",      icon: "⏰", href: "/tools/util/timestamp.html", tags: ["时间戳","timestamp","日期","时间","unix"] },
      { name: "UUID 生成",       icon: "🆔", href: "/tools/util/uuid.html",      tags: ["uuid","guid","唯一标识"] },
      { name: "密码生成",        icon: "🔑", href: "/tools/util/password.html",  tags: ["密码","password","随机","强密码"] },
      { name: "图片→Base64",     icon: "🖼", href: "/tools/util/img2b64.html",   tags: ["图片","base64","image","dataurl"] },
      { name: "计算器",          icon: "🧮", href: "/tools/util/calc.html",      tags: ["计算器","calculator","数学","运算"] },
      { name: "番茄钟",          icon: "🍅", href: "/tools/util/pomodoro.html",  tags: ["番茄钟","pomodoro","计时","专注","番茄"] },
      { name: "随机数 / 抽样",   icon: "🎲", href: "/tools/util/random.html",    tags: ["随机数","random","抽样","抽奖"] }
    ]
  },
  {
    title: "图片工具 (5)",
    items: [
      { name: "图片压缩",        icon: "🗜", href: "/tools/image/compress.html", tags: ["图片","压缩","image","compress","jpg","png","webp"] },
      { name: "图片缩放",        icon: "↔️",  href: "/tools/image/resize.html",  tags: ["图片","缩放","尺寸","resize","image"] },
      { name: "格式转换 PNG/JPG/WebP", icon: "🔄", href: "/tools/image/convert.html", tags: ["图片","格式","转换","png","jpg","webp","image"] },
      { name: "图片裁剪",        icon: "✂", href: "/tools/image/crop.html",    tags: ["图片","裁剪","crop","image"] },
      { name: "图片水印",        icon: "💧", href: "/tools/image/watermark.html", tags: ["图片","水印","watermark","image"] }
    ]
  },
  {
    title: "加解密 (6)",
    items: [
      { name: "哈希 MD5/SHA",    icon: "#️⃣", href: "/tools/crypto/hash.html",   tags: ["哈希","hash","md5","sha1","sha256","摘要"] },
      { name: "HMAC 签名",       icon: "🪪", href: "/tools/crypto/hmac.html",   tags: ["hmac","签名","signature","加签"] },
      { name: "AES 加解密",      icon: "🛡", href: "/tools/crypto/aes.html",    tags: ["aes","对称加密","加密","解密"] },
      { name: "JWT 解码",        icon: "🎫", href: "/tools/crypto/jwt.html",    tags: ["jwt","token","解码","decode"] },
      { name: "密码强度评估",    icon: "💪", href: "/tools/crypto/strength.html", tags: ["密码","强度","评估","crack"] },
      { name: "随机密钥生成",    icon: "🗝", href: "/tools/crypto/keygen.html", tags: ["密钥","key","生成","rsa"] }
    ]
  },
  {
    title: "网络 / 开发 (7)",
    items: [
      { name: "URL 解析",        icon: "🧭", href: "/tools/net/url.html",       tags: ["url","解析","parse","query","参数"] },
      { name: "IP 信息查询",     icon: "📍", href: "/tools/net/ip.html",        tags: ["ip","地址","查询","查询ip"] },
      { name: "HTTP 状态码",     icon: "🩺", href: "/tools/net/http.html",      tags: ["http","状态码","status","code"] },
      { name: "子网计算",        icon: "🕸", href: "/tools/net/subnet.html",    tags: ["子网","subnet","掩码","cidr","网络"] },
      { name: "Cron 解析",       icon: "⏱", href: "/tools/dev/cron.html",      tags: ["cron","表达式","定时","schedule"] },
      { name: "进制转换",        icon: "🔢", href: "/tools/dev/base.html",      tags: ["进制","binary","hex","octal","转换"] },
      { name: "ASCII 表",        icon: "🔤", href: "/tools/dev/ascii.html",     tags: ["ascii","字符集","编码表"] }
    ]
  },
  {
    title: "代码 / 数据 (6)",
    items: [
      { name: "JSON → 代码",     icon: "🧬", href: "/tools/code/json2code.html",  tags: ["json","代码","类","class","typescript","go","java"] },
      { name: "代码格式化",      icon: "✨", href: "/tools/code/format.html",    tags: ["代码","格式化","format","美化","beautify"] },
      { name: "代码压缩",        icon: "🪶", href: "/tools/code/minify.html",    tags: ["压缩","minify","js","css","html"] },
      { name: "CSV ↔ JSON",      icon: "🔁", href: "/tools/data/csvjson.html",   tags: ["csv","json","转换","表格"] },
      { name: "数据表格查看",    icon: "📋", href: "/tools/data/table.html",     tags: ["表格","table","查看","分页","排序"] },
      { name: "颜色代码转换",    icon: "🎯", href: "/tools/code/colorcode.html", tags: ["颜色","hex","rgb","hsl","oklch","color"] }
    ]
  },
  {
    title: "数学 / 生活 (6)",
    items: [
      { name: "统计计算器",      icon: "📐", href: "/tools/math/stats.html",     tags: ["统计","均值","方差","标准差","平均","statistics"] },
      { name: "BMI 计算",        icon: "⚖", href: "/tools/life/bmi.html",       tags: ["bmi","体重","身高","健康","体质"] },
      { name: "BMR / TDEE",      icon: "🔥", href: "/tools/life/bmr.html",       tags: ["bmr","tdee","代谢","热量","卡路里"] },
      { name: "工作日计算",      icon: "🗓", href: "/tools/life/workdays.html",  tags: ["工作日","日期","workdays","计算"] },
      { name: "世界时钟",        icon: "🌍", href: "/tools/life/clock.html",     tags: ["时区","世界时钟","timezone","时间"] },
      { name: "倒计时",          icon: "⏳", href: "/tools/life/countdown.html", tags: ["倒计时","countdown","定时器","事件"] }
    ]
  }
];

// ============ 同质化检索索引 ============
// 标签聚类：每个标签可关联多个工具 — 同质化即"功能相近的工具"
const TAG_INDEX = (() => {
  const map = {};
  NAV.forEach(g => g.items.forEach(it => {
    (it.tags || []).forEach(t => {
      const k = t.toLowerCase();
      if (!map[k]) map[k] = [];
      map[k].push({ name: it.name, href: it.href, icon: it.icon });
    });
  }));
  return map;
})();

const TOOL_INDEX = (() => {
  const all = [];
  NAV.forEach(g => g.items.forEach(it => all.push(it)));
  return all;
})();

// 给定关键词，返回 (精确匹配 / 标签匹配 / 模糊匹配) 三种结果
function homogenizedSearch(q) {
  q = (q || "").trim().toLowerCase();
  if (!q) return { exact: [], tag: [], fuzzy: [], byCluster: {} };

  const exact = [];
  const tag = [];
  const fuzzy = [];
  const matchedTags = new Set();

  for (const it of TOOL_INDEX) {
    const name = it.name.toLowerCase();
    const tags = (it.tags || []).map(t => t.toLowerCase());
    if (name.includes(q) || q.includes(name)) exact.push(it);
    else if (tags.some(t => t.includes(q) || q.includes(t))) {
      tag.push(it);
      tags.forEach(t => { if (t.includes(q) || q.includes(t)) matchedTags.add(t); });
    }
    else if ((it.tags || []).join(" ").toLowerCase().includes(q) || name.split(/\s+/).some(w => w.startsWith(q))) {
      fuzzy.push(it);
    }
  }

  // 同质化聚类：找与命中标签相关的所有工具
  const byCluster = {};
  matchedTags.forEach(t => {
    byCluster[t] = TAG_INDEX[t] || [];
  });

  return { exact, tag, fuzzy, byCluster };
}

// 渲染侧边栏
function renderSidebar(activeHref) {
  const sb = document.getElementById("sidebar");
  if (!sb) return;

  const groups = NAV.map(g => {
    const items = g.items.map(it => {
      const active = activeHref === it.href ? "active" : "";
      return `<a class="nav-item ${active}" href="${it.href}"><span class="nav-icon">${it.icon}</span><span>${it.name}</span></a>`;
    }).join("");
    return `
      <div class="nav-group">
        <div class="nav-title">${g.title}</div>
        ${items}
      </div>`;
  }).join("");

  sb.innerHTML = `
    <div class="brand">
      <div class="brand-logo">SB</div>
      <div>
        <div class="brand-name">SkillBox</div>
        <div class="brand-sub">${totalTools()} 个在线工具</div>
      </div>
    </div>
    <input id="searchBox" class="search" placeholder="🔎 搜索工具 / 同质化..." />
    ${groups}
  `;

  const search = document.getElementById("searchBox");
  search.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".nav-item").forEach(a => {
      a.style.display = a.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

function totalTools() {
  return NAV.reduce((s, g) => s + g.items.length, 0) - 2; // 减去首页 + 检索
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast("已复制到剪贴板"));
  } else {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); ta.remove();
    toast("已复制");
  }
}

function downloadFile(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
}
