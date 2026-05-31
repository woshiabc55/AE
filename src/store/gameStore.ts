import { create } from 'zustand';
import { GamePhase, GameResult } from '@/game/types';

interface GameState {
  phase: GamePhase;
  result: GameResult | null;
  setPhase: (phase: GamePhase) => void;
  setResult: (result: GameResult) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'title',
  result: null,
  setPhase: (phase) => set({ phase }),
  setResult: (result) => set({ result }),
  reset: () => set({ phase: 'title', result: null }),
}));
