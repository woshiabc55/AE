// Canvas 2D 渲染器

import type { Bone, Joint, JointPositions, Point } from "@/types";
import { findJoint } from "@/engine/skeleton";
import { parseKey } from "@/engine/gridUtils";

export interface RenderOptions {
  gridSize: number;
  cellSize: number;
  showGrid: boolean;
  showCenterLine: boolean;
  showSkeleton: boolean;
  selectedJointId: string | null;
  selectedBoneId: string | null;
  deformedCells?: Map<string, Point>;
  highlightedCells?: Set<string>;
  selectedJointIds?: string[];
}

/** 绘制单个拼豆（圆形带高光） */
function drawBead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  // 底部阴影
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.35, radius * 0.85, radius * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(
    cx - radius * 0.3,
    cy - radius * 0.35,
    radius * 0.35,
    radius * 0.22,
    -Math.PI / 4,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

/** 主渲染函数 */
export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  pixels: Record<string, string>,
  joints: Joint[],
  bones: Bone[],
  pose: JointPositions,
  options: RenderOptions,
) {
  const { gridSize, cellSize, showGrid, showCenterLine, showSkeleton } = options;
  const w = gridSize * cellSize;
  const h = gridSize * cellSize;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0f0a1a";
  ctx.fillRect(0, 0, w, h);

  // 网格线
  if (showGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(w, i * cellSize);
      ctx.stroke();
    }
  }

  // 中线
  if (showCenterLine) {
    const cx = (gridSize / 2) * cellSize;
    ctx.strokeStyle = "rgba(255,107,53,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 绘制拼豆
  const beadRadius = cellSize * 0.42;
  for (const key in pixels) {
    const color = pixels[key];
    let pos: Point;
    if (options.deformedCells && options.deformedCells.has(key)) {
      pos = options.deformedCells.get(key)!;
    } else {
      pos = parseKey(key);
    }
    const cx = pos.x * cellSize + cellSize / 2;
    const cy = pos.y * cellSize + cellSize / 2;

    if (options.highlightedCells && options.highlightedCells.has(key)) {
      ctx.fillStyle = "rgba(255,210,63,0.25)";
      ctx.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
    }

    drawBead(ctx, cx, cy, beadRadius, color);
  }

  // 绘制骨架
  if (showSkeleton) {
    // 骨骼连线
    for (const bone of bones) {
      const fromJoint = findJoint(joints, bone.fromJointId);
      const toJoint = findJoint(joints, bone.toJointId);
      if (!fromJoint || !toJoint) continue;
      const from = pose[bone.fromJointId] ?? { x: fromJoint.x, y: fromJoint.y };
      const to = pose[bone.toJointId] ?? { x: toJoint.x, y: toJoint.y };
      const isSelected = bone.id === options.selectedBoneId;
      ctx.strokeStyle = isSelected ? "#ffd23f" : "rgba(78,205,196,0.85)";
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(from.x * cellSize + cellSize / 2, from.y * cellSize + cellSize / 2);
      ctx.lineTo(to.x * cellSize + cellSize / 2, to.y * cellSize + cellSize / 2);
      ctx.stroke();

      // 受影响格子指示
      if (isSelected && bone.influencedCells.length > 0) {
        ctx.fillStyle = "rgba(255,210,63,0.6)";
        for (const cellKey of bone.influencedCells) {
          const [x, y] = cellKey.split(",").map(Number);
          ctx.beginPath();
          ctx.arc(
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2,
            cellSize * 0.12,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }

    // 关节节点
    const selectedSet = new Set(options.selectedJointIds ?? []);
    for (const joint of joints) {
      const pos = pose[joint.id] ?? { x: joint.x, y: joint.y };
      const cx = pos.x * cellSize + cellSize / 2;
      const cy = pos.y * cellSize + cellSize / 2;
      const isSelected = joint.id === options.selectedJointId;
      const isMultiSelected = selectedSet.size > 1 && selectedSet.has(joint.id);
      if (isSelected || isMultiSelected) {
        ctx.fillStyle = isMultiSelected ? "rgba(78,205,196,0.25)" : "rgba(255,210,63,0.25)";
        ctx.beginPath();
        ctx.arc(cx, cy, cellSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = isSelected ? "#ffd23f" : isMultiSelected ? "#4ecdc4" : "#ff6b35";
      ctx.beginPath();
      ctx.arc(cx, cy, cellSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f0a1a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#0f0a1a";
      ctx.beginPath();
      ctx.arc(cx, cy, cellSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** 生成缩略图 dataURL */
export function generateThumbnail(
  pixels: Record<string, string>,
  gridSize: number,
  size = 128,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "#0f0a1a";
  ctx.fillRect(0, 0, size, size);
  const cellSize = size / gridSize;
  const radius = cellSize * 0.42;
  for (const key in pixels) {
    const { x, y } = parseKey(key);
    const cx = x * cellSize + cellSize / 2;
    const cy = y * cellSize + cellSize / 2;
    ctx.fillStyle = pixels[key];
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas.toDataURL("image/png");
}
