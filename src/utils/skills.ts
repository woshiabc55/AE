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

  // 反击判定：目标处于 counter 窗口内
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
  return {
    id: Math.random(),
    ownerId: owner.id,
    x: owner.x + (owner.facing === 1 ? MECHA_WIDTH : 0),
    y: owner.y + MECHA_HEIGHT * 0.45,
    vx: owner.facing * 11,
    radius: 7,
    damage: Math.floor(10 * MECHA_TYPES[owner.type].damageMod),
    color: getElementColor(owner.element),
    life: 90,
  };
}

export function spawnSlashTrail(
  mecha: Mecha,
  width: number,
): SlashTrail {
  return {
    id: Math.random(),
    x: mecha.x + (mecha.facing === 1 ? MECHA_WIDTH : -width),
    y: mecha.y + MECHA_HEIGHT * 0.25,
    width,
    height: MECHA_HEIGHT * 0.55,
    color: getElementColor(mecha.element),
    life: 10,
    maxLife: 10,
    facing: mecha.facing,
  };
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
    particles.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (element === 'fire' ? 1.5 : 0),
      life: 15 + Math.random() * 20,
      maxLife: 35,
      color: i % 2 === 0 ? cfg.primary : cfg.secondary,
      size: 2 + Math.random() * 3,
    });
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
    particles.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 20 + Math.random() * 15,
      maxLife: 35,
      color,
      size: 2 + Math.random() * 3,
    });
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
    particles.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      life: 30 + Math.random() * 25,
      maxLife: 55,
      color: i % 3 === 0 ? cfg.bright : i % 3 === 1 ? cfg.primary : cfg.secondary,
      size: 3 + Math.random() * 5,
    });
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
  return {
    id: Math.random(),
    x,
    y,
    text,
    color,
    life: 45,
    maxLife: 45,
    vy: -2.2,
    scale,
  };
}
