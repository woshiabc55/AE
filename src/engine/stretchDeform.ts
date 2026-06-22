// 两点拉伸区域变形计算

import type { Point, StretchRegion } from "@/types";

/** 判断点是否在矩形区域内 */
function isInsideRect(p: Point, c1: Point, c2: Point): boolean {
  const minX = Math.min(c1.x, c2.x);
  const maxX = Math.max(c1.x, c2.x);
  const minY = Math.min(c1.y, c2.y);
  const maxY = Math.max(c1.y, c2.y);
  return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
}

/** 对拉伸区域内的格子做仿射变换，返回变形后的位置 */
export function computeStretchDeform(
  cellKey: string,
  region: StretchRegion,
): Point | null {
  const [gx, gy] = cellKey.split(",").map(Number);
  const p: Point = { x: gx, y: gy };
  if (!isInsideRect(p, region.corner1, region.corner2)) return null;

  const c1 = region.corner1;
  const c2 = region.corner2;
  const minX = Math.min(c1.x, c2.x);
  const maxX = Math.max(c1.x, c2.x);
  const minY = Math.min(c1.y, c2.y);
  const maxY = Math.max(c1.y, c2.y);
  const w = maxX - minX;
  const h = maxY - minY;

  // 归一化坐标 (0~1)
  const u = w === 0 ? 0 : (gx - minX) / w;
  const v = h === 0 ? 0 : (gy - minY) / h;

  // 应用偏移和缩放
  const newW = w * region.scale.x;
  const newH = h * region.scale.y;
  const newMinX = minX + region.offset.x;
  const newMinY = minY + region.offset.y;

  return {
    x: newMinX + u * newW,
    y: newMinY + v * newH,
  };
}

/** 获取拉伸区域的矩形边界（用于渲染） */
export function getStretchBounds(region: StretchRegion): {
  minX: number; minY: number; maxX: number; maxY: number;
} {
  return {
    minX: Math.min(region.corner1.x, region.corner2.x) + region.offset.x,
    minY: Math.min(region.corner1.y, region.corner2.y) + region.offset.y,
    maxX: Math.max(region.corner1.x, region.corner2.x) + region.offset.x + (Math.max(region.corner1.x, region.corner2.x) - Math.min(region.corner1.x, region.corner2.x)) * (region.scale.x - 1),
    maxY: Math.max(region.corner1.y, region.corner2.y) + region.offset.y + (Math.max(region.corner1.y, region.corner2.y) - Math.min(region.corner1.y, region.corner2.y)) * (region.scale.y - 1),
  };
}