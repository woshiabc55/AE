import type { BezierEasing, EasingPreset } from '@/types';
import { easeFromBezier } from '@/lib/utils';

export const EASING_PRESETS: Record<EasingPreset, (t: number) => number> = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

export function resolveEasing(easing: EasingPreset | BezierEasing): (t: number) => number {
  if (typeof easing === 'string') return EASING_PRESETS[easing];
  return easeFromBezier(easing.x1, easing.y1, easing.x2, easing.y2);
}

// 在一组关键帧之间根据 time 求插值
export function sampleKeyframes<T extends { time: number; value: number | string; easing: EasingPreset | BezierEasing }>(
  keyframes: T[],
  time: number,
): number | string | undefined {
  if (keyframes.length === 0) return undefined;
  if (keyframes.length === 1 || time <= keyframes[0].time) return keyframes[0].value;
  if (time >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

  // 找到左右关键帧
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (time >= a.time && time <= b.time) {
      const dur = b.time - a.time;
      const local = dur > 0 ? (time - a.time) / dur : 0;
      const eased = resolveEasing(a.easing)(local);
      if (typeof a.value === 'number' && typeof b.value === 'number') {
        return a.value + (b.value - a.value) * eased;
      }
      // 颜色字符串时直接返回起始值(简化处理)
      if (typeof a.value === 'string' || typeof b.value === 'string') {
        return eased < 0.5 ? a.value : b.value;
      }
      return a.value;
    }
  }
  return keyframes[keyframes.length - 1].value;
}
