// Boss 像素精灵：程序化绘制 4 种 Boss（统一 24×36 精灵块网格，按 def.id 分发）
// 原点：精灵左上角；坐标系：x 向右增长，y 向下增长；脚下在 y=SPRITE_H（底部）

import { PAL, PIXEL } from "@/config";
import { rect, thickLine } from "./pixelArt";
import type { Boss } from "@/entities/Boss";

type Ctx = CanvasRenderingContext2D;

// 统一精灵块网格（绘制时通过 scale 适配每个 boss 的实际 width/height）
const SPRITE_W = 24;
const SPRITE_H = 36;

export function drawBoss(ctx: Ctx, boss: Boss, time: number) {
  ctx.save();
  ctx.translate(Math.round(boss.x), Math.round(boss.y));
  ctx.scale(boss.facing, 1);
  // 将精灵块网格 (SPRITE_W × SPRITE_H, 每块 PIXEL 像素) 缩放到 boss 实际尺寸
  ctx.scale(boss.width / (SPRITE_W * PIXEL), boss.height / (SPRITE_H * PIXEL));
  ctx.translate(0, -SPRITE_H);

  if (boss.dead) {
    drawDeadBoss(ctx, boss, time);
  } else {
    const id = boss.def.id;
    if (id === "kael") drawKael(ctx, boss, time);
    else if (id === "bilefang") drawBilefang(ctx, boss, time);
    else if (id === "veyra") drawVeyra(ctx, boss, time);
    else if (id === "morgrim") drawMorgrim(ctx, boss, time);
  }

  // 受击白闪覆盖
  if (boss.flash > 0 && !boss.dead) {
    ctx.globalAlpha = Math.min(0.7, boss.flash);
    rect(ctx, 0, 0, SPRITE_W, SPRITE_H, PAL.white);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function easeOut(p: number) {
  return 1 - (1 - p) * (1 - p);
}

function breathe(t: number, amp = 0.4, speed = 2.5) {
  return Math.sin(t * speed) * amp;
}

function bladeTip(handX: number, handY: number, len: number, deg: number): [number, number] {
  const r = (deg * Math.PI) / 180;
  return [handX + Math.cos(r) * len, handY - Math.sin(r) * len];
}

// ===== Boss 1：骸骨将军 Kael（大骷髅，兜帽角盔 + 巨剑）=====
function drawKael(ctx: Ctx, b: Boss, time: number) {
  const phase2 = b.phase >= 2;
  const oy = breathe(b.stateTime, 0.5, 2.5);
  const lean = b.state === "chase" ? 1 : 0;
  const ox = lean;
  const eye = phase2 ? PAL.blood : PAL.ghoulGlow;

  // 攻击挥剑角度（attackProgress 由引擎外部填，或用 stateTime 近似）
  let swordAngle = 95;
  if (b.state === "attack") {
    const p = easeOut(Math.min(1, b.attackProgress));
    swordAngle = 150 - p * 210;
  }

  // 披风
  rect(ctx, 6 + ox, 10 + oy, 4, 16, PAL.capeDark);
  rect(ctx, 14 + ox, 10 + oy, 4, 16, PAL.capeDark);
  rect(ctx, 7 + ox, 10 + oy, 2, 14, PAL.capeRed);
  rect(ctx, 15 + ox, 10 + oy, 2, 14, PAL.capeRed);

  // 腿
  rect(ctx, 8 + ox, 26 + oy, 3, 8, PAL.boneShadow);
  rect(ctx, 7 + ox, 33 + oy, 4, 2, PAL.boneDark);
  rect(ctx, 13 + ox, 26 + oy, 3, 8, PAL.bone);
  rect(ctx, 12 + ox, 33 + oy, 4, 2, PAL.boneDark);

  // 骨盆 + 脊柱 + 肋骨
  rect(ctx, 8 + ox, 22 + oy, 8, 4, PAL.boneShadow);
  rect(ctx, 10 + ox, 11 + oy, 4, 12, PAL.bone);
  for (let i = 0; i < 5; i++) rect(ctx, 8 + ox, 12 + oy + i * 2, 8, 1, PAL.bone);
  rect(ctx, 8 + ox, 11 + oy, 8, 1, PAL.boneShadow);

  // 肩甲（带金刺）
  rect(ctx, 6 + ox, 10 + oy, 4, 3, PAL.armorDark);
  rect(ctx, 14 + ox, 10 + oy, 4, 3, PAL.armorDark);
  rect(ctx, 5 + ox, 9 + oy, 1, 2, PAL.gold);
  rect(ctx, 18 + ox, 9 + oy, 1, 2, PAL.gold);

  // 后臂
  rect(ctx, 7 + ox, 11 + oy, 2, 6, PAL.boneShadow);

  // 颅骨
  rect(ctx, 9 + ox, 1 + oy, 6, 7, PAL.bone);
  rect(ctx, 9 + ox, 1 + oy, 6, 1, PAL.white);
  rect(ctx, 9 + ox, 7 + oy, 6, 1, PAL.boneShadow);
  rect(ctx, 9 + ox, 3 + oy, 6, 2, PAL.boneDark);
  rect(ctx, 10 + ox, 3 + oy, 1, 1, eye);
  rect(ctx, 13 + ox, 3 + oy, 1, 1, eye);
  rect(ctx, 10 + ox, 5 + oy, 4, 1, PAL.boneDark);

  // 角盔 + 金冠
  rect(ctx, 8 + ox, 0 + oy, 8, 2, PAL.armorDark);
  rect(ctx, 9 + ox, -1 + oy, 6, 1, PAL.gold);
  rect(ctx, 11 + ox, -2 + oy, 2, 1, PAL.gold);
  thickLine(ctx, 8 + ox, 0 + oy, 5 + ox, -3 + oy, 1.5, PAL.armorDark);
  thickLine(ctx, 16 + ox, 0 + oy, 19 + ox, -3 + oy, 1.5, PAL.armorDark);

  // 双手巨剑
  const handX = 17 + ox;
  const handY = 14 + oy;
  rect(ctx, handX - 1, handY, 3, 3, PAL.gold);
  rect(ctx, handX, handY + 2, 1, 3, PAL.leather);
  const [tx, ty] = bladeTip(handX, handY, 18, swordAngle);
  thickLine(ctx, handX, handY, tx, ty, 2.2, PAL.bladeShadow);
  thickLine(ctx, handX, handY, tx, ty, 0.8, PAL.blade);

  // 阶段 2：旋风红光 + 眼辉光
  if (phase2) {
    ctx.globalAlpha = 0.18 + Math.sin(time * 8) * 0.08;
    rect(ctx, 4 + ox, 8 + oy, 16, 22, PAL.blood);
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.5;
    rect(ctx, 9 + ox, 2 + oy, 6, 3, PAL.blood);
    ctx.globalAlpha = 1;
  }
}

// ===== Boss 2：沼泽巨魔 Bilefang（腐绿巨型，长臂大头）=====
function drawBilefang(ctx: Ctx, b: Boss, time: number) {
  const phase2 = b.phase >= 2;
  const frenzy = phase2;
  const oy = breathe(b.stateTime, frenzy ? 1.2 : 0.6, frenzy ? 6 : 2);
  const ox = frenzy ? Math.sin(time * 12) * 0.6 : 0;

  const skinDark = "#2f5a1f";
  const skinMid = "#4f8a2f";
  const skinLight = "#7bc043";
  const wart = "#2a3d18";
  const eye = phase2 ? "#ff5a3c" : "#cfe04a";

  // 后腿（粗壮）
  rect(ctx, 5 + ox, 25 + oy, 5, 9, skinDark);
  rect(ctx, 4 + ox, 33 + oy, 6, 2, wart);
  rect(ctx, 14 + ox, 25 + oy, 5, 9, skinMid);
  rect(ctx, 13 + ox, 33 + oy, 6, 2, wart);

  // 大肚子（球形）
  rect(ctx, 5 + ox, 14 + oy, 14, 13, skinMid);
  rect(ctx, 5 + ox, 14 + oy, 14, 2, skinLight);
  rect(ctx, 5 + ox, 25 + oy, 14, 2, skinDark);
  // 肚脐 + 疣
  rect(ctx, 11 + ox, 19 + oy, 2, 2, wart);
  rect(ctx, 8 + ox, 17 + oy, 1, 1, wart);
  rect(ctx, 16 + ox, 22 + oy, 1, 1, wart);
  rect(ctx, 13 + ox, 24 + oy, 1, 1, wart);

  // 长臂（垂到地面）
  rect(ctx, 2 + ox, 12 + oy, 3, 14, skinDark);
  rect(ctx, 1 + ox, 24 + oy, 4, 3, skinMid);
  rect(ctx, 19 + ox, 12 + oy, 3, 14, skinMid);
  rect(ctx, 19 + ox, 24 + oy, 4, 3, skinDark);
  // 利爪
  rect(ctx, 1 + ox, 27 + oy, 1, 2, PAL.white);
  rect(ctx, 3 + ox, 27 + oy, 1, 2, PAL.white);
  rect(ctx, 20 + ox, 27 + oy, 1, 2, PAL.white);
  rect(ctx, 22 + ox, 27 + oy, 1, 2, PAL.white);

  // 头（小，与大身躯对比，秃顶）
  rect(ctx, 9 + ox, 3 + oy, 7, 7, skinMid);
  rect(ctx, 9 + ox, 3 + oy, 7, 1, skinLight);
  rect(ctx, 9 + ox, 9 + oy, 7, 1, skinDark);
  // 眼
  rect(ctx, 10 + ox, 5 + oy, 2, 2, PAL.outline);
  rect(ctx, 10 + ox, 5 + oy, 1, 1, eye);
  rect(ctx, 14 + ox, 5 + oy, 2, 2, PAL.outline);
  rect(ctx, 14 + ox, 5 + oy, 1, 1, eye);
  // 大嘴 + 獠牙
  rect(ctx, 10 + ox, 8 + oy, 5, 1, PAL.outline);
  rect(ctx, 11 + ox, 8 + oy, 1, 1, PAL.white);
  rect(ctx, 13 + ox, 8 + oy, 1, 1, PAL.white);
  // 角状耳朵
  rect(ctx, 8 + ox, 4 + oy, 1, 3, skinDark);
  rect(ctx, 16 + ox, 4 + oy, 1, 3, skinDark);

  // 颈连接
  rect(ctx, 10 + ox, 10 + oy, 5, 2, skinDark);

  // 毒雾（攻击时口吐）
  if (b.state === "attack") {
    ctx.globalAlpha = 0.4;
    rect(ctx, 16 + ox, 7 + oy, 4, 3, PAL.ghoulGlow);
    rect(ctx, 18 + ox, 5 + oy, 3, 2, PAL.ghoulGlow);
    ctx.globalAlpha = 1;
  }

  // 阶段 2 狂暴：口溢毒液
  if (phase2) {
    ctx.globalAlpha = 0.6;
    rect(ctx, 12 + ox, 9 + oy, 1, 4, PAL.ghoulGlow);
    rect(ctx, 13 + ox, 11 + oy, 1, 3, PAL.ghoulGlow);
    ctx.globalAlpha = 1;
  }
}

// ===== Boss 3：霜誓骑士 Veyra（镜像骑士，蓝冰甲）=====
function drawVeyra(ctx: Ctx, b: Boss, time: number) {
  const phase2 = b.phase >= 2;
  const oy = breathe(b.stateTime, 0.4, 2.8);
  const lean = b.state === "chase" ? 1.2 : 0;
  const ox = lean;

  const ice = "#bfe8ff";
  const iceMid = "#7fc8e8";
  const iceDark = "#3a7ab8";
  const iceDeep = "#1f4a78";
  const frost = "#dffaff";
  const eye = phase2 ? PAL.visorGlow : "#9fe8ff";

  let swordAngle = 100;
  if (b.state === "attack") {
    const p = easeOut(Math.min(1, b.attackProgress));
    swordAngle = 140 - p * 200;
  }

  // 冰晶披风
  rect(ctx, 4 + ox, 11 + oy, 3, 9, iceDeep);
  rect(ctx, 17 + ox, 11 + oy, 3, 9, iceDeep);
  rect(ctx, 5 + ox, 11 + oy, 1, 8, iceDark);

  // 腿
  rect(ctx, 8 + ox, 24 + oy, 3, 9, iceDark);
  rect(ctx, 7 + ox, 32 + oy, 4, 2, PAL.outline);
  rect(ctx, 13 + ox, 24 + oy, 3, 9, iceMid);
  rect(ctx, 12 + ox, 32 + oy, 4, 2, PAL.outline);

  // 躯干（冰甲）
  rect(ctx, 7 + ox, 11 + oy, 10, 14, iceMid);
  rect(ctx, 7 + ox, 11 + oy, 10, 1, ice);
  rect(ctx, 7 + ox, 23 + oy, 10, 2, iceDark);
  rect(ctx, 7 + ox, 21 + oy, 10, 1, frost);
  // 胸口冰晶徽记
  rect(ctx, 10 + ox, 14 + oy, 4, 4, ice);
  rect(ctx, 11 + ox, 15 + oy, 2, 2, frost);
  rect(ctx, 11 + ox, 14 + oy, 2, 1, PAL.white);

  // 肩甲（带冰刺）
  rect(ctx, 5 + ox, 10 + oy, 3, 3, ice);
  rect(ctx, 16 + ox, 10 + oy, 3, 3, ice);
  rect(ctx, 4 + ox, 8 + oy, 1, 3, frost);
  rect(ctx, 19 + ox, 8 + oy, 1, 3, frost);

  // 后臂
  rect(ctx, 6 + ox, 12 + oy, 1, 5, iceDark);

  // 头盔（冰盔）
  rect(ctx, 8 + ox, 2 + oy, 8, 8, ice);
  rect(ctx, 8 + ox, 2 + oy, 8, 1, PAL.white);
  rect(ctx, 8 + ox, 9 + oy, 8, 1, iceDark);
  // 面甲
  rect(ctx, 8 + ox, 5 + oy, 8, 3, iceDeep);
  rect(ctx, 9 + ox, 6 + oy, 6, 1, PAL.outline);
  // 视缝 + 冰光眼
  rect(ctx, 10 + ox, 6 + oy, 1, 1, eye);
  rect(ctx, 13 + ox, 6 + oy, 1, 1, eye);
  // 颈
  rect(ctx, 10 + ox, 10 + oy, 4, 1, iceDark);

  // 冰晶羽冠
  rect(ctx, 11 + ox, -1 + oy, 2, 3, frost);
  rect(ctx, 9 + ox, 0 + oy, 1, 2, ice);
  rect(ctx, 14 + ox, 0 + oy, 1, 2, ice);

  // 冰刃
  const handX = 18 + ox;
  const handY = 14 + oy;
  rect(ctx, handX - 1, handY, 3, 2, frost);
  rect(ctx, handX, handY + 1, 1, 2, PAL.leather);
  const [tx, ty] = bladeTip(handX, handY, 16, swordAngle);
  thickLine(ctx, handX, handY, tx, ty, 2, ice);
  thickLine(ctx, handX, handY, tx, ty, 0.6, PAL.white);
  // 剑气（攻击残影）
  if (b.state === "attack") {
    const ghostP = Math.max(0, b.attackProgress - 0.18);
    const ga = 140 - easeOut(ghostP) * 200;
    const [gx, gy] = bladeTip(handX, handY, 16, ga);
    ctx.globalAlpha = 0.3;
    thickLine(ctx, handX, handY, gx, gy, 2.6, frost);
    ctx.globalAlpha = 1;
  }

  // 阶段 2：寒霜领域（蓝光晕）
  if (phase2) {
    ctx.globalAlpha = 0.2 + Math.sin(time * 5) * 0.08;
    rect(ctx, 4 + ox, 6 + oy, 16, 28, PAL.visorGlow);
    ctx.globalAlpha = 1;
    // 冰晶飘落点缀
    ctx.globalAlpha = 0.6;
    rect(ctx, 6 + ox, 30 + oy - (time * 6) % 8, 1, 1, frost);
    rect(ctx, 18 + ox, 22 + oy - (time * 5) % 10, 1, 1, frost);
    ctx.globalAlpha = 1;
  }
}

// ===== Boss 4：永夜之主 Morgrim（暗影法师浮空 + 紫袍 + 长杖）=====
function drawMorgrim(ctx: Ctx, b: Boss, time: number) {
  const phase2 = b.phase >= 2;
  // 浮空上下
  const float = Math.sin(time * 1.6) * 1.2;
  const oy = float;
  const ox = Math.sin(time * 0.9) * 0.5;

  const shadow = "#1a0f2e";
  const robe = "#2e1a4e";
  const robeMid = "#4a2c7a";
  const robeLight = "#7b5ea7";
  const glow = "#b989ff";
  const eye = phase2 ? PAL.blood : glow;

  // 长袍下摆（拖地）
  rect(ctx, 6 + ox, 24 + oy, 12, 12, shadow);
  rect(ctx, 7 + ox, 24 + oy, 10, 2, robe);
  rect(ctx, 6 + ox, 33 + oy, 12, 2, PAL.outline);
  // 袍褶
  rect(ctx, 9 + ox, 26 + oy, 1, 8, robe);
  rect(ctx, 13 + ox, 26 + oy, 1, 8, robe);

  // 躯干（袍）
  rect(ctx, 8 + ox, 12 + oy, 8, 14, robe);
  rect(ctx, 8 + ox, 12 + oy, 8, 1, robeMid);
  rect(ctx, 8 + ox, 24 + oy, 8, 2, shadow);
  // 胸口暗宝石
  rect(ctx, 11 + ox, 16 + oy, 2, 2, glow);
  ctx.globalAlpha = 0.6;
  rect(ctx, 10 + ox, 15 + oy, 4, 4, glow);
  ctx.globalAlpha = 1;

  // 后袖
  rect(ctx, 6 + ox, 13 + oy, 2, 8, robe);
  rect(ctx, 5 + ox, 20 + oy, 3, 2, shadow);

  // 头巾/兜帽
  rect(ctx, 8 + ox, 3 + oy, 8, 8, shadow);
  rect(ctx, 8 + ox, 3 + oy, 8, 1, robeMid);
  rect(ctx, 8 + ox, 10 + oy, 8, 1, PAL.outline);
  // 兜帽尖
  rect(ctx, 11 + ox, 0 + oy, 2, 3, shadow);
  rect(ctx, 11 + ox, 0 + oy, 2, 1, robeMid);
  // 面部阴影（仅露双眼）
  rect(ctx, 8 + ox, 5 + oy, 8, 4, PAL.outline);
  rect(ctx, 10 + ox, 6 + oy, 1, 1, eye);
  rect(ctx, 13 + ox, 6 + oy, 1, 1, eye);
  // 眼辉光
  ctx.globalAlpha = 0.5;
  rect(ctx, 9 + ox, 5 + oy, 6, 2, eye);
  ctx.globalAlpha = 1;

  // 颈
  rect(ctx, 10 + ox, 11 + oy, 4, 1, robe);

  // 法杖（前手）
  const handX = 18 + ox;
  const handY = 16 + oy;
  rect(ctx, handX, handY, 1, 14, robeMid);
  rect(ctx, handX, handY + 13, 1, 1, PAL.gold);
  // 杖顶暗宝石
  rect(ctx, handX - 1, handY - 3, 3, 3, glow);
  rect(ctx, handX, handY - 2, 1, 1, PAL.white);
  ctx.globalAlpha = 0.6 + Math.sin(time * 4) * 0.2;
  rect(ctx, handX - 2, handY - 4, 5, 5, glow);
  ctx.globalAlpha = 1;

  // 阶段 2：暗影巨魔形态（外圈紫黑雾）
  if (phase2) {
    ctx.globalAlpha = 0.3 + Math.sin(time * 6) * 0.1;
    rect(ctx, 4 + ox, 2 + oy, 16, 32, robeLight);
    ctx.globalAlpha = 1;
    // 双红眼
    ctx.globalAlpha = 0.5;
    rect(ctx, 9 + ox, 5 + oy, 6, 2, PAL.blood);
    ctx.globalAlpha = 1;
    // 影触手（向下飘动）
    ctx.globalAlpha = 0.5;
    rect(ctx, 5 + ox, 30 + oy, 2, 4, shadow);
    rect(ctx, 17 + ox, 30 + oy, 2, 4, shadow);
    ctx.globalAlpha = 1;
  }

  // 阶段 2 浮空更高
  void phase2;
}

// ===== Boss 死亡姿态：坍塌 =====
function drawDeadBoss(ctx: Ctx, b: Boss, t: number) {
  const settle = Math.min(1, b.deadTime / 0.6);
  const oy = (1 - settle) * 8;
  // 落地躯干
  rect(ctx, 4, 30 + oy, 16, 3, b.def.themeColor);
  rect(ctx, 4, 30 + oy, 16, 1, PAL.outline);
  // 头部
  rect(ctx, 2, 29 + oy, 4, 3, b.def.themeColor);
  rect(ctx, 2, 30 + oy, 4, 1, PAL.outline);
  // 散落的法器/剑
  thickLine(ctx, 18, 31 + oy, 23, 29 + oy, 1.5, PAL.bladeShadow);
  // 血泊
  ctx.globalAlpha = 0.5;
  rect(ctx, 2, 33, 20, 1, PAL.blood);
  ctx.globalAlpha = 1;
  // 灵魂光点上升
  if (b.deadTime > 0.4) {
    const spiritT = (b.deadTime - 0.4) * 1.5;
    for (let i = 0; i < 4; i++) {
      const sx = 8 + i * 3;
      const sy = 30 - (spiritT + i * 0.4) * 6;
      if (sy > 0) {
        ctx.globalAlpha = Math.max(0, 0.6 - spiritT * 0.2);
        rect(ctx, sx, sy, 1, 1, b.def.themeColor);
        ctx.globalAlpha = 1;
      }
    }
  }
}
