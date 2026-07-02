import * as THREE from "three";
import type { World } from "./World";
import { makeEchoSprite, makeShadowSprite, makePortalSprite } from "./textures";

interface Echo {
  sprite: THREE.Sprite;
  pos: THREE.Vector3;
  collected: boolean;
  phase: number;
}
interface Shadow {
  sprite: THREE.Sprite;
  pos: THREE.Vector3;
  speed: number;
  cooldown: number;
}
interface Portal {
  sprite: THREE.Sprite;
  pos: THREE.Vector3;
  active: boolean;
  texActive: THREE.Texture;
  texInactive: THREE.Texture;
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
  private cb: EntityCallbacks;
  private echoMat: THREE.SpriteMaterial;
  private shadowMat: THREE.SpriteMaterial;

  constructor(cb: EntityCallbacks) {
    this.cb = cb;
    this.echoMat = new THREE.SpriteMaterial({
      map: makeEchoSprite(),
      transparent: true,
      fog: false,
      depthWrite: false,
    });
    this.shadowMat = new THREE.SpriteMaterial({
      map: makeShadowSprite(),
      transparent: true,
      fog: true,
      depthWrite: false,
    });
  }

  spawnEcho(x: number, z: number) {
    const sprite = new THREE.Sprite(this.echoMat);
    sprite.scale.set(2.0, 2.0, 1);
    const pos = new THREE.Vector3(x, 1.6, z);
    sprite.position.copy(pos);
    this.echoes.push({ sprite, pos, collected: false, phase: Math.random() * Math.PI * 2 });
    this.group.add(sprite);
  }

  spawnShadow(x: number, z: number, speed: number) {
    const sprite = new THREE.Sprite(this.shadowMat);
    sprite.scale.set(2.8, 2.8, 1);
    const pos = new THREE.Vector3(x, 1.7, z);
    sprite.position.copy(pos);
    this.shadows.push({ sprite, pos, speed, cooldown: 0 });
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
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.6, 3.6, 1);
    const pos = new THREE.Vector3(x, 2.1, z);
    sprite.position.copy(pos);
    this.portal = { sprite, pos, active: false, texActive, texInactive };
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

  update(dt: number, playerPos: THREE.Vector3, world: World) {
    const t = performance.now() / 1000;
    // 回响：浮动 + 收集
    for (const e of this.echoes) {
      if (e.collected) continue;
      e.phase += dt;
      e.sprite.position.y = e.pos.y + Math.sin(e.phase * 1.6) * 0.18;
      const d = Math.hypot(e.pos.x - playerPos.x, e.pos.z - playerPos.z);
      if (d < 1.8) {
        e.collected = true;
        e.sprite.visible = false;
        this.cb.onCollectEcho();
        if (this.remainingEchoes() === 0) {
          this.activatePortal();
          this.cb.onAllCollected();
        }
      }
    }

    // 暗影：朝玩家移动 + 接触扣残响
    for (const s of this.shadows) {
      const dx = playerPos.x - s.pos.x;
      const dz = playerPos.z - s.pos.z;
      const dist = Math.hypot(dx, dz) || 0.0001;
      const nx = s.pos.x + (dx / dist) * s.speed * dt;
      const nz = s.pos.z + (dz / dist) * s.speed * dt;
      // 简单墙体碰撞（可被墙阻挡，玩家可利用地形）
      if (!world.collides(nx, s.pos.z, 0.8)) s.pos.x = nx;
      if (!world.collides(s.pos.x, nz, 0.8)) s.pos.z = nz;
      s.sprite.position.x = s.pos.x;
      s.sprite.position.z = s.pos.z;
      s.sprite.position.y = 1.7 + Math.sin(t * 2 + s.pos.x) * 0.12;
      s.cooldown -= dt;
      if (dist < 1.5 && s.cooldown <= 0) {
        this.cb.onDamage(14);
        s.cooldown = 1.0;
      }
    }

    // 传送门：旋转 + 进入判定
    if (this.portal) {
      const p = this.portal;
      const spin = p.active ? 3.2 : 0.8;
      p.sprite.material.rotation += spin * dt;
      p.sprite.position.y = p.pos.y + Math.sin(t * 1.5) * 0.1;
      if (p.active) {
        const d = Math.hypot(p.pos.x - playerPos.x, p.pos.z - playerPos.z);
        if (d < 1.9) this.cb.onPortalEnter();
      }
    }
  }

  dispose() {
    this.echoMat.map?.dispose();
    this.echoMat.dispose();
    this.shadowMat.map?.dispose();
    this.shadowMat.dispose();
    if (this.portal) {
      this.portal.texActive.dispose();
      this.portal.texInactive.dispose();
      (this.portal.sprite.material as THREE.SpriteMaterial).dispose();
    }
  }
}
