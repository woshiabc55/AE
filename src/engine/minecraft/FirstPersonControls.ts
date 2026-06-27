// 第一人称视角控制器（WASD + 鼠标）

import * as THREE from "three";
import { VoxelWorld } from "./VoxelWorld";

export class FirstPersonControls {
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  speed = 8;
  mouseSensitivity = 0.002;
  isLocked = false;

  keys: Record<string, boolean> = {};
  onLockChange?: (locked: boolean) => void;

  // 移动状态供外部使用（动画、音效）
  isMoving = false;
  moveDir = new THREE.Vector3();
  headBobPhase = 0;
  baseY = 0;

  constructor(
    public camera: THREE.PerspectiveCamera,
    public domElement: HTMLElement,
    public world: VoxelWorld,
  ) {
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    this.domElement.addEventListener("click", this.requestPointerLock);
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  unbindEvents() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    this.domElement.removeEventListener("click", this.requestPointerLock);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    document.removeEventListener("mousemove", this.onMouseMove);
  }

  requestPointerLock = () => {
    this.domElement.requestPointerLock();
  };

  onPointerLockChange = () => {
    this.isLocked = document.pointerLockElement === this.domElement;
    this.onLockChange?.(this.isLocked);
  };

  onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
  };

  onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.isLocked) return;

    this.yaw -= e.movementX * this.mouseSensitivity;
    this.pitch -= e.movementY * this.mouseSensitivity;
    this.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.pitch));

    this.updateCameraRotation();
  };

  updateCameraRotation() {
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.camera.quaternion.copy(qy).multiply(qx);
  }

  update(delta: number) {
    if (!this.isLocked) return;

    const forward = Number(this.keys["KeyW"] || this.keys["ArrowUp"]);
    const backward = Number(this.keys["KeyS"] || this.keys["ArrowDown"]);
    const left = Number(this.keys["KeyA"] || this.keys["ArrowLeft"]);
    const right = Number(this.keys["KeyD"] || this.keys["ArrowRight"]);
    const up = Number(this.keys["Space"]);
    const down = Number(this.keys["ShiftLeft"] || this.keys["ShiftRight"]);

    this.direction.z = forward - backward;
    this.direction.x = right - left;
    this.direction.y = up - down;
    this.direction.normalize();

    // 计算相机水平朝向
    const lookDir = new THREE.Vector3();
    this.camera.getWorldDirection(lookDir);
    lookDir.y = 0;
    lookDir.normalize();

    const sideDir = new THREE.Vector3().crossVectors(lookDir, new THREE.Vector3(0, 1, 0));

    const move = new THREE.Vector3()
      .addScaledVector(lookDir, this.direction.z)
      .addScaledVector(sideDir, this.direction.x);
    move.y = this.direction.y;

    this.isMoving = move.lengthSq() > 0;
    this.moveDir.copy(move).normalize();

    if (this.isMoving) {
      move.normalize().multiplyScalar(this.speed * delta);
      const nextPos = this.camera.position.clone().add(move);

      // 简单的碰撞检测：限制在世界范围内，并防止进入实心方块
      if (!this.isSolidAt(nextPos.x, this.camera.position.y, nextPos.z)) {
        this.camera.position.x = nextPos.x;
      }
      if (!this.isSolidAt(this.camera.position.x, nextPos.y, this.camera.position.z)) {
        this.camera.position.y = nextPos.y;
      }
      if (!this.isSolidAt(this.camera.position.x, this.camera.position.y, nextPos.z)) {
        this.camera.position.z = nextPos.z;
      }

      // 行走镜头晃动（head bob）
      this.headBobPhase += delta * 12;
      const bobAmount = 0.04;
      this.camera.position.y += Math.sin(this.headBobPhase) * bobAmount;
    } else {
      // 静止时缓慢回到基础高度
      this.headBobPhase = 0;
    }
  }

  isSolidAt(x: number, y: number, z: number) {
    const bx = Math.round(x);
    const by = Math.round(y);
    const bz = Math.round(z);
    return this.world.isSolid(bx, by, bz);
  }

  dispose() {
    this.unbindEvents();
    if (document.pointerLockElement === this.domElement) {
      document.exitPointerLock();
    }
  }
}
