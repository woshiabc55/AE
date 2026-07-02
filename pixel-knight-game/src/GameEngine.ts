// 游戏引擎门面：组装输入/世界/渲染/状态同步

import { Input } from "@/engine/Input";
import { Camera } from "@/engine/Camera";
import { Renderer } from "@/engine/Renderer";
import { GameLoop } from "@/engine/GameLoop";
import { Particles } from "@/fx/Particles";
import { Player } from "@/entities/Player";
import { Enemy, aabbOverlap } from "@/entities/Enemy";
import { Spawner } from "@/world/Spawner";
import { useGameStore } from "@/store/useGameStore";
import {
  PLAYER, ENEMY, SCORE_PER_HIT, GROUND_Y,
} from "@/config";
import type { EngineSnapshot, GamePhase, InputState } from "@/types";

const NEUTRAL_INPUT: InputState = {
  left: false, right: false, up: false, down: false,
  jumpHeld: false, attackHeld: false, dashHeld: false, blockHeld: false,
  jumpPressed: false, attackPressed: false, dashPressed: false, blockPressed: false,
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private input = new Input();
  camera = new Camera();
  private renderer = new Renderer();
  private particles = new Particles();
  private spawner = new Spawner();
  private loop: GameLoop;

  player = new Player();
  enemies: Enemy[] = [];

  private time = 0;
  private flashRed = 0;
  private score = 0;
  private lastAttackSig = "";
  private hitSet = new Set<Enemy>();
  private resultPending: GamePhase | null = null;
  private resultTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D 不可用");
    this.ctx = ctx;
    this.spawner.onVictory = () => {
      this.resultPending = "victory";
      this.resultTimer = 0;
    };
    this.loop = new GameLoop(this.update, this.render);
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
    this.enemies = [];
    this.particles.clear();
    this.spawner = new Spawner();
    this.spawner.onVictory = () => {
      this.resultPending = "victory";
      this.resultTimer = 0;
    };
    this.spawner.start();
    this.camera = new Camera();
    this.score = 0;
    this.flashRed = 0;
    this.resultPending = null;
    this.resultTimer = 0;
    this.hitSet.clear();
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
      // 标题界面：相机缓动巡视，骑士保持待机
      this.camera.x += dt * 30;
      if (this.camera.x > 800) this.camera.x = -200;
      this.player.update(dt, NEUTRAL_INPUT);
      this.particles.update(dt);
      this.camera.update(dt);
    } else {
      // 暂停 / 胜利 / 失败：仅推进粒子与摄像机
      this.particles.update(dt);
      this.camera.update(dt);
    }

    this.input.endFrame();
    this.pushSnapshot(phase);
  };

  private updatePlaying(dt: number, input: ReturnType<Input["poll"]>) {
    this.player.update(dt, input);
    for (const e of this.enemies) e.update(dt, this.player.x, this.player.y);

    this.resolveCombat();

    this.spawner.update(dt, this.enemies, () => {
      /* 出生回调（可加出场特效） */
    });

    // 移除已被标记移除的敌人
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].removeMe) this.enemies.splice(i, 1);
    }

    this.particles.update(dt);
    this.camera.follow(this.player.x, this.player.y, dt);
    this.camera.update(dt);

    if (this.flashRed > 0) this.flashRed = Math.max(0, this.flashRed - dt * 2);

    // 结算计时
    if (this.resultPending) {
      this.resultTimer += dt;
      const delay = this.resultPending === "defeat" ? 1.3 : 1.0;
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
          const dir = this.player.facing;
          const killed = e.takeHit(hb.damage, hb.knockback, this.player.x);
          this.hitSet.add(e);
          this.player.registerHit();
          // 命中特效
          const hx = e.x - dir * 10;
          const hy = e.y - ENEMY.height * 0.6;
          this.particles.blood(hx, hy, dir, 8);
          this.particles.spark(hx, hy, 6);
          this.camera.addShake(4);
          this.score += Math.round(
            SCORE_PER_HIT * (1 + this.player.comboCount * 0.1),
          );
          if (killed) {
            this.particles.blood(hx, hy, dir, 14);
            this.particles.dust(e.x, e.y, 8);
            this.camera.addShake(7);
            this.score += Math.round(
              ENEMY.scoreValue * (1 + this.player.comboCount * 0.05),
            );
            this.spawner.notifyKill();
          }
        }
      }
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
          this.particles.blood(
            this.player.x,
            this.player.y - PLAYER.height * 0.6,
            -e.facing,
            8,
          );
          this.camera.addShake(9);
        }
      }
    }
  }

  private render = () => {
    this.renderer.draw(this.ctx, {
      player: this.player,
      enemies: this.enemies,
      particles: this.particles,
      camera: this.camera,
      time: this.time,
      flashRed: this.flashRed,
      paused: useGameStore.getState().phase === "paused",
    });
  };

  private pushSnapshot(phase: GamePhase) {
    const snap: EngineSnapshot = {
      phase,
      hp: Math.ceil(this.player.hp),
      maxHp: this.player.maxHp,
      combo: this.player.comboCount,
      maxCombo: this.player.maxCombo,
      score: this.score,
      wave: this.spawner.wave,
      totalWaves: this.spawner.totalWaves,
      enemiesLeft: this.spawner.enemiesLeft,
      waveLabel: this.spawner.waveLabel,
      flashRed: this.flashRed,
    };
    useGameStore.getState().sync(snap);
  }
}
