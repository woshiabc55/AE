// 游戏引擎门面：组装输入/世界/渲染/状态同步/技能/关卡/Boss

import { Input } from "@/engine/Input";
import { Camera } from "@/engine/Camera";
import { Renderer } from "@/engine/Renderer";
import { GameLoop } from "@/engine/GameLoop";
import { Particles } from "@/fx/Particles";
import { Player } from "@/entities/Player";
import { Enemy, aabbOverlap } from "@/entities/Enemy";
import { Boss } from "@/entities/Boss";
import { LevelManager } from "@/world/LevelManager";
import { SkillManager } from "@/skills/SkillManager";
import { ProjectileSystem, drawProjectiles, type Projectile } from "@/skills/Projectiles";
import { useGameStore } from "@/store/useGameStore";
import {
  PLAYER, ENEMY, SCORE_PER_HIT, FOCUS, GROUND_Y, CHAPTERS,
} from "@/config";
import type { EngineSnapshot, GamePhase, InputState, PassiveId, SkillId } from "@/types";

const NEUTRAL_INPUT: InputState = {
  left: false, right: false, up: false, down: false,
  jumpHeld: false, attackHeld: false, dashHeld: false, blockHeld: false,
  jumpPressed: false, attackPressed: false, dashPressed: false, blockPressed: false,
  skillPressed: {} as Record<SkillId, boolean>,
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private input = new Input();
  camera = new Camera();
  private renderer = new Renderer();
  private particles = new Particles();
  private levelMgr = new LevelManager();
  private skills = new SkillManager();
  private projectiles = new ProjectileSystem();
  private loop: GameLoop;

  player = new Player();
  enemies: Enemy[] = [];
  boss: Boss | null = null;
  private bossEnemies: Enemy[] = []; // boss 战中刷新的小怪

  private time = 0;
  private flashRed = 0;
  private score = 0;
  private lastAttackSig = "";
  private hitSet = new Set<Enemy>();
  private resultPending: GamePhase | null = null;
  private resultTimer = 0;
  private meteorHitSet = new Set<Enemy>();

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D 不可用");
    this.ctx = ctx;
    this.setupLevelCallbacks();
    this.loop = new GameLoop(this.update, this.render);
  }

  private setupLevelCallbacks() {
    this.levelMgr.onVictory = () => {
      this.resultPending = "victory";
      this.resultTimer = 0;
    };
    this.levelMgr.onPassivesUnlock = (ids: PassiveId[]) => {
      for (const id of ids) this.player.passives.add(id);
    };
  }

  start() {
    this.loop.start();
  }

  destroy() {
    this.loop.stop();
    this.input.destroy();
  }

  startGame() {
    this.resetWorld();
    useGameStore.getState().startGame();
  }

  restart() {
    this.resetWorld();
    useGameStore.getState().restart();
  }

  toTitle() {
    this.resetWorld();
    useGameStore.getState().toTitle();
  }

  togglePause() {
    useGameStore.getState().togglePause();
  }

  private resetWorld() {
    this.player = new Player();
    this.player.passives = new Set();
    this.enemies = [];
    this.bossEnemies = [];
    this.boss = null;
    this.particles.clear();
    this.projectiles.clear();
    this.skills = new SkillManager();
    this.levelMgr = new LevelManager();
    this.setupLevelCallbacks();
    this.levelMgr.start();
    this.camera = new Camera();
    this.score = 0;
    this.flashRed = 0;
    this.resultPending = null;
    this.resultTimer = 0;
    this.hitSet.clear();
    this.meteorHitSet.clear();
    this.input.setActive(true);
  }

  private update = (dt: number) => {
    this.time += dt;
    const store = useGameStore.getState();
    const phase = store.phase;
    const input = this.input.poll();

    if (phase === "playing") {
      this.updatePlaying(dt, input);
    } else if (phase === "title") {
      this.camera.x += dt * 30;
      if (this.camera.x > 800) this.camera.x = -200;
      this.player.update(dt, NEUTRAL_INPUT);
      this.particles.update(dt);
      this.camera.update(dt);
    } else if (phase === "bossIntro" || phase === "levelTransition") {
      // 过渡期间推进粒子和摄像机，但不更新战斗
      this.particles.update(dt);
      this.camera.update(dt);
      // 自动推进过渡
      this.levelMgr.update(dt, this.enemies, (e) => this.enemies.push(e));
    } else {
      this.particles.update(dt);
      this.camera.update(dt);
    }

    this.input.endFrame();
    this.pushSnapshot(phase);
  };

  private updatePlaying(dt: number, input: InputState) {
    // 技能系统（先更新，可能改变 cast 状态）
    this.skills.update(dt, {
      player: this.player,
      enemies: this.enemies,
      particles: this.particles,
      camera: this.camera,
      time: this.time,
      projectiles: this.projectiles.list,
      spawnEnemy: (e) => this.enemies.push(e),
    });
    this.player.bloodlustActive = this.skills.bloodlustTimer > 0;
    // 尝试释放技能
    this.skills.tryCast(input, {
      player: this.player,
      enemies: this.enemies,
      particles: this.particles,
      camera: this.camera,
      time: this.time,
      projectiles: this.projectiles.list,
      spawnEnemy: (e) => this.enemies.push(e),
    });

    this.player.update(dt, input);
    for (const e of this.enemies) e.update(dt, this.player.x, this.player.y);
    if (this.boss) {
      this.boss.update(
        dt,
        this.player.x,
        this.player.y,
        this.projectiles.list,
        (e) => this.enemies.push(e),
      );
    }

    this.resolveCombat();
    this.resolveProjectiles(dt);

    // 关卡管理器推进（波次 + boss 阶段）
    this.levelMgr.update(dt, this.enemies, (e) => this.enemies.push(e));
    // 同步关卡管理器创建的 boss 到引擎引用（出场时）
    if (!this.boss && this.levelMgr.boss) this.boss = this.levelMgr.boss;
    if (this.boss && this.boss.dead && !this.boss.removeMe) {
      this.onBossDefeated();
    }

    // 移除标记敌人
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].removeMe) {
        const e = this.enemies[i];
        this.enemies.splice(i, 1);
        if (!e.isBoss) this.levelMgr.spawner.notifyKill();
      }
    }
    if (this.boss && this.boss.removeMe) {
      this.boss = null;
    }

    this.particles.update(dt);
    this.camera.follow(this.player.x, this.player.y, dt);
    this.camera.update(dt);

    if (this.flashRed > 0) this.flashRed = Math.max(0, this.flashRed - dt * 2);

    // 结算
    if (this.resultPending) {
      this.resultTimer += dt;
      const delay = this.resultPending === "defeat" ? 1.5 : 1.0;
      if (this.resultTimer >= delay) {
        useGameStore.setState({ phase: this.resultPending });
        this.resultPending = null;
      }
    } else if (this.player.dead) {
      this.resultPending = "defeat";
      this.resultTimer = 0;
    }
  }

  private resolveCombat() {
    // 玩家攻击 → 敌人
    const hb = this.player.getHitBox();
    if (hb) {
      const sig = `${this.player.state}:${this.player.attackIndex}`;
      if (sig !== this.lastAttackSig) {
        this.hitSet.clear();
        this.lastAttackSig = sig;
      }
      for (const e of this.enemies) {
        if (e.dead || this.hitSet.has(e)) continue;
        if (aabbOverlap(hb, e.getBounds())) {
          this.applyHitToEnemy(e, hb.damage, hb.knockback, hb.crit);
          this.hitSet.add(e);
        }
      }
      // 也命中 Boss
      if (this.boss && !this.boss.dead && !this.hitSet.has(this.boss as unknown as Enemy)) {
        if (aabbOverlap(hb, this.boss.getBounds())) {
          this.applyHitToBoss(this.boss, hb.damage, hb.knockback, hb.crit);
          this.hitSet.add(this.boss as unknown as Enemy);
        }
      }
    }

    // 陨星斩落地 AOE
    if (this.player._meteorJustLanded) {
      this.player._meteorJustLanded = false;
      const r = 180;
      for (const e of this.enemies) {
        if (e.dead || this.meteorHitSet.has(e)) continue;
        const dx = e.x - this.player.x;
        if (Math.abs(dx) < r) {
          this.applyHitToEnemy(e, 80, 700, false);
          this.meteorHitSet.add(e);
        }
      }
      if (this.boss && !this.boss.dead) {
        const dx = this.boss.x - this.player.x;
        if (Math.abs(dx) < r) {
          this.applyHitToBoss(this.boss, 80, 200, false);
        }
      }
      // 落地震屏 + 粒子
      this.camera.addShake(16);
      for (let i = 0; i < 30; i++) {
        this.particles.dust(this.player.x + (Math.random() - 0.5) * 200, GROUND_Y, 1);
      }
      this.meteorHitSet.clear();
    }

    // 敌人攻击 → 玩家
    const pb = {
      x: this.player.x - PLAYER.width / 2,
      y: this.player.y - PLAYER.height,
      w: PLAYER.width,
      h: PLAYER.height,
    };
    for (const e of this.enemies) {
      if (e.dead) continue;
      const ehb = e.getHitBox();
      if (!ehb) continue;
      if (aabbOverlap(ehb, pb) && !this.player.isInvincible()) {
        const hit = this.player.takeHit(ehb.damage, e.x);
        if (hit) {
          this.flashRed = 1;
          this.particles.blood(this.player.x, this.player.y - PLAYER.height * 0.6, -e.facing, 8);
          this.camera.addShake(9);
        }
      }
    }
    // Boss 攻击 → 玩家
    if (this.boss && !this.boss.dead) {
      const bhb = this.boss.getHitBox();
      if (bhb && aabbOverlap(bhb, pb) && !this.player.isInvincible()) {
        const hit = this.player.takeHit(bhb.damage, this.boss.x);
        if (hit) {
          this.flashRed = 1;
          this.particles.blood(this.player.x, this.player.y - PLAYER.height * 0.6, -this.boss.facing, 10);
          this.camera.addShake(12);
        }
      }
    }
  }

  private applyHitToEnemy(e: Enemy, damage: number, knockback: number, crit: boolean) {
    const dir = this.player.facing;
    const killed = e.takeHit(damage, knockback, this.player.x);
    this.player.registerHit(damage);
    const hx = e.x - dir * 10;
    const hy = e.y - ENEMY.height * 0.6;
    this.particles.blood(hx, hy, dir, crit ? 12 : 8);
    this.particles.spark(hx, hy, crit ? 10 : 6);
    if (crit) this.camera.addShake(7);
    else this.camera.addShake(4);
    // 连击狂热被动：连击倍率 +
    const comboMul = this.player.passives.has("comboFrenzy") ? 0.15 : 0.1;
    this.score += Math.round(SCORE_PER_HIT * (1 + this.player.comboCount * comboMul));
    if (killed) {
      this.particles.blood(hx, hy, dir, 14);
      this.particles.dust(e.x, e.y, 8);
      this.camera.addShake(7);
      this.score += Math.round(ENEMY.scoreValue * (1 + this.player.comboCount * 0.05));
      this.player.focus = Math.min(this.player.maxFocus, this.player.focus + FOCUS.perKill);
      this.levelMgr.spawner.notifyKill();
    }
  }

  private applyHitToBoss(b: Boss, damage: number, knockback: number, crit: boolean) {
    const dir = this.player.facing;
    b.takeHit(damage, knockback, this.player.x);
    this.player.registerHit(damage);
    const hx = b.x - dir * 20;
    const hy = b.y - b.height * 0.5;
    this.particles.blood(hx, hy, dir, crit ? 14 : 8);
    this.particles.spark(hx, hy, crit ? 12 : 6);
    this.camera.addShake(crit ? 8 : 5);
    const comboMul = this.player.passives.has("comboFrenzy") ? 0.15 : 0.1;
    this.score += Math.round(SCORE_PER_HIT * 3 * (1 + this.player.comboCount * comboMul));
  }

  private resolveProjectiles(dt: number) {
    this.projectiles.update(dt, (p) => {
      // 命中玩家
      const pb = {
        x: this.player.x - PLAYER.width / 2,
        y: this.player.y - PLAYER.height,
        w: PLAYER.width,
        h: PLAYER.height,
      };
      if (
        p.kind !== "holyBolt" &&
        p.kind !== "lightning" &&
        aabbOverlap(
          { x: p.x - p.radius, y: p.y - p.radius, w: p.radius * 2, h: p.radius * 2 },
          pb,
        ) &&
        !this.player.isInvincible()
      ) {
        const hit = this.player.takeHit(p.damage, p.x);
        if (hit) {
          this.flashRed = 1;
          this.camera.addShake(6);
        }
        if (!p.pierce) p.life = 0;
      }
      // 圣光弹 / 落雷命中敌人
      if (p.kind === "holyBolt") {
        for (const e of this.enemies) {
          if (e.dead || p.hitSet.has(e)) continue;
          if (
            aabbOverlap(
              { x: p.x - p.radius, y: p.y - p.radius, w: p.radius * 2, h: p.radius * 2 },
              e.getBounds(),
            )
          ) {
            e.takeHit(p.damage, 200, this.player.x);
            this.player.registerHit(p.damage);
            this.particles.spark(p.x, p.y, 8);
            p.hitSet.add(e);
          }
        }
        if (this.boss && !this.boss.dead && !p.hitSet.has(this.boss)) {
          if (
            aabbOverlap(
              { x: p.x - p.radius, y: p.y - p.radius, w: p.radius * 2, h: p.radius * 2 },
              this.boss.getBounds(),
            )
          ) {
            this.applyHitToBoss(this.boss, p.damage, 100, false);
            p.hitSet.add(this.boss);
          }
        }
      }
      if (p.kind === "lightning" && p.landed) {
        const tx = p.targetX ?? p.x;
        const ty = p.targetY ?? GROUND_Y;
        const box = { x: tx - 40, y: ty - 40, w: 80, h: 80 };
        // 命中玩家
        const pb = {
          x: this.player.x - PLAYER.width / 2,
          y: this.player.y - PLAYER.height,
          w: PLAYER.width,
          h: PLAYER.height,
        };
        if (aabbOverlap(box, pb) && !this.player.isInvincible()) {
          this.player.takeHit(p.damage, this.player.x);
          this.flashRed = 1;
        }
      }
    });
  }

  private onBossDefeated() {
    if (!this.boss) return;
    this.particles.blood(this.boss.x, this.boss.y - this.boss.height * 0.5, 1, 30);
    this.particles.spark(this.boss.x, this.boss.y - 60, 30);
    this.camera.addShake(20);
    this.score += 2000;
    this.levelMgr.notifyBossDefeated();
  }

  private render = () => {
    this.renderer.draw(this.ctx, {
      player: this.player,
      enemies: this.enemies,
      boss: this.boss,
      particles: this.particles,
      camera: this.camera,
      time: this.time,
      flashRed: this.flashRed,
      paused: useGameStore.getState().phase === "paused",
      projectiles: this.projectiles.list,
      drawProjectiles,
    });
  };

  private pushSnapshot(phase: GamePhase) {
    const snap: EngineSnapshot = {
      phase,
      hp: Math.ceil(this.player.hp),
      maxHp: this.player.maxHp,
      focus: Math.round(this.player.focus),
      maxFocus: this.player.maxFocus,
      combo: this.player.comboCount,
      maxCombo: this.player.maxCombo,
      score: this.score,
      wave: this.levelMgr.wave,
      totalWaves: this.levelMgr.totalWaves,
      enemiesLeft: this.levelMgr.enemiesLeft,
      waveLabel: this.levelMgr.waveLabel,
      flashRed: this.flashRed,
      cooldowns: this.skills.cooldowns,
      passives: Array.from(this.player.passives),
      chapter: this.levelMgr.state.chapter,
      totalChapters: CHAPTERS.length,
      chapterName: this.levelMgr.state.chapterName,
      stage: this.levelMgr.stage,
      bossActive: this.boss !== null && !this.boss.dead,
      bossName: this.boss?.def.name ?? "",
      bossHp: this.boss?.hp ?? 0,
      bossMaxHp: this.boss?.maxHp ?? 1,
      bossPhase: this.boss?.phase ?? 1,
      transitionText: this.levelMgr.state.transitionText,
    };
    useGameStore.getState().sync(snap);
  }
}
