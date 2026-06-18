export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;
export const GROUND_Y = 460;

export const GRAVITY = 0.8;
export const FRICTION = 0.85;
export const MOVE_SPEED = 1.2;
export const JUMP_FORCE = -16;
export const MAX_SPEED = 8;

export const MECHA_WIDTH = 48;
export const MECHA_HEIGHT = 64;

export const COLORS = {
  bg: '#0B0C15',
  red: '#FF2A6D',
  redDark: '#8A1C3D',
  blue: '#05D9E8',
  blueDark: '#046E78',
  ground: '#1A1C29',
  groundLine: '#2E3147',
  white: '#F0F0F0',
  black: '#050505',
  hudBg: 'rgba(11, 12, 21, 0.85)',
};

export const KEY_MAP = {
  red: {
    left: 'KeyA',
    right: 'KeyD',
    jump: 'KeyW',
    defend: 'KeyS',
    attack: 'KeyF',
    skill1: 'KeyG',
    skill2: 'KeyH',
    ultimate: 'Space',
  },
  blue: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    defend: 'ArrowDown',
    attack: 'KeyL',
    skill1: 'Semicolon',
    skill2: 'Quote',
    ultimate: 'Enter',
  },
};

export const SKILL_CONFIG = {
  attack: { name: '普攻', damage: 8, cooldown: 18, duration: 12, range: 72 },
  skill1: { name: '突刺', damage: 14, cooldown: 90, duration: 20, range: 96 },
  skill2: { name: '重斩', damage: 22, cooldown: 150, duration: 28, range: 80 },
  ultimate: { name: '必杀', damage: 45, cooldown: 360, duration: 45, range: 120 },
};

export const MAX_COMBO_WINDOW = 60;
