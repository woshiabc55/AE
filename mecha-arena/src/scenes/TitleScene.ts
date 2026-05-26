import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { drawBackground, drawPixelText } from '../utils/sprite';
import { Scene } from './Scene';
import type { InputManager } from '../engine/InputManager';
import { FightScene } from './FightScene';

export class TitleScene extends Scene {
  private frame = 0;

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

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const titleY = 120;
    const glow = 0.7 + 0.3 * Math.sin(this.frame * 0.05);

    ctx.save();
    ctx.shadowColor = '#FF3E3E';
    ctx.shadowBlur = 20 * glow;
    drawPixelText(ctx, 'MECHA', CANVAS_WIDTH / 2, titleY, 48, '#FF3E3E', 'center');
    ctx.shadowColor = '#3EA8FF';
    drawPixelText(ctx, 'ARENA', CANVAS_WIDTH / 2, titleY + 60, 48, '#3EA8FF', 'center');
    ctx.restore();

    drawPixelText(ctx, '机 甲 竞 技 场', CANVAS_WIDTH / 2, titleY + 130, 14, '#FFD700', 'center');

    const ctrlY = 320;
    drawPixelText(ctx, 'P1 赤焰', CANVAS_WIDTH / 2 - 180, ctrlY, 12, '#FF6644', 'center');
    drawPixelText(ctx, 'WASD 移动', CANVAS_WIDTH / 2 - 180, ctrlY + 25, 8, '#CC8866', 'center');
    drawPixelText(ctx, 'J 攻击  K 防御', CANVAS_WIDTH / 2 - 180, ctrlY + 45, 8, '#CC8866', 'center');

    drawPixelText(ctx, 'P2 苍雷', CANVAS_WIDTH / 2 + 180, ctrlY, 12, '#44AAFF', 'center');
    drawPixelText(ctx, '方向键 移动', CANVAS_WIDTH / 2 + 180, ctrlY + 25, 8, '#6688CC', 'center');
    drawPixelText(ctx, 'L 攻击  ; 防御', CANVAS_WIDTH / 2 + 180, ctrlY + 45, 8, '#6688CC', 'center');

    if (this.frame > 60) {
      const blink = Math.sin(this.frame * 0.08) > 0;
      if (blink) {
        drawPixelText(ctx, '按任意键开始', CANVAS_WIDTH / 2, 440, 12, '#FFFFFF', 'center');
      }
    }

    drawPixelText(ctx, 'v0.1 DEMO', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30, 8, '#555555', 'center');
  }
}
