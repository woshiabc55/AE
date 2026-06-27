// 第三人称环绕视角控制器（轨道相机 + WASD 移动目标点）

import * as THREE from "three";
import { VoxelWorld } from "./VoxelWorld";

export class OrbitControls {
  keys: Record<string, boolean> = {};
  speed = 8;
  mouseSensitivity = 0.005;
  target = new THREE.Vector3(0, 12, 0);
  isMoving = false;
  moveDir = new THREE.Vector3();
  distance = 18;
  azimuth = 0; // 水平角度（弧度）
  polar = Math.PI / 4; // 垂直角度（弧度），从正 Y 轴向下
  minPolar = 0.1;
  maxPolar = Math.PI / 2 - 0.05;
  minDistance = 4;
  maxDistance = 60;
  dragging = false;
  lastMouse = { x: 0, y: 0 };

  constructor(
    public camera: THREE.PerspectiveCamera,
    public domElement: HTMLElement,
    public world: VoxelWorld,
  ) {
    this.bindEvents();
    this.updateCamera();
  }

  bindEvents() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    this.domElement.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    this.domElement.addEventListener("wheel", this.onWheel, { passive: false });
    this.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  unbindEvents() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("wheel", this.onWheel);
  }

  onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
  };

  onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 || e.button === 2) {
      this.dragging = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastMouse.x;
    const dy = e.clientY - this.lastMouse.y;
    this.lastMouse = { x: e.clientX, y: e.clientY };

    this.azimuth -= dx * this.mouseSensitivity;
    this.polar += dy * this.mouseSensitivity;
    this.polar = Math.max(this.minPolar, Math.min(this.maxPolar, this.polar));
    this.updateCamera();
  };

  onMouseUp = () => {
    this.dragging = false;
  };

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.08 : 0.92;
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance * factor));
    this.updateCamera();
  };

  updateCamera() {
    const sinPolar = Math.sin(this.polar);
    const cosPolar = Math.cos(this.polar);
    const x = this.target.x + this.distance * sinPolar * Math.sin(this.azimuth);
    const y = this.target.y + this.distance * cosPolar;
    const z = this.target.z + this.distance * sinPolar * Math.cos(this.azimuth);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  update(delta: number) {
    const forward = Number(this.keys["KeyW"] || this.keys["ArrowUp"]);
    const backward = Number(this.keys["KeyS"] || this.keys["ArrowDown"]);
    const left = Number(this.keys["KeyA"] || this.keys["ArrowLeft"]);
    const right = Number(this.keys["KeyD"] || this.keys["ArrowRight"]);
    const up = Number(this.keys["Space"]);
    const down = Number(this.keys["ShiftLeft"] || this.keys["ShiftRight"]);

    const dirZ = forward - backward;
    const dirX = right - left;
    const dirY = up - down;

    // 以相机水平朝向为前方
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const sideDir = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0));

    const move = new THREE.Vector3()
      .addScaledVector(camDir, dirZ)
      .addScaledVector(sideDir, dirX);
    move.y = dirY;

    this.isMoving = move.lengthSq() > 0;
    this.moveDir.copy(move).normalize();

    if (this.isMoving) {
      move.normalize().multiplyScalar(this.speed * delta);

      const nextTarget = this.target.clone().add(move);
      // 简单的碰撞：防止目标点进入实心方块
      if (!this.isSolidAt(nextTarget.x, this.target.y, nextTarget.z)) {
        this.target.x = nextTarget.x;
      }
      if (!this.isSolidAt(this.target.x, nextTarget.y, this.target.z)) {
        this.target.y = nextTarget.y;
      }
      if (!this.isSolidAt(this.target.x, this.target.y, nextTarget.z)) {
        this.target.z = nextTarget.z;
      }
      this.updateCamera();
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
  }
}
