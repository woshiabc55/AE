/**
 * 工业仙境 · 主入口
 * 主体：3D 立体 "工业仙境" 文字，居于圆环之内
 * 道 (DAOL) 设计：极简、平衡、留白
 */
import './style.css';
import { api } from './api';
import { applyTheme, mountControls } from './controls';
import { bindWheel, setIntensity } from './wheel';

const root = document.documentElement;

/**
 * 生成 3D 立体文字：在 z 轴上堆叠多层，制造"挤出"感
 * @param text - 文字
 * @param layers - 堆叠层数（影响厚度）
 * @param step - 每一层的 z 偏移
 */
function textLayers(text: string, layers: number, step: number): string {
  let html = '';
  for (let i = layers; i >= 0; i--) {
    const z = -i * step;
    const t = i / layers; // 0 ~ 1
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

    <!-- 道 · DAOL：纯黑底 + 单一聚焦 -->
    <main class="stage">
      <!-- 背景：大圆（柔和光晕） -->
      <div class="halo"></div>

      <!-- 圆环系统 -->
      <div class="ring-system" id="ringSystem">
        <!-- 外环：conic 反色（黑 75% / 纸白 25%） -->
        <div class="r r-1"></div>
        <!-- 中环：纸白 60% / 工业橙 40% -->
        <div class="r r-2"></div>
        <!-- 内环：电气蓝 50% / 黑 50% -->
        <div class="r r-3"></div>
        <!-- 核心：黑底 + 工业仙境立体字 -->
        <div class="r-core">
          <!-- 道 印章：极小角标 -->
          <div class="dao-mark">
            <span class="dao-ch">道</span>
            <span class="dao-en">DAOL</span>
          </div>

          <!-- 3D 立体文字 -->
          <h1 class="t3d" id="t3d" aria-label="工业仙境">
            ${textLayers('工业', 14, 2)}
            ${textLayers('仙境', 14, 2)}
          </h1>

          <!-- 副标：极小英文 -->
          <div class="sub-en">INDUSTRIAL · FANTASY</div>
        </div>
      </div>

      <!-- 四角极简道符 -->
      <span class="corner-dot tl"></span>
      <span class="corner-dot tr"></span>
      <span class="corner-dot bl"></span>
      <span class="corner-dot br"></span>
    </main>
  `;
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

  try {
    const s = await api.getState();
    setIntensity(s.intensity, false);
  } catch {}
}

bootstrap();
