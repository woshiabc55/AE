import type { GameState, Mecha, Particle, FloatingText, SlashTrail, Projectile } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  COLORS,
} from './constants';
import {
  getMechaTypeColor,
  getMechaTypeDarkColor,
  getMechaTypeAccentColor,
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

  // 腿部跑动动画
  const runFrame = Math.floor(frameCount / 5) % 2;
  const legOffset = mecha.state === 'run' ? (runFrame === 0 ? 0 : 6) : 0;
  drawPixelRect(ctx, x + 8, y + 48, 12, 16, darkColor);
  drawPixelRect(ctx, x + 28, y + 48 - legOffset, 12, 16, darkColor);

  // 躯干
  drawPixelRect(ctx, x + 4, y + 20, 40, 32, color);

  // 胸甲高光
  drawPixelRect(ctx, x + 10, y + 26, 28, 8, accentColor);

  // 头部
  drawPixelRect(ctx, x + 12, y + 4, 24, 20, color);
  drawPixelRect(ctx, x + 16, y + 10, 16, 6, '#111111');

  // 眼睛
  const eyeColor = mecha.state === 'ko' ? '#333333' : '#FFFFFF';
  drawPixelRect(ctx, x + (f === 1 ? 24 : 8), y + 12, 8, 4, eyeColor);

  // 手臂 / 武器
  const armX = f === 1 ? x + 36 : x - 8;
  drawPixelRect(ctx, armX, y + 28, 16, 8, darkColor);

  // 冲刺残影
  if (mecha.state === 'dash') {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.35;
    for (let i = 1; i <= 3; i++) {
      const ghostX = x - f * i * 18;
      ctx.fillRect(ghostX, y, MECHA_WIDTH, MECHA_HEIGHT);
    }
    ctx.globalAlpha = 1;
  }

  // 攻击 / 技能拖尾
  if (mecha.state === 'attack' || mecha.state === 'skill' || mecha.state === 'throw') {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    const slashX = f === 1 ? x + MECHA_WIDTH : x - 48;
    ctx.fillRect(slashX, y + 16, 48, 32);
    ctx.globalAlpha = 1;
  }

  // 防御护盾
  if (mecha.state === 'defend') {
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.25 + Math.sin(mecha.defendFlash * 0.8) * 0.1;
    const shieldX = f === 1 ? x + MECHA_WIDTH - 4 : x - 8;
    ctx.fillRect(shieldX, y + 8, 12, 48);
    ctx.globalAlpha = 1;
  }

  // 反击架势
  if (mecha.state === 'counter') {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6 + Math.sin(frameCount * 0.5) * 0.3;
    ctx.strokeRect(x - 6, y - 6, MECHA_WIDTH + 12, MECHA_HEIGHT + 12);
    ctx.globalAlpha = 1;
  }

  // 受击 / KO 闪烁
  if (mecha.state === 'hurt' || mecha.state === 'ko') {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, MECHA_WIDTH, MECHA_HEIGHT);
    ctx.globalAlpha = 1;
  }
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

  drawMechaBody(ctx, mecha, color, darkColor, accentColor, frameCount);
}

export function drawSlashTrails(
  ctx: CanvasRenderingContext2D,
  slashes: SlashTrail[],
): void {
  slashes.forEach((s) => {
    const alpha = s.life / s.maxLife;
    ctx.fillStyle = s.color;
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
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 尾焰
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(
      Math.floor(p.x - (p.vx > 0 ? 18 : -18)),
      Math.floor(p.y - 3),
      18,
      6,
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
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
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
    const scale = 1 + progress * 0.25;
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
