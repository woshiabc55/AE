import { CANVAS_WIDTH, MECHA_W } from '../utils/constants';
import { drawBackground } from '../utils/sprite';
import { Scene } from './Scene';
import type { InputManager } from '../engine/InputManager';
import { Mecha, createP1, createP2, checkAttack, pushApart, updateFacing } from '../entities/Mecha';
import { ParticleSystem } from '../entities/Particle';
import { HUD } from '../ui/HUD';
import { ResultScene } from './ResultScene';

export class FightScene extends Scene {
  private p1: Mecha;
  private p2: Mecha;
  private particles: ParticleSystem;
  private hud: HUD;
  private frame = 0;
  private roundStartFrame = 0;

  constructor() {
    super();
    this.p1 = createP1(200);
    this.p2 = createP2(CANVAS_WIDTH - 200);
    this.particles = new ParticleSystem();
    this.hud = new HUD();
  }

  enter() {
    this.frame = 0;
    this.roundStartFrame = 0;
    this.p1.reset(200);
    this.p2.reset(CANVAS_WIDTH - 200);
    this.particles.clear();
  }

  exit() {}

  update(input: InputManager): Scene | null {
    this.frame++;

    if (this.roundStartFrame < 60) {
      this.roundStartFrame++;
      return null;
    }

    this.p1.handleInput(input);
    this.p2.handleInput(input);

    this.p1.update();
    this.p2.update();

    updateFacing(this.p1, this.p2);
    pushApart(this.p1, this.p2);

    if (checkAttack(this.p1, this.p2)) {
      this.p1.hasHit = true;
      const hitX = this.p2.x + (this.p1.facingRight ? -MECHA_W / 2 : MECHA_W / 2);
      const hitY = this.p2.y - 60;
      this.particles.emitSpark(hitX, hitY, '#FF6644');
      this.p2.takeDamage(12, !this.p1.facingRight);
    }

    if (checkAttack(this.p2, this.p1)) {
      this.p2.hasHit = true;
      const hitX = this.p1.x + (this.p2.facingRight ? -MECHA_W / 2 : MECHA_W / 2);
      const hitY = this.p1.y - 60;
      this.particles.emitSpark(hitX, hitY, '#44AAFF');
      this.p1.takeDamage(12, !this.p2.facingRight);
    }

    if (this.p1.state === 'defend') {
      this.particles.emitShield(
        this.p1.x + (this.p1.facingRight ? 35 : -35),
        this.p1.y - 54,
        '#FF8866',
      );
    }
    if (this.p2.state === 'defend') {
      this.particles.emitShield(
        this.p2.x + (this.p2.facingRight ? 35 : -35),
        this.p2.y - 54,
        '#4488FF',
      );
    }

    this.particles.update();

    if (this.p1.hp <= 0) {
      return new ResultScene(this.p2.name, '#3EA8FF');
    }
    if (this.p2.hp <= 0) {
      return new ResultScene(this.p1.name, '#FF3E3E');
    }

    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawBackground(ctx, this.frame);

    this.p1.draw(ctx);
    this.p2.draw(ctx);

    this.particles.draw(ctx);

    this.hud.draw(ctx, this.p1, this.p2);
    this.hud.drawControls(ctx);

    if (this.roundStartFrame < 60) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, 540);

      const count = 3 - Math.floor(this.roundStartFrame / 20);
      if (count > 0) {
        const scale = 1 + (this.roundStartFrame % 20) * 0.02;
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, 270);
        ctx.scale(scale, scale);
        ctx.translate(-CANVAS_WIDTH / 2, -270);
        ctx.font = '64px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${count}`, CANVAS_WIDTH / 2, 270);
        ctx.restore();
      } else {
        ctx.font = '48px "Press Start 2P", monospace';
        ctx.fillStyle = '#FF3E3E';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('FIGHT!', CANVAS_WIDTH / 2, 270);
      }
    }
  }
}
