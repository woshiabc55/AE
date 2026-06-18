import type { Mecha, MechaId, FloatingText, Particle } from './types';
import { SKILL_CONFIG, MECHA_WIDTH, MECHA_HEIGHT, COLORS } from './constants';

export interface HitResult {
  damage: number;
  knockbackX: number;
  knockbackY: number;
  hit: boolean;
  combo: boolean;
}

export function getSkillRange(skillId: keyof typeof SKILL_CONFIG): number {
  return SKILL_CONFIG[skillId].range;
}

export function getSkillDamage(skillId: keyof typeof SKILL_CONFIG): number {
  return SKILL_CONFIG[skillId].damage;
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

  const hit =
    hitBoxX < targetRight &&
    hitBoxX + hitBoxW > targetLeft &&
    hitBoxY < targetBottom &&
    hitBoxY + hitBoxH > targetTop;

  if (!hit) {
    return { damage: 0, knockbackX: 0, knockbackY: 0, hit: false, combo: false };
  }

  let damage = cfg.damage;
  let knockbackX = facing * (skillId === 'ultimate' ? 14 : skillId === 'skill2' ? 9 : 5);
  let knockbackY = skillId === 'skill2' ? -5 : skillId === 'ultimate' ? -8 : -2;

  if (target.state === 'defend') {
    damage = Math.floor(damage * 0.3);
    knockbackX = 0;
    knockbackY = 0;
  }

  return {
    damage,
    knockbackX,
    knockbackY,
    hit: true,
    combo: target.state !== 'defend',
  };
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

export function spawnFloatingText(
  x: number,
  y: number,
  text: string,
  color: string,
): FloatingText {
  return {
    id: Math.random(),
    x,
    y,
    text,
    color,
    life: 40,
    maxLife: 40,
    vy: -2,
  };
}

export function getMechaColor(id: MechaId): string {
  return id === 'red' ? COLORS.red : COLORS.blue;
}

export function getMechaDarkColor(id: MechaId): string {
  return id === 'red' ? COLORS.redDark : COLORS.blueDark;
}
