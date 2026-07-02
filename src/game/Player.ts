import * as THREE from "three";
import type { Input } from "./Input";
import type { World } from "./World";
import type { OperatorDef } from "./operators";

const EYE_H = 1.7;
const SPRINT_MULT = 1.5;
const ACCEL = 12;

export class Player {
  position = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  hp: number;
  maxHp: number;
  armor: number;
  speed: number;
  alive = true;
  respawnTimer = 0;
  kills = 0;
  deaths = 0;
  team: "alpha" | "bravo" = "alpha";
  private bobPhase = 0;
  private velX = 0;
  private velZ = 0;
  private smoothDX = 0;
  private smoothDY = 0;
  private shake = 0;
  private curFov = 75;
  private adsFovTarget = 75; // 瞄准 FOV(由 Weapon 设定)
  isSprinting = false;

  constructor(private camera: THREE.PerspectiveCamera, op: OperatorDef) {
    this.maxHp = op.maxHp;
    this.hp = op.maxHp;
    this.armor = op.armor;
    this.speed = op.speed;
    this.adsFovTarget = op.adsFov;
  }

  // 设定瞄准 FOV 目标(干员不同倍率不同)
  setAdsFov(fov: number) {
    this.adsFovTarget = fov;
  }

  spawn(x: number, z: number) {
    this.position.set(x, EYE_H, z);
    this.yaw = 0;
    this.pitch = 0;
    this.hp = this.maxHp;
    this.alive = true;
    this.respawnTimer = 0;
    this.velX = 0;
    this.velZ = 0;
    this.shake = 0;
    this.curFov = 75;
    this.syncCamera();
  }

  addShake(amount: number) {
    this.shake = Math.min(1.2, this.shake + amount);
  }

  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    const dmg = amount * (1 - this.armor);
    this.hp = Math.max(0, this.hp - dmg);
    this.addShake(0.5);
    if (this.hp <= 0) {
      this.alive = false;
      this.deaths++;
      this.respawnTimer = 4;
      return true; // died
    }
    return false;
  }

  update(dt: number, input: Input, world: World, aiming: boolean, recoilPitch: number) {
    if (!this.alive) {
      this.respawnTimer = Math.max(0, this.respawnTimer - dt);
      return;
    }

    const { dx, dy } = input.consumeMouseDelta();
    const smooth = 0.35;
    this.smoothDX = this.smoothDX * (1 - smooth) + dx * smooth;
    this.smoothDY = this.smoothDY * (1 - smooth) + dy * smooth;
    this.yaw -= this.smoothDX * 0.0024;
    this.pitch -= this.smoothDY * 0.0024;
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));

    const move = input.getMove();
    const moving = move.x !== 0 || move.z !== 0;
    this.isSprinting =
      (input.isDown("ShiftLeft") || input.isDown("ShiftRight")) && moving;
    const speed = this.isSprinting ? this.speed * SPRINT_MULT : this.speed;
    // FOV：冲刺放宽 / 瞄准收紧
    const targetFov = this.isSprinting ? 84 : aiming ? this.adsFovTarget : 75;
    this.curFov += (targetFov - this.curFov) * Math.min(1, dt * 8);
    if (Math.abs(this.curFov - this.camera.fov) > 0.05) {
      this.camera.fov = this.curFov;
      this.camera.updateProjectionMatrix();
    }

    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const targetVX = (-forward.x * move.z + right.x * move.x) * speed;
    const targetVZ = (-forward.z * move.z + right.z * move.x) * speed;
    const k = Math.min(1, dt * ACCEL);
    this.velX += (targetVX - this.velX) * k;
    this.velZ += (targetVZ - this.velZ) * k;
    if (!moving) {
      this.velX *= 1 - Math.min(1, dt * ACCEL);
      this.velZ *= 1 - Math.min(1, dt * ACCEL);
    }

    const RADIUS = 0.85;
    const nx = this.position.x + this.velX * dt;
    const nz = this.position.z + this.velZ * dt;
    if (!world.collides(nx, this.position.z, RADIUS)) this.position.x = nx;
    else this.velX *= 0.2;
    if (!world.collides(this.position.x, nz, RADIUS)) this.position.z = nz;
    else this.velZ *= 0.2;

    const bobSpeed = this.isSprinting ? 13 : 9;
    if (moving) this.bobPhase += dt * bobSpeed;
    const curSpeed = Math.hypot(this.velX, this.velZ);
    const bobScale = Math.min(1, curSpeed / this.speed);
    const bob = moving ? Math.sin(this.bobPhase) * 0.06 * bobScale : Math.sin(this.bobPhase) * 0.02;
    this.position.y = EYE_H + bob;

    this.shake = Math.max(0, this.shake - dt * 2.2);
    this.syncCamera(recoilPitch);
  }

  private syncCamera(recoilPitch = 0) {
    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    // 后坐力上抬叠加到 pitch(向上)
    this.camera.rotation.x = this.pitch + recoilPitch;
    if (this.shake > 0) {
      const s = this.shake * 0.04;
      this.camera.rotation.y += (Math.random() - 0.5) * s;
      this.camera.rotation.x += (Math.random() - 0.5) * s;
    }
  }

  getForward(out: THREE.Vector3) {
    return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }
}
