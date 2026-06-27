// 生存模式核心系统：生命、饥饿、昼夜、怪物、掉落物

import * as THREE from "three";
import { VoxelWorld, terrainHeight } from "./VoxelWorld";

export type ItemType = "apple" | "meat";

export interface DroppedItem {
  type: ItemType;
  x: number;
  y: number;
  z: number;
  mesh: THREE.Mesh;
  life: number;
}

export interface Mob {
  mesh: THREE.Group;
  x: number;
  y: number;
  z: number;
  health: number;
  maxHealth: number;
  attackCooldown: number;
  hitFlash: number;
}

export class SurvivalSystem {
  health = 100;
  maxHealth = 100;
  hunger = 100;
  maxHunger = 100;
  isDead = false;

  dayTime = 0; // 0 ~ 1, 0=正午, 0.5=日落, 0.75=午夜, 1=次日正午
  dayDuration = 90; // 一天秒数

  mobs: Mob[] = [];
  maxMobs = 8;
  items: DroppedItem[] = [];

  hungerDecay = 0.4; // 每秒
  healthRegen = 2; // 每秒（饥饿>50时）
  starveDamage = 2; // 每秒（饥饿为0时）

  onDeath?: () => void;
  onRespawn?: () => void;
  onItemPickup?: (type: ItemType) => void;

  constructor(
    private scene: THREE.Scene,
    private world: VoxelWorld,
    private sun?: THREE.DirectionalLight,
    private ambient?: THREE.AmbientLight,
    private sky?: THREE.Color,
  ) {}

  update(delta: number, playerX: number, playerY: number, playerZ: number) {
    if (this.isDead) return;

    // 昼夜循环
    this.dayTime += delta / this.dayDuration;
    if (this.dayTime >= 1) this.dayTime -= 1;
    this.updateLighting();

    // 饥饿
    this.hunger = Math.max(0, this.hunger - this.hungerDecay * delta);
    if (this.hunger > 50 && this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + this.healthRegen * delta);
    } else if (this.hunger === 0) {
      this.health = Math.max(0, this.health - this.starveDamage * delta);
    }

    // 怪物
    this.updateMobs(delta, playerX, playerY, playerZ);
    this.spawnMobs(playerX, playerZ);

    // 掉落物
    this.updateItems(delta, playerX, playerY, playerZ);

    // 死亡判定
    if (this.health <= 0) {
      this.die();
    }
  }

  updateLighting() {
    const t = this.dayTime;
    // t=0 -> angle 0 (正午), t=0.5 -> angle PI/2 (日落), t=0.75 -> angle PI (午夜)
    const angle = t * Math.PI * 2 - Math.PI / 2;
    if (this.sun) {
      this.sun.position.set(Math.cos(angle) * 60, Math.sin(angle) * 60, 30);
      this.sun.intensity = Math.max(0.15, Math.sin(angle) * 0.85 + 0.15);
    }
    if (this.ambient) {
      const intensity = 0.4 + Math.max(0, Math.sin(angle)) * 0.5;
      this.ambient.intensity = intensity;
    }
    if (this.sky) {
      const dayColor = new THREE.Color(0x87ceeb);
      const nightColor = new THREE.Color(0x0a1020);
      const duskColor = new THREE.Color(0x554433);
      const brightness = Math.max(0, Math.sin(angle));
      if (brightness > 0.3) {
        this.sky.lerpColors(duskColor, dayColor, (brightness - 0.3) / 0.7);
      } else {
        this.sky.lerpColors(nightColor, duskColor, brightness / 0.3);
      }
    }
  }

  isNight() {
    const angle = this.dayTime * Math.PI * 2 - Math.PI / 2;
    return Math.sin(angle) < -0.1;
  }

  spawnMobs(playerX: number, playerZ: number) {
    if (!this.isNight()) return;
    if (this.mobs.length >= this.maxMobs) return;
    if (Math.random() > 0.02) return;

    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 16;
    const x = Math.round(playerX + Math.cos(angle) * dist);
    const z = Math.round(playerZ + Math.sin(angle) * dist);
    const y = terrainHeight(x, z) + 1;

    this.createMob(x, y, z);
  }

  createMob(x: number, y: number, z: number): Mob {
    const group = new THREE.Group();

    // 身体
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2a4a2a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.3), bodyMat);
    body.position.y = 0.9;
    group.add(body);

    // 头
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), bodyMat);
    head.position.y = 1.4;
    group.add(head);

    // 手臂
    const armGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-0.4, 0.9, 0);
    group.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.set(0.4, 0.9, 0);
    group.add(rightArm);

    // 腿
    const legGeo = new THREE.BoxGeometry(0.22, 0.6, 0.22);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.15, 0.3, 0);
    group.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.15, 0.3, 0);
    group.add(rightLeg);

    // 眼睛
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.05), eyeMat);
    leftEye.position.set(-0.1, 1.45, 0.2);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.05), eyeMat);
    rightEye.position.set(0.1, 1.45, 0.2);
    group.add(rightEye);

    group.position.set(x, y - 1.5, z);
    this.scene.add(group);

    const mob: Mob = {
      mesh: group,
      x,
      y,
      z,
      health: 20,
      maxHealth: 20,
      attackCooldown: 0,
      hitFlash: 0,
    };
    this.mobs.push(mob);
    return mob;
  }

  updateMobs(delta: number, px: number, py: number, pz: number) {
    for (let i = this.mobs.length - 1; i >= 0; i--) {
      const mob = this.mobs[i];

      // 受击闪白恢复
      if (mob.hitFlash > 0) {
        mob.hitFlash -= delta * 4;
        if (mob.hitFlash < 0) mob.hitFlash = 0;
        mob.mesh.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.material && !Array.isArray(mesh.material)) {
            (mesh.material as THREE.MeshLambertMaterial).emissive.setHex(mob.hitFlash > 0 ? 0x555555 : 0x000000);
          }
        });
      }

      const dx = px - mob.x;
      const dy = py - mob.y;
      const dz = pz - mob.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const speed = 2.5;
      if (dist > 1.2) {
        const ndx = dx / dist;
        const ndz = dz / dist;
        mob.x += ndx * speed * delta;
        mob.z += ndz * speed * delta;
        mob.mesh.position.set(mob.x, mob.y - 1.5, mob.z);
        mob.mesh.rotation.y = Math.atan2(ndx, ndz);

        // 简单行走摆动
        const swing = Math.sin(performance.now() * 0.01) * 0.4;
        mob.mesh.children[2].rotation.x = swing;
        mob.mesh.children[3].rotation.x = -swing;
        mob.mesh.children[4].rotation.x = -swing;
        mob.mesh.children[5].rotation.x = swing;
      }

      // 攻击玩家
      mob.attackCooldown -= delta;
      if (dist < 1.5 && mob.attackCooldown <= 0) {
        this.health = Math.max(0, this.health - 8);
        mob.attackCooldown = 1.0;
      }

      // 掉落到地形
      const groundY = terrainHeight(mob.x, mob.z) + 1;
      if (mob.y > groundY) {
        mob.y -= 20 * delta;
        if (mob.y < groundY) mob.y = groundY;
      }
    }
  }

  damageMobAt(targetX: number, targetY: number, targetZ: number, damage: number) {
    let closest: Mob | null = null;
    let closestDist = 2.5;
    for (const mob of this.mobs) {
      const dist = Math.sqrt((mob.x - targetX) ** 2 + (mob.y - targetY) ** 2 + (mob.z - targetZ) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closest = mob;
      }
    }
    if (closest) {
      closest.health -= damage;
      closest.hitFlash = 1;
      if (closest.health <= 0) {
        this.killMob(closest);
      }
      return true;
    }
    return false;
  }

  killMob(mob: Mob) {
    const idx = this.mobs.indexOf(mob);
    if (idx >= 0) {
      this.mobs.splice(idx, 1);
      this.scene.remove(mob.mesh);
      // 掉落食物
      const itemType: ItemType = Math.random() > 0.5 ? "apple" : "meat";
      this.dropItem(itemType, mob.x, mob.y, mob.z);
    }
  }

  dropItem(type: ItemType, x: number, y: number, z: number) {
    const color = type === "apple" ? 0xff4444 : 0xcc8866;
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    this.scene.add(mesh);
    this.items.push({ type, x, y, z, mesh, life: 30 });
  }

  updateItems(delta: number, px: number, py: number, pz: number) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.life -= delta;
      item.mesh.rotation.y += delta;
      item.mesh.position.y = item.y + Math.sin(performance.now() * 0.003) * 0.1;

      const dist = Math.sqrt((item.x - px) ** 2 + (item.y - py) ** 2 + (item.z - pz) ** 2);
      if (dist < 1.5) {
        this.onItemPickup?.(item.type);
        this.scene.remove(item.mesh);
        item.mesh.geometry.dispose();
        (item.mesh.material as THREE.Material).dispose();
        this.items.splice(i, 1);
        continue;
      }

      if (item.life <= 0) {
        this.scene.remove(item.mesh);
        item.mesh.geometry.dispose();
        (item.mesh.material as THREE.Material).dispose();
        this.items.splice(i, 1);
      }
    }
  }

  eat(type: ItemType) {
    if (this.isDead) return;
    const restore = type === "apple" ? 15 : 25;
    this.hunger = Math.min(this.maxHunger, this.hunger + restore);
    this.health = Math.min(this.maxHealth, this.health + restore * 0.3);
  }

  die() {
    this.isDead = true;
    this.onDeath?.();
  }

  respawn(x: number, y: number, z: number) {
    this.health = this.maxHealth;
    this.hunger = this.maxHunger;
    this.isDead = false;
    // 清空怪物
    for (const mob of this.mobs) {
      this.scene.remove(mob.mesh);
    }
    this.mobs = [];
    this.onRespawn?.();
  }

  dispose() {
    for (const mob of this.mobs) {
      this.scene.remove(mob.mesh);
    }
    this.mobs = [];
    for (const item of this.items) {
      this.scene.remove(item.mesh);
      item.mesh.geometry.dispose();
      (item.mesh.material as THREE.Material).dispose();
    }
    this.items = [];
  }
}
