// Boss 4：永夜之主 Morgrim —— 暗影弹幕 + 召唤 + 传送 + 蚀日激光

import { Boss } from "@/entities/Boss";
import type { BossDef } from "@/config";
import { VIEW_W, GROUND_Y } from "@/config";
import type { Projectile } from "@/skills/Projectiles";
import { spawnShadowBolt } from "@/skills/Projectiles";
import { Enemy } from "@/entities/Enemy";

type Pattern = "idle" | "teleport" | "barrage" | "summon" | "laser" | "shadowGiant";

export class NightLord extends Boss {
  private pattern: Pattern = "idle";
  private patternTimer = 0;
  private barrageAngle = 0;
  private teleportTargetX = 0;
  private laserActive = false;
  private laserTimer = 0;

  constructor(def: BossDef, startX: number) {
    super(def, startX);
  }

  protected onPhaseChange() {
    this.pattern = "shadowGiant";
    this.patternTimer = 0;
    this.actionCooldown = 1;
  }

  protected updateAI(
    dt: number,
    playerX: number,
    _playerY: number,
    projectiles: Projectile[],
    spawnEnemy?: (e: Enemy) => void,
  ) {
    this.patternTimer += dt;

    if (this.pattern === "idle") {
      // 浮空移动
      this.moveTowards(playerX, dt, 0.6);
      this.actionCooldown -= dt;
      if (this.actionCooldown <= 0) {
        this.choosePattern(playerX, spawnEnemy);
      }
    } else if (this.pattern === "teleport") {
      // 传送
      if (this.patternTimer > 0.3) {
        this.x = this.teleportTargetX;
        this.pattern = "idle";
        this.actionCooldown = 0.6;
      }
    } else if (this.pattern === "barrage") {
      // 暗影弹幕（环形 8 发）
      if (this.patternTimer > 0.1 && this.barrageAngle < Math.PI * 2) {
        for (let i = 0; i < 8; i++) {
          const a = this.barrageAngle + (i / 8) * Math.PI * 2;
          projectiles.push(spawnShadowBolt(this.x, this.y - 80, Math.cos(a) * 320, Math.sin(a) * 320));
        }
        this.barrageAngle += 0.4;
      }
      if (this.patternTimer > 0.8) {
        this.barrageAngle = 0;
        this.pattern = "idle";
        this.actionCooldown = 1.6;
      }
    } else if (this.pattern === "summon") {
      if (this.patternTimer > 0.3 && spawnEnemy) {
        for (let i = 0; i < 2; i++) {
          const e = new Enemy(this.x + (i === 0 ? -80 : 80));
          e.kind = "wraith";
          e.facing = (-this.facing) as 1 | -1;
          spawnEnemy(e);
        }
        this.pattern = "idle";
        this.actionCooldown = 2.5;
      }
    } else if (this.pattern === "laser") {
      // 蚀日激光：从天空垂直轰击玩家所在区域
      if (!this.laserActive && this.patternTimer > 0.8) {
        this.laserActive = true;
        this.laserTimer = 0;
      }
      if (this.laserActive) {
        this.laserTimer += dt;
        // 持续生成 shadowBolt 从天而降打玩家位置
        if (this.laserTimer < 1.5 && Math.random() < 0.3) {
          const px = playerX + (Math.random() - 0.5) * 200;
          projectiles.push(spawnShadowBolt(px, -100, 0, 600));
        }
        if (this.laserTimer > 2) {
          this.laserActive = false;
          this.pattern = "idle";
          this.actionCooldown = 2;
        }
      }
    } else if (this.pattern === "shadowGiant") {
      // 化身暗影巨魔：贴身攻击 + 大范围暗影波
      this.moveTowards(playerX, dt, 1.1);
      if (this.patternTimer > 0.6 && Math.random() < 0.4) {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI - Math.PI / 2;
          projectiles.push(spawnShadowBolt(this.x, this.y - 60, Math.cos(a) * 280, Math.sin(a) * 280));
        }
      }
      if (this.patternTimer > 5) {
        this.pattern = "idle";
        this.actionCooldown = 1.5;
      }
    }
  }

  private choosePattern(playerX: number, _spawnEnemy?: (e: Enemy) => void) {
    this.patternTimer = 0;
    this.barrageAngle = 0;
    if (this.phase === 2 && Math.random() < 0.3) {
      this.pattern = "shadowGiant";
    } else if (Math.random() < 0.25) {
      // 传送
      this.teleportTargetX = playerX + (Math.random() < 0.5 ? -200 : 200);
      this.teleportTargetX = Math.max(100, Math.min(VIEW_W - 100, this.teleportTargetX));
      this.pattern = "teleport";
    } else if (Math.random() < 0.4) {
      this.pattern = "barrage";
    } else if (Math.random() < 0.5) {
      this.pattern = "summon";
    } else {
      this.pattern = "laser";
    }
  }

  getHitBox() {
    if (this.pattern === "shadowGiant") {
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
