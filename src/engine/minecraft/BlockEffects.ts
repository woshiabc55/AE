// 方块破坏裂纹、粒子与放置动画效果

import * as THREE from "three";
import { VoxelWorld, BLOCK_DEFS, BlockType } from "./VoxelWorld";

export class BlockEffects {
  scene: THREE.Scene;
  world: VoxelWorld;

  // 裂纹
  crackMesh: THREE.Mesh;
  crackMaterial: THREE.MeshBasicMaterial;
  crackTexture: THREE.CanvasTexture;
  breakTarget: { x: number; y: number; z: number; type: BlockType } | null = null;
  breakProgress = 0; // 0 ~ 1
  breakTimeRequired = 0.35; // 秒
  breaking = false;
  onBreak?: (x: number, y: number, z: number, type: BlockType) => void;

  // 粒子
  particles: {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }[] = [];
  particleGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.12);

  constructor(scene: THREE.Scene, world: VoxelWorld) {
    this.scene = scene;
    this.world = world;

    // 裂纹贴图
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    this.crackTexture = new THREE.CanvasTexture(canvas);
    this.crackMaterial = new THREE.MeshBasicMaterial({
      map: this.crackTexture,
      transparent: true,
      opacity: 0.85,
      depthTest: false,
      side: THREE.FrontSide,
    });
    this.crackMesh = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.02, 1.02), this.crackMaterial);
    this.crackMesh.visible = false;
    this.scene.add(this.crackMesh);
  }

  // 生成裂纹贴图，stage 0~9
  private updateCrackTexture(stage: number) {
    const canvas = this.crackTexture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (stage <= 0) {
      this.crackTexture.needsUpdate = true;
      return;
    }

    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 2;
    const count = stage * 8;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 4 + 1, 0, Math.PI * 2);
      ctx.stroke();
    }
    this.crackTexture.needsUpdate = true;
  }

  startBreak(x: number, y: number, z: number, type: BlockType) {
    this.breakTarget = { x, y, z, type };
    this.breakProgress = 0;
    this.breaking = true;
    this.updateCrackTexture(0);
    this.crackMesh.visible = true;
    this.crackMesh.position.set(x, y, z);
  }

  updateBreak(delta: number, currentTarget: { x: number; y: number; z: number } | null) {
    if (!this.breaking || !this.breakTarget) {
      this.crackMesh.visible = false;
      return;
    }

    // 目标改变则取消破坏
    if (
      !currentTarget ||
      currentTarget.x !== this.breakTarget.x ||
      currentTarget.y !== this.breakTarget.y ||
      currentTarget.z !== this.breakTarget.z
    ) {
      this.cancelBreak();
      return;
    }

    this.breakProgress += delta / this.breakTimeRequired;
    const stage = Math.min(9, Math.floor(this.breakProgress * 10));
    this.updateCrackTexture(stage);
    this.crackMesh.position.set(this.breakTarget.x, this.breakTarget.y, this.breakTarget.z);

    if (this.breakProgress >= 1) {
      const { x, y, z, type } = this.breakTarget;
      this.world.removeBlock(x, y, z);
      this.spawnBreakParticles(x, y, z, type);
      this.onBreak?.(x, y, z, type);
      this.cancelBreak();
    }
  }

  cancelBreak() {
    this.breaking = false;
    this.breakTarget = null;
    this.breakProgress = 0;
    this.crackMesh.visible = false;
  }

  spawnBreakParticles(x: number, y: number, z: number, type: BlockType) {
    const color = BLOCK_DEFS[type]?.color ?? 0xffffff;
    const material = new THREE.MeshBasicMaterial({ color });
    const count = 8 + Math.floor(Math.random() * 6);

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.particleGeometry, material);
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.6,
        y + (Math.random() - 0.5) * 0.6,
        z + (Math.random() - 0.5) * 0.6,
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 4,
      );
      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 1.0, maxLife: 1.0 });
    }
  }

  spawnPlaceParticles(x: number, y: number, z: number, type: BlockType) {
    const color = BLOCK_DEFS[type]?.color ?? 0xffffff;
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const count = 6;

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.particleGeometry, material);
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.8,
        y + 0.6,
        z + (Math.random() - 0.5) * 0.8,
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2,
      );
      this.scene.add(mesh);
      this.particles.push({ mesh, vel, life: 0.5, maxLife: 0.5 });
    }
  }

  updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      p.vel.y -= 9.8 * delta; // 重力
      p.mesh.position.addScaledVector(p.vel, delta);
      p.mesh.rotation.x += p.vel.z * delta;
      p.mesh.rotation.z -= p.vel.x * delta;
      const scale = Math.max(0.01, p.life / p.maxLife);
      p.mesh.scale.setScalar(scale);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  update(delta: number, currentTarget: { x: number; y: number; z: number } | null) {
    this.updateBreak(delta, currentTarget);
    this.updateParticles(delta);
  }

  dispose() {
    this.cancelBreak();
    this.crackMesh.geometry.dispose();
    this.crackMaterial.dispose();
    this.crackTexture.dispose();
    this.scene.remove(this.crackMesh);
    for (const p of this.particles) {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
    this.particles = [];
  }
}
