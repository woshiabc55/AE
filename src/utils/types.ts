export type MechaId = 'red' | 'blue';

export type MechaState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'attack'
  | 'defend'
  | 'skill'
  | 'hurt'
  | 'ko';

export interface Cooldowns {
  attack: number;
  skill1: number;
  skill2: number;
  ultimate: number;
}

export interface Mecha {
  id: MechaId;
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

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
}

export interface GameState {
  red: Mecha;
  blue: Mecha;
  particles: Particle[];
  texts: FloatingText[];
  winner: MechaId | null;
  round: number;
  shake: number;
  frameCount: number;
}

export interface KeyState {
  red: Record<string, boolean>;
  blue: Record<string, boolean>;
}
