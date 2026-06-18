import { create } from 'zustand';
import type {
  GameState,
  Mecha,
  MechaId,
  MechaType,
  GameMode,
  Difficulty,
  GameScreen,
} from '@/utils/types';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
  MECHA_TYPES,
  ROUND_TIME,
} from '@/utils/constants';

function createMecha(
  id: MechaId,
  type: MechaType,
  startX: number,
): Mecha {
  const stats = MECHA_TYPES[type];
  return {
    id,
    type,
    element: id === 'red' ? 'fire' : 'electric',
    x: startX,
    y: GROUND_Y - MECHA_HEIGHT,
    vx: 0,
    vy: 0,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
    facing: id === 'red' ? 1 : -1,
    state: 'idle',
    animTimer: 0,
    cooldowns: {
      attack: 0,
      skill1: 0,
      skill2: 0,
      throw: 0,
      ultimate: 0,
      dash: 0,
      projectile: 0,
      counter: 0,
    },
    combo: 0,
    comboTimer: 0,
    hitStun: 0,
    skillId: null,
    defendFlash: 0,
    dashTimer: 0,
    counterWindow: 0,
    invincible: 0,
    coyoteTime: 0,
    inputBuffer: {},
  };
}

function buildInitialRoundState(
  redType: MechaType,
  blueType: MechaType,
  round: number,
  redWins: number,
  blueWins: number,
): Partial<GameState> {
  return {
    red: createMecha('red', redType, CANVAS_WIDTH * 0.25 - MECHA_WIDTH / 2),
    blue: createMecha('blue', blueType, CANVAS_WIDTH * 0.75 - MECHA_WIDTH / 2),
    projectiles: [],
    particles: [],
    slashes: [],
    texts: [],
    roundResult: {
      redWins,
      blueWins,
      round,
      timer: ROUND_TIME,
      roundTimerActive: true,
    },
    roundWinner: null,
    matchWinner: null,
    shake: 0,
    flash: 0,
    hitStop: 0,
    frameCount: 0,
    ultimateCinematic: 0,
  };
}

function buildInitialState(): GameState {
  return {
    screen: 'menu',
    mode: 'pvp',
    difficulty: 'normal',
    redType: 'striker',
    blueType: 'striker',
    red: createMecha('red', 'striker', CANVAS_WIDTH * 0.25 - MECHA_WIDTH / 2),
    blue: createMecha(
      'blue',
      'striker',
      CANVAS_WIDTH * 0.75 - MECHA_WIDTH / 2,
    ),
    projectiles: [],
    particles: [],
    slashes: [],
    texts: [],
    roundResult: {
      redWins: 0,
      blueWins: 0,
      round: 1,
      timer: ROUND_TIME,
      roundTimerActive: false,
    },
    roundWinner: null,
    matchWinner: null,
    shake: 0,
    flash: 0,
    hitStop: 0,
    frameCount: 0,
    ultimateCinematic: 0,
  };
}

interface GameStore extends GameState {
  setGameState: (updater: (state: GameState) => GameState) => void;
  setScreen: (screen: GameScreen) => void;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setMechaType: (id: MechaId, type: MechaType) => void;
  startMatch: () => void;
  nextRound: () => void;
  resetMatch: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...buildInitialState(),
  setGameState: (updater) => set((state) => updater(state)),
  setScreen: (screen) => set({ screen }),
  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setMechaType: (id, type) =>
    set(() => ({ [id === 'red' ? 'redType' : 'blueType']: type })),
  startMatch: () =>
    set((state) => ({
      screen: 'fighting',
      ...buildInitialRoundState(state.redType, state.blueType, 1, 0, 0),
    })),
  nextRound: () =>
    set((state) => ({
      screen: 'fighting',
      ...buildInitialRoundState(
        state.redType,
        state.blueType,
        state.roundResult.round + 1,
        state.roundResult.redWins,
        state.roundResult.blueWins,
      ),
    })),
  resetMatch: () => set(buildInitialState()),
}));
