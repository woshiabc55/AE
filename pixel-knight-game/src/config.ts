// 像素骑士：暗影征伐 - 全局配置常量

import type { SkillId, PassiveId, EnemyKind } from "@/types";

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

// ===== 专注值 =====
export const FOCUS = {
  max: 100,
  regenPerSec: 8,
  perHit: 2,
  perKill: 8,
} as const;

// ===== 主动技能定义 =====
export interface SkillDef {
  id: SkillId;
  name: string;
  key: string; // 键盘按键
  cost: number;
  cooldown: number;
  castTime: number; // 释放动作时长（秒）
  desc: string;
  color: string;
}

export const SKILLS: Record<SkillId, SkillDef> = {
  whirlwind: { id: "whirlwind", name: "旋风斩", key: "KeyQ", cost: 12, cooldown: 2.5, castTime: 0.4, desc: "360° 范围斩击", color: "#dce4f4" },
  shieldBash: { id: "shieldBash", name: "盾击", key: "KeyE", cost: 15, cooldown: 3.5, castTime: 0.3, desc: "眩晕敌人 1.2s", color: "#ffd23f" },
  dashSlash: { id: "dashSlash", name: "突进斩", key: "KeyR", cost: 18, cooldown: 3.0, castTime: 0.28, desc: "突进斩击", color: "#5fd0ff" },
  holyBolt: { id: "holyBolt", name: "圣光弹", key: "KeyF", cost: 10, cooldown: 1.8, castTime: 0.25, desc: "远程光弹穿透", color: "#fff7d0" },
  meteor: { id: "meteor", name: "陨星斩", key: "KeyV", cost: 25, cooldown: 6.0, castTime: 0.5, desc: "跃起下劈 AOE", color: "#ff8a3c" },
  bloodlust: { id: "bloodlust", name: "嗜血狂怒", key: "KeyC", cost: 30, cooldown: 14, castTime: 0.4, desc: "8s 攻速+吸血", color: "#c01828" },
  thunder: { id: "thunder", name: "雷霆审判", key: "KeyX", cost: 28, cooldown: 7, castTime: 0.45, desc: "3 道落雷", color: "#5fd0ff" },
  dawn: { id: "dawn", name: "晨曦终焉", key: "KeyZ", cost: 60, cooldown: 18, castTime: 0.9, desc: "终极全屏光柱", color: "#ffd23f" },
};

export const SKILL_ORDER: SkillId[] = [
  "whirlwind", "shieldBash", "dashSlash", "holyBolt",
  "meteor", "bloodlust", "thunder", "dawn",
];

// ===== 被动技能定义 =====
export interface PassiveDef {
  id: PassiveId;
  name: string;
  desc: string;
  unlockChapter: number;
}

export const PASSIVES: Record<PassiveId, PassiveDef> = {
  lifesteal: { id: "lifesteal", name: "吸血", desc: "攻击回复 5% 伤害血量", unlockChapter: 1 },
  critMaster: { id: "critMaster", name: "暴击大师", desc: "暴击率 +25%，1.8x 倍率", unlockChapter: 1 },
  swift: { id: "swift", name: "迅捷之风", desc: "移速 +15%，冲刺冷却 -30%", unlockChapter: 2 },
  ironWill: { id: "ironWill", name: "钢铁意志", desc: "受到伤害减免 20%", unlockChapter: 2 },
  comboFrenzy: { id: "comboFrenzy", name: "连击狂热", desc: "连击倍率 +50%", unlockChapter: 3 },
  lightBlessing: { id: "lightBlessing", name: "光之护佑", desc: "致死复活一次（每战 1 次）", unlockChapter: 3 },
};

// ===== 关卡定义 =====
export interface ChapterDef {
  id: number;
  name: string;
  subtitle: string;
  theme: "graveyard" | "swamp" | "frost" | "throne";
  waves: Array<{ count: number; interval: number; label: string }>;
  enemyTypes: EnemyKind[];
  boss: BossDef;
  unlockPassives: PassiveId[];
}

export interface BossDef {
  id: string;
  name: string;
  title: string;
  kind: EnemyKind;
  maxHp: number;
  width: number;
  height: number;
  damage: number;
  speed: number;
  phases: number;
  themeColor: string;
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: 1,
    name: "亡者墓地",
    subtitle: "第一章 · 永夜初临",
    theme: "graveyard",
    waves: [
      { count: 3, interval: 1.2, label: "亡灵斥候" },
      { count: 4, interval: 1.0, label: "骸骨先锋" },
    ],
    enemyTypes: ["skeletonScout", "skeletonArcher"],
    unlockPassives: ["lifesteal", "critMaster"],
    boss: {
      id: "kael", name: "骸骨将军", title: "Kael", kind: "boss",
      maxHp: 600, width: 70, height: 110, damage: 22, speed: 150,
      phases: 2, themeColor: "#3ddc84",
    },
  },
  {
    id: 2,
    name: "腐沼深渊",
    subtitle: "第二章 · 毒雾弥漫",
    theme: "swamp",
    waves: [
      { count: 4, interval: 1.0, label: "沼泽爬行者" },
      { count: 5, interval: 0.9, label: "腐毒侵袭" },
    ],
    enemyTypes: ["slime", "fly"],
    unlockPassives: ["swift", "ironWill"],
    boss: {
      id: "bilefang", name: "沼泽巨魔", title: "Bilefang", kind: "boss",
      maxHp: 850, width: 110, height: 150, damage: 28, speed: 95,
      phases: 2, themeColor: "#7bc043",
    },
  },
  {
    id: 3,
    name: "寒霜要塞",
    subtitle: "第三章 · 永冻冰原",
    theme: "frost",
    waves: [
      { count: 4, interval: 1.0, label: "冰霜哨卫" },
      { count: 5, interval: 0.9, label: "凛冬之怒" },
    ],
    enemyTypes: ["frostWraith", "iceElemental"],
    unlockPassives: ["comboFrenzy", "lightBlessing"],
    boss: {
      id: "veyra", name: "霜誓骑士", title: "Veyra", kind: "boss",
      maxHp: 1100, width: 60, height: 100, damage: 30, speed: 230,
      phases: 2, themeColor: "#5fd0ff",
    },
  },
  {
    id: 4,
    name: "永夜王座",
    subtitle: "第四章 · 黎明终焉",
    theme: "throne",
    waves: [
      { count: 5, interval: 0.9, label: "暗影禁卫" },
      { count: 6, interval: 0.8, label: "死灵围攻" },
    ],
    enemyTypes: ["shadowKnight", "wraith"],
    unlockPassives: [],
    boss: {
      id: "morgrim", name: "永夜之主", title: "Morgrim", kind: "boss",
      maxHp: 1800, width: 90, height: 140, damage: 35, speed: 180,
      phases: 2, themeColor: "#7b5ea7",
    },
  },
];

export const TOTAL_CHAPTERS = CHAPTERS.length;
