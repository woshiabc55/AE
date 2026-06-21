import type { Joint, Bead } from "@/types";

// 计算每颗豆受哪些关节影响（基于距离衰减）
export function computeBeadInfluences(
  beads: Bead[],
  joints: Joint[],
): Map<string, { joint: string; weight: number }[]> {
  const map = new Map<string, { joint: string; weight: number }[]>();
  const maxDist = 6; // 影响半径

  for (const bead of beads) {
    const key = `${bead.x},${bead.y}`;
    const infs: { joint: string; weight: number }[] = [];
    for (const joint of joints) {
      const dx = bead.x - joint.x;
      const dy = bead.y - joint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= maxDist) {
        const weight = Math.pow(1 - dist / maxDist, 2);
        infs.push({ joint: joint.id, weight });
      }
    }
    // 归一化
    const sum = infs.reduce((s, i) => s + i.weight, 0);
    if (sum > 0) {
      infs.forEach((i) => (i.weight /= sum));
      map.set(key, infs);
    }
  }
  return map;
}

// 计算关节偏移量（基于 pose 与初始位置差）
export function computeJointOffsets(
  joints: Joint[],
  poses: { joint: string; x: number; y: number }[],
): Record<string, { dx: number; dy: number }> {
  const poseMap = new Map(poses.map((p) => [p.joint, p]));
  const offsets: Record<string, { dx: number; dy: number }> = {};
  for (const joint of joints) {
    const pose = poseMap.get(joint.id);
    if (pose) {
      offsets[joint.id] = { dx: pose.x - joint.x, dy: pose.y - joint.y };
    }
  }
  return offsets;
}

// FK：拖动一个关节时，其子关节跟随移动
export function dragJoint(
  joints: Joint[],
  jointId: string,
  newX: number,
  newY: number,
): Joint[] {
  const target = joints.find((j) => j.id === jointId);
  if (!target) return joints;
  const dx = newX - target.x;
  const dy = newY - target.y;

  // 找到所有受影响的子关节（递归）
  const affected = new Set<string>([jointId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const j of joints) {
      if (j.parent && affected.has(j.parent) && !affected.has(j.id)) {
        affected.add(j.id);
        changed = true;
      }
    }
  }

  return joints.map((j) => {
    if (affected.has(j.id)) {
      return { ...j, x: j.x + dx, y: j.y + dy };
    }
    return j;
  });
}

// 拖动关节时更新 poses（用于关键帧编辑）
export function dragJointInPose(
  joints: Joint[],
  poses: { joint: string; x: number; y: number }[],
  jointId: string,
  newPoseX: number,
  newPoseY: number,
): { joint: string; x: number; y: number }[] {
  const target = joints.find((j) => j.id === jointId);
  if (!target) return poses;
  const currentPose = poses.find((p) => p.joint === jointId);
  const baseX = currentPose?.x ?? target.x;
  const baseY = currentPose?.y ?? target.y;
  const dx = newPoseX - baseX;
  const dy = newPoseY - baseY;

  // 找子关节
  const affected = new Set<string>([jointId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const j of joints) {
      if (j.parent && affected.has(j.parent) && !affected.has(j.id)) {
        affected.add(j.id);
        changed = true;
      }
    }
  }

  const poseMap = new Map(poses.map((p) => [p.joint, p]));
  const result: { joint: string; x: number; y: number }[] = [];
  for (const j of joints) {
    const existing = poseMap.get(j.id);
    if (affected.has(j.id)) {
      const base = existing ?? { x: j.x, y: j.y };
      result.push({ joint: j.id, x: base.x + dx, y: base.y + dy });
    } else if (existing) {
      result.push(existing);
    }
  }
  return result;
}

// 为关节分配颜色（用于蒙版可视化）
export function jointColorPalette(jointIds: string[]): Record<string, string> {
  const colors = [
    "#ff5e5b",
    "#39e991",
    "#ffd23f",
    "#3bceac",
    "#9b5de5",
    "#ff8c42",
    "#f15bb5",
    "#00bbf9",
  ];
  const map: Record<string, string> = {};
  jointIds.forEach((id, i) => {
    map[id] = colors[i % colors.length];
  });
  return map;
}
