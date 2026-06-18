export type MechaId = 'red' | 'blue';

export type MechaType = 'striker' | 'tank' | 'speed' | 'mage';

export type ElementType = 'fire' | 'electric' | 'ice';

export type MechaState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'attack'
  | 'defend'
  | 'skill'
  | 'hurt'
  | 'ko'
  | 'dash'
  | 'counter'
  | 'throw';

export type GameScreen =
  | 'menu'
  | 'modeSelect'
  | 'difficultySelect'
  | 'characterSelect'
  | 'fighting'
  | 'roundEnd'
  | 'matchEnd';

export type GameMode = 'pvp' | 'pvc';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface MechaStats {
  type: MechaType;
  name: string;
  maxHp: number;
  moveSpeed: number;
  jumpForce: number;
  damageMod: number;
  defenseMod: number;
  color: string;
  darkColor: string;
  accentColor: string;
}

export interface Cooldowns {
  attack: number;
  skill1: number;
  skill2: number;
  skill3: number;
  throw: number;
  ultimate: number;
  dash: number;
  projectile: number;
  counter: number;
}

export interface Mecha {
  id: MechaId;
  type: MechaType;
  element: ElementType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  state: MechaState;
  animTimer: number;
  cooldowns: Cooldowns;
  combo: number;
  comboTimer: number;
  hitStun: number;
  skillId: keyof typeof import('./constants').SKILL_CONFIG | null;
  defendFlash: number;
  dashTimer: number;
  counterWindow: number;
  invincible: number;
  coyoteTime: number;
  inputBuffer: Partial<Record<keyof typeof import('./constants').SKILL_CONFIG | 'jump', number>>;
}

export interface Projectile {
  id: number;
  ownerId: MechaId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  life: number;
  behavior: 'linear' | 'orbit' | 'wave';
  // 轨道参数
  orbitCenterX?: number;
  orbitCenterY?: number;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  orbitCenterVX?: number;
  orbitCenterVY?: number;
  // 波动参数
  waveBaseY?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  wavePhase?: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface SlashTrail {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  life: number;
  maxLife: number;
  facing: 1 | -1;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
  scale: number;
}

export interface RoundResult {
  redWins: number;
  blueWins: number;
  round: number;
  timer: number;
  roundTimerActive: boolean;
}

export interface GameState {
  screen: GameScreen;
  mode: GameMode;
  difficulty: Difficulty;
  redType: MechaType;
  blueType: MechaType;
  red: Mecha;
  blue: Mecha;
  projectiles: Projectile[];
  particles: Particle[];
  slashes: SlashTrail[];
  texts: FloatingText[];
  roundResult: RoundResult;
  roundWinner: MechaId | 'draw' | null;
  matchWinner: MechaId | null;
  shake: number;
  flash: number;
  hitStop: number;
  frameCount: number;
  ultimateCinematic: number;
}

export interface KeyState {
  red: Record<string, boolean>;
  blue: Record<string, boolean>;
}

export interface AIState {
  actionTimer: number;
  targetDistance: number;
  aggression: number;
  reactionDelay: number;
}
