// 投射物：圣光弹、落雷、Boss 远程攻击等

import { GROUND_Y, VIEW_H } from "@/config";
import type { Particle } from "@/types";

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  damage: number;
  kind: "holyBolt" | "lightning" | "poisonBall" | "iceSpike" | "shadowBolt";
  color: string;
  pierce: boolean;
  hitSet: Set<unknown>;
  // 落雷专用：是否已落地
  landed?: boolean;
  landTimer?: number;
  targetX?: number;
  targetY?: number;
}

export function spawnHolyBolt(x: number, y: number, facing: 1 | -1): Projectile {
  return {
    x, y, vx: facing * 900, vy: 0,
    life: 1.2, maxLife: 1.2, radius: 12, damage: 35,
    kind: "holyBolt", color: "#fff7d0", pierce: true, hitSet: new Set(),
  };
}

export function spawnLightning(targetX: number, targetY: number): Projectile {
  return {
    x: targetX, y: 0, vx: 0, vy: 0,
    life: 0.5, maxLife: 0.5, radius: 30, damage: 50,
    kind: "lightning", color: "#5fd0ff", pierce: true, hitSet: new Set(),
    landed: false, landTimer: 0.3, targetX, targetY: targetY || GROUND_Y,
  };
}

export function spawnPoisonBall(x: number, y: number, vx: number, vy: number): Projectile {
  return {
    x, y, vx, vy,
    life: 3, maxLife: 3, radius: 16, damage: 22,
    kind: "poisonBall", color: "#7bc043", pierce: false, hitSet: new Set(),
  };
}

export function spawnIceSpike(x: number, y: number, vx: number, vy: number): Projectile {
  return {
    x, y, vx, vy,
    life: 2.5, maxLife: 2.5, radius: 10, damage: 20,
    kind: "iceSpike", color: "#9ad8ff", pierce: false, hitSet: new Set(),
  };
}

export function spawnShadowBolt(x: number, y: number, vx: number, vy: number): Projectile {
  return {
    x, y, vx, vy,
    life: 4, maxLife: 4, radius: 14, damage: 25,
    kind: "shadowBolt", color: "#7b5ea7", pierce: false, hitSet: new Set(),
  };
}

export class ProjectileSystem {
  list: Projectile[] = [];

  add(p: Projectile) {
    if (this.list.length < 60) this.list.push(p);
  }

  update(dt: number, onHitPlayer: (p: Projectile) => void) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      if (p.kind === "lightning") {
        // 落雷：等待落地
        p.landTimer = (p.landTimer ?? 0) - dt;
        if ((p.landTimer ?? 0) <= 0 && !p.landed) {
          p.landed = true;
        }
        if (p.landed && p.life < 0.1) {
          this.list.splice(i, 1);
        }
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 600 * dt; // 重力（光弹除外）
        if (p.kind === "holyBolt") p.vy = 0;
        // 触地反弹/消失
        if (p.y >= GROUND_Y && p.kind !== "holyBolt") {
          this.list.splice(i, 1);
          continue;
        }
        // 命中玩家
        onHitPlayer(p);
      }
    }
  }

  clear() {
    this.list.length = 0;
  }
}

/** 绘制投射物 */
export function drawProjectiles(
  ctx: CanvasRenderingContext2D,
  list: Projectile[],
  particles: Particle[],
) {
  void particles;
  for (const p of list) {
    ctx.save();
    switch (p.kind) {
      case "holyBolt": {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.5, p.color);
        g.addColorStop(1, "rgba(255,247,208,0)");
        ctx.fillStyle = g;
        ctx.fillRect(p.x - 24, p.y - 24, 48, 48);
        // 拖尾
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 14, p.y - 2, 14, 4);
        break;
      }
      case "lightning": {
        if (!p.landed) {
          // 预警标记
          ctx.strokeStyle = "rgba(95,208,255,0.4)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(p.targetX ?? p.x, 0);
          ctx.lineTo(p.targetX ?? p.x, VIEW_H);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // 落雷主体
          const tx = p.targetX ?? p.x;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 4;
          ctx.beginPath();
          let y = 0;
          let x = tx;
          ctx.moveTo(x, y);
          while (y < (p.targetY ?? GROUND_Y)) {
            y += 20;
            x = tx + (Math.random() - 0.5) * 20;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          // 落地圆光
          const g = ctx.createRadialGradient(tx, p.targetY ?? GROUND_Y, 0, tx, p.targetY ?? GROUND_Y, 60);
          g.addColorStop(0, "rgba(95,208,255,0.7)");
          g.addColorStop(1, "rgba(95,208,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(tx - 60, (p.targetY ?? GROUND_Y) - 60, 120, 120);
        }
        break;
      }
      case "poisonBall":
      case "iceSpike":
      case "shadowBolt": {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        // 光晕
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        g.addColorStop(0, p.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.radius * 2, p.y - p.radius * 2, p.radius * 4, p.radius * 4);
        ctx.globalAlpha = 1;
        break;
      }
    }
    ctx.restore();
  }
}
