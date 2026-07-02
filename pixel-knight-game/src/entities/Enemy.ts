// 骷髅战士：AI 状态机（巡逻/追击/攻击/受击/死亡）

import {
  ENEMY, GRAVITY, GROUND_Y, PLAYER as PCFG, WORLD_LEFT, WORLD_RIGHT,
} from "@/config";
import type { EnemyStateName } from "@/types";
import { drawSkeleton, type SkeletonDrawOpts } from "@/sprites/skeleton";

export interface EnemyHitBox {
  x: number;
  y: number;
  w: number;
  h: number;
  damage: number;
}

export class Enemy {
  x: number;
  y = GROUND_Y;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = -1;
  hp: number = ENEMY.hp;
  maxHp: number = ENEMY.hp;

  state: EnemyStateName = "patrol";
  stateTime = 0;
  runPhase = 0;
  attackProgress = 0;
  flash = 0;
  dead = false;
  deadTime = 0;
  removeMe = false;

  private patrolDir: 1 | -1;
  private spawnX: number;
  private attackTimer = 0;
  private attackCooldown = 0;

  constructor(x: number) {
    this.x = x;
    this.spawnX = x;
    this.patrolDir = x > 200 ? -1 : 1;
    this.facing = this.patrolDir;
  }

  update(dt: number, playerX: number, playerY: number) {
    this.stateTime += dt;
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 3);
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    if (this.dead) {
      this.deadTime += dt;
      this.vx *= 0.8;
      this.applyGravity(dt);
      this.integrate(dt);
      if (this.deadTime > 1.4) this.removeMe = true;
      return;
    }

    const dist = Math.abs(playerX - this.x);

    switch (this.state) {
      case "patrol":
      case "idle":
        this.updatePatrol(dt, dist, playerX);
        break;
      case "chase":
        this.updateChase(dt, dist, playerX);
        break;
      case "attack":
        this.updateAttack(dt);
        break;
      case "hurt":
        this.vx *= 0.8;
        if (this.stateTime > ENEMY.hurtStun) this.setState("chase");
        break;
    }

    this.applyGravity(dt);
    this.integrate(dt);
    this.clampWorld();
  }

  private updatePatrol(dt: number, dist: number, playerX: number) {
    if (dist < ENEMY.detectRange) {
      this.setState("chase");
      return;
    }
    this.facing = this.patrolDir;
    this.vx = this.patrolDir * ENEMY.speed * 0.5;
    this.runPhase += dt * 10;
    if (Math.abs(this.x - this.spawnX) > 140) this.patrolDir = (this.patrolDir * -1) as 1 | -1;
  }

  private updateChase(dt: number, dist: number, playerX: number) {
    this.facing = playerX < this.x ? -1 : 1;
    if (dist > ENEMY.detectRange * 1.5) {
      this.setState("patrol");
      return;
    }
    if (dist < ENEMY.attackRange && this.attackCooldown <= 0) {
      this.setState("attack");
      this.attackTimer = 0;
      this.attackProgress = 0;
      this.vx = 0;
      return;
    }
    this.vx = this.facing * ENEMY.chaseSpeed;
    this.runPhase += dt * 13;
  }

  private updateAttack(dt: number) {
    this.attackTimer += dt;
    const total = ENEMY.attackWindup + ENEMY.attackActive + ENEMY.attackRecover;
    this.attackProgress = Math.min(1, this.attackTimer / total);
    if (this.attackTimer >= total) {
      this.attackCooldown = 0.6;
      this.setState("chase");
    }
  }

  /** 攻击命中盒（仅 active 阶段） */
  getHitBox(): EnemyHitBox | null {
    if (this.state !== "attack") return null;
    const t = this.attackTimer;
    if (t < ENEMY.attackWindup || t > ENEMY.attackWindup + ENEMY.attackActive) return null;
    const reach = ENEMY.attackRange;
    const bx = this.facing === 1 ? this.x : this.x - reach;
    return {
      x: bx,
      y: this.y - ENEMY.height * 0.8,
      w: reach,
      h: ENEMY.height * 0.7,
      damage: ENEMY.damage,
    };
  }

  takeHit(damage: number, knockback: number, fromX: number): boolean {
    if (this.dead) return false;
    this.hp = Math.max(0, this.hp - damage);
    this.flash = 1;
    const dir = this.x < fromX ? -1 : 1;
    this.vx = dir * knockback;
    this.vy = -180;
    if (this.hp <= 0) {
      this.dead = true;
      this.setState("dead");
      this.vx = dir * knockback * 0.7;
    } else {
      this.setState("hurt");
    }
    return true;
  }

  private setState(s: EnemyStateName) {
    if (this.state !== s) {
      this.state = s;
      this.stateTime = 0;
    }
  }

  private applyGravity(dt: number) {
    this.vy += GRAVITY * dt;
  }

  private integrate(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
    }
  }

  private clampWorld() {
    const hw = ENEMY.width / 2;
    this.x = Math.max(WORLD_LEFT + hw, Math.min(WORLD_RIGHT - hw, this.x));
  }

  getDrawOpts(): SkeletonDrawOpts {
    return {
      state: this.state,
      t: this.stateTime,
      runPhase: this.runPhase,
      attackProgress: this.attackProgress,
      flash: this.flash,
    };
  }

  /** AABB 碰撞盒（用于受击） */
  getBounds() {
    return {
      x: this.x - ENEMY.width / 2,
      y: this.y - ENEMY.height,
      w: ENEMY.width,
      h: ENEMY.height,
    };
  }
}

export function aabbOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}
