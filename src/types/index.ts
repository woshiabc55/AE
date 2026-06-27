export type PlantType = "sunflower" | "peashooter" | "wallnut";
export type ZombieType = "basic" | "conehead" | "buckethead";

export interface Position {
  x: number;
  y: number;
}

export interface Plant {
  id: string;
  type: PlantType;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  lastActionAt: number;
}

export interface Zombie {
  id: string;
  type: ZombieType;
  row: number;
  x: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  attackCooldown: number;
  lastAttackAt: number;
  isAttacking: boolean;
  isHit: boolean;
  hitUntil: number;
}

export interface Projectile {
  id: string;
  row: number;
  x: number;
  y: number;
  damage: number;
  speed: number;
}

export interface Sun {
  id: string;
  x: number;
  y: number;
  value: number;
  createdAt: number;
  lifetime: number;
}

export interface SeedPacket {
  type: PlantType;
  name: string;
  cost: number;
  cooldown: number;
  rechargedAt: number;
}

export type GameStatus = "idle" | "running" | "paused" | "gameover";

export interface GameState {
  status: GameStatus;
  sun: number;
  lives: number;
  wave: number;
  lastTick: number;
  lastSkySunAt: number;
  plants: Plant[];
  zombies: Zombie[];
  projectiles: Projectile[];
  suns: Sun[];
  selectedSeed: PlantType | null;
  seedPackets: SeedPacket[];
  hoveredCell: { row: number; col: number } | null;
  waveState: {
    remaining: number;
    lastSpawnAt: number;
  };
}

export type GameAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK"; now: number }
  | { type: "SELECT_SEED"; seed: PlantType | null }
  | { type: "PLANT"; row: number; col: number }
  | { type: "COLLECT_SUN"; id: string }
  | { type: "HOVER_CELL"; cell: { row: number; col: number } | null };
