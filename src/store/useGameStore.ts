import { create } from "zustand";
import type { GameState, GameAction } from "@/types";
import { getInitialState, gameReducer } from "@/engine/gameLoop";

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  ...getInitialState(),
  dispatch: (action) => set((state) => gameReducer(state, action)),
}));
