/* 宋太宗北伐 - 主应用
   纯原生 JavaScript，零依赖
*/

// === 全局状态 ===
const state = {
  currentScene: 0,
  currentShot: null,
  currentFilter: "all",
  searchQuery: "",
  currentView: "picker"
};

// === 工具函数 ===
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// === 渲染：场景选择器 ===
function renderSceneList() {
  const wrap = $("#scene-list");
  let html = `<h3>剧本章节 (${SCRIPT_DATA.scenes.length})</h3>`;
  SCRIPT_DATA.scenes.forEach((sc, i) => {
    const dur = sc.shots[sc.shots.length - 1].endTime - sc.shots[0].startTime;
    const durStr = `${Math.floor(dur/60)}分${dur%60}秒 · ${sc.shots.length}镜`;
    html += `<div class="scene-item ${i === state.currentScene ? "active" : ""}" data-i="${i}">
      <span class="no">${String(i+1).padStart(2,"0")}</span>${escapeHTML(sc.title)}
      <span class="dur">${durStr}</span>
    </div>`;
  });
  wrap.innerHTML = html;
  wrap.querySelectorAll(".scene-item").forEach(el => {
    el.addEventListener("click", () => {
      state.currentScene = +el.dataset.i;
      renderSceneList();
      renderSceneDetail();
    });
  });
}

function renderSceneDetail() {
  const sc = SCRIPT_DATA.scenes[state.currentScene];
  const first = sc.shots[0], last = sc.shots[sc.shots.length-1];
  const wrap = $("#scene-detail");
  wrap.innerHTML = `
    <h2>${escapeHTML(sc.title)}</h2>
    <div class="meta">
      ${escapeHTML(sc.subtitle)} ·
      ${fmtTime(first.startTime)} – ${fmtTime(last.endTime)} ·
      ${sc.shots.length} 个分镜 · ${sc.shots.length * 15} 秒
    </div>
    <div class="script-text">${escapeHTML(sc.explanation)}</div>
    <div class="explain">
      <h4>分镜预览</h4>
      <div class="shot-grid" style="margin-top:10px">
        ${sc.shots.map((s, i) => `
          <div class="shot" style="cursor:pointer" data-shot="${i}">
            <div class="no">${sc.shots[0].id.replace("s","")}</div>
            <div class="time">${fmtTime(s.startTime)} → ${fmtTime(s.endTime)}</div>
            <div class="title">${escapeHTML(s.title)}</div>
            <div class="script">${escapeHTML(s.script)}</div>
            <div class="label">出场角色</div>
            <div class="chars">${s.characters.map(c => `<span>${escapeHTML(c.name)}</span>`).join("")}</div>
            <div class="label">位置设计</div>
            <div class="position">${escapeHTML(s.position)}</div>
            <div class="actions">
              <button onclick="openShotDetail('${s.id}')">展开详情</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  wrap.querySelectorAll("[data-shot]").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.tagName !== "BUTTON") openShotDetail(sc.shots[+el.dataset.shot].id);
    });
  });
}

// === 渲染：分镜表 ===
function renderStoryboard() {
  const filterScene = $("#filter-scene").value;
  const filterChar = $("#filter-char").value;
  const searchQ = ($("#search-q").value || "").trim().toLowerCase();

  const allShots = [];
  SCRIPT_DATA.scenes.forEach((sc, si) => {
    sc.shots.forEach(s => allShots.push({...s, sceneIndex: si, sceneTitle: sc.title}));
  });

  const filtered = allShots.filter(s => {
    if (filterScene !== "all" && s.sceneIndex !== +filterScene) return false;
    if (filterChar !== "all" && !s.characters.some(c => c.name === filterChar)) return false;
    if (searchQ && !(s.title.toLowerCase().includes(searchQ) || s.script.toLowerCase().includes(searchQ))) return false;
    return true;
  });

  const grid = $("#shot-grid");
  grid.innerHTML = filtered.map(s => `
    <div class="shot">
      <div class="no">${s.id.replace("s","")}</div>
      <div class="time">${fmtTime(s.startTime)} → ${fmtTime(s.endTime)} · ${s.sceneTitle.split("·")[0].trim()}</div>
      <div class="title">${escapeHTML(s.title)}</div>
      <div class="script">${escapeHTML(s.script)}</div>
      <div class="label">出场角色 / 位置</div>
      <div class="chars">
        ${s.characters.map(c => `<span class="${c.pos==='0'?'vermilion':'jade'}">${escapeHTML(c.name)}</span>`).join("")}
      </div>
      <div class="position-diagram">
        ${renderPosition(s.characters)}
      </div>
      <div class="position" style="font-size:11px;color:#5d4037">${escapeHTML(s.position)}</div>
      <div class="label">AI 提示词 (15s 出图)</div>
      <div class="prompt">${escapeHTML(s.prompt)}</div>
      <div class="label">特殊效果</div>
      <div class="fx"><span>${escapeHTML(s.fx)}</span></div>
      <div class="actions">
        <button onclick="openShotDetail('${s.id}')">展开</button>
        <button onclick="copyPrompt('${s.id}')">复制提示词</button>
        <button onclick="previewFX('${s.fx}')">预览效果</button>
      </div>
    </div>
  `).join("");

  $("#shot-count").textContent = `${filtered.length} / ${allShots.length} 镜`;

  // 更新进度条
  const prog = $("#prog");
  if (prog) {
    const completed = filtered.length / allShots.length * 100;
    prog.style.width = completed + "%";
  }
}

// 简易位置示意 - 使用角色像素艺术
function renderPosition(chars) {
  const posMap = {
    "0": { left: "50%", top: "60%" },
    "1": { left: "25%", top: "60%" },
    "2": { left: "75%", top: "60%" },
    "3": { left: "20%", top: "35%" },
    "4": { left: "80%", top: "35%" },
    "5": { left: "50%", top: "15%" },
    "6": { left: "50%", top: "85%" }
  };
  return chars.map((c, i) => {
    const p = posMap[c.pos] || posMap["0"];
    const color = c.pos === "0" ? "" : (c.pos === "1" || c.pos === "2" ? "jade" : "gold");
    // 尝试查找角色并显示像素艺术
    const charData = SCRIPT_DATA.characters.find(x => x.name === c.name);
    const anim = i % 3; // 0=跳动, 1=摇摆, 2=待机
    return `<div class="dot ${color}" data-i="${i}" data-anim="${anim}" style="left:${p.left};top:${p.top}">
      ${charData ? `<div class="pos-char" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);width:28px;height:28px;animation:${anim===0?'bounce 1.2s':anim===1?'sway 1.5s':'idle 1s'} infinite">${renderPixel(charData.frames?.idle || charData.pixel, charData.palette || charData.colors, 4)}</div>` : ""}
      <span style="position:relative;z-index:2">${i+1}</span>
    </div>`;
  }).join("");
}

// === 渲染：角色设计 ===
function renderCharacters() {
  const grid = $("#char-grid");
  // 状态标签
  const stateLabels = {
    idle: "默认", walk1: "行走 1", walk2: "行走 2",
    attack: "攻击", hurt: "受伤", die: "阵亡", special: "特殊"
  };
  grid.innerHTML = SCRIPT_DATA.characters.map(c => {
    const frames = c.frames || { idle: c.pixel };
    const palette = c.palette || c.colors;
    // 6 个状态小图
    const states = ["idle", "walk1", "walk2", "attack", "hurt", "die", "special"].filter(s => frames[s]);
    return `
    <div class="char-card" data-char-id="${c.id}">
      <div class="char-portrait char-main" data-frame="walk1" style="height:160px">
        ${renderPixel(frames.walk1 || frames.idle, palette)}
      </div>
      <h3>${escapeHTML(c.name)}</h3>
      <div class="role">${escapeHTML(c.role)}</div>
      <div class="desc">${escapeHTML(c.desc)}</div>
      <div class="char-frames" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:10px;background:#ebe0c6;padding:6px;border-radius:3px">
        ${states.map(s => `
          <div class="char-frame-btn" data-state="${s}" data-char="${c.id}" style="cursor:pointer;text-align:center;padding:4px;border:1px solid #8b6f47;border-radius:3px;background:#f5ecd7;transition:all .15s" title="${stateLabels[s]}">
            <div style="width:100%;aspect-ratio:1/1;overflow:hidden">
              ${renderPixel(frames[s], palette, 50)}
            </div>
            <div style="font-size:9px;color:#5d4037;margin-top:2px">${stateLabels[s]}</div>
          </div>
        `).join("")}
      </div>
      <div class="char-actions" style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">
        <button class="char-anim-btn" data-char="${c.id}" data-mode="cycle" style="flex:1;padding:6px;font-size:11px;background:#2c7873;color:#f5ecd7;border:none;border-radius:3px;cursor:pointer">▶ 循环动画</button>
        <button class="char-anim-btn" data-char="${c.id}" data-mode="walk" style="flex:1;padding:6px;font-size:11px;background:#b8860b;color:#1a1a1a;border:none;border-radius:3px;cursor:pointer">🚶 行走</button>
        <button class="char-anim-btn" data-char="${c.id}" data-mode="attack" style="flex:1;padding:6px;font-size:11px;background:#b03a2e;color:#f5ecd7;border:none;border-radius:3px;cursor:pointer">⚔ 攻击</button>
      </div>
    </div>
  `}).join("");

  // 绑定状态切换
  grid.querySelectorAll(".char-frame-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const charId = btn.dataset.char;
      const state = btn.dataset.state;
      const card = grid.querySelector(`[data-char-id="${charId}"]`);
      const char = SCRIPT_DATA.characters.find(x => x.id === charId);
      const main = card.querySelector(".char-main");
      if (char && char.frames) {
        main.innerHTML = renderPixel(char.frames[state], char.palette || char.colors);
        // 高亮当前选中的状态
        card.querySelectorAll(".char-frame-btn").forEach(b => {
          b.style.background = "#f5ecd7";
          b.style.borderColor = "#8b6f47";
        });
        btn.style.background = "#fadbd8";
        btn.style.borderColor = "#b03a2e";
      }
    });
    btn.addEventListener("mouseenter", () => { if (btn.style.background !== "rgb(250, 219, 210)") btn.style.background = "#fadbd8"; });
    btn.addEventListener("mouseleave", () => { if (btn.style.background !== "rgb(250, 219, 210)") btn.style.background = "#f5ecd7"; });
  });

  // 绑定动画播放
  grid.querySelectorAll(".char-anim-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const charId = btn.dataset.char;
      const mode = btn.dataset.mode;
      const char = SCRIPT_DATA.characters.find(x => x.id === charId);
      if (!char || !char.frames) return;
      const card = grid.querySelector(`[data-char-id="${charId}"]`);
      const main = card.querySelector(".char-main");
      main.dataset.frame = mode;
      main.dataset.playing = "1";
      // 立即开始
      playCharAnim(char, main, mode);
    });
  });
}

function playCharAnim(char, mainEl, mode) {
  const palette = char.palette || char.colors;
  const frames = char.frames;
  if (!frames) return;
  let sequence = [];
  if (mode === "cycle") {
    sequence = ["idle", "walk1", "walk2", "attack", "special", "idle"];
  } else if (mode === "walk") {
    sequence = ["walk1", "walk2", "walk1", "walk2"];
  } else if (mode === "attack") {
    sequence = ["idle", "attack", "attack", "hurt", "idle"];
  }
  let i = 0;
  const tick = () => {
    if (mainEl.dataset.playing !== "1" || mainEl.dataset.frame !== mode) return;
    const state = sequence[i % sequence.length];
    mainEl.innerHTML = renderPixel(frames[state], palette);
    i++;
    setTimeout(tick, mode === "attack" ? 250 : 400);
  };
  tick();
}

function renderPixel(pixel, palette, size) {
  // 支持传入像素数组和调色板
  if (typeof pixel === "object" && !Array.isArray(pixel) && pixel.pixel) {
    palette = pixel.colors || pixel.palette;
    pixel = pixel.pixel;
  }
  // pixel: 字符串数组, palette: 颜色映射
  if (size === undefined) size = 12;
  const w = pixel[0].length * size;
  const h = pixel.length * size;
  let rects = "";
  pixel.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = palette[ch];
      if (color) rects += `<rect x="${x*size}" y="${y*size}" width="${size}" height="${size}" fill="${color}"/>`;
    });
  });
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#f5ecd7;width:100%;height:100%">
    ${rects}
  </svg>`;
}

// === 渲染：特效 ===
function renderEffects() {
  const grid = $("#fx-grid");
  grid.innerHTML = SCRIPT_DATA.effects.map(e => `
    <div class="fx-card">
      <div class="fx-stage" id="fx-${e.id}">${getEffectHTML(e.html)}</div>
      <div class="info">
        <h4>${escapeHTML(e.name)}</h4>
        <p>${escapeHTML(e.desc)}</p>
      </div>
    </div>
  `).join("");
}

function getEffectHTML(type) {
  switch (type) {
    case "candle":
      return `<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%)">
        <div style="width:30px;height:60px;background:linear-gradient(#d4a373,#8b6f47);border-radius:4px"></div>
        <div class="candle-flame"></div>
        <div class="candle-glow"></div>
      </div>`;
    case "dust":
      return `<div class="dust-field">
        ${Array.from({length:30}, ()=>`<div class="dust-particle"></div>`).join("")}
      </div>`;
    case "arrow":
      return `<div class="arrow-rain">
        ${Array.from({length:40}, ()=>`<div class="arrow-bolt"></div>`).join("")}
      </div>`;
    case "fire":
      return `<div class="fire-field">
        <div class="fire-flame f1"></div>
        <div class="fire-flame f2"></div>
        <div class="fire-flame f3"></div>
        <div class="fire-smoke"></div>
      </div>`;
    case "blood":
      return `<div class="blood-river">
        ${Array.from({length:12}, ()=>`<div class="blood-body"></div>`).join("")}
      </div>`;
    case "snow":
      return `<div class="snow-field">
        ${Array.from({length:50}, ()=>`<div class="snow-flake"></div>`).join("")}
      </div>`;
    case "imperial":
      return `<div class="imperial-glow">
        <div class="imperial-dragon"></div>
        <div class="imperial-rays"></div>
      </div>`;
    case "donkey":
      return `<div class="donkey-scene">
        <div class="road"></div>
        <div class="donkey-cart">
          <div class="cart"></div>
          <div class="donkey"></div>
          <div class="wheels w1"></div>
          <div class="wheels w2"></div>
        </div>
        <div class="dust-trail"></div>
      </div>`;
  }
  return "";
}

// === 弹窗：分镜详情 ===
function openShotDetail(shotId) {
  let found = null, sc = null;
  for (const s of SCRIPT_DATA.scenes) {
    const f = s.shots.find(x => x.id === shotId);
    if (f) { found = f; sc = s; break; }
  }
  if (!found) return;
  state.currentShot = found;
  $("#shot-modal-title").textContent = `${found.id} · ${found.title}`;
  $("#shot-modal-body").innerHTML = `
    <div class="detail">
      <div class="meta">${fmtTime(found.startTime)} → ${fmtTime(found.endTime)} · 时长 15 秒</div>
      <div class="script-text" style="font-size:15px">${escapeHTML(found.script)}</div>
      <h4 style="color:#b03a2e;margin:12px 0 6px">出场角色与位置</h4>
      <div class="chars">
        ${found.characters.map(c => `<span class="${c.pos==='0'?'vermilion':'jade'}">${escapeHTML(c.name)} (${escapeHTML(c.role)}) - ${escapeHTML(c.emotion)}</span>`).join("")}
      </div>
      <div class="position-diagram" style="height:140px;margin:8px 0">${renderPosition(found.characters)}</div>
      <p style="font-size:13px;color:#5d4037;margin-bottom:10px">${escapeHTML(found.position)}</p>

      <h4 style="color:#b03a2e;margin:12px 0 6px">AI 生图提示词 (15s 出图)</h4>
      <div class="shot" style="background:#1a1a1a;color:#f5ecd7;font-family:monospace;padding:12px;font-size:12px;white-space:pre-wrap;line-height:1.6">${escapeHTML(found.prompt)}</div>
      <button class="game-buttons" style="margin-top:8px" onclick="copyPrompt('${found.id}')">复制提示词</button>

      <h4 style="color:#b03a2e;margin:12px 0 6px">特殊效果</h4>
      <p>${escapeHTML(found.fx)}</p>
      <div class="fx-stage" style="height:200px;margin:8px 0;border-radius:4px;border:1px solid #8b6f47">${getEffectHTML(fxIdToType(found.fx))}</div>

      <h4 style="color:#b03a2e;margin:12px 0 6px">历史解释</h4>
      <p style="line-height:1.8;background:#ebe0c6;padding:12px;border-left:4px solid #2c7873">${escapeHTML(found.explanation)}</p>
    </div>
  `;
  $("#shot-modal").classList.add("show");
}

function fxIdToType(name) {
  if (name.includes("烛火")) return "candle";
  if (name.includes("尘") || name.includes("扬") || name.includes("蹄")) return "dust";
  if (name.includes("箭")) return "arrow";
  if (name.includes("火") || name.includes("焚")) return "fire";
  if (name.includes("血")) return "blood";
  if (name.includes("雪")) return "snow";
  if (name.includes("金辉")) return "imperial";
  if (name.includes("驴")) return "donkey";
  return "candle";
}

function closeShotModal() { $("#shot-modal").classList.remove("show"); }

function copyPrompt(shotId) {
  let s = null;
  for (const sc of SCRIPT_DATA.scenes) {
    s = sc.shots.find(x => x.id === shotId);
    if (s) break;
  }
  if (!s) return;
  navigator.clipboard.writeText(s.prompt).then(() => {
    alert(`已复制分镜 ${shotId} 的 AI 提示词`);
  }).catch(() => {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = s.prompt;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert(`已复制分镜 ${shotId} 的 AI 提示词`);
  });
}

function previewFX(name) {
  // 找到对应分镜并展示弹窗
  for (const sc of SCRIPT_DATA.scenes) {
    const s = sc.shots.find(x => x.fx === name);
    if (s) { openShotDetail(s.id); return; }
  }
}

// === Tabs ===
function switchView(name) {
  state.currentView = name;
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  $$(".view").forEach(v => v.classList.toggle("active", v.id === `view-${name}`));
  if (name === "storyboard") renderStoryboard();
  if (name === "characters") renderCharacters();
  if (name === "effects") renderEffects();
  if (name === "game") initGame();
}

// === 填充筛选器 ===
function populateFilters() {
  const sc = $("#filter-scene");
  sc.innerHTML = `<option value="all">全部场景</option>` +
    SCRIPT_DATA.scenes.map((s, i) => `<option value="${i}">${escapeHTML(s.title)}</option>`).join("");

  const ch = $("#filter-char");
  const allChars = new Set();
  SCRIPT_DATA.scenes.forEach(s => s.shots.forEach(sh => sh.characters.forEach(c => allChars.add(c.name))));
  ch.innerHTML = `<option value="all">全部角色</option>` +
    [...allChars].map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
}

// === 像素游戏：高粱河突围（增强版） ===
let game = null;
function initGame() {
  if (game) return;
  const canvas = $("#game");
  if (!canvas) return;
  game = new Game(canvas);
  game.start();
  // 渲染关卡列表
  renderLevelList();
  // 按钮事件
  const bs = $("#btn-start");
  const br = $("#btn-reset");
  const bl = $("#btn-leaderboard");
  if (bs) bs.addEventListener("click", () => game.startGame());
  if (br) br.addEventListener("click", () => game.restartLevel());
  if (bl) bl.addEventListener("click", showLeaderboard);
}

function renderLevelList() {
  const wrap = $("#level-list");
  if (!wrap || !window.LEVELS) return;
  wrap.innerHTML = LEVELS.map((lv, i) => `
    <div class="level-card" data-i="${i}" style="
      background:#f5ecd7;border:2px solid #8b6f47;border-radius:4px;padding:10px;cursor:pointer;
      transition:all .2s;
    ">
      <div style="color:#b03a2e;font-weight:700;font-size:14px;margin-bottom:4px">${escapeHTML(lv.name)}</div>
      <div style="color:#b8860b;font-size:11px;margin-bottom:4px">${escapeHTML(lv.subtitle)}</div>
      <div style="color:#5d4037;font-size:11px;line-height:1.5">${escapeHTML(lv.story)}</div>
      <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">
        ${(lv.enemyTypes || []).map(t => `<span style="background:#ebe0c6;padding:1px 6px;border-radius:8px;font-size:10px">${escapeHTML(ENEMY_DEFS[t]?.name || t)}</span>`).join("")}
        ${lv.boss ? `<span style="background:#f5d6d2;border:1px solid #b03a2e;padding:1px 6px;border-radius:8px;font-size:10px;color:#b03a2e;font-weight:700">👑 ${escapeHTML(ENEMY_DEFS[lv.boss.type]?.name || "Boss")}</span>` : ""}
      </div>
    </div>
  `).join("");
  wrap.querySelectorAll(".level-card").forEach(el => {
    el.addEventListener("click", () => {
      const i = +el.dataset.i;
      if (game) {
        game.startGame();
        game.loadLevel(i);
      }
    });
    el.addEventListener("mouseenter", () => el.style.background = "#ebe0c6");
    el.addEventListener("mouseleave", () => el.style.background = "#f5ecd7");
  });
}

function showLeaderboard() {
  if (!window.scoreboard) return;
  const tops = window.scoreboard.getAllTop(10);
  if (tops.length === 0) {
    alert("暂无排行，快来挑战吧！");
    return;
  }
  let msg = "🏆 历史战役排行\n\n";
  tops.forEach((s, i) => {
    const medal = ["🥇","🥈","🥉","④","⑤","⑥","⑦","⑧","⑨","⑩"][i] || `${i+1}`;
    msg += `${medal} ${s.name} - ${s.level} - ${s.score}分\n`;
  });
  alert(msg);
}

// === 初始化 ===
window.addEventListener("DOMContentLoaded", () => {
  renderSceneList();
  renderSceneDetail();
  populateFilters();
  $("#filter-scene").addEventListener("change", renderStoryboard);
  $("#filter-char").addEventListener("change", renderStoryboard);
  $("#search-q").addEventListener("input", renderStoryboard);
  $$(".tab").forEach(t => t.addEventListener("click", () => switchView(t.dataset.tab)));
  $("#modal-close").addEventListener("click", closeShotModal);
  $("#shot-modal").addEventListener("click", e => { if (e.target.id === "shot-modal") closeShotModal(); });
  // 默认进入选择器视图
  switchView("picker");
});
