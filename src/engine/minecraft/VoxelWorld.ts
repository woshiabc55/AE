// 方块世界数据与生成逻辑

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

function key(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
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

function terrainHeight(x: number, z: number) {
  let h = smoothNoise(x * 0.08, z * 0.08) * 4;
  h += smoothNoise(x * 0.03, z * 0.03) * 6;
  h += smoothNoise(x * 0.15, z * 0.15) * 1.5;
  return Math.floor(h) + 4;
}

export class VoxelWorld {
  blocks = new Map<string, Block>();
  worldSize = 48;
  maxHeight = 18;

  constructor() {
    this.generate();
  }

  generate() {
    this.blocks.clear();
    const size = this.worldSize;
    const half = Math.floor(size / 2);

    for (let x = -half; x < half; x++) {
      for (let z = -half; z < half; z++) {
        const h = terrainHeight(x, z);

        // 地表
        for (let y = 0; y <= h; y++) {
          let type: BlockType;
          if (y === h) type = "grass";
          else if (y >= h - 2) type = "dirt";
          else type = "stone";
          this.setBlock(x, y, z, type);
        }

        // 沙地 / 水域
        if (h < 3) {
          for (let y = h + 1; y <= 3; y++) {
            this.setBlock(x, y, z, "water");
          }
          if (h === 2) this.setBlock(x, h, z, "sand");
        }

        // 树木
        if (h >= 3 && h <= 12 && hash(x, z) > 0.96) {
          this.makeTree(x, h + 1, z);
        }
      }
    }

    // 生成一些漂浮钻石矿
    for (let i = 0; i < 8; i++) {
      const x = Math.floor((hash(i, 1) - 0.5) * size * 0.6);
      const z = Math.floor((hash(i, 2) - 0.5) * size * 0.6);
      const y = Math.floor(hash(i, 3) * 4) + 1;
      if (this.getBlock(x, y, z)?.type === "stone") {
        this.setBlock(x, y, z, "diamond");
      }
    }
  }

  makeTree(x: number, y: number, z: number) {
    const trunkHeight = 3 + Math.floor(hash(x, y + z) * 2);
    for (let i = 0; i < trunkHeight; i++) {
      this.setBlock(x, y + i, z, "wood");
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
              this.setBlock(lx, ly, lz, "leaves");
            }
          }
        }
      }
    }
  }

  getBlock(x: number, y: number, z: number): Block | null {
    return this.blocks.get(key(x, y, z)) || null;
  }

  setBlock(x: number, y: number, z: number, type: BlockType) {
    if (type === "air") {
      this.blocks.delete(key(x, y, z));
    } else {
      this.blocks.set(key(x, y, z), { x, y, z, type });
    }
  }

  removeBlock(x: number, y: number, z: number) {
    this.blocks.delete(key(x, y, z));
  }

  hasBlock(x: number, y: number, z: number) {
    return this.blocks.has(key(x, y, z));
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
