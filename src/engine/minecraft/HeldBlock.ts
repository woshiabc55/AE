// 第一人称手持方块显示

import * as THREE from "three";
import { BlockType, BLOCK_DEFS } from "./VoxelWorld";

export class HeldBlock {
  mesh: THREE.Mesh;
  material: THREE.MeshLambertMaterial;
  currentType: BlockType = "grass";

  constructor(private camera: THREE.PerspectiveCamera) {
    this.material = new THREE.MeshLambertMaterial({ color: BLOCK_DEFS.grass.color });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), this.material);
    this.mesh.visible = false;
    this.camera.add(this.mesh);
  }

  setType(type: BlockType) {
    if (this.currentType === type) return;
    this.currentType = type;
    this.material.color.setHex(BLOCK_DEFS[type].color);
    this.material.emissive.setHex(BLOCK_DEFS[type].emissive ?? 0x000000);
  }

  update(delta: number, moving: boolean) {
    // 位置：相机右下方
    this.mesh.position.set(0.35, -0.25, -0.5);
    this.mesh.rotation.set(0.2, -0.3, 0.1);

    // 行走时轻微摆动
    if (moving) {
      this.mesh.position.y += Math.sin(performance.now() * 0.015) * 0.015;
      this.mesh.rotation.z += Math.sin(performance.now() * 0.01) * 0.05;
    }

    this.mesh.visible = true;
  }

  setVisible(visible: boolean) {
    this.mesh.visible = visible;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.camera.remove(this.mesh);
  }
}
