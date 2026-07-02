import * as THREE from "three";
import { Bot, getSoldierMaterial, type BotContext } from "./Bot";
import type { World } from "./World";
import type { Player } from "./Player";
import type { OperatorDef, Team } from "./operators";

interface Spark {
  sprite: THREE.Sprite;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}
interface Tracer {
  line: THREE.Line;
  life: number;
  maxLife: number;
  mat: THREE.LineBasicMaterial;
}

// 大规模 Agent 池：统一更新所有 bot + 命中检测 + 粒子/拖尾
export class BotManager {
  group = new THREE.Group();
  bots: Bot[] = [];
  private sparks: Spark[] = [];
  private tracers: Tracer[] = [];
  private sparkMat: THREE.SpriteMaterial;
  private tracerHitMat: THREE.LineBasicMaterial;
  private tracerMissMat: THREE.LineBasicMaterial;
  private ctx: BotContext;

  constructor(world: World, player: Player) {
    this.sparkMat = new THREE.SpriteMaterial({
      map: makeSparkLocal(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      depthWrite: false,
    });
    this.tracerHitMat = new THREE.LineBasicMaterial({
      color: 0xffe48a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this.tracerMissMat = new THREE.LineBasicMaterial({
      color: 0x6a6a6a,
      transparent: true,
      opacity: 0.5,
      fog: false,
    });
    this.ctx = {
      world,
      capturePos: new THREE.Vector3(world.parsed.capture.x, 0, world.parsed.capture.z),
      alphaSpawns: world.parsed.alphaSpawns,
      bravoSpawns: world.parsed.bravoSpawns,
      bots: this.bots,
      player,
      spawnTracer: (f, t, hit) => this.spawnTracer(f, t, hit),
      spawnSparks: (p, n) => this.spawnSparks(p, n),
      onBotKilledByBot: (killer, victim) => this.onBotKilledByBot(killer, victim),
      onPlayerKilledByBot: () => this.onPlayerKilledByBot(),
      onPlayerDamaged: () => this.onPlayerDamaged(),
    };
  }

  // 回调，由 GameScene 注入
  onBotKilled: ((killer: Bot | Player, victim: Bot) => void) | null = null;
  onPlayerKilled: (() => void) | null = null;
  onPlayerHit: (() => void) | null = null;
  // 检查该队是否还有重生票（由 MatchManager 提供）
  canRespawn: ((team: Team) => boolean) | null = null;
  onConsumeTicket: ((team: Team) => void) | null = null;

  // 生成 bot
  spawnBot(team: Team, op: OperatorDef, x: number, z: number) {
    const bot = new Bot(team, op, getSoldierMaterial(team, op.id));
    bot.spawnAt(x, z);
    this.bots.push(bot);
    this.group.add(bot.sprite);
    return bot;
  }

  // 重置一回合：清除所有 bot，按配置重生
  resetRound() {
    for (const b of this.bots) this.group.remove(b.sprite);
    this.bots.length = 0;
  }

  // 玩家射线检测：返回最近异队存活 bot
  raycastBots(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxDist: number,
    team: Team,
    wallDist: number,
  ): Bot | null {
    let best: Bot | null = null;
    let bestT = Infinity;
    const hitRadius = 1.4;
    for (const b of this.bots) {
      if (!b.alive || b.team === team) continue;
      const sx = b.pos.x - origin.x;
      const sy = 1.4 - origin.y;
      const sz = b.pos.z - origin.z;
      const t = sx * dir.x + sy * dir.y + sz * dir.z;
      if (t < 0 || t > maxDist || t > wallDist) continue;
      const px = origin.x + dir.x * t - b.pos.x;
      const py = origin.y + dir.y * t - 1.4;
      const pz = origin.z + dir.z * t - b.pos.z;
      const perp = Math.hypot(px, py, pz);
      if (perp < hitRadius && t < bestT) {
        bestT = t;
        best = b;
      }
    }
    return best;
  }

  // 瞄准：准星是否对准异队 bot
  hoverBots(origin: THREE.Vector3, dir: THREE.Vector3, team: Team, wallDist: number): boolean {
    return this.raycastBots(origin, dir, 64, team, wallDist) !== null;
  }

  update(dt: number) {
    // 统一更新所有 Agent
    for (const b of this.bots) {
      b.update(dt, this.ctx);
      // 重生
      if (!b.alive && b.respawnTimer <= 0) {
        const can = this.canRespawn ? this.canRespawn(b.team) : true;
        if (can) {
          const spawns = b.team === "alpha" ? this.ctx.alphaSpawns : this.ctx.bravoSpawns;
          const s = spawns[Math.floor(Math.random() * spawns.length)];
          b.spawnAt(s.x, s.z);
          if (this.onConsumeTicket) this.onConsumeTicket(b.team);
        }
      }
    }
    this.updateSparks(dt);
    this.updateTracers(dt);
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3, hit: boolean) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = (hit ? this.tracerHitMat : this.tracerMissMat).clone();
    mat.opacity = hit ? 0.9 : 0.45;
    const line = new THREE.Line(geo, mat);
    line.renderOrder = 998;
    this.group.add(line);
    this.tracers.push({ line, life: 0.07, maxLife: 0.07, mat });
  }

  private spawnSparks(pos: THREE.Vector3, n: number) {
    for (let i = 0; i < n; i++) {
      const s = new THREE.Sprite(this.sparkMat);
      s.scale.set(0.4, 0.4, 1);
      s.position.copy(pos);
      const ang = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 2.5;
      const vel = new THREE.Vector3(Math.cos(ang) * sp, 1 + Math.random() * 2, Math.sin(ang) * sp);
      this.sparks.push({ sprite: s, vel, life: 0.6, maxLife: 0.6 });
      this.group.add(s);
    }
  }

  private updateSparks(dt: number) {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.life -= dt;
      if (sp.life <= 0) {
        this.group.remove(sp.sprite);
        this.sparks.splice(i, 1);
        continue;
      }
      sp.vel.y -= 5 * dt;
      sp.sprite.position.x += sp.vel.x * dt;
      sp.sprite.position.y += sp.vel.y * dt;
      sp.sprite.position.z += sp.vel.z * dt;
      sp.sprite.material.opacity = sp.life / sp.maxLife;
      sp.sprite.scale.setScalar((0.4 * sp.life) / sp.maxLife + 0.1);
    }
  }

  private updateTracers(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.life -= dt;
      if (tr.life <= 0) {
        this.group.remove(tr.line);
        tr.line.geometry.dispose();
        tr.mat.dispose();
        this.tracers.splice(i, 1);
      } else {
        tr.mat.opacity = (tr.life / tr.maxLife) * 0.9;
      }
    }
  }

  private onBotKilledByBot(killer: Bot, victim: Bot) {
    if (this.onBotKilled) this.onBotKilled(killer, victim);
  }
  private onPlayerKilledByBot() {
    if (this.onPlayerKilled) this.onPlayerKilled();
  }
  private onPlayerDamaged() {
    if (this.onPlayerHit) this.onPlayerHit();
  }

  // 统计据点区内双方存活人数
  countInCapture(capture: { x: number; z: number; r: number }): { alpha: number; bravo: number; playerIn: boolean } {
    let alpha = 0;
    let bravo = 0;
    let playerIn = false;
    const r2 = capture.r * capture.r;
    for (const b of this.bots) {
      if (!b.alive) continue;
      const dx = b.pos.x - capture.x;
      const dz = b.pos.z - capture.z;
      if (dx * dx + dz * dz < r2) {
        if (b.team === "alpha") alpha++;
        else bravo++;
      }
    }
    const p = this.ctx.player;
    if (p.alive) {
      const dx = p.position.x - capture.x;
      const dz = p.position.z - capture.z;
      if (dx * dx + dz * dz < r2) playerIn = true;
    }
    return { alpha, bravo, playerIn };
  }

  aliveCount(team: Team): number {
    let n = 0;
    for (const b of this.bots) if (b.alive && b.team === team) n++;
    return n;
  }

  dispose() {
    this.group.traverse((o) => {
      const line = o as THREE.Line;
      if (line.geometry) line.geometry.dispose();
    });
    this.sparkMat.map?.dispose();
    this.sparkMat.dispose();
    this.tracerHitMat.dispose();
    this.tracerMissMat.dispose();
  }
}

// spark 纹理内联（避免循环依赖 textures）
import { makeSpark } from "./textures";
function makeSparkLocal() {
  return makeSpark();
}
