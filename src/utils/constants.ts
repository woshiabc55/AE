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

export const ROUND_TIME = 60;
export const ROUNDS_TO_WIN = 2;
export const ROUND_END_DELAY = 120;

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
  gold: '#FFD700',
  green: '#39FF14',
  purple: '#B829DD',
  orange: '#FF8C00',
};

export const MECHA_TYPES = {
  striker: {
    type: 'striker',
    name: '突击型',
    maxHp: 100,
    moveSpeed: 1.2,
    jumpForce: -16,
    damageMod: 1,
    defenseMod: 1,
    color: '#FF2A6D',
    darkColor: '#8A1C3D',
    accentColor: '#FFD700',
  },
  tank: {
    type: 'tank',
    name: '重装型',
    maxHp: 130,
    moveSpeed: 0.9,
    jumpForce: -14,
    damageMod: 0.85,
    defenseMod: 1.3,
    color: '#39FF14',
    darkColor: '#1A7A0A',
    accentColor: '#FFFFFF',
  },
  speed: {
    type: 'speed',
    name: '迅捷型',
    maxHp: 80,
    moveSpeed: 1.5,
    jumpForce: -18,
    damageMod: 1.15,
    defenseMod: 0.85,
    color: '#B829DD',
    darkColor: '#5E146E',
    accentColor: '#05D9E8',
  },
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
    throw: 'KeyT',
    ultimate: 'Space',
    dash: 'KeyQ',
    projectile: 'KeyE',
    counter: 'KeyR',
  },
  blue: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    defend: 'ArrowDown',
    attack: 'KeyL',
    skill1: 'Semicolon',
    skill2: 'Quote',
    throw: 'KeyK',
    ultimate: 'Enter',
    dash: 'KeyO',
    projectile: 'KeyP',
    counter: 'BracketRight',
  },
};

export const ELEMENT_CONFIG = {
  fire: {
    name: '赤焰',
    primary: '#FF2A6D',
    secondary: '#FF8C00',
    bright: '#FFD700',
    particle: '#FF4500',
    auraColor: 'rgba(255, 69, 0, 0.25)',
  },
  electric: {
    name: '雷霆',
    primary: '#05D9E8',
    secondary: '#B829DD',
    bright: '#FFFFFF',
    particle: '#00FFFF',
    auraColor: 'rgba(5, 217, 232, 0.25)',
  },
};

export const SKILL_CONFIG = {
  attack: { name: '普攻', damage: 8, cooldown: 18, duration: 12, range: 72 },
  skill1: { name: '突刺', damage: 14, cooldown: 90, duration: 20, range: 96 },
  skill2: { name: '重斩', damage: 22, cooldown: 150, duration: 28, range: 80 },
  ultimate: { name: '必杀', damage: 45, cooldown: 360, duration: 45, range: 120 },
  dash: { name: '冲刺', damage: 0, cooldown: 80, duration: 18, range: 0 },
  throw: { name: '投技', damage: 18, cooldown: 120, duration: 22, range: 56 },
  projectile: { name: '射击', damage: 10, cooldown: 70, duration: 15, range: 0 },
  counter: { name: '反击', damage: 15, cooldown: 140, duration: 20, range: 64 },
};

export const MAX_COMBO_WINDOW = 80;
