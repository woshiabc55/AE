/**
 * 鼠标滚轮调节
 * 把 intensity（0~1）写入 :root CSS 变量
 * CSS 通过 calc(var(--intensity) * ...) 控制字号 / 旋转 / 模糊
 */
import { api } from './api';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

let intensity = 0.5;
let lastFire = 0;
let raf = 0;

export function setIntensity(v: number, push: boolean = false) {
  intensity = clamp(v, 0, 1);
  document.documentElement.style.setProperty('--intensity', intensity.toFixed(4));
  // 节流同步后端
  const now = performance.now();
  if (push && now - lastFire > 120) {
    lastFire = now;
    api.setIntensity(intensity).catch(() => {});
  }
}

export function getIntensity() {
  return intensity;
}

export function bindWheel() {
  window.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      setIntensity(intensity - e.deltaY * 0.0012, true);
      // 顶部 toast
      showWheelToast(intensity);
    },
    { passive: false }
  );
}

let toast: HTMLDivElement | null = null;
let toastTimer = 0;
function showWheelToast(v: number) {
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'wheel-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = `INTENSITY · ${(v * 100).toFixed(0).padStart(3, ' ')}%`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast?.classList.remove('show'), 600);
}
