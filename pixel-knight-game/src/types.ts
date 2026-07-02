// 像素骑士：暗影征伐 - 类型定义

export type GamePhase =
  | "title"
  | "playing"
  | "paused"
  | "victory"
  | "defeat"
  | "levelTransition"
  | "bossIntro"
  | "bossDefeated";

/** 关卡推进阶段 */
export type ChapterStage = "waves" | "bossIntro" | "boss" | "cleared" | "finished";

export type PlayerStateName =
  | "idle"
  | "run"
  | "jump"
  | "fall"
  | "attack1"
  | "attack2"
  | "attack3"
  | "dash"
  | "cast" // 释放技能
  | "hurt"
  | "dead";

export type EnemyStateName =
  | "idle"
  | "patrol"
  | "chase"
  | "attack"
  | "hurt"
  | "dead"
  | "stun"; // 被盾击眩晕

export type EnemyKind =
  | "skeletonScout"
  | "skeletonArcher"
  | "slime"
  | "fly"
  | "frostWraith"
  | "iceElemental"
  | "shadowKnight"
  | "wraith"
  | "boss";

/** 输入状态（持续按下 + 边沿触发） */
export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jumpHeld: boolean;
  attackHeld: boolean;
  dashHeld: boolean;
  blockHeld: boolean;
  // 技能键（边沿触发）
  jumpPressed: boolean;
  attackPressed: boolean;
  dashPressed: boolean;
  blockPressed: boolean;
  skillPressed: Record<SkillId, boolean>;
}

/** 主动技能 ID */
export type SkillId =
  | "whirlwind"
  | "shieldBash"
  | "dashSlash"
  | "holyBolt"
  | "meteor"
  | "bloodlust"
  | "thunder"
  | "dawn";

/** 被动技能 ID */
export type PassiveId =
  | "lifesteal"
  | "critMaster"
  | "swift"
  | "ironWill"
  | "comboFrenzy"
  | "lightBlessing";

/** 引擎每帧推入 Zustand 的快照 */
export interface EngineSnapshot {
  phase: GamePhase;
  hp: number;
  maxHp: number;
  focus: number;
  maxFocus: number;
  combo: number;
  maxCombo: number;
  score: number;
  wave: number;
  totalWaves: number;
  enemiesLeft: number;
  waveLabel: string;
  flashRed: number;
  // 技能冷却（剩余秒数，0 表示就绪）
  cooldowns: Record<SkillId, number>;
  // 解锁的被动
  passives: PassiveId[];
  // 关卡
  chapter: number;
  totalChapters: number;
  chapterName: string;
  stage: ChapterStage;
  // Boss
  bossActive: boolean;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  bossPhase: number;
  // 过渡文案
  transitionText: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  kind: "blood" | "spark" | "dust" | "ember" | "holy" | "shadow" | "ice";
}

