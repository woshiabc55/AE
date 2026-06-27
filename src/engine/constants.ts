export const ROWS = 5;
export const COLS = 9;
export const CELL_SIZE = 80;
export const LAWN_WIDTH = COLS * CELL_SIZE;
export const LAWN_HEIGHT = ROWS * CELL_SIZE;

export const INITIAL_SUN = 150;
export const INITIAL_LIVES = 5;
export const SUN_VALUE = 25;

export const SEED_PACKETS = [
  { type: "sunflower" as const, name: "向日葵", cost: 50, cooldown: 5000 },
  { type: "peashooter" as const, name: "豌豆射手", cost: 100, cooldown: 6000 },
  { type: "wallnut" as const, name: "坚果墙", cost: 50, cooldown: 12000 },
];

export const PLANT_HP: Record<string, number> = {
  sunflower: 80,
  peashooter: 80,
  wallnut: 600,
};

export const ZOMBIE_CONFIG = {
  basic: { name: "普通僵尸", hp: 100, speed: 18, damage: 12, color: "#7a8a7a" },
  conehead: { name: "路障僵尸", hp: 220, speed: 20, damage: 12, color: "#ff8a2b" },
  buckethead: { name: "铁桶僵尸", hp: 500, speed: 14, damage: 16, color: "#94a3b8" },
};

export const PROJECTILE_SPEED = 260;
export const PROJECTILE_DAMAGE = 20;

export const SUNFLOWER_INTERVAL = 12000;
export const SKY_SUN_INTERVAL = 8000;

export const WAVE_ZOMBIE_COUNTS = [3, 5, 7, 10, 14, 18];
