import * as THREE from "three";
import type { World } from "./World";
import {
  makeEchoSprite,
  makeEchoHalo,
  makeShadowSprite,
  makeShadowHalo,
  makePortalSprite,
  makePortalHalo,
  makeSpark,
} from "./textures";

interface Echo {
  sprite: THREE.Sprite;
  halo: THREE.Sprite;
  pos: THREE.Vector3;
  collected: boolean;
  phase: number;
}
interface Shadow {
  sprite: THREE.Sprite;
  halo: THREE.Sprite;
  pos: THREE.Vector3;
  spawnPos: THREE.Vector3;
  speed: number;
  cooldown: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  respawnTimer: number;
  hitFlash: number; // 受击白闪 0~1
}
interface Portal {
  sprite: THREE.Sprite;
  halo: THREE.Sprite;
  pos: THREE.Vector3;
  active: boolean;
  texActive: THREE.Texture;
  texInactive: THREE.Texture;
}
interface Spark {
  sprite: THREE.Sprite;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

export interface EntityCallbacks {
  onCollectEcho: () => void;
  onAllCollected: () => void;
  onDamage: (amount: number) => void;
  onPortalEnter: () => void;
}

export class Entities {
  group = new THREE.Group();
  private echoes: Echo[] = [];
  private shadows: Shadow[] = [];
  private portal: Portal | null = null;
  private sparks: Spark[] = [];
  private cb: EntityCallbacks;
  private echoMat: THREE.SpriteMaterial;
  private echoHaloMat: THREE.SpriteMaterial;
  private shadowMat: THREE.SpriteMaterial;
  private shadowHaloMat: THREE.SpriteMaterial;
  private sparkMat: THREE.SpriteMaterial;
  // 心跳：最近暗影距离映射 0~1
  heartbeat = 0;

  constructor(cb: EntityCallbacks) {
    this.cb = cb;
    this.echoMat = new THREE.SpriteMaterial({
      map: makeEchoSprite(),
      transparent: true,
      fog: false,
      depthWrite: false,
    });
    this.echoHaloMat = new THREE.SpriteMaterial({
      map: makeEchoHalo(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      depthWrite: false,
    });
    this.shadowMat = new THREE.SpriteMaterial({
      map: makeShadowSprite(),
      transparent: true,
      fog: true,
      depthWrite: false,
    });
    this.shadowHaloMat = new THREE.SpriteMaterial({
      map: makeShadowHalo(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: true,
      depthWrite: false,
    });
    this.sparkMat = new THREE.SpriteMaterial({
      map: makeSpark(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      depthWrite: false,
    });
  }

  spawnEcho(x: number, z: number) {
    const sprite = new THREE.Sprite(this.echoMat);
    sprite.scale.set(2.0, 2.0, 1);
    const halo = new THREE.Sprite(this.echoHaloMat);
    halo.scale.set(5.5, 5.5, 1);
    const pos = new THREE.Vector3(x, 1.6, z);
    sprite.position.copy(pos);
    halo.position.copy(pos);
    this.echoes.push({ sprite, halo, pos, collected: false, phase: Math.random() * Math.PI * 2 });
    this.group.add(halo);
    this.group.add(sprite);
  }

  spawnShadow(x: number, z: number, speed: number) {
    const sprite = new THREE.Sprite(this.shadowMat);
    sprite.scale.set(2.8, 2.8, 1);
    const halo = new THREE.Sprite(this.shadowHaloMat);
    halo.scale.set(6.5, 6.5, 1);
    const pos = new THREE.Vector3(x, 1.7, z);
    sprite.position.copy(pos);
    halo.position.copy(pos);
    this.shadows.push({
      sprite,
      halo,
      pos,
      spawnPos: pos.clone(),
      speed,
      cooldown: 0,
      hp: 2,
      maxHp: 2,
      alive: true,
      respawnTimer: 0,
      hitFlash: 0,
    });
    this.group.add(halo);
    this.group.add(sprite);
  }

  spawnPortal(x: number, z: number) {
    const texInactive = makePortalSprite(false);
    const texActive = makePortalSprite(true);
    const mat = new THREE.SpriteMaterial({
      map: texInactive,
      transparent: true,
      fog: false,
      depthWrite: false,
    });
    const haloMat = new THREE.SpriteMaterial({
      map: makePortalHalo(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.6, 3.6, 1);
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(10, 10, 1);
    const pos = new THREE.Vector3(x, 2.1, z);
    sprite.position.copy(pos);
    halo.position.copy(pos);
    halo.material.opacity = 0.4;
    this.portal = { sprite, halo, pos, active: false, texActive, texInactive };
    this.group.add(halo);
    this.group.add(sprite);
  }

  private activatePortal() {
    if (!this.portal || this.portal.active) return;
    this.portal.active = true;
    (this.portal.sprite.material as THREE.SpriteMaterial).map = this.portal.texActive;
    this.portal.sprite.material.needsUpdate = true;
  }

  remainingEchoes() {
    return this.echoes.filter((e) => !e.collected).length;
  }

  private spawnSparks(pos: THREE.Vector3, count: number) {
    for (let i = 0; i < count; i++) {
      const s = new THREE.Sprite(this.sparkMat);
      s.scale.set(0.4, 0.4, 1);
      s.position.copy(pos);
      const ang = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 2.5;
      const vel = new THREE.Vector3(
        Math.cos(ang) * sp,
        1 + Math.random() * 2,
        Math.sin(ang) * sp,
      );
      this.sparks.push({ sprite: s, vel, life: 0.7, maxLife: 0.7 });
      this.group.add(s);
    }
  }

  // 命中检测：从 origin 沿 dir 方向，找最近的存活暗影（点到射线距离 < radius）
  hitTest(origin: THREE.Vector3, dir: THREE.Vector3, range: number): { shadow: Shadow; point: THREE.Vector3 } | null {
    let best: Shadow | null = null;
    let bestT = Infinity;
    const hitRadius = 1.35;
    for (const s of this.shadows) {
      if (!s.alive) continue;
      const sx = s.pos.x - origin.x;
      const sy = 1.7 - origin.y;
      const sz = s.pos.z - origin.z;
      const t = sx * dir.x + sy * dir.y + sz * dir.z; // 沿射线投影
      if (t < 0 || t > range) continue;
      // 垂直距离
      const px = origin.x + dir.x * t - s.pos.x;
      const py = origin.y + dir.y * t - 1.7;
      const pz = origin.z + dir.z * t - s.pos.z;
      const perp = Math.hypot(px, py, pz);
      if (perp < hitRadius && t < bestT) {
        bestT = t;
        best = s;
      }
    }
    if (!best) return null;
    const point = new THREE.Vector3(
      origin.x + dir.x * bestT,
      origin.y + dir.y * bestT,
      origin.z + dir.z * bestT,
    );
    return { shadow: best, point };
  }

  hoverTest(origin: THREE.Vector3, dir: THREE.Vector3, range: number): boolean {
    return this.hitTest(origin, dir, range) !== null;
  }

  // 对暗影造成伤害，返回是否击杀
  damageShadow(shadow: Shadow, amount: number): boolean {
    if (!shadow.alive) return false;
    shadow.hp -= amount;
    shadow.hitFlash = 1;
    if (shadow.hp <= 0) {
      shadow.alive = false;
      shadow.respawnTimer = 11; // 11s 后在出生点重生
      shadow.sprite.visible = false;
      shadow.halo.visible = false;
      this.spawnSparks(shadow.pos, 22);
      return true;
    }
    // 受击粒子
    this.spawnSparks(shadow.pos, 6);
    return false;
  }

  update(dt: number, playerPos: THREE.Vector3, world: World) {
    const t = performance.now() / 1000;

    // 回响：浮动 + 辉光呼吸 + 收集
    for (const e of this.echoes) {
      if (e.collected) continue;
      e.phase += dt;
      const y = e.pos.y + Math.sin(e.phase * 1.6) * 0.18;
      e.sprite.position.y = y;
      e.halo.position.y = y;
      const pulse = 0.7 + Math.sin(e.phase * 2.2) * 0.3;
      e.halo.material.opacity = pulse;
      const d = Math.hypot(e.pos.x - playerPos.x, e.pos.z - playerPos.z);
      if (d < 1.8) {
        e.collected = true;
        e.sprite.visible = false;
        e.halo.visible = false;
        this.spawnSparks(e.pos, 18);
        this.cb.onCollectEcho();
        if (this.remainingEchoes() === 0) {
          this.activatePortal();
          this.cb.onAllCollected();
        }
      }
    }

    // 暗影：朝玩家移动 + 辉光 + 接触扣残响 + 心跳 + 受击/死亡/重生
    let minDist = Infinity;
    for (const s of this.shadows) {
      if (!s.alive) {
        // 重生倒计时
        s.respawnTimer -= dt;
        if (s.respawnTimer <= 0) {
          s.alive = true;
          s.hp = s.maxHp;
          s.pos.copy(s.spawnPos);
          s.sprite.visible = true;
          s.halo.visible = true;
          s.cooldown = 0;
        }
        continue;
      }
      const dx = playerPos.x - s.pos.x;
      const dz = playerPos.z - s.pos.z;
      const dist = Math.hypot(dx, dz) || 0.0001;
      if (dist < minDist) minDist = dist;
      const nx = s.pos.x + (dx / dist) * s.speed * dt;
      const nz = s.pos.z + (dz / dist) * s.speed * dt;
      if (!world.collides(nx, s.pos.z, 0.8)) s.pos.x = nx;
      if (!world.collides(s.pos.x, nz, 0.8)) s.pos.z = nz;
      const y = 1.7 + Math.sin(t * 2 + s.pos.x) * 0.12;
      s.sprite.position.x = s.pos.x;
      s.sprite.position.z = s.pos.z;
      s.sprite.position.y = y;
      s.halo.position.set(s.pos.x, y, s.pos.z);
      // 接近时辉光增强
      s.halo.material.opacity = Math.max(0.3, Math.min(1, 1.4 - dist / 8));
      // 受击白闪衰减
      s.hitFlash = Math.max(0, s.hitFlash - dt * 4);
      // 受击时整体偏白
      if (s.hitFlash > 0) {
        (s.sprite.material as THREE.SpriteMaterial).color.setRGB(1, 1 - s.hitFlash * 0.4, 1 - s.hitFlash * 0.5);
      } else {
        (s.sprite.material as THREE.SpriteMaterial).color.setRGB(1, 1, 1);
      }
      s.cooldown -= dt;
      if (dist < 1.5 && s.cooldown <= 0) {
        this.cb.onDamage(14);
        s.cooldown = 1.0;
      }
    }
    // 心跳：8 单位内开始，越近越强
    const heartRange = 8;
    this.heartbeat = minDist < heartRange ? 1 - minDist / heartRange : 0;

    // 传送门：旋转 + 辉光呼吸 + 进入判定
    if (this.portal) {
      const p = this.portal;
      const spin = p.active ? 3.2 : 0.8;
      p.sprite.material.rotation += spin * dt;
      p.sprite.position.y = p.pos.y + Math.sin(t * 1.5) * 0.1;
      p.halo.position.copy(p.sprite.position);
      p.halo.material.opacity = p.active
        ? 0.55 + Math.sin(t * 3) * 0.2
        : 0.25 + Math.sin(t * 1.2) * 0.05;
      p.halo.scale.setScalar(p.active ? 10 + Math.sin(t * 2) * 1.2 : 10);
      if (p.active) {
        const d = Math.hypot(p.pos.x - playerPos.x, p.pos.z - playerPos.z);
        if (d < 1.9) this.cb.onPortalEnter();
      }
    }

    // 粒子更新
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.life -= dt;
      if (sp.life <= 0) {
        this.group.remove(sp.sprite);
        this.sparks.splice(i, 1);
        continue;
      }
      sp.vel.y -= 4 * dt; // 重力
      sp.sprite.position.x += sp.vel.x * dt;
      sp.sprite.position.y += sp.vel.y * dt;
      sp.sprite.position.z += sp.vel.z * dt;
      const a = sp.life / sp.maxLife;
      sp.sprite.material.opacity = a;
      sp.sprite.scale.setScalar(0.4 * a + 0.1);
    }
  }

  dispose() {
    const mats = [
      this.echoMat, this.echoHaloMat, this.shadowMat, this.shadowHaloMat, this.sparkMat,
    ];
    for (const m of mats) {
      m.map?.dispose();
      m.dispose();
    }
    if (this.portal) {
      this.portal.texActive.dispose();
      this.portal.texInactive.dispose();
      (this.portal.sprite.material as THREE.SpriteMaterial).dispose();
      (this.portal.halo.material as THREE.SpriteMaterial).dispose();
    }
  }
}
