import * as THREE from "three";
import { CELL, WALL_H, type ParsedLevel } from "./levels";
import { makeWallTexture, makeFloorTexture, makeCeilTexture } from "./textures";

export class World {
  group: THREE.Group;
  grid: number[][];
  cols: number;
  rows: number;
  playerLight: THREE.PointLight;
  private wallMesh: THREE.InstancedMesh;

  constructor(level: ParsedLevel, fogDensity: number) {
    this.group = new THREE.Group();
    this.grid = level.grid.map((r) => [...r]);
    this.cols = level.cols;
    this.rows = level.rows;

    const halfW = (level.cols * CELL) / 2;
    const halfH = (level.rows * CELL) / 2;

    // 雾：与背景同色，远景隐入虚空
    const fog = new THREE.FogExp2(0x05060a, fogDensity);

    // 地板
    const floorTex = makeFloorTexture();
    floorTex.repeat.set(level.cols, level.rows);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(level.cols * CELL, level.rows * CELL),
      new THREE.MeshLambertMaterial({ map: floorTex }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    this.group.add(floor);

    // 天花板
    const ceilTex = makeCeilTexture();
    ceilTex.repeat.set(level.cols, level.rows);
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(level.cols * CELL, level.rows * CELL),
      new THREE.MeshLambertMaterial({ map: ceilTex }),
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, WALL_H, 0);
    this.group.add(ceil);

    // 墙体：InstancedMesh，每个墙体格一个实例
    const wallTex = makeWallTexture();
    const wallMat = new THREE.MeshLambertMaterial({ map: wallTex });
    const boxGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL);
    // 统计墙体数
    let wallCount = 0;
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        if (level.grid[r][c] === 1) wallCount++;
      }
    }
    this.wallMesh = new THREE.InstancedMesh(boxGeo, wallMat, wallCount);
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        if (level.grid[r][c] === 1) {
          const { x, z } = this.cellToWorld(r, c);
          m.makeTranslation(x, WALL_H / 2, z);
          this.wallMesh.setMatrixAt(i, m);
          i++;
        }
      }
    }
    this.wallMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.wallMesh);

    // 灯光：极弱环境光 + 玩家头顶点光（行者之光）
    const ambient = new THREE.AmbientLight(0x142236, 0.55);
    this.group.add(ambient);
    const hemi = new THREE.HemisphereLight(0x1a3a5a, 0x05060a, 0.35);
    this.group.add(hemi);
    this.playerLight = new THREE.PointLight(0x6fe0ff, 1.4, 26, 1.6);
    this.playerLight.position.set(0, 3.4, 0);
    this.group.add(this.playerLight);

    // 暴露雾给场景（GameScene 读取）
    this.fog = fog;
    void halfW;
    void halfH;
  }

  fog: THREE.FogExp2;

  cellToWorld(r: number, c: number) {
    return {
      x: (c - this.cols / 2) * CELL,
      z: (r - this.rows / 2) * CELL,
    };
  }

  worldToCell(x: number, z: number) {
    const c = Math.floor(x / CELL + this.cols / 2);
    const r = Math.floor(z / CELL + this.rows / 2);
    return { r, c };
  }

  isSolidCell(r: number, c: number): boolean {
    if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return true;
    return this.grid[r][c] === 1;
  }

  // 圆-网格碰撞：给定世界坐标与半径，返回是否撞墙
  collides(x: number, z: number, radius: number): boolean {
    const { r, c } = this.worldToCell(x, z);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const rr = r + dr;
        const cc = c + dc;
        if (!this.isSolidCell(rr, cc)) continue;
        // 该格的 AABB
        const { x: cx, z: cz } = this.cellToWorld(rr, cc);
        const minX = cx - CELL / 2;
        const maxX = cx + CELL / 2;
        const minZ = cz - CELL / 2;
        const maxZ = cz + CELL / 2;
        const closestX = Math.max(minX, Math.min(x, maxX));
        const closestZ = Math.max(minZ, Math.min(z, maxZ));
        const dx = x - closestX;
        const dz = z - closestZ;
        if (dx * dx + dz * dz < radius * radius) return true;
      }
    }
    return false;
  }

  setFogDensity(d: number) {
    this.fog.density = d;
  }

  dispose() {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mat = o.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      }
    });
  }
}
