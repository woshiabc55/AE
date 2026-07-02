// 骑士像素精灵：程序化绘制各姿态（局部坐标 0..14 宽 × 0..26 高，原点左上，朝右）

import { PAL } from "@/config";
import { rect, thickLine } from "./pixelArt";
import type { PlayerStateName } from "@/types";

type Ctx = CanvasRenderingContext2D;

export interface KnightDrawOpts {
  state: PlayerStateName;
  t: number; // 处于该状态的时间（秒）
  runPhase: number; // 跑动相位累加
  attackProgress: number; // 攻击进度 0..1
  attackIndex: number; // 连斩段 0..2
  flash: number; // 受击白闪 0..1
}

const HALF_W = 7; // 半宽（块）
const HEIGHT = 26; // 高（块）

/** 角度（度，+x 为 0，向上为 90）转剑尖局部坐标，pivot 为手部 */
function bladeTip(
  px: number,
  py: number,
  len: number,
  deg: number,
): [number, number] {
  const r = (deg * Math.PI) / 180;
  return [px + Math.cos(r) * len, py - Math.sin(r) * len];
}

function easeOut(p: number) {
  return 1 - (1 - p) * (1 - p);
}

function easeInOut(p: number) {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}

export function drawKnight(ctx: Ctx, o: KnightDrawOpts) {
  // 动画参数
  let bob = 0; // 身体上下偏移（块，正为下）
  let lean = 0; // 身体前倾（块 x 偏移）
  let legFront = 0; // 前腿 x 偏移
  let legBack = 0;
  let swordAngle = 100; // 剑静止角度（度）
  let crouch = 0; // 蹲伏压缩（块）
  let drawDead = false;

  switch (o.state) {
    case "idle": {
      bob = Math.sin(o.t * 3) * 0.4;
      swordAngle = 100 + Math.sin(o.t * 3) * 4;
      break;
    }
    case "run": {
      const s = Math.sin(o.runPhase);
      const s2 = Math.sin(o.runPhase + Math.PI);
      legFront = s * 2.2;
      legBack = s2 * 2.2;
      bob = Math.abs(Math.sin(o.runPhase * 2)) * 0.7;
      lean = 1;
      swordAngle = 95;
      break;
    }
    case "jump": {
      crouch = 1.2;
      legFront = 1.5;
      legBack = -1;
      bob = -1;
      swordAngle = 110;
      break;
    }
    case "fall": {
      legFront = 0.5;
      legBack = 1.5;
      swordAngle = 85;
      break;
    }
    case "attack1":
    case "attack2":
    case "attack3": {
      const idx = o.state === "attack1" ? 0 : o.state === "attack2" ? 1 : 2;
      o.attackIndex; // 标记使用
      const starts = [130, 50, 160];
      const ends = [-20, -30, -70];
      const p = easeOut(Math.min(1, o.attackProgress));
      swordAngle = starts[idx] + (ends[idx] - starts[idx]) * p;
      lean = 1.5 + p * 1;
      bob = p * 0.6;
      break;
    }
    case "dash": {
      lean = 3;
      legFront = 3;
      legBack = -2;
      crouch = 1.5;
      swordAngle = 150;
      break;
    }
    case "hurt": {
      lean = -1.5;
      bob = 0.6;
      legFront = -1;
      legBack = 1.5;
      swordAngle = 70;
      break;
    }
    case "dead": {
      drawDead = true;
      break;
    }
  }

  if (drawDead) {
    drawDeadKnight(ctx, o.t);
    return;
  }

  const ox = lean; // 整体 x 偏移
  const oy = bob + crouch;

  // ---- 披风（背后）----
  rect(ctx, 3 + ox, 12 + oy, 2, 8, PAL.capeDark);
  rect(ctx, 9 + ox, 12 + oy, 2, 8, PAL.capeDark);
  rect(ctx, 4 + ox, 12 + oy, 1, 7, PAL.capeRed);
  rect(ctx, 9 + ox, 12 + oy, 1, 7, PAL.capeRed);

  // ---- 后腿 ----
  rect(ctx, 5 + ox + legBack, 18 + oy, 2, 5 - crouch, PAL.leather);
  rect(ctx, 4 + ox + legBack, 23 + oy - crouch, 3, 2, PAL.armorDark);
  // ---- 前腿 ----
  rect(ctx, 8 + ox + legFront, 18 + oy, 2, 5 - crouch, PAL.armorMid);
  rect(ctx, 7 + ox + legFront, 23 + oy - crouch, 3, 2, PAL.outline);

  // ---- 躯干 ----
  rect(ctx, 4 + ox, 11 + oy, 6, 7 - crouch, PAL.armorMid);
  rect(ctx, 4 + ox, 11 + oy, 6, 1, PAL.armorLight); // 顶部高光
  rect(ctx, 4 + ox, 16 + oy, 6, 2 - crouch, PAL.armorDark); // 底部阴影
  rect(ctx, 4 + ox, 17 + oy - crouch, 6, 1, PAL.gold); // 金色腰带

  // 胸口徽记
  rect(ctx, 6 + ox, 13 + oy, 2, 2, PAL.gold);

  // ---- 肩甲（大）----
  rect(ctx, 2 + ox, 10 + oy, 3, 3, PAL.armorLight);
  rect(ctx, 9 + ox, 10 + oy, 3, 3, PAL.armorLight);
  rect(ctx, 2 + ox, 10 + oy, 3, 1, PAL.white);
  rect(ctx, 9 + ox, 10 + oy, 3, 1, PAL.white);

  // ---- 后臂 ----
  rect(ctx, 3 + ox, 12 + oy, 1, 4, PAL.armorMid);

  // ---- 头盔 ----
  rect(ctx, 4 + ox, 3 + oy, 6, 6, PAL.armorLight);
  rect(ctx, 4 + ox, 3 + oy, 6, 1, PAL.white); // 头顶高光
  rect(ctx, 4 + ox, 8 + oy, 6, 1, PAL.armorDark); // 下颌阴影
  // 面甲
  rect(ctx, 4 + ox, 5 + oy, 6, 3, PAL.armorDark);
  // 视缝 + 发光双眼
  rect(ctx, 5 + ox, 6 + oy, 4, 1, PAL.visorDark);
  rect(ctx, 5 + ox, 6 + oy, 1, 1, PAL.visorGlow);
  rect(ctx, 8 + ox, 6 + oy, 1, 1, PAL.visorGlow);

  // 颈
  rect(ctx, 6 + ox, 9 + oy, 2, 1, PAL.armorDark);

  // ---- 羽饰 ----
  rect(ctx, 7 + ox, 0 + oy, 1, 3, PAL.plumeRed);
  rect(ctx, 6 + ox, 1 + oy, 1, 2, PAL.plumeRed);
  rect(ctx, 8 + ox, 1 + oy, 1, 1, PAL.capeDark);

  // ---- 剑 + 前手 ----
  const handX = 10 + ox;
  const handY = 13 + oy;
  // 前手
  rect(ctx, handX - 1, handY, 2, 2, PAL.armorLight);
  // 剑刃（厚像素线，随角度）
  const [tipX, tipY] = bladeTip(handX, handY, 11, swordAngle);
  thickLine(ctx, handX, handY, tipX, tipY, 1.6, PAL.blade);
  // 剑刃高光（细一点的内层）
  const [tip2X, tip2Y] = bladeTip(handX, handY, 10.5, swordAngle);
  thickLine(ctx, handX + 0.2, handY, tip2X, tip2Y, 0.6, PAL.white);
  // 剑格 + 柄
  rect(ctx, handX - 1, handY, 3, 1, PAL.gold);
  rect(ctx, handX, handY + 1, 1, 2, PAL.leather);

  // 攻击挥砍残影
  if (
    (o.state === "attack1" || o.state === "attack2" || o.state === "attack3") &&
    o.attackProgress > 0.1 &&
    o.attackProgress < 0.7
  ) {
    const ghostP = Math.max(0, o.attackProgress - 0.18);
    const idx =
      o.state === "attack1" ? 0 : o.state === "attack2" ? 1 : 2;
    const starts = [130, 50, 160];
    const ends = [-20, -30, -70];
    const ga = starts[idx] + (ends[idx] - starts[idx]) * easeOut(ghostP);
    const [gx, gy] = bladeTip(handX, handY, 11, ga);
    ctx.globalAlpha = 0.25;
    thickLine(ctx, handX, handY, gx, gy, 2.4, PAL.white);
    ctx.globalAlpha = 1;
  }

  // 受击白闪覆盖
  if (o.flash > 0) {
    ctx.globalAlpha = Math.min(0.7, o.flash);
    rect(ctx, 2, 0, 11, 26, PAL.white);
    ctx.globalAlpha = 1;
  }
}

/** 倒地骑士：坍缩堆叠 */
function drawDeadKnight(ctx: Ctx, t: number) {
  const settle = Math.min(1, t / 0.4);
  const oy = (1 - settle) * 6;
  // 倒地躯干
  rect(ctx, 3, 22 + oy, 9, 2, PAL.armorMid);
  rect(ctx, 3, 22 + oy, 9, 1, PAL.armorLight);
  // 头盔
  rect(ctx, 1, 21 + oy, 3, 3, PAL.armorLight);
  rect(ctx, 1, 22 + oy, 3, 1, PAL.armorDark);
  rect(ctx, 2, 22 + oy, 1, 1, PAL.visorGlow);
  // 腿
  rect(ctx, 11, 22 + oy, 3, 2, PAL.leather);
  // 散落的剑
  const [tx, ty] = bladeTip(14, 23, 9, 15);
  thickLine(ctx, 14, 23, tx, ty, 1.4, PAL.blade);
  rect(ctx, 13, 22, 2, 1, PAL.gold);
  // 血泊
  ctx.globalAlpha = 0.6;
  rect(ctx, 2, 24, 12, 1, PAL.blood);
  ctx.globalAlpha = 1;
}
