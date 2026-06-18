import { create } from 'zustand';
import type { GameState, Mecha, MechaId } from '@/utils/types';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  MECHA_WIDTH,
  MECHA_HEIGHT,
} from '@/utils/constants';

function createMecha(id: MechaId, startX: number): Mecha {
  return {
    id,
    x: startX,
    y: GROUND_Y - MECHA_HEIGHT,
    vx: 0,
    vy: 0,
    hp: 100,
    maxHp: 100,
    facing: id === 'red' ? 1 : -1,
    state: 'idle',
    animTimer: 0,
    cooldowns: { attack: 0, skill1: 0, skill2: 0, ultimate: 0 },
    combo: 0,
    comboTimer: 0,
    hitStun: 0,
    skillId: null,
    defendFlash: 0,
  };
}

function buildInitialState(): GameState {
  return {
    red: createMecha('red', CANVAS_WIDTH * 0.25 - MECHA_WIDTH / 2),
    blue: createMecha('blue', CANVAS_WIDTH * 0.75 - MECHA_WIDTH / 2),
    particles: [],
    texts: [],
    winner: null,
    round: 1,
    shake: 0,
    frameCount: 0,
  };
}

interface GameStore extends GameState {
  setGameState: (updater: (state: GameState) => GameState) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...buildInitialState(),
  setGameState: (updater) => set((state) => updater(state)),
  resetGame: () => set(buildInitialState()),
}));
