// 游戏核心类型定义

export type Vec2 = { x: number; y: number };

export type Rect = { x: number; y: number; w: number; h: number };

export type Player = {
  pos: Vec2;
  vel: Vec2;
  radius: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  // 玩家可以朝任意方向冲撞敌人
  dashUntilMs: number;
  invulnUntilMs: number;
};

export type EnemyState = 'PATROL' | 'CHASE';

export type Enemy = {
  id: number;
  pos: Vec2;
  vel: Vec2;
  radius: number;
  state: EnemyState;
  hp: number;
  maxHp: number;
  // 用于巡逻的随机目标点
  patrolTarget: Vec2;
  speed: number;
  color: string;
  alive: boolean;
  hitFlashUntilMs: number;
};

export type Wall = Rect;

export type Particle = {
  pos: Vec2;
  vel: Vec2;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'trail' | 'burst' | 'spark';
};

export type Level = {
  id: number;
  name: string;
  walls: Wall[];
  enemies: { pos: Vec2; radius: number; speed: number; color: string; hp: number }[];
  worldW: number;
  worldH: number;
};

export type GameStatus = 'IDLE' | 'PLAYING' | 'WIN' | 'LOSE';

export type RuntimeStats = {
  score: number;
  kills: number;
  elapsedMs: number;
  hp: number;
};
