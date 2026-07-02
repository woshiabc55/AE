import { create } from "zustand";
import { storage, type GameSettings, DEFAULT_SETTINGS } from "@/lib/storage";

export type GameState = "menu" | "playing" | "paused" | "victory" | "defeat";

export interface RunStats {
  level: number; // 当前 1 基关卡
  levelName: string;
  resonance: number; // 0~100
  echoesCollected: number; // 本层已收集
  echoesTotal: number; // 本层需要
  totalEchoes: number; // 整局累计
  startTime: number; // ms
  elapsedSec: number;
  finalTimeSec: number;
}

interface GameStore {
  gameState: GameState;
  settings: GameSettings;
  hasSave: boolean;
  bestTimeSec: number | null;
  totalEchoesAllTime: number;
  stats: RunStats;
  // 关卡提示横幅
  banner: string | null;

  // actions
  setSettings: (s: Partial<GameSettings>) => void;
  startNewGame: () => void;
  continueGame: () => void;
  enterLevel: (index: number, name: string, echoTotal: number) => void;
  collectEcho: () => void;
  damage: (amount: number) => void;
  setResonance: (v: number) => void;
  tick: (dtSec: number) => void;
  completeLevel: () => void; // 进入传送门
  win: () => void;
  fail: () => void;
  pause: () => void;
  resume: () => void;
  goToMenu: () => void;
  showBanner: (text: string) => void;
}

const freshStats = (): RunStats => ({
  level: 1,
  levelName: "",
  resonance: 100,
  echoesCollected: 0,
  echoesTotal: 0,
  totalEchoes: 0,
  startTime: 0,
  elapsedSec: 0,
  finalTimeSec: 0,
});

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: "menu",
  settings: storage.loadSettings(),
  hasSave: storage.hasSave(),
  bestTimeSec: storage.loadProgress().bestTimeSec,
  totalEchoesAllTime: storage.loadProgress().totalEchoes,
  stats: freshStats(),
  banner: null,

  setSettings: (s) => {
    const next = { ...get().settings, ...s };
    storage.saveSettings(next);
    set({ settings: next });
  },

  startNewGame: () => {
    storage.clearSave();
    set({
      hasSave: false,
      stats: { ...freshStats(), startTime: Date.now() },
      gameState: "playing",
    });
  },

  continueGame: () => {
    const save = storage.loadSave();
    set({
      stats: { ...freshStats(), level: save.levelReached, startTime: Date.now() },
      gameState: "playing",
    });
  },

  enterLevel: (index, name, echoTotal) => {
    const prev = get().stats;
    set({
      stats: {
        ...prev,
        level: index,
        levelName: name,
        echoesCollected: 0,
        echoesTotal: echoTotal,
      },
      gameState: "playing",
      banner: `第 ${index} 层 · ${name}`,
    });
    // 横幅自动消失
    setTimeout(() => {
      if (get().banner?.startsWith(`第 ${index} 层`)) set({ banner: null });
    }, 2600);
  },

  collectEcho: () => {
    const s = get().stats;
    set({ stats: { ...s, echoesCollected: s.echoesCollected + 1, totalEchoes: s.totalEchoes + 1 } });
  },

  damage: (amount) => {
    const s = get().stats;
    const r = Math.max(0, s.resonance - amount);
    set({ stats: { ...s, resonance: r } });
    if (r <= 0) get().fail();
  },

  setResonance: (v) => {
    const s = get().stats;
    set({ stats: { ...s, resonance: Math.max(0, Math.min(100, v)) } });
  },

  tick: (dtSec) => {
    const s = get().stats;
    if (get().gameState !== "playing") return;
    set({ stats: { ...s, elapsedSec: s.elapsedSec + dtSec } });
  },

  completeLevel: () => {
    const s = get().stats;
    // 保存进度到当前层（已通过）
    storage.saveSave({ levelReached: s.level, updatedAt: Date.now() });
    set({ hasSave: true });
  },

  win: () => {
    const s = get().stats;
    const finalTime = s.elapsedSec;
    const prog = storage.loadProgress();
    const best = prog.bestTimeSec == null ? finalTime : Math.min(prog.bestTimeSec, finalTime);
    storage.saveProgress({ totalEchoes: prog.totalEchoes + s.totalEchoes, bestTimeSec: best });
    storage.clearSave();
    set({
      gameState: "victory",
      hasSave: false,
      bestTimeSec: best,
      totalEchoesAllTime: prog.totalEchoes + s.totalEchoes,
      stats: { ...s, finalTimeSec: finalTime },
    });
  },

  fail: () => {
    const s = get().stats;
    set({ gameState: "defeat", stats: { ...s, finalTimeSec: s.elapsedSec } });
  },

  pause: () => {
    if (get().gameState === "playing") set({ gameState: "paused" });
  },
  resume: () => {
    if (get().gameState === "paused") set({ gameState: "playing" });
  },
  goToMenu: () => set({ gameState: "menu", banner: null }),

  showBanner: (text) => {
    set({ banner: text });
    setTimeout(() => {
      if (get().banner === text) set({ banner: null });
    }, 2200);
  },
}));

export { DEFAULT_SETTINGS };
