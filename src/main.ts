/**
 * 工业仙境 · 主入口
 * - 拉取后端主题
 * - 注入 CSS 变量
 * - 渲染 4 色块场景
 * - 绑定鼠标随行、滚轮、悬浮控件
 */
import './style.css';
import { api } from './api';
import { applyTheme, mountControls } from './controls';
import { bindWheel, setIntensity } from './wheel';

const root = document.documentElement;

function render() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="cursor-block" id="cursor"></div>
    <div class="pointer-text" id="ptr">X · 0    Y · 0</div>

    <div class="scene">
      <section class="panel panel-a">
        <div class="panel-title">工业仙境</div>
        <div class="meta">PHI · 1.618 · ROWS · 04 · RINGS · 04</div>
        <div class="num">01<small>INDUSTRIAL · FANTASY</small></div>
        <div class="bar-row b-inv" style="top:42%">
          ${Array(10).fill('<span></span>').join('')}
        </div>
        <div class="dotgrid" style="left:5%;bottom:7%">
          ${Array(16).fill('<i></i>').join('')}
        </div>
      </section>

      <section class="panel panel-b">
        <div class="panel-title">MODERN<br/>SOLID</div>
        <div class="meta">黑体字 · 实体 · 色块 · 直接</div>
        <div class="stamp">现代<br/>色块</div>
        <div class="bar-row b-rust" style="top:18%">
          ${Array(7).fill('<span></span>').join('')}
        </div>
      </section>

      <section class="panel panel-c">
        <div class="meta">SECTOR · 03 / N · 39.9° E · 116.4°</div>
        <div class="tag">
          <span>HEITI</span><span>EDGE</span><span>MOUSE</span><span>3D</span><span>WIDE</span>
        </div>
        <div class="panel-title">黑体</div>
        <div class="bar-row b-volt" style="bottom:30%">
          ${Array(6).fill('<span></span>').join('')}
        </div>
        <span class="tag-block dark" style="left:5%;bottom:7%">
          <span class="dot"></span>STEP BY STEP · v1.0
        </span>
      </section>

      <section class="panel panel-d">
        <div class="corner-label">PSEUDO 3D · WIDE ANGLE · 35°</div>
        <div class="corner-r">CAM · 35MM · F1.4 · ISO 800</div>

        <div class="ring-stage" id="ringStage">
          <div class="ring ring-1">
            <span class="ring-tick" style="transform:rotate(0deg)   translate(290px) rotate(0deg)">FANTASY</span>
            <span class="ring-tick inv" style="transform:rotate(60deg)  translate(290px) rotate(-60deg)">F·A·N·T·A·S·Y</span>
            <span class="ring-tick" style="transform:rotate(120deg) translate(290px) rotate(-120deg)">DEPTH</span>
            <span class="ring-tick inv" style="transform:rotate(180deg) translate(290px) rotate(-180deg)">3D · WIDE · 35°</span>
            <span class="ring-tick" style="transform:rotate(240deg) translate(290px) rotate(-240deg)">MOUSE</span>
            <span class="ring-tick inv" style="transform:rotate(300deg) translate(290px) rotate(-300deg)">EDGE · LIGHT</span>
          </div>
          <div class="ring ring-2">
            <span class="ring-tick inv" style="transform:rotate(30deg)  translate(225px) rotate(-30deg)">黑体</span>
            <span class="ring-tick"     style="transform:rotate(150deg) translate(225px) rotate(-150deg)">INDUSTRIAL</span>
            <span class="ring-tick inv" style="transform:rotate(270deg) translate(225px) rotate(-270deg)">HEITI</span>
          </div>
          <div class="ring ring-3">
            <span class="ring-tick"     style="transform:rotate(45deg)  translate(170px) rotate(-45deg)">·  06  ·</span>
            <span class="ring-tick inv" style="transform:rotate(225deg) translate(170px) rotate(-225deg)">·  39.9°  ·</span>
          </div>
          <div class="ring ring-4">
            <span class="ring-tick inv" style="transform:rotate(0deg)   translate(120px) rotate(0deg)">2026</span>
            <span class="ring-tick"     style="transform:rotate(180deg) translate(120px) rotate(-180deg)">仙</span>
          </div>

          <div class="ring-core">
            <div class="core-text">
              <span class="cn">工业<br/>仙境</span>
              <span class="en">INDUSTRIAL · FANTASY</span>
              <span class="meta">PHI · 1.618 · 1.0.0</span>
            </div>
          </div>
        </div>

        <div class="bar-row b-mix" style="top:7%">
          ${Array(12).fill('<span></span>').join('')}
        </div>
        <div class="bar-row b-mix" style="bottom:7%">
          ${Array(12).fill('<span></span>').join('')}
        </div>
      </section>
    </div>
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
  // 1. 拉取主题
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
      panel: { gridCols: '1.4fr 1fr', gridRows: '1fr 1fr' },
    };
  }

  // 2. 渲染场景
  render();

  // 3. 应用主题到 CSS
  applyTheme(theme);

  // 4. 绑定交互
  bindCursor();
  bindWheel();
  mountControls(theme);

  // 5. 拉取初始 intensity
  try {
    const s = await api.getState();
    setIntensity(s.intensity, false);
  } catch {}
}

bootstrap();
