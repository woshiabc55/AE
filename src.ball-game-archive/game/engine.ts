import type { Enemy, Level, Player, RuntimeStats, Vec2, Wall } from './types';
import { ParticleSystem } from './particles';
import type { LevelTheme } from './theme';
import {
  circleVsCircle,
  resolveEnemyWalls,
  resolvePlayerWalls,
} from './collision';
import { PLAYER_SPAWN, WORLD_H, WORLD_W } from './level';

const PLAYER_ACCEL = 1200;
const PLAYER_MAX_SPEED = 360;
const PLAYER_FRICTION = 6; // 越大停得越快
const DASH_SPEED = 700;
const DASH_DURATION = 0.18; // 秒
const DASH_COOLDOWN = 0.5;
const PLAYER_INVULN_AFTER_HIT = 1.0;
const CHASE_RANGE = 220;
const ENEMY_FRICTION = 2;
const WALL_HIT_DMG_INTERVAL = 0.6; // 同一面墙重复伤害间隔

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  dashQueued: boolean;
};

export type EngineCallbacks = {
  onScore: (delta: number) => void;
  onPlayerHit: () => void;
  onEnemyKilled: (enemy: Enemy) => void;
  onWin: () => void;
  onLose: () => void;
};

export class GameEngine {
  level: Level;
  player: Player;
  enemies: Enemy[];
  walls: Wall[];
  particles: ParticleSystem;
  callbacks: EngineCallbacks;
  input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    dashQueued: false,
  };
  dashCooldownLeft = 0;
  // 记录玩家对每面墙的最近碰撞时间,避免被同一面墙连续扣血
  private wallHitCooldown = new WeakMap<Wall, number>();
  stats: RuntimeStats = { score: 0, kills: 0, elapsedMs: 0, hp: 5 };
  // 摄像机偏移(以世界中心为基准)
  camera = { x: WORLD_W / 2, y: WORLD_H / 2 };
  viewport = { w: 0, h: 0 };
  theme: LevelTheme = {
    id: 1,
    name: '',
    primary: '#22D3EE',
    accent: '#A855F7',
    glow: '#22D3EE',
    background: '#0A0A14',
    grid: '#1E1B4B',
  };
  ended = false;

  constructor(
    level: Level,
    particles: ParticleSystem,
    callbacks: EngineCallbacks,
    theme: LevelTheme
  ) {
    this.level = level;
    this.walls = level.walls;
    this.particles = particles;
    this.callbacks = callbacks;
    this.theme = theme;
    this.player = this.createPlayer();
    this.enemies = level.enemies.map((e, i) => ({
      id: i,
      pos: { ...e.pos },
      vel: { x: 0, y: 0 },
      radius: e.radius,
      state: 'PATROL',
      hp: e.hp,
      maxHp: e.hp,
      patrolTarget: { ...e.pos },
      speed: e.speed,
      color: e.color,
      alive: true,
      hitFlashUntilMs: 0,
    }));
    this.stats.hp = this.player.hp;
  }

  private createPlayer(): Player {
    return {
      pos: { ...PLAYER_SPAWN },
      vel: { x: 0, y: 0 },
      radius: 16,
      hp: 5,
      maxHp: 5,
      alive: true,
      dashUntilMs: 0,
      invulnUntilMs: 0,
    };
  }

  resize(w: number, h: number) {
    this.viewport.w = w;
    this.viewport.h = h;
  }

  reset() {
    this.player = this.createPlayer();
    this.enemies = this.level.enemies.map((e, i) => ({
      id: i,
      pos: { ...e.pos },
      vel: { x: 0, y: 0 },
      radius: e.radius,
      state: 'PATROL',
      hp: e.hp,
      maxHp: e.hp,
      patrolTarget: { ...e.pos },
      speed: e.speed,
      color: e.color,
      alive: true,
      hitFlashUntilMs: 0,
    }));
    this.stats = { score: 0, kills: 0, elapsedMs: 0, hp: this.player.hp };
    this.ended = false;
    this.dashCooldownLeft = 0;
  }

  update(dt: number, timeMs: number) {
    if (this.ended) {
      // 即使结束也让粒子继续动
      this.particles.update(dt);
      return;
    }
    this.stats.elapsedMs = timeMs;
    this.updatePlayer(dt, timeMs);
    this.updateEnemies(dt, timeMs);
    this.resolvePlayerEnemyCollisions(timeMs);
    this.particles.update(dt);
    this.checkEnd();
  }

  private updatePlayer(dt: number, timeMs: number) {
    const p = this.player;
    if (!p.alive) return;

    // 输入方向
    const dir: Vec2 = { x: 0, y: 0 };
    if (this.input.left) dir.x -= 1;
    if (this.input.right) dir.x += 1;
    if (this.input.up) dir.y -= 1;
    if (this.input.down) dir.y += 1;
    const mag = Math.hypot(dir.x, dir.y);
    if (mag > 0) {
      dir.x /= mag;
      dir.y /= mag;
    }

    // 处理冲刺
    if (this.dashCooldownLeft > 0) this.dashCooldownLeft -= dt;
    const dashing = timeMs < p.dashUntilMs;
    if (this.input.dashQueued && this.dashCooldownLeft <= 0 && mag > 0) {
      p.dashUntilMs = timeMs + DASH_DURATION * 1000;
      this.dashCooldownLeft = DASH_COOLDOWN;
      // 爆发冲量
      p.vel.x = dir.x * DASH_SPEED;
      p.vel.y = dir.y * DASH_SPEED;
      this.input.dashQueued = false;
      this.particles.burst(p.pos, this.theme.primary, 18);
    } else {
      this.input.dashQueued = false;
    }

    if (!dashing) {
      // 加速 + 摩擦
      p.vel.x += dir.x * PLAYER_ACCEL * dt;
      p.vel.y += dir.y * PLAYER_ACCEL * dt;
      const fric = Math.max(0, 1 - PLAYER_FRICTION * dt);
      if (mag === 0) {
        p.vel.x *= fric;
        p.vel.y *= fric;
      }
    }

    // 限速
    const speed = Math.hypot(p.vel.x, p.vel.y);
    if (speed > PLAYER_MAX_SPEED && !dashing) {
      const k = PLAYER_MAX_SPEED / speed;
      p.vel.x *= k;
      p.vel.y *= k;
    }

    // 应用速度
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;

    // 撞墙反弹
    resolvePlayerWalls(p, this.walls, (contact, normal) => {
      const last = this.wallHitCooldown.get(this.walls[0]) ?? 0; // unused - we use a per-wall map below
      // 真实记录
      for (const wall of this.walls) {
        const res = (function () {
          const closestX = Math.max(wall.x, Math.min(p.pos.x, wall.x + wall.w));
          const closestY = Math.max(wall.y, Math.min(p.pos.y, wall.y + wall.h));
          const dx = p.pos.x - closestX;
          const dy = p.pos.y - closestY;
          const distSq = dx * dx + dy * dy;
          return distSq <= p.radius * p.radius;
        })();
        if (res) {
          const lastHit = this.wallHitCooldown.get(wall) ?? -9999;
          if (timeMs - lastHit > WALL_HIT_DMG_INTERVAL * 1000) {
            this.wallHitCooldown.set(wall, timeMs);
            this.damagePlayer(1, timeMs);
          }
        }
      }
      this.particles.spark(contact, normal, this.theme.primary);
    });

    // 摄像机跟随(目标点)
    this.camera.x += (p.pos.x - this.camera.x) * Math.min(1, dt * 6);
    this.camera.y += (p.pos.y - this.camera.y) * Math.min(1, dt * 6);

    // 尾迹
    const speedRatio = Math.min(1, speed / PLAYER_MAX_SPEED);
    if (speedRatio > 0.05) {
      this.particles.trail(p.pos, this.theme.primary, 1 + speedRatio * 2);
    }
  }

  private updateEnemies(dt: number, timeMs: number) {
    for (const e of this.enemies) {
      if (!e.alive) continue;

      // 状态切换
      const distToPlayer = Math.hypot(e.pos.x - this.player.pos.x, e.pos.y - this.player.pos.y);
      e.state = distToPlayer < CHASE_RANGE ? 'CHASE' : 'PATROL';

      // 目标点
      let target: Vec2;
      if (e.state === 'CHASE') {
        target = this.player.pos;
      } else {
        // 巡逻:每 1.5~3s 重新随机一个目标
        if (Math.hypot(e.pos.x - e.patrolTarget.x, e.pos.y - e.patrolTarget.y) < 20 || Math.random() < dt * 0.5) {
          e.patrolTarget = {
            x: 100 + Math.random() * (WORLD_W - 200),
            y: 100 + Math.random() * (WORLD_H - 200),
          };
        }
        target = e.patrolTarget;
      }

      // 加速
      const dx = target.x - e.pos.x;
      const dy = target.y - e.pos.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      e.vel.x += (dx / d) * e.speed * 3 * dt;
      e.vel.y += (dy / d) * e.speed * 3 * dt;

      const fric = Math.max(0, 1 - ENEMY_FRICTION * dt);
      e.vel.x *= fric;
      e.vel.y *= fric;

      // 限速
      const sp = Math.hypot(e.vel.x, e.vel.y);
      if (sp > e.speed) {
        const k = e.speed / sp;
        e.vel.x *= k;
        e.vel.y *= k;
      }

      e.pos.x += e.vel.x * dt;
      e.pos.y += e.vel.y * dt;
      resolveEnemyWalls(e, this.walls);
    }
  }

  private resolvePlayerEnemyCollisions(timeMs: number) {
    const p = this.player;
    if (!p.alive) return;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const res = circleVsCircle(p.pos, p.radius, e.pos, e.radius);
      if (!res.hit) continue;
      // 区分撞击方向
      const dashing = timeMs < p.dashUntilMs;
      if (dashing) {
        // 玩家冲刺 -> 撞死敌人
        e.hp -= 1;
        e.hitFlashUntilMs = timeMs + 200;
        // 敌人弹开
        e.vel.x += res.normal.x * 300;
        e.vel.y += res.normal.y * 300;
        if (e.hp <= 0) {
          e.alive = false;
          this.particles.burst(e.pos, e.color, 36);
          this.stats.score += 10 * p.maxHp;
          this.stats.kills += 1;
          this.callbacks.onEnemyKilled(e);
          this.callbacks.onScore(10 * p.maxHp);
        } else {
          this.particles.spark(e.pos, res.normal, e.color);
        }
        // 反作用力,玩家也受到微弱反弹
        p.vel.x -= res.normal.x * 80;
        p.vel.y -= res.normal.y * 80;
      } else {
        // 普通接触 -> 玩家受到伤害,敌人被弹开
        if (timeMs > p.invulnUntilMs) {
          this.damagePlayer(1, timeMs);
        }
        p.vel.x = -res.normal.x * 220 + (Math.random() - 0.5) * 60;
        p.vel.y = -res.normal.y * 220 + (Math.random() - 0.5) * 60;
        e.vel.x = res.normal.x * 200;
        e.vel.y = res.normal.y * 200;
        this.particles.spark(
          { x: (p.pos.x + e.pos.x) / 2, y: (p.pos.y + e.pos.y) / 2 },
          { x: -res.normal.x, y: -res.normal.y },
          '#F43F5E'
        );
      }
    }
  }

  private damagePlayer(amount: number, timeMs: number) {
    const p = this.player;
    p.hp -= amount;
    p.invulnUntilMs = timeMs + PLAYER_INVULN_AFTER_HIT * 1000;
    this.stats.hp = Math.max(0, p.hp);
    this.particles.burst(p.pos, '#F43F5E', 20);
    this.callbacks.onPlayerHit();
  }

  private checkEnd() {
    if (this.ended) return;
    if (this.player.hp <= 0) {
      this.ended = true;
      this.callbacks.onLose();
      return;
    }
    if (this.enemies.every((e) => !e.alive)) {
      this.ended = true;
      this.callbacks.onWin();
    }
  }
}
