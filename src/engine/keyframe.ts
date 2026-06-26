import type { Keyframe, KeyframeProps, Transform } from '../types';
import { getEasingFunction, lerp } from './easing';

// 获取指定帧的插值属性
export function getInterpolatedProps(
  keyframes: Keyframe[],
  elementId: string,
  frame: number
): KeyframeProps | null {
  const elementKeyframes = keyframes
    .filter((kf) => kf.elementId === elementId)
    .sort((a, b) => a.frame - b.frame);

  if (elementKeyframes.length === 0) return null;

  // 找到前后关键帧
  let prevKf = elementKeyframes[0];
  let nextKf = elementKeyframes[elementKeyframes.length - 1];

  for (let i = 0; i < elementKeyframes.length; i++) {
    if (elementKeyframes[i].frame <= frame) prevKf = elementKeyframes[i];
    if (elementKeyframes[i].frame >= frame && i > 0) {
      nextKf = elementKeyframes[i];
      break;
    }
  }

  // 如果只有一帧或在关键帧上
  if (prevKf.frame === nextKf.frame || frame <= prevKf.frame) return prevKf.properties;
  if (frame >= nextKf.frame) return nextKf.properties;

  // 插值
  const t = (frame - prevKf.frame) / (nextKf.frame - prevKf.frame);
  const easingFn = getEasingFunction(nextKf.easing);
  const easedT = easingFn(t);

  return interpolateProps(prevKf.properties, nextKf.properties, easedT);
}

function interpolateProps(from: KeyframeProps, to: KeyframeProps, t: number): KeyframeProps {
  const result: KeyframeProps = {};

  if (from.transform && to.transform) {
    result.transform = interpolateTransform(from.transform, to.transform, t);
  }

  if (from.opacity !== undefined && to.opacity !== undefined) {
    result.opacity = lerp(from.opacity, to.opacity, t);
  }

  return result;
}

function interpolateTransform(
  from: Partial<Transform>,
  to: Partial<Transform>,
  t: number
): Partial<Transform> {
  const keys: (keyof Transform)[] = [
    'translateX', 'translateY', 'rotate', 'scaleX', 'scaleY', 'skewX', 'skewY',
  ];
  const result: Partial<Transform> = {};
  for (const key of keys) {
    if (from[key] !== undefined && to[key] !== undefined) {
      (result as Record<string, number>)[key] = lerp(from[key]!, to[key]!, t);
    }
  }
  return result;
}

// 为元素添加关键帧
export function createKeyframe(
  elementId: string,
  layerId: string,
  frame: number,
  properties: KeyframeProps,
  easing: Keyframe['easing']
): Keyframe {
  return {
    id: `kf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    elementId,
    layerId,
    frame,
    properties,
    easing,
  };
}
