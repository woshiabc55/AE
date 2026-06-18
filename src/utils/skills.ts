import type {
  Mecha,
  FloatingText,
  Particle,
  Projectile,
  SlashTrail,
  MechaType,
  ElementType,
} from './types';
import {
  SKILL_CONFIG,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  MECHA_TYPES,
  ELEMENT_CONFIG,
} from './constants';
import {
  particlePool,
  textPool,
  slashPool,
  projectilePool,
  getNextId,
} from './pool';

export interface HitResult {
  damage: number;
  knockbackX: number;
  knockbackY: number;
  hit: boolean;
  combo: boolean;
  countered: boolean;
}

export function getSkillRange(skillId: keyof typeof SKILL_CONFIG): number {
  return SKILL_CONFIG[skillId].range;
}

export function getSkillDamage(skillId: keyof typeof SKILL_CONFIG): number {
  return SKILL_CONFIG[skillId].damage;
}

export function getMechaTypeColor(type: MechaType): string {
  return MECHA_TYPES[type].color;
}

export function getMechaTypeDarkColor(type: MechaType): string {
  return MECHA_TYPES[type].darkColor;
}

export function getMechaTypeAccentColor(type: MechaType): string {
  return MECHA_TYPES[type].accentColor;
}

export function getElementColor(element: ElementType): string {
  return ELEMENT_CONFIG[element].primary;
}

export function getElementSecondaryColor(element: ElementType): string {
  return ELEMENT_CONFIG[element].secondary;
}

export function getElementBrightColor(element: ElementType): string {
  return ELEMENT_CONFIG[element].bright;
}

export function getElementParticleColor(element: ElementType): string {
  return ELEMENT_CONFIG[element].particle;
}

export function performAttack(
  attacker: Mecha,
  target: Mecha,
  skillId: keyof typeof SKILL_CONFIG,
): HitResult {
  const cfg = SKILL_CONFIG[skillId];
  const reach = cfg.range;
  const facing = attacker.facing;

  const hitBoxX = attacker.x + (facing === 1 ? MECHA_WIDTH : -reach);
  const hitBoxY = attacker.y + MECHA_HEIGHT * 0.25;
  const hitBoxW = reach;
  const hitBoxH = MECHA_HEIGHT * 0.5;

  const targetLeft = target.x;
  const targetRight = target.x + MECHA_WIDTH;
  const targetTop = target.y;
  const targetBottom = target.y + MECHA_HEIGHT;

  const overlap =
    hitBoxX < targetRight &&
    hitBoxX + hitBoxW > targetLeft &&
    hitBoxY < targetBottom &&
    hitBoxY + hitBoxH > targetTop;

  if (!overlap) {
    return {
      damage: 0,
      knockbackX: 0,
      knockbackY: 0,
      hit: false,
      combo: false,
      countered: false,
    };
  }

  if (target.counterWindow > 0 && skillId !== 'throw') {
    return {
      damage: 0,
      knockbackX: -facing * 10,
      knockbackY: -4,
      hit: true,
      combo: false,
      countered: true,
    };
  }

  let damage = Math.floor(cfg.damage * MECHA_TYPES[attacker.type].damageMod);
  let knockbackX = facing * (skillId === 'ultimate' ? 16 : skillId === 'skill2' ? 11 : skillId === 'throw' ? 12 : 6);
  let knockbackY = skillId === 'skill2' ? -6 : skillId === 'ultimate' ? -9 : skillId === 'throw' ? -7 : -3;

  if (target.state === 'defend') {
    damage = Math.floor(damage * 0.3 * (1 / MECHA_TYPES[target.type].defenseMod));
    knockbackX = 0;
    knockbackY = 0;
  }

  return {
    damage,
    knockbackX,
    knockbackY,
    hit: true,
    combo: target.state !== 'defend',
    countered: false,
  };
}

export function spawnProjectile(owner: Mecha): Projectile {
  const p = projectilePool.acquire();
  p.id = getNextId();
  p.ownerId = owner.id;
  p.x = owner.x + (owner.facing === 1 ? MECHA_WIDTH : 0);
  p.y = owner.y + MECHA_HEIGHT * 0.45;
  p.vx = owner.facing * 11;
  p.vy = 0;
  p.radius = 7;
  p.damage = Math.floor(10 * MECHA_TYPES[owner.type].damageMod);
  p.color = getElementColor(owner.element);
  p.life = 90;
  p.behavior = 'linear';
  return p;
}

export function spawnOrbitProjectiles(owner: Mecha, count = 3): Projectile[] {
  const projectiles: Projectile[] = [];
  const centerX = owner.x + MECHA_WIDTH / 2 + owner.facing * 50;
  const centerY = owner.y + MECHA_HEIGHT * 0.45;
  const baseColor = getElementColor(owner.element);

  for (let i = 0; i < count; i++) {
    const p = projectilePool.acquire();
    p.id = getNextId();
    p.ownerId = owner.id;
    p.radius = 6;
    p.damage = Math.floor(6 * MECHA_TYPES[owner.type].damageMod);
    p.color = baseColor;
    p.life = 110;
    p.behavior = 'orbit';
    p.orbitCenterX = centerX;
    p.orbitCenterY = centerY;
    p.orbitRadius = 28 + i * 18;
    p.orbitAngle = (i * Math.PI * 2) / count;
    p.orbitSpeed = 0.12 * (i % 2 === 0 ? 1 : -1);
    p.orbitCenterVX = owner.facing * 1.8;
    p.orbitCenterVY = (Math.random() - 0.5) * 1.2;

    // 初始位置
    p.x = p.orbitCenterX + Math.cos(p.orbitAngle) * p.orbitRadius;
    p.y = p.orbitCenterY + Math.sin(p.orbitAngle) * p.orbitRadius;
    p.vx = 0;
    p.vy = 0;
    projectiles.push(p);
  }
  return projectiles;
}

export function spawnWaveProjectile(owner: Mecha): Projectile {
  const p = projectilePool.acquire();
  p.id = getNextId();
  p.ownerId = owner.id;
  p.x = owner.x + (owner.facing === 1 ? MECHA_WIDTH : 0);
  p.y = owner.y + MECHA_HEIGHT * 0.45;
  p.vx = owner.facing * 8;
  p.vy = 0;
  p.radius = 7;
  p.damage = Math.floor(8 * MECHA_TYPES[owner.type].damageMod);
  p.color = getElementColor(owner.element);
  p.life = 80;
  p.behavior = 'wave';
  p.waveBaseY = p.y;
  p.waveAmplitude = 22 + Math.random() * 12;
  p.waveFrequency = 0.18 + Math.random() * 0.08;
  p.wavePhase = 0;
  return p;
}

export function spawnSlashTrail(
  mecha: Mecha,
  width: number,
): SlashTrail {
  const s = slashPool.acquire();
  s.id = getNextId();
  s.x = mecha.x + (mecha.facing === 1 ? MECHA_WIDTH : -width);
  s.y = mecha.y + MECHA_HEIGHT * 0.25;
  s.width = width;
  s.height = MECHA_HEIGHT * 0.55;
  s.color = getElementColor(mecha.element);
  s.life = 10;
  s.maxLife = 10;
  s.facing = mecha.facing;
  return s;
}

export function spawnElementalParticles(
  x: number,
  y: number,
  element: ElementType,
  count = 6,
): Particle[] {
  const cfg = ELEMENT_CONFIG[element];
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const p = particlePool.acquire();
    p.id = getNextId();
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - (element === 'fire' ? 1.5 : 0);
    p.life = 15 + Math.random() * 20;
    p.maxLife = 35;
    p.color = i % 2 === 0 ? cfg.primary : cfg.secondary;
    p.size = 2 + Math.random() * 3;
    particles.push(p);
  }
  return particles;
}

export function spawnHitParticles(
  x: number,
  y: number,
  color: string,
  count = 8,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    const p = particlePool.acquire();
    p.id = getNextId();
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 2;
    p.life = 20 + Math.random() * 15;
    p.maxLife = 35;
    p.color = color;
    p.size = 2 + Math.random() * 3;
    particles.push(p);
  }
  return particles;
}

export function spawnExplosionParticles(
  x: number,
  y: number,
  element: ElementType,
  count = 24,
): Particle[] {
  const cfg = ELEMENT_CONFIG[element];
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    const p = particlePool.acquire();
    p.id = getNextId();
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 3;
    p.life = 30 + Math.random() * 25;
    p.maxLife = 55;
    p.color = i % 3 === 0 ? cfg.bright : i % 3 === 1 ? cfg.primary : cfg.secondary;
    p.size = 3 + Math.random() * 5;
    particles.push(p);
  }
  return particles;
}

export function spawnFloatingText(
  x: number,
  y: number,
  text: string,
  color: string,
  scale = 1,
): FloatingText {
  const t = textPool.acquire();
  t.id = getNextId();
  t.x = x;
  t.y = y;
  t.text = text;
  t.color = color;
  t.life = 45;
  t.maxLife = 45;
  t.vy = -2.2;
  t.scale = scale;
  return t;
}
