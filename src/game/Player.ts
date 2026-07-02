import * as THREE from "three";
import type { Input } from "./Input";
import type { World } from "./World";

const EYE_H = 1.7;
const SPEED = 4.2;
const RADIUS = 0.9;

export class Player {
  position = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  private bobPhase = 0;
  private bobAmp = 0.06;

  constructor(private camera: THREE.PerspectiveCamera) {}

  spawn(x: number, z: number) {
    this.position.set(x, EYE_H, z);
    this.yaw = 0;
    this.pitch = 0;
    this.bobPhase = 0;
    this.syncCamera();
  }

  update(dt: number, input: Input, world: World) {
    // 视角
    const { dx, dy } = input.consumeMouseDelta();
    this.yaw -= dx * 0.0024;
    this.pitch -= dy * 0.0024;
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));

    // 移动
    const move = input.getMove();
    const moving = move.x !== 0 || move.z !== 0;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const vel = new THREE.Vector3();
    vel.addScaledVector(forward, -move.z);
    vel.addScaledVector(right, move.x);
    if (vel.lengthSq() > 0) vel.normalize();

    const step = SPEED * dt;
    const nx = this.position.x + vel.x * step;
    const nz = this.position.z + vel.z * step;
    // 分轴碰撞，实现贴墙滑动
    if (!world.collides(nx, this.position.z, RADIUS)) this.position.x = nx;
    if (!world.collides(this.position.x, nz, RADIUS)) this.position.z = nz;

    // 头部摇晃
    if (moving) {
      this.bobPhase += dt * 9;
    } else {
      this.bobPhase += dt * 2; // 待机微浮
    }
    const bob = moving ? Math.sin(this.bobPhase) * this.bobAmp : Math.sin(this.bobPhase) * 0.02;

    this.position.y = EYE_H + bob;
    this.syncCamera();

    // 玩家光跟随
    world.playerLight.position.set(this.position.x, this.position.y + 1.6, this.position.z);
  }

  private syncCamera() {
    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.z = 0;
  }

  // 朝向某一世界坐标的水平角（用于实体面向判断）
  getForward(out: THREE.Vector3) {
    return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }
}
