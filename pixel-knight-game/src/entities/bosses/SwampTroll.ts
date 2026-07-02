// Boss 2：沼泽巨魔 Bilefang —— 砸地 AOE + 毒球 + 跳砸

import { Boss } from "@/entities/Boss";
import type { BossDef } from "@/config";
import { GROUND_Y } from "@/config";
import type { Projectile } from "@/skills/Projectiles";
import { spawnPoisonBall } from "@/skills/Projectiles";
import type { Enemy } from "@/entities/Enemy";

type Pattern = "idle" | "slam" | "poisonThrow" | "jump" | "frenzy";

export class SwampTroll extends Boss {
  private pattern: Pattern = "idle";
  private patternTimer = 0;
  private jumped = false;

  constructor(def: BossDef, startX: number) {
    super(def, startX);
  }

  protected onPhaseChange() {
    this.pattern = "frenzy";
    this.patternTimer = 0;
    this.actionCooldown = 0.6;
  }

  protected updateAI(
    dt: number,
    playerX: number,
    _playerY: number,
    projectiles: Projectile[],
    _spawnEnemy?: (e: Enemy) => void,
  ) {
    this.patternTimer += dt;

    if (this.pattern === "idle") {
      this.moveTowards(playerX, dt, 0.6);
      this.actionCooldown -= dt;
      if (this.actionCooldown <= 0) {
        this.choosePattern(playerX);
      }
    } else if (this.pattern === "slam") {
      // 砸地：前摇后 AOE
      if (this.patternTimer > 0.6) {
        this.pattern = "idle";
        this.actionCooldown = 1.8;
      }
    } else if (this.pattern === "poisonThrow") {
      // 投掷毒球
      if (this.patternTimer > 0.4) {
        const dir = this.facing;
        projectiles.push(spawnPoisonBall(this.x, this.y - 100, dir * 380, -260));
        this.pattern = "idle";
        this.actionCooldown = 1.6;
      }
    } else if (this.pattern === "jump") {
      // 跳砸
      if (!this.jumped && this.patternTimer > 0.2) {
        this.vy = -700;
        this.vx = (playerX - this.x) * 1.2;
        this.jumped = true;
      }
      if (this.jumped && this.y >= GROUND_Y && this.patternTimer > 0.4) {
        // 落地，触发 AOE
        this.pattern = "idle";
        this.jumped = false;
        this.actionCooldown = 2;
      }
    } else if (this.pattern === "frenzy") {
      // 狂暴：连续小跳 + 毒雾
      if (this.patternTimer > 0.5 && Math.random() < 0.5) {
        projectiles.push(spawnPoisonBall(this.x, this.y - 80, (Math.random() - 0.5) * 400, -300));
      }
      this.moveTowards(playerX, dt, 1.3);
      if (this.patternTimer > 3) {
        this.pattern = "idle";
        this.actionCooldown = 1.5;
      }
    }
  }

  private choosePattern(playerX: number) {
    const dist = Math.abs(playerX - this.x);
    this.patternTimer = 0;
    if (this.phase === 2 && Math.random() < 0.4) {
      this.pattern = "frenzy";
    } else if (dist < 130) {
      this.pattern = "slam";
    } else if (Math.random() < 0.5) {
      this.pattern = "poisonThrow";
    } else {
      this.pattern = "jump";
    }
  }

  getHitBox() {
    if (this.pattern === "slam") {
      if (this.patternTimer > 0.5 && this.patternTimer < 0.7) {
        // 砸地瞬间大范围
        return {
          x: this.x - 90,
          y: this.y - 30,
          w: 180,
          h: 30,
          damage: this.damage,
        };
      }
    }
    if (this.pattern === "jump" && this.jumped === false && this.patternTimer < 0.2) {
      // 起跳撞击
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height,
        w: this.width,
        h: this.height,
        damage: Math.round(this.damage * 0.8),
      };
    }
    return null;
  }
}
