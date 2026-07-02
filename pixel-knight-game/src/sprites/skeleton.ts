// 骷髅战士像素精灵：程序化绘制（局部 0..12 宽 × 0..24 高，原点左上，朝右）

import { PAL } from "@/config";
import { rect, thickLine } from "./pixelArt";
import type { EnemyStateName } from "@/types";

type Ctx = CanvasRenderingContext2D;

export interface SkeletonDrawOpts {
  state: EnemyStateName;
  t: number;
  runPhase: number;
  attackProgress: number; // 0..1
  flash: number;
}

function easeOut(p: number) {
  return 1 - (1 - p) * (1 - p);
}

export function drawSkeleton(ctx: Ctx, o: SkeletonDrawOpts) {
  let bob = 0;
  let lean = 0;
  let legFront = 0;
  let legBack = 0;
  let swordAngle = 60;
  let dead = false;

  switch (o.state) {
    case "idle":
      bob = Math.sin(o.t * 2.5) * 0.4;
      swordAngle = 60;
      break;
    case "patrol":
    case "chase": {
      const s = Math.sin(o.runPhase);
      legFront = s * 2;
      legBack = -s * 2;
      bob = Math.abs(Math.sin(o.runPhase * 2)) * 0.6;
      lean = 0.6;
      swordAngle = 70;
      break;
    }
    case "attack": {
      const p = easeOut(Math.min(1, o.attackProgress));
      swordAngle = 120 - p * 150; // 从上劈到下
      lean = 1 + p;
      break;
    }
    case "hurt":
      lean = -1.2;
      bob = 0.6;
      swordAngle = 40;
      break;
    case "dead":
      dead = true;
      break;
  }

  if (dead) {
    drawDeadSkeleton(ctx, o.t);
    return;
  }

  const ox = lean;
  const oy = bob;

  // 后腿
  rect(ctx, 4 + ox + legBack, 16 + oy, 2, 6, PAL.boneShadow);
  rect(ctx, 3 + ox + legBack, 22 + oy, 4, 1, PAL.boneDark);
  // 前腿
  rect(ctx, 6 + ox + legFront, 16 + oy, 2, 6, PAL.bone);
  rect(ctx, 5 + ox + legFront, 22 + oy, 4, 1, PAL.boneDark);

  // 骨盆
  rect(ctx, 4 + ox, 14 + oy, 4, 2, PAL.boneShadow);

  // 脊柱 + 肋骨
  rect(ctx, 5 + ox, 9 + oy, 2, 6, PAL.bone); // 脊柱
  for (let i = 0; i < 3; i++) {
    rect(ctx, 4 + ox, 9 + oy + i * 2, 4, 1, PAL.bone);
  }
  rect(ctx, 4 + ox, 9 + oy, 4, 1, PAL.boneShadow);

  // 后臂
  rect(ctx, 3 + ox, 10 + oy, 1, 4, PAL.boneShadow);

  // 颅骨
  rect(ctx, 4 + ox, 2 + oy, 5, 6, PAL.bone);
  rect(ctx, 4 + ox, 2 + oy, 5, 1, PAL.white);
  rect(ctx, 4 + ox, 7 + oy, 5, 1, PAL.boneShadow);
  // 眼窝
  rect(ctx, 4 + ox, 4 + oy, 5, 2, PAL.boneDark);
  rect(ctx, 5 + ox, 4 + oy, 1, 1, PAL.ghoulGlow);
  rect(ctx, 8 + ox, 4 + oy, 1, 1, PAL.ghoulGlow);
  // 下颌齿
  rect(ctx, 5 + ox, 6 + oy, 3, 1, PAL.boneDark);
  ctx.fillStyle = PAL.bone;
  ctx.fillRect((5) * 3, (6) * 3, 1 * 3, 1 * 3); // 占位避免空齿

  // 锈剑 + 前手
  const handX = 8 + ox;
  const handY = 11 + oy;
  rect(ctx, handX, handY, 2, 2, PAL.bone);
  const tipDeg = swordAngle;
  const r = (tipDeg * Math.PI) / 180;
  const len = 10;
  const tipX = handX + Math.cos(r) * len;
  const tipY = handY - Math.sin(r) * len;
  thickLine(ctx, handX, handY, tipX, tipY, 1.5, PAL.bladeShadow);
  thickLine(ctx, handX, handY, tipX, tipY, 0.5, PAL.bone);
  rect(ctx, handX - 1, handY, 3, 1, PAL.boneDark);

  // 发光双眼辉光
  ctx.globalAlpha = 0.5;
  rect(ctx, 4 + ox, 3 + oy, 5, 3, PAL.ghoulGlow);
  ctx.globalAlpha = 1;

  if (o.flash > 0) {
    ctx.globalAlpha = Math.min(0.7, o.flash);
    rect(ctx, 3, 0, 8, 24, PAL.white);
    ctx.globalAlpha = 1;
  }
}

function drawDeadSkeleton(ctx: Ctx, t: number) {
  const settle = Math.min(1, t / 0.3);
  const oy = (1 - settle) * 5;
  // 散落骨头
  rect(ctx, 2, 22 + oy, 5, 1, PAL.bone);
  rect(ctx, 8, 22 + oy, 4, 1, PAL.boneShadow);
  rect(ctx, 1, 21 + oy, 3, 2, PAL.bone); // 颅骨
  rect(ctx, 1, 21 + oy, 3, 1, PAL.boneShadow);
  rect(ctx, 2, 21 + oy, 1, 1, PAL.ghoulGlow);
  // 锈剑
  thickLine(ctx, 9, 23, 16, 21, 1.3, PAL.bladeShadow);
  ctx.globalAlpha = 0.4;
  rect(ctx, 1, 23, 10, 1, PAL.blood);
  ctx.globalAlpha = 1;
}
