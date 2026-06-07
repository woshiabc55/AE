import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '00:00.00';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(2).padStart(5, '0');
  return `${String(m).padStart(2, '0')}:${s}`;
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

export function easeFromBezier(x1: number, y1: number, x2: number, y2: number) {
  // 使用牛顿迭代求 t 使得 bezierX(t) = progress
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // 二分法
    let lo = 0,
      hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const x = bezierCoord(mid, x1, x2);
      if (x < t) lo = mid;
      else hi = mid;
    }
    return bezierCoord((lo + hi) / 2, y1, y2);
  };
}

function bezierCoord(t: number, a: number, b: number) {
  const it = 1 - t;
  return 3 * it * it * t * a + 3 * it * t * t * b + t * t * t;
}
