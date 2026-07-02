import * as THREE from "three";
import { CELL, WALL_H, parseMap, type ParsedMap } from "./maps";
import { makeGroundTexture, makeWallTexture, makeCaptureBeacon, makeSkyTexture } from "./textures";

export class World {
  group = new THREE.Group();
  grid: number[][];
  cols: number;
  rows: number;
  parsed: ParsedMap;
  fog: THREE.FogExp2;
  private captureBeacon: THREE.Sprite;
  private captureMat: THREE.SpriteMaterial;
  private wallTex: THREE.Texture;

  constructor(fogDensity: number) {
    const parsed = parseMap();
    this.parsed = parsed;
    this.grid = parsed.grid;
    this.cols = parsed.cols;
    this.rows = parsed.rows;

    // 雾：墨绿战场浓雾
    this.fog = new THREE.FogExp2(0x0d1410, fogDensity);

    // 地面
    const groundTex = makeGroundTexture();
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(parsed.cols * CELL, parsed.rows * CELL),
      new THREE.MeshLambertMaterial({ map: groundTex }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.group.add(ground);

    // 天空盒(大球内壁)
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(120, 16, 12),
      new THREE.MeshBasicMaterial({ map: makeSkyTexture(), side: THREE.BackSide, fog: false }),
    );
    this.group.add(sky);

    // 墙/建筑：用 InstancedMesh 合并所有墙格
    this.wallTex = makeWallTexture();
    const wallGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL);
    const wallMat = new THREE.MeshLambertMaterial({ map: this.wallTex });
    const wallCells: { x: number; z: number }[] = [];
    for (let r = 0; r < parsed.rows; r++) {
      for (let c = 0; c < parsed.cols; c++) {
        if (parsed.grid[r][c] === 1) {
          const w = this.cellToWorld(r, c);
          wallCells.push(w);
        }
      }
    }
    const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallCells.length);
    const m = new THREE.Matrix4();
    wallCells.forEach((w, i) => {
      m.makeTranslation(w.x, WALL_H / 2, w.z);
      walls.setMatrixAt(i, m);
    });
    walls.instanceMatrix.needsUpdate = true;
    this.group.add(walls);

    // 中央据点光柱
    this.captureMat = new THREE.SpriteMaterial({
      map: makeCaptureBeacon(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      fog: true,
      depthWrite: false,
    });
    this.captureBeacon = new THREE.Sprite(this.captureMat);
    this.captureBeacon.scale.set(6, 10, 1);
    this.captureBeacon.position.set(parsed.capture.x, 5, parsed.capture.z);
    this.group.add(this.captureBeacon);

    // 据点地面标记圆环(线框)
    const ringGeo = new THREE.RingGeometry(parsed.capture.r - 0.3, parsed.capture.r, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd86b,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      fog: true,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(parsed.capture.x, 0.05, parsed.capture.z);
    this.group.add(ring);

    // 灯光：冷环境光 + 天顶方向光(日光) + 玩家辅助光
    const ambient = new THREE.AmbientLight(0x4a5a48, 0.7);
    this.group.add(ambient);
    const dir = new THREE.DirectionalLight(0xbfd8c8, 0.9);
    dir.position.set(20, 40, 10);
    this.group.add(dir);
    const hemi = new THREE.HemisphereLight(0x88a090, 0x0d1410, 0.5);
    this.group.add(hemi);
    const playerLight = new THREE.PointLight(0x6fa0c8, 0.9, 22, 1.5);
    playerLight.position.set(0, 3, 0);
    this.group.add(playerLight);
    this.playerLight = playerLight;

    void this.cellToWorld; // keep ref
  }

  playerLight: THREE.PointLight;

  // 网格坐标 -> 世界坐标(居中)
  cellToWorld(r: number, c: number) {
    return {
      x: (c - this.cols / 2 + 0.5) * CELL,
      z: (r - this.rows / 2 + 0.5) * CELL,
    };
  }

  // 圆形碰撞检测：检查 (x,z) 半径 r 是否撞墙
  collides(x: number, z: number, r: number): boolean {
    // 检查周围 3x3 格
    const c = Math.floor(x / CELL + this.cols / 2);
    const rr = Math.floor(z / CELL + this.rows / 2);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = rr + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= this.rows || nc >= this.cols) continue;
        if (this.grid[nr][nc] !== 1) continue;
        // AABB 与圆碰撞
        const wx = (nc - this.cols / 2 + 0.5) * CELL;
        const wz = (nr - this.rows / 2 + 0.5) * CELL;
        const dx = Math.max(Math.abs(x - wx) - CELL / 2, 0);
        const dz = Math.max(Math.abs(z - wz) - CELL / 2, 0);
        if (dx * dx + dz * dz < r * r) return true;
      }
    }
    return false;
  }

  // 射线 vs 墙格：返回最近命中距离(无墙返回 maxDist)
  raycastWalls(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): number {
    // 用 DDA 风格步进
    const step = 0.5;
    for (let t = 0; t < maxDist; t += step) {
      const x = origin.x + dir.x * t;
      const z = origin.z + dir.z * t;
      const c = Math.floor(x / CELL + this.cols / 2);
      const r = Math.floor(z / CELL + this.rows / 2);
      if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return t;
      if (this.grid[r][c] === 1) return t;
    }
    return maxDist;
  }

  updateCaptureBeacon(t: number, owner: "alpha" | "bravo" | "neutral") {
    const pulse = 0.6 + Math.sin(t * 2.5) * 0.3;
    this.captureMat.opacity = pulse;
    const color = owner === "alpha" ? 0x3a8cff : owner === "bravo" ? 0xff3b5c : 0xffd86b;
    (this.captureBeacon.material as THREE.SpriteMaterial).color.setHex(color);
  }

  dispose() {
    this.wallTex.dispose();
    this.captureMat.map?.dispose();
    this.captureMat.dispose();
    this.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }
}
