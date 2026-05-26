import { MAX_HP, MAX_ENERGY, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { drawPixelText } from '../utils/sprite';
import type { Mecha } from '../entities/Mecha';

export class HUD {
  draw(ctx: CanvasRenderingContext2D, p1: Mecha, p2: Mecha) {
    const barW = 300;
    const barH = 20;
    const energyH = 8;
    const margin = 40;
    const topY = 20;

    drawPixelText(ctx, p1.name, margin, topY - 2, 10, '#FF6644', 'left');
    this.drawBar(ctx, margin, topY + 16, barW, barH, p1.hp / MAX_HP, '#CC2222', '#441111', '#FF4444', true);
    this.drawBar(ctx, margin, topY + 40, barW, energyH, p1.energy / MAX_ENERGY, '#CCAA00', '#443300', '#FFD700', true);

    const p2X = CANVAS_WIDTH - margin - barW;
    drawPixelText(ctx, p2.name, CANVAS_WIDTH - margin, topY - 2, 10, '#44AAFF', 'right');
    this.drawBar(ctx, p2X, topY + 16, barW, barH, p2.hp / MAX_HP, '#2244CC', '#111144', '#4488FF', false);
    this.drawBar(ctx, p2X, topY + 40, barW, energyH, p2.energy / MAX_ENERGY, '#CCAA00', '#443300', '#FFD700', false);

    drawPixelText(ctx, 'VS', CANVAS_WIDTH / 2, topY + 12, 14, '#FFD700', 'center');

    drawPixelText(ctx, `${Math.ceil(p1.hp)}`, margin + 4, topY + 18, 8, '#FFFFFF', 'left');
    drawPixelText(ctx, `${Math.ceil(p2.hp)}`, CANVAS_WIDTH - margin - 4, topY + 18, 8, '#FFFFFF', 'right');
  }

  private drawBar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ratio: number,
    color: string,
    bgColor: string,
    highlight: string,
    leftAligned: boolean,
  ) {
    ratio = Math.max(0, Math.min(1, ratio));

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);

    const fillW = w * ratio;
    if (leftAligned) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, fillW, h);
      ctx.fillStyle = highlight;
      ctx.fillRect(x, y, fillW, h / 3);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x + w - fillW, y, fillW, h);
      ctx.fillStyle = highlight;
      ctx.fillRect(x + w - fillW, y, fillW, h / 3);
    }

    ctx.strokeStyle = '#666688';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  drawControls(ctx: CanvasRenderingContext2D) {
    const y = CANVAS_HEIGHT - 50;
    ctx.globalAlpha = 0.5;
    drawPixelText(ctx, 'P1: WASD移动 J攻击 K防御', 30, y, 8, '#FF8866', 'left');
    drawPixelText(ctx, 'P2: 方向键移动 L攻击 ;防御', CANVAS_WIDTH - 30, y, 8, '#66AAFF', 'right');
    ctx.globalAlpha = 1;
  }
}
