// 方块世界数据、区块生成与动态加载逻辑

export type BlockType =
  | "air"
  | "grass"
  | "dirt"
  | "stone"
  | "wood"
  | "leaves"
  | "sand"
  | "water"
  | "glass"
  | "planks"
  | "brick"
  | "diamond";

export interface Block {
  x: number;
  y: number;
  z: number;
  type: BlockType;
}

export interface BlockDef {
  color: number;
  solid: boolean;
  transparent?: boolean;
  emissive?: number;
}

export const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  air: { color: 0x000000, solid: false, transparent: true },
  grass: { color: 0x5b9a48, solid: true },
  dirt: { color: 0x866043, solid: true },
  stone: { color: 0x7a7a7a, solid: true },
  wood: { color: 0x6b4f3b, solid: true },
  leaves: { color: 0x3a7a3a, solid: true },
  sand: { color: 0xd6c376, solid: true },
  water: { color: 0x3c78b6, solid: false, transparent: true },
  glass: { color: 0xaaddff, solid: true, transparent: true },
  planks: { color: 0xa67c52, solid: true },
  brick: { color: 0xa05040, solid: true },
  diamond: { color: 0x4ce0e0, solid: true, emissive: 0x113333 },
};

export const PLACEABLE_BLOCKS: BlockType[] = [
  "grass",
  "dirt",
  "stone",
  "wood",
  "leaves",
  "sand",
  "glass",
  "planks",
  "brick",
  "diamond",
];

function blockKey(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}

function chunkKey(cx: number, cz: number) {
  return `${cx},${cz}`;
}

// 简单的伪随机噪声（基于整数坐标）
function hash(x: number, z: number) {
  let h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function smoothNoise(x: number, z: number) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;

  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);

  const u = fx * fx * (3 - 2 * fx);
  const v = fz * fz * (3 - 2 * fz);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function terrainHeight(x: number, z: number) {
  // 低频大起伏：山脉与谷地
  let h = smoothNoise(x * 0.035, z * 0.035) * 14;
  // 中频丘陵
  h += smoothNoise(x * 0.09, z * 0.09) * 5;
  // 高频细节
  h += smoothNoise(x * 0.22, z * 0.22) * 1.5;
  // 使地形更尖锐：幂函数放大高点
  h = Math.pow(Math.abs(h) / 18, 1.4) * Math.sign(h) * 18;
  return Math.floor(h) + 8;
}

export class Chunk {
  blocks = new Map<string, Block>();
  loaded = false;

  constructor(public cx: number, public cz: number, public size: number = 16) {}

  worldX(lx: number) {
    return this.cx * this.size + lx;
  }
  worldZ(lz: number) {
    return this.cz * this.size + lz;
  }

  setBlock(x: number, y: number, z: number, type: BlockType) {
    if (type === "air") {
      this.blocks.delete(blockKey(x, y, z));
    } else {
      this.blocks.set(blockKey(x, y, z), { x, y, z, type });
    }
  }

  removeBlock(x: number, y: number, z: number) {
    this.blocks.delete(blockKey(x, y, z));
  }

  getBlock(x: number, y: number, z: number): Block | null {
    return this.blocks.get(blockKey(x, y, z)) || null;
  }
}

export class VoxelWorld {
  blocks = new Map<string, Block>(); // 全局方块表，供渲染器使用
  chunks = new Map<string, Chunk>();
  loadedChunks = new Set<string>();
  chunkSize = 16;
  maxHeight = 36;
  renderDistance = 3; // 加载半径（区块数）

  constructor() {
    this.generate();
  }

  // 生成/重新生成世界，从原点周围加载
  generate() {
    this.blocks.clear();
    this.chunks.clear();
    this.loadedChunks.clear();
    this.updateLoadedChunks(0, 0, this.renderDistance);
  }

  // 异步生成世界并报告进度（用于加载界面）
  async generateAsync(distance: number, onProgress?: (percent: number) => void) {
    this.blocks.clear();
    this.chunks.clear();
    this.loadedChunks.clear();

    const desired: { cx: number; cz: number }[] = [];
    for (let dx = -distance; dx <= distance; dx++) {
      for (let dz = -distance; dz <= distance; dz++) {
        desired.push({ cx: dx, cz: dz });
      }
    }

    const total = desired.length;
    for (let i = 0; i < total; i++) {
      const { cx, cz } = desired[i];
      this.loadChunk(cx, cz);
      if (onProgress) {
        onProgress(Math.round(((i + 1) / total) * 100));
      }
      // 让出主线程，避免阻塞 UI
      if (i % 4 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  getChunk(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(chunkKey(cx, cz));
  }

  ensureChunk(cx: number, cz: number): Chunk {
    const key = chunkKey(cx, cz);
    let chunk = this.chunks.get(key);
    if (!chunk) {
      chunk = new Chunk(cx, cz, this.chunkSize);
      this.chunks.set(key, chunk);
    }
    return chunk;
  }

  loadChunk(cx: number, cz: number) {
    const key = chunkKey(cx, cz);
    if (this.loadedChunks.has(key)) return;

    const chunk = this.ensureChunk(cx, cz);
    if (chunk.blocks.size === 0) {
      this.populateChunk(chunk);
    }

    // 将区块方块同步到全局表
    for (const block of chunk.blocks.values()) {
      this.blocks.set(blockKey(block.x, block.y, block.z), block);
    }
    this.loadedChunks.add(key);
    chunk.loaded = true;
  }

  unloadChunk(cx: number, cz: number) {
    const key = chunkKey(cx, cz);
    if (!this.loadedChunks.has(key)) return;

    const chunk = this.chunks.get(key);
    if (chunk) {
      for (const block of chunk.blocks.values()) {
        this.blocks.delete(blockKey(block.x, block.y, block.z));
      }
      chunk.loaded = false;
    }
    this.loadedChunks.delete(key);
  }

  updateLoadedChunks(playerX: number, playerZ: number, distance?: number) {
    const dist = distance ?? this.renderDistance;
    const pcx = Math.floor(playerX / this.chunkSize);
    const pcz = Math.floor(playerZ / this.chunkSize);

    const desired = new Set<string>();
    for (let dx = -dist; dx <= dist; dx++) {
      for (let dz = -dist; dz <= dist; dz++) {
        const cx = pcx + dx;
        const cz = pcz + dz;
        desired.add(chunkKey(cx, cz));
      }
    }

    // 卸载不需要的区块
    for (const key of this.loadedChunks) {
      if (!desired.has(key)) {
        const [cx, cz] = key.split(",").map(Number);
        this.unloadChunk(cx, cz);
      }
    }

    // 加载需要的区块
    for (const key of desired) {
      const [cx, cz] = key.split(",").map(Number);
      this.loadChunk(cx, cz);
    }
  }

  populateChunk(chunk: Chunk) {
    const size = this.chunkSize;
    for (let lx = 0; lx < size; lx++) {
      for (let lz = 0; lz < size; lz++) {
        const x = chunk.worldX(lx);
        const z = chunk.worldZ(lz);
        const h = terrainHeight(x, z);

        // 地表
        for (let y = 0; y <= h; y++) {
          let type: BlockType;
          if (y === h) type = "grass";
          else if (y >= h - 2) type = "dirt";
          else type = "stone";
          chunk.setBlock(x, y, z, type);
        }

        // 沙地 / 水域
        if (h < 3) {
          for (let y = h + 1; y <= 3; y++) {
            chunk.setBlock(x, y, z, "water");
          }
          if (h === 2) chunk.setBlock(x, h, z, "sand");
        }

        // 树木
        if (h >= 3 && h <= 12 && hash(x, z) > 0.96) {
          this.makeTree(chunk, x, h + 1, z);
        }
      }
    }

    // 钻石矿
    const diamondCount = 2;
    for (let i = 0; i < diamondCount; i++) {
      const lx = Math.floor(hash(chunk.cx, i) * size);
      const lz = Math.floor(hash(chunk.cz, i + 10) * size);
      const x = chunk.worldX(lx);
      const z = chunk.worldZ(lz);
      const y = Math.floor(hash(x, z) * 4) + 1;
      if (chunk.getBlock(x, y, z)?.type === "stone") {
        chunk.setBlock(x, y, z, "diamond");
      }
    }
  }

  makeTree(chunk: Chunk, x: number, y: number, z: number) {
    const trunkHeight = 3 + Math.floor(hash(x, y + z) * 2);
    for (let i = 0; i < trunkHeight; i++) {
      chunk.setBlock(x, y + i, z, "wood");
    }

    const leafStart = y + trunkHeight - 1;
    for (let lx = x - 2; lx <= x + 2; lx++) {
      for (let lz = z - 2; lz <= z + 2; lz++) {
        for (let ly = leafStart; ly <= leafStart + 2; ly++) {
          const dx = Math.abs(lx - x);
          const dz = Math.abs(lz - z);
          const dy = ly - leafStart;
          if (dx + dz + dy <= 3 && !(dx === 0 && dz === 0 && dy === 0)) {
            if (hash(lx, ly + lz) > 0.15) {
              const targetChunk = this.getChunkAt(lx, lz) ?? chunk;
              targetChunk.setBlock(lx, ly, lz, "leaves");
            }
          }
        }
      }
    }
  }

  getChunkAt(x: number, z: number): Chunk | undefined {
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    return this.chunks.get(chunkKey(cx, cz));
  }

  getBlock(x: number, y: number, z: number): Block | null {
    return this.blocks.get(blockKey(x, y, z)) || null;
  }

  setBlock(x: number, y: number, z: number, type: BlockType) {
    const key = blockKey(x, y, z);
    if (type === "air") {
      this.blocks.delete(key);
    } else {
      this.blocks.set(key, { x, y, z, type });
    }
    // 同步到对应区块
    const chunk = this.getChunkAt(x, z);
    if (chunk) chunk.setBlock(x, y, z, type);
  }

  removeBlock(x: number, y: number, z: number) {
    this.blocks.delete(blockKey(x, y, z));
    const chunk = this.getChunkAt(x, z);
    if (chunk) chunk.removeBlock(x, y, z);
  }

  hasBlock(x: number, y: number, z: number) {
    return this.blocks.has(blockKey(x, y, z));
  }

  isSolid(x: number, y: number, z: number) {
    const b = this.getBlock(x, y, z);
    return b ? BLOCK_DEFS[b.type].solid : false;
  }

  *allBlocks() {
    for (const block of this.blocks.values()) {
      yield block;
    }
  }
}
