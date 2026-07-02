// 像素骑士：暗影征伐 - 类型定义

export type GamePhase = "title" | "playing" | "paused" | "victory" | "defeat";

export type PlayerStateName =
  | "idle"
  | "run"
  | "jump"
  | "fall"
  | "attack1"
  | "attack2"
  | "attack3"
  | "dash"
  | "hurt"
  | "dead";

export type EnemyStateName =
  | "idle"
  | "patrol"
  | "chase"
  | "attack"
  | "hurt"
  | "dead";

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
  // 边沿触发（本帧刚按下）
  jumpPressed: boolean;
  attackPressed: boolean;
  dashPressed: boolean;
  blockPressed: boolean;
}

/** 引擎每帧推入 Zustand 的快照 */
export interface EngineSnapshot {
  phase: GamePhase;
  hp: number;
  maxHp: number;
  combo: number;
  maxCombo: number;
  score: number;
  wave: number;
  totalWaves: number;
  enemiesLeft: number;
  waveLabel: string;
  flashRed: number; // 受击红屏 0..1
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
  kind: "blood" | "spark" | "dust" | "ember";
}
