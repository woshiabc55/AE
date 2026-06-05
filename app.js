/* =========================================================
   Crystal Plain · Storyboard Vol.01
   - Hardcoded storyboard data (from user's source script)
   - Builds the timeline rail ticks
   - Renders shot cards
   - Renders concept gallery + sound design
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
    cueSeconds: 4,
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

const GALLERY = [
  {
    title: "算穹 · 数学天球仪",
    meta: "Key Visual · 01",
    prompt:
      "A gigantic mathematical celestial sphere as the sky, " +
      "covered with golden equations and purple nebula, Riemann " +
      "surfaces as floating mountain ranges below, fantasy " +
      "anime, Makoto Shinkai palette, 8k, cinematic, dramatic " +
      "lighting",
    size: "landscape_16_9",
  },
  {
    title: "黎曼山脉",
    meta: "Environment",
    prompt:
      "Floating mountain ranges made of purple-gold Riemann " +
      "surfaces, impossible geometry, soft volumetric light, " +
      "anime concept art, 8k",
    size: "square_hd",
  },
  {
    title: "晶体平原",
    meta: "Environment",
    prompt:
      "Endless crystalline plain with subtle reflections, " +
      "purple-gold sky, single tiny silhouette walking in the " +
      "distance, fantasy anime wide shot, 8k",
    size: "square_hd",
  },
  {
    title: "公式石碑",
    meta: "Key Prop",
    prompt:
      "A tilted giant stone stele carved with glowing " +
      "mathematical formulas, covered with crystal moss, " +
      "anime concept art, dramatic fog, 8k",
    size: "square_hd",
  },
  {
    title: "朔 · 背影",
    meta: "Character · Back",
    prompt:
      "Back view of a japanese high school boy with backpack " +
      "walking slowly on a crystalline plain, school uniform, " +
      "short black hair, purple-gold sky, fantasy anime, " +
      "Makoto Shinkai style, 8k",
    size: "square_hd",
  },
  {
    title: "晶体苔藓",
    meta: "Texture Study",
    prompt:
      "Macro shot of crystal moss growing on a stone surface, " +
      "frosty blue and gold, soft bokeh, anime background " +
      "art, 8k",
    size: "square_hd",
  },
  {
    title: "天则运转 · 神圣嗡鸣",
    meta: "Atmosphere",
    prompt:
      "A massive cosmic mechanism of floating equations and " +
      "rings, sacred geometry, purple and gold, anime " +
      "illustration, dramatic scale, 8k",
    size: "landscape_16_9",
  },
  {
    title: "钟楼",
    meta: "Key Prop",
    prompt:
      "A distant bell tower made of crystal and brass, foggy " +
      "morning, fantasy anime background art, 8k",
    size: "landscape_16_9",
  },
  {
    title: "黄昏与放学路",
    meta: "Moodboard",
    prompt:
      "Golden hour on a crystalline plain, a tiny student " +
      "silhouette walking away, Makoto Shinkai sunset, " +
      "lens flare, anime, 8k",
    size: "landscape_16_9",
  },
];

const SOUND_LAYERS = [
  {
    name: "天则 · 神圣嗡鸣",
    tag: "Drone · 24/96",
    desc: "管风琴 + 钟楼混合的低频基础层，贯穿全片，承担世界仍在运转的暗示。",
    seed: 1,
  },
  {
    name: "晶体 · 共鸣",
    tag: "Texture · Field",
    desc: "每一步脚步在晶面上激发的高频反射，作为环境的心跳使用。",
    seed: 2,
  },
  {
    name: "笔尖 · 纸面",
    tag: "Foley · Close",
    desc: "几乎听不见的铅笔记录声，暗示朔在观察。音量随视角切换而起伏。",
    seed: 3,
  },
  {
    name: "风 · 经幡",
    tag: "Ambience",
    desc: "低空掠过的气流感，只在画面空旷时出现，填满留白。",
    seed: 4,
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
  $$(".shot, .reveal").forEach((el) => io.observe(el));
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

/* ============== render gallery ============== */
function renderGallery() {
  const root = $("#galleryGrid");
  if (!root) return;
  root.innerHTML = GALLERY.map(
    (g) => `
    <figure class="gallery__item" tabindex="0">
      <div
        class="gallery__item-img"
        style="background-image:url('${buildImageUrl(g.prompt, g.size)}')"
      ></div>
      <div class="gallery__item-placeholder" data-placeholder>
        ${icon("aperture")}
        <span>${g.meta.toUpperCase()}</span>
      </div>
      <figcaption class="gallery__item-caption">
        <div class="gallery__item-caption-title">${g.title}</div>
        <div class="gallery__item-caption-meta">${g.meta}</div>
      </figcaption>
    </figure>
  `
  ).join("");
}

function attachGalleryFallbacks() {
  $$(".gallery__item-img").forEach((el) => {
    const img = new Image();
    const url = el.style.backgroundImage
      .replace(/^url\(['"]?/, "")
      .replace(/['"]?\)$/, "");
    img.onload = () => {
      const ph = el.parentElement.querySelector("[data-placeholder]");
      if (ph) ph.style.display = "none";
      el.classList.add("is-loaded");
    };
    img.onerror = () => {
      el.style.background =
        "linear-gradient(135deg, #1a1639, #0a0a1a)";
      el.classList.add("is-loaded");
      const ph = el.parentElement.querySelector("[data-placeholder]");
      if (ph) {
        ph.style.opacity = "1";
        ph.innerHTML = `
          ${icon("sparkle")}
          <span>PROMPT RETAINED · ${img.naturalWidth || "—"}×${img.naturalHeight || "—"}</span>
        `;
      }
    };
    img.src = url;
  });
}

/* ============== render sound design ============== */
function renderSound() {
  const root = $("#soundGrid");
  if (!root) return;
  root.innerHTML = SOUND_LAYERS.map(
    (l) => `
    <div class="sound__layer">
      <div class="sound__layer-head">
        <div class="sound__layer-name">${l.name}</div>
        <div class="sound__layer-tag">${l.tag}</div>
      </div>
      <p class="sound__layer-desc">${l.desc}</p>
      <div class="sound__layer-wave" aria-hidden="true">
        ${makeWaveBars(l.seed + 10)}
      </div>
    </div>
  `
  ).join("");
}

/* ============== portrait fallback ============== */
function attachPortraitFallback() {
  const el = $("[data-portrait]");
  if (!el) return;
  const img = new Image();
  const url = el.style.backgroundImage
    .replace(/^url\(['"]?/, "")
    .replace(/['"]?\)$/, "");
  img.onload = () => el.classList.add("is-loaded");
  img.onerror = () => {
    el.style.background = `linear-gradient(160deg, #2a1f55 0%, #0a0a1a 100%)`;
    el.style.opacity = "0.6";
  };
  img.src = url;
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
  renderGallery();
  renderSound();
  attachObserver();
  attachImageFallbacks();
  attachGalleryFallbacks();
  attachPortraitFallback();
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
