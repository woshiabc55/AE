// Three.js 方块世界渲染器

import * as THREE from "three";
import { VoxelWorld, Block, BLOCK_DEFS, BlockType } from "./VoxelWorld";

export class VoxelRenderer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  mesh: THREE.InstancedMesh;
  highlight: THREE.LineSegments;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshLambertMaterial;
  dummy = new THREE.Object3D();
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2(0, 0);
  sun: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;

  // 记录实例索引 -> 方块坐标的映射
  instanceMap: { x: number; y: number; z: number; type: BlockType }[] = [];

  constructor(public container: HTMLElement, public world: VoxelWorld) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 30, 140);

    // 相机
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 12, 18);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 方块几何与材质
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    });

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, 400000);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // 选中高亮框
    const edges = new THREE.EdgesGeometry(this.geometry);
    this.highlight = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }),
    );
    this.highlight.visible = false;
    this.scene.add(this.highlight);

    // 灯光
    this.ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff5e0, 0.9);
    this.sun.position.set(40, 60, 30);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 200;
    this.sun.shadow.camera.left = -80;
    this.sun.shadow.camera.right = 80;
    this.sun.shadow.camera.top = 80;
    this.sun.shadow.camera.bottom = -80;
    this.scene.add(this.sun);

    // 地面底板（虚空之下的薄板，增加深度感）
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ color: 0x1a1625 }),
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -1;
    this.scene.add(groundPlane);

    this.rebuildMesh();
  }

  rebuildMesh() {
    this.instanceMap = [];
    let index = 0;

    for (const block of this.world.allBlocks()) {
      const def = BLOCK_DEFS[block.type];
      if (block.type === "air") continue;

      this.dummy.position.set(block.x, block.y, block.z);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(index, this.dummy.matrix);
      this.mesh.setColorAt(index, new THREE.Color(def.color));
      this.instanceMap[index] = { x: block.x, y: block.y, z: block.z, type: block.type };
      index++;
    }

    this.mesh.count = index;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setFov(fov: number) {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  getTargetBlock(maxDistance = 6) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersection = this.raycaster.intersectObject(this.mesh)[0];

    if (!intersection || intersection.distance > maxDistance) {
      return null;
    }

    const instanceId = intersection.instanceId ?? 0;
    const block = this.instanceMap[instanceId];
    if (!block) return null;

    const normal = intersection.face?.normal ?? new THREE.Vector3();
    return {
      block,
      normal: { x: normal.x, y: normal.y, z: normal.z },
      intersection,
    };
  }

  updateHighlight() {
    const target = this.getTargetBlock();
    if (target) {
      this.highlight.position.set(target.block.x, target.block.y, target.block.z);
      this.highlight.visible = true;
    } else {
      this.highlight.visible = false;
    }
  }

  destroy() {
    this.renderer.dispose();
    this.geometry.dispose();
    this.material.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
