// 动画关键帧插值

import type { JointPositions, Keyframe } from "@/types";
import { easeInOut } from "@/utils/geometry";
import { interpolatePose } from "./skeleton";

/** 按时间排序关键帧 */
export function sortKeyframes(keyframes: Keyframe[]): Keyframe[] {
  return [...keyframes].sort((a, b) => a.time - b.time);
}

/** 根据当前时间（0~1）插值出姿态 */
export function samplePose(keyframes: Keyframe[], time: number): JointPositions {
  if (keyframes.length === 0) return {};
  const sorted = sortKeyframes(keyframes);
  if (sorted.length === 1) return sorted[0].jointPositions;

  // 限制范围
  const t = Math.max(0, Math.min(1, time));

  // 在第一帧之前
  if (t <= sorted[0].time) {
    return sorted[0].jointPositions;
  }
  // 在最后一帧之后
  if (t >= sorted[sorted.length - 1].time) {
    return sorted[sorted.length - 1].jointPositions;
  }
  // 在两帧之间
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (t >= a.time && t <= b.time) {
      const span = b.time - a.time;
      const localT = span === 0 ? 0 : (t - a.time) / span;
      const eased = easeInOut(localT);
      return interpolatePose(a.jointPositions, b.jointPositions, eased);
    }
  }
  return sorted[sorted.length - 1].jointPositions;
}

/** 生成新关键帧 ID */
export function newKeyframeId(): string {
  return `kf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
