// Boss 1：骸骨将军 Kael —— 三连斩 + 冲撞 + 召唤

import { Boss } from "@/entities/Boss";
import type { BossDef } from "@/config";
import { GROUND_Y } from "@/config";
import type { Projectile } from "@/skills/Projectiles";
import { Enemy } from "@/entities/Enemy";

type Pattern = "idle" | "tripleSlash" | "charge" | "summon" | "whirlwind";

export class BoneGeneral extends Boss {
  private pattern: Pattern = "idle";
  private patternTimer = 0;
  private slashCount = 0;

  constructor(def: BossDef, startX: number) {
    super(def, startX);
  }

  protected onPhaseChange() {
    this.pattern = "idle";
    this.actionCooldown = 1.2;
  }

  protected updateAI(
    dt: number,
    playerX: number,
    _playerY: number,
    _projectiles: Projectile[],
    spawnEnemy?: (e: Enemy) => void,
  ) {
    this.patternTimer += dt;

    if (this.pattern === "idle") {
      this.moveTowards(playerX, dt, 0.8);
      this.actionCooldown -= dt;
      if (this.actionCooldown <= 0) {
        this.choosePattern(playerX, spawnEnemy);
      }
    } else if (this.pattern === "tripleSlash") {
      // 三段斩：每 0.4s 一刀
      if (this.patternTimer > 0.4 && this.slashCount < 3) {
        this.slashCount++;
        this.patternTimer = 0;
      }
      if (this.slashCount >= 3) {
        this.pattern = "idle";
        this.slashCount = 0;
        this.actionCooldown = 1.6;
      }
    } else if (this.pattern === "charge") {
      // 冲撞：朝玩家方向高速冲刺
      this.vx = this.facing * 480;
      if (this.patternTimer > 0.8) {
        this.pattern = "idle";
        this.actionCooldown = 1.8;
      }
    } else if (this.pattern === "summon") {
      // 召唤 2 个骷髅兵
      if (this.patternTimer > 0.3 && spawnEnemy) {
        for (let i = 0; i < 2; i++) {
          const e = new Enemy(this.x + (i === 0 ? -60 : 60));
          e.kind = "skeletonScout";
          e.facing = (-this.facing) as 1 | -1;
          spawnEnemy(e);
        }
        this.pattern = "idle";
        this.actionCooldown = 2.2;
      }
    } else if (this.pattern === "whirlwind") {
      // 旋风斩
      this.vx = this.facing * 200;
      if (this.patternTimer > 1.2) {
        this.pattern = "idle";
        this.actionCooldown = 1.6;
      }
    }
  }

  private choosePattern(playerX: number, _spawnEnemy?: (e: Enemy) => void) {
    const dist = Math.abs(playerX - this.x);
    this.patternTimer = 0;
    if (this.phase === 2 && Math.random() < 0.35) {
      this.pattern = "summon";
    } else if (this.phase === 2 && Math.random() < 0.3) {
      this.pattern = "whirlwind";
    } else if (dist < 120) {
      this.pattern = "tripleSlash";
      this.slashCount = 0;
    } else {
      this.pattern = "charge";
    }
    void playerX;
  }

  getHitBox() {
    // 三连斩 / 旋风斩时持续输出
    if (this.pattern === "tripleSlash" || this.pattern === "whirlwind") {
      const reach = 90;
      return {
        x: this.facing === 1 ? this.x : this.x - reach,
        y: this.y - this.height,
        w: reach,
        h: this.height,
        damage: this.damage,
      };
    }
    // 冲撞
    if (this.pattern === "charge") {
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

void GROUND_Y;
