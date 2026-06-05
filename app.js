/* =========================================================
   Crystal Plain · Storyboard Vol.01
   - Hardcoded storyboard data (from user's source script)
   - Builds the timeline rail ticks
   - Renders shot cards
   - Drives IntersectionObserver reveal + AI image loading
   - Listens to scroll for rail cursor + top progress
   ========================================================= */

const STORYBOARD = [
  {
    id: "01",
    timecode: "0:00 – 0:08",
    duration: "00:08",
    shotSize: "极大全景 → 全景",
    camera: "置换差沉降",
    visual:
      "从算穹万米高空瞬间沉降至地面，无过渡，空间如折叠。" +
      "天空是巨大的数学天球仪，黎曼曲面如紫金山脉悬浮，" +
      "斐波那契螺旋如银河运转。地面是晶体平原。" +
      "画面底部，朔（校服）作为微小黑点行走，不足画面 1/50。",
    dialogue: "（无）",
    sfx: "低频天则运转声（管风琴 + 钟楼混合），宏大的神圣嗡鸣",
    aiPrompt:
      "Fantasy apocalyptic anime, extreme wide shot, gigantic " +
      "mathematical celestial sphere as purple-gold sky, Riemann " +
      "surfaces as floating mountain ranges, Fibonacci spiral as " +
      "galaxy, tiny school student in uniform walking on " +
      "crystalline plain, figure less than 1/50 of frame, " +
      "displacement difference lens descent from sky to ground, " +
      "no hard cut, sacred geometry, Makoto Shinkai color " +
      "palette, 8k, cinematic",
    imageSize: "landscape_16_9",
    cueSeconds: 4, // midpoint of this shot, used to light the rail
  },
  {
    id: "02",
    timecode: "0:08 – 0:15",
    duration: "00:07",
    shotSize: "全景 → 中景",
    camera: "手持跟随",
    visual:
      "沉降完成，镜头落在朔身后 3 米处。" +
      "朔背着书包，行走在晶体平原上，步伐是普通的上学步速。" +
      "前方横亘一座倾倒的巨型公式石碑，表面生长晶体苔藓。",
    dialogue: "（内心独白，平静）\u201C今天也要好好记录。\u201D",
    sfx: "脚步声（轻微，几乎被天则声淹没），晶体地面细微的共鸣",
    aiPrompt:
      "Handheld following shot, school student in uniform " +
      "walking on crystalline plain toward giant tilted " +
      "formula stele, stele covered with crystal moss, " +
      "breathing motion, micro-shake, natural lighting, " +
      "purple-gold sky, fantasy anime aesthetic, 8k",
    imageSize: "landscape_16_9",
    cueSeconds: 12,
  },
];

const TOTAL_SECONDS = 15;

/* ============== helpers ============== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function buildImageUrl(prompt, size) {
  const base = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";
  return `${base}?prompt=${encodeURIComponent(prompt)}&image_size=${encodeURIComponent(
    size
  )}`;
}

/* SVG icon factory */
function icon(name) {
  const common = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
  const map = {
    camera: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M3 7h3l2-2h8l2 2h3v12H3z"/><circle cx="12" cy="13" r="4"/></svg>`,
    aperture: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><circle cx="12" cy="12" r="9"/><path d="M12 3 L17 9 L7 9 Z M21 12 L15 17 L15 7 Z M12 21 L7 15 L17 15 Z M3 12 L9 7 L9 17 Z"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></svg>`,
    speaker: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>`,
    quote: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M7 7h4v6H7c0 2 1 4 4 4v2c-4 0-6-3-6-7zM15 7h4v6h-4c0 2 1 4 4 4v2c-4 0-6-3-6-7z"/></svg>`,
    code: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M8 8 3 12l5 4M16 8l5 4-5 4M14 4 10 20"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" width="14" height="14" ${common}><path d="M12 2 14 9 21 12 14 15 12 22 10 15 3 12 10 9z"/></svg>`,
  };
  return map[name] || "";
}

/* ============== render rail ticks ============== */
function renderRail() {
  const scale = $("#railScale");
  for (let s = 0; s <= TOTAL_SECONDS; s++) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.dataset.second = String(s);
    tick.style.top = `${(s / TOTAL_SECONDS) * 100}%`;
    tick.innerHTML = `
      <div class="tick__bar"></div>
      <div class="tick__label">${s.toString().padStart(2, "0")}s</div>
    `;
    scale.appendChild(tick);
  }
}

/* ============== render shots ============== */
function makeField(label, value, opts = {}) {
  const cls = ["field"];
  if (opts.modifier) cls.push(`field--${opts.modifier}`);
  if (opts.mono) cls.push("field--mono-wrap");

  const valueCls = [
    "field__value",
    opts.mono && "field__value--mono",
    opts.quote && "field__value--quote",
    opts.empty && "field__value--empty",
  ]
    .filter(Boolean)
    .join(" ");

  const safeValue = (value || "").replace(/</g, "&lt;");
  return `
    <div class="${cls.join(" ")}">
      <div class="field__label">${label}</div>
      <div class="${valueCls}">${
        opts.empty
          ? `${icon("quote")} ${safeValue || "—"}`
          : safeValue
      }</div>
    </div>
  `;
}

function makeWaveBars(seed) {
  // deterministic pseudo-random bars, 28 of them
  const bars = [];
  let x = seed * 9301 + 49297;
  for (let i = 0; i < 28; i++) {
    x = (x * 9301 + 49297) % 233280;
    const h = 18 + (x / 233280) * 70;
    bars.push(`<span style="height:${h.toFixed(0)}%;animation-delay:${(i * 60).toFixed(0)}ms"></span>`);
  }
  return bars.join("");
}

function renderShots() {
  const root = $("#shots");
  root.innerHTML = STORYBOARD.map((s) => {
    const isEmptyDialogue = !s.dialogue || s.dialogue.includes("（无）");
    return `
      <article class="shot" id="shot-${s.id}" data-second="${s.cueSeconds}">
        <div class="shot__frame">
          <div class="shot__timecode">TC ${s.timecode}</div>
          <div class="shot__duration">DUR ${s.duration}</div>
          <div class="shot__frame-corners">
            <span class="corner-bl"></span><span class="corner-br"></span>
          </div>
          <div class="shot__img-placeholder" data-placeholder>
            ${icon("aperture")}
            <span>RENDERING · ${s.aiPrompt.split(" ").slice(0, 3).join(" ").toUpperCase()}</span>
          </div>
          <div
            class="shot__img"
            data-img
            data-prompt="${encodeURIComponent(s.aiPrompt)}"
            data-size="${s.imageSize}"
            style="background-image:url('${buildImageUrl(s.aiPrompt, s.imageSize)}')"
          ></div>
        </div>

        <div class="shot__field">
          <div class="shot__id">${icon("camera")} Shot ${s.id} · ${s.shotSize}</div>

          ${makeField("景别", s.shotSize)}
          ${makeField("镜头", s.camera)}
          ${makeField("视觉", s.visual, { modifier: "visual" })}
          ${makeField(
            "台词",
            isEmptyDialogue ? "无对白" : s.dialogue,
            { quote: !isEmptyDialogue, empty: isEmptyDialogue }
          )}
          ${makeField(
            "音效",
            s.sfx,
            { mono: true }
          )}
          <div class="wave" aria-hidden="true">${makeWaveBars(parseInt(s.id, 10))}</div>
          ${makeField("AI 提示词", s.aiPrompt, { modifier: "prompt" })}
        </div>
      </article>
    `;
  }).join("");
}

/* ============== reveal + image fallback ============== */
function attachObserver() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );
  $$(".shot").forEach((el) => io.observe(el));
}

function attachImageFallbacks() {
  // If the text-to-image API fails, hide the broken bg and keep the
  // placeholder + prompt as the "shot". The placeholder is already pretty.
  $$(".shot__img").forEach((el) => {
    const img = new Image();
    const url = el.style.backgroundImage.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
    img.onload = () => {
      // hide the placeholder once the real image paints
      const ph = el.parentElement.querySelector("[data-placeholder]");
      if (ph) ph.style.display = "none";
      el.classList.add("is-loaded");
    };
    img.onerror = () => {
      el.style.display = "none";
      const ph = el.parentElement.querySelector("[data-placeholder]");
      if (ph) {
        ph.style.opacity = "1";
        ph.innerHTML = `
          ${icon("sparkle")}
          <span>AI · RENDER OFFLINE — PROMPT RETAINED</span>
        `;
      }
    };
    img.src = url;
  });
}

/* ============== hero background image ============== */
function setHeroBg() {
  const first = STORYBOARD[0];
  const url = buildImageUrl(first.aiPrompt, first.imageSize);
  $("#heroBg").style.backgroundImage = `url('${url}')`;
}

/* ============== scroll-driven rail + progress ============== */
function updateRail() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const scrollHeight = doc.scrollHeight - window.innerHeight;
  const pct = Math.max(0, Math.min(1, scrollTop / scrollHeight));
  const seconds = pct * TOTAL_SECONDS;

  // cursor position
  const cursor = $("#railCursor");
  if (cursor) cursor.style.top = `${pct * 100}%`;

  // top progress (mobile)
  const top = $("#topProgress");
  if (top) top.style.width = `${pct * 100}%`;

  // active tick (nearest second)
  const ticks = $$(".tick");
  let bestIdx = 0;
  let bestDist = Infinity;
  ticks.forEach((t, i) => {
    const dist = Math.abs(parseInt(t.dataset.second, 10) - seconds);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  ticks.forEach((t, i) => t.classList.toggle("is-active", i === bestIdx));
}

/* ============== init ============== */
function init() {
  renderRail();
  renderShots();
  attachObserver();
  attachImageFallbacks();
  setHeroBg();
  updateRail();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateRail();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateRail);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
