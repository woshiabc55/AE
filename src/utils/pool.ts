import type { Particle, FloatingText, SlashTrail, Projectile } from './types';

class Pool<T> {
  private items: T[] = [];

  constructor(private factory: () => T) {}

  acquire(): T {
    return this.items.pop() ?? this.factory();
  }

  release(item: T): void {
    this.items.push(item);
  }
}

export const particlePool = new Pool<Particle>(() => ({
  id: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
  maxLife: 0,
  color: '',
  size: 0,
}));

export const textPool = new Pool<FloatingText>(() => ({
  id: 0,
  x: 0,
  y: 0,
  text: '',
  color: '',
  life: 0,
  maxLife: 0,
  vy: 0,
  scale: 1,
}));

export const slashPool = new Pool<SlashTrail>(() => ({
  id: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  color: '',
  life: 0,
  maxLife: 0,
  facing: 1,
}));

export const projectilePool = new Pool<Projectile>(() => ({
  id: 0,
  ownerId: 'red',
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 0,
  damage: 0,
  color: '',
  life: 0,
  behavior: 'linear',
}));

let nextId = 1;
export function getNextId(): number {
  return nextId++;
}
