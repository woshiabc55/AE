import type { Meme } from '../data/memes';

export interface DrawCtx {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  style: string;
  subtitles: boolean;
  watermark: boolean;
}

let noiseCanvas: HTMLCanvasElement | null = null;
export function regenNoise() {
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 256;
  noiseCanvas.height = 256;
  const nctx = noiseCanvas.getContext('2d')!;
  const img = nctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 32;
  }
  nctx.putImageData(img, 0, 0);
}
regenNoise();

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function wrapText(c: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = '';
  for (const ch of chars) {
    const t = line + ch;
    if (c.measureText(t).width > maxW && line) { lines.push(line); line = ch; }
    else line = t;
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => c.fillText(l, x, y + i * lineH));
  return lines.length;
}

function fontBig(size: number, w: string = '900') { return `${w} ${size}px "Bungee", "Big Shoulders Display", "Noto Sans SC", sans-serif`; }
function fontBody(size: number, w: string = '700') { return `${w} ${size}px "Space Grotesk", "Noto Sans SC", sans-serif`; }
function fontMono(size: number, w: string = '700') { return `${w} ${size}px "JetBrains Mono", "Noto Sans SC", monospace`; }

function drawBackground(c: DrawCtx, card: Meme) {
  const { ctx, width: W, height: H } = c;
  ctx.fillStyle = card.bg;
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, card.bg);
  grad.addColorStop(1, card.fg + '22');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.05)';
  ctx.lineWidth = 1;
  const gs = 80;
  for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    noiseCanvas && ctx.drawImage(noiseCanvas, x, y, 200, 200);
  }
  ctx.globalAlpha = 1;
  if (card.anim !== 'rain') {
    ctx.fillStyle = card.fg + '11';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawCornerBadge(c: DrawCtx, card: Meme) {
  const { ctx } = c;
  const x = 40, y = 40, w = 300, h = 64;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = card.fg;
  roundRect(ctx, 0, 0, w, h, 8); ctx.fill();
  ctx.fillStyle = card.bg;
  ctx.font = fontMono(20);
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${card.category}`, 16, 32);
  ctx.font = fontMono(14);
  ctx.textAlign = 'right';
  ctx.fillText(`ID ${String(card.id).padStart(4, '0')}`, w - 16, 32);
  ctx.restore();
}

function drawRank(c: DrawCtx, card: Meme) {
  const { ctx, width: W } = c;
  ctx.save();
  ctx.font = fontBig(60);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = card.fg + '22';
  ctx.fillText(String(card.id + 1).padStart(4, '0'), W - 50, 30);
  ctx.restore();
}

function drawTitle(c: DrawCtx, card: Meme, progress01: number) {
  const { ctx, width: W, height: H, style, subtitles } = c;
  const cx = W / 2;
  let offY = 0, sc = 1, op = 1;
  const enter = Math.min(1, progress01 * 3);
  if (card.anim === 'stamp') { sc = 0.5 + 0.5 * enter; offY = (1 - enter) * 60; }
  if (card.anim === 'flip') { const a = enter * Math.PI; sc = Math.abs(Math.cos(a)); offY = 0; }
  if (card.anim === 'glitch') { offY = Math.sin(progress01 * 40) * 8; }
  if (card.anim === 'shake') { offY = (Math.random() - 0.5) * 8 * (1 - enter); }
  if (card.anim === 'zoom') { sc = 0.7 + 0.3 * enter; }
  if (card.anim === 'bounce') { sc = 1 + Math.sin(enter * Math.PI) * 0.12; }
  if (card.anim === 'rain') { offY = (1 - enter) * -H; }
  if (card.anim === 'split') { sc = enter; }
  if (card.anim === 'typewriter') { op = enter; }
  ctx.save();
  ctx.translate(cx, H * 0.42 + offY);
  ctx.scale(sc, sc);
  ctx.globalAlpha = op;
  ctx.font = fontBig(120);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (card.anim === 'glitch' || style === 'neon') {
    ctx.fillStyle = '#FF2E93';
    ctx.fillText(card.title, -4, 0);
    ctx.fillStyle = '#00E0FF';
    ctx.fillText(card.title, 4, 0);
  }
  ctx.fillStyle = card.fg;
  wrapText(ctx, card.title, 0, 0, W * 0.78, 130);
  if (card.subtitle) {
    ctx.font = fontBody(36, '700');
    ctx.fillStyle = card.fg + 'cc';
    wrapText(ctx, card.subtitle, 0, 130 + (card.title.length > 8 ? 40 : 0), W * 0.7, 50);
  }
  if (subtitles) {
    ctx.font = fontMono(22);
    ctx.fillStyle = card.fg + 'aa';
    const tagStr = card.tags.slice(0, 6).map(t => '#' + t).join('  ');
    wrapText(ctx, tagStr, 0, 250 + (card.title.length > 8 ? 40 : 0), W * 0.8, 32);
  }
  ctx.restore();
}

function drawEmoji(c: DrawCtx, card: Meme, progress01: number) {
  const { ctx, width: W, height: H, style } = c;
  const enter = Math.min(1, progress01 * 2);
  const size = style === 'magazine' ? 280 : 360;
  const x = style === 'magazine' ? W * 0.78 : W * 0.18;
  const y = H * 0.78;
  ctx.save();
  ctx.translate(x, y);
  const rot = card.anim === 'shake' ? (Math.random() - 0.5) * 0.2 : Math.sin(progress01 * Math.PI) * 0.1;
  ctx.rotate(rot);
  ctx.scale(enter, enter);
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.emoji, 0, 0);
  ctx.globalAlpha = 0.2;
  ctx.fillText(card.emoji, 8, 0);
  ctx.restore();
}

function drawProgressBar(c: DrawCtx, progress01: number, global01: number) {
  const { ctx, width: W, height: H } = c;
  const barH = 10;
  const y = H - barH - 30;
  ctx.fillStyle = 'rgba(255,255,255,.1)';
  ctx.fillRect(60, y, W - 120, barH);
  const grad = ctx.createLinearGradient(60, 0, W - 60, 0);
  grad.addColorStop(0, '#00E0FF');
  grad.addColorStop(0.5, '#F5FF00');
  grad.addColorStop(1, '#FF2E93');
  ctx.fillStyle = grad;
  ctx.fillRect(60, y, (W - 120) * global01, barH);
  ctx.fillStyle = '#fff';
  ctx.fillRect(60, y, (W - 120) * progress01, 2);
}

function drawWatermark(c: DrawCtx) {
  if (!c.watermark) return;
  const { ctx, width: W, height: H } = c;
  ctx.save();
  ctx.font = fontMono(20);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.fillText('2025 热梗大爆炸 · React AutoCut', W - 40, H - 8);
  ctx.restore();
}

const particles: { x: number; y: number; vy: number; vx: number; rot: number; vr: number; size: number; ch: string; life: number; max: number }[] = [];
function spawnParticle(card: Meme, width: number) {
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: Math.random() * width,
      y: -40,
      vy: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.1,
      size: 32 + Math.random() * 48,
      ch: card.emoji,
      life: 0,
      max: 200 + Math.random() * 200,
    });
  }
}
function drawParticles(c: DrawCtx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    c.ctx.save();
    c.ctx.translate(p.x, p.y);
    c.ctx.rotate(p.rot);
    c.ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
    c.ctx.font = `${p.size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    c.ctx.textAlign = 'center'; c.ctx.textBaseline = 'middle';
    c.ctx.fillText(p.ch, 0, 0);
    c.ctx.restore();
    if (p.life >= p.max) particles.splice(i, 1);
  }
}
export function clearParticles() { particles.length = 0; }

export function drawFrame(d: DrawCtx, card: Meme, progress01: number, global01: number, withParticles: boolean) {
  const { ctx, width: W } = d;
  ctx.save();
  let fade = 1;
  if (progress01 > 0.85) fade = 1 - ((progress01 - 0.85) / 0.15) * 0.2;
  ctx.globalAlpha = fade;
  drawBackground(d, card);
  drawCornerBadge(d, card);
  drawRank(d, card);
  drawTitle(d, card, progress01);
  drawEmoji(d, card, progress01);
  if (withParticles) { spawnParticle(card, d.width); drawParticles(d); }
  drawProgressBar(d, progress01, global01);
  drawWatermark(d);
  ctx.font = fontMono(18);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.textAlign = 'left';
  ctx.fillText(`#${card.category} · ${card.title.slice(0, 14)}`, 40, 22);
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toISOString().slice(11, 19), W - 40, 22);
  ctx.restore();
}
