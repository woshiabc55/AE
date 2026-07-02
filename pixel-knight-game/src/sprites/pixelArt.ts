// 像素绘制工具：以像素块为单位的矩形绘制，保持硬边像素感

import { PAL, PIXEL } from "@/config";

type Ctx = CanvasRenderingContext2D;

/** 在 (x,y) 画一个像素块（PIXEL×PIXEL 逻辑像素） */
export function px(ctx: Ctx, x: number, y: number, color: string, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x * PIXEL), Math.round(y * PIXEL), w * PIXEL, h * PIXEL);
}

/** 像素矩形（左上、宽高，单位为像素块） */
export function rect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x * PIXEL), Math.round(y * PIXEL), w * PIXEL, h * PIXEL);
}

/** 带描边的像素矩形 */
export function rectOutlined(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  outline: string = PAL.outline,
) {
  rect(ctx, x, y, w, h, color);
  ctx.fillStyle = outline;
  // 上下边
  ctx.fillRect(Math.round(x * PIXEL), Math.round(y * PIXEL), w * PIXEL, PIXEL);
  ctx.fillRect(
    Math.round(x * PIXEL),
    Math.round((y + h - 1) * PIXEL),
    w * PIXEL,
    PIXEL,
  );
  // 左右边
  ctx.fillRect(Math.round(x * PIXEL), Math.round(y * PIXEL), PIXEL, h * PIXEL);
  ctx.fillRect(
    Math.round((x + w - 1) * PIXEL),
    Math.round(y * PIXEL),
    PIXEL,
    h * PIXEL,
  );
}

/** 像素厚线：从 (x1,y1) 到 (x2,y2) 画一条粗像素线（保持硬边像素，无抗锯齿） */
export function thickLine(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness: number,
  color: string,
) {
  ctx.fillStyle = color;
  const drawn = new Set<number>();
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 3 + 4;
  const half = (thickness - 1) / 2;
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const bx = Math.round(x1 + (x2 - x1) * s);
    const by = Math.round(y1 + (y2 - y1) * s);
    for (let ty = -Math.floor(half); ty <= Math.ceil(half); ty++) {
      for (let tx = -Math.floor(half); tx <= Math.ceil(half); tx++) {
        const key = (bx + tx) * 100000 + (by + ty);
        if (drawn.has(key)) continue;
        drawn.add(key);
        ctx.fillRect(
          Math.round((bx + tx) * PIXEL),
          Math.round((by + ty) * PIXEL),
          PIXEL,
          PIXEL,
        );
      }
    }
  }
}

/** 把绘制原点平移到精灵脚下（用于实体绘制） */
export function withTransform(
  ctx: Ctx,
  x: number,
  y: number,
  facing: 1 | -1,
  fn: () => void,
) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing === -1) ctx.scale(-1, 1);
  fn();
  ctx.restore();
}
