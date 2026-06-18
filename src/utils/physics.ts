import type { GameState, Mecha, MechaId, KeyState } from './types';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  GRAVITY,
  FRICTION,
  MAX_SPEED,
  KEY_MAP,
  SKILL_CONFIG,
  MAX_COMBO_WINDOW,
  MECHA_TYPES,
  ROUNDS_TO_WIN,
  COLORS,
} from './constants';
import {
  performAttack,
  spawnProjectile,
  spawnSlashTrail,
  spawnHitParticles,
  spawnExplosionParticles,
  spawnElementalParticles,
  spawnFloatingText,
  getElementBrightColor,
} from './skills';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getStats(mecha: Mecha) {
  return MECHA_TYPES[mecha.type];
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

function isOnGround(mecha: Mecha): boolean {
  return mecha.y + MECHA_HEIGHT >= GROUND_Y - 1;
}

function canAct(mecha: Mecha): boolean {
  return (
    mecha.state !== 'hurt' &&
    mecha.state !== 'ko' &&
    mecha.hitStun <= 0 &&
    mecha.dashTimer <= 0
  );
}

function startAction(
  mecha: Mecha,
  skillId: keyof typeof SKILL_CONFIG,
): void {
  const cfg = SKILL_CONFIG[skillId];
  if (skillId === 'dash') {
    mecha.state = 'dash';
    mecha.dashTimer = cfg.duration;
    mecha.cooldowns.dash = cfg.cooldown;
    mecha.vx = mecha.facing * 14;
    mecha.invincible = cfg.duration;
    return;
  }
  if (skillId === 'throw') {
    mecha.state = 'throw';
    mecha.animTimer = cfg.duration;
    mecha.cooldowns.throw = cfg.cooldown;
    mecha.skillId = skillId;
    return;
  }
  if (skillId === 'counter') {
    mecha.state = 'counter';
    mecha.animTimer = cfg.duration;
    mecha.cooldowns.counter = cfg.cooldown;
    mecha.counterWindow = 12;
    mecha.skillId = skillId;
    return;
  }
  if (skillId === 'projectile') {
    mecha.state = 'skill';
    mecha.animTimer = cfg.duration;
    mecha.cooldowns.projectile = cfg.cooldown;
    mecha.skillId = skillId;
    return;
  }
  mecha.state = skillId === 'attack' ? 'attack' : 'skill';
  mecha.animTimer = cfg.duration;
  mecha.cooldowns[skillId] = cfg.cooldown;
  mecha.skillId = skillId;
}

function handleSpecialInputs(
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

  const onGround = isOnGround(mecha);

  if (mecha.state === 'attack' || mecha.state === 'skill' || mecha.state === 'throw' || mecha.state === 'counter') {
    if (mecha.animTimer > 0) {
      mecha.animTimer--;

      if (mecha.state === 'counter') {
        if (mecha.counterWindow > 0) mecha.counterWindow--;
      }

      if (mecha.skillId === 'projectile' && mecha.animTimer === Math.floor(SKILL_CONFIG.projectile.duration / 2)) {
        state.projectiles.push(spawnProjectile(mecha));
      }

      if (mecha.animTimer === Math.floor((mecha.skillId ? SKILL_CONFIG[mecha.skillId].duration : 12) / 2)) {
        tryHit(state, mecha, opponent);
      }
      if (mecha.animTimer <= 0) {
        mecha.state = onGround ? 'idle' : 'jump';
        mecha.skillId = null;
        mecha.counterWindow = 0;
      }
    }
    return;
  }

  if (mecha.state === 'dash') {
    mecha.dashTimer--;
    if (mecha.dashTimer <= 0) {
      mecha.state = onGround ? 'idle' : 'jump';
      mecha.vx *= 0.5;
    }
    return;
  }

  if (pressed[map.defend] && onGround) {
    mecha.state = 'defend';
    mecha.vx *= 0.8;
    return;
  }

  const stats = getStats(mecha);
  const isMoving = pressed[map.left] || pressed[map.right];
  if (pressed[map.left]) {
    mecha.vx -= stats.moveSpeed;
    mecha.facing = -1;
  }
  if (pressed[map.right]) {
    mecha.vx += stats.moveSpeed;
    mecha.facing = 1;
  }

  mecha.vx = clamp(mecha.vx, -MAX_SPEED, MAX_SPEED);

  if (pressed[map.jump] && onGround) {
    mecha.vy = stats.jumpForce;
    mecha.state = 'jump';
  }

  if (onGround) {
    mecha.state = isMoving ? 'run' : 'idle';
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
  if (pressed[map.throw] && mecha.cooldowns.skill2 <= 0) {
    startAction(mecha, 'throw');
    return;
  }
  if (pressed[map.dash] && mecha.cooldowns.dash <= 0) {
    startAction(mecha, 'dash');
    return;
  }
  if (pressed[map.projectile] && mecha.cooldowns.projectile <= 0) {
    startAction(mecha, 'projectile');
    return;
  }
  if (pressed[map.counter] && mecha.cooldowns.counter <= 0) {
    startAction(mecha, 'counter');
    return;
  }
  if (pressed[map.ultimate] && mecha.cooldowns.ultimate <= 0) {
    startAction(mecha, 'ultimate');
    state.ultimateCinematic = 40;
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

  const skillId = attacker.skillId;
  const isUltimate = skillId === 'ultimate';
  const isThrow = skillId === 'throw';

  // 反击成功
  if (result.countered) {
    target.hp = Math.max(0, target.hp - result.damage);
    target.vx += result.knockbackX;
    target.vy += result.knockbackY;
    target.state = 'hurt';
    target.hitStun = 18;
    target.combo = 0;

    state.texts.push(
      spawnFloatingText(
        target.x + MECHA_WIDTH / 2,
        target.y - 30,
        'COUNTER!',
        COLORS.gold,
        1.4,
      ),
    );
    state.shake = 10;
    state.hitStop = 10;
    state.flash = 6;
    state.particles.push(
      ...spawnHitParticles(
        target.x + MECHA_WIDTH / 2,
        target.y + MECHA_HEIGHT / 2,
        COLORS.gold,
        18,
      ),
    );
    return;
  }

  target.hp = Math.max(0, target.hp - result.damage);
  target.vx += result.knockbackX;
  target.vy += result.knockbackY;

  const isDefended = target.state === 'defend';

  if (!isDefended) {
    target.state = 'hurt';
    target.hitStun = isUltimate ? 28 : isThrow ? 18 : 14;
    target.combo = 0;

    attacker.combo++;
    attacker.comboTimer = MAX_COMBO_WINDOW;

    if (attacker.combo > 1) {
      state.texts.push(
        spawnFloatingText(
          attacker.x + MECHA_WIDTH / 2,
          attacker.y - 30,
          `${attacker.combo} HIT!`,
          COLORS.gold,
          1 + Math.min(attacker.combo, 5) * 0.12,
        ),
      );
    }
  } else {
    target.defendFlash = 10;
    state.texts.push(
      spawnFloatingText(
        target.x + MECHA_WIDTH / 2,
        target.y - 35,
        'GUARD',
        COLORS.white,
        0.9,
      ),
    );
  }

  state.shake = isUltimate ? 16 : isThrow ? 8 : result.damage >= 20 ? 8 : 5;
  state.hitStop = isUltimate ? 12 : isDefended ? 4 : result.damage >= 20 ? 7 : 4;
  if (isUltimate) state.flash = 10;

  // 刀光拖尾
  if (skillId === 'attack' || skillId === 'skill1' || skillId === 'skill2' || skillId === 'ultimate') {
    state.slashes.push(
      spawnSlashTrail(
        attacker,
        SKILL_CONFIG[skillId].range,
      ),
    );
  }

  // 元素粒子
  state.particles.push(
    ...spawnElementalParticles(
      target.x + MECHA_WIDTH / 2,
      target.y + MECHA_HEIGHT / 2,
      attacker.element,
      isUltimate ? 10 : 5,
    ),
  );

  if (isUltimate) {
    state.particles.push(
      ...spawnExplosionParticles(
        target.x + MECHA_WIDTH / 2,
        target.y + MECHA_HEIGHT / 2,
        attacker.element,
        32,
      ),
    );
  } else {
    state.particles.push(
      ...spawnHitParticles(
        target.x + MECHA_WIDTH / 2,
        target.y + MECHA_HEIGHT / 2,
        isDefended ? COLORS.white : getElementBrightColor(attacker.element),
        isThrow ? 16 : 12,
      ),
    );
  }

  state.texts.push(
    spawnFloatingText(
      target.x + MECHA_WIDTH / 2,
      target.y - 10,
      String(result.damage),
      isDefended ? COLORS.white : result.damage >= 20 ? '#FF5555' : getElementBrightColor(attacker.element),
      result.damage >= 20 ? 1.3 : 1,
    ),
  );
}

function updateProjectiles(state: GameState): void {
  state.projectiles = state.projectiles
    .map((p) => {
      p.x += p.vx;
      p.life--;
      return p;
    })
    .filter((p) => {
      if (p.x < -20 || p.x > CANVAS_WIDTH + 20 || p.life <= 0) return false;

      const target = p.ownerId === 'red' ? state.blue : state.red;
      const owner = p.ownerId === 'red' ? state.red : state.blue;
      if (
        target.invincible <= 0 &&
        p.x > target.x &&
        p.x < target.x + MECHA_WIDTH &&
        p.y > target.y &&
        p.y < target.y + MECHA_HEIGHT
      ) {
        let damage = p.damage;
        let knockbackX = p.vx > 0 ? 6 : -6;
        let knockbackY = -2;

        if (target.state === 'defend') {
          damage = Math.floor(damage * 0.3 * (1 / MECHA_TYPES[target.type].defenseMod));
          knockbackX = 0;
          knockbackY = 0;
        }

        target.hp = Math.max(0, target.hp - damage);
        target.vx += knockbackX;
        target.vy += knockbackY;

        if (target.state !== 'defend') {
          target.state = 'hurt';
          target.hitStun = 10;
          target.combo = 0;
        } else {
          target.defendFlash = 6;
        }

        state.shake = 5;
        state.hitStop = 4;
        state.particles.push(
          ...spawnHitParticles(
            p.x,
            p.y,
            target.state === 'defend' ? COLORS.white : getElementBrightColor(owner.element),
            10,
          ),
        );
        state.particles.push(
          ...spawnElementalParticles(p.x, p.y, owner.element, 4),
        );
        state.texts.push(
          spawnFloatingText(
            p.x,
            p.y - 10,
            String(damage),
            target.state === 'defend' ? COLORS.white : getElementBrightColor(owner.element),
          ),
        );
        return false;
      }

      return true;
    });
}

function updateCooldowns(mecha: Mecha): void {
  (Object.keys(mecha.cooldowns) as (keyof typeof mecha.cooldowns)[]).forEach((key) => {
    if (mecha.cooldowns[key] > 0) {
      mecha.cooldowns[key]--;
    }
  });
}

function updateMechaState(state: GameState, mecha: Mecha, opponent: Mecha): void {
  if (mecha.invincible > 0) mecha.invincible--;
  updateMechaPhysics(mecha);
  updateCooldowns(mecha);

  if (mecha.hitStun > 0) {
    mecha.hitStun--;
    if (mecha.hitStun <= 0 && mecha.hp > 0) {
      mecha.state = isOnGround(mecha) ? 'idle' : 'jump';
    }
  }

  if (mecha.comboTimer > 0) {
    mecha.comboTimer--;
    if (mecha.comboTimer <= 0) {
      mecha.combo = 0;
    }
  }

  if (mecha.defendFlash > 0) mecha.defendFlash--;

  if (
    mecha.state !== 'attack' &&
    mecha.state !== 'skill' &&
    mecha.state !== 'hurt' &&
    mecha.state !== 'dash' &&
    mecha.state !== 'throw' &&
    mecha.state !== 'counter'
  ) {
    mecha.facing = mecha.x < opponent.x ? 1 : -1;
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

function updateSlashes(state: GameState): void {
  state.slashes = state.slashes
    .map((s) => {
      s.life--;
      return s;
    })
    .filter((s) => s.life > 0);
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

function checkRoundEnd(state: GameState): void {
  if (state.roundWinner) return;

  const redDead = state.red.hp <= 0;
  const blueDead = state.blue.hp <= 0;

  if (redDead && blueDead) {
    state.roundWinner = 'draw';
  } else if (redDead) {
    state.roundWinner = 'blue';
    state.blue.state = 'idle';
  } else if (blueDead) {
    state.roundWinner = 'red';
    state.red.state = 'idle';
  } else if (state.roundResult.timer <= 0) {
    if (state.red.hp > state.blue.hp) {
      state.roundWinner = 'red';
    } else if (state.blue.hp > state.red.hp) {
      state.roundWinner = 'blue';
    } else {
      state.roundWinner = 'draw';
    }
  }

  if (state.roundWinner) {
    state.roundResult.roundTimerActive = false;
    if (state.roundWinner === 'red') {
      state.roundResult.redWins++;
    } else if (state.roundWinner === 'blue') {
      state.roundResult.blueWins++;
    }

    if (state.roundResult.redWins >= ROUNDS_TO_WIN) {
      state.matchWinner = 'red';
      state.screen = 'matchEnd';
    } else if (state.roundResult.blueWins >= ROUNDS_TO_WIN) {
      state.matchWinner = 'blue';
      state.screen = 'matchEnd';
    } else {
      state.screen = 'roundEnd';
    }
  }
}

export function tickGame(state: GameState, keys: KeyState): GameState {
  if (state.hitStop > 0) {
    state.hitStop--;
    return state;
  }

  if (state.flash > 0) state.flash--;
  if (state.shake > 0) state.shake--;
  if (state.ultimateCinematic > 0) state.ultimateCinematic--;

  if (state.screen === 'fighting') {
    state.frameCount++;

    handleSpecialInputs(state, keys, 'red', 'blue');
    handleSpecialInputs(state, keys, 'blue', 'red');

    updateMechaState(state, state.red, state.blue);
    updateMechaState(state, state.blue, state.red);

    updateProjectiles(state);
    updateParticles(state);
    updateSlashes(state);
    updateTexts(state);

    if (state.roundResult.roundTimerActive && state.frameCount % 60 === 0) {
      state.roundResult.timer--;
      if (state.roundResult.timer <= 0) {
        checkRoundEnd(state);
      }
    }

    if (!state.roundWinner) {
      checkRoundEnd(state);
    }
  }

  return state;
}
