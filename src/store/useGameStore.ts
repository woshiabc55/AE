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
  ammo: number; // 本层剩余残响弹
  maxAmmo: number; // 本层残响弹上限
  kills: number; // 本层击杀暗影数
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
  // 记忆碎片（收集回响时显示）
  fragment: string | null;
  // 受伤红屏闪烁强度 0~1，每帧衰减
  damageFlash: number;
  // 收集金光闪烁强度 0~1，每帧衰减
  collectFlash: number;
  // 暗影接近心跳强度 0~1（最近暗影距离映射）
  heartbeat: number;
  // 是否冲刺中
  sprinting: boolean;
  // 关卡总数
  levelCount: number;
  // 命中标记时间戳（击中暗影时刷新，HUD 显示短暂 X）
  hitMarker: number;
  // 是否瞄准了暗影（准星变红）
  aimingAtEnemy: boolean;
  // 上次开火时间戳（用于空仓/开火反馈）
  fireFlash: number;

  // actions
  setSettings: (s: Partial<GameSettings>) => void;
  startNewGame: () => void;
  continueGame: () => void;
  enterLevel: (index: number, name: string, echoTotal: number, ammo: number) => void;
  collectEcho: (fragment: string) => void;
  damage: (amount: number) => void;
  setResonance: (v: number) => void;
  tick: (dtSec: number) => void;
  setDamageFlash: (v: number) => void;
  setCollectFlash: (v: number) => void;
  setHeartbeat: (v: number) => void;
  setSprinting: (v: boolean) => void;
  setAmmo: (n: number) => void;
  addKill: () => void;
  setHitMarker: (t: number) => void;
  setAimingAtEnemy: (v: boolean) => void;
  setFireFlash: (t: number) => void;
  decayFlashes: (dtSec: number) => void;
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
  ammo: 0,
  maxAmmo: 0,
  kills: 0,
});

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: "menu",
  settings: storage.loadSettings(),
  hasSave: storage.hasSave(),
  bestTimeSec: storage.loadProgress().bestTimeSec,
  totalEchoesAllTime: storage.loadProgress().totalEchoes,
  stats: freshStats(),
  banner: null,
  fragment: null,
  damageFlash: 0,
  collectFlash: 0,
  heartbeat: 0,
  sprinting: false,
  levelCount: 5,
  hitMarker: 0,
  aimingAtEnemy: false,
  fireFlash: 0,

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
      fragment: null,
      damageFlash: 0,
      collectFlash: 0,
      heartbeat: 0,
    });
  },

  continueGame: () => {
    const save = storage.loadSave();
    set({
      stats: { ...freshStats(), level: save.levelReached, startTime: Date.now() },
      gameState: "playing",
      fragment: null,
      damageFlash: 0,
      collectFlash: 0,
      heartbeat: 0,
    });
  },

  enterLevel: (index, name, echoTotal, ammo) => {
    const prev = get().stats;
    set({
      stats: {
        ...prev,
        level: index,
        levelName: name,
        echoesCollected: 0,
        echoesTotal: echoTotal,
        ammo,
        maxAmmo: ammo,
        kills: 0,
      },
      gameState: "playing",
      banner: `第 ${index} 层 · ${name}`,
      fragment: null,
      aimingAtEnemy: false,
    });
    setTimeout(() => {
      if (get().banner?.startsWith(`第 ${index} 层`)) set({ banner: null });
    }, 2600);
  },

  collectEcho: (fragment) => {
    const s = get().stats;
    set({
      stats: { ...s, echoesCollected: s.echoesCollected + 1, totalEchoes: s.totalEchoes + 1 },
      collectFlash: 1,
      fragment,
    });
    setTimeout(() => {
      if (get().fragment === fragment) set({ fragment: null });
    }, 3200);
  },

  damage: (amount) => {
    const s = get().stats;
    const r = Math.max(0, s.resonance - amount);
    set({ stats: { ...s, resonance: r }, damageFlash: 1 });
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

  setDamageFlash: (v) => set({ damageFlash: Math.max(0, Math.min(1, v)) }),
  setCollectFlash: (v) => set({ collectFlash: Math.max(0, Math.min(1, v)) }),
  setHeartbeat: (v) => set({ heartbeat: Math.max(0, Math.min(1, v)) }),
  setSprinting: (v) => {
    if (get().sprinting !== v) set({ sprinting: v });
  },
  setAmmo: (n) => {
    const s = get().stats;
    set({ stats: { ...s, ammo: Math.max(0, Math.min(s.maxAmmo, n)) } });
  },
  addKill: () => {
    const s = get().stats;
    set({ stats: { ...s, kills: s.kills + 1 } });
  },
  setHitMarker: (t) => set({ hitMarker: t }),
  setAimingAtEnemy: (v) => {
    if (get().aimingAtEnemy !== v) set({ aimingAtEnemy: v });
  },
  setFireFlash: (t) => set({ fireFlash: t }),

  decayFlashes: (dtSec) => {
    const { damageFlash, collectFlash } = get();
    // 约 0.6s 衰减归零
    const k = Math.max(0, 1 - dtSec / 0.6);
    set({ damageFlash: damageFlash * k, collectFlash: collectFlash * k });
  },

  completeLevel: () => {
    const s = get().stats;
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
  goToMenu: () => set({ gameState: "menu", banner: null, fragment: null }),

  showBanner: (text) => {
    set({ banner: text });
    setTimeout(() => {
      if (get().banner === text) set({ banner: null });
    }, 2200);
  },
}));

export { DEFAULT_SETTINGS };
