// 像素骑士：暗影征伐 - 游戏元状态（驱动 HUD / 界面层）

import { create } from "zustand";
import type { EngineSnapshot, GamePhase } from "@/types";

interface GameStoreState {
  phase: GamePhase;
  hp: number;
  maxHp: number;
  combo: number;
  maxCombo: number;
  score: number;
  wave: number;
  totalWaves: number;
  enemiesLeft: number;
  waveLabel: string;
  flashRed: number;
  // 控制动作
  startGame: () => void;
  restart: () => void;
  toTitle: () => void;
  togglePause: () => void;
  // 引擎回写
  sync: (s: EngineSnapshot) => void;
}

const initial = {
  phase: "title" as GamePhase,
  hp: 100,
  maxHp: 100,
  combo: 0,
  maxCombo: 0,
  score: 0,
  wave: 1,
  totalWaves: 1,
  enemiesLeft: 0,
  waveLabel: "",
  flashRed: 0,
};

export const useGameStore = create<GameStoreState>((set) => ({
  ...initial,
  totalWaves: 4,
  startGame: () => set({ phase: "playing" }),
  restart: () => set({ phase: "playing", ...initial, totalWaves: 4 }),
  toTitle: () => set({ ...initial, totalWaves: 4 }),
  togglePause: () =>
    set((s) => ({
      phase: s.phase === "playing" ? "paused" : s.phase === "paused" ? "playing" : s.phase,
    })),
  sync: (s) =>
    set({
      phase: s.phase,
      hp: s.hp,
      maxHp: s.maxHp,
      combo: s.combo,
      maxCombo: s.maxCombo,
      score: s.score,
      wave: s.wave,
      totalWaves: s.totalWaves,
      enemiesLeft: s.enemiesLeft,
      waveLabel: s.waveLabel,
      flashRed: s.flashRed,
    }),
}));
