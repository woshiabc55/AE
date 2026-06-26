// 图形渲染器

import type { Bone, Joint, JointPositions, Part, Shape, Transform2D } from "@/types";
import { findBone, findJoint } from "@/engine/skeleton";
import { sampleOffset } from "@/engine/shapeUtils";

export interface ShapeRenderOptions {
  gridSize: number;
  cellSize: number;
  selectedShapeId: string | null;
  selectedPartId: string | null;
  time?: number;
}

function toCanvas(cx: number, cy: number, cellSize: number) {
  return { x: cx * cellSize + cellSize / 2, y: cy * cellSize + cellSize / 2 };
}

function drawShapePath(ctx: CanvasRenderingContext2D, shape: Shape) {
  const { type, width, height, radius, sides, points, innerRadius } = shape;
  switch (type) {
    case "rect": {
      ctx.rect(-width / 2, -height / 2, width, height);
      break;
    }
    case "circle": {
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      break;
    }
    case "triangle": {
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
      break;
    }
    case "polygon": {
      const n = Math.max(3, Math.round(sides));
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }
    case "star": {
      const n = Math.max(3, Math.round(points));
      const rOut = radius;
      const rIn = radius * Math.max(0, Math.min(1, innerRadius));
      for (let i = 0; i < n * 2; i++) {
        const angle = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? rOut : rIn;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }
  }
}

/** 计算图形的有效变换：自身 transform + 所属部件基础偏移 + 动画偏移 */
function computeShapeTransform(
  shape: Shape,
  parts: Part[],
  joints: Joint[],
  bones: Bone[],
  pose: JointPositions,
  time = 0,
): Transform2D {
  let parent: Part | undefined;
  for (const p of parts) {
    if (p.shapeIds.includes(shape.id)) {
      parent = p;
      break;
    }
  }

  const offset = parent ? sampleOffset(parent.offsetKeyframes, time) : undefined;

  // 若部件绑定到骨骼，则取骨骼当前变换作为父变换
  let boneTransform: Transform2D | undefined;
  if (parent?.boneId) {
    const bone = findBone(bones, parent.boneId);
    if (bone) {
      const fromJoint = findJoint(joints, bone.fromJointId);
      const toJoint = findJoint(joints, bone.toJointId);
      if (fromJoint && toJoint) {
        const from = pose[bone.fromJointId] ?? { x: fromJoint.x, y: fromJoint.y };
        const to = pose[bone.toJointId] ?? { x: toJoint.x, y: toJoint.y };
        const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
        boneTransform = {
          x: from.x,
          y: from.y,
          rotation: angle,
          scaleX: 1,
          scaleY: 1,
        };
      }
    }
  } else if (parent?.jointId) {
    const joint = findJoint(joints, parent.jointId);
    if (joint) {
      const pos = pose[parent.jointId] ?? { x: joint.x, y: joint.y };
      boneTransform = { x: pos.x, y: pos.y, rotation: 0, scaleX: 1, scaleY: 1 };
    }
  }

  const base = parent?.baseOffset ?? { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 };

  const result: Transform2D = {
    x: shape.transform.x + base.x + (offset?.x ?? 0) + (boneTransform?.x ?? 0),
    y: shape.transform.y + base.y + (offset?.y ?? 0) + (boneTransform?.y ?? 0),
    rotation: shape.transform.rotation + base.rotation + (offset?.rotation ?? 0) + (boneTransform?.rotation ?? 0),
    scaleX: shape.transform.scaleX * base.scaleX * (offset?.scaleX ?? 1) * (boneTransform?.scaleX ?? 1),
    scaleY: shape.transform.scaleY * base.scaleY * (offset?.scaleY ?? 1) * (boneTransform?.scaleY ?? 1),
  };

  return result;
}

/** 绘制单个图形 */
function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  transform: Transform2D,
  cellSize: number,
  isSelected: boolean,
) {
  const center = toCanvas(transform.x, transform.y, cellSize);

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.scaleX, transform.scaleY);
  ctx.globalAlpha = shape.opacity;

  ctx.beginPath();
  drawShapePath(ctx, shape);

  if (shape.fill && shape.fill !== "transparent") {
    ctx.fillStyle = shape.fill;
    ctx.fill();
  }
  if (shape.stroke && shape.stroke !== "transparent" && shape.strokeWidth > 0) {
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth = shape.strokeWidth;
    ctx.stroke();
  }

  // 选中高亮
  if (isSelected) {
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2 / Math.max(0.001, transform.scaleX);
    ctx.stroke();
  }

  ctx.restore();
}

/** 渲染所有图形 */
export function renderShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  parts: Part[],
  joints: Joint[],
  bones: Bone[],
  pose: JointPositions,
  options: ShapeRenderOptions,
) {
  const { cellSize, selectedShapeId, selectedPartId, time = 0 } = options;

  // 收集选中部件包含的图形 ID
  const selectedPartShapeIds = new Set<string>();
  if (selectedPartId) {
    const part = parts.find((p) => p.id === selectedPartId);
    if (part) {
      for (const id of part.shapeIds) selectedPartShapeIds.add(id);
    }
  }

  for (const shape of shapes) {
    const transform = computeShapeTransform(shape, parts, joints, bones, pose, time);
    const isSelected = shape.id === selectedShapeId || selectedPartShapeIds.has(shape.id);
    drawShape(ctx, shape, transform, cellSize, isSelected);
  }
}

/** 判断点是否命中图形（简化包围盒检测） */
export function hitTestShape(
  shapes: Shape[],
  parts: Part[],
  joints: Joint[],
  bones: Bone[],
  pose: JointPositions,
  point: { x: number; y: number },
  cellSize: number,
  time = 0,
): Shape | null {
  // 从后往前检测，顶层优先
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    const transform = computeShapeTransform(shape, parts, joints, bones, pose, time);
    const center = toCanvas(transform.x, transform.y, cellSize);

    // 将点转换到形状本地坐标系
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const cos = Math.cos((-transform.rotation * Math.PI) / 180);
    const sin = Math.sin((-transform.rotation * Math.PI) / 180);
    const localX = (dx * cos - dy * sin) / transform.scaleX;
    const localY = (dx * sin + dy * cos) / transform.scaleY;

    let hit = false;
    switch (shape.type) {
      case "rect":
        hit = Math.abs(localX) <= shape.width / 2 && Math.abs(localY) <= shape.height / 2;
        break;
      case "circle":
        hit = localX * localX + localY * localY <= shape.radius * shape.radius;
        break;
      case "triangle":
      case "polygon":
      case "star": {
        // 使用半径包围圆近似
        hit = localX * localX + localY * localY <= shape.radius * shape.radius;
        break;
      }
    }
    if (hit) return shape;
  }
  return null;
}
