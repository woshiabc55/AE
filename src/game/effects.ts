import { Particle, DamageNumber, ShieldEffect, CANVAS_W, GROUND_Y } from './types';

export function createHitParticles(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 15 + Math.random() * 10,
      maxLife: 25,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

export function createDefendParticles(x: number, y: number, facing: -1 | 1): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = facing === 1 ? (-Math.PI / 3 + Math.random() * Math.PI * 2 / 3) : (Math.PI * 2 / 3 + Math.random() * Math.PI * 2 / 3);
    particles.push({
      x: x + (facing === 1 ? 40 : -10),
      y: y + Math.random() * 40,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2 - 1,
      life: 10 + Math.random() * 8,
      maxLife: 18,
      color: '#44ff44',
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

export function createDamageNumber(x: number, y: number, value: number): DamageNumber {
  return {
    x,
    y,
    value,
    timer: 40,
    vy: -2,
  };
}

export function createShieldEffect(x: number, y: number, facing: -1 | 1): ShieldEffect {
  return {
    x,
    y,
    timer: 8,
    facing,
  };
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.15,
      life: p.life - 1,
    }))
    .filter(p => p.life > 0);
}

export function updateDamageNumbers(numbers: DamageNumber[]): DamageNumber[] {
  return numbers
    .map(n => ({
      ...n,
      y: n.y + n.vy,
      vy: n.vy * 0.95,
      timer: n.timer - 1,
    }))
    .filter(n => n.timer > 0);
}

export function updateShieldEffects(effects: ShieldEffect[]): ShieldEffect[] {
  return effects
    .map(e => ({ ...e, timer: e.timer - 1 }))
    .filter(e => e.timer > 0);
}
