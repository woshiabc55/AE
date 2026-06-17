import type { Theme } from '@/themes/themes';

// 中心径向辉光
export class CenterGlow {
  draw(
    ctx: CanvasRenderingContext2D,
    theme: Theme,
    w: number,
    h: number,
    beat: number,
    rms: number,
    t: number,
    glow: number,
  ) {
    const cx = w / 2;
    const cy = h / 2;
    const baseR = Math.min(w, h) * 0.18;
    const r = baseR * (1 + beat * 0.6 + rms * 0.3) * (0.95 + Math.sin(t * 1.6) * 0.04);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * (3.2 + glow * 0.8));
    grad.addColorStop(0, theme.glowInner);
    grad.addColorStop(0.4, theme.glowInner.replace(/[\d.]+\)$/, '0.18)'));
    grad.addColorStop(1, theme.glowOuter);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * (3.2 + glow * 0.8), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
