import { InputManager } from './input';
import { createMecha, updateMecha, getAttackHitbox, getMechaBody, applyHit, pushMechaApart } from './mecha';
import { createHitParticles, createDefendParticles, createDamageNumber, createShieldEffect, updateParticles, updateDamageNumbers, updateShieldEffects } from './effects';
import { render } from './renderer';
import {
  MechaData,
  Particle,
  DamageNumber,
  ShieldEffect,
  GamePhase,
  GameResult,
  ATTACK_DAMAGE,
  DEFEND_DAMAGE,
  BATTLE_TIME,
  CANVAS_W,
  CANVAS_H,
} from './types';

export class GameEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private input: InputManager;
  private animFrameId: number = 0;
  private running: boolean = false;

  private phase: GamePhase = 'title';
  private p1: MechaData = createMecha(1, 200, 1);
  private p2: MechaData = createMecha(2, 650, -1);
  private timer: number = BATTLE_TIME;
  private lastTimerUpdate: number = 0;
  private particles: Particle[] = [];
  private damageNumbers: DamageNumber[] = [];
  private shieldEffects: ShieldEffect[] = [];
  private screenShake: number = 0;
  private frame: number = 0;
  private winner: 1 | 2 | 'draw' | null = null;

  private onResult: ((result: GameResult) => void) | null = null;

  constructor() {
    this.input = new InputManager();
  }

  init(canvas: HTMLCanvasElement, onResult?: (result: GameResult) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onResult = onResult || null;

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    this.ctx.imageSmoothingEnabled = false;

    this.input.start();
    this.resetBattle();
  }

  destroy() {
    this.running = false;
    this.input.stop();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  start() {
    this.running = true;
    this.lastTimerUpdate = Date.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  getPhase(): GamePhase {
    return this.phase;
  }

  private resetBattle() {
    this.p1 = createMecha(1, 200, 1);
    this.p2 = createMecha(2, 650, -1);
    this.timer = BATTLE_TIME;
    this.particles = [];
    this.damageNumbers = [];
    this.shieldEffects = [];
    this.screenShake = 0;
    this.winner = null;
    this.lastTimerUpdate = Date.now();
  }

  private loop = () => {
    if (!this.running) return;

    this.update();
    this.draw();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update() {
    this.frame++;
    this.input.update();

    if (this.phase === 'title') {
      if (this.input.isJustPressed('Enter') || this.input.isJustPressed('Space')) {
        this.phase = 'battle';
        this.resetBattle();
      }
    } else if (this.phase === 'battle') {
      this.updateBattle();
    } else if (this.phase === 'result') {
      if (this.input.isJustPressed('Enter') || this.input.isJustPressed('Space')) {
        this.phase = 'title';
        this.frame = 0;
      }
    }

    this.input.postUpdate();
  }

  private updateBattle() {
    const p1Input = this.input.getPlayerInput(1);
    const p2Input = this.input.getPlayerInput(2);

    this.p1 = updateMecha(this.p1, p1Input, this.p2.x);
    this.p2 = updateMecha(this.p2, p2Input, this.p1.x);

    [this.p1, this.p2] = pushMechaApart(this.p1, this.p2);

    this.checkAttackHits();

    const now = Date.now();
    if (now - this.lastTimerUpdate >= 1000) {
      this.timer--;
      this.lastTimerUpdate = now;
    }

    if (this.p1.hp <= 0) {
      this.endBattle(2);
    } else if (this.p2.hp <= 0) {
      this.endBattle(1);
    } else if (this.timer <= 0) {
      if (this.p1.hp > this.p2.hp) {
        this.endBattle(1);
      } else if (this.p2.hp > this.p1.hp) {
        this.endBattle(2);
      } else {
        this.endBattle('draw');
      }
    }

    if (this.p1.state === 'DEFEND' || this.p2.state === 'DEFEND') {
      if (this.frame % 6 === 0) {
        if (this.p1.state === 'DEFEND') {
          this.shieldEffects.push(createShieldEffect(this.p1.x, this.p1.y, this.p1.facing));
        }
        if (this.p2.state === 'DEFEND') {
          this.shieldEffects.push(createShieldEffect(this.p2.x, this.p2.y, this.p2.facing));
        }
      }
    }

    this.particles = updateParticles(this.particles);
    this.damageNumbers = updateDamageNumbers(this.damageNumbers);
    this.shieldEffects = updateShieldEffects(this.shieldEffects);

    if (this.screenShake > 0) {
      this.screenShake *= 0.85;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }
  }

  private checkAttackHits() {
    const p1Hitbox = getAttackHitbox(this.p1);
    const p2Hitbox = getAttackHitbox(this.p2);

    if (p1Hitbox) {
      const p2Body = getMechaBody(this.p2);
      if (this.boxOverlap(p1Hitbox, p2Body)) {
        const isDefending = this.p2.state === 'DEFEND';
        const damage = isDefending ? DEFEND_DAMAGE : ATTACK_DAMAGE;

        this.p2 = applyHit(this.p2, ATTACK_DAMAGE);
        this.p1 = { ...this.p1, attackHit: true };

        const hitX = p1Hitbox.x + p1Hitbox.w / 2;
        const hitY = p1Hitbox.y + p1Hitbox.h / 2;

        if (isDefending) {
          this.particles.push(...createDefendParticles(this.p2.x, this.p2.y, this.p2.facing));
          this.damageNumbers.push(createDamageNumber(hitX, hitY - 20, damage));
        } else {
          this.particles.push(...createHitParticles(hitX, hitY, '#ffcc00'));
          this.damageNumbers.push(createDamageNumber(hitX, hitY - 20, damage));
          this.screenShake = 5;
        }
      }
    }

    if (p2Hitbox) {
      const p1Body = getMechaBody(this.p1);
      if (this.boxOverlap(p2Hitbox, p1Body)) {
        const isDefending = this.p1.state === 'DEFEND';
        const damage = isDefending ? DEFEND_DAMAGE : ATTACK_DAMAGE;

        this.p1 = applyHit(this.p1, ATTACK_DAMAGE);
        this.p2 = { ...this.p2, attackHit: true };

        const hitX = p2Hitbox.x + p2Hitbox.w / 2;
        const hitY = p2Hitbox.y + p2Hitbox.h / 2;

        if (isDefending) {
          this.particles.push(...createDefendParticles(this.p1.x, this.p1.y, this.p1.facing));
          this.damageNumbers.push(createDamageNumber(hitX, hitY - 20, damage));
        } else {
          this.particles.push(...createHitParticles(hitX, hitY, '#ffcc00'));
          this.damageNumbers.push(createDamageNumber(hitX, hitY - 20, damage));
          this.screenShake = 5;
        }
      }
    }
  }

  private boxOverlap(
    a: { x: number; y: number; w: number; h: number },
    b: { x: number; y: number; w: number; h: number },
  ): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  private endBattle(winner: 1 | 2 | 'draw') {
    this.phase = 'result';
    this.winner = winner;
    this.frame = 0;

    if (this.onResult) {
      this.onResult({
        winner,
        p1Hp: this.p1.hp,
        p2Hp: this.p2.hp,
      });
    }
  }

  private draw() {
    if (!this.ctx) return;

    render(
      this.ctx,
      this.phase,
      this.p1,
      this.p2,
      this.timer,
      this.particles,
      this.damageNumbers,
      this.shieldEffects,
      this.screenShake,
      this.frame,
      this.winner,
    );
  }
}
