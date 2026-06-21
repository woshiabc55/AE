// 骨架绑定与变形计算

import type { Bone, Joint, JointPositions, Point } from "@/types";
import { angleBetween, distance, lerpPoint, pointToSegment } from "@/utils/geometry";

/** 查找关节 */
export function findJoint(joints: Joint[], id: string): Joint | undefined {
  return joints.find((j) => j.id === id);
}

/** 查找骨骼 */
export function findBone(bones: Bone[], id: string): Bone | undefined {
  return bones.find((b) => b.id === id);
}

/** 计算骨骼的原始变换（从 originalPose） */
export interface BoneTransform {
  origin: Point;
  angle: number;
  length: number;
}

/** 计算单根骨骼的变换 */
export function getBoneTransform(
  from: Point,
  to: Point,
): BoneTransform {
  return {
    origin: from,
    angle: angleBetween(from, to),
    length: distance(from, to),
  };
}

/** 计算格子在新骨骼姿态下的变形位置 */
export function deformCell(
  cellPos: Point,
  origBoneFrom: Point,
  origBoneTo: Point,
  newBoneFrom: Point,
  newBoneTo: Point,
): Point {
  const origAngle = angleBetween(origBoneFrom, origBoneTo);
  const newAngle = angleBetween(newBoneFrom, newBoneTo);
  const angleDelta = newAngle - origAngle;
  const origLen = distance(origBoneFrom, origBoneTo);
  const newLen = distance(newBoneFrom, newBoneTo);
  const scale = origLen === 0 ? 1 : newLen / origLen;

  // 相对骨骼起点的偏移
  const ox = cellPos.x - origBoneFrom.x;
  const oy = cellPos.y - origBoneFrom.y;

  // 分解为沿骨骼方向 + 垂直方向
  const dx = origBoneTo.x - origBoneFrom.x;
  const dy = origBoneTo.y - origBoneFrom.y;
  const lenSq = dx * dx + dy * dy;
  let along = 0;
  let perp = 0;
  if (lenSq > 0) {
    along = (ox * dx + oy * dy) / lenSq;
    const cross = ox * dy - oy * dx;
    perp = cross / Math.sqrt(lenSq);
  }

  // 沿骨骼方向缩放
  const alongDist = along * origLen * scale;
  const perpDist = perp * origLen * scale;

  // 旋转
  const cos = Math.cos(angleDelta);
  const sin = Math.sin(angleDelta);
  const rx = alongDist * cos - perpDist * sin;
  const ry = alongDist * sin + perpDist * cos;

  return { x: newBoneFrom.x + rx, y: newBoneFrom.y + ry };
}

/** 计算所有格子的变形位置（基于当前姿态） */
export function computeDeformedCells(
  pixels: Record<string, string>,
  joints: Joint[],
  bones: Bone[],
  originalPose: JointPositions,
  currentPose: JointPositions,
): Map<string, Point> {
  const result = new Map<string, Point>();
  if (bones.length === 0) return result;

  for (const bone of bones) {
    if (bone.influencedCells.length === 0) continue;
    const fromJoint = findJoint(joints, bone.fromJointId);
    const toJoint = findJoint(joints, bone.toJointId);
    if (!fromJoint || !toJoint) continue;
    const origFrom = originalPose[bone.fromJointId] ?? { x: fromJoint.x, y: fromJoint.y };
    const origTo = originalPose[bone.toJointId] ?? { x: toJoint.x, y: toJoint.y };
    const newFrom = currentPose[bone.fromJointId] ?? origFrom;
    const newTo = currentPose[bone.toJointId] ?? origTo;

    for (const cellKey of bone.influencedCells) {
      if (result.has(cellKey)) continue; // 已被其他骨骼影响
      const [x, y] = cellKey.split(",").map(Number);
      const deformed = deformCell({ x, y }, origFrom, origTo, newFrom, newTo);
      result.set(cellKey, deformed);
    }
  }
  return result;
}

/** 找到距离点最近的关节 */
export function findNearestJoint(
  joints: Joint[],
  pose: JointPositions,
  point: Point,
  threshold: number,
): Joint | null {
  let nearest: Joint | null = null;
  let minDist = threshold;
  for (const joint of joints) {
    const pos = pose[joint.id] ?? { x: joint.x, y: joint.y };
    const d = distance(pos, point);
    if (d < minDist) {
      minDist = d;
      nearest = joint;
    }
  }
  return nearest;
}

/** 找到距离点最近的骨骼 */
export function findNearestBone(
  bones: Bone[],
  joints: Joint[],
  pose: JointPositions,
  point: Point,
  threshold: number,
): Bone | null {
  let nearest: Bone | null = null;
  let minDist = threshold;
  for (const bone of bones) {
    const fromJoint = findJoint(joints, bone.fromJointId);
    const toJoint = findJoint(joints, bone.toJointId);
    if (!fromJoint || !toJoint) continue;
    const from = pose[bone.fromJointId] ?? { x: fromJoint.x, y: fromJoint.y };
    const to = pose[bone.toJointId] ?? { x: toJoint.x, y: toJoint.y };
    const { dist } = pointToSegment(point, from, to);
    if (dist < minDist) {
      minDist = dist;
      nearest = bone;
    }
  }
  return nearest;
}

/** 插值两个姿态 */
export function interpolatePose(
  from: JointPositions,
  to: JointPositions,
  t: number,
): JointPositions {
  const result: JointPositions = {};
  const allKeys = new Set([...Object.keys(from), ...Object.keys(to)]);
  for (const key of allKeys) {
    const f = from[key];
    const e = to[key];
    if (f && e) {
      result[key] = lerpPoint(f, e, t);
    } else if (f) {
      result[key] = f;
    } else if (e) {
      result[key] = e;
    }
  }
  return result;
}

/** 获取关节的原始位置（用于变形基准） */
export function getOriginalPose(joints: Joint[]): JointPositions {
  const pose: JointPositions = {};
  for (const j of joints) pose[j.id] = { x: j.x, y: j.y };
  return pose;
}
