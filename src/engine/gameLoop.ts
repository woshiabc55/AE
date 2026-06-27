import type { GameState, GameAction, Plant, Zombie, Projectile, Sun } from "@/types";
import {
  ROWS,
  COLS,
  CELL_SIZE,
  LAWN_WIDTH,
  INITIAL_SUN,
  INITIAL_LIVES,
  SUN_VALUE,
  SEED_PACKETS,
  PLANT_HP,
  ZOMBIE_CONFIG,
  PROJECTILE_SPEED,
  PROJECTILE_DAMAGE,
  SUNFLOWER_INTERVAL,
  SKY_SUN_INTERVAL,
  WAVE_ZOMBIE_COUNTS,
} from "./constants";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function initialPackets() {
  return SEED_PACKETS.map((s) => ({ ...s, rechargedAt: 0 }));
}

function initialWaveCount(waveIndex: number) {
  return WAVE_ZOMBIE_COUNTS[Math.min(waveIndex, WAVE_ZOMBIE_COUNTS.length - 1)];
}

export function getInitialState(): GameState {
  return {
    status: "idle",
    sun: INITIAL_SUN,
    lives: INITIAL_LIVES,
    wave: 1,
    lastTick: performance.now(),
    lastSkySunAt: performance.now(),
    plants: [],
    zombies: [],
    projectiles: [],
    suns: [],
    selectedSeed: null,
    seedPackets: initialPackets(),
    hoveredCell: null,
    waveState: { remaining: initialWaveCount(0), lastSpawnAt: 0 },
  };
}

function pickZombieType(wave: number): keyof typeof ZOMBIE_CONFIG {
  const r = Math.random();
  if (wave >= 4 && r < 0.18) return "buckethead";
  if (wave >= 2 && r < 0.4) return "conehead";
  return "basic";
}

function spawnZombie(row: number, wave: number): Zombie {
  const type = pickZombieType(wave);
  const cfg = ZOMBIE_CONFIG[type];
  return {
    id: uid(),
    type,
    row,
    x: LAWN_WIDTH + 30,
    hp: cfg.hp,
    maxHp: cfg.hp,
    speed: cfg.speed,
    damage: cfg.damage,
    attackCooldown: 800,
    lastAttackAt: 0,
    isAttacking: false,
    isHit: false,
    hitUntil: 0,
  };
}

function spawnSun(x: number, y: number, fromSky = false): Sun {
  return {
    id: uid(),
    x,
    y,
    value: SUN_VALUE,
    createdAt: performance.now(),
    lifetime: fromSky ? 12000 : 10000,
  };
}

function spawnProjectile(plant: Plant): Projectile {
  return {
    id: uid(),
    row: plant.row,
    x: plant.col * CELL_SIZE + CELL_SIZE - 12,
    y: plant.row * CELL_SIZE + CELL_SIZE / 2 - 2,
    damage: PROJECTILE_DAMAGE,
    speed: PROJECTILE_SPEED,
  };
}

function hasZombieInRow(state: GameState, row: number, minX: number) {
  return state.zombies.some((z) => z.row === row && z.x > minX);
}

function updatePlants(state: GameState, now: number, dt: number): GameState {
  const suns = [...state.suns];
  const projectiles = [...state.projectiles];
  const plants = state.plants.map((p) => {
    if (p.type === "sunflower" && now - p.lastActionAt >= SUNFLOWER_INTERVAL) {
      suns.push(spawnSun(p.col * CELL_SIZE + CELL_SIZE / 2, p.row * CELL_SIZE + 10));
      return { ...p, lastActionAt: now };
    }
    if (
      p.type === "peashooter" &&
      now - p.lastActionAt >= 1500 &&
      hasZombieInRow(state, p.row, p.col * CELL_SIZE)
    ) {
      projectiles.push(spawnProjectile(p));
      return { ...p, lastActionAt: now };
    }
    return p;
  });
  return { ...state, plants, suns, projectiles };
}

function updateProjectiles(state: GameState, now: number, dt: number): GameState {
  const zombies = state.zombies.map((z) => ({ ...z, isHit: now < z.hitUntil }));
  const remaining: Projectile[] = [];
  for (const p of state.projectiles) {
    const nx = p.x + p.speed * dt;
    const hitIndex = zombies.findIndex(
      (z) => z.row === p.row && nx >= z.x - 18 && nx <= z.x + 24
    );
    if (hitIndex >= 0) {
      const z = zombies[hitIndex];
      z.hp -= p.damage;
      z.isHit = true;
      z.hitUntil = now + 120;
      zombies[hitIndex] = z;
      continue;
    }
    if (nx > LAWN_WIDTH + 40) continue;
    remaining.push({ ...p, x: nx });
  }
  return { ...state, projectiles: remaining, zombies };
}

function updateZombies(state: GameState, now: number, dt: number): GameState {
  let lives = state.lives;
  const plants = [...state.plants];
  const zombies = state.zombies
    .map((z) => {
      const target = plants.find(
        (p) =>
          p.row === z.row &&
          z.x <= p.col * CELL_SIZE + CELL_SIZE + 6 &&
          z.x >= p.col * CELL_SIZE - 8
      );
      if (target) {
        if (now - z.lastAttackAt >= z.attackCooldown) {
          target.hp -= z.damage;
          z.lastAttackAt = now;
        }
        return { ...z, isAttacking: true };
      }
      const nx = z.x - z.speed * dt;
      if (nx < -30) {
        lives = Math.max(0, lives - 1);
        return null;
      }
      return { ...z, x: nx, isAttacking: false, isHit: now < z.hitUntil };
    })
    .filter(Boolean) as typeof state.zombies;
  const alivePlants = plants.filter((p) => p.hp > 0);
  return { ...state, zombies, lives, plants: alivePlants };
}

function updateSuns(state: GameState, now: number, dt: number): GameState {
  const suns = state.suns
    .map((s) => ({ ...s, y: s.y + 36 * dt }))
    .filter((s) => now - s.createdAt < s.lifetime);
  return { ...state, suns };
}

function spawnWaveZombies(state: GameState, now: number): GameState {
  if (state.waveState.remaining <= 0) return state;
  if (now - state.waveState.lastSpawnAt < 2200) return state;
  const row = Math.floor(Math.random() * ROWS);
  const zombie = spawnZombie(row, state.wave);
  return {
    ...state,
    zombies: [...state.zombies, zombie],
    waveState: { remaining: state.waveState.remaining - 1, lastSpawnAt: now },
  };
}

function spawnSkySun(state: GameState, now: number): GameState {
  if (now - state.lastSkySunAt < SKY_SUN_INTERVAL) return state;
  const x = 60 + Math.random() * (LAWN_WIDTH - 120);
  return {
    ...state,
    suns: [...state.suns, spawnSun(x, -30, true)],
    lastSkySunAt: now,
  };
}

function advanceWave(state: GameState): GameState {
  if (state.waveState.remaining > 0 || state.zombies.length > 0) return state;
  const nextWave = state.wave + 1;
  const count = initialWaveCount(nextWave - 1);
  return {
    ...state,
    wave: nextWave,
    waveState: { remaining: count, lastSpawnAt: performance.now() },
  };
}

function handleTick(state: GameState, now: number): GameState {
  if (state.status !== "running") return { ...state, lastTick: now };
  if (state.lives <= 0) return { ...state, status: "gameover", lastTick: now };
  const dt = Math.min((now - state.lastTick) / 1000, 0.1);
  let next = { ...state, lastTick: now };
  next = spawnWaveZombies(next, now);
  next = spawnSkySun(next, now);
  next = updatePlants(next, now, dt);
  next = updateProjectiles(next, now, dt);
  next = updateZombies(next, now, dt);
  next = updateSuns(next, now, dt);
  next = advanceWave(next);
  if (next.lives <= 0) next = { ...next, status: "gameover" };
  return next;
}

function handlePlant(state: GameState, row: number, col: number): GameState {
  if (!state.selectedSeed) return state;
  const packet = state.seedPackets.find((p) => p.type === state.selectedSeed);
  if (!packet) return state;
  const now = performance.now();
  if (state.sun < packet.cost) return state;
  if (now < packet.rechargedAt) return state;
  if (state.plants.some((p) => p.row === row && p.col === col)) return state;
  const plant: Plant = {
    id: uid(),
    type: packet.type,
    row,
    col,
    hp: PLANT_HP[packet.type],
    maxHp: PLANT_HP[packet.type],
    lastActionAt: now,
  };
  const packets = state.seedPackets.map((p) =>
    p.type === packet.type ? { ...p, rechargedAt: now + p.cooldown } : p
  );
  return {
    ...state,
    sun: state.sun - packet.cost,
    selectedSeed: null,
    plants: [...state.plants, plant],
    seedPackets: packets,
  };
}

function handleCollectSun(state: GameState, id: string): GameState {
  const sun = state.suns.find((s) => s.id === id);
  if (!sun) return state;
  return {
    ...state,
    sun: state.sun + sun.value,
    suns: state.suns.filter((s) => s.id !== id),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return { ...state, status: state.status === "running" ? "paused" : "running" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "RESET":
      return getInitialState();
    case "TICK":
      return handleTick(state, action.now);
    case "SELECT_SEED":
      return { ...state, selectedSeed: action.seed };
    case "PLANT":
      return handlePlant(state, action.row, action.col);
    case "COLLECT_SUN":
      return handleCollectSun(state, action.id);
    case "HOVER_CELL":
      return { ...state, hoveredCell: action.cell };
    default:
      return state;
  }
}
