import * as THREE from "three";
import type { World } from "./World";
import type { Player } from "./Player";
import type { OperatorDef } from "./operators";
import { makeSoldierSprite } from "./textures";

export type BotState = "patrol" | "engage" | "seekCover" | "dead";

// 命中检测/射击解析所需的最小上下文
export interface BotContext {
  world: World;
  capturePos: THREE.Vector3;
  alphaSpawns: { x: number; z: number }[];
  bravoSpawns: { x: number; z: number }[];
  bots: Bot[];
  player: Player;
  spawnTracer: (from: THREE.Vector3, to: THREE.Vector3, hit: boolean) => void;
  spawnSparks: (pos: THREE.Vector3, n: number) => void;
  onBotKilledByBot: (killer: Bot, victim: Bot) => void;
  onPlayerKilledByBot: (killer: Bot) => void;
  onPlayerDamaged: () => void;
}

const VISION = 26;
const FIRE_RANGE = 22;

export class Bot {
  sprite: THREE.Sprite;
  team: "alpha" | "bravo";
  op: OperatorDef;
  pos = new THREE.Vector3();
  yaw = 0;
  hp: number;
  alive = true;
  respawnTimer = 0;
  state: BotState = "patrol";
  target: Bot | Player | null = null;
  fireCooldown = 0;
  private hitFlash = 0;
  private bobPhase: number;
  // 巡逻目标点缓存
  private goal = new THREE.Vector3();

  constructor(team: "alpha" | "bravo", op: OperatorDef, mat: THREE.SpriteMaterial) {
    this.team = team;
    this.op = op;
    this.hp = op.maxHp;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.sprite = new THREE.Sprite(mat);
    this.sprite.scale.set(2.2, 2.6, 1);
  }

  spawnAt(x: number, z: number) {
    this.pos.set(x, 1.3, z);
    this.hp = this.op.maxHp;
    this.alive = true;
    this.respawnTimer = 0;
    this.state = "patrol";
    this.target = null;
    this.fireCooldown = 0;
    this.sprite.visible = true;
    this.sprite.position.copy(this.pos);
  }

  // 受伤，返回是否死亡
  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    this.hp -= amount * (1 - this.op.armor);
    this.hitFlash = 1;
    if (this.hp <= 0) {
      this.alive = false;
      this.respawnTimer = 5;
      this.state = "dead";
      this.sprite.visible = false;
      return true;
    }
    return false;
  }

  // 提供给玩家射线检测的中心点(胸高)
  getCenter(out: THREE.Vector3) {
    return out.set(this.pos.x, 1.4, this.pos.z);
  }

  private isEnemy(other: Bot | Player): boolean {
    const otherTeam = (other as Bot).team ?? (other as Player).team;
    return otherTeam !== this.team;
  }

  update(dt: number, ctx: BotContext) {
    if (!this.alive) {
      this.respawnTimer -= dt;
      return;
    }
    this.fireCooldown -= dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt * 4);

    // 1. 寻敌：找视野内最近的存活敌人
    this.acquireTarget(ctx);

    // 2. 状态决策
    if (this.target && this.hasLOS(ctx, this.target)) {
      this.state = this.hp < this.op.maxHp * 0.3 ? "seekCover" : "engage";
    } else {
      this.state = "patrol";
      this.target = null;
    }

    // 3. 行为
    switch (this.state) {
      case "engage":
        this.behaveEngage(dt, ctx);
        break;
      case "seekCover":
        this.behaveSeekCover(dt, ctx);
        break;
      default:
        this.behavePatrol(dt, ctx);
        break;
    }

    // sprite 同步 + 走动 bob
    this.bobPhase += dt * 8;
    const bob = Math.sin(this.bobPhase) * 0.05;
    this.sprite.position.set(this.pos.x, 1.3 + bob, this.pos.z);
    // 受击白闪
    if (this.hitFlash > 0) {
      (this.sprite.material as THREE.SpriteMaterial).color.setRGB(
        1,
        1 - this.hitFlash * 0.4,
        1 - this.hitFlash * 0.5,
      );
    } else {
      (this.sprite.material as THREE.SpriteMaterial).color.setRGB(1, 1, 1);
    }
  }

  // 寻找最近可见敌人
  private acquireTarget(ctx: BotContext) {
    let best: Bot | Player | null = null;
    let bestDist = VISION;
    const myCenter = _v1.set(this.pos.x, 1.4, this.pos.z);
    // 候选：其他异队 bot
    for (const b of ctx.bots) {
      if (b === this || !b.alive) continue;
      if (b.team === this.team) continue;
      const d = b.pos.distanceTo(myCenter);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    // 玩家(若异队且存活)
    const p = ctx.player;
    if (p.alive && p.team !== this.team) {
      const d = p.position.distanceTo(myCenter);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    this.target = best;
  }

  // 视线：射线到目标不穿墙
  private hasLOS(ctx: BotContext, target: Bot | Player): boolean {
    const from = _v2.set(this.pos.x, 1.4, this.pos.z);
    const tx = (target as Bot).pos ? (target as Bot).pos.x : (target as Player).position.x;
    const tz = (target as Bot).pos ? (target as Bot).pos.z : (target as Player).position.z;
    const to = _v3.set(tx, 1.4, tz);
    const dir = _v4.copy(to).sub(from);
    const dist = dir.length();
    if (dist < 0.001) return true;
    dir.normalize();
    const wallDist = ctx.world.raycastWalls(from, dir, dist);
    return wallDist >= dist - 1;
  }

  private behaveEngage(dt: number, ctx: BotContext) {
    const t = this.target!;
    const tx = (t as Bot).pos ? (t as Bot).pos.x : (t as Player).position.x;
    const tz = (t as Bot).pos ? (t as Bot).pos.z : (t as Player).position.z;
    // 朝向目标
    this.yaw = Math.atan2(tx - this.pos.x, tz - this.pos.z);
    const dist = Math.hypot(tx - this.pos.x, tz - this.pos.z);
    // 太远则靠近，太近则后撤
    if (dist > 14) {
      this.moveToward(tx, tz, dt, ctx);
    } else if (dist < 6) {
      this.moveToward(this.pos.x * 2 - tx, this.pos.z * 2 - tz, dt, ctx);
    } else {
      // 侧移
      const ang = this.yaw + Math.PI / 2;
      this.moveToward(this.pos.x + Math.sin(ang) * 4, this.pos.z + Math.cos(ang) * 4, dt, ctx);
    }
    // 开火
    if (dist < FIRE_RANGE && this.fireCooldown <= 0 && this.hasLOS(ctx, t)) {
      this.fireAt(t, ctx);
    }
  }

  private behaveSeekCover(dt: number, ctx: BotContext) {
    // 远离目标 + 朝据点
    const t = this.target;
    if (t) {
      const tx = (t as Bot).pos ? (t as Bot).pos.x : (t as Player).position.x;
      const tz = (t as Bot).pos ? (t as Bot).pos.z : (t as Player).position.z;
      this.moveToward(this.pos.x * 2 - tx, this.pos.z * 2 - tz, dt, ctx);
    } else {
      this.moveToward(ctx.capturePos.x, ctx.capturePos.z, dt, ctx);
    }
    // 仍可还击
    if (t && this.fireCooldown <= 0 && this.hasLOS(ctx, t)) {
      const tx = (t as Bot).pos ? (t as Bot).pos.x : (t as Player).position.x;
      const tz = (t as Bot).pos ? (t as Bot).pos.z : (t as Player).position.z;
      const dist = Math.hypot(tx - this.pos.x, tz - this.pos.z);
      if (dist < FIRE_RANGE) this.fireAt(t, ctx);
    }
  }

  private behavePatrol(dt: number, ctx: BotContext) {
    // 推进到据点
    this.moveToward(ctx.capturePos.x, ctx.capturePos.z, dt, ctx);
  }

  // 朝目标点移动(带碰撞滑动)
  private moveToward(tx: number, tz: number, dt: number, ctx: BotContext) {
    const dx = tx - this.pos.x;
    const dz = tz - this.pos.z;
    const len = Math.hypot(dx, dz) || 1;
    const sp = this.op.speed * dt;
    const nx = this.pos.x + (dx / len) * sp;
    const nz = this.pos.z + (dz / len) * sp;
    if (!ctx.world.collides(nx, this.pos.z, 0.8)) this.pos.x = nx;
    if (!ctx.world.collides(this.pos.x, nz, 0.8)) this.pos.z = nz;
  }

  // 开火：按精度结算命中
  private fireAt(target: Bot | Player, ctx: BotContext) {
    this.fireCooldown = this.op.fireDelay;
    const from = _v5.set(this.pos.x, 1.4, this.pos.z);
    const tx = (target as Bot).pos ? (target as Bot).pos.x : (target as Player).position.x;
    const tz = (target as Bot).pos ? (target as Bot).pos.z : (target as Player).position.z;
    const to = _v6.set(tx, 1.4, tz);
    const dist = from.distanceTo(to);
    // 命中概率：基础精度 - 距离衰减
    const hitChance = Math.max(0.08, this.op.spread - dist / FIRE_RANGE * 0.5);
    const hit = Math.random() < hitChance;
    ctx.spawnTracer(from, to, hit);
    if (hit) {
      ctx.spawnSparks(to, 6);
      if (target instanceof Bot) {
        const died = target.takeDamage(this.op.damage);
        if (died) ctx.onBotKilledByBot(this, target);
      } else {
        target.takeDamage(this.op.damage);
        ctx.onPlayerDamaged();
        if (!target.alive) ctx.onPlayerKilledByBot(this);
      }
    }
  }
}

// 模块级临时向量，避免每帧 GC
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
const _v5 = new THREE.Vector3();
const _v6 = new THREE.Vector3();

// 材质缓存（按 team+class）
const matCache = new Map<string, THREE.SpriteMaterial>();
export function getSoldierMaterial(team: "alpha" | "bravo", cls: string): THREE.SpriteMaterial {
  const key = `${team}:${cls}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.SpriteMaterial({
      map: makeSoldierSprite(team, cls),
      transparent: true,
      fog: true,
      depthWrite: false,
    });
    matCache.set(key, m);
  }
  return m;
}
