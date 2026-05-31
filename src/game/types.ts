export type MechaState = 'IDLE' | 'WALK' | 'ATTACK' | 'DEFEND' | 'HURT' | 'DEAD';

export type PlayerId = 1 | 2;

export interface Vec2 {
  x: number;
  y: number;
}

export interface MechaConfig {
  id: PlayerId;
  color: string;
  accentColor: string;
  startX: number;
  facing: -1 | 1;
}

export interface MechaData {
  id: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: -1 | 1;
  state: MechaState;
  stateTimer: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  attackHit: boolean;
  hurtFlash: number;
  animFrame: number;
  animTimer: number;
}

export interface HitBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  timer: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface ShieldEffect {
  x: number;
  y: number;
  timer: number;
  facing: -1 | 1;
}

export type GamePhase = 'title' | 'battle' | 'result';

export interface GameResult {
  winner: PlayerId | 'draw';
  p1Hp: number;
  p2Hp: number;
}

export const CANVAS_W = 960;
export const CANVAS_H = 540;
export const GROUND_Y = 420;
export const GRAVITY = 0;
export const MOVE_SPEED = 3;
export const MAX_HP = 100;
export const MAX_ENERGY = 100;
export const ATTACK_DAMAGE = 10;
export const DEFEND_DAMAGE = 3;
export const ATTACK_ENERGY_COST = 15;
export const DEFEND_ENERGY_COST = 0.3;
export const ENERGY_REGEN = 0.15;
export const ATTACK_DURATION = 20;
export const ATTACK_HIT_START = 5;
export const ATTACK_HIT_END = 10;
export const HURT_DURATION = 15;
export const BATTLE_TIME = 99;
export const MECHA_W = 32;
export const MECHA_H = 48;
export const PIXEL_SCALE = 3;

export const P1_KEYS = {
  left: 'KeyA',
  right: 'KeyD',
  up: 'KeyW',
  down: 'KeyS',
  attack: 'KeyF',
  defend: 'KeyG',
};

export const P2_KEYS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
  down: 'ArrowDown',
  attack: 'KeyJ',
  defend: 'KeyK',
};
