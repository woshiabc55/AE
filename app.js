// app.js · 主应用：状态机 + 渲染 + 交互
import { getTRAE, SHOT_HELPERS } from "./trae-sdk.js";
import { decompose, SAMPLE_SCRIPT } from "./ai-decompose.js";

const { MOVEMENT_GLYPH, SIZE_LABEL, fmtTime } = SHOT_HELPERS;
const TRAE = getTRAE();

const state = {
  project: { title: "咖啡馆 30s 短片", script: "" },
  shots: [],
  view: "grid",
  expanded: new Set(),
  activeId: null,
  lastValidation: null
};

// ===== 工具 =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const uid = () => "s" + Math.random().toString(36).slice(2, 8);

function toast(msg, type = "") {
  const el = $("#toast");
  el.className = "toast is-show " + (type ? "toast--" + type : "");
  el.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-show"), 1800);
}

function totalRuntime() {
  const total = state.shots.reduce((a, s) => a + (Number(s.duration) || 0), 0);
  return fmtTime(total);
}

// ===== 持久化 =====
const KEY = "storyboard-ai-v1";
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      project: state.project,
      shots: state.shots,
      view: state.view
    }));
  } catch {}
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.project = data.project || state.project;
    state.shots = data.shots || [];
    state.view = data.view || "grid";
  } catch {}
}

// ===== 渲染 =====
function renderMeta() {
  $("#metaProject").textContent = `— ${(state.project.title || "UNTITLED").toUpperCase()} —`;
  $("#metaShots").textContent = String(state.shots.length).padStart(2, "0") + " SHOTS";
  $("#metaRuntime").textContent = totalRuntime();
  const status = $("#metaStatus");
  status.querySelector(".label").textContent = `SDK: ${TRAE.name === "TRAE-SDK-MOCK" ? "MOCK" : "READY"}`;
  status.dataset.state = TRAE.name === "TRAE-SDK-MOCK" ? "ready" : "ready";
}

function renderTimelineRuler() {
  const ruler = $("#timelineRuler");
  if (state.view !== "timeline") { ruler.hidden = true; return; }
  ruler.hidden = false;
  const total = state.shots.reduce((a, s) => a + (Number(s.duration) || 0), 0) || 1;
  let acc = 0;
  const segs = state.shots.map(s => {
    const start = acc;
    acc += Number(s.duration) || 0;
    return { start, end: acc, shot: s };
  });
  const ticks = [];
  for (let t = 0; t <= total; t += Math.max(1, Math.ceil(total / 8))) {
    ticks.push(`<span style="left:${(t / total) * 100}%;position:absolute;top:-2px;font-size:9.5px;color:var(--ink-3);transform:translateX(-50%)">${fmtTime(t)}</span>`);
  }
  ruler.innerHTML = `
    <div class="timeline-ruler__head">
      <span>TIMELINE · ${state.shots.length} 镜头</span>
      <span class="total">TOTAL ${fmtTime(total)}</span>
    </div>
    <div class="timeline-ruler__bar">
      ${segs.map(({ start, end, shot }) => `
        <div class="timeline-ruler__seg"
             data-state="${shot._verdict || 'idle'}"
             data-id="${shot.id}"
             style="left:${(start / total) * 100}%; width:${((end - start) / total) * 100}%;"
             title="${shot.scene || ''} · ${shot.duration}s · score ${shot._score ?? '—'}">${shot.seq}</div>
      `).join("")}
      ${ticks.join("")}
    </div>
  `;
  ruler.querySelectorAll(".timeline-ruler__seg").forEach(seg => {
    seg.addEventListener("click", () => {
      const id = seg.dataset.id;
      const node = $(`.shot[data-id="${id}"]`);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        state.activeId = id;
        runValidation(id);
      }
    });
  });
}

function renderBoard() {
  const board = $("#board");
  board.dataset.view = state.view;
  board.innerHTML = "";
  if (!state.shots.length) {
    board.classList.add("is-empty");
    renderTimelineRuler();
    return;
  }
  board.classList.remove("is-empty");
  const tpl = $("#tplShot");
  state.shots.forEach((shot) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = shot.id;
    populateShot(node, shot);
    bindShotEvents(node, shot);
    board.appendChild(node);
  });
  renderTimelineRuler();
}

function populateShot(node, shot) {
  const isExp = state.expanded.has(shot.id);
  node.classList.toggle("is-expanded", isExp);
  node.querySelector(".seq__num").textContent = String(shot.seq).padStart(2, "0");
  node.querySelector(".seq__time").textContent = fmtTime(shot.duration);
  node.querySelector(".shot__scene").textContent = shot.scene || `镜头 ${shot.seq}`;
  node.querySelector(".shot__toggle .lbl").textContent = isExp ? "折叠" : "展开";
  node.querySelector(".shot__toggle").setAttribute("aria-expanded", isExp);

  const sizeBadge = node.querySelector(".shot__chips .badge--size");
  sizeBadge.textContent = `${shot.shotSize} ${SIZE_LABEL[shot.shotSize] || ""}`;
  sizeBadge.dataset.size = shot.shotSize;

  const mvBadge = node.querySelector(".shot__chips .badge--mv");
  mvBadge.textContent = `${MOVEMENT_GLYPH[shot.movement] || "○"} ${shot.movement}`;

  const angBadge = node.querySelector(".shot__chips .badge--angle");
  angBadge.textContent = shot.cameraAngle || "平视";

  node.querySelector(".summary__comp").textContent = shot.composition || "（无构图描述）";
  const line = [
    shot.dialogue ? `“${shot.dialogue}”` : "",
    shot.sfx ? `♪ ${shot.sfx}` : ""
  ].filter(Boolean).join("  ·  ") || "—";
  node.querySelector(".summary__line").textContent = line;
  // TC 起播时间
  const idx = state.shots.findIndex(s => s.id === shot.id);
  const tcStart = state.shots.slice(0, idx).reduce((a, s) => a + (Number(s.duration) || 0), 0);
  const sb = node.querySelector(".summary__body");
  if (sb) sb.dataset.tc = fmtTime(tcStart) + " → " + fmtTime(tcStart + (Number(shot.duration) || 0));
  node.querySelector(".m-dur").textContent = `⏱ ${shot.duration}s`;
  node.querySelector(".m-sfx").textContent = shot.sfx ? `♪ ${shot.sfx}` : "";

  // 详情字段
  $$("[data-k]", node).forEach((input) => {
    const k = input.dataset.k;
    input.value = shot[k] ?? "";
  });
  node.querySelector("[data-id-tag]").textContent = shot.id;
  node.querySelector("[data-score]").textContent = shot._score ?? "—";
  node.querySelector(".shot__detail").hidden = !isExp;
  node.querySelector(".shot__verdict").dataset.state = shot._verdict || "idle";
  node.querySelector(".shot__verdict .txt").textContent = shot._verdictLabel || "—";
  node.querySelector(".shot__verdict").title = shot._verdictDetail || "TRAE 校验";
}

function bindShotEvents(node, shot) {
  const toggle = node.querySelector(".shot__toggle");
  toggle.addEventListener("click", () => {
    if (state.expanded.has(shot.id)) state.expanded.delete(shot.id);
    else state.expanded.add(shot.id);
    populateShot(node, shot);
  });

  // 拖拽排序
  node.draggable = true;
  node.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", shot.id);
    e.dataTransfer.effectAllowed = "move";
    node.classList.add("is-dragging");
  });
  node.addEventListener("dragend", () => node.classList.remove("is-dragging"));
  node.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; });
  node.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData("text/plain");
    if (!dragId || dragId === shot.id) return;
    const from = state.shots.findIndex(s => s.id === dragId);
    const to = state.shots.findIndex(s => s.id === shot.id);
    const [moved] = state.shots.splice(from, 1);
    state.shots.splice(to, 0, moved);
    reseq(); renderBoard(); renderMeta(); save();
    toast("已重排镜头", "ok");
  });

  node.addEventListener("click", (e) => {
    if (e.target.closest(".shot__toggle, button, select, input, textarea, label")) return;
    state.activeId = shot.id;
    runValidation(shot.id);
  });

  node.querySelector("[data-act='validate']").addEventListener("click", () => {
    state.activeId = shot.id;
    runValidation(shot.id);
  });
  node.querySelector("[data-act='duplicate']").addEventListener("click", () => {
    const idx = state.shots.findIndex(s => s.id === shot.id);
    const copy = { ...shot, id: uid(), seq: state.shots.length + 1 };
    state.shots.splice(idx + 1, 0, copy);
    reseq(); renderBoard(); renderMeta(); save();
    toast("已复制镜头", "ok");
  });
  node.querySelector("[data-act='delete']").addEventListener("click", () => {
    state.shots = state.shots.filter(s => s.id !== shot.id);
    reseq(); renderBoard(); renderMeta(); save();
    toast("已删除镜头");
  });

  // 字段编辑
  $$("[data-k]", node).forEach((input) => {
    input.addEventListener("change", () => {
      const k = input.dataset.k;
      let v = input.value;
      if (k === "duration") v = Math.max(0, Math.min(60, Number(v) || 0));
      shot[k] = v;
      populateShot(node, shot);
      renderMeta();
      if (k === "duration") renderTimelineRuler();
      save();
      // 编辑后自动校验
      runValidation(shot.id, { silent: true });
    });
  });
}

function reseq() {
  state.shots.forEach((s, i) => s.seq = i + 1);
}

// ===== 校验 =====
async function runValidation(id, opts = {}) {
  const idx = state.shots.findIndex(s => s.id === id);
  if (idx < 0) return;
  const prev = state.shots[idx - 1] || null;
  const cur = state.shots[idx];
  const next = state.shots[idx + 1] || null;
  const node = $(`.shot[data-id="${id}"]`);
  if (node) {
    node.querySelector(".shot__verdict").dataset.state = "pending";
    node.querySelector(".shot__verdict .txt").textContent = "…";
  }
  try {
    const res = await TRAE.validateShot(prev, cur, next);
    cur._score = res.score;
    cur._verdict = res.ok ? (res.issues.some(i => i.level === "warn") ? "warn" : "ok") : "error";
    cur._verdictLabel = `${res.score}`;
    cur._verdictDetail = res.issues.map(i => `[${i.level.toUpperCase()}] ${i.msg}`).join("\n");
    if (cur._verdict !== "ok") cur.aiNote = res.issues.map(i => i.msg).join(" · ");
    state.lastValidation = { id, res };
    if (node) populateShot(node, cur);
    renderSDKPanel(res);
    if (!opts.silent) toast(`TRAE 校验完成 · 得分 ${res.score}`, res.ok ? "ok" : "err");
  } catch (e) {
    if (node) {
      node.querySelector(".shot__verdict").dataset.state = "error";
      node.querySelector(".shot__verdict .txt").textContent = "ERR";
    }
    toast("TRAE SDK 调用失败：" + e.message, "err");
  }
}

function renderSDKPanel(res) {
  $("#sdkScore").textContent = String(res.score).padStart(3, "0");
  const issuesEl = $("#sdkIssues");
  if (!res.issues.length) {
    issuesEl.innerHTML = `<p class="muted">无问题 · 镜头参数已通过校验。</p>`;
  } else {
    issuesEl.innerHTML = res.issues.map(i => `
      <div class="issue ${i.level}">
        <span class="tag">${i.level === "error" ? "✗" : i.level === "warn" ? "!" : "i"}</span>
        <span>${i.msg}${i.field ? ` <span class="mono" style="color:var(--ink-3)">[${i.field}]</span>` : ""}</span>
      </div>
    `).join("");
  }
  $("#sdkSuggest").innerHTML = res.suggestions.length
    ? `<div class="mono" style="color:var(--ink-3);font-size:10.5px;letter-spacing:.18em">AI SUGGEST</div><ul>${res.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>`
    : "";
  $("#sdkLog").textContent = `// TRAE.validateShot(prev,cur,next) → score=${res.score} ok=${res.ok} issues=${res.issues.length}`;
}

// ===== 全量校验 =====
async function runBatchValidation() {
  if (!state.shots.length) { toast("没有可校验的镜头", "err"); return; }
  const list = $("#aiStreamList");
  list.innerHTML = "";
  const li0 = document.createElement("li");
  li0.className = "ai-stream__item";
  li0.textContent = `开始扫描 ${state.shots.length} 个镜头…`;
  list.appendChild(li0);

  let totalScore = 0, okCount = 0, warnCount = 0, errCount = 0;
  const issueCount = {};
  for (let i = 0; i < state.shots.length; i++) {
    const li = document.createElement("li");
    li.className = "ai-stream__item";
    li.textContent = `校验 #${String(i + 1).padStart(2, "0")} ${state.shots[i].scene || ""}…`;
    list.appendChild(li);
    await runValidation(state.shots[i].id, { silent: true });
    const s = state.shots[i];
    totalScore += s._score || 0;
    if (s._verdict === "ok") okCount++;
    else if (s._verdict === "warn") warnCount++;
    else errCount++;
    if (s._verdictDetail) {
      for (const m of s._verdictDetail.split("\n")) {
        const tag = m.match(/\[(\w+)\]/);
        if (tag) issueCount[tag[1]] = (issueCount[tag[1]] || 0) + 1;
      }
    }
    li.classList.add(s._verdict === "ok" ? "is-done" : "is-warn");
    li.textContent = `${s._verdict === "ok" ? "✓" : s._verdict === "warn" ? "!" : "✗"} #${String(i + 1).padStart(2, "0")} ${s.scene || ""} · ${s._score}`;
    await new Promise(r => setTimeout(r, 60));
  }
  const avg = Math.round(totalScore / state.shots.length);
  const summary = document.createElement("li");
  summary.className = "ai-stream__item is-done";
  summary.textContent = `全量完成 · 平均分 ${avg} · ✓${okCount} !${warnCount} ✗${errCount}`;
  list.appendChild(summary);
  toast(`全量校验完成 · 平均分 ${avg}`, avg >= 80 ? "ok" : "err");
  renderBoard();
  // 把综合结果写入右侧 sdkLog
  $("#sdkLog").textContent = `// batch(${state.shots.length}) avg=${avg} ok=${okCount} warn=${warnCount} err=${errCount}\n` +
    Object.entries(issueCount).map(([k, v]) => `//   ${k}: ${v}`).join("\n");
}

// ===== AI 拆解 =====
async function runDecompose() {
  const script = $("#scriptInput").value.trim();
  if (!script) { toast("请先在脚本舱输入内容", "err"); return; }
  state.project.script = script;
  const list = $("#aiStreamList");
  list.innerHTML = "";
  const steps = [
    { t: "解析脚本段落", d: 120 },
    { t: "识别场景/对白/动作标记", d: 160 },
    { t: "启发式分配景别与运镜", d: 200 },
    { t: "补全时长与构图", d: 140 },
    { t: "调用 TRAE 预校验", d: 220 }
  ];
  for (const s of steps) {
    const li = document.createElement("li");
    li.className = "ai-stream__item";
    li.textContent = s.t + "…";
    list.appendChild(li);
    await new Promise(r => setTimeout(r, s.d));
    li.classList.add("is-done");
    li.textContent = "✓ " + s.t;
  }
  const shots = decompose(script);
  state.shots = shots;
  state.expanded = new Set(shots.slice(0, 1).map(s => s.id));
  state.activeId = shots[0]?.id || null;
  renderBoard();
  renderMeta();
  save();
  toast(`已生成 ${shots.length} 个镜头`, "ok");
  if (state.activeId) runValidation(state.activeId, { silent: true });
}

// ===== 导出 =====
function exportJSON() {
  const data = {
    project: state.project,
    shots: state.shots.map(s => ({ ...s, _verdict: undefined, _verdictLabel: undefined, _verdictDetail: undefined }))
  };
  return JSON.stringify(data, null, 2);
}

function buildPrintableHTML() {
  const rows = state.shots.map(s => `
    <tr>
      <td class="seq">${String(s.seq).padStart(2, "0")}</td>
      <td><b>${s.scene || ""}</b><br><span class="muted">${s.composition || ""}</span></td>
      <td>${s.shotSize} ${SIZE_LABEL[s.shotSize] || ""}</td>
      <td>${s.movement}</td>
      <td>${s.cameraAngle}</td>
      <td>${s.duration}s</td>
      <td>${s.dialogue ? "“" + s.dialogue + "”" : ""}</td>
      <td>${s.sfx || ""}</td>
    </tr>
  `).join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${state.project.title} · 分镜表</title>
  <style>
    body{font-family:system-ui,-apple-system,"PingFang SC","Microsoft Yahei",sans-serif;background:#fff;color:#111;padding:24px}
    h1{margin:0 0 4px;font-size:22px}
    .meta{color:#666;font-size:12px;margin-bottom:18px}
    table{width:100%;border-collapse:collapse;font-size:12.5px}
    th,td{border:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}
    th{background:#f6f6f6;font-weight:600}
    .seq{font-family:ui-monospace,monospace;color:#ff7a1a;font-weight:700;font-size:14px;width:40px;text-align:center}
    .muted{color:#777;font-size:11.5px}
  </style></head><body>
  <h1>${state.project.title} · 分镜表</h1>
  <p class="meta">${state.shots.length} 个镜头 · 总时长 ${totalRuntime()} · 由 分镜表 AI 镜头设计工作台 生成</p>
  <table><thead><tr><th>#</th><th>场景 / 构图</th><th>景别</th><th>运镜</th><th>角度</th><th>时长</th><th>对白</th><th>音效</th></tr></thead>
  <tbody>${rows}</tbody></table>
  </body></html>`;
}

// ===== 事件绑定 =====
function bind() {
  $("#btnLoadSample").addEventListener("click", () => {
    $("#scriptInput").value = SAMPLE_SCRIPT;
    toast("已载入示例脚本");
  });
  $("#btnClearScript").addEventListener("click", () => {
    $("#scriptInput").value = "";
    toast("脚本已清空");
  });
  $("#btnDecompose").addEventListener("click", runDecompose);
  $("#btnBatchValidate").addEventListener("click", runBatchValidation);

  $("#btnAddShot").addEventListener("click", () => {
    const last = state.shots[state.shots.length - 1];
    const ns = {
      id: uid(),
      seq: state.shots.length + 1,
      scene: "新场景",
      shotSize: "MS",
      movement: "static",
      composition: "",
      dialogue: "",
      sfx: "",
      duration: 3,
      cameraAngle: "平视",
      aiNote: ""
    };
    state.shots.push(ns);
    state.expanded.add(ns.id);
    renderBoard(); renderMeta(); save();
    toast("已新增镜头", "ok");
  });
  $("#btnExpandAll").addEventListener("click", () => {
    state.expanded = new Set(state.shots.map(s => s.id));
    renderBoard();
  });
  $("#btnCollapseAll").addEventListener("click", () => {
    state.expanded.clear();
    renderBoard();
  });

  $$(".view-toggle .vt").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".view-toggle .vt").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.view = btn.dataset.view;
      $("#board").dataset.view = state.view;
      renderTimelineRuler();
      save();
    });
  });

  $("#btnCopyJson").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(exportJSON());
      toast("JSON 已复制到剪贴板", "ok");
    } catch {
      toast("复制失败：浏览器拒绝访问剪贴板", "err");
    }
  });
  $("#btnPrint").addEventListener("click", () => {
    if (!state.shots.length) { toast("没有可打印的镜头", "err"); return; }
    const w = window.open("", "_blank");
    w.document.write(buildPrintableHTML());
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 200);
  });

  // 键盘快捷键
  document.addEventListener("keydown", (e) => {
    const inField = e.target.matches("input, textarea, select");
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key === "Enter") { e.preventDefault(); runDecompose(); return; }
    if (meta && e.shiftKey && (e.key === "v" || e.key === "V")) { e.preventDefault(); runBatchValidation(); return; }
    if (meta && (e.key === "p" || e.key === "P")) { e.preventDefault(); $("#btnPrint").click(); return; }
    if (meta && (e.key === "j" || e.key === "J")) { e.preventDefault(); navigator.clipboard.writeText(exportJSON()).then(() => toast("JSON 已复制", "ok")); return; }
    if (!inField && e.key === "Escape") { state.expanded.clear(); renderBoard(); return; }
  });
}

// ===== 启动 =====
function init() {
  load();
  $("#scriptInput").value = state.project.script || "";
  bind();
  renderMeta();
  renderBoard();
  if (state.shots.length && state.activeId) runValidation(state.activeId, { silent: true });
}

init();
