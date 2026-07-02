// 场景瓦片：天空、月亮、远/中古堡剪影、地面、雾（按视差层绘制）

import { PAL, VIEW_W, VIEW_H, GROUND_Y } from "@/config";

type Ctx = CanvasRenderingContext2D;

const B = 6; // 背景像素块尺寸（粗粒度）

function block(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x / B) * B, Math.floor(y / B) * B, w * B, h * B);
}

/** 天空渐变（像素带状） */
export function drawSky(ctx: Ctx) {
  const bands = 60;
  const bandH = (GROUND_Y / bands);
  for (let i = 0; i < bands; i++) {
    const t = i / bands;
    let c: string;
    if (t < 0.5) {
      c = lerpColor(PAL.skyTop, PAL.skyMid, t / 0.5);
    } else {
      c = lerpColor(PAL.skyMid, PAL.skyHorizon, (t - 0.5) / 0.5);
    }
    ctx.fillStyle = c;
    ctx.fillRect(0, Math.floor((i * bandH) / B) * B, VIEW_W, Math.ceil(bandH) + B);
  }
}

/** 月亮 + 光晕 + 星星 */
export function drawMoon(ctx: Ctx, ox: number) {
  const mx = 980 - ox;
  const my = 150;
  // 光晕
  const grad = ctx.createRadialGradient(mx, my, 10, mx, my, 220);
  grad.addColorStop(0, "rgba(138,180,196,0.45)");
  grad.addColorStop(0.4, "rgba(138,180,196,0.15)");
  grad.addColorStop(1, "rgba(138,180,196,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(mx - 220, my - 220, 440, 440);
  // 月盘（像素圆）
  drawPixelCircle(ctx, mx, my, 46, PAL.moon);
  drawPixelCircle(ctx, mx - 12, my - 8, 40, PAL.moonGlow);
  // 月坑
  drawPixelCircle(ctx, mx + 12, my - 6, 5, "rgba(120,150,170,0.5)");
  drawPixelCircle(ctx, mx - 6, my + 14, 4, "rgba(120,150,170,0.5)");
  // 星星
  const stars = [
    [120, 80], [260, 140], [400, 60], [560, 110], [720, 50],
    [820, 180], [180, 200], [640, 220], [300, 260], [1140, 90],
  ];
  for (const [sx, sy] of stars) {
    block(ctx, sx - ox * 0.15, sy, 1, 1, PAL.moon);
  }
}

/** 远景古堡剪影 */
export function drawFarCastle(ctx: Ctx, ox: number) {
  const baseY = GROUND_Y - 40;
  const towers: Array<[number, number, number]> = [
    [0, 80, 120], [120, 120, 90], [260, 70, 140], [360, 100, 100],
    [480, 60, 160], [620, 130, 80], [780, 90, 120], [900, 70, 150],
    [1060, 110, 95], [1180, 80, 130], [1320, 100, 110], [1460, 70, 150],
  ];
  ctx.fillStyle = PAL.castleFar;
  for (const [tx, tw, th] of towers) {
    const x = tx - ox;
    // 主塔
    ctx.fillRect(x, baseY - th, tw, th);
    // 城垛
    for (let i = 0; i < tw; i += 18) {
      ctx.fillRect(x + i, baseY - th - 12, 10, 12);
    }
    // 塔顶尖
    ctx.fillRect(x + tw / 2 - 3, baseY - th - 30, 6, 20);
  }
  // 远雾覆盖
  ctx.fillStyle = "rgba(30,43,74,0.35)";
  ctx.fillRect(0, 0, VIEW_W, GROUND_Y);
}

/** 中景柱列与城墙 */
export function drawMidPillars(ctx: Ctx, ox: number) {
  const baseY = GROUND_Y;
  const pillars: Array<[number, number]> = [
    [60, 220], [340, 180], [620, 240], [940, 200], [1240, 230], [1560, 190],
  ];
  for (const [px, ph] of pillars) {
    const x = px - ox;
    // 柱身
    ctx.fillStyle = PAL.pillar;
    ctx.fillRect(x, baseY - ph, 44, ph);
    ctx.fillStyle = PAL.pillarLight;
    ctx.fillRect(x, baseY - ph, 8, ph);
    ctx.fillStyle = PAL.castleMid;
    ctx.fillRect(x + 36, baseY - ph, 8, ph);
    // 柱头
    ctx.fillStyle = PAL.pillarLight;
    ctx.fillRect(x - 8, baseY - ph, 60, 14);
    // 柱础
    ctx.fillStyle = PAL.castleMid;
    ctx.fillRect(x - 10, baseY - 18, 64, 18);
  }
  // 中景墙
  ctx.fillStyle = PAL.castleMid;
  ctx.fillRect(0, baseY - 30, VIEW_W, 30);
}

/** 地面 + 砖纹 */
export function drawGround(ctx: Ctx, ox: number) {
  // 地面主体
  ctx.fillStyle = PAL.ground;
  ctx.fillRect(0, GROUND_Y, VIEW_W, VIEW_H - GROUND_Y);
  // 顶面高光
  ctx.fillStyle = PAL.groundTop;
  ctx.fillRect(0, GROUND_Y, VIEW_W, 8);
  ctx.fillStyle = "rgba(170,180,214,0.25)";
  ctx.fillRect(0, GROUND_Y, VIEW_W, 3);
  // 砖纹
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  const brickW = 48;
  const startX = -((ox % brickW) + brickW);
  for (let x = startX; x < VIEW_W + brickW; x += brickW) {
    ctx.fillRect(x, GROUND_Y + 24, 2, VIEW_H - GROUND_Y - 24);
  }
  for (let y = GROUND_Y + 24; y < VIEW_H; y += 24) {
    ctx.fillRect(0, y, VIEW_W, 2);
  }
  // 裂缝碎石
  ctx.fillStyle = PAL.groundTop;
  for (let i = 0; i < 20; i++) {
    const sx = (((i * 137) % VIEW_W) - (ox * 0.6 % 40));
    ctx.fillRect(sx, GROUND_Y + 12 + (i % 4) * 6, 3, 2);
  }
}

/** 前景雾 */
export function drawForegroundFog(ctx: Ctx, ox: number, time: number) {
  ctx.fillStyle = "rgba(42,53,80,0.28)";
  for (let i = 0; i < 6; i++) {
    const fx = ((i * 240 - (ox * 0.4 + time * 8)) % (VIEW_W + 300)) - 150;
    const fy = GROUND_Y - 10 - (i % 3) * 14;
    ctx.fillRect(fx, fy, 220, 30);
  }
}

/** 火把（点光源，含火苗动画） */
export function drawTorch(ctx: Ctx, x: number, y: number, time: number) {
  // 火把杆
  ctx.fillStyle = PAL.leather;
  ctx.fillRect(x - 2, y, 4, 22);
  // 火苗
  const flick = Math.sin(time * 18 + x) * 2 + Math.sin(time * 31 + x) * 1.5;
  const fh = 18 + flick;
  ctx.fillStyle = PAL.torchFire;
  ctx.fillRect(x - 5, y - fh, 10, fh);
  ctx.fillStyle = PAL.torchCore;
  ctx.fillRect(x - 3, y - fh + 4, 6, fh - 4);
  ctx.fillStyle = "#fff7d0";
  ctx.fillRect(x - 1, y - fh + 8, 2, fh - 12);
}

// ---- 工具 ----

function drawPixelCircle(ctx: Ctx, cx: number, cy: number, r: number, color: string) {
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y += B) {
    for (let x = -r; x <= r; x += B) {
      if (x * x + y * y <= r * r) {
        ctx.fillRect(Math.floor((cx + x) / B) * B, Math.floor((cy + y) / B) * B, B, B);
      }
    }
  }
}

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
