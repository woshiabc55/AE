/**
 * 工业仙境 · 主入口
 * 主体：上升 + 全向粒子背景（中央 3D 文字已移除）
 * 道录 DAOLU 音乐播放器 + 悬浮控件
 */
import './style.css';
import { api } from './api';
import { applyTheme, mountControls } from './controls';
import { bindWheel, setIntensity } from './wheel';
import { daolu } from './player';

const root = document.documentElement;

function render() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="cursor-block" id="cursor"></div>
    <div class="pointer-text" id="ptr">X · 0    Y · 0</div>

    <!-- 背景：条纹 -->
    <div class="bg-stripes"></div>

    <!-- 背景：上升 + 全向粒子 -->
    <canvas id="bgParticles" class="bg-particles"></canvas>

    <!-- 背景：中心柔和光晕（取代原 3D 文字） -->
    <div class="halo"></div>

    <!-- 背景：3 圈极淡 conic 环（光晕装饰） -->
    <div class="ring-stage" id="ringSystem">
      <div class="r r-1"></div>
      <div class="r r-2"></div>
      <div class="r r-3"></div>
    </div>

    <!-- 道录 DAOLU 音乐播放器 -->
    <aside class="daolu" id="daolu">
      <div class="daolu-head">
        <span class="daolu-brand">道 录</span>
        <span class="daolu-en">DAOLU</span>
        <span class="daolu-dot"></span>
        <span class="daolu-status" id="dpStatus">READY</span>
        <span class="daolu-index" id="dpIndex">01 / 03</span>
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
        <button class="daolu-btn daolu-load" id="dpLoad" aria-label="load audio" title="加载本地音频">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" fill="currentColor"/></svg>
        </button>
        <input type="file" id="dpFile" accept="audio/*" multiple hidden />
      </div>
    </aside>
  `;
}

/* ============== 上升 + 全向粒子系统（Canvas） ==============
 *  全向 = 粒子从屏幕底部多源（底部边缘均匀分布 + 中心点放射）发出
 *  上升 = 主要运动方向为 y 负向（向上）
 *  行为：
 *    A) 主流粒子（约 75%）：从屏幕底部随机 x 位置发射，向上飘 + 轻微左右摆动
 *    B) 中心放射粒子（约 25%）：从画面中心发射，向 360° 散开后多数向上飘（上升主导）
 *  视觉：暖色调 + 多种大小，发光感
 */
type P = {
  x: number; y: number;          // 位置
  vx: number; vy: number;        // 速度
  r: number;                     // 半径
  life: number;                  // 0~1
  decay: number;                 // 衰减速率
  hue: number;                   // 色相
  type: 'rise' | 'radial';       // 类型
  phase: number;                 // 摆动相位
  freq: number;                  // 摆动频率
};

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

  const particles: P[] = [];
  const MAX = 180;        // 粒子上限
  const SPAWN = 2;        // 每帧生成数

  /** 生成一个"上升"粒子（底部） */
  const spawnRise = () => {
    particles.push({
      x: Math.random() * W,
      y: H + Math.random() * 30,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.4 + Math.random() * 1.2),    // 向上
      r: 0.6 + Math.random() * 2.2,
      life: 0,
      decay: 0.0015 + Math.random() * 0.0025,
      hue: 15 + Math.random() * 30,         // 暖橙
      type: 'rise',
      phase: Math.random() * Math.PI * 2,
      freq: 0.005 + Math.random() * 0.015,
    });
  };

  /** 生成一个"中心放射"粒子 */
  const spawnRadial = () => {
    const a = Math.random() * Math.PI * 2;
    // 偏向上的发射角度（sin(角度)>0），更"上升"感
    const upBias = 0.5; // 0~1，越大越偏上
    const ang = a * (1 - upBias) + (-Math.PI / 2) * upBias;
    const sp = 0.3 + Math.random() * 0.9;
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H / 2 + (Math.random() - 0.5) * 80,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 0.2,          // 整体偏上
      r: 0.5 + Math.random() * 1.6,
      life: 0,
      decay: 0.002 + Math.random() * 0.003,
      hue: Math.random() < 0.7 ? 18 + Math.random() * 25 : 195 + Math.random() * 25,
      type: 'radial',
      phase: Math.random() * Math.PI * 2,
      freq: 0.008 + Math.random() * 0.02,
    });
  };

  // 初始预填
  for (let i = 0; i < 60; i++) spawnRise();
  for (let i = 0; i < 30; i++) spawnRadial();

  let mouseX = -1000, mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  }, { passive: true });

  const t0 = performance.now();
  const draw = () => {
    const t = (performance.now() - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    // 持续补充粒子
    for (let i = 0; i < SPAWN; i++) {
      if (particles.length < MAX) {
        if (Math.random() < 0.75) spawnRise();
        else spawnRadial();
      }
    }

    // 更新 + 绘制
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += p.decay;

      // 摆动（左右微飘）
      const sway = Math.sin(t * 1.5 + p.phase) * 0.3;
      p.x += p.vx + sway * p.freq * 60;
      p.y += p.vy;

      // 鼠标排斥（轻微）
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14400) {            // 120px 半径
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 120) * 0.3;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f;
      }

      // 出界或寿命到 → 移除
      const outOfBounds = p.y < -20 || p.y > H + 20 || p.x < -20 || p.x > W + 20;
      if (outOfBounds || p.life >= 1) {
        particles.splice(i, 1);
        continue;
      }

      // 淡入淡出（首尾 20% 渐显/渐隐）
      let alpha = 1;
      if (p.life < 0.2) alpha = p.life / 0.2;
      else if (p.life > 0.8) alpha = (1 - p.life) / 0.2;
      alpha = Math.max(0, Math.min(1, alpha));

      // 大小随寿命膨胀（烟火感）
      const sizeMul = 0.6 + p.life * 0.8;
      const r = p.r * sizeMul;
      const a = alpha * 0.85;

      // 双层：外发光 + 内核
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      grad.addColorStop(0,    `hsla(${p.hue},95%,72%,${a})`);
      grad.addColorStop(0.4,  `hsla(${p.hue},90%,60%,${a * 0.5})`);
      grad.addColorStop(1,    `hsla(${p.hue},90%,55%,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
      ctx.fill();

      // 高光内核
      ctx.fillStyle = `hsla(${p.hue},100%,92%,${a * 0.9})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
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
  const btnLoad = document.getElementById('dpLoad')!;
  const fileInput = document.getElementById('dpFile') as HTMLInputElement;
  const trackEl = document.getElementById('dpTrack')!;
  const statusEl = document.getElementById('dpStatus')!;
  const indexEl = document.getElementById('dpIndex')!;
  const volEl = document.getElementById('dpVolume') as HTMLInputElement;
  const barsEl = document.getElementById('dpBars')!;

  const pad2 = (n: number) => String(n + 1).padStart(2, '0');
  const refreshUI = () => {
    const list = daolu.trackList;
    const cur = daolu.track;
    const idx = daolu.trackIndex;
    trackEl.textContent = cur.name;
    trackEl.classList.toggle('is-file', cur.type === 'file');
    statusEl.textContent = daolu.isPlaying ? 'PLAYING' : (cur.type === 'file' ? 'LOADED' : 'READY');
    indexEl.textContent = `${pad2(idx)} / ${String(list.length).padStart(2, '0')}`;
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

  // LOAD 按钮 → 触发隐藏文件选择
  btnLoad.addEventListener('click', () => fileInput.click());

  // 文件选择完成 → 加载并切换到第一个新轨道
  fileInput.addEventListener('change', async () => {
    if (!fileInput.files || fileInput.files.length === 0) return;
    const beforeCount = daolu.trackList.length;
    const added = await daolu.loadFiles(fileInput.files);
    if (added.length > 0) {
      // 切到第一个新加载的轨道
      const newIdx = beforeCount; // 追加到末尾
      daolu.select(newIdx);
    }
    fileInput.value = ''; // 允许重复选择同一文件
    refreshUI();
  });

  // 全局拖拽加载
  window.addEventListener('dragover', (e) => { e.preventDefault(); });
  window.addEventListener('drop', async (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const beforeCount = daolu.trackList.length;
    const added = await daolu.loadFiles(files);
    if (added.length > 0) {
      daolu.select(beforeCount);
    }
    refreshUI();
  });

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
