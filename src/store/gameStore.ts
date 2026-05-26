import { create } from 'zustand';

export interface GameState {
  wave: {
    amplitude: number;
    frequency: number;
    phase: number;
    layers: number;
    speed: number;
  };
  belize: {
    intensity: number;
    colorShift: number;
    distortion: number;
  };
  renderer: {
    pixelSize: number;
    targetFps: number;
  };
  currentFps: number;
  currentPage: 'game' | 'effects';

  setWave: (wave: Partial<GameState['wave']>) => void;
  setBelize: (belize: Partial<GameState['belize']>) => void;
  setRenderer: (renderer: Partial<GameState['renderer']>) => void;
  setCurrentFps: (fps: number) => void;
  setCurrentPage: (page: GameState['currentPage']) => void;
}

export const useGameStore = create<GameState>((set) => ({
  wave: {
    amplitude: 8,
    frequency: 0.05,
    phase: 0,
    layers: 4,
    speed: 2,
  },
  belize: {
    intensity: 0.5,
    colorShift: 0,
    distortion: 0.5,
  },
  renderer: {
    pixelSize: 4,
    targetFps: 30,
  },
  currentFps: 0,
  currentPage: 'game',

  setWave: (wave) =>
    set((state) => ({ wave: { ...state.wave, ...wave } })),
  setBelize: (belize) =>
    set((state) => ({ belize: { ...state.belize, ...belize } })),
  setRenderer: (renderer) =>
    set((state) => ({ renderer: { ...state.renderer, ...renderer } })),
  setCurrentFps: (fps) => set({ currentFps: fps }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
