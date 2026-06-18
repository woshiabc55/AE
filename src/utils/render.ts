import type {
  GameState,
  Mecha,
  Particle,
  FloatingText,
  SlashTrail,
  Projectile,
} from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  COLORS,
  ELEMENT_CONFIG,
} from './constants';
import {
  getMechaTypeColor,
  getMechaTypeDarkColor,
  getMechaTypeAccentColor,
  getElementColor,
} from './skills';

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 星空
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 60; i++) {
    const x = (i * 137) % CANVAS_WIDTH;
    const y = (i * 73) % (GROUND_Y - 40);
    const size = (i % 3) + 1;
    ctx.fillRect(x, y, size, size);
  }

  // 远景建筑
  ctx.fillStyle = '#12141F';
  for (let i = 0; i < 12; i++) {
    const w = 60 + (i % 4) * 30;
    const h = 80 + (i % 5) * 40;
    const x = i * 90;
    ctx.fillRect(x, GROUND_Y - h, w, h);
  }

  // 地面
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  ctx.fillStyle = COLORS.groundLine;
  for (let x = 0; x < CANVAS_WIDTH; x += 40) {
    ctx.fillRect(x, GROUND_Y, 2, CANVAS_HEIGHT - GROUND_Y);
  }
  for (let y = GROUND_Y; y < CANVAS_HEIGHT; y += 40) {
    ctx.fillRect(0, y, CANVAS_WIDTH, 2);
  }

  ctx.fillStyle = COLORS.blue;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(0, GROUND_Y - 2, CANVAS_WIDTH, 4);
  ctx.globalAlpha = 1;
}

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawElementalAura(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  frameCount: number,
): void {
  const cfg = ELEMENT_CONFIG[mecha.element];
  const centerX = mecha.x + MECHA_WIDTH / 2;
  const centerY = mecha.y + MECHA_HEIGHT / 2;

  ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.15) * 0.08;
  ctx.fillStyle = cfg.auraColor;
  ctx.fillRect(mecha.x - 6, mecha.y - 6, MECHA_WIDTH + 12, MECHA_HEIGHT + 12);

  if (mecha.element === 'fire') {
    // 火焰余烬
    ctx.fillStyle = cfg.secondary;
    for (let i = 0; i < 3; i++) {
      const ox = (Math.sin(frameCount * 0.2 + i * 2) * 14);
      const oy = -Math.abs(Math.cos(frameCount * 0.15 + i)) * 18 - 10;
      ctx.fillRect(centerX + ox, centerY + oy, 3, 4);
    }
  } else {
    // 电光
    ctx.strokeStyle = cfg.bright;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
      const sx = centerX + (i === 0 ? -22 : 22);
      const sy = centerY - 20 + Math.sin(frameCount * 0.4 + i * 3) * 10;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 20);
      ctx.lineTo(sx + (Math.random() - 0.5) * 16, sy + (Math.random() - 0.5) * 30);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function drawMechaBody(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  color: string,
  darkColor: string,
  accentColor: string,
  frameCount: number,
): void {
  const x = Math.floor(mecha.x);
  const y = Math.floor(mecha.y);
  const f = mecha.facing;

  // 待机呼吸 / 受击后仰偏移
  let bodyOffsetX = 0;
  let bodyOffsetY = 0;
  let bodyTilt = 0;

  if (mecha.state === 'idle') {
    bodyOffsetY = Math.sin(frameCount * 0.12) * 1.5;
  } else if (mecha.state === 'hurt' || mecha.state === 'ko') {
    bodyOffsetX = -f * 6;
    bodyTilt = -f * 0.15;
  }

  ctx.save();
  ctx.translate(x + MECHA_WIDTH / 2, y + MECHA_HEIGHT / 2 + bodyOffsetY);
  ctx.rotate(bodyTilt);
  ctx.translate(-(x + MECHA_WIDTH / 2), -(y + MECHA_HEIGHT / 2));

  const bx = x + bodyOffsetX;
  const by = y + bodyOffsetY;

  // 腿部动画
  let leftLegH = 16;
  let rightLegH = 16;
  let leftLegY = by + 48;
  let rightLegY = by + 48;

  if (mecha.state === 'run') {
    const runFrame = Math.floor(frameCount / 4) % 2;
    if (runFrame === 0) {
      leftLegH = 12;
      rightLegY = by + 44;
    } else {
      rightLegH = 12;
      leftLegY = by + 44;
    }
  } else if (mecha.state === 'jump') {
    leftLegY = by + 52;
    rightLegY = by + 52;
    leftLegH = 10;
    rightLegH = 10;
  } else if (mecha.state === 'hurt' || mecha.state === 'ko') {
    leftLegY = by + 54;
    rightLegY = by + 50;
  }

  drawPixelRect(ctx, bx + 8, leftLegY, 12, leftLegH, darkColor);
  drawPixelRect(ctx, bx + 28, rightLegY, 12, rightLegH, darkColor);

  // 躯干
  drawPixelRect(ctx, bx + 4, by + 20, 40, 32, color);

  // 胸甲高光
  drawPixelRect(ctx, bx + 10, by + 26, 28, 8, accentColor);

  // 头部
  drawPixelRect(ctx, bx + 12, by + 4, 24, 20, color);
  drawPixelRect(ctx, bx + 16, by + 10, 16, 6, '#111111');

  // 眼睛
  const eyeColor = mecha.state === 'ko' ? '#333333' : '#FFFFFF';
  drawPixelRect(ctx, bx + (f === 1 ? 24 : 8), by + 12, 8, 4, eyeColor);

  // 手臂动画
  let armX = f === 1 ? bx + 36 : bx - 8;
  let armY = by + 28;

  if (mecha.state === 'run') {
    armY = by + 24 + Math.sin(frameCount * 0.3) * 4;
  } else if (mecha.state === 'jump') {
    armY = by + 18;
    armX = f === 1 ? bx + 34 : bx - 6;
  } else if (mecha.state === 'attack' || mecha.state === 'skill') {
    armX = f === 1 ? bx + 42 : bx - 14;
  } else if (mecha.state === 'throw') {
    armX = f === 1 ? bx + 40 : bx - 12;
    armY = by + 22;
  }

  drawPixelRect(ctx, armX, armY, 16, 8, darkColor);

  // 攻击 / 技能拖尾
  if (mecha.state === 'attack' || mecha.state === 'skill' || mecha.state === 'throw') {
    const gradient = ctx.createLinearGradient(
      f === 1 ? bx + MECHA_WIDTH : bx,
      by + 16,
      f === 1 ? bx + MECHA_WIDTH + 48 : bx - 48,
      by + 48,
    );
    gradient.addColorStop(0, getElementColor(mecha.element));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;
    const slashX = f === 1 ? bx + MECHA_WIDTH : bx - 48;
    ctx.fillRect(slashX, by + 16, 48, 32);
    ctx.globalAlpha = 1;
  }

  // 防御护盾
  if (mecha.state === 'defend') {
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.25 + Math.sin(mecha.defendFlash * 0.8) * 0.1;
    const shieldX = f === 1 ? bx + MECHA_WIDTH - 4 : bx - 8;
    ctx.fillRect(shieldX, by + 8, 12, 48);
    ctx.globalAlpha = 1;
  }

  // 反击架势
  if (mecha.state === 'counter') {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6 + Math.sin(frameCount * 0.5) * 0.3;
    ctx.strokeRect(bx - 6, by - 6, MECHA_WIDTH + 12, MECHA_HEIGHT + 12);
    ctx.globalAlpha = 1;
  }

  // 受击 / KO 闪烁
  if (mecha.state === 'hurt' || mecha.state === 'ko') {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx, by, MECHA_WIDTH, MECHA_HEIGHT);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

export function drawMecha(
  ctx: CanvasRenderingContext2D,
  mecha: Mecha,
  frameCount: number,
): void {
  const color = getMechaTypeColor(mecha.type);
  const darkColor = getMechaTypeDarkColor(mecha.type);
  const accentColor = getMechaTypeAccentColor(mecha.type);

  // 影子
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(mecha.x + 4, GROUND_Y - 4, MECHA_WIDTH - 8, 4);

  // 冲刺残影
  if (mecha.state === 'dash') {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    for (let i = 1; i <= 4; i++) {
      const ghostX = mecha.x - mecha.facing * i * 16;
      ctx.fillRect(ghostX, mecha.y, MECHA_WIDTH, MECHA_HEIGHT);
    }
    ctx.globalAlpha = 1;
  }

  // 元素光晕
  if (mecha.state !== 'ko') {
    drawElementalAura(ctx, mecha, frameCount);
  }

  drawMechaBody(ctx, mecha, color, darkColor, accentColor, frameCount);
}

export function drawSlashTrails(
  ctx: CanvasRenderingContext2D,
  slashes: SlashTrail[],
): void {
  slashes.forEach((s) => {
    const alpha = s.life / s.maxLife;
    const gradient = ctx.createLinearGradient(
      s.facing === 1 ? s.x : s.x + s.width,
      s.y,
      s.facing === 1 ? s.x + s.width : s.x,
      s.y,
    );
    gradient.addColorStop(0, s.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.width, s.height);
  });
  ctx.globalAlpha = 1;
}

export function drawProjectiles(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[],
): void {
  projectiles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 核心亮点
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 尾焰
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(
      Math.floor(p.x - (p.vx > 0 ? 22 : -22)),
      Math.floor(p.y - 4),
      22,
      8,
    );
    ctx.globalAlpha = 1;
  });
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
): void {
  particles.forEach((p) => {
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

export function drawFloatingTexts(
  ctx: CanvasRenderingContext2D,
  texts: FloatingText[],
): void {
  ctx.font = 'bold 16px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  texts.forEach((t) => {
    const alpha = t.life / t.maxLife;
    ctx.fillStyle = t.color;
    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.translate(Math.floor(t.x), Math.floor(t.y));
    ctx.scale(t.scale, t.scale);
    ctx.fillText(t.text, 0, 0);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
): void {
  ctx.save();

  // 必杀特写缩放
  if (state.ultimateCinematic > 0) {
    const progress = 1 - state.ultimateCinematic / 40;
    const scale = 1 + progress * 0.3;
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.scale(scale, scale);
    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
  }

  // 屏幕震动
  if (state.shake > 0) {
    const dx = (Math.random() - 0.5) * state.shake;
    const dy = (Math.random() - 0.5) * state.shake;
    ctx.translate(dx, dy);
  }

  clearCanvas(ctx);
  drawBackground(ctx);

  drawProjectiles(ctx, state.projectiles);
  drawParticles(ctx, state.particles);
  drawSlashTrails(ctx, state.slashes);

  drawMecha(ctx, state.red, state.frameCount);
  drawMecha(ctx, state.blue, state.frameCount);

  drawFloatingTexts(ctx, state.texts);

  ctx.restore();

  // 屏幕闪光
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${state.flash / 12})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
