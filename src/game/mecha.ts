import {
  MechaData,
  MechaState,
  CANVAS_W,
  GROUND_Y,
  MOVE_SPEED,
  MAX_HP,
  MAX_ENERGY,
  ATTACK_ENERGY_COST,
  DEFEND_ENERGY_COST,
  ENERGY_REGEN,
  ATTACK_DURATION,
  ATTACK_HIT_START,
  ATTACK_HIT_END,
  HURT_DURATION,
  MECHA_W,
  MECHA_H,
  PIXEL_SCALE,
} from './types';
import { InputState } from './input';

export function createMecha(id: 1 | 2, startX: number, facing: -1 | 1): MechaData {
  return {
    id,
    x: startX,
    y: GROUND_Y - 16 * PIXEL_SCALE,
    vx: 0,
    vy: 0,
    facing,
    state: 'IDLE',
    stateTimer: 0,
    hp: MAX_HP,
    maxHp: MAX_HP,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    attackHit: false,
    hurtFlash: 0,
    animFrame: 0,
    animTimer: 0,
  };
}

export function updateMecha(mecha: MechaData, input: InputState, otherX: number): MechaData {
  const m = { ...mecha };

  if (m.hurtFlash > 0) m.hurtFlash--;

  if (m.state === 'DEAD') {
    return m;
  }

  if (m.state === 'HURT') {
    m.stateTimer--;
    if (m.stateTimer <= 0) {
      if (m.hp <= 0) {
        m.state = 'DEAD';
        m.stateTimer = 0;
      } else {
        m.state = 'IDLE';
        m.stateTimer = 0;
      }
    }
    return m;
  }

  if (m.state === 'ATTACK') {
    m.stateTimer++;
    m.animTimer++;

    if (m.stateTimer >= ATTACK_DURATION) {
      m.state = 'IDLE';
      m.stateTimer = 0;
      m.attackHit = false;
    }
    return m;
  }

  if (input.defend && m.energy > DEFEND_ENERGY_COST * 10) {
    m.state = 'DEFEND';
    m.energy -= DEFEND_ENERGY_COST;
    if (m.energy < 0) m.energy = 0;
    m.animTimer++;
    return m;
  }

  if (m.state === 'DEFEND' && !input.defend) {
    m.state = 'IDLE';
    m.stateTimer = 0;
  }

  if (input.attackPressed && m.energy >= ATTACK_ENERGY_COST && m.state !== 'DEFEND') {
    m.state = 'ATTACK';
    m.stateTimer = 0;
    m.attackHit = false;
    m.energy -= ATTACK_ENERGY_COST;
    m.animTimer = 0;
    return m;
  }

  let moving = false;
  let dx = 0;
  if (input.left) { dx = -MOVE_SPEED; moving = true; }
  if (input.right) { dx = MOVE_SPEED; moving = true; }

  if (moving) {
    m.state = 'WALK';
    m.x += dx;
    m.animTimer++;

    if (otherX > m.x) {
      m.facing = 1;
    } else if (otherX < m.x) {
      m.facing = -1;
    }
  } else {
    m.state = 'IDLE';
    m.animTimer++;
  }

  const spriteW = 16 * PIXEL_SCALE;
  if (m.x < 10) m.x = 10;
  if (m.x > CANVAS_W - spriteW - 10) m.x = CANVAS_W - spriteW - 10;

  if (m.state as MechaState !== 'DEFEND') {
    m.energy += ENERGY_REGEN;
    if (m.energy > MAX_ENERGY) m.energy = MAX_ENERGY;
  }

  return m;
}

export function getAttackHitbox(mecha: MechaData): { x: number; y: number; w: number; h: number } | null {
  if (mecha.state !== 'ATTACK') return null;
  if (mecha.stateTimer < ATTACK_HIT_START || mecha.stateTimer >= ATTACK_HIT_END) return null;
  if (mecha.attackHit) return null;

  const spriteW = 16 * PIXEL_SCALE;
  const spriteH = 16 * PIXEL_SCALE;
  const hitboxW = 30;
  const hitboxH = spriteH * 0.7;

  return {
    x: mecha.facing === 1 ? mecha.x + spriteW : mecha.x - hitboxW,
    y: mecha.y + spriteH * 0.15,
    w: hitboxW,
    h: hitboxH,
  };
}

export function getMechaBody(mecha: MechaData): { x: number; y: number; w: number; h: number } {
  const spriteW = 16 * PIXEL_SCALE;
  const spriteH = 16 * PIXEL_SCALE;
  return {
    x: mecha.x + 6,
    y: mecha.y + 4,
    w: spriteW - 12,
    h: spriteH - 4,
  };
}

export function applyHit(mecha: MechaData, damage: number): MechaData {
  const m = { ...mecha };
  const actualDamage = m.state === 'DEFEND' ? Math.max(1, Math.floor(damage * 0.3)) : damage;
  m.hp = Math.max(0, m.hp - actualDamage);
  m.hurtFlash = 8;

  if (m.state !== 'DEAD') {
    m.state = 'HURT';
    m.stateTimer = HURT_DURATION;
  }

  return { ...m, _hitDamage: actualDamage } as MechaData & { _hitDamage: number };
}

export function getAnimFrameIndex(mecha: MechaData): number {
  const speed = 8;
  const rawFrame = Math.floor(mecha.animTimer / speed);

  switch (mecha.state) {
    case 'IDLE':
      return rawFrame % 2;
    case 'WALK':
      return rawFrame % 4;
    case 'ATTACK':
      if (mecha.stateTimer < ATTACK_HIT_START) return 0;
      if (mecha.stateTimer < ATTACK_HIT_END) return 1;
      return 2;
    case 'DEFEND':
      return 0;
    case 'HURT':
      return rawFrame % 2;
    case 'DEAD':
      return 0;
    default:
      return 0;
  }
}

export function pushMechaApart(m1: MechaData, m2: MechaData): [MechaData, MechaData] {
  const a = { ...m1 };
  const b = { ...m2 };

  const spriteW = 16 * PIXEL_SCALE;
  const overlap = (a.x + spriteW) - b.x;

  if (a.x < b.x && overlap > 0 && overlap < spriteW) {
    const push = overlap / 2;
    a.x -= push;
    b.x += push;
  } else if (b.x < a.x) {
    const overlap2 = (b.x + spriteW) - a.x;
    if (overlap2 > 0 && overlap2 < spriteW) {
      const push = overlap2 / 2;
      b.x -= push;
      a.x += push;
    }
  }

  if (a.x < 10) a.x = 10;
  if (a.x > CANVAS_W - spriteW - 10) a.x = CANVAS_W - spriteW - 10;
  if (b.x < 10) b.x = 10;
  if (b.x > CANVAS_W - spriteW - 10) b.x = CANVAS_W - spriteW - 10;

  return [a, b];
}
