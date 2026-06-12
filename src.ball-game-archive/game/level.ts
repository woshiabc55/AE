import type { Level, Wall, Vec2 } from './types';
import { getTheme } from './theme';

// 基于关卡 id 的确定性 PRNG
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const WORLD_W = 1200;
export const WORLD_H = 800;
export const WALL_THICKNESS = 16;

export function buildLevel(id: number): Level {
  const theme = getTheme(id);
  const rand = mulberry32(0xC0FFEE + id * 131);
  const walls: Wall[] = [];

  // 外圈围墙
  walls.push({ x: 0, y: 0, w: WORLD_W, h: WALL_THICKNESS });
  walls.push({ x: 0, y: WORLD_H - WALL_THICKNESS, w: WORLD_W, h: WALL_THICKNESS });
  walls.push({ x: 0, y: 0, w: WALL_THICKNESS, h: WORLD_H });
  walls.push({ x: WORLD_W - WALL_THICKNESS, y: 0, w: WALL_THICKNESS, h: WORLD_H });

  // 内部障碍 (随关卡增加)
  const obstacleCount = 4 + id;
  for (let i = 0; i < obstacleCount; i++) {
    const w = 80 + Math.floor(rand() * 120);
    const h = 20 + Math.floor(rand() * 80);
    const x = WALL_THICKNESS + 60 + Math.floor(rand() * (WORLD_W - WALL_THICKNESS * 2 - w - 120));
    const y = WALL_THICKNESS + 60 + Math.floor(rand() * (WORLD_H - WALL_THICKNESS * 2 - h - 120));

    // 距离玩家出生点 (中心) 太近则跳过
    const cx = x + w / 2;
    const cy = y + h / 2;
    const distToCenter = Math.hypot(cx - WORLD_W / 2, cy - WORLD_H / 2);
    if (distToCenter < 180) continue;

    // 与其他墙不相交
    const overlap = walls.some((wall) =>
      x < wall.x + wall.w &&
      x + w > wall.x &&
      y < wall.y + wall.h &&
      y + h > wall.y
    );
    if (overlap) continue;

    walls.push({ x, y, w, h });
  }

  // 敌人数量
  const enemyCount = Math.min(3 + id, 10);
  const enemies: Level['enemies'] = [];
  let safety = 0;
  while (enemies.length < enemyCount && safety < 200) {
    safety++;
    const r = 14 + Math.floor(rand() * 6);
    const pos: Vec2 = {
      x: WALL_THICKNESS + 60 + Math.floor(rand() * (WORLD_W - WALL_THICKNESS * 2 - r * 2 - 120)),
      y: WALL_THICKNESS + 60 + Math.floor(rand() * (WORLD_H - WALL_THICKNESS * 2 - r * 2 - 120)),
    };

    // 距离玩家出生点不要太近
    if (Math.hypot(pos.x - WORLD_W / 2, pos.y - WORLD_H / 2) < 220) continue;

    // 不和墙重叠
    const collidesWall = walls.some((wall) =>
      pos.x - r > wall.x &&
      pos.x + r < wall.x + wall.w &&
      pos.y - r > wall.y &&
      pos.y + r < wall.y + wall.h
    );
    if (collidesWall) continue;

    enemies.push({
      pos,
      radius: r,
      speed: 60 + id * 8 + Math.floor(rand() * 30),
      color: theme.accent,
      hp: 1 + Math.floor(id / 3),
    });
  }

  return {
    id,
    name: theme.name,
    walls,
    enemies,
    worldW: WORLD_W,
    worldH: WORLD_H,
  };
}

export const PLAYER_SPAWN: Vec2 = { x: WORLD_W / 2, y: WORLD_H / 2 };
