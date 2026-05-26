import { PIXEL_SCALE, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y, MECHA_W } from './constants';

type Palette = {
  head: string;
  eye: string;
  body: string;
  bodyDark: string;
  arm: string;
  armDark: string;
  leg: string;
  legDark: string;
  accent: string;
  shield: string;
  fist: string;
};

export const P1_PALETTE: Palette = {
  head: '#CC2222',
  eye: '#FFDD00',
  body: '#DD3333',
  bodyDark: '#991111',
  arm: '#CC2222',
  armDark: '#881111',
  leg: '#AA2222',
  legDark: '#771111',
  accent: '#FF6644',
  shield: '#FF886644',
  fist: '#FFAA44',
};

export const P2_PALETTE: Palette = {
  head: '#2244CC',
  eye: '#00FFDD',
  body: '#3355DD',
  bodyDark: '#112299',
  arm: '#2244CC',
  armDark: '#112288',
  leg: '#2233AA',
  legDark: '#111177',
  accent: '#44AAFF',
  shield: '#4488FF44',
  fist: '#44DDFF',
};

const S = PIXEL_SCALE;

type DrawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => void;

const rect: DrawRect = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * S, h * S);
};

export function drawMecha(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  palette: Palette,
  state: string,
  frame: number,
  facingRight: boolean,
  hurtFlash: boolean,
) {
  ctx.save();

  const drawX = cx - MECHA_W / 2;
  const drawY = cy - 108;
  const baseX = drawX;
  const baseY = drawY;

  if (!facingRight) {
    ctx.translate(cx, 0);
    ctx.scale(-1, 1);
    ctx.translate(-cx, 0);
  }

  if (hurtFlash && Math.floor(frame / 2) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  const idleBob = state === 'idle' ? Math.sin(frame * 0.15) * 1.5 : 0;
  const by = baseY + idleBob;

  rect(ctx, baseX + 5 * S, by + 28 * S, 5, 8 + (state === 'move' ? Math.sin(frame * 0.4) * 3 : 0), palette.leg);
  rect(ctx, baseX + 5 * S, by + 28 * S, 5, 2, palette.legDark);
  rect(ctx, baseX + 15 * S, by + 28 * S, 5, 8 + (state === 'move' ? -Math.sin(frame * 0.4) * 3 : 0), palette.leg);
  rect(ctx, baseX + 15 * S, by + 28 * S, 5, 2, palette.legDark);

  const legTuck = state === 'jump' ? -2 : 0;
  if (legTuck !== 0) {
    rect(ctx, baseX + 5 * S, by + (28 + legTuck) * S, 5, 8, palette.leg);
    rect(ctx, baseX + 15 * S, by + (28 + legTuck) * S, 5, 8, palette.leg);
  }

  rect(ctx, baseX + 4 * S, by + 35 * S, 6, 2, palette.legDark);
  rect(ctx, baseX + 15 * S, by + 35 * S, 6, 2, palette.legDark);

  rect(ctx, baseX + 4 * S, by + 12 * S, 17, 16, palette.body);
  rect(ctx, baseX + 4 * S, by + 12 * S, 17, 2, palette.bodyDark);
  rect(ctx, baseX + 6 * S, by + 14 * S, 4, 4, palette.accent);
  rect(ctx, baseX + 15 * S, by + 14 * S, 4, 4, palette.accent);
  rect(ctx, baseX + 10 * S, by + 20 * S, 5, 3, palette.bodyDark);

  rect(ctx, baseX + 5 * S, by + 2 * S, 15, 10, palette.head);
  rect(ctx, baseX + 5 * S, by + 2 * S, 15, 2, palette.bodyDark);
  rect(ctx, baseX + 7 * S, by + 5 * S, 3, 3, palette.eye);
  rect(ctx, baseX + 15 * S, by + 5 * S, 3, 3, palette.eye);
  rect(ctx, baseX + 11 * S, by + 0 * S, 3, 3, palette.accent);

  if (state === 'attack') {
    const attackProgress = frame / 20;
    const extend = attackProgress < 0.3 ? attackProgress / 0.3 : attackProgress < 0.6 ? 1 : 1 - (attackProgress - 0.6) / 0.4;
    rect(ctx, baseX + 1 * S, by + 14 * S, 4, 8, palette.arm);
    rect(ctx, baseX + 1 * S, by + 14 * S, 4, 2, palette.armDark);
    const punchLen = Math.floor(extend * 10);
    rect(ctx, baseX + 20 * S, by + 14 * S, 4 + punchLen, 3, palette.arm);
    rect(ctx, baseX + 20 * S, by + 17 * S, 4 + punchLen, 3, palette.arm);
    if (punchLen > 2) {
      rect(ctx, baseX + (22 + punchLen) * S, by + 13 * S, 4, 6, palette.fist);
    }
  } else if (state === 'defend') {
    rect(ctx, baseX + 1 * S, by + 14 * S, 4, 8, palette.arm);
    rect(ctx, baseX + 20 * S, by + 10 * S, 6, 18, palette.arm);
    ctx.fillStyle = palette.shield;
    ctx.fillRect(baseX + 24 * S, by + 8 * S, 4 * S, 22 * S);
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(baseX + 24 * S, by + 8 * S, 4 * S, 22 * S);
  } else {
    const armSwing = state === 'move' ? Math.sin(frame * 0.4) * 2 : 0;
    rect(ctx, baseX + 1 * S, by + (14 + armSwing) * S, 4, 8, palette.arm);
    rect(ctx, baseX + 1 * S, by + (14 + armSwing) * S, 4, 2, palette.armDark);
    rect(ctx, baseX + 20 * S, by + (14 - armSwing) * S, 4, 8, palette.arm);
    rect(ctx, baseX + 20 * S, by + (14 - armSwing) * S, 4, 2, palette.armDark);
  }

  if (state === 'hurt') {
    ctx.globalAlpha = 0.6;
    rect(ctx, baseX + 6 * S, by + 14 * S, 4, 4, '#FFFFFF');
    rect(ctx, baseX + 14 * S, by + 14 * S, 4, 4, '#FFFFFF');
  }

  ctx.restore();
}

export function drawBackground(ctx: CanvasRenderingContext2D, frame: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, '#0a0a1a');
  grad.addColorStop(0.5, '#1a1030');
  grad.addColorStop(1, '#2d1b4e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = '#FFFFFF';
  const starSeed = [23, 67, 120, 180, 250, 340, 410, 500, 580, 650, 720, 800, 870, 930, 45, 155, 290, 390, 530, 670];
  for (let i = 0; i < starSeed.length; i++) {
    const sx = starSeed[i];
    const sy = (sx * 7 + i * 31) % 300;
    const brightness = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.02 + i));
    ctx.globalAlpha = brightness;
    const size = (i % 3 === 0) ? 2 : 1;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#0d0d20';
  const buildings = [
    { x: 0, w: 60, h: 180 },
    { x: 55, w: 40, h: 140 },
    { x: 90, w: 70, h: 200 },
    { x: 155, w: 50, h: 160 },
    { x: 200, w: 80, h: 220 },
    { x: 275, w: 45, h: 150 },
    { x: 315, w: 60, h: 190 },
    { x: 370, w: 55, h: 170 },
    { x: 420, w: 70, h: 210 },
    { x: 485, w: 50, h: 155 },
    { x: 530, w: 65, h: 185 },
    { x: 590, w: 45, h: 145 },
    { x: 630, w: 75, h: 205 },
    { x: 700, w: 55, h: 165 },
    { x: 750, w: 60, h: 195 },
    { x: 805, w: 50, h: 150 },
    { x: 850, w: 70, h: 215 },
    { x: 915, w: 50, h: 175 },
  ];
  for (const b of buildings) {
    ctx.fillRect(b.x, GROUND_Y - b.h, b.w, b.h);
    ctx.fillStyle = '#1a1a35';
    for (let wy = GROUND_Y - b.h + 15; wy < GROUND_Y - 20; wy += 20) {
      for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 15) {
        if (Math.sin(wx * 3 + wy * 7) > 0) {
          ctx.fillStyle = (Math.sin(frame * 0.01 + wx + wy) > 0.3) ? '#332200' : '#1a1a35';
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }
    ctx.fillStyle = '#0d0d20';
  }

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  ctx.fillStyle = '#3a3a5e';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 3);

  ctx.fillStyle = '#252540';
  for (let gx = 0; gx < CANVAS_WIDTH; gx += 30) {
    if ((gx / 30) % 3 === 0) {
      ctx.fillRect(gx, GROUND_Y + 8, 15, 2);
    }
  }

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let sy = 0; sy < CANVAS_HEIGHT; sy += 3) {
    ctx.fillRect(0, sy, CANVAS_WIDTH, 1);
  }
}

export function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  ctx.save();
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}

export { type Palette };
