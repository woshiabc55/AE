import {
  MechaData,
  Particle,
  DamageNumber,
  ShieldEffect,
  CANVAS_W,
  CANVAS_H,
  GROUND_Y,
  PIXEL_SCALE,
} from './types';
import { getSpriteSet, getColorMap, drawPixelSprite } from './sprites';
import { getAttackHitbox, getMechaBody, getAnimFrameIndex } from './mecha';

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  gradient.addColorStop(0, '#0a0a1a');
  gradient.addColorStop(0.5, '#1a1a2e');
  gradient.addColorStop(1, '#0d0d1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawStars(ctx);

  drawBuildings(ctx, 0.3, '#0f0f22', 80, 200, 6);
  drawBuildings(ctx, 0.5, '#141428', 120, 160, 5);
  drawBuildings(ctx, 0.7, '#1a1a33', 160, 120, 4);

  ctx.fillStyle = '#222233';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

  ctx.fillStyle = '#2a2a44';
  for (let x = 0; x < CANVAS_W; x += 24) {
    ctx.fillRect(x, GROUND_Y, 12, 4);
  }

  ctx.fillStyle = '#333355';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 2);

  ctx.fillStyle = '#444466';
  for (let x = 0; x < CANVAS_W; x += 48) {
    ctx.fillRect(x, GROUND_Y + 2, 24, 1);
  }
}

let starPositions: { x: number; y: number; b: number }[] | null = null;

function drawStars(ctx: CanvasRenderingContext2D) {
  if (!starPositions) {
    starPositions = [];
    for (let i = 0; i < 60; i++) {
      starPositions.push({
        x: Math.random() * CANVAS_W,
        y: Math.random() * (GROUND_Y * 0.5),
        b: 0.3 + Math.random() * 0.7,
      });
    }
  }

  const time = Date.now() / 1000;
  for (const star of starPositions) {
    const flicker = 0.5 + 0.5 * Math.sin(time * 2 + star.x);
    const alpha = star.b * flicker;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 2, 2);
  }
}

function drawBuildings(
  ctx: CanvasRenderingContext2D,
  yFactor: number,
  color: string,
  minH: number,
  maxH: number,
  windowRows: number,
) {
  const baseY = GROUND_Y;
  const buildingWidths = [40, 60, 50, 70, 45, 55, 65, 35, 50, 60, 45, 55];
  let x = 0;
  let i = 0;

  ctx.fillStyle = color;
  while (x < CANVAS_W) {
    const w = buildingWidths[i % buildingWidths.length];
    const h = minH + ((maxH - minH) * ((i * 7 + 3) % 11)) / 11;
    const buildingY = baseY - h;

    ctx.fillRect(x, buildingY, w - 4, h);

    ctx.fillStyle = '#ffffff08';
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < Math.floor(w / 10) - 1; col++) {
        if ((row * 7 + col * 3 + i) % 3 !== 0) {
          ctx.fillRect(x + 6 + col * 10, buildingY + 8 + row * 14, 4, 6);
        }
      }
    }

    ctx.fillStyle = color;
    x += w;
    i++;
  }
}

function drawMecha(
  ctx: CanvasRenderingContext2D,
  mecha: MechaData,
) {
  const spriteSet = getSpriteSet(mecha.id);
  const colorMap = getColorMap(mecha.id);
  const frameIdx = getAnimFrameIndex(mecha);

  let frames: number[][][];
  switch (mecha.state) {
    case 'IDLE': frames = spriteSet.idle; break;
    case 'WALK': frames = spriteSet.walk; break;
    case 'ATTACK': frames = spriteSet.attack; break;
    case 'DEFEND': frames = spriteSet.defend; break;
    case 'HURT': frames = spriteSet.hurt; break;
    case 'DEAD': frames = spriteSet.dead; break;
    default: frames = spriteSet.idle;
  }

  const frame = frames[Math.min(frameIdx, frames.length - 1)];
  const flipX = mecha.facing === -1;
  const flash = mecha.hurtFlash > 0 && mecha.hurtFlash % 4 < 2;

  drawPixelSprite(ctx, frame, colorMap, mecha.x, mecha.y, PIXEL_SCALE, flipX, flash);

  if (mecha.state === 'ATTACK') {
    const hitbox = getAttackHitbox(mecha);
    if (hitbox) {
      ctx.fillStyle = 'rgba(255, 255, 100, 0.15)';
      ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    }
  }
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  p1: MechaData,
  p2: MechaData,
  timer: number,
) {
  const barW = 300;
  const barH = 20;
  const barY = 20;
  const energyH = 8;

  ctx.fillStyle = '#111122';
  ctx.fillRect(0, 0, CANVAS_W, 60);
  ctx.fillStyle = '#333355';
  ctx.fillRect(0, 59, CANVAS_W, 1);

  drawHealthBar(ctx, 30, barY, barW, barH, p1.hp, p1.maxHp, '#ff2244', '#881122', false);
  drawHealthBar(ctx, CANVAS_W - 30 - barW, barY, barW, barH, p2.hp, p2.maxHp, '#2266ff', '#112288', true);

  drawEnergyBar(ctx, 30, barY + barH + 4, barW, energyH, p1.energy, p1.maxEnergy, false);
  drawEnergyBar(ctx, CANVAS_W - 30 - barW, barY + barH + 4, barW, energyH, p2.energy, p2.maxEnergy, true);

  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.ceil(timer)), CANVAS_W / 2, barY + 22);

  ctx.fillStyle = '#ff2244';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('P1', 30, barY - 2);

  ctx.fillStyle = '#2266ff';
  ctx.textAlign = 'right';
  ctx.fillText('P2', CANVAS_W - 30, barY - 2);
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  hp: number,
  maxHp: number,
  color: string,
  bgColor: string,
  reverse: boolean,
) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);

  const ratio = Math.max(0, hp / maxHp);
  const fillW = w * ratio;

  if (reverse) {
    ctx.fillStyle = color;
    ctx.fillRect(x + w - fillW, y, fillW, h);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, fillW, h);
  }

  ctx.strokeStyle = '#666688';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);

  for (let i = 1; i < 10; i++) {
    const tickX = x + (w * i) / 10;
    ctx.fillStyle = '#00000044';
    ctx.fillRect(tickX, y, 1, h);
  }
}

function drawEnergyBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  energy: number,
  maxEnergy: number,
  reverse: boolean,
) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, w, h);

  const ratio = Math.max(0, energy / maxEnergy);
  const fillW = w * ratio;

  if (reverse) {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(x + w - fillW, y, fillW, h);
  } else {
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(x, y, fillW, h);
  }

  ctx.strokeStyle = '#555544';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawDamageNumbers(ctx: CanvasRenderingContext2D, numbers: DamageNumber[]) {
  for (const n of numbers) {
    const alpha = Math.min(1, n.timer / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`-${n.value}`, n.x, n.y);
  }
  ctx.globalAlpha = 1;
}

function drawShieldEffects(ctx: CanvasRenderingContext2D, effects: ShieldEffect[]) {
  for (const e of effects) {
    const alpha = e.timer / 8 * 0.5;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#44ff44';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const cx = e.x + (e.facing === 1 ? 40 : -5);
    const cy = e.y + 24;
    ctx.arc(cx, cy, 28, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawTitle(ctx: CanvasRenderingContext2D, frame: number) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawStars(ctx);

  ctx.fillStyle = '#222233';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

  const flash = Math.floor(frame / 30) % 2 === 0;
  ctx.fillStyle = flash ? '#ffcc00' : '#ff8800';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MECHA BATTLE', CANVAS_W / 2, 160);

  ctx.fillStyle = '#888899';
  ctx.font = '14px monospace';
  ctx.fillText('PIXEL MECHA FIGHTING GAME', CANVAS_W / 2, 200);

  drawControlsPanel(ctx, 140, 240, 'PLAYER 1', '#ff2244', ['W/A/S/D - MOVE', 'F - ATTACK', 'G - DEFEND']);
  drawControlsPanel(ctx, CANVAS_W - 340, 240, 'PLAYER 2', '#2266ff', ['ARROWS - MOVE', 'J - ATTACK', 'K - DEFEND']);

  const blink = Math.floor(frame / 20) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#44ff44';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS ENTER TO START', CANVAS_W / 2, 460);
  }
}

function drawControlsPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  title: string,
  color: string,
  controls: string[],
) {
  ctx.fillStyle = '#111122';
  ctx.fillRect(x, y, 200, 140);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 200, 140);

  ctx.fillStyle = color;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + 100, y + 24);

  ctx.fillStyle = '#ccccdd';
  ctx.font = '11px monospace';
  for (let i = 0; i < controls.length; i++) {
    ctx.fillText(controls[i], x + 100, y + 52 + i * 22);
  }
}

function drawResult(
  ctx: CanvasRenderingContext2D,
  winner: 1 | 2 | 'draw',
  frame: number,
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const flash = Math.floor(frame / 15) % 2 === 0;

  if (winner === 'draw') {
    ctx.fillStyle = flash ? '#ffcc00' : '#ff8800';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DRAW!', CANVAS_W / 2, 220);
  } else {
    const color = winner === 1 ? '#ff2244' : '#2266ff';
    ctx.fillStyle = flash ? color : '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`PLAYER ${winner} WINS!`, CANVAS_W / 2, 220);
  }

  const blink = Math.floor(frame / 20) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#44ff44';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS ENTER TO RESTART', CANVAS_W / 2, 320);
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  phase: 'title' | 'battle' | 'result',
  p1: MechaData | null,
  p2: MechaData | null,
  timer: number,
  particles: Particle[],
  damageNumbers: DamageNumber[],
  shieldEffects: ShieldEffect[],
  screenShake: number,
  frame: number,
  winner: 1 | 2 | 'draw' | null,
) {
  ctx.save();

  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake * 2;
    const shakeY = (Math.random() - 0.5) * screenShake * 2;
    ctx.translate(shakeX, shakeY);
  }

  if (phase === 'title') {
    drawTitle(ctx, frame);
  } else if (phase === 'battle' && p1 && p2) {
    drawBackground(ctx);
    drawShieldEffects(ctx, shieldEffects);
    drawMecha(ctx, p1);
    drawMecha(ctx, p2);
    drawParticles(ctx, particles);
    drawDamageNumbers(ctx, damageNumbers);
    drawHUD(ctx, p1, p2, timer);
  } else if (phase === 'result' && p1 && p2) {
    drawBackground(ctx);
    drawMecha(ctx, p1);
    drawMecha(ctx, p2);
    drawHUD(ctx, p1, p2, 0);
    drawResult(ctx, winner!, frame);
  }

  ctx.restore();
}
