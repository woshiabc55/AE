import type { EasingData, EasingPreset } from '../types';

// 预设缓动函数
const presets: Record<EasingPreset, (t: number) => number> = {
  linear: (t) => t,
  'ease-in': (t) => t * t * t,
  'ease-out': (t) => 1 - Math.pow(1 - t, 3),
  'ease-in-out': (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  'back-in': (t) => { const c = 1.70158; return (c + 1) * t * t * t - c * t * t; },
  'back-out': (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  'back-in-out': (t) => {
    const c = 1.70158 * 1.525;
    return t < 0.5
      ? ((c + 1) * Math.pow(2 * t, 3) + c * Math.pow(2 * t, 2)) / 2
      : ((c + 1) * Math.pow(2 * t - 2, 3) + c * Math.pow(2 * t - 2, 2)) / 2 + 1;
  },
  'elastic-in': (t) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
  },
  'elastic-out': (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  'bounce-in': (t) => 1 - presets['bounce-out'](1 - t),
  'bounce-out': (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

// 三次贝塞尔缓动
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t: number) { return ((ax * t + bx) * t + cx) * t; }
  function sampleCurveY(t: number) { return ((ay * t + by) * t + cy) * t; }
  function sampleCurveDerivativeX(t: number) { return (3 * ax * t + 2 * bx) * t + cx; }

  function solveCurveX(x: number) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleCurveX(t) - x;
      if (Math.abs(xEst) < 1e-6) return t;
      const d = sampleCurveDerivativeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= xEst / d;
    }
    let lo = 0, hi = 1;
    t = x;
    while (lo < hi) {
      const xEst = sampleCurveX(t);
      if (Math.abs(xEst - x) < 1e-6) return t;
      if (x > xEst) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  }

  return (t: number) => sampleCurveY(solveCurveX(t));
}

// 弹簧缓动
function spring(stiffness: number, damping: number, mass: number): (t: number) => number {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return (t: number) => {
    if (zeta < 1) {
      const omegaD = omega * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * omega * t * 10) * (
        Math.cos(omegaD * t * 10) +
        (zeta * omega / omegaD) * Math.sin(omegaD * t * 10)
      );
    }
    return 1 - (1 + omega * t * 10) * Math.exp(-omega * t * 10);
  };
}

// 获取缓动函数
export function getEasingFunction(easing: EasingData): (t: number) => number {
  if (easing.type === 'preset' && easing.name) {
    return presets[easing.name] || presets['ease-in-out'];
  }
  if (easing.type === 'cubic-bezier' && easing.cubicBezier) {
    return cubicBezier(...easing.cubicBezier);
  }
  if (easing.type === 'spring' && easing.springConfig) {
    const { stiffness, damping: d, mass } = easing.springConfig;
    return spring(stiffness, d, mass);
  }
  return presets['ease-in-out'];
}

// 插值
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpTransform(
  from: Record<string, number>,
  to: Record<string, number>,
  t: number
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key of Object.keys(from)) {
    if (typeof from[key] === 'number' && typeof to[key] === 'number') {
      result[key] = lerp(from[key], to[key], t);
    }
  }
  return result;
}
