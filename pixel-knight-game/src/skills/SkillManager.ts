// 技能管理器：冷却、专注值消耗、释放与效果调度

import { SKILLS, SKILL_ORDER, FOCUS, PLAYER } from "@/config";
import type { SkillId, InputState } from "@/types";
import type { Player } from "@/entities/Player";
import type { Enemy } from "@/entities/Enemy";
import type { Particles } from "@/fx/Particles";
import type { Camera } from "@/engine/Camera";
import { aabbOverlap } from "@/entities/Enemy";
import { spawnHolyBolt, spawnLightning, type Projectile } from "./Projectiles";

export interface SkillContext {
  player: Player;
  enemies: Enemy[];
  particles: Particles;
  camera: Camera;
  time: number;
  projectiles: Projectile[];
  spawnEnemy?: (e: Enemy) => void;
}

export class SkillManager {
  cooldowns: Record<SkillId, number> = this.zero();
  // 释放中技能（cast 进行中）
  casting: { id: SkillId; timer: number } | null = null;
  // buff
  bloodlustTimer = 0;

  private zero(): Record<SkillId, number> {
    const o = {} as Record<SkillId, number>;
    for (const id of SKILL_ORDER) o[id] = 0;
    return o;
  }

  get isCasting() {
    return this.casting !== null;
  }

  update(dt: number, ctx: SkillContext) {
    // 冷却递减
    for (const id of SKILL_ORDER) {
      if (this.cooldowns[id] > 0) this.cooldowns[id] = Math.max(0, this.cooldowns[id] - dt);
    }
    // 专注自动回复
    ctx.player.focus = Math.min(
      ctx.player.maxFocus,
      ctx.player.focus + FOCUS.regenPerSec * dt,
    );
    // buff 计时
    if (this.bloodlustTimer > 0) {
      this.bloodlustTimer = Math.max(0, this.bloodlustTimer - dt);
    }
    // 释放进行中
    if (this.casting) {
      this.casting.timer -= dt;
      if (this.casting.timer <= 0) {
        this.fire(this.casting.id, ctx);
        this.casting = null;
      }
    }
  }

  /** 尝试释放技能（输入边沿触发） */
  tryCast(input: InputState, ctx: SkillContext) {
    if (this.casting) return; // 释放中不能再放
    if (ctx.player.state === "hurt" || ctx.player.dead) return;
    for (const id of SKILL_ORDER) {
      if (!input.skillPressed[id]) continue;
      const def = SKILLS[id];
      if (this.cooldowns[id] > 0) continue;
      if (ctx.player.focus < def.cost) continue;
      // 开始释放
      ctx.player.focus -= def.cost;
      this.cooldowns[id] = def.cooldown;
      this.casting = { id, timer: def.castTime };
      ctx.player.setState("cast");
      ctx.player.castTimer = def.castTime;
      ctx.player.castTotal = def.castTime;
      // 即时类技能（无 castTime 或 0.3 以下）立即触发也走 fire
      return;
    }
  }

  /** 技能效果触发 */
  private fire(id: SkillId, ctx: SkillContext) {
    const p = ctx.player;
    switch (id) {
      case "whirlwind":
        this.fireWhirlwind(ctx);
        break;
      case "shieldBash":
        this.fireShieldBash(ctx);
        break;
      case "dashSlash":
        this.fireDashSlash(ctx);
        break;
      case "holyBolt":
        this.fireHolyBolt(ctx);
        break;
      case "meteor":
        this.fireMeteor(ctx);
        break;
      case "bloodlust":
        this.fireBloodlust(ctx);
        break;
      case "thunder":
        this.fireThunder(ctx);
        break;
      case "dawn":
        this.fireDawn(ctx);
        break;
    }
    void p;
  }

  // ===== 旋风斩：360° AOE =====
  private fireWhirlwind(ctx: SkillContext) {
    const p = ctx.player;
    const r = 130;
    for (const e of ctx.enemies) {
      if (e.dead) continue;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      if (dx * dx + dy * dy < r * r) {
        const dir = dx > 0 ? 1 : -1;
        e.takeHit(45, 520, p.x);
        ctx.particles.blood(e.x, e.y - 30, dir, 8);
      }
    }
    // 旋风粒子
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.particles.list.push({
        x: p.x + Math.cos(a) * 20,
        y: p.y - 40 + Math.sin(a) * 20,
        vx: Math.cos(a) * 280,
        vy: Math.sin(a) * 120,
        life: 0.4, maxLife: 0.4, size: 3,
        color: "#dce4f4", gravity: 0, kind: "holy",
      });
    }
    ctx.camera.addShake(8);
  }

  // ===== 盾击：眩晕 =====
  private fireShieldBash(ctx: SkillContext) {
    const p = ctx.player;
    const reach = 90;
    const box = {
      x: p.facing === 1 ? p.x : p.x - reach,
      y: p.y - 70,
      w: reach,
      h: 80,
    };
    for (const e of ctx.enemies) {
      if (e.dead) continue;
      if (aabbOverlap(box, e.getBounds())) {
        e.takeHit(30, 700, p.x);
        e.stun(1.2);
        ctx.particles.spark(e.x, e.y - 40, 10);
      }
    }
    ctx.camera.addShake(6);
  }

  // ===== 突进斩 =====
  private fireDashSlash(ctx: SkillContext) {
    const p = ctx.player;
    p.vx = p.facing * 900;
    p.invincibleTimer = Math.max(p.invincibleTimer, 0.25);
    const reach = 140;
    const box = {
      x: p.facing === 1 ? p.x : p.x - reach,
      y: p.y - 70,
      w: reach,
      h: 80,
    };
    for (const e of ctx.enemies) {
      if (e.dead) continue;
      if (aabbOverlap(box, e.getBounds())) {
        e.takeHit(55, 600, p.x);
        ctx.particles.blood(e.x, e.y - 30, p.facing, 8);
      }
    }
    // 残影粒子
    for (let i = 0; i < 12; i++) {
      ctx.particles.list.push({
        x: p.x, y: p.y - 30 - i * 4,
        vx: -p.facing * 60, vy: 0,
        life: 0.3, maxLife: 0.3, size: 3,
        color: "#5fd0ff", gravity: 0, kind: "holy",
      });
    }
  }

  // ===== 圣光弹：远程穿透 =====
  private fireHolyBolt(ctx: SkillContext) {
    const p = ctx.player;
    ctx.projectiles.push(spawnHolyBolt(p.x, p.y - 40, p.facing));
  }

  // ===== 陨星斩：跃起下劈 =====
  private fireMeteor(ctx: SkillContext) {
    const p = ctx.player;
    p.vy = -700;
    p.grounded = false;
    // 标记下劈触发（落地时检测）
    p.meteorPending = true;
    ctx.particles.spark(p.x, p.y - 40, 12);
  }

  // ===== 嗜血狂怒 =====
  private fireBloodlust(ctx: SkillContext) {
    this.bloodlustTimer = 8;
    const p = ctx.player;
    for (let i = 0; i < 16; i++) {
      ctx.particles.list.push({
        x: p.x, y: p.y - 40,
        vx: (Math.random() - 0.5) * 200,
        vy: -Math.random() * 200,
        life: 0.8, maxLife: 0.8, size: 3,
        color: "#c01828", gravity: -200, kind: "blood",
      });
    }
  }

  // ===== 雷霆审判：3 道落雷 =====
  private fireThunder(ctx: SkillContext) {
    const p = ctx.player;
    const targets = ctx.enemies.filter((e) => !e.dead).slice(0, 3);
    if (targets.length === 0) {
      // 没目标就朝前方落雷
      for (let i = 0; i < 3; i++) {
        ctx.projectiles.push(spawnLightning(p.x + p.facing * (120 + i * 80), 0));
      }
    } else {
      for (const t of targets) {
        ctx.projectiles.push(spawnLightning(t.x, t.y));
        t.takeHit(50, 0, p.x);
        ctx.particles.spark(t.x, t.y - 40, 12);
      }
    }
    ctx.camera.addShake(12);
  }

  // ===== 晨曦终焉：全屏光柱 =====
  private fireDawn(ctx: SkillContext) {
    const p = ctx.player;
    for (const e of ctx.enemies) {
      if (e.dead) continue;
      e.takeHit(180, 0, p.x);
      ctx.particles.blood(e.x, e.y - 40, 0, 16);
      ctx.particles.spark(e.x, e.y - 40, 14);
    }
    // 全屏光柱粒子
    for (let i = 0; i < 80; i++) {
      ctx.particles.list.push({
        x: Math.random() * 1280,
        y: 720,
        vx: 0,
        vy: -600 - Math.random() * 400,
        life: 1.2, maxLife: 1.2, size: 4,
        color: "#ffd23f", gravity: -200, kind: "holy",
      });
    }
    ctx.camera.addShake(20);
  }
}
