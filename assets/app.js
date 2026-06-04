/* =========================================
   SkillBox — 工具导航配置（与侧边栏联动）
   ========================================= */

const NAV = [
  {
    title: "概览",
    items: [
      { name: "首页", icon: "🏠", href: "/index.html" }
    ]
  },
  {
    title: "文本处理",
    items: [
      { name: "字符统计",       icon: "🔢", href: "/tools/text/stats.html" },
      { name: "格式转换",       icon: "🔁", href: "/tools/text/format.html" },
      { name: "文本对比 Diff",  icon: "🆚", href: "/tools/text/diff.html" },
      { name: "Markdown 实时预览", icon: "📝", href: "/tools/text/markdown.html" },
      { name: "大小写转换",     icon: "🔤", href: "/tools/text/case.html" },
      { name: "批量查找替换",   icon: "🔍", href: "/tools/text/replace.html" },
      { name: "Base64 编解码",  icon: "🔐", href: "/tools/text/base64.html" },
      { name: "URL 编解码",     icon: "🌐", href: "/tools/text/urlcode.html" },
      { name: "正则测试",       icon: ".*", href: "/tools/text/regex.html" },
      { name: "文本去重 / 排序", icon: "🧹", href: "/tools/text/dedup.html" }
    ]
  },
  {
    title: "数据可视化",
    items: [
      { name: "柱状图",         icon: "📊", href: "/tools/viz/bar.html" },
      { name: "折线图",         icon: "📈", href: "/tools/viz/line.html" },
      { name: "饼图 / 环形图",  icon: "🥧", href: "/tools/viz/pie.html" },
      { name: "散点图",         icon: "✨", href: "/tools/viz/scatter.html" },
      { name: "雷达图",         icon: "🛡", href: "/tools/viz/radar.html" },
      { name: "热力图",         icon: "🔥", href: "/tools/viz/heatmap.html" },
      { name: "词云",           icon: "☁️",  href: "/tools/viz/wordcloud.html" },
      { name: "漏斗图",         icon: "🔻", href: "/tools/viz/funnel.html" },
      { name: "桑基图",         icon: "🌊", href: "/tools/viz/sankey.html" },
      { name: "仪表盘",         icon: "🎯", href: "/tools/viz/gauge.html" }
    ]
  },
  {
    title: "实用工具",
    items: [
      { name: "调色器",         icon: "🎨", href: "/tools/util/color.html" },
      { name: "二维码生成",     icon: "🔲", href: "/tools/util/qrcode.html" },
      { name: "JSON 格式化",    icon: "{ }", href: "/tools/util/json.html" },
      { name: "时间戳转换",     icon: "⏰", href: "/tools/util/timestamp.html" },
      { name: "UUID 生成",      icon: "🆔", href: "/tools/util/uuid.html" },
      { name: "密码生成",       icon: "🔑", href: "/tools/util/password.html" },
      { name: "图片→Base64",    icon: "🖼", href: "/tools/util/img2b64.html" },
      { name: "计算器",         icon: "🧮", href: "/tools/util/calc.html" },
      { name: "番茄钟",         icon: "🍅", href: "/tools/util/pomodoro.html" },
      { name: "随机数 / 抽样",  icon: "🎲", href: "/tools/util/random.html" }
    ]
  }
];

// 渲染侧边栏
function renderSidebar(activeHref) {
  const sb = document.getElementById("sidebar");
  if (!sb) return;

  const groups = NAV.map(g => {
    const items = g.items.map(it => {
      const active = activeHref === it.href ? "active" : "";
      const icon = g.title === "正则测试" || g.title === "实用工具" ? it.icon : it.icon;
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
    <input id="searchBox" class="search" placeholder="🔎 搜索工具..." />
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
  return NAV.reduce((s, g) => s + g.items.length, 0) - 1; // 减去首页
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
