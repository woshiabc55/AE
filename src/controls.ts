/**
 * 悬浮控件（右下抽屉）
 * 调节：标题字号、圆环速度、圆环厚度、模糊度、强度
 * 主题切换：default / noir / sunset
 */
import { api } from './api';
import type { Theme } from '../api/types';
import { setIntensity, getIntensity } from './wheel';

type Field = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  path: (t: Theme, v: number) => Partial<Theme>;
  read: (t: Theme) => number;
  format: (v: number) => string;
};

const FIELDS: Field[] = [
  {
    key: 'titleSize',
    label: 'TITLE SIZE',
    min: 0.6,
    max: 1.4,
    step: 0.01,
    path: (t, v) => ({ font: { ...t.font, titleSize: v } }),
    read: (t) => t.font.titleSize,
    format: (v) => v.toFixed(2) + '×',
  },
  {
    key: 'speed',
    label: 'RING SPEED',
    min: 0.4,
    max: 2.0,
    step: 0.01,
    path: (t, v) => ({ ring: { ...t.ring, speed: v } }),
    read: (t) => t.ring.speed,
    format: (v) => v.toFixed(2) + '×',
  },
  {
    key: 'thickness',
    label: 'RING THICK',
    min: 6,
    max: 36,
    step: 1,
    path: (t, v) => ({ ring: { ...t.ring, thickness: v } }),
    read: (t) => t.ring.thickness,
    format: (v) => v.toFixed(0) + 'px',
  },
  {
    key: 'intensity',
    label: 'INTENSITY',
    min: 0,
    max: 1,
    step: 0.01,
    path: () => ({}),
    read: () => getIntensity(),
    format: (v) => (v * 100).toFixed(0) + '%',
  },
];

let panelEl: HTMLElement | null = null;
let bodyEl: HTMLElement | null = null;
let isOpen = false;
let currentTheme: Theme | null = null;

export function mountControls(initialTheme: Theme) {
  currentTheme = initialTheme;
  panelEl = document.createElement('aside');
  panelEl.className = 'controls';
  panelEl.innerHTML = `
    <button class="controls-toggle" type="button" aria-label="toggle controls">
      <span></span><span></span><span></span>
    </button>
    <div class="controls-body">
      <div class="controls-head">
        <div class="ch-title">CONTROLS</div>
        <div class="ch-meta">v1.0 · NODE · EXPRESS</div>
      </div>

      <div class="controls-sliders"></div>

      <div class="controls-themes">
        <div class="ct-label">THEME</div>
        <div class="ct-buttons"></div>
      </div>

      <div class="controls-foot">
        <span class="dot"></span>WHEEL · ADJUST
      </div>
    </div>
  `;
  document.body.appendChild(panelEl);
  bodyEl = panelEl.querySelector('.controls-body');

  // toggle
  panelEl.querySelector('.controls-toggle')?.addEventListener('click', () => {
    isOpen = !isOpen;
    panelEl!.classList.toggle('open', isOpen);
  });

  // sliders
  const slidersEl = panelEl.querySelector('.controls-sliders')!;
  FIELDS.forEach((f) => {
    const row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML = `
      <div class="sr-head">
        <span class="sr-label">${f.label}</span>
        <span class="sr-value" data-key="${f.key}">—</span>
      </div>
      <input type="range" min="${f.min}" max="${f.max}" step="${f.step}" data-key="${f.key}" />
    `;
    slidersEl.appendChild(row);
    const input = row.querySelector('input')!;
    input.addEventListener('input', async () => {
      const v = Number(input.value);
      if (f.key === 'intensity') {
        setIntensity(v, true);
      } else if (currentTheme) {
        const patch = f.path(currentTheme, v);
        const { theme } = await api.postTheme(patch);
        currentTheme = theme;
        applyTheme(theme);
      }
      refreshValues();
    });
  });

  // theme buttons
  const themesEl = panelEl.querySelector('.ct-buttons')!;
  ['default', 'noir', 'sunset'].forEach((id) => {
    const b = document.createElement('button');
    b.className = 'theme-btn';
    b.dataset.id = id;
    b.textContent = id.toUpperCase();
    b.addEventListener('click', async () => {
      const { theme } = await api.postTheme({ id });
      currentTheme = theme;
      applyTheme(theme);
      refreshValues();
      themesEl.querySelectorAll('.theme-btn').forEach((el) => el.classList.remove('active'));
      b.classList.add('active');
    });
    themesEl.appendChild(b);
  });

  refreshValues();
}

function refreshValues() {
  if (!currentTheme || !panelEl) return;
  panelEl.querySelectorAll<HTMLInputElement>('input[type=range]').forEach((input) => {
    const k = input.dataset.key!;
    const f = FIELDS.find((x) => x.key === k);
    if (!f) return;
    const v = f.read(currentTheme!);
    if (document.activeElement !== input) input.value = String(v);
    const valEl = panelEl!.querySelector(`.sr-value[data-key="${k}"]`);
    if (valEl) valEl.textContent = f.format(v);
  });
  // active theme
  const themesEl = panelEl.querySelector('.ct-buttons')!;
  themesEl.querySelectorAll<HTMLElement>('.theme-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.id === currentTheme!.id);
  });
}

/** 把主题应用到 :root CSS 变量 */
export function applyTheme(t: Theme) {
  const r = document.documentElement.style;
  r.setProperty('--ink', t.palette.ink);
  r.setProperty('--paper', t.palette.paper);
  r.setProperty('--rust', t.palette.rust);
  r.setProperty('--volt', t.palette.volt);
  r.setProperty('--lime', t.palette.lime);
  r.setProperty('--title-size', String(t.font.titleSize));
  r.setProperty('--ring-speed', String(t.ring.speed));
  r.setProperty('--ring-thickness', `${t.ring.thickness}px`);
}

export function getCurrentTheme() {
  return currentTheme;
}
