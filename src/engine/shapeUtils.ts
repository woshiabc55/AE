// 图形与部件工具函数

import type { OffsetKeyframe, Part, Shape, ShapeType, Transform2D } from "@/types";
import { easeInOut } from "@/utils/geometry";

export function newShapeId(): string {
  return `sh_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function newPartId(): string {
  return `pt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function newOffsetKeyframeId(): string {
  return `ok_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const DEFAULT_TRANSFORM: Transform2D = {
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
};

export function createShape(type: ShapeType, x = 0, y = 0, fill = "#ff6b35"): Shape {
  const base: Shape = {
    id: newShapeId(),
    type,
    name: shapeLabel(type),
    transform: { ...DEFAULT_TRANSFORM, x, y },
    fill,
    stroke: "transparent",
    strokeWidth: 0,
    opacity: 1,
    width: 6,
    height: 4,
    radius: 3,
    sides: 5,
    points: 5,
    innerRadius: 0.5,
  };
  return base;
}

export function shapeLabel(type: ShapeType): string {
  switch (type) {
    case "rect":
      return "矩形";
    case "circle":
      return "圆形";
    case "triangle":
      return "三角形";
    case "polygon":
      return "多边形";
    case "star":
      return "星形";
  }
}

export function createPart(name = "新部件"): Part {
  return {
    id: newPartId(),
    name,
    shapeIds: [],
    baseOffset: { ...DEFAULT_TRANSFORM },
    offsetKeyframes: [],
  };
}

/** 采样部件在指定时间的动画偏移 */
export function sampleOffset(offsetKeyframes: OffsetKeyframe[], time: number): Transform2D {
  const sorted = [...offsetKeyframes].sort((a, b) => a.time - b.time);
  if (sorted.length === 0) return { ...DEFAULT_TRANSFORM };
  if (sorted.length === 1) return { ...sorted[0].offset };

  const t = Math.max(0, Math.min(1, time));
  if (t <= sorted[0].time) return { ...sorted[0].offset };
  if (t >= sorted[sorted.length - 1].time) return { ...sorted[sorted.length - 1].offset };

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (t >= a.time && t <= b.time) {
      const span = b.time - a.time;
      const localT = span === 0 ? 0 : (t - a.time) / span;
      const e = easeInOut(localT);
      return {
        x: a.offset.x + (b.offset.x - a.offset.x) * e,
        y: a.offset.y + (b.offset.y - a.offset.y) * e,
        rotation: a.offset.rotation + (b.offset.rotation - a.offset.rotation) * e,
        scaleX: a.offset.scaleX + (b.offset.scaleX - a.offset.scaleX) * e,
        scaleY: a.offset.scaleY + (b.offset.scaleY - a.offset.scaleY) * e,
      };
    }
  }
  return { ...sorted[sorted.length - 1].offset };
}
