import type { GameState, Mecha, MechaId, KeyState } from './types';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  GRAVITY,
  FRICTION,
  MOVE_SPEED,
  JUMP_FORCE,
  MAX_SPEED,
  KEY_MAP,
  SKILL_CONFIG,
  MAX_COMBO_WINDOW,
} from './constants';
import { performAttack, spawnHitParticles, spawnFloatingText, getMechaColor } from './skills';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function updateMechaPhysics(mecha: Mecha): void {
  mecha.vy += GRAVITY;
  mecha.vx *= FRICTION;

  mecha.x += mecha.vx;
  mecha.y += mecha.vy;

  mecha.x = clamp(mecha.x, 0, CANVAS_WIDTH - MECHA_WIDTH);

  if (mecha.y + MECHA_HEIGHT >= GROUND_Y) {
    mecha.y = GROUND_Y - MECHA_HEIGHT;
    mecha.vy = 0;
  }
}

function canAct(mecha: Mecha): boolean {
  return mecha.state !== 'hurt' && mecha.state !== 'ko' && mecha.hitStun <= 0;
}

function startAction(
  mecha: Mecha,
  skillId: keyof typeof SKILL_CONFIG,
): void {
  mecha.state = skillId === 'attack' ? 'attack' : 'skill';
  mecha.animTimer = SKILL_CONFIG[skillId].duration;
  mecha.cooldowns[skillId] = SKILL_CONFIG[skillId].cooldown;
  mecha.skillId = skillId;
}

function handleInputs(
  state: GameState,
  keys: KeyState,
  id: MechaId,
  opponentId: MechaId,
): void {
  const mecha = state[id];
  const opponent = state[opponentId];
  const map = KEY_MAP[id];
  const pressed = keys[id];

  if (!canAct(mecha)) return;

  const onGround = mecha.y + MECHA_HEIGHT >= GROUND_Y - 1;

  if (mecha.state === 'attack' || mecha.state === 'skill') {
    if (mecha.animTimer > 0) {
      mecha.animTimer--;
      if (mecha.animTimer === Math.floor((mecha.skillId ? SKILL_CONFIG[mecha.skillId].duration : 12) / 2)) {
        tryHit(state, mecha, opponent);
      }
      if (mecha.animTimer <= 0) {
        mecha.state = onGround ? 'idle' : 'jump';
        mecha.skillId = null;
      }
    }
    return;
  }

  if (pressed[map.defend] && onGround) {
    mecha.state = 'defend';
    mecha.vx = 0;
    return;
  }

  let moving = false;
  if (pressed[map.left]) {
    mecha.vx -= MOVE_SPEED;
    mecha.facing = -1;
    moving = true;
  }
  if (pressed[map.right]) {
    mecha.vx += MOVE_SPEED;
    mecha.facing = 1;
    moving = true;
  }

  mecha.vx = clamp(mecha.vx, -MAX_SPEED, MAX_SPEED);

  if (pressed[map.jump] && onGround) {
    mecha.vy = JUMP_FORCE;
    mecha.state = 'jump';
  }

  if (onGround) {
    mecha.state = moving ? 'run' : 'idle';
  } else {
    mecha.state = 'jump';
  }

  if (pressed[map.attack] && mecha.cooldowns.attack <= 0) {
    startAction(mecha, 'attack');
    return;
  }
  if (pressed[map.skill1] && mecha.cooldowns.skill1 <= 0) {
    startAction(mecha, 'skill1');
    return;
  }
  if (pressed[map.skill2] && mecha.cooldowns.skill2 <= 0) {
    startAction(mecha, 'skill2');
    return;
  }
  if (pressed[map.ultimate] && mecha.cooldowns.ultimate <= 0) {
    startAction(mecha, 'ultimate');
    return;
  }
}

function tryHit(
  state: GameState,
  attacker: Mecha,
  target: Mecha,
): void {
  if (!attacker.skillId) return;
  const result = performAttack(attacker, target, attacker.skillId);
  if (!result.hit) return;

  target.hp = Math.max(0, target.hp - result.damage);
  target.vx += result.knockbackX;
  target.vy += result.knockbackY;

  if (target.state !== 'defend') {
    target.state = 'hurt';
    target.hitStun = attacker.skillId === 'ultimate' ? 25 : 12;
    target.combo = 0;

    attacker.combo++;
    attacker.comboTimer = MAX_COMBO_WINDOW;

    const comboText = attacker.combo > 1 ? `${attacker.combo} HIT!` : '';
    if (comboText) {
      state.texts.push(
        spawnFloatingText(
          attacker.x + MECHA_WIDTH / 2,
          attacker.y - 20,
          comboText,
          '#FFD700',
        ),
      );
    }
  } else {
    target.defendFlash = 8;
  }

  state.shake = attacker.skillId === 'ultimate' ? 12 : 6;

  state.particles.push(
    ...spawnHitParticles(
      target.x + MECHA_WIDTH / 2,
      target.y + MECHA_HEIGHT / 2,
      target.state === 'defend' ? '#FFFFFF' : getMechaColor(target.id),
      attacker.skillId === 'ultimate' ? 24 : 10,
    ),
  );

  state.texts.push(
    spawnFloatingText(
      target.x + MECHA_WIDTH / 2,
      target.y - 10,
      String(result.damage),
      result.damage >= 20 ? '#FF5555' : '#FFFFFF',
    ),
  );
}

function updateCooldowns(mecha: Mecha): void {
  (Object.keys(mecha.cooldowns) as (keyof typeof mecha.cooldowns)[]).forEach((key) => {
    if (mecha.cooldowns[key] > 0) {
      mecha.cooldowns[key]--;
    }
  });
}

function updateMechaState(state: GameState, mecha: Mecha, opponent: Mecha): void {
  updateMechaPhysics(mecha);
  updateCooldowns(mecha);

  if (mecha.hitStun > 0) {
    mecha.hitStun--;
    if (mecha.hitStun <= 0 && mecha.hp > 0) {
      mecha.state = mecha.y + MECHA_HEIGHT >= GROUND_Y - 1 ? 'idle' : 'jump';
    }
  }

  if (mecha.comboTimer > 0) {
    mecha.comboTimer--;
    if (mecha.comboTimer <= 0) {
      mecha.combo = 0;
    }
  }

  if (mecha.defendFlash > 0) mecha.defendFlash--;

  if (mecha.x < opponent.x) {
    if (mecha.state !== 'attack' && mecha.state !== 'skill' && mecha.state !== 'hurt') {
      mecha.facing = 1;
    }
  } else {
    if (mecha.state !== 'attack' && mecha.state !== 'skill' && mecha.state !== 'hurt') {
      mecha.facing = -1;
    }
  }
}

function updateParticles(state: GameState): void {
  state.particles = state.particles
    .map((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life--;
      return p;
    })
    .filter((p) => p.life > 0);
}

function updateTexts(state: GameState): void {
  state.texts = state.texts
    .map((t) => {
      t.y += t.vy;
      t.life--;
      return t;
    })
    .filter((t) => t.life > 0);
}

export function tickGame(state: GameState, keys: KeyState): GameState {
  if (state.winner) return state;

  state.frameCount++;
  if (state.shake > 0) state.shake--;

  handleInputs(state, keys, 'red', 'blue');
  handleInputs(state, keys, 'blue', 'red');

  updateMechaState(state, state.red, state.blue);
  updateMechaState(state, state.blue, state.red);

  updateParticles(state);
  updateTexts(state);

  if (state.red.hp <= 0 && !state.winner) {
    state.red.state = 'ko';
    state.winner = 'blue';
    state.shake = 20;
  } else if (state.blue.hp <= 0 && !state.winner) {
    state.blue.state = 'ko';
    state.winner = 'red';
    state.shake = 20;
  }

  return state;
}
