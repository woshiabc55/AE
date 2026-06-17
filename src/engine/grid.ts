import type { Theme } from '@/themes/themes';

export class Grid {
  draw(ctx: CanvasRenderingContext2D, theme: Theme, w: number, h: number, t: number) {
    const spacing = 56;
    ctx.save();
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const offset = (t * 18) % spacing;
    for (let x = -offset; x < w; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = -offset; y < h; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // 中心十字线
    ctx.strokeStyle = theme.grid.replace(/[\d.]+\)$/, '0.18)');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.restore();
  }
}
