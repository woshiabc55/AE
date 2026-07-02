import * as THREE from "three";
import type { Input } from "./Input";
import type { World } from "./World";

const EYE_H = 1.7;
const WALK_SPEED = 4.2;
const SPRINT_SPEED = 7.0;
const ACCEL = 11; // 加速度（向目标速度逼近）
const RADIUS = 0.9;

export class Player {
  position = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  private bobPhase = 0;
  private bobAmp = 0.06;
  // 平滑后的水平速度
  private velX = 0;
  private velZ = 0;
  // 鼠标平滑
  private smoothDX = 0;
  private smoothDY = 0;
  // 受伤镜头震动
  private shake = 0;
  // 冲刺 FOV 过渡
  private curFov = 72;
  private targetFov = 72;
  isSprinting = false;

  constructor(private camera: THREE.PerspectiveCamera) {}

  spawn(x: number, z: number) {
    this.position.set(x, EYE_H, z);
    this.yaw = 0;
    this.pitch = 0;
    this.bobPhase = 0;
    this.velX = 0;
    this.velZ = 0;
    this.shake = 0;
    this.curFov = 72;
    this.targetFov = 72;
    this.syncCamera();
  }

  // 外部触发受伤震动
  addShake(amount: number) {
    this.shake = Math.min(1, this.shake + amount);
  }

  update(dt: number, input: Input, world: World) {
    // 视角（鼠标平滑）
    const { dx, dy } = input.consumeMouseDelta();
    const smooth = 0.35;
    this.smoothDX = this.smoothDX * (1 - smooth) + dx * smooth;
    this.smoothDY = this.smoothDY * (1 - smooth) + dy * smooth;
    this.yaw -= this.smoothDX * 0.0024;
    this.pitch -= this.smoothDY * 0.0024;
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));

    // 冲刺
    this.isSprinting = (input.isDown("ShiftLeft") || input.isDown("ShiftRight")) && this.isMoving(input);
    const speed = this.isSprinting ? SPRINT_SPEED : WALK_SPEED;
    this.targetFov = this.isSprinting ? 82 : 72;
    this.curFov += (this.targetFov - this.curFov) * Math.min(1, dt * 6);
    if (Math.abs(this.curFov - this.camera.fov) > 0.05) {
      this.camera.fov = this.curFov;
      this.camera.updateProjectionMatrix();
    }

    // 移动：加速度逼近目标速度
    const move = input.getMove();
    const moving = move.x !== 0 || move.z !== 0;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const targetVX = (-forward.x * move.z + right.x * move.x) * speed;
    const targetVZ = (-forward.z * move.z + right.z * move.x) * speed;
    const k = Math.min(1, dt * ACCEL);
    this.velX += (targetVX - this.velX) * k;
    this.velZ += (targetVZ - this.velZ) * k;
    // 减速到零（无输入时）
    if (!moving) {
      this.velX *= 1 - Math.min(1, dt * ACCEL);
      this.velZ *= 1 - Math.min(1, dt * ACCEL);
    }

    const nx = this.position.x + this.velX * dt;
    const nz = this.position.z + this.velZ * dt;
    // 分轴碰撞，贴墙滑动
    if (!world.collides(nx, this.position.z, RADIUS)) this.position.x = nx;
    else this.velX *= 0.2;
    if (!world.collides(this.position.x, nz, RADIUS)) this.position.z = nz;
    else this.velZ *= 0.2;

    // 头部摇晃（冲刺时更剧烈、更快）
    const bobSpeed = this.isSprinting ? 13 : 9;
    const bobAmp = this.isSprinting ? 0.09 : this.bobAmp;
    if (moving) {
      this.bobPhase += dt * bobSpeed;
    } else {
      this.bobPhase += dt * 2;
    }
    const curSpeed = Math.hypot(this.velX, this.velZ);
    const bobScale = Math.min(1, curSpeed / WALK_SPEED);
    const bob = moving
      ? Math.sin(this.bobPhase) * bobAmp * bobScale
      : Math.sin(this.bobPhase) * 0.02;

    this.position.y = EYE_H + bob;

    // 受伤震动衰减 + 应用
    this.shake = Math.max(0, this.shake - dt * 2.2);
    this.syncCamera();
  }

  private isMoving(input: Input) {
    const m = input.getMove();
    return m.x !== 0 || m.z !== 0;
  }

  private syncCamera() {
    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    // 震动：在 yaw/pitch 上叠加随机抖动
    if (this.shake > 0) {
      const s = this.shake * 0.04;
      this.camera.rotation.y += (Math.random() - 0.5) * s;
      this.camera.rotation.x += (Math.random() - 0.5) * s;
    }
    this.camera.rotation.z = this.shake * 0.02 * Math.sin(this.bobPhase * 3);
  }

  getForward(out: THREE.Vector3) {
    return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }
}
