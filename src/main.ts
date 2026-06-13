/**
 * 工业仙境 · 主入口
 * 主体：单排 3D 立体"工业仙境" 文字（中央，静止不旋转）
 * 背景：条纹 + 跳动粒子网格
 * 道录 DAOLU 音乐播放器
 */
import './style.css';
import { api } from './api';
import { applyTheme, mountControls } from './controls';
import { bindWheel, setIntensity } from './wheel';
import { daolu } from './player';

const root = document.documentElement;

/** 单个文字的 3D 堆叠层（17 层共享同一 2D 位置） */
function stack(text: string, layers: number, step: number): string {
  let html = '';
  for (let i = layers; i >= 0; i--) {
    const z = -i * step;
    const t = i / layers;
    const cls = i === 0 ? 't3d-front' : `t3d-back t3d-i-${i}`;
    html += `<span class="t3d-layer ${cls}" style="--z:${z}px;--t:${t.toFixed(3)}">${text}</span>`;
  }
  return html;
}

function render() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="cursor-block" id="cursor"></div>
    <div class="pointer-text" id="ptr">X · 0    Y · 0</div>

    <!-- 背景：条纹 -->
    <div class="bg-stripes"></div>

    <!-- 背景：跳动粒子网格 -->
    <canvas id="bgParticles" class="bg-particles"></canvas>

    <!-- 背景：柔和大圆光晕 -->
    <div class="halo"></div>

    <main class="stage">
      <!-- 圆环系统 -->
      <div class="ring-system" id="ringSystem">
        <div class="r r-1"></div>
        <div class="r r-2"></div>
        <div class="r r-3"></div>

        <!-- 核心：黑底圆盘 + 单排 3D 立体字 -->
        <div class="r-core">
          <h1 class="t3d" id="t3d" aria-label="工业仙境">
            <span class="t3d-stack">${stack('工业仙境', 18, 2.4)}</span>
          </h1>
        </div>
      </div>
    </main>

    <!-- 道录 DAOLU 音乐播放器 -->
    <aside class="daolu" id="daolu">
      <div class="daolu-head">
        <span class="daolu-brand">道 录</span>
        <span class="daolu-en">DAOLU</span>
        <span class="daolu-dot"></span>
        <span class="daolu-status" id="dpStatus">READY</span>
      </div>
      <div class="daolu-track" id="dpTrack">AMBIENT 001 · 仙</div>
      <div class="daolu-row">
        <button class="daolu-btn daolu-prev" id="dpPrev" aria-label="prev">
          <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" fill="currentColor"/></svg>
        </button>
        <button class="daolu-btn daolu-play" id="dpPlay" aria-label="play">
          <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>
        </button>
        <button class="daolu-btn daolu-next" id="dpNext" aria-label="next">
          <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" fill="currentColor"/></svg>
        </button>
        <div class="daolu-bars" id="dpBars">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="daolu-vol">
          <svg viewBox="0 0 24 24" class="vol-icon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/></svg>
          <input type="range" min="0" max="100" value="35" id="dpVolume" class="daolu-range" />
        </div>
      </div>
    </aside>
  `;
}

/* ============== 粒子网格（Canvas） ============== */
function startParticles() {
  const cv = document.getElementById('bgParticles') as HTMLCanvasElement;
  const ctx = cv.getContext('2d')!;
  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener('resize', resize);
  resize();

  const COLS = 28, ROWS = 16;
  const dots: { ph: number; sp: number; base: number }[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    dots.push({
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.8,
      base: 0.15 + Math.random() * 0.4,
    });
  }

  const t0 = performance.now();
  const draw = () => {
    const t = (performance.now() - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    const dx = W / COLS, dy = H / ROWS;
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const idx = i * ROWS + j;
        const d = dots[idx];
        // 跳动：sin 波
        const k = 0.5 + 0.5 * Math.sin(t * d.sp + d.ph);
        const alpha = d.base * k;
        // 距中心衰减（中央更亮）
        const cx = (i + 0.5) / COLS - 0.5;
        const cy = (j + 0.5) / ROWS - 0.5;
        const r = Math.hypot(cx, cy);
        const center = Math.max(0, 1 - r * 1.6);
        const a = alpha * (0.25 + center * 0.75);
        const x = i * dx + dx / 2;
        const y = j * dy + dy / 2;
        // 暖色：靠近中心偏橙；远处偏白
        const hue = 18 + (1 - center) * 20;
        ctx.fillStyle = `hsla(${hue},90%,70%,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + k * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

/* ============== 道录 DAOLU 播放器 UI 绑定 ============== */
function bindDaolu() {
  const btnPlay = document.getElementById('dpPlay')!;
  const btnPrev = document.getElementById('dpPrev')!;
  const btnNext = document.getElementById('dpNext')!;
  const trackEl = document.getElementById('dpTrack')!;
  const statusEl = document.getElementById('dpStatus')!;
  const volEl = document.getElementById('dpVolume') as HTMLInputElement;
  const barsEl = document.getElementById('dpBars')!;

  const refreshUI = () => {
    trackEl.textContent = daolu.track.name;
    statusEl.textContent = daolu.isPlaying ? 'PLAYING' : 'READY';
    btnPlay.classList.toggle('on', daolu.isPlaying);
    barsEl.classList.toggle('on', daolu.isPlaying);
  };

  btnPlay.addEventListener('click', async () => {
    await daolu.toggle();
    refreshUI();
  });
  btnPrev.addEventListener('click', () => { daolu.prev(); refreshUI(); });
  btnNext.addEventListener('click', () => { daolu.next(); refreshUI(); });
  volEl.addEventListener('input', () => daolu.setVolume(Number(volEl.value) / 100));

  daolu.setVolume(Number(volEl.value) / 100);
  refreshUI();
}

// 鼠标随行
function bindCursor() {
  const cursor = document.getElementById('cursor')!;
  const ptr = document.getElementById('ptr')!;
  const colors = ['#a8ff5b', '#3aa9ff', '#ff5b1f', '#f3f1ea', '#ffb547'];
  let colorIdx = 0, lastMove = 0;
  let raf = 0, tx = .5, ty = .5, x = .5, y = .5;

  const onMove = (e: MouseEvent) => {
    const w = window.innerWidth, h = window.innerHeight;
    tx = e.clientX / w; ty = e.clientY / h;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    ptr.style.left = (e.clientX + 40) + 'px';
    ptr.style.top  = (e.clientY + 40) + 'px';
    ptr.textContent = `X · ${String(Math.round(e.clientX)).padStart(4, ' ')}   Y · ${String(Math.round(e.clientY)).padStart(4, ' ')}`;
    lastMove += Math.hypot(e.movementX || 0, e.movementY || 0);
    if (lastMove > 200) {
      lastMove = 0;
      colorIdx = (colorIdx + 1) % colors.length;
      cursor.style.background = colors[colorIdx];
    }
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const tick = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    root.style.setProperty('--mx', x.toFixed(4));
    root.style.setProperty('--my', y.toFixed(4));
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', (e) => { if (e.touches[0]) onMove(e.touches[0] as unknown as MouseEvent); }, { passive: true });
}

async function bootstrap() {
  let theme;
  try {
    const res = await api.getTheme();
    theme = res.theme;
  } catch (err) {
    console.warn('[main] /api/theme failed, using fallback', err);
    theme = {
      id: 'default',
      palette: { ink: '#0a0a0c', paper: '#f3f1ea', rust: '#ff5b1f', volt: '#3aa9ff', lime: '#a8ff5b' },
      font: { titleSize: 1.0, weight: 900, family: '"Noto Sans SC", sans-serif' },
      ring: { speed: 1.0, thickness: 18 },
      panel: { gridCols: '1fr', gridRows: '1fr' },
    };
  }

  render();
  applyTheme(theme);
  bindCursor();
  bindWheel();
  mountControls(theme);
  startParticles();
  bindDaolu();

  try {
    const s = await api.getState();
    setIntensity(s.intensity, false);
  } catch {}
}

bootstrap();
