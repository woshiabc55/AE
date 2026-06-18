import type { GameState, Mecha, MechaId, KeyState } from './types';
import {
  CANVAS_HEIGHT,
  WORLD_WIDTH,
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
  COYOTE_TIME,
  INPUT_BUFFER_FRAMES,
} from './constants';
import {
  performAttack,
  spawnProjectile,
  spawnOrbitProjectiles,
  spawnSlashTrail,
  spawnHitParticles,
  spawnExplosionParticles,
  spawnElementalParticles,
  spawnFloatingText,
  getElementBrightColor,
} from './skills';
import { particlePool, textPool, slashPool, projectilePool } from './pool';

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

  mecha.x = clamp(mecha.x, 0, WORLD_WIDTH - MECHA_WIDTH);

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
  if (skillId === 'skill3') {
    mecha.state = 'skill';
    mecha.animTimer = cfg.duration;
    mecha.cooldowns.skill3 = cfg.cooldown;
    mecha.skillId = skillId;
    return;
  }
  mecha.state = skillId === 'attack' ? 'attack' : 'skill';
  mecha.animTimer = cfg.duration;
  mecha.cooldowns[skillId] = cfg.cooldown;
  mecha.skillId = skillId;
}

type SkillKey = keyof typeof SKILL_CONFIG | 'jump';

function bufferInput(mecha: Mecha, skillId: SkillKey): void {
  mecha.inputBuffer[skillId] = INPUT_BUFFER_FRAMES;
}

function consumeBufferedInput(mecha: Mecha, skillId: SkillKey): boolean {
  if (mecha.inputBuffer[skillId] && mecha.inputBuffer[skillId]! > 0) {
    mecha.inputBuffer[skillId] = 0;
    return true;
  }
  return false;
}

function updateInputBuffer(mecha: Mecha): void {
  for (const key of Object.keys(mecha.inputBuffer) as SkillKey[]) {
    if (mecha.inputBuffer[key] && mecha.inputBuffer[key]! > 0) {
      mecha.inputBuffer[key]!--;
    }
  }
}

function tryStartSkill(
  state: GameState,
  mecha: Mecha,
  skillId: keyof typeof SKILL_CONFIG,
  pressed: boolean,
): boolean {
  const ready = mecha.cooldowns[skillId] <= 0;
  const triggered = pressed || consumeBufferedInput(mecha, skillId);
  if (triggered && ready) {
    startAction(mecha, skillId);
    if (skillId === 'ultimate') {
      state.ultimateCinematic = 40;
    }
    return true;
  }
  if (pressed && !ready) {
    bufferInput(mecha, skillId);
  }
  return false;
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

  updateInputBuffer(mecha);

  if (mecha.state === 'attack' || mecha.state === 'skill' || mecha.state === 'throw' || mecha.state === 'counter') {
    if (mecha.animTimer > 0) {
      mecha.animTimer--;

      if (mecha.state === 'counter') {
        if (mecha.counterWindow > 0) mecha.counterWindow--;
      }

      if (mecha.skillId === 'projectile' && mecha.animTimer === Math.floor(SKILL_CONFIG.projectile.duration / 2)) {
        state.projectiles.push(spawnProjectile(mecha));
      }

      if (mecha.skillId === 'skill3' && mecha.animTimer === Math.floor(SKILL_CONFIG.skill3.duration / 2)) {
        state.projectiles.push(...spawnOrbitProjectiles(mecha, 3));
      }

      if (mecha.animTimer === Math.floor((mecha.skillId ? SKILL_CONFIG[mecha.skillId].duration : 12) / 2)) {
        tryHit(state, mecha, opponent);
      }
      if (mecha.animTimer <= 0) {
        const onGround = isOnGround(mecha);
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
      mecha.state = isOnGround(mecha) ? 'idle' : 'jump';
      mecha.vx *= 0.5;
    }
    return;
  }

  if (!canAct(mecha)) return;

  const onGround = isOnGround(mecha);
  const stats = getStats(mecha);

  // 跳跃：支持土狼时间与输入缓冲
  const jumpPressed = pressed[map.jump] || consumeBufferedInput(mecha, 'jump');
  const canJump = onGround || mecha.coyoteTime > 0;
  if (jumpPressed && canJump) {
    mecha.vy = stats.jumpForce;
    mecha.state = 'jump';
    mecha.coyoteTime = 0;
  } else if (pressed[map.jump] && !canJump) {
    bufferInput(mecha, 'jump');
  }

  if (pressed[map.defend] && onGround) {
    mecha.state = 'defend';
    mecha.vx *= 0.8;
    return;
  }

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

  if (onGround) {
    mecha.state = isMoving ? 'run' : 'idle';
  } else if (mecha.state !== 'jump') {
    mecha.state = 'jump';
  }

  // 技能输入（带缓冲）
  if (tryStartSkill(state, mecha, 'attack', pressed[map.attack])) return;
  if (tryStartSkill(state, mecha, 'skill1', pressed[map.skill1])) return;
  if (tryStartSkill(state, mecha, 'skill2', pressed[map.skill2])) return;
  if (tryStartSkill(state, mecha, 'throw', pressed[map.throw])) return;
  if (tryStartSkill(state, mecha, 'dash', pressed[map.dash])) return;
  if (tryStartSkill(state, mecha, 'projectile', pressed[map.projectile])) return;
  if (tryStartSkill(state, mecha, 'skill3', pressed[map.skill3])) return;
  if (tryStartSkill(state, mecha, 'counter', pressed[map.counter])) return;
  if (tryStartSkill(state, mecha, 'ultimate', pressed[map.ultimate])) return;
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
  const alive: typeof state.projectiles = [];
  for (const p of state.projectiles) {
    // 根据行为更新子弹位置
    if (p.behavior === 'orbit') {
      const cx = (p.orbitCenterX ?? p.x) + (p.orbitCenterVX ?? 0);
      const cy = (p.orbitCenterY ?? p.y) + (p.orbitCenterVY ?? 0);
      const speed = p.orbitSpeed ?? 0.1;
      const radius = (p.orbitRadius ?? 20) + (Math.random() - 0.5) * 3;
      const angle = (p.orbitAngle ?? 0) + speed;
      p.orbitCenterX = cx;
      p.orbitCenterY = cy;
      p.orbitAngle = angle;
      p.orbitRadius = radius;
      p.x = cx + Math.cos(angle) * radius;
      p.y = cy + Math.sin(angle) * radius;
    } else if (p.behavior === 'wave') {
      p.x += p.vx;
      p.wavePhase = (p.wavePhase ?? 0) + (p.waveFrequency ?? 0.2);
      p.y = (p.waveBaseY ?? p.y) + Math.sin(p.wavePhase) * (p.waveAmplitude ?? 20);
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }
    p.life--;

    const target = p.ownerId === 'red' ? state.blue : state.red;
    const owner = p.ownerId === 'red' ? state.red : state.blue;
    const targetCX = target.x + MECHA_WIDTH / 2;
    const targetCY = target.y + MECHA_HEIGHT / 2;
    const hit =
      target.invincible <= 0 &&
      Math.abs(p.x - targetCX) < MECHA_WIDTH / 2 + p.radius &&
      Math.abs(p.y - targetCY) < MECHA_HEIGHT / 2 + p.radius;

    if (hit) {
      let damage = p.damage;
      let knockbackX = p.x > targetCX ? 5 : -5;
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
      projectilePool.release(p);
      continue;
    }

    if (p.x < -40 || p.x > WORLD_WIDTH + 40 || p.y < -40 || p.y > CANVAS_HEIGHT + 40 || p.life <= 0) {
      projectilePool.release(p);
      continue;
    }

    alive.push(p);
  }
  state.projectiles = alive;
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

  const wasOnGround = isOnGround(mecha);
  updateMechaPhysics(mecha);
  const nowOnGround = isOnGround(mecha);

  // 土狼时间：离开地面时开始倒计时
  if (wasOnGround && !nowOnGround && mecha.state !== 'jump') {
    mecha.coyoteTime = COYOTE_TIME;
  } else if (mecha.coyoteTime > 0) {
    mecha.coyoteTime--;
  }

  updateCooldowns(mecha);

  if (mecha.hitStun > 0) {
    mecha.hitStun--;
    if (mecha.hitStun <= 0 && mecha.hp > 0) {
      mecha.state = nowOnGround ? 'idle' : 'jump';
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
  const alive: typeof state.particles = [];
  for (const p of state.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.life--;
    if (p.life > 0) {
      alive.push(p);
    } else {
      particlePool.release(p);
    }
  }
  state.particles = alive;
}

function updateSlashes(state: GameState): void {
  const alive: typeof state.slashes = [];
  for (const s of state.slashes) {
    s.life--;
    if (s.life > 0) {
      alive.push(s);
    } else {
      slashPool.release(s);
    }
  }
  state.slashes = alive;
}

function updateTexts(state: GameState): void {
  const alive: typeof state.texts = [];
  for (const t of state.texts) {
    t.y += t.vy;
    t.life--;
    if (t.life > 0) {
      alive.push(t);
    } else {
      textPool.release(t);
    }
  }
  state.texts = alive;
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
