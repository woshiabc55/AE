import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { drawBackground, drawPixelText } from '../utils/sprite';
import { Scene } from './Scene';
import type { InputManager } from '../engine/InputManager';
import { FightScene } from './FightScene';

export class ResultScene extends Scene {
  private frame = 0;
  private winnerName: string;
  private winnerColor: string;

  constructor(winnerName: string, winnerColor: string) {
    super();
    this.winnerName = winnerName;
    this.winnerColor = winnerColor;
  }

  enter() {
    this.frame = 0;
  }

  exit() {}

  update(input: InputManager): Scene | null {
    this.frame++;
    if (this.frame > 60 && input.anyPressed()) {
      return new FightScene();
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx, this.frame);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const glow = 0.7 + 0.3 * Math.sin(this.frame * 0.06);

    ctx.save();
    ctx.shadowColor = this.winnerColor;
    ctx.shadowBlur = 30 * glow;
    drawPixelText(ctx, 'K.O.', CANVAS_WIDTH / 2, 140, 56, '#FFD700', 'center');
    ctx.restore();

    drawPixelText(ctx, `${this.winnerName} 获胜!`, CANVAS_WIDTH / 2, 250, 24, this.winnerColor, 'center');

    if (this.frame > 60) {
      const blink = Math.sin(this.frame * 0.08) > 0;
      if (blink) {
        drawPixelText(ctx, '按任意键重新开始', CANVAS_WIDTH / 2, 380, 12, '#FFFFFF', 'center');
      }
    }
  }
}
