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

// 简易位置示意
function renderPosition(chars) {
  // 根据 pos 字段定位
  const posMap = {
    "0": { left: "50%", top: "60%" },   // 中央
    "1": { left: "25%", top: "60%" },   // 左前
    "2": { left: "75%", top: "60%" },   // 右前
    "3": { left: "20%", top: "35%" },   // 左后
    "4": { left: "80%", top: "35%" },   // 右后
    "5": { left: "50%", top: "15%" },   // 上方
    "6": { left: "50%", top: "85%" }    // 下方
  };
  return chars.map((c, i) => {
    const p = posMap[c.pos] || posMap["0"];
    const color = c.pos === "0" ? "" : (c.pos === "1" || c.pos === "2" ? "jade" : "gold");
    return `<div class="dot ${color}" style="left:${p.left};top:${p.top}">${i+1}</div>`;
  }).join("");
}

// === 渲染：角色设计 ===
function renderCharacters() {
  const grid = $("#char-grid");
  grid.innerHTML = SCRIPT_DATA.characters.map(c => `
    <div class="char-card">
      <div class="char-portrait">${renderPixel(c)}</div>
      <h3>${escapeHTML(c.name)}</h3>
      <div class="role">${escapeHTML(c.role)}</div>
      <div class="desc">${escapeHTML(c.desc)}</div>
    </div>
  `).join("");
}

function renderPixel(char) {
  // 用 SVG 渲染像素艺术
  const size = 12; // 每格像素大小
  const w = char.pixel[0].length * size;
  const h = char.pixel.length * size;
  let rects = "";
  char.pixel.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = char.colors[ch];
      if (color) rects += `<rect x="${x*size}" y="${y*size}" width="${size}" height="${size}" fill="${color}"/>`;
    });
  });
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#f5ecd7">
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

// === 像素游戏：高粱河突围 ===
let game = null;
function initGame() {
  if (game) return; // 已初始化
  const canvas = $("#game");
  const ctx = canvas.getContext("2d");
  canvas.width = 480; canvas.height = 270;
  const W = canvas.width, H = canvas.height;

  // 关卡地图：12列x9格的 16:9 像素地图
  const map = [
    "TTTTTTTTTTTT",
    "T..........T",
    "T..CCC..CCC.T",
    "T..........T",
    "T....B..B..T",
    "T..........T",
    "T..CCC..CCC.T",
    "T..........T",
    "TTTTTTTTTTTT"
  ];
  const tile = 30; // 30px
  const COLS = map[0].length, ROWS = map.length;

  // 玩家 = 驴车上的赵光义
  const player = { x: 1*tile + 4, y: 4*tile + 4, w: 22, h: 22, dir: 1, hp: 3, score: 0, invuln: 0, onCart: true };
  // 敌人 = 辽国骑兵 (C) 与路障 (B)
  const enemies = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (map[r][c] === "C") enemies.push({ x: c*tile, y: r*tile, w: 22, h: 22, type: "khitan", vx: (Math.random()<0.5?-1:1)*0.6, vy: 0 });
      if (map[r][c] === "B") enemies.push({ x: c*tile+4, y: r*tile+4, w: 22, h: 22, type: "barricade" });
    }
  }

  const goal = { x: (COLS-2)*tile, y: 4*tile };

  let keys = {};
  let rafId = null, running = false, over = false, won = false;
  let frameCount = 0;

  // 输入
  document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === "r" || e.key === "R") reset();
  });
  document.addEventListener("keyup", e => { keys[e.key] = false; });

  // 移动控制
  $$(".mobile-pad button[data-dir]").forEach(b => {
    b.addEventListener("touchstart", e => { e.preventDefault(); keys[b.dataset.dir] = true; });
    b.addEventListener("touchend", e => { e.preventDefault(); keys[b.dataset.dir] = false; });
    b.addEventListener("mousedown", e => { keys[b.dataset.dir] = true; });
    b.addEventListener("mouseup", e => { keys[b.dataset.dir] = false; });
  });
  $("#btn-start")?.addEventListener("click", () => { running = true; $("#game-msg").textContent = "驾！驾！驾驴车突围！"; });
  $("#btn-reset")?.addEventListener("click", reset);

  function reset() {
    player.x = 1*tile + 4; player.y = 4*tile + 4; player.hp = 3; player.score = 0; player.invuln = 0; player.dir = 1;
    enemies.forEach((e, i) => {
      const arr = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if ((map[r][c] === "C" && arr.length === 0) || (map[r][c] === "C" && arr.length === 1)) {
          if (!arr.includes(c + "," + r)) {
            arr.push(c + "," + r);
            if (arr.length === 2) break;
          }
        }
        if (arr.length >= 2) break;
      }
      e.x = e.x; e.y = e.y; e.vx = Math.abs(e.vx) * (Math.random()<0.5?1:-1);
    });
    over = false; won = false; running = true;
    $("#game-msg").textContent = "驾！驾！驾驴车突围！";
  }

  function rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    if (!running || over) return;
    frameCount++;
    // 玩家移动
    const speed = 2;
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) { player.x -= speed; player.dir = -1; }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) { player.x += speed; player.dir = 1; }
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) player.y -= speed;
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) player.y += speed;
    // 边界
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    player.y = Math.max(0, Math.min(H - player.h, player.y));

    // 敌人移动
    enemies.forEach(e => {
      if (e.type === "khitan") {
        e.x += e.vx;
        if (e.x < 0 || e.x + e.w > W) e.vx = -e.vx;
        e.y += Math.sin((frameCount + e.x) * 0.05) * 0.3;
      }
      // 碰撞
      if (rectCollide(player, e) && player.invuln <= 0) {
        player.hp--;
        player.invuln = 60;
        player.score = Math.max(0, player.score - 1);
        if (player.hp <= 0) { over = true; $("#game-msg").textContent = "💀 阵亡！按 R 重来 (高粱河之败重演)"; }
      }
    });
    if (player.invuln > 0) player.invuln--;

    // 到达终点
    if (Math.abs(player.x - goal.x) < tile && Math.abs(player.y - goal.y) < tile) {
      won = true; over = true; running = false;
      player.score += 10;
      $("#game-msg").innerHTML = `🏆 成功突围！驴车漂移之神！得分：${player.score}，按 R 再来`;
    }

    // 每帧加分（逃亡）
    player.score++;
  }

  function draw() {
    // 背景
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, W, H);
    // 草地
    ctx.fillStyle = "#2d4a2d";
    ctx.fillRect(0, 0, W, H);
    // 网格
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c*tile, y = r*tile;
        if ((r+c) % 2 === 0) {
          ctx.fillStyle = "#3a5a3a";
          ctx.fillRect(x, y, tile, tile);
        }
        // 边界
        if (map[r][c] === "T") {
          ctx.fillStyle = "#5d4e8c";
          ctx.fillRect(x, y, tile, tile);
        }
      }
    }

    // 终点
    ctx.fillStyle = "#f5ecd7";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("涿州→", goal.x + tile/2, goal.y + tile/2 + 6);
    ctx.strokeStyle = "#b8860b"; ctx.lineWidth = 3;
    ctx.strokeRect(goal.x - 2, goal.y - 2, tile + 4, tile + 4);

    // 敌人
    enemies.forEach(e => {
      if (e.type === "khitan") {
        // 辽国骑兵
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(e.x + 6, e.y + 2, 10, 10); // 头
        ctx.fillStyle = "#2c7873";
        ctx.fillRect(e.x + 4, e.y + 10, 14, 8); // 身
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(e.x + 8, e.y + 18, 6, 4); // 腿
        // 武器
        ctx.fillStyle = "#8b6f47";
        ctx.fillRect(e.x + 18, e.y + 4, 2, 12);
      } else {
        // 路障
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(e.x + 2, e.y + 2, e.w - 4, 4);
        ctx.fillRect(e.x + 2, e.y + e.h - 6, e.w - 4, 4);
      }
    });

    // 玩家：驴车
    if (player.invuln <= 0 || Math.floor(frameCount/4) % 2 === 0) {
      const px = player.x, py = player.y;
      // 驴
      ctx.fillStyle = "#8b6f47";
      ctx.fillRect(px + 2, py + 6, 8, 10);
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(px + 1, py + 4, 6, 4); // 头
      ctx.fillRect(px - 2, py + 16, 3, 4); // 尾
      // 车
      ctx.fillStyle = "#8b1a1a";
      ctx.fillRect(px + 10, py + 4, 12, 12);
      // 皇帝（缩在车上）
      ctx.fillStyle = "#b8860b";
      ctx.fillRect(px + 12, py + 2, 6, 4);
      ctx.fillStyle = "#f4d03f";
      ctx.fillRect(px + 14, py + 6, 2, 4);
      // 轮子
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(px + 12, py + 18, 3, 0, Math.PI * 2);
      ctx.arc(px + 20, py + 18, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD
    ctx.fillStyle = "#f5ecd7";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`❤️ HP: ${"♥".repeat(player.hp)}`, 8, 16);
    ctx.fillText(`⭐ 得分: ${player.score}`, 8, 32);
    ctx.fillText(`🎯 目标: 驾驴车到右侧`, 8, 48);
    ctx.fillText(`🕹️ 方向键/WASD 移动`, 8, H - 8);

    if (over) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = won ? "#b8860b" : "#b03a2e";
      ctx.font = "bold 24px serif";
      ctx.textAlign = "center";
      ctx.fillText(won ? "突围成功！" : "赵光义中箭！", W/2, H/2 - 20);
      ctx.fillStyle = "#f5ecd7";
      ctx.font = "14px serif";
      ctx.fillText(won ? "你已成为新一代'高粱河车神'" : "按 R 重新突围", W/2, H/2 + 20);
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
  game = { ctx, player, enemies, map };
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
