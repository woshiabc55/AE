// Boss 3：霜誓骑士 Veyra —— 镜像剑技 + 冰锥 + 冰封领域

import { Boss } from "@/entities/Boss";
import type { BossDef } from "@/config";
import { GROUND_Y } from "@/config";
import type { Projectile } from "@/skills/Projectiles";
import { spawnIceSpike } from "@/skills/Projectiles";
import type { Enemy } from "@/entities/Enemy";

type Pattern = "idle" | "rushSlash" | "iceBarrage" | "icePillar" | "frozenField";

export class FrostKnight extends Boss {
  private pattern: Pattern = "idle";
  private patternTimer = 0;
  private barrageCount = 0;

  constructor(def: BossDef, startX: number) {
    super(def, startX);
  }

  protected onPhaseChange() {
    this.pattern = "frozenField";
    this.patternTimer = 0;
    this.actionCooldown = 0.8;
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
      this.moveTowards(playerX, dt, 0.9);
      this.actionCooldown -= dt;
      if (this.actionCooldown <= 0) {
        this.choosePattern(playerX);
      }
    } else if (this.pattern === "rushSlash") {
      // 突进斩
      this.vx = this.facing * 520;
      if (this.patternTimer > 0.5) {
        this.pattern = "idle";
        this.actionCooldown = 1.4;
      }
    } else if (this.pattern === "iceBarrage") {
      // 三连冰锥
      if (this.patternTimer > 0.18 && this.barrageCount < 3) {
        this.barrageCount++;
        this.patternTimer = 0;
        const dir = this.facing;
        projectiles.push(spawnIceSpike(this.x, this.y - 80, dir * 420, -120));
      }
      if (this.barrageCount >= 3) {
        this.barrageCount = 0;
        this.pattern = "idle";
        this.actionCooldown = 1.8;
      }
    } else if (this.pattern === "icePillar") {
      // 冰柱降临：3 道从天而降
      if (this.patternTimer > 0.2) {
        for (let i = 0; i < 3; i++) {
          const px = playerX + (i - 1) * 90;
          projectiles.push(spawnIceSpike(px, -200, 0, 500));
        }
        this.pattern = "idle";
        this.actionCooldown = 2;
      }
    } else if (this.pattern === "frozenField") {
      // 冰封领域：持续投冰锥
      if (this.patternTimer > 0.4 && Math.random() < 0.6) {
        projectiles.push(spawnIceSpike(this.x, this.y - 80, (Math.random() - 0.5) * 600, -200));
      }
      this.moveTowards(playerX, dt, 1.2);
      if (this.patternTimer > 4) {
        this.pattern = "idle";
        this.actionCooldown = 1.5;
      }
    }
    // 攻击动画进度（驱动突进斩 / 冰封领域）
    if (this.pattern === "rushSlash") {
      this.attackProgress = Math.min(1, this.patternTimer / 0.5);
    } else if (this.pattern === "frozenField") {
      this.attackProgress = 0.4 + Math.sin(this.patternTimer * 8) * 0.25;
    } else if (this.pattern === "iceBarrage") {
      this.attackProgress = Math.min(1, this.barrageCount / 3);
    } else {
      this.attackProgress = 0;
    }
  }

  private choosePattern(playerX: number) {
    const dist = Math.abs(playerX - this.x);
    this.patternTimer = 0;
    if (this.phase === 2 && Math.random() < 0.35) {
      this.pattern = "frozenField";
    } else if (dist < 100) {
      this.pattern = "rushSlash";
    } else if (Math.random() < 0.5) {
      this.pattern = "iceBarrage";
      this.barrageCount = 0;
    } else {
      this.pattern = "icePillar";
    }
  }

  getHitBox() {
    if (this.pattern === "rushSlash") {
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height,
        w: this.width,
        h: this.height,
        damage: this.damage,
      };
    }
    return null;
  }
}

void GROUND_Y;
