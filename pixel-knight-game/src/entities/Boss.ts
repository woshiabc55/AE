// Boss 基类：多阶段 + 攻击模式调度

import { GRAVITY, GROUND_Y, WORLD_LEFT, WORLD_RIGHT } from "@/config";
import type { BossDef } from "@/config";
import type { EnemyStateName } from "@/types";
import type { Projectile } from "@/skills/Projectiles";
import {
  spawnPoisonBall, spawnIceSpike, spawnShadowBolt,
} from "@/skills/Projectiles";
import { aabbOverlap } from "@/entities/Enemy";

export interface BossHitBox {
  x: number;
  y: number;
  w: number;
  h: number;
  damage: number;
}

export class Boss {
  x: number;
  y = GROUND_Y;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = -1;
  hp: number;
  maxHp: number;
  width: number;
  height: number;
  damage: number;
  speed: number;
  def: BossDef;

  state: EnemyStateName = "chase";
  stateTime = 0;
  phase = 1;
  flash = 0;
  dead = false;
  deadTime = 0;
  removeMe = false;
  isBoss = true;
  attackProgress = 0;

  protected attackTimer = 0;
  protected actionCooldown = 1.5;
  protected stunTimer = 0;
  protected patternIndex = 0;

  constructor(def: BossDef, startX: number) {
    this.def = def;
    this.x = startX;
    this.hp = def.maxHp;
    this.maxHp = def.maxHp;
    this.width = def.width;
    this.height = def.height;
    this.damage = def.damage;
    this.speed = def.speed;
  }

  stun(duration: number) {
    this.stunTimer = Math.max(this.stunTimer, duration);
  }

  update(
    dt: number,
    playerX: number,
    playerY: number,
    projectiles: Projectile[],
    spawnEnemy?: (e: import("@/entities/Enemy").Enemy) => void,
  ) {
    this.stateTime += dt;
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 3);
    if (this.attackTimer > 0) this.attackTimer -= dt;

    if (this.dead) {
      this.deadTime += dt;
      this.vx *= 0.85;
      this.vy += GRAVITY * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
      }
      if (this.deadTime > 2.5) this.removeMe = true;
      return;
    }

    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      this.vx *= 0.8;
      this.applyGravity(dt);
      this.integrate(dt);
      if (this.stunTimer <= 0) this.state = "chase";
      return;
    }

    // 阶段切换
    const hpRatio = this.hp / this.maxHp;
    if (this.phase === 1 && hpRatio <= 0.5 && this.def.phases >= 2) {
      this.phase = 2;
      this.stateTime = 0;
      this.actionCooldown = 0.5; // 切阶段短暂硬直
      this.onPhaseChange();
    }

    this.facing = playerX < this.x ? -1 : 1;
    this.updateAI(dt, playerX, playerY, projectiles, spawnEnemy);
    this.applyGravity(dt);
    this.integrate(dt);
    this.clampWorld();
  }

  protected onPhaseChange() {
    // 子类可覆盖
  }

  protected updateAI(
    dt: number,
    playerX: number,
    playerY: number,
    projectiles: Projectile[],
    spawnEnemy?: (e: import("@/entities/Enemy").Enemy) => void,
  ) {
    // 子类覆盖
    void dt; void playerX; void playerY; void projectiles; void spawnEnemy;
  }

  takeHit(damage: number, knockback: number, fromX: number): boolean {
    if (this.dead) return false;
    this.hp = Math.max(0, this.hp - damage);
    this.flash = 1;
    // Boss 抗击退
    const dir = this.x < fromX ? -1 : 1;
    this.vx += dir * knockback * 0.15;
    if (this.hp <= 0) {
      this.dead = true;
      this.state = "dead";
      this.deadTime = 0;
      this.vx = dir * 200;
      this.vy = -300;
    }
    return true;
  }

  getHitBox(): BossHitBox | null {
    return null;
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      w: this.width,
      h: this.height,
    };
  }

  protected applyGravity(dt: number) {
    this.vy += GRAVITY * dt;
  }

  protected integrate(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
    }
    this.vx *= 0.92;
  }

  protected clampWorld() {
    const hw = this.width / 2;
    this.x = Math.max(WORLD_LEFT + hw, Math.min(WORLD_RIGHT - hw, this.x));
  }

  protected moveTowards(targetX: number, dt: number, speedMul = 1) {
    const dx = targetX - this.x;
    const dir = dx > 0 ? 1 : -1;
    const target = dir * this.speed * speedMul;
    this.vx += (target - this.vx) * Math.min(1, dt * 6);
  }

  protected inRange(targetX: number, range: number) {
    return Math.abs(targetX - this.x) < range;
  }

  /** 工具：检测玩家是否在攻击矩形内 */
  protected hitsPlayer(
    box: { x: number; y: number; w: number; h: number },
    playerBox: { x: number; y: number; w: number; h: number },
  ) {
    return aabbOverlap(box, playerBox);
  }
}

export { spawnPoisonBall, spawnIceSpike, spawnShadowBolt };
