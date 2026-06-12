import type { Vec2, Wall, Enemy, Player } from './types';

// 圆形与矩形碰撞,返回穿透向量和法线
export function circleVsRect(
  c: Vec2,
  r: number,
  rect: Wall
): { hit: boolean; normal: Vec2; depth: number; contact: Vec2 } {
  const closestX = Math.max(rect.x, Math.min(c.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(c.y, rect.y + rect.h));
  const dx = c.x - closestX;
  const dy = c.y - closestY;
  const distSq = dx * dx + dy * dy;
  if (distSq > r * r) {
    return { hit: false, normal: { x: 0, y: 0 }, depth: 0, contact: { x: 0, y: 0 } };
  }
  const dist = Math.sqrt(distSq) || 0.0001;
  const normal = { x: dx / dist, y: dy / dist };
  const depth = r - dist;
  const contact = { x: closestX, y: closestY };
  return { hit: true, normal, depth, contact };
}

export function circleVsCircle(
  a: Vec2,
  ar: number,
  b: Vec2,
  br: number
): { hit: boolean; normal: Vec2; depth: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = ar + br;
  if (dist >= minDist) return { hit: false, normal: { x: 0, y: 0 }, depth: 0 };
  const n = dist === 0 ? { x: 1, y: 0 } : { x: dx / dist, y: dy / dist };
  return { hit: true, normal: n, depth: minDist - dist };
}

// 玩家与所有墙碰撞,处理反弹与粒子
export function resolvePlayerWalls(
  player: Player,
  walls: Wall[],
  onHit: (contact: Vec2, normal: Vec2) => void
) {
  for (const wall of walls) {
    const res = circleVsRect(player.pos, player.radius, wall);
    if (res.hit) {
      // 推出墙外
      player.pos.x += res.normal.x * res.depth;
      player.pos.y += res.normal.y * res.depth;
      // 反弹速度
      const vDotN = player.vel.x * res.normal.x + player.vel.y * res.normal.y;
      if (vDotN < 0) {
        player.vel.x -= 2 * vDotN * res.normal.x;
        player.vel.y -= 2 * vDotN * res.normal.y;
        // 损耗一些能量
        player.vel.x *= 0.55;
        player.vel.y *= 0.55;
        onHit(res.contact, res.normal);
      }
    }
  }
}

export function resolveEnemyWalls(enemy: Enemy, walls: Wall[]) {
  for (const wall of walls) {
    const res = circleVsRect(enemy.pos, enemy.radius, wall);
    if (res.hit) {
      enemy.pos.x += res.normal.x * res.depth;
      enemy.pos.y += res.normal.y * res.depth;
      const vDotN = enemy.vel.x * res.normal.x + enemy.vel.y * res.normal.y;
      if (vDotN < 0) {
        enemy.vel.x -= 2 * vDotN * res.normal.x;
        enemy.vel.y -= 2 * vDotN * res.normal.y;
        enemy.vel.x *= 0.5;
        enemy.vel.y *= 0.5;
      }
    }
  }
}
