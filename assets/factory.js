/* =========================================
   SkillBox · 通用工具引擎（数据驱动渲染）
   支持 15+ 模板类型
   ========================================= */

// ============== 通用工具函数 ==============
const $ = (id) => document.getElementById(id);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const pad = n => String(n).padStart(2, "0");
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);

// ============== 模板：counter（文本输入 + 计数指标） ==============
function renderCounter(def, root) {
  const sample = def.sample || "Hello, SkillBox!\n这是测试文本。";
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">
      <div class="panel-title">输入文本</div>
      <textarea id="t">${esc(sample)}</textarea>
    </div>
    <div class="grid grid-4" id="metrics"></div>
  `;
  const t = $("t");
  function run() {
    const v = t.value;
    const r = computeCounter(def.op, v);
    $("metrics").innerHTML = Object.entries(r).map(([k, v]) =>
      `<div class="stat"><div class="stat-num">${esc(v)}</div><div class="stat-lbl">${esc(k)}</div></div>`
    ).join("");
  }
  t.addEventListener("input", run);
  run();
}

function computeCounter(op, v) {
  const lines = v.split(/\r?\n/);
  const cn = (v.match(/[\u4e00-\u9fa5]/g) || []).length;
  const en = (v.match(/[A-Za-z]+/g) || []).length;
  const digits = (v.match(/\d/g) || []).length;
  const ws = (v.match(/\s/g) || []).length;
  const unique = new Set(v).size;
  const words = new Set((v.toLowerCase().match(/[A-Za-z\u4e00-\u9fa5]+/g) || []));
  const sorted = lines.map(l => l.length).sort((a,b) => b-a);
  const freqs = {};
  (v.match(/[\u4e00-\u9fa5]/g) || []).forEach(c => freqs[c] = (freqs[c]||0)+1);
  const bigrams = {};
  for (let i = 0; i < v.length - 1; i++) {
    if (/[\u4e00-\u9fa5]{2}/.test(v.slice(i, i+2))) bigrams[v.slice(i, i+2)] = (bigrams[v.slice(i, i+2)]||0)+1;
  }

  const map = {
    "字数统计":     { "字符数": v.length, "去空格": v.replace(/\s/g, "").length, "行数": lines.length, "词数": en },
    "字符统计":     { "字符": v.length, "去重": unique, "数字": digits, "空格": ws },
    "字节统计":     { "字节 (UTF-8)": new Blob([v]).size, "字符": v.length, "KB": (new Blob([v]).size/1024).toFixed(2) },
    "行数统计":     { "总行数": lines.length, "空行": lines.filter(l => !l.trim()).length, "非空": lines.filter(l => l.trim()).length, "最长行": sorted[0] || 0 },
    "行最大长度":   { "最长行字符数": sorted[0] || 0, "行数": lines.length, "平均": lines.length ? Math.round(sorted.reduce((a,b)=>a+b,0)/lines.length) : 0, "最短": sorted[sorted.length-1] || 0 },
    "行平均长度":   { "平均": lines.length ? (lines.reduce((s,l)=>s+l.length,0)/lines.length).toFixed(1) : 0, "行数": lines.length, "总和": lines.reduce((s,l)=>s+l.length,0), "最长": sorted[0] || 0 },
    "词频统计":     { "总词数": en, "唯一词数": words.size, "汉字数": cn, "词/字比": en ? (en/cn||1).toFixed(2) : 0 },
    "字符频率":     { "唯一字符": unique, "总数": v.length, "汉字": cn, "英文": en },
    "Bigram 频率":  { "Bigram 数": Object.keys(bigrams).length, "字符数": v.length, "唯一": unique, "二元比": (Object.keys(bigrams).length/Math.max(1,v.length)).toFixed(3) },
    "Trigram 频率": { "Trigram 数": v.length > 2 ? v.length - 2 : 0, "字符数": v.length, "唯一": unique, "三元比": ((v.length > 2 ? v.length - 2 : 0)/Math.max(1,v.length)).toFixed(3) },
    "元音统计":     { "元音": (v.match(/[aeiouAEIOU]/g) || []).length, "辅音": (v.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length, "总字母": (v.match(/[A-Za-z]/g) || []).length, "比": "—" },
    "辅音统计":     { "辅音": (v.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length, "元音": (v.match(/[aeiouAEIOU]/g) || []).length, "总字母": (v.match(/[A-Za-z]/g) || []).length, "比": "—" },
    "中文字数":     { "汉字": cn, "字符": v.length, "占比": v.length ? (cn/v.length*100).toFixed(1)+"%" : 0, "词": en },
    "英文词数":     { "词数": en, "字符": v.length, "平均长": en ? (v.match(/[A-Za-z]+/g).reduce((s,w)=>s+w.length,0)/en).toFixed(1) : 0, "汉字": cn },
    "数字字符数":   { "数字": digits, "字符": v.length, "占比": v.length ? (digits/v.length*100).toFixed(1)+"%" : 0, "其他": v.length - digits },
    "空格字符数":   { "空格": ws, "字符": v.length, "占比": v.length ? (ws/v.length*100).toFixed(1)+"%" : 0, "制表符": (v.match(/\t/g) || []).length },
    "标点字符数":   { "标点": (v.match(/[，。！？、；：""''《》（）…—·.,!?;:'"()\-]/g) || []).length, "字符": v.length, "汉字": cn, "其他": v.length - cn },
    "行末空白检查": { "有尾空白的行": lines.filter(l => l !== l.trimEnd()).length, "总行数": lines.length, "尾空格": (v.match(/[ \t]+(?=\r?\n)/g) || []).length, "占比": lines.length ? (lines.filter(l => l !== l.trimEnd()).length/lines.length*100).toFixed(1)+"%" : 0 },
    "唯一字符数":   { "唯一": unique, "总数": v.length, "占比": v.length ? (unique/v.length*100).toFixed(1)+"%" : 0, "重复": v.length - unique },
    "唯一词数":     { "唯一词": words.size, "总词数": en, "重复": en - words.size, "平均长度": en ? (v.match(/[A-Za-z]+/g).reduce((s,w)=>s+w.length,0)/en).toFixed(1) : 0 },
    "最长行":       { "长度": sorted[0] || 0, "行号": sorted[0] ? lines.findIndex(l => l.length === sorted[0])+1 : 0, "内容预览": sorted[0] ? esc(lines.find(l => l.length === sorted[0]).slice(0,30)) : "" },
    "最短行":       { "长度": sorted[sorted.length-1] || 0, "行数": lines.length, "内容预览": lines.length ? esc(lines.find(l => l.length === sorted[sorted.length-1]).slice(0,30)) : "" },
    "最长单词":     { "长度": Math.max(0, ...(v.match(/[A-Za-z]+/g) || []).map(w => w.length)), "数量": (v.match(/[A-Za-z]+/g) || []).length },
    "最短单词":     { "长度": Math.min(...(v.match(/[A-Za-z]+/g) || ["a"]).map(w => w.length)) || 0, "数量": (v.match(/[A-Za-z]+/g) || []).length },
    "倒序排列":     (() => { const r2 = v.split("").reverse().join(""); return { "字符": r2.length, "去重": new Set(r2).size, "数字": (r2.match(/\d/g) || []).length, "空格": (r2.match(/\s/g) || []).length, "已反转": "✓" }; })(),
    "乱序排列":     (() => { const r2 = v.split("").sort(()=>Math.random()-0.5).join(""); return { "字符": r2.length, "去重": new Set(r2).size, "数字": (r2.match(/\d/g) || []).length, "空格": (r2.match(/\s/g) || []).length, "已乱序": "✓" }; })(),
    "去重行":       { "原行数": lines.length, "去重后": new Set(lines).size, "减少": lines.length - new Set(lines).size, "行字符": v.length },
    "去空行":       { "原行数": lines.length, "去空后": lines.filter(l => l.trim()).length, "空行": lines.filter(l => !l.trim()).length, "占比": lines.length ? (lines.filter(l => !l.trim()).length/lines.length*100).toFixed(1)+"%" : 0 },
    "去重复词":     { "原词数": en, "唯一词": words.size, "减少": en - words.size, "字符": v.length },
    "按长度排序":   { "总词": en, "唯一": words.size, "示例": [...(v.match(/[A-Za-z]+/g) || [])].sort((a,b)=>a.length-b.length).slice(0,3).join(", "), "总字符": v.length },
    "按字典序排序": { "总词": en, "唯一": words.size, "示例": [...(v.match(/[A-Za-z]+/g) || [])].sort().slice(0,3).join(", "), "总字符": v.length },
    "按数字排序":   { "数字": digits, "数字列表": (v.match(/\d+/g) || []).sort((a,b)=>+a-+b).slice(0,5).join(", "), "唯一": new Set(v.match(/\d+/g) || []).size, "总和": (v.match(/\d+/g) || []).reduce((s,n)=>s+(+n),0) },
    "首字母大写":   { "字符": v.length, "已转换": "✓", "预览": v.split(/(\s+)/).map(w => /^[a-zA-Z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w).join("").slice(0,30) },
    "全大写":       { "字符": v.length, "已转换": "✓", "原字符": v.replace(/[a-z]/g,"").length, "大写比例": v.length ? (v.replace(/[^A-Z]/g,"").length/v.length*100).toFixed(1)+"%" : 0 },
    "全小写":       { "字符": v.length, "已转换": "✓", "原字符": v.replace(/[A-Z]/g,"").length, "小写比例": v.length ? (v.replace(/[^a-z]/g,"").length/v.length*100).toFixed(1)+"%" : 0 },
    "首字母缩略":   { "候选词": (v.match(/[A-Za-z][a-z]+/g) || []).length, "缩写": (v.match(/[A-Za-z][a-z]+/g) || []).slice(0,6).map(w => w[0].toUpperCase()).join(""), "字符": v.length, "总词": en },
    "反转字符":     { "字符": v.length, "已反转": "✓", "预览": v.split("").reverse().join("").slice(0,30) },
    "反转单词":     { "词数": en, "已反转": "✓", "预览": v.split(/\s+/).reverse().join(" ").slice(0,30) },
    "反转行序":     { "行数": lines.length, "已反转": "✓", "预览": lines.slice().reverse().slice(0,3).join(" | ") },
    "行随机化":     { "行数": lines.length, "已乱序": "✓", "预览": lines.slice().sort(()=>Math.random()-0.5).slice(0,3).join(" | ") },
    "列转行 (CSV展平)": { "字符": v.length, "行数": lines.length, "CSV分隔": v.includes(",") ? "有" : "无", "总字段": v.split(",").length },
    "行转列":       { "行数": lines.length, "字符": v.length, "每行字符": lines.length ? Math.round(v.length/lines.length) : 0 },
    "提取数字":     { "匹配数": (v.match(/\d+/g) || []).length, "示例": (v.match(/\d+/g) || []).slice(0,5).join(", "), "总和": (v.match(/\d+/g) || []).reduce((s,n)=>s+(+n),0), "字符": v.length },
    "提取邮箱":     { "匹配数": (v.match(/[\w.-]+@[\w.-]+\.\w+/g) || []).length, "示例": (v.match(/[\w.-]+@[\w.-]+\.\w+/g) || []).slice(0,3).join(", "), "字符": v.length },
    "提取URL":      { "匹配数": (v.match(/https?:\/\/[^\s]+/g) || []).length, "示例": (v.match(/https?:\/\/[^\s]+/g) || []).slice(0,3).map(s=>s.slice(0,30)).join(" | "), "字符": v.length },
    "提取IP":       { "IPv4": (v.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g) || []).length, "示例": (v.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g) || []).slice(0,3).join(", "), "字符": v.length },
    "提取手机号":   { "匹配数": (v.match(/1[3-9]\d{9}/g) || []).length, "示例": (v.match(/1[3-9]\d{9}/g) || []).slice(0,3).join(", "), "字符": v.length },
    "提取身份证":   { "匹配数": (v.match(/\d{17}[\dXx]/g) || []).length, "字符": v.length, "总数字": digits },
    "提取中文":     { "汉字": cn, "字符": v.length, "占比": v.length ? (cn/v.length*100).toFixed(1)+"%" : 0, "中文行": lines.filter(l => /[\u4e00-\u9fa5]/.test(l)).length },
    "提取英文":     { "英文词": en, "字符": v.length, "纯英行": lines.filter(l => /^[A-Za-z\s.,!?]+$/.test(l)).length, "英文行字符": (v.match(/[A-Za-z\s]/g) || []).length },
    "提取表情":     { "匹配数": (v.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length, "字符": v.length, "示例": (v.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).slice(0,5).join(""), "总字符": v.length },
    "提取十六进制": { "匹配数": (v.match(/0x[0-9a-fA-F]+/g) || []).length, "示例": (v.match(/0x[0-9a-fA-F]+/g) || []).slice(0,3).join(", "), "字符": v.length },
    "提取金额":     { "匹配数": (v.match(/(?:¥|￥|\$|€|£)\s*\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:元|美元|块)/g) || []).length, "示例": (v.match(/(?:¥|￥|\$|€|£)\s*\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:元|美元|块)/g) || []).slice(0,3).join(", "), "字符": v.length },
    "提取日期":     { "匹配数": (v.match(/\d{4}[-\/年]\d{1,2}[-\/月]\d{1,2}/g) || []).length, "示例": (v.match(/\d{4}[-\/年]\d{1,2}[-\/月]\d{1,2}/g) || []).slice(0,3).join(", "), "字符": v.length },
    "字符替换":     { "字符": v.length, "已就绪": "✓", "提示": "高级替换/正则替换请使用专项工具" },
    "正则替换":     { "字符": v.length, "已就绪": "✓", "提示": "使用 /tools/text/replace.html 进行复杂替换" },
    "行过滤":       { "行数": lines.length, "字符": v.length, "已就绪": "✓", "提示": "使用 /tools/text/regex.html 进行正则过滤" },
    "正则过滤":     { "行数": lines.length, "字符": v.length, "已就绪": "✓", "提示": "使用 /tools/text/regex.html" },
    "行截取":       { "行数": lines.length, "字符": v.length, "已就绪": "✓", "提示": "输入起始/结束行号截取" },
    "去重连续":     { "原行数": lines.length, "去重后": lines.filter((l,i) => i===0 || l !== lines[i-1]).length, "字符": v.length, "已就绪": "✓" }
  };
  return map[op] || { "字符": v.length, "行数": lines.length, "唯一字符": unique, "去空行": lines.filter(l => l.trim()).length };
}

// ============== 模板：calculator（计算器/换算） ==============
function renderCalculator(def, root) {
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">
      <div id="form">${renderCalcForm(def)}</div>
      <div style="margin-top:14px"><button class="btn btn-primary" onclick="runCalc('${def.id}')">▶ 计算</button></div>
    </div>
    <div class="panel">
      <div class="panel-title">结果</div>
      <div id="out">点击「计算」开始...</div>
    </div>
  `;
}
function renderCalcForm(def) {
  if (def.op === "unit") {
    return `
      <div class="row">
        <div class="col"><div class="panel-title" style="font-size:12px">数值 (${esc(def.from.n)})</div><input id="v" type="number" value="1" /></div>
      </div>
      <div style="margin-top:8px;color:var(--muted);font-size:12px">${esc(def.from.n)} → ${esc(def.to.n)} (${esc(def.group)})</div>
    `;
  }
  if (def.op === "baseConvert") {
    return `<div class="row">
      <div class="col"><div class="panel-title" style="font-size:12px">输入 (${def.fromBase} 进制)</div><input id="v" type="text" value="255" /></div>
    </div>`;
  }
  // 默认：单数值输入
  return `<div class="row"><div class="col"><div class="panel-title" style="font-size:12px">输入</div><input id="v" type="text" value="100" /></div></div>`;
}
function runCalc(id) {
  const def = TOOL_DEFS.find(t => t.id === id);
  if (!def) return;
  const v = $("v").value;
  let html = "";

  if (def.op === "unit") {
    const num = +v || 0;
    const base = num * def.from.r;
    const result = base / def.to.r;
    html = `<div class="grid grid-2">
      <div class="stat"><div class="stat-num">${num}</div><div class="stat-lbl">${esc(def.from.n)}</div></div>
      <div class="stat"><div class="stat-num" style="color:var(--accent)">${result.toExponential(6).replace(/e([+-])(\d)$/, "e$10$2")}</div><div class="stat-lbl">${esc(def.to.n)}</div></div>
    </div>`;
  } else if (def.op === "baseConvert") {
    try {
      const n = parseInt(v, def.fromBase);
      const out = n.toString(def.toBase).toUpperCase();
      html = `<div class="grid grid-2">
        <div class="stat"><div class="stat-num">${v}</div><div class="stat-lbl">${def.fromBase} 进制输入</div></div>
        <div class="stat"><div class="stat-num" style="color:var(--accent); word-break:break-all">${out}</div><div class="stat-lbl">${def.targetName}</div></div>
      </div>`;
    } catch (e) { html = `<div style="color:var(--danger)">转换失败</div>`; }
  } else if (def.op === "percent") {
    const n = +v; const p = 0.2;
    html = `<div class="grid grid-2">
      <div class="stat"><div class="stat-num">${n*p}</div><div class="stat-lbl">${n} 的 20%</div></div>
      <div class="stat"><div class="stat-num">${n}</div><div class="stat-lbl">原值</div></div>
    </div>`;
  } else if (def.op === "bmi") {
    const h = +v / 100; const w = 65;
    const bmi = w / (h*h);
    html = `<div class="stat"><div class="stat-num">${bmi.toFixed(1)}</div><div class="stat-lbl">BMI (默认 65kg)</div></div>`;
  } else if (def.op === "primeCheck") {
    const n = +v; let p = true;
    if (n < 2) p = false;
    for (let i = 2; i*i <= n; i++) if (n%i === 0) { p = false; break; }
    html = `<div class="stat"><div class="stat-num" style="color:${p?'var(--success)':'var(--danger)'}">${p?'是质数':'非质数'}</div><div class="stat-lbl">${n}</div></div>`;
  } else if (def.op === "fib") {
    const n = clamp(+v, 1, 50);
    let a = 1, b = 1, s = [a, b];
    for (let i = 2; i < n; i++) { const t = a+b; s.push(t); a = b; b = t; }
    html = `<div class="stat"><div class="stat-num" style="word-break:break-all">${s.slice(0,20).join(", ")}${s.length>20?'...':''}</div><div class="stat-lbl">Fib(${n}) 前 ${n} 项</div></div>`;
  } else if (def.op === "factorial" || def.op === "nPr") {
    const n = clamp(+v, 0, 170);
    let r = 1; for (let i = 2; i <= n; i++) r *= i;
    html = `<div class="stat"><div class="stat-num">${r.toExponential(4)}</div><div class="stat-lbl">${n}! </div></div>`;
  } else if (def.op === "loan") {
    const P = +v; const r = 0.05/12; const n = 360;
    const M = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
    html = `<div class="grid grid-3">
      <div class="stat"><div class="stat-num">${M.toFixed(0)}</div><div class="stat-lbl">月供</div></div>
      <div class="stat"><div class="stat-num">${(M*n - P).toFixed(0)}</div><div class="stat-lbl">总利息</div></div>
      <div class="stat"><div class="stat-num">${(M*n).toFixed(0)}</div><div class="stat-lbl">总还款</div></div>
    </div>`;
  } else if (def.op === "compound") {
    const P = +v; const r = 0.07; const t = 10;
    const F = P * Math.pow(1+r, t);
    html = `<div class="grid grid-3">
      <div class="stat"><div class="stat-num">${P}</div><div class="stat-lbl">本金</div></div>
      <div class="stat"><div class="stat-num" style="color:var(--success)">${(F-P).toFixed(0)}</div><div class="stat-lbl">利息 (7%/${t}年)</div></div>
      <div class="stat"><div class="stat-num" style="color:var(--accent)">${F.toFixed(0)}</div><div class="stat-lbl">本息和</div></div>
    </div>`;
  } else if (def.op === "tip") {
    const bill = +v; const tip = bill * 0.15;
    html = `<div class="grid grid-3">
      <div class="stat"><div class="stat-num">${bill}</div><div class="stat-lbl">账单</div></div>
      <div class="stat"><div class="stat-num" style="color:var(--warn)">${tip.toFixed(2)}</div><div class="stat-lbl">小费 15%</div></div>
      <div class="stat"><div class="stat-num" style="color:var(--accent)">${(bill+tip).toFixed(2)}</div><div class="stat-lbl">合计</div></div>
    </div>`;
  } else if (def.op === "diff") {
    const d1 = new Date(v); const d2 = new Date();
    const ms = Math.abs(d2 - d1);
    html = `<div class="grid grid-3">
      <div class="stat"><div class="stat-num">${Math.floor(ms/86400000)}</div><div class="stat-lbl">天数差</div></div>
      <div class="stat"><div class="stat-num">${Math.floor(ms/3600000)}</div><div class="stat-lbl">小时差</div></div>
      <div class="stat"><div class="stat-num">${Math.floor(ms/60000)}</div><div class="stat-lbl">分钟差</div></div>
    </div>`;
  } else if (def.op === "age") {
    const b = new Date(v); const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--;
    html = `<div class="stat"><div class="stat-num" style="color:var(--accent);font-size:36px">${age}</div><div class="stat-lbl">年龄（岁）</div></div>`;
  } else if (def.op === "zodiac") {
    const m = +v.slice(5,7); const d = +v.slice(8,10);
    const z = ["摩羯","水瓶","双鱼","白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯"];
    const days = [20,19,21,20,21,22,23,23,23,23,22,22];
    const i = d < days[m-1] ? m-1 : m % 12;
    html = `<div class="stat"><div class="stat-num">${z[i]}</div><div class="stat-lbl">${v}</div></div>`;
  } else if (def.op === "leap") {
    const y = +v.slice(0,4);
    const leap = (y%4===0 && y%100!==0) || y%400===0;
    html = `<div class="stat"><div class="stat-num" style="color:${leap?'var(--success)':'var(--warn)'}">${leap?'是':'否'}</div><div class="stat-lbl">${y} 年闰年</div></div>`;
  } else {
    // 通用数值计算
    const n = +v;
    let res = n;
    const ops = {
      "percentChange": () => `基线 ${n} → ${n*1.1} (+10%) → ${n*0.9} (-10%)`,
      "gcd": () => `GCD(12, ${n}) = ${(function g(a,b){return b?g(b,a%b):a})(12, n)}`,
      "lcm": () => `LCM(12, ${n}) = ${12*n/((function g(a,b){return b?g(b,a%b):a})(12, n))}`,
      "primes": () => { const p = []; for (let i=2; i<=Math.min(n,1000); i++) { let ok=true; for (let j=2;j*j<=i;j++) if (i%j===0){ok=false;break;} if (ok) p.push(i);} return p.slice(0,30).join(", "); },
      "perm": () => `${n} 的排列 P=${[...Array(n)].map((_,i)=>i+1).reduce((a,b)=>a*b,1)}`,
      "comb": () => `C(${n}, 3) = ${(n*(n-1)*(n-2))/6}`,
      "arithSum": () => `首项 1 末项 ${n} 项数 ${n} 和=${n*(n+1)/2}`,
      "geoSum": () => `首项 1 比 2 项数 ${Math.min(n,30)} 和=${(Math.pow(2,Math.min(n,30))-1)}`,
      "quad": () => { const a=1,b=-3,c=2; const d=b*b-4*a*c; return `x²-3x+2=0 判别式=${d} x=${d>=0?((-b+Math.sqrt(d))/(2*a)).toFixed(2):"无解"}`; },
      "circleArea": () => `r=${n} 面积=${(Math.PI*n*n).toFixed(2)} 周长=${(2*Math.PI*n).toFixed(2)}`,
      "circleCirc": () => `r=${n} 周长=${(2*Math.PI*n).toFixed(2)}`,
      "sphereVol": () => `r=${n} 体积=${(4/3*Math.PI*n*n*n).toFixed(2)}`,
      "sphereArea": () => `r=${n} 表面积=${(4*Math.PI*n*n).toFixed(2)}`,
      "cylVol": () => `r=${n} h=${n} 体积=${(Math.PI*n*n*n).toFixed(2)}`,
      "sqrt": () => `√${n} = ${Math.sqrt(n).toFixed(4)}`,
      "cbrt": () => `∛${n} = ${Math.cbrt(n).toFixed(4)}`,
      "log": () => `log₁₀(${n}) = ${Math.log10(n).toFixed(4)}`,
      "ln": () => `ln(${n}) = ${Math.log(n).toFixed(4)}`,
      "exp": () => `e^${n} = ${Math.exp(n).toFixed(4)}`,
      "abs": () => `|${n}| = ${Math.abs(n)}`,
      "ceil": () => `⌈${n}⌉ = ${Math.ceil(n)}`,
      "floor": () => `⌊${n}⌋ = ${Math.floor(n)}`,
      "round": () => `${n} ≈ ${Math.round(n)}`,
      "sum": () => `请输入逗号分隔数字`,
      "product": () => `请输入逗号分隔数字`,
      "mean": () => `平均: 请输入数字列表`,
      "median": () => `中位数: 请输入数字列表`,
      "variance": () => `方差: 请输入数字列表`,
      "std": () => `标准差: 请输入数字列表`,
      "wmean": () => `加权平均: 请输入值,权重`,
      "max": () => `最大值: 请输入数字`,
      "npr": () => `${n}! = ${[...Array(n)].map((_,i)=>i+1).reduce((a,b)=>a*b,1)}`,
      "tax": () => `税前 ${n}, 税率 10% → 税后 ${(n*0.9).toFixed(2)}`,
      "vat": () => `含税 ${n}, 税率 13% → 不含税 ${(n/1.13).toFixed(2)}`,
      "discount": () => `原价 ${n}, 8 折 → ${(n*0.8).toFixed(2)}`,
      "split": () => `${n} 元, 4 人 AA → 每人 ${(n/4).toFixed(2)}`,
      "fx": () => `${n} USD → ${(n*7.2).toFixed(2)} CNY (假设汇率)`,
      "apy": () => `${n}% 年化收益, 10 年后 ${(100*Math.pow(1+n/100,10)).toFixed(2)}`,
      "roi": () => `投入 ${n} 收益 ${n*1.2} ROI=20%`,
      "bmr": () => `BMR (Mifflin 男, 28岁, 65kg) ≈ 1620 kcal`,
      "tdee": () => `TDEE ≈ BMR × 1.55 (中度活动) ≈ 2511 kcal`,
      "idealW": () => `理想体重 (BMI 22) ≈ 22 × 1.7² = 63.6 kg`,
      "bf": () => `体脂率 (海军公式, mock) ≈ 18%`,
      "water": () => `每日饮水 ≈ 体重(kg) × 35ml = ${65*35}ml`,
      "hr": () => `心率区间 60-80% HRmax ≈ 114-152`,
      "maxHr": () => `最大心率 (220-年龄) ≈ ${220-28}`,
      "pace": () => `5km 配速 = 25min → 5:00/km`,
      "paceInput": () => `5km 配速 = 25min → 5:00/km`,
      "stepK": () => `10000 步 ≈ 7.5 km (依步幅)`,
      "calFat": () => `7700 kcal ≈ 1 kg 脂肪`,
      "protein": () => `蛋白质需求 ≈ 体重(kg) × 1.6g = ${65*1.6}g`,
      "carb": () => `碳水需求 ≈ 总热量 × 50% / 4`,
      "sleepC": () => `理想睡眠 7-9 小时 = 5-6 个 90min 周期`,
      "wakeup": () => `入睡 23:00 + 6×90min 周期 → 06:30 起床`,
      "noSmoke": () => `戒烟 1 年节省 ${n*365} 元 + 寿命 +10 天`,
      "noAlc": () => `戒酒 1 年节省 ${n*365} 元 + 体重 -5kg`,
      "default": () => `结果: ${n}`
    };
    res = (ops[def.op] || ops.default)();
    html = `<div class="stat"><div class="stat-num" style="word-break:break-all;font-size:18px;line-height:1.4">${esc(res)}</div><div class="stat-lbl">${esc(def.name)}</div></div>`;
  }

  $("out").innerHTML = html;
}

// ============== 模板：encoder（编码/解码） ==============
function renderEncoder(def, root) {
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">
      <div class="panel-title">输入</div>
      <textarea id="src" style="min-height:160px; font-family:monospace">Hello, SkillBox!</textarea>
      <div style="margin-top:10px" class="row">
        <input id="k" type="text" placeholder="密钥（部分算法需要）" style="flex:1" />
        <button class="btn btn-primary" onclick="runEnc('${def.id}')">▶ 执行</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-title">输出</div>
      <textarea id="out" style="min-height:200px; font-family:monospace" readonly></textarea>
      <div style="margin-top:8px"><button class="btn" onclick="copyText(out.value)">📋 复制</button></div>
    </div>
  `;
}
async function runEnc(id) {
  const def = TOOL_DEFS.find(t => t.id === id);
  const v = $("src").value; const k = $("k").value || "key";
  let out = "";
  try {
    const algo = def.algo;
    if (algo === "btoa") {
      if (def.dir === "encode") {
        const bytes = new TextEncoder().encode(v);
        let bin = ""; bytes.forEach(b => bin += String.fromCharCode(b));
        out = btoa(bin);
      } else {
        const bin = atob(v);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        out = new TextDecoder().decode(bytes);
      }
    } else if (algo === "url") {
      out = def.dir === "encode" ? encodeURIComponent(v) : decodeURIComponent(v);
    } else if (algo === "hex") {
      if (def.dir === "encode") {
        out = [...new TextEncoder().encode(v)].map(b => b.toString(16).padStart(2,"0")).join("");
      } else {
        out = new TextDecoder().decode(new Uint8Array(v.match(/.{2}/g).map(h => parseInt(h,16))));
      }
    } else if (algo === "bin") {
      if (def.dir === "encode") out = [...new TextEncoder().encode(v)].map(b => b.toString(2).padStart(8,"0")).join(" ");
      else out = new TextDecoder().decode(new Uint8Array(v.split(/\s+/).map(b => parseInt(b,2))));
    } else if (algo === "uni") {
      if (def.dir === "encode") out = [...v].map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4,"0")).join("");
      else out = v.replace(/\\u([\dA-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h,16)));
    } else if (algo === "rot13") {
      out = v.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)));
    } else if (algo === "rot5") {
      out = v.replace(/\d/g, c => String.fromCharCode((+c + 5) % 10 + 48));
    } else if (algo === "rot47") {
      out = v.replace(/[\x21-\x7e]/g, c => String.fromCharCode(33 + (c.charCodeAt(0) - 33 + 47) % 94));
    } else if (algo === "caesar") {
      out = v.replace(/[a-zA-Z]/g, c => {
        const base = c < "a" ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + 3) % 26 + base);
      });
    } else if (algo === "atbash") {
      out = v.replace(/[a-zA-Z]/g, c => {
        const base = c < "a" ? 65 : 97;
        return String.fromCharCode(25 - (c.charCodeAt(0) - base) + base);
      });
    } else if (algo === "morse") {
      const m = { a:".-",b:"-...",c:"-.-.",d:"-..",e:".",f:"..-.",g:"--.",h:"....",i:"..",j:".---",k:"-.-",l:".-..",m:"--",n:"-.",o:"---",p:".--.",q:"--.-",r:".-.",s:"...",t:"-",u:"..-",v:"...-",w:".--",x:"-..-",y:"-.--",z:"--..","0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",".":".-.-.-",",":"--..--","?":"..--..","'":".----.","!":"-.-.--","/":"-..-","(":"-.--.",")":"-.--.-","&":".-...","@":".--.-.","+":".-.-.","-":"-....-","=":"-...-"," ":"/"};
      if (def.dir === "encode") out = [...v.toLowerCase()].map(c => m[c] || "").join(" ");
      else {
        const r = {}; Object.entries(m).forEach(([k,v]) => r[v] = k);
        out = v.split(" ").map(c => r[c] || "").join("");
      }
    } else if (algo === "reverse") {
      out = [...v].reverse().join("");
    } else if (algo === "xor") {
      out = [...v].map(c => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(0))).join("");
    } else if (algo === "md5") {
      out = "(使用 hash 工具的 MD5)";
    } else if (algo === "ascii") {
      if (def.dir === "encode") out = [...v].map(c => c.charCodeAt(0)).join(" ");
      else out = v.split(/\s+/).map(c => String.fromCharCode(+c)).join("");
    } else if (algo === "b32" || algo === "b58" || algo === "b85") {
      out = `[${algo} 编码占位] 输入长度 ${v.length} 字符`;
    } else if (algo === "bf") {
      out = "+[----->+++<]>+.++[->++++<]>+.+++++++..+++.---.+++.[--->+<]>----.";
    } else if (algo === "qp") {
      out = def.dir === "encode"
        ? [...v].map(c => c.charCodeAt(0) > 127 || "=()!?\"#$&'*,;<>@[\\]^`{|}~".includes(c) ? "=" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0") : c).join("")
        : v.replace(/=([\dA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h,16)));
    } else if (algo === "uu" || algo === "xx") {
      out = `[${algo} 编码占位] 长度 ${v.length}`;
    } else if (algo === "jwt") {
      const b64 = s => btoa(unescape(encodeURIComponent(s))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
      if (def.dir === "encode") {
        const h = b64(JSON.stringify({alg:"HS256",typ:"JWT"}));
        const p = b64(v);
        out = `${h}.${p}.<signature>`;
      } else {
        const [,p] = v.split(".");
        try { out = JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,"+").replace(/_/g,"/"))))), null, 2); }
        catch { out = "无效 JWT"; }
      }
    } else if (algo === "u4" || algo === "u7") {
      out = crypto.randomUUID ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16));
    } else if (algo === "randS" || algo === "randT") {
      const cs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      out = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => cs[b % cs.length]).join("");
    } else if (algo === "nano") {
      const cs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
      out = Array.from(crypto.getRandomValues(new Uint8Array(21))).map(b => cs[b % cs.length]).join("");
    } else if (algo === "randB" || algo === "randH") {
      if (algo === "randH") out = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,"0")).join("");
      else out = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    } else {
      out = `[${algo} 占位] 输入 ${v.length} 字符`;
    }
  } catch (e) { out = "错误：" + e.message; }
  $("out").value = out;
}

// ============== 模板：color（颜色工具） ==============
function renderColor(def, root) {
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="grid grid-2">
      <div class="panel">
        <div class="panel-title">取色</div>
        <input id="c" type="color" value="#6aa6ff" style="width:100%;height:120px;border:1px solid var(--border);border-radius:8px;cursor:pointer" />
      </div>
      <div class="panel">
        <div class="panel-title">预览</div>
        <div id="prev" style="height:120px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;background:#6aa6ff">SAMPLE</div>
      </div>
    </div>
    <div class="grid grid-3">
      <div class="panel"><div class="panel-title">HEX</div><input id="hex" readonly /><button class="btn btn-sm" style="margin-top:6px" onclick="copyText(hex.value)">📋</button></div>
      <div class="panel"><div class="panel-title">RGB</div><input id="rgb" readonly /><button class="btn btn-sm" style="margin-top:6px" onclick="copyText(rgb.value)">📋</button></div>
      <div class="panel"><div class="panel-title">HSL</div><input id="hsl" readonly /><button class="btn btn-sm" style="margin-top:6px" onclick="copyText(hsl.value)">📋</button></div>
      <div class="panel"><div class="panel-title">HSV</div><input id="hsv" readonly /><button class="btn btn-sm" style="margin-top:6px" onclick="copyText(hsv.value)">📋</button></div>
      <div class="panel"><div class="panel-title">CMYK</div><input id="cmyk" readonly /><button class="btn btn-sm" style="margin-top:6px" onclick="copyText(cmyk.value)">📋</button></div>
      <div class="panel"><div class="panel-title">亮度</div><input id="lum" readonly /></div>
    </div>
  `;
  function hexToRgb(h) { h=h.replace("#",""); if (h.length===3) h=h.split("").map(c=>c+c).join(""); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function sync() {
    const c = $("c").value;
    const [r,g,b] = hexToRgb(c);
    const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
    let h=0, s=0, l=(mx+mn)/2;
    if (mx!==mn) { const d=mx-mn; s=l>0.5?d/(2-mx-mn):d/(mx+mn); if (mx===r) h=(g-b)/d+(g<b?6:0); else if (mx===g) h=(b-r)/d+2; else h=(r-g)/d+4; h/=6; }
    const hh=Math.round(h*360), ss=Math.round(s*100), ll=Math.round(l*100);
    const v=mx, sv=mx===0?0:(mx-mn)/mx, hv=mx===mn?0:Math.round((mx===r?(g-b)/(mx-mn)+(g<b?6:0):mx===g?(b-r)/(mx-mn)+2:(r-g)/(mx-mn)+4)/6*360);
    $("hex").value = c.toUpperCase();
    $("rgb").value = `rgb(${r}, ${g}, ${b})`;
    $("hsl").value = `hsl(${hh}, ${ss}%, ${ll}%)`;
    $("hsv").value = `hsv(${hv}, ${Math.round(sv*100)}%, ${Math.round(v/255*100)}%)`;
    const k = 1-Math.max(r/255,g/255,b/255);
    $("cmyk").value = k===1 ? "cmyk(0%,0%,0%,100%)" : `cmyk(${Math.round((1-r/255-k)/(1-k)*100)}%, ${Math.round((1-g/255-k)/(1-k)*100)}%, ${Math.round((1-b/255-k)/(1-k)*100)}%, ${Math.round(k*100)}%)`;
    $("lum").value = Math.round((0.299*r+0.587*g+0.114*b));
    $("prev").style.background = c;
    $("prev").textContent = c.toUpperCase();
  }
  $("c").addEventListener("input", sync);
  sync();
}

// ============== 模板：reference（速查表） ==============
function renderReference(def, root) {
  const data = getReferenceData(def.key);
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel"><input id="q" placeholder="🔎 搜索..." /></div>
    <div class="panel"><div id="list" style="max-height:600px;overflow:auto">${data.html}</div></div>
  `;
  $("q").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    $("list").innerHTML = data.rows.filter(r => r.toLowerCase().includes(q)).map(r => `<div class="diff-line">${esc(r)}</div>`).join("") || `<div style="color:var(--muted);padding:20px;text-align:center">无匹配</div>`;
  });
}

function getReferenceData(key) {
  const D = {
    "html": { html: "加载中...", rows: [] },
    "css": { html: "", rows: [] },
    "js": { html: "", rows: [] },
    "git": { html: "", rows: [] },
    "http": { html: "", rows: [] },
    "emoji": { html: "", rows: [] },
    "country": { html: "", rows: [] }
  };
  // 通用生成器
  const tables = {
    "html": ["<!a href> 链接","<a href='url'>文本</a>","<img src='url' alt='描述'>","<p>段落</p>","<h1>~<h6> 标题","<ul><li>项目</li></ul> 无序列表","<ol><li>项目</li></ol> 有序列表","<table><tr><td>表格</td></tr></table>","<form>表单</form>","<input type='text'>","<textarea>多行文本</textarea>","<select><option>选择</option></select>","<button>按钮</button>","<div>块级容器</div>","<span>行内容器</span>","<header>头部</header>","<nav>导航</nav>","<main>主内容</main>","<footer>底部</footer>","<article>文章</article>","<section>节</section>","<aside>侧栏</aside>","<video src>","<audio src>","<canvas>画布</canvas>","<svg>SVG</svg>","<iframe src>内嵌框","<meta charset='UTF-8'>","<link rel='stylesheet' href>","<script src>","<style>CSS</style>"],
    "css": ["display: flex / grid / block / inline / none","position: static / relative / absolute / fixed / sticky","flex-direction: row / column","justify-content: center / space-between","align-items: center","gap: 10px","grid-template-columns: 1fr 1fr","padding / margin: 10px","border: 1px solid #ccc","border-radius: 8px","box-shadow: 0 2px 4px rgba(0,0,0,0.1)","background / color","font-size / font-weight / font-family","line-height / letter-spacing","text-align: left / center / right / justify","width / height: 100px","max-width / max-height","overflow: hidden / scroll / auto","transition: all 0.3s","transform: rotate / scale / translate","@media (max-width: 768px)","animation: name 1s infinite","background: linear-gradient(red, blue)","opacity: 0.5","z-index: 10","cursor: pointer","object-fit: cover"],
    "js": ["const/let 声明","=> 箭头函数","async/await 异步","Promise 链","Array.map / filter / reduce / find","Array.forEach / some / every","Object.keys / values / entries","JSON.parse / JSON.stringify","Math.max / min / random / floor","Date.now() 时间戳","setTimeout / setInterval","localStorage.setItem / getItem","fetch(url).then(r=>r.json())","new Map() / new Set()","正则 RegExp / test() / match()","...展开运算符","解构 {a, b} = obj","模板字符串 `Hello ${name}`","import / export 模块","class Foo {}","try/catch/finally","throw new Error()","this 上下文","new 操作符","instanceof 类型检测","typeof 类型","Array.from()","padStart / padEnd","Number.toFixed(2)"],
    "git": ["git init 初始化","git clone <url> 克隆","git add . 添加","git commit -m 'msg' 提交","git push 推送","git pull 拉取","git status 状态","git log 历史","git diff 差异","git branch 分支","git checkout 切换","git merge 合并","git rebase 变基","git stash 暂存","git reset 回退","git revert 反转","git tag 标签","git remote 远程","git fetch 获取","git rm 删除","git mv 移动","git show 显示","git blame 追溯","git reflog 日志","git config 配置","git cherry-pick 摘取","git bisect 二分"],
    "http": ["200 OK 成功","201 Created 已创建","204 No Content","301 永久重定向","302 临时重定向","304 Not Modified","400 错误请求","401 未授权","403 禁止","404 未找到","405 方法不允许","408 请求超时","409 冲突","410 已删除","422 无法处理","429 请求过多","500 服务器错误","502 网关错误","503 服务不可用","504 网关超时"],
    "emoji": ["😀 笑脸","😂 笑哭","😍 喜爱","🤔 思考","😎 酷","👍 赞","👎 差","👏 鼓掌","🙏 感谢","💪 力量","🔥 火","⭐ 星","❤️ 红心","💔 心碎","🎉 庆祝","🎁 礼物","✅ 完成","❌ 错误","⚠️ 警告","❓ 问号","❗ 感叹","📁 文件夹","📝 笔记","💻 电脑","📱 手机","🌍 地球","☀️ 太阳","🌙 月亮","⏰ 时钟"],
    "country": ["CN 中国","US 美国","JP 日本","KR 韩国","GB 英国","FR 法国","DE 德国","RU 俄罗斯","IN 印度","BR 巴西","AU 澳大利亚","CA 加拿大","IT 意大利","ES 西班牙","MX 墨西哥","ID 印度尼西亚","TR 土耳其","SA 沙特阿拉伯","CH 瑞士","NL 荷兰","SE 瑞典","NO 挪威","FI 芬兰","DK 丹麦","PL 波兰","TH 泰国","VN 越南","PH 菲律宾","MY 马来西亚","SG 新加坡","HK 香港","TW 台湾","MO 澳门","NZ 新西兰","ZA 南非","EG 埃及","NG 尼日利亚","KE 肯尼亚","AR 阿根廷","CL 智利"],
    "mime": ["text/html .html","text/css .css","text/javascript .js","application/json .json","application/xml .xml","text/plain .txt","text/csv .csv","image/png .png","image/jpeg .jpg","image/gif .gif","image/svg+xml .svg","image/webp .webp","application/pdf .pdf","application/zip .zip","application/x-tar .tar","application/gzip .gz","audio/mpeg .mp3","audio/wav .wav","video/mp4 .mp4","video/webm .webm","font/woff .woff","font/woff2 .woff2","application/octet-stream 二进制"],
    "httpHdr": ["Content-Type 内容类型","Content-Length 长度","Authorization 授权","Cookie Cookie","Set-Cookie 设置Cookie","Cache-Control 缓存","Expires 过期","Last-Modified 最后修改","ETag 标签","If-None-Match 条件","If-Modified-Since 条件","Accept 接受","Accept-Encoding 编码","Accept-Language 语言","Origin 来源","Referer 来源页","User-Agent 用户代理","Host 主机","Connection 连接","X-Forwarded-For 转发","X-Real-IP 真实IP","Access-Control-Allow-Origin 跨域","Strict-Transport-Security HSTS","X-Frame-Options 框架","X-Content-Type-Options 类型","Content-Security-Policy CSP"],
    "keycode": ["Backspace 8","Tab 9","Enter 13","Shift 16","Ctrl 17","Alt 18","Pause 19","CapsLock 20","Escape 27","PageUp 33","PageDown 34","End 35","Home 36","ArrowLeft 37","ArrowUp 38","ArrowRight 39","ArrowDown 40","Insert 45","Delete 46","0-9 48-57","A-Z 65-90","a-z 97-122","F1-F12 112-123","NumLock 144"],
    "linux": ["ls 列出","cd 切换","pwd 当前","mkdir 创建","rmdir 删除","rm -rf 强制","cp 复制","mv 移动","cat 查看","less / more","head / tail","grep 搜索","find 查找","locate 定位","which 命令","man 帮助","top 进程","ps 进程","kill 终止","chmod 权限","chown 拥有","tar 打包","zip / unzip","ssh 远程","scp 复制","wget 下载","curl 请求","ping 测试","traceroute 路由","netstat 网络","ifconfig / ip","df 磁盘","du 占用","free 内存","history 历史","alias 别名","export 环境变量"],
    "sql": ["SELECT * FROM table","SELECT col1, col2 FROM table","WHERE 条件过滤","ORDER BY col ASC/DESC","GROUP BY col 分组","HAVING 分组过滤","LIMIT n 限制","OFFSET n 偏移","INSERT INTO table (cols) VALUES","UPDATE table SET col=val WHERE","DELETE FROM table WHERE","JOIN / LEFT JOIN / RIGHT JOIN","INNER JOIN 内连接","ON 连接条件","AS 别名","DISTINCT 去重","COUNT / SUM / AVG / MAX / MIN","LIKE 'pattern%' 模糊","IN (val1, val2)","BETWEEN a AND b","IS NULL / IS NOT NULL","AND / OR / NOT","UNION 合并","CREATE TABLE 创建","ALTER TABLE 修改","DROP TABLE 删除","INDEX 索引","PRIMARY KEY 主键","FOREIGN KEY 外键"],
    "entity": ["&amp; &","&lt; <","&gt; >","&quot; \"","&apos; '","&nbsp; 空格","&copy; ©","&reg; ®","&trade; ™","&euro; €","&pound; £","&yen; ¥","&cent; ¢","&sect; §","&para; ¶","&hellip; …","&mdash; —","&ndash; –","&lsquo; ‘","&rsquo; ’","&ldquo; “","&rdquo; ”","&times; ×","&divide; ÷","&plusmn; ±","&infin; ∞","&sum; Σ","&pi; π","&alpha;-&omega; α-ω","&hearts; ♥","&spades; ♠","&clubs; ♣","&diams; ♦"],
    "ascii": ["0-31 控制字符 (不可见)","32 空格","33-47 标点","48-57 0-9","58-64 标点","65-90 A-Z","91-96 标点","97-122 a-z","123-126 标点","127 DEL"],
    "regex": [". 任意字符","\\d 数字","\\D 非数字","\\w 字母数字下划线","\\W 非字母数字下划线","\\s 空白","\\S 非空白","^ 行首","$ 行尾","\\b 单词边界","* 0或多次","+ 1或多次","? 0或1次","{n} n次","{n,m} n到m次","| 或","() 分组","(?:) 非捕获组","[abc] 字符集","[^abc] 非字符集","[a-z] 范围","(?=) 前瞻","(?<=) 后顾","(?!) 负前瞻","(?<!) 负后顾","\\1 反向引用","i 大小写不敏感","g 全局","m 多行","s dotall","u unicode","y sticky"],
    "ext": [".html 网页",".css 样式",".js 脚本",".json 数据",".xml 标记",".txt 文本",".md 文档",".pdf PDF",".doc/.docx Word",".xls/.xlsx Excel",".ppt/.pptx PPT",".zip 压缩",".rar 压缩",".7z 压缩",".tar 归档",".gz 压缩",".png 图片",".jpg 图片",".gif 动图",".svg 矢量",".webp 图片",".ico 图标",".mp3 音频",".mp4 视频",".avi 视频",".mkv 视频",".mov 视频",".wav 音频",".flac 无损",".ttf 字体",".otf 字体",".woff 网页字体",".iso 镜像",".exe 可执行",".dll 动态库",".so 动态库",".apk 安卓",".ipa iOS",".dmg 苹果镜像"],
    "regex-greedy": ["贪婪匹配 (默认)","非贪婪 *?","非贪婪 +?","非贪婪 {n,m}?","原子组 (?>...)","占有量词 *+","占有量词 ++","占有量词 ?+"]
  };

  // 已有数据
  if (tables[key]) {
    const rows = tables[key];
    return { html: rows.map(r => `<div class="diff-line">${esc(r)}</div>`).join(""), rows };
  }

  // 通用占位表
  const samples = {
    "vim": ["i 插入模式","Esc 退出","h/j/k/l 移动","w 下一词","b 上一词","0 行首","$ 行尾","gg 文件首","G 文件尾","dd 删除行","yy 复制行","p 粘贴","u 撤销","Ctrl+r 重做","/ 搜索","n 下一个",":w 保存",":q 退出",":q! 强制退出",":wq 保存退出",":e 文件","v 可视模式","Ctrl+v 列可视",">> 缩进","<< 反缩进","* 高亮当前词","% 跳到匹配"],
    "vscode": ["Ctrl+S 保存","Ctrl+P 打开文件","Ctrl+Shift+P 命令面板","Ctrl+` 终端","Ctrl+B 侧栏","Ctrl+/ 注释","Ctrl+Shift+K 删除行","Alt+↑/↓ 移动行","Shift+Alt+↓ 复制行","Ctrl+D 选中匹配","Ctrl+L 选中行","Ctrl+Shift+L 全部匹配","F2 重命名","F12 跳定义","Alt+F12 看定义","Ctrl+Shift+F 全局搜索","Ctrl+Shift+H 全局替换","Ctrl+G 跳行","Alt+Click 多光标","Ctrl+Alt+↑/↓ 多光标"],
    "md": ["# 一级标题","## 二级","### 三级","**粗体**","*斜体*","~~删除~~","`代码`","```js 代码块 ```","[链接](url)","![图片](url)","> 引用","- 列表项","1. 有序列表","--- 分隔线","---| 表格","| 表格 |",":---: 居中","| 任务列表 - [ ]","| 完成 - [x]","$LaTeX$ 行内","$$LaTeX$$ 块","<details>折叠"],
    "fighk": ["V 选择","A 画框","P 钢笔","T 文字","R 矩形","O 椭圆","L 直线","H 移动","Cmd+D 复制","Cmd+G 编组","Cmd+Shift+G 解组","Cmd+Option+K 切组件","/ 搜索","Cmd+/ 注释","Option+拖 复制","Cmd+Shift+E 导出","Shift+1 缩放","Shift+2 适应","Cmd+Y 预览"],
    "pshk": ["V 移动","M 选框","L 套索","W 魔棒","C 裁剪","I 吸管","T 文字","P 钢笔","B 画笔","E 橡皮","Z 缩放","X 前景/背景","D 默认色","Ctrl+T 自由变换","Ctrl+J 复制图层","Ctrl+Shift+S 另存为","F 切换全屏","Tab 隐藏面板"],
    "docker": ["docker pull 镜像","docker run 运行","docker ps 列表","docker images 镜像列表","docker stop 停止","docker start 启动","docker rm 删除容器","docker rmi 删除镜像","docker logs 日志","docker exec 执行","docker build 构建","docker push 推送","docker pull 拉取","docker-compose up 启动","docker-compose down 停止","docker network 网络","docker volume 卷","docker system df 占用","docker prune 清理"],
    "npm": ["npm init 初始化","npm install 安装","npm i -D 开发依赖","npm i -g 全局","npm uninstall 卸载","npm update 更新","npm run 运行脚本","npm start 启动","npm test 测试","npm publish 发布","npm login 登录","npm search 搜索","npm list 列表","npm outdated 过时","npm audit 审计","npx 执行","npm ci 干净安装","npm cache clean 清理"],
    "curl": ["curl <url> GET","curl -X POST POST","curl -H 'Content-Type: application/json' 头","curl -d 'data' 数据","curl -o file 保存","curl -O 保留名","curl -L 跟随重定向","curl -i 包含头","curl -I 仅头","curl -u user:pass 认证","curl -b 'cookie' cookie","curl -c 保存cookie","curl -k 不验证","curl -v 详细","curl -s 静默","curl -F 'file=@x' 上传","curl --data-binary @file 原始","curl -G --data 查询参数"],
    "tar": ["tar -cvf 打包","tar -xvf 解包","tar -tvf 列出","tar -czvf gzip压缩","tar -xzvf gzip解压","tar -cjvf bzip2压缩","tar -xjvf bzip2解压","tar -C 目录 指定目录","tar -r 追加","tar -u 更新","tar -d 差异","tar --delete 删除","tar -X 排除","tar -T 文件列表"],
    "ssh": ["ssh user@host 登录","ssh -p 端口","ssh -i 私钥","ssh-keygen 生成密钥","ssh-copy-id 复制公钥","ssh-add 添加","ssh-agent 代理","scp 复制","sftp 传输","ssh -L 端口转发","ssh -D 动态转发","ssh -N 不执行","ssh -f 后台","~/.ssh/config 配置","known_hosts 已知主机","authorized_keys 授权"],
    "cronRef": ["分 0-59","时 0-23","日 1-31","月 1-12","周 0-6 (0=日)","* 任意",", 列表","- 范围","/ 步长","? 不指定","# 第几个","L 最后","W 工作日","每天 0 0 * * *","每周一 0 0 * * 1","每月1号 0 0 1 * *","每5分钟 */5 * * * *"],
    "gql": ["query 查询","mutation 变更","subscription 订阅","type 类型","input 输入","enum 枚举","union 联合","interface 接口","schema 定义","scalar 标量","directive 指令","! 必填","[] 列表","@include 包含","@skip 跳过","fragment 片段","alias 别名","variables 变量","directives 指令"],
    "ws": ["WS握手 HTTP 101","Sec-WebSocket-Key 密钥","Sec-WebSocket-Accept 应答","Opcode 0x1 文本","Opcode 0x2 二进制","Opcode 0x8 关闭","Opcode 0x9 ping","Opcode 0xA pong","FIN 1=最后一帧","MASK 1=已掩码","Payload len 长度","客户端必须掩码","Close Code 1000 正常","1001 离开","1002 协议错误","1003 不支持","1004 保留","1005 无状态","1006 异常","1007 帧错误","1008 策略违反","1009 大小","1010 扩展","1011 服务器","1015 TLS"],
    "oauth": ["Authorization Code 授权码","Implicit 隐式","Password 密码","Client Credentials 客户端","Resource Owner Password","Authorization Endpoint","Token Endpoint","scope 范围","redirect_uri 回调","state 状态","PKCE 扩展","Refresh Token 刷新","Access Token 访问","ID Token 身份","Bearer Token 持有者","JWT 令牌"]
  };

  if (samples[key]) {
    const rows = samples[key];
    return { html: rows.map(r => `<div class="diff-line">${esc(r)}</div>`).join(""), rows };
  }

  // 默认占位
  const defaultRows = [
    "项目 1 — 占位说明",
    "项目 2 — 详细信息",
    "项目 3 — 示例数据",
    "项目 4 — 进阶用法",
    "项目 5 — 注意事项",
    "项目 6 — 参考链接",
    "项目 7 — 最佳实践",
    "项目 8 — 常见问题"
  ];
  return { html: defaultRows.map(r => `<div class="diff-line">${esc(r)}</div>`).join(""), rows: defaultRows };
}

// ============== 模板：game（游戏） ==============
function renderGame(def, root) {
  const handlers = {
    "dice": () => `
      <div class="text-center" style="padding:20px">
        <div id="d" style="font-size:120px;color:var(--accent)">🎲</div>
        <div id="r" style="font-size:24px;color:#fff;margin:14px 0">点击下方按钮掷骰子</div>
        <button class="btn btn-primary" onclick="roll()">🎲 掷骰子</button>
      </div>`,
    "coin": () => `
      <div class="text-center" style="padding:20px">
        <div id="c" style="font-size:120px">🪙</div>
        <div id="r" style="font-size:18px;color:#fff;margin:14px 0">点击抛硬币</div>
        <button class="btn btn-primary" onclick="flip()">🪙 抛硬币</button>
      </div>`,
    "rps": () => `
      <div style="text-align:center;padding:20px">
        <div style="font-size:80px;margin:14px" id="vs">✊ vs ❓</div>
        <div id="r" style="font-size:16px;color:#fff;margin-bottom:14px">出拳：</div>
        <button class="btn" onclick="rps(0)">✊ 石头</button>
        <button class="btn" onclick="rps(1)">✋ 剪刀</button>
        <button class="btn" onclick="rps(2)">✌️ 布</button>
      </div>`,
    "guess": () => `
      <div style="padding:20px">
        <div style="font-size:16px;color:#fff;margin-bottom:10px">猜 1-100 之间的数字</div>
        <input id="g" type="number" placeholder="输入猜测" />
        <button class="btn btn-primary" style="margin-top:8px" onclick="guess()">▶ 猜</button>
        <div id="r" style="margin-top:14px;color:var(--accent);font-size:16px"></div>
        <div id="h" style="color:var(--muted);font-size:13px;margin-top:6px"></div>
      </div>`,
    "lottery": () => `
      <div style="padding:20px">
        <textarea id="pool" style="min-height:160px" placeholder="每行一个选项\n张三\n李四\n王五\n..."></textarea>
        <button class="btn btn-primary" style="margin-top:10px" onclick="lottery()">🎯 抽签</button>
        <div id="r" style="margin-top:14px;color:var(--accent);font-size:28px;font-weight:700"></div>
      </div>`,
    "joke": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="joke()">😂 下一个</button></div>`,
    "riddle": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="riddle()">🤔 下一题</button></div>`,
    "quote": () => `<div style="padding:20px"><div id="q" style="font-size:20px;color:#fff;line-height:1.6;font-style:italic"></div><div id="a" style="color:var(--accent);margin-top:14px"></div><button class="btn btn-primary" style="margin-top:14px" onclick="quote()">✨ 下一句</button></div>`,
    "love": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="love()">💕 下一句</button></div>`,
    "fact": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="fact()">💡 下一个</button></div>`,
    "fortune": () => `<div style="padding:20px"><div id="j" style="font-size:24px;color:var(--accent);font-weight:700;text-align:center"></div><div id="d" style="color:var(--muted);text-align:center;margin-top:14px"></div><button class="btn btn-primary" style="margin-top:14px;display:block;margin:14px auto" onclick="fortune()">🎋 再抽一签</button></div>`,
    "wheel": () => `<div style="padding:20px"><textarea id="pool" style="min-height:140px" placeholder="选项 1\n选项 2\n选项 3">选项 1\n选项 2\n选项 3\n选项 4</textarea><button class="btn btn-primary" style="margin-top:10px" onclick="wheel()">🎡 转动</button><div id="r" style="margin-top:14px;color:var(--accent);font-size:28px;font-weight:700"></div></div>`,
    "t24": () => `<div style="padding:20px"><div style="color:#fff;margin-bottom:10px">输入 4 个数字 (1-13)，尝试算出 24</div><input id="nums" placeholder="4 6 2 3" value="4 6 2 3" /><button class="btn btn-primary" style="margin-top:10px" onclick="t24()">▶ 求解</button><div id="r" style="margin-top:14px;color:#fff;font-family:monospace;line-height:1.8"></div></div>`,
    "truth": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="truth()">🎲 下一题</button></div>`,
    "punish": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="punish()">😈 下一个</button></div>`,
    "brain": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><div id="a" style="color:var(--accent);margin-top:10px;display:none"></div><button class="btn" style="margin-top:14px" onclick="brainShow()">👀 看答案</button><button class="btn btn-primary" style="margin-top:14px;margin-left:8px" onclick="brain()">🤔 下一题</button></div>`,
    "meme": () => `<div style="padding:20px"><div id="j" style="font-size:18px;color:#fff;line-height:1.6"></div><button class="btn btn-primary" style="margin-top:14px" onclick="meme()">🔥 下一梗</button></div>`,
    "default": () => `<div style="padding:20px"><div style="font-size:18px;color:#fff;line-height:1.6">这是一个 ${esc(def.name)} 工具。点击下方按钮开始。</div><button class="btn btn-primary" style="margin-top:14px" onclick="toast('${esc(def.name)}：点击体验 🎉')">▶ 开始</button></div>`
  };
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">${(handlers[def.key] || handlers.default)()}</div>
  `;
  if (window[`init_${def.key}`]) window[`init_${def.key}`]();
}

// ============== 模板：chart（图表） ==============
function renderChart(def, root) {
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">
      <div class="panel-title">数据 (CSV：每行一个系列)</div>
      <textarea id="d" style="min-height:140px;font-family:monospace">类别,A,B,C
一月,120,80,50
二月,132,95,60
三月,101,70,55
四月,134,110,70
五月,90,85,65
六月,230,160,90</textarea>
    </div>
    <div class="panel"><div id="ch" style="width:100%;height:420px"></div></div>
  `;
  setTimeout(() => {
    const chart = echarts.init($("ch"));
    const lines = $("d").value.trim().split(/\r?\n/);
    const hdr = lines[0].split(",").map(s=>s.trim());
    const cats = hdr.slice(1);
    const series = lines.slice(1).map(l => {
      const c = l.split(",").map(s=>s.trim());
      return { name: c[0], type: "bar", data: c.slice(1).map(Number) };
    });
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: { textStyle: { color: "#cdd3e0" } },
      grid: { left: 50, right: 20, top: 50, bottom: 40 },
      xAxis: { type: "category", data: cats, axisLabel: { color: "#9aa3b2" } },
      yAxis: { type: "value", axisLabel: { color: "#9aa3b2" } },
      series
    });
    $("d").addEventListener("input", () => {
      const lines = $("d").value.trim().split(/\r?\n/);
      const hdr = lines[0].split(",").map(s=>s.trim());
      const cats = hdr.slice(1);
      const series = lines.slice(1).map(l => {
        const c = l.split(",").map(s=>s.trim());
        return { name: c[0], type: "bar", data: c.slice(1).map(Number) };
      });
      chart.setOption({ xAxis: { data: cats }, series });
    });
  }, 100);
}

// ============== 模板：form（表单型工具） ==============
function renderForm(def, root) {
  const presets = {
    "prompt": () => `
      <div class="panel-title" style="font-size:12px">主题 / 角色</div>
      <input id="topic" type="text" value="你是一个专业的${def.topic}顾问" />
      <div class="panel-title" style="font-size:12px;margin-top:10px">任务</div>
      <textarea id="task" style="min-height:100px">请帮我完成关于 ${esc(def.topic)} 的一个具体任务：</textarea>
      <div class="panel-title" style="font-size:12px;margin-top:10px">要求 / 限制</div>
      <textarea id="req" style="min-height:80px">- 简洁专业
- 提供具体可操作的建议
- 必要时举例说明</textarea>
      <button class="btn btn-primary" style="margin-top:14px" onclick="genPrompt('${def.id}')">✨ 生成提示词</button>
      <div id="out" style="margin-top:14px"></div>
    `,
    "design": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)} 占位工具。<br/>完整 UI 在 <a href="/tools/code/colorcode.html">颜色代码转换</a> 等专项工具中。</div>`,
    "office": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)} 模板：<br/><br/>${getOfficeTemplate(def.key)}</div>`,
    "code": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/>使用 <a href="/tools/util/random.html">UUID</a>、<a href="/tools/code/json2code.html">JSON转代码</a> 等专项工具。</div>`,
    "net": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/>使用 <a href="/tools/net/url.html">URL 解析</a>、<a href="/tools/net/ip.html">IP 查询</a> 等专项工具。</div>`,
    "analysis": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：粘贴文本以分析<br/><textarea id="t" style="min-height:120px;margin-top:10px">Hello world. This is a sample text for analysis. It contains multiple sentences.</textarea><button class="btn btn-primary" style="margin-top:10px" onclick="toast('分析完成（演示模式）')">▶ 分析</button></div>`,
    "decision": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/><textarea id="opt" style="min-height:100px;margin-top:10px">选项 A: 优势1, 优势2, 劣势1\n选项 B: 优势1, 劣势1, 劣势2\n选项 C: 优势1, 优势2, 劣势1</textarea><button class="btn btn-primary" style="margin-top:10px" onclick="toast('决策分析完成')">▶ 分析</button></div>`,
    "pm": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/><input id="i" placeholder="输入项目信息" style="margin-top:10px" /><button class="btn btn-primary" style="margin-top:10px" onclick="toast('已生成')">▶ 生成</button></div>`,
    "image": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/>使用 <a href="/tools/image/compress.html">图片工具集</a>。</div>`,
    "audio": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}</div>`,
    "default": () => `<div style="color:var(--muted); padding:20px;text-align:center">${esc(def.name)}：<br/>使用专项工具页面。</div>`
  };
  root.innerHTML = `
    <div class="page-header">
      <div class="page-title">${def.icon} ${esc(def.name)}</div>
      <div class="page-desc">${esc(def.desc || "")}</div>
    </div>
    <div class="panel">${(presets[def.kind] || presets.default)()}</div>
  `;
}

function getOfficeTemplate(key) {
  const T = {
    "meet": "📋 会议纪要\n\n时间：\n地点：\n参会人：\n\n议题：\n1. \n2. \n\n决议：\n- \n\n待办：\n- [ ] 责任人 / 截止日期",
    "resume": "👤 简历\n\n个人信息\n姓名 | 邮箱 | 电话 | 城市\n\n教育经历\n学校 | 学位 | 时间\n\n工作经历\n公司 | 职位 | 时间\n  · 成就 1\n  · 成就 2\n\n项目经历\n项目 | 角色 | 时间\n  · \n\n技能\n- 编程语言：\n- 工具：\n- 语言：",
    "cover": "📝 求职信\n\n尊敬的 HR：\n\n您好！我对 [职位] 非常感兴趣，特此投递简历。\n\n[介绍自己的核心优势，2-3 句]\n\n[展示与岗位的匹配度：相关经验、项目、成果]\n\n[表达加入意愿与可入职时间]\n\n此致\n敬礼\n\n[姓名]\n[日期]",
    "contract": "📄 合同模板\n\n甲方（委托方）：\n乙方（受托方）：\n\n根据《中华人民共和国民法典》及相关法律法规... \n\n第一条 合作内容\n[具体描述]\n\n第二条 权利义务\n甲方：\n乙方：\n\n第三条 费用与支付\n金额：\n支付方式：\n\n第四条 保密条款\n\n第五条 违约责任\n\n第六条 争议解决\n\n甲方签字：________  乙方签字：________\n日期：________      日期：________",
    "invoice": "🧾 发票\n\n发票号码：\n开票日期：\n\n购买方：\n销售方：\n\n| 项目 | 数量 | 单价 | 金额 |\n| --- | --- | --- | --- |\n|      |     |     |     |\n|      |     |     |     |\n\n合计：¥______\n税率：__%  税额：¥______\n价税合计（大写）：____________\n\n备注：",
    "quote": "💼 报价单\n\n报价编号：\n日期：\n致：[客户公司]\n\n| 序号 | 项目 | 规格 | 数量 | 单价 | 金额 |\n| --- | --- | --- | --- | --- | --- |\n|     |     |     |     |     |     |\n\n总计：¥______\n\n有效期：30 天\n付款方式：50% 预付，50% 验收后\n\n联系人：\n电话：",
    "weekly": "📅 周报\n\n姓名：\n日期：YYYY-MM-DD ~ YYYY-MM-DD\n\n本周完成：\n- [ ] \n- [ ] \n\n进行中：\n- [ ] \n\n下周计划：\n- \n\n问题与建议：\n- "
  };
  return T[key] || "（模板占位）";
}

// ============== 渲染器主入口 ==============
function renderTool(def) {
  const root = document.getElementById("root");
  root.innerHTML = "";
  if (def.tpl === "counter") return renderCounter(def, root);
  if (def.tpl === "transform") return renderTransform(def, root);
  if (def.tpl === "converter") return renderConverter(def, root);
  if (def.tpl === "encoder") return renderEncoder(def, root);
  if (def.tpl === "calculator") return renderCalculator(def, root);
  if (def.tpl === "lookup") return renderLookup(def, root);
  if (def.tpl === "validator") return renderValidator(def, root);
  if (def.tpl === "color") return renderColor(def, root);
  if (def.tpl === "chart") return renderChart(def, root);
  if (def.tpl === "timer") return renderTimer(def, root);
  if (def.tpl === "game") return renderGame(def, root);
  if (def.tpl === "reference") return renderReference(def, root);
  if (def.tpl === "form") return renderForm(def, root);
  if (def.tpl === "picker") return renderPicker(def, root);
  if (def.tpl === "board") return renderBoard(def, root);
  // 默认
  return renderForm(def, root);
}

// 占位（防止未实现的渲染函数报错）
function renderTransform(def, root) { return renderCounter(def, root); }
function renderConverter(def, root) { return renderCalculator(def, root); }
function renderLookup(def, root) { return renderReference(def, root); }
function renderValidator(def, root) { return renderForm(def, root); }
function renderTimer(def, root) { return renderGame(def, root); }
function renderPicker(def, root) { return renderGame(def, root); }
function renderBoard(def, root) { return renderGame(def, root); }

// ============== 全局辅助函数 ==============
function genPrompt(id) {
  const topic = $("topic").value;
  const task = $("task").value;
  const req = $("req").value;
  const prompt = `# 角色\n${topic}\n\n# 任务\n${task}\n\n# 要求\n${req}\n\n# 输出格式\n请以清晰的 Markdown 格式输出，包含必要的标题、列表和代码示例。`;
  $("out").innerHTML = `
    <div class="panel" style="background:var(--bg-2);margin-top:10px">
      <pre style="white-space:pre-wrap;font-size:13px;line-height:1.6;color:#fff">${esc(prompt)}</pre>
    </div>
    <button class="btn" style="margin-top:8px" onclick="copyText(\`${esc(prompt).replace(/`/g, "\\`")}\`)">📋 复制</button>
  `;
}
function roll() { $("d").textContent = ["⚀","⚁","⚂","⚃","⚄","⚅"][Math.floor(Math.random()*6)]; $("r").textContent = "点数：" + (Math.floor(Math.random()*6)+1); }
function flip() { const r = Math.random() < 0.5; $("c").textContent = r ? "🪙正面" : "👑反面"; $("r").textContent = r ? "正面" : "反面"; }
function rps(p) {
  const me = ["✊","✋","✌️"][p], ai = Math.floor(Math.random()*3);
  const a = ["✊","✋","✌️"][ai];
  const r = p === ai ? "平局" : (p===0&&ai===1)||(p===1&&ai===2)||(p===2&&ai===0) ? "你输了" : "你赢了";
  $("vs").textContent = `${me} vs ${a}`;
  $("r").textContent = r;
}
let _gn = 0;
function guess() {
  if (!_gn) _gn = Math.floor(Math.random()*100) + 1;
  const g = +$("g").value;
  if (!g) return;
  if (g === _gn) { $("r").textContent = `🎉 猜对了！就是 ${_gn}`; $("h").textContent = ""; _gn = 0; }
  else if (g < _gn) $("r").textContent = "⬆️ 太小了";
  else $("r").textContent = "⬇️ 太大了";
}
function lottery() {
  const arr = $("pool").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (!arr.length) return toast("请输入选项");
  $("r").textContent = "🎯 " + arr[Math.floor(Math.random()*arr.length)];
}
function joke() {
  const j = ["为什么程序员总穿黑衣？因为没有 bug。","我以为我下载了一个解压软件，结果是更大的压力。","医生：我看不出你哪里不舒服。病人：我也看不出我哪里不舒服。","做俯卧撑可以锻炼什么？练就一双有力气的手来撑地。","为什么数学书总是忧伤的？因为它有太多问题。","有一天小明问他爸：爸，我是不是傻孩子？他爸：傻孩子，你当然不是啦。","程序员最讨厌的 4 件事：写注释、写文档、别人不写注释、别人不写文档。","AI：你可以问我任何问题。我：那你怎么回答？","这题超纲了——我看着标准答案都不理解。","我：我要减肥。肚子：先吃这顿再说。"];
  $("j").textContent = j[Math.floor(Math.random()*j.length)];
}
function riddle() {
  const r = [["一年四季都开花的是什么？","日历"],["什么动物天天熬夜？","熊猫（黑眼圈）"],["什么鸡没有翅膀？","田鸡"],["什么车不能开？","风车"],["什么书在书店里买不到？","秘书"],["什么人最喜欢说谎？","演员"],["什么时候 9 + 5 = 2？","时钟"],["什么花一年四季都开放？","塑料花"],["什么动物能贴在墙上？","海马（壁纸）"],["什么鱼最有钱？","金鱼"],["什么布剪不断？","瀑布"],["什么门永远关不上？","球门"],["哪颗牙最后长出来？","智齿"],["什么鼠最爱干净？","环保鼠"],["什么象最小？","盲人摸的那只"],["什么动物最大？","海里的鲸，陆上的象，实验室里的乌贼（鼠标）"],["什么水永远用不完？","泪水"],["什么酒不能喝？","碘酒"],["什么东西越洗越脏？","水"],["什么样的人不能在医院工作？","假人（没生命）"]];
  const [q, a] = r[Math.floor(Math.random()*r.length)];
  $("j").innerHTML = `🤔 ${q}<br><br><span style="color:var(--muted)">（点击「下一题」查看答案）</span>`;
  $("j").dataset.a = a;
}
function quote() {
  const q = ["成功不是最终，失败也并非致命，重要的是继续前进的勇气。—— 丘吉尔","生活不止眼前的苟且，还有诗和远方。","Stay hungry, stay foolish. —— Steve Jobs","千里之行，始于足下。—— 老子","山高水长，路远马亡。","愿你出走半生，归来仍是少年。","凡是过往，皆为序章。—— 莎士比亚","Life is what happens when you're busy making other plans.","在能奋斗的时候不要选择安逸。","做你热爱的事，其他的都无关紧要。"];
  $("q").textContent = q[Math.floor(Math.random()*q.length)];
  $("a").textContent = "— 名言警句";
}
function love() {
  const l = ["你今天看起来格外好看！","我手机欠费了，能借我点钱吗？我想给你充话费。","你属什么？属我。","你累不累？在我心里跑了一整天。","你知道我的缺点是什么吗？是缺点你。","我怀疑你的本质是一本书，不然为什么让我越看越想睡。","我觉得你长得好像一种菜——遇见你就 Born to be your lover。","你像Wi-Fi，我靠近你就满格信号。","我觉得我好像生病了，医生说是喜欢你。","如果你是糖的话，那你是甜的过分。","今晚月色真美。—— 夏目漱石","你笑起来真好看，像春天的花一样。","我想买一块地。对，就买在你的心里。","有件事我藏不住了——我想你想得藏不住。","我最近学会了做一道菜，叫'爱你一万年'。","见到你，我的心跳超过了 5G 速度。"];
  $("j").textContent = l[Math.floor(Math.random()*l.length)];
}
function fact() {
  const f = ["蜂蜜永远不会变质。考古学家在埃及法老墓中发现了 3000 年前的蜂蜜，仍然可以食用。","章鱼有三颗心脏。","香蕉是浆果，但草莓不是。","蜗牛可以睡三年。","一颗方糖大小的中子星物质重达 10 亿吨。","地球上所有的蚂蚁加起来总重量超过所有人类的总重量。","珠穆朗玛峰不是世界最高的山。最高的山是夏威夷的莫纳克亚山，从山脚到山顶超过 10 公里。","人类的血管连起来可以绕地球两圈半。","你的骨骼每 10 年完全更新一次。","地球上有 80 亿人口，但只有 3% 的水是淡水。","一只牡蛎一生可以生产 5000 万颗卵。","打字速度的世界纪录是 216 WPM（每分钟词数）。","维基百科每秒钟被编辑 1.7 次。","人类大脑 80% 是水。","水星上的一天比它的一年还长。","太阳占太阳系总质量的 99.86%。"];
  $("j").textContent = f[Math.floor(Math.random()*f.length)];
}
function fortune() {
  const f = [["上上签","春风得意，锦上添花"],["上签","吉星高照，谋事可成"],["中签","稳中有进，需耐心"],["中下签","静待时机，不宜冒进"],["下签","守成为上，转机将至"],["上上签","鸿运当头，心想事成"],["上签","贵人相助，逢凶化吉"],["中签","小有所成，戒骄戒躁"],["中下签","困难重重，坚持必过"],["下签","韬光养晦，等待时机"]];
  const [a, b] = f[Math.floor(Math.random()*f.length)];
  $("j").textContent = "🎋 " + a;
  $("d").textContent = b;
}
function wheel() {
  const arr = $("pool").value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (!arr.length) return toast("请输入选项");
  let i = 0; const t = setInterval(() => {
    $("r").textContent = "🎡 " + arr[i % arr.length];
    i++;
    if (i > 20) { clearInterval(t); $("r").textContent = "🎉 " + arr[Math.floor(Math.random()*arr.length)]; }
  }, 80);
}
function t24() {
  const nums = $("nums").value.split(/\s+/).map(Number).filter(n => !isNaN(n));
  if (nums.length !== 4) return toast("请输入 4 个数字");
  $("r").textContent = "(4 5 1 1) → (5-1) × (4+1) = 24\n(3 8 3 3) → 3 × 8 ÷ 3 × 3 = 24\n(1 5 5 5) → 5 × 5 - 5 ÷ 1 = 24\n(2 3 6 6) → 6 × 6 ÷ 2 - 3 = 24\n(4 4 10 10) → (10 × 10 - 4) ÷ 4 = 24\n\n💡 24 点游戏：用 + - × ÷ 算出 24";
}
function truth() {
  const t = ["你最近撒过最大的谎是什么？","你最尴尬的一次经历是什么？","你有没有暗恋过朋友的伴侣？","你最想删除手机里哪个 app？","你最不想让父母知道的事？","你最丢脸的时刻是？","你有没有偷偷哭过？","你最想和谁单独吃饭？","你的初恋是几岁？","你做过最疯狂的事是什么？","你最想和谁换一天人生？","你最想拥有的超能力？","你最害怕什么？","你最羞耻的购物记录？","你最近一次说谎是什么时候？","你最大的秘密是什么？","你最想对前任说什么？","你有没有偷看过别人的手机？","你最尴尬的发型是？","你最后悔没说出口的话？"];
  $("j").textContent = "🎲 " + t[Math.floor(Math.random()*t.length)];
}
function punish() {
  const p = ["学猫叫 10 秒","模仿最近一部电影片段","对镜子说 3 遍 '我最美'","跳舞 30 秒","用方言说绕口令","学 3 种动物叫","做出 5 种表情拍照","闭眼原地转 5 圈走直线","给通讯录第 3 个人发'我爱你'","模仿主持人播新闻","用屁股写自己的名字","表演一段 B-box","学企鹅走路 10 步","讲一个冷笑话逗笑大家","模仿某个明星的招牌动作","背一首古诗","模仿广告 30 秒","做一个鬼脸保持 30 秒","双手抱头蹲起 10 个","用头顶一本书走 10 步"];
  $("j").textContent = "😈 " + p[Math.floor(Math.random()*p.length)];
}
const _brain = [["什么人始终不敢洗澡？","牛顿（牛顿力学被推翻）"],["一只蚂蚁从几千米高的山上掉下来会怎么死？","饿死（被冻死）"],["什么东西比乌鸦更讨厌？","乌鸦嘴"],["什么动物最怕水？","猫头鹰（因为猫 - 头 - 鹰 = 三个都不喜欢水？）"],["什么车坐不了人？","风车"],["什么动物最擅长攀岩？","爬山虎（植物）"],["哪种动物最弱小？","蜘蛛（一拳打成蜘蛛侠）"],["什么人最容易摔倒？","走路不专心的人"],["什么船最安全？","友谊的小船（翻不了因为友情万岁）"],["什么时候 12 > 1？","在算错的时候"],["老王的头发为什么很少？","因为他是理发师"],["什么人没有头发？","光头"]];
function brain() { const r = _brain[Math.floor(Math.random()*_brain.length)]; $("j").textContent = "🤔 " + r[0]; $("a").textContent = "💡 " + r[1]; $("a").style.display = "none"; }
function brainShow() { $("a").style.display = "block"; }
function meme() {
  const m = ["YYDS = 永远的神","绝绝子 = 绝了","emo = 心情低落","芭比 Q = 完了（完蛋了）","栓 Q = 谢谢（反讽）","显眼包 = 喜欢出风头的人","city = 城市/精彩","搭子 = 一起做事的伙伴","精神状态：💀 = 状态极差","退退退 = 拒绝","搭子文学 = 找搭子的艺术","刘耕宏女孩 = 跳操的人","老六 = 背后阴人","雪豹闭嘴 = 安静","挖呀挖 = 儿歌","多巴胺 = 快乐","班味儿 = 上班的疲惫感","电子榨菜 = 视频/段子","社交牛杂症 = 想社恐但又偶尔社牛","特种兵旅游 = 高强度旅游","city不city = 城市感不强","血脉觉醒 = 突然理解长辈","敌蜜 = 敌蜜友","淡人 = 淡淡的","浓人 = 热烈的","E人 = 外向","I人 = 内向","嘴替 = 替我说话","嘴强王者 = 只会说","显眼包 = 爱出风头","电子布洛芬 = 缓解精神痛苦的内容"];
  $("j").textContent = m[Math.floor(Math.random()*m.length)];
}

// 全局快捷
window.runCalc = runCalc;
window.runEnc = runEnc;
window.genPrompt = genPrompt;
window.roll = roll; window.flip = flip; window.rps = rps; window.guess = guess;
window.lottery = lottery; window.joke = joke; window.riddle = riddle;
window.quote = quote; window.love = love; window.fact = fact; window.fortune = fortune;
window.wheel = wheel; window.t24 = t24; window.truth = truth; window.punish = punish;
window.brain = brain; window.brainShow = brainShow; window.meme = meme;
