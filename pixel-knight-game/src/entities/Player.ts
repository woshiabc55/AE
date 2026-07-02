// 骑士实体：状态机 + 物理 + 连斩 + 技能释放

import {
  PLAYER, GRAVITY, GROUND_Y, WORLD_LEFT, WORLD_RIGHT, COMBO_TIMEOUT, FOCUS,
} from "@/config";
import type { InputState, PlayerStateName, PassiveId } from "@/types";
import { drawKnight, type KnightDrawOpts } from "@/sprites/knight";

const ATTACK_STATES: PlayerStateName[] = ["attack1", "attack2", "attack3"];

export interface HitBox {
  x: number;
  y: number;
  w: number;
  h: number;
  damage: number;
  knockback: number;
  crit: boolean;
}

export class Player {
  x = 200;
  y = GROUND_Y;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = 1;
  hp: number = PLAYER.maxHp;
  maxHp: number = PLAYER.maxHp;

  // 专注值（技能资源）
  focus = 0;
  maxFocus = FOCUS.max;

  state: PlayerStateName = "idle";
  stateTime = 0;
  runPhase = 0;

  attackIndex = 0;
  attackProgress = 0;
  private comboQueued = false;

  comboCount = 0;
  comboTimer = 0;
  maxCombo = 0;

  invincibleTimer = 0;
  dashCooldown = 0;
  jumpsLeft = 2;
  grounded = true;

  flash = 0;
  dead = false;

  // 技能释放
  castTimer = 0;
  castTotal = 0;
  meteorPending = false; // 陨星斩待落地

  // 被动
  passives = new Set<PassiveId>();
  reviveUsed = false;

  // 临时 buff（由技能系统设置）
  bloodlustActive = false;

  update(dt: number, input: InputState) {
    this.stateTime += dt;
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
    if (this.dashCooldown > 0) this.dashCooldown -= dt;
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 3);
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }

    if (this.dead) {
      this.vx = 0;
      this.applyGravity(dt);
      this.integrate(dt);
      return;
    }

    // 陨星斩落地触发
    if (this.meteorPending && this.grounded) {
      this.meteorPending = false;
      this.meteorImpact();
    }

    // 释放技能中
    if (this.state === "cast") {
      this.castTimer -= dt;
      this.vx *= 0.7;
      if (this.castTimer <= 0) {
        this.setState(this.grounded ? "idle" : "fall");
      }
    } else if (ATTACK_STATES.includes(this.state)) {
      this.updateAttack(dt, input);
    } else if (this.state === "dash") {
      this.updateDash(dt);
    } else if (this.state === "hurt") {
      this.vx *= 0.85;
      if (this.stateTime > 0.32) this.setState("idle");
    } else {
      this.updateNormal(dt, input);
    }

    this.applyGravity(dt);
    this.integrate(dt);
    this.clampWorld();
  }

  /** 陨星斩落地伤害（由引擎查询后施加到敌人） */
  private meteorImpact() {
    // 仅标记，实际伤害由 SkillManager / GameEngine 在落地帧处理
    this._meteorJustLanded = true;
  }
  _meteorJustLanded = false;

  private updateNormal(dt: number, input: InputState) {
    // 攻击
    if (input.attackPressed) {
      this.startAttack(0);
      return;
    }
    // 冲刺（迅捷之风被动减少冷却）
    if (input.dashPressed && this.dashCooldown <= 0) {
      this.startDash();
      return;
    }
    // 跳跃
    if (input.jumpPressed && this.jumpsLeft > 0) {
      this.vy = this.jumpsLeft === 2 ? PLAYER.jumpVel : PLAYER.doubleJumpVel;
      this.jumpsLeft--;
      this.grounded = false;
      this.setState("jump");
    }

    // 移动
    const move = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (move !== 0) {
      this.facing = move > 0 ? 1 : -1;
      const speedMul = this.passives.has("swift") ? 1.15 : 1;
      const target = move * PLAYER.speed * speedMul;
      const accel = this.grounded ? 1 : PLAYER.airControl;
      this.vx += (target - this.vx) * Math.min(1, dt * 14 * accel);
      this.runPhase += dt * 14;
      if (this.grounded) this.setState("run");
    } else {
      this.vx *= this.grounded ? 0.7 : 0.95;
      if (this.grounded) this.setState("idle");
    }

    if (!this.grounded) {
      this.setState(this.vy < 0 ? "jump" : "fall");
    }
  }

  private updateAttack(dt: number, input: number | InputState) {
    const inp = input as InputState;
    const dur = PLAYER.attackDuration[this.attackIndex];
    this.attackProgress += dt / dur;
    this.vx *= 0.8;

    // 连斩缓冲：在命中窗口后按下则排队下一段
    if (
      inp.attackPressed &&
      this.attackProgress > 0.5 &&
      this.attackIndex < 2 &&
      !this.comboQueued
    ) {
      this.comboQueued = true;
    }

    if (this.attackProgress >= 1) {
      if (this.comboQueued) {
        this.comboQueued = false;
        this.startAttack(this.attackIndex + 1);
      } else {
        this.attackIndex = 0;
        this.setState(this.grounded ? "idle" : "fall");
      }
    }
  }

  private updateDash(dt: number) {
    this.vx = this.facing * PLAYER.dashSpeed;
    if (this.stateTime >= PLAYER.dashTime) {
      this.setState(this.grounded ? "idle" : "fall");
    }
  }

  private startAttack(index: number) {
    this.attackIndex = index;
    this.attackProgress = 0;
    this.comboQueued = false;
    this.setState(`attack${index + 1}` as PlayerStateName);
  }

  private startDash() {
    this.setState("dash");
    this.invincibleTimer = PLAYER.invincibleDash;
    this.dashCooldown = this.passives.has("swift") ? PLAYER.dashCooldown * 0.7 : PLAYER.dashCooldown;
  }

  setState(s: PlayerStateName) {
    if (this.state !== s) {
      this.state = s;
      this.stateTime = 0;
    }
  }

  private applyGravity(dt: number) {
    if (this.state === "dash") return; // 冲刺保持轨迹
    this.vy += GRAVITY * dt;
  }

  private integrate(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
      if (!this.grounded) {
        this.grounded = true;
        this.jumpsLeft = 2;
        if (!ATTACK_STATES.includes(this.state) && this.state !== "hurt" && !this.dead) {
          this.setState("idle");
        }
      }
    } else {
      this.grounded = false;
    }
  }

  private clampWorld() {
    const hw = PLAYER.width / 2;
    this.x = Math.max(WORLD_LEFT + hw, Math.min(WORLD_RIGHT - hw, this.x));
  }

  /** 当前攻击的命中盒（仅在命中窗口内有效） */
  getHitBox(): HitBox | null {
    if (!ATTACK_STATES.includes(this.state)) return null;
    const idx = this.state === "attack1" ? 0 : this.state === "attack2" ? 1 : 2;
    if (
      this.attackProgress < PLAYER.attackHitStart[idx] ||
      this.attackProgress > PLAYER.attackHitEnd[idx]
    )
      return null;
    const reach = PLAYER.attackReach;
    const bx = this.facing === 1 ? this.x + 6 : this.x - 6 - reach;
    // 暴击判定
    const critChance = this.passives.has("critMaster") ? 0.25 : 0;
    const crit = Math.random() < critChance;
    let dmg: number = PLAYER.attackDamage[idx];
    if (crit) dmg = Math.round(dmg * 1.8);
    // 嗜血狂怒期间攻速不影响伤害
    return {
      x: bx,
      y: this.y - PLAYER.height * 0.85,
      w: reach,
      h: PLAYER.attackHeight,
      damage: dmg,
      knockback: 360 + idx * 80,
      crit,
    };
  }

  isInvincible() {
    return this.invincibleTimer > 0 || this.state === "dash";
  }

  takeHit(damage: number, fromX: number): boolean {
    if (this.isInvincible() || this.dead) return false;
    // 钢铁意志减伤
    const dmg = this.passives.has("ironWill") ? Math.round(damage * 0.8) : damage;
    this.hp = Math.max(0, this.hp - dmg);
    this.invincibleTimer = PLAYER.hurtInvincible;
    this.flash = 1;
    const dir = this.x < fromX ? -1 : 1;
    this.vx = dir * 280 * (1 - PLAYER.knockbackResist);
    this.vy = -260;
    this.comboCount = 0;
    if (this.hp <= 0) {
      // 光之护佑：复活一次
      if (this.passives.has("lightBlessing") && !this.reviveUsed) {
        this.reviveUsed = true;
        this.hp = Math.round(this.maxHp * 0.4);
        this.invincibleTimer = 2;
        this.flash = 0;
        this.setState("idle");
      } else {
        this.dead = true;
        this.setState("dead");
      }
    } else {
      this.setState("hurt");
    }
    return true;
  }

  /** 命中敌人时调用（连击 +1，专注回复，吸血） */
  registerHit(damageDealt: number) {
    this.comboCount++;
    this.comboTimer = COMBO_TIMEOUT;
    if (this.comboCount > this.maxCombo) this.maxCombo = this.comboCount;
    this.focus = Math.min(this.maxFocus, this.focus + FOCUS.perHit);
    // 吸血被动
    if (this.passives.has("lifesteal")) {
      this.hp = Math.min(this.maxHp, this.hp + Math.round(damageDealt * 0.05));
    }
    // 嗜血狂怒期间额外吸血
    if (this.bloodlustActive) {
      this.hp = Math.min(this.maxHp, this.hp + Math.round(damageDealt * 0.25));
    }
  }

  getDrawOpts(): KnightDrawOpts {
    return {
      state: this.state,
      t: this.stateTime,
      runPhase: this.runPhase,
      attackProgress: this.attackProgress,
      attackIndex: this.attackIndex,
      flash: this.flash,
    };
  }
}
