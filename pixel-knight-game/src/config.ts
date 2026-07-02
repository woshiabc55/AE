// 像素骑士：暗影征伐 - 全局配置常量

// 逻辑分辨率（固定 16:9，CSS 缩放铺满）
export const VIEW_W = 1280;
export const VIEW_H = 720;

// 世界地面 Y（地面顶部所在的 Y 坐标）
export const GROUND_Y = 600;
export const WORLD_LEFT = -200;
export const WORLD_RIGHT = 2600;

// 物理
export const GRAVITY = 2600;
export const PIXEL = 3; // 像素块尺寸（程序化精灵的基础单位）

// 主调色板（精灵 + 场景共用）
export const PAL = {
  outline: "#0b0814",
  // 骑士
  armorDark: "#2b2540",
  armorMid: "#4b4366",
  armorLight: "#aab4d6",
  visorDark: "#15131f",
  visorGlow: "#5fd0ff",
  capeRed: "#b8323c",
  capeDark: "#6e1c24",
  plumeRed: "#e8404a",
  gold: "#ffd23f",
  blade: "#dce4f4",
  bladeShadow: "#6b7280",
  leather: "#6b4423",
  white: "#ffffff",
  // 骷髅
  bone: "#d8d4c4",
  boneShadow: "#9a9580",
  boneDark: "#5c5848",
  ghoulGlow: "#3ddc84",
  // 场景
  skyTop: "#070a18",
  skyMid: "#101a33",
  skyHorizon: "#1e2b4a",
  moon: "#cfe0f0",
  moonGlow: "#8ab4c4",
  castleFar: "#131c33",
  castleMid: "#1a2540",
  pillar: "#222c46",
  pillarLight: "#2e3a58",
  ground: "#1a1b2a",
  groundTop: "#2a2d3e",
  fog: "#2a3550",
  torchFire: "#ff8a3c",
  torchCore: "#ffd23f",
  blood: "#c01828",
  spark: "#ffd23f",
  dust: "#6b6480",
} as const;

// 骑士参数
export const PLAYER = {
  maxHp: 100,
  width: 42,
  height: 78,
  speed: 330,
  jumpVel: -820,
  airControl: 0.7,
  doubleJumpVel: -720,
  dashSpeed: 760,
  dashTime: 0.16,
  dashCooldown: 0.5,
  invincibleDash: 0.18,
  attackDamage: [16, 20, 28] as const,
  attackDuration: [0.26, 0.28, 0.34] as const,
  attackHitStart: [0.06, 0.06, 0.08] as const,
  attackHitEnd: [0.18, 0.2, 0.26] as const,
  attackReach: 78,
  attackHeight: 76,
  comboWindow: 0.4,
  hurtInvincible: 0.7,
  knockbackResist: 0.4,
} as const;

// 骷髅敌人参数
export const ENEMY = {
  width: 40,
  height: 72,
  hp: 40,
  speed: 120,
  chaseSpeed: 175,
  damage: 12,
  attackRange: 60,
  attackWindup: 0.42,
  attackActive: 0.12,
  attackRecover: 0.5,
  detectRange: 460,
  hurtStun: 0.32,
  knockback: 320,
  scoreValue: 100,
} as const;

// 波次配置：每波敌人数量与刷新间隔
export const WAVES: Array<{ count: number; interval: number; label: string }> = [
  { count: 3, interval: 1.2, label: "第一波 · 亡灵斥候" },
  { count: 4, interval: 1.0, label: "第二波 · 骸骨先锋" },
  { count: 5, interval: 0.9, label: "第三波 · 暗影军团" },
  { count: 6, interval: 0.8, label: "最终波 · 死灵围攻" },
];

export const COMBO_TIMEOUT = 1.6;
export const SCORE_PER_HIT = 10;
