import { create } from "zustand";
import { storage, type GameSettings, type CareerStats } from "@/lib/storage";
import type { OperatorClass, Team } from "@/game/operators";

export type GameState = "menu" | "operator" | "playing" | "paused" | "matchEnd";

export interface TeammateInfo {
  id: number;
  op: OperatorClass;
  hp: number;
  maxHp: number;
  alive: boolean;
}

export interface MatchInfo {
  round: number;
  scoreAlpha: number;
  scoreBravo: number;
  ticketsAlpha: number;
  ticketsBravo: number;
  captureProgress: number; // -100..+100
  captureOwner: "alpha" | "bravo" | "neutral";
  phase: "prep" | "combat" | "roundOver" | "matchOver";
  phaseTimer: number;
}

interface GameStore {
  gameState: GameState;
  settings: GameSettings;
  career: CareerStats;
  selectedOp: OperatorClass;
  // 玩家实时状态
  hp: number;
  maxHp: number;
  armor: number;
  ammo: number;
  magSize: number;
  reserveAmmo: number;
  reloading: boolean;
  kills: number;
  deaths: number;
  alive: boolean;
  respawnTimer: number;
  sprinting: boolean;
  // 受伤/命中反馈
  damageFlash: number;
  hitMarker: number; // 时间戳
  killMarker: number; // 时间戳
  aimingAtEnemy: boolean;
  // 队友快照
  teammates: TeammateInfo[];
  // 对局信息
  match: MatchInfo;
  // 小地图敌人可见点(世界坐标归一化)
  enemiesOnRadar: { x: number; z: number }[];
  teammatesOnRadar: { x: number; z: number }[];
  // 横幅/提示
  banner: string | null;
  matchWinner: Team | null;

  // actions
  setSettings: (s: Partial<GameSettings>) => void;
  selectOp: (op: OperatorClass) => void;
  goTo: (s: GameState) => void;
  startMatch: (op: OperatorClass) => void;
  setPlayerStatus: (p: Partial<Pick<GameStore, "hp" | "maxHp" | "armor" | "ammo" | "magSize" | "reserveAmmo" | "reloading" | "kills" | "deaths" | "alive" | "respawnTimer" | "sprinting">>) => void;
  setDamageFlash: (v: number) => void;
  setHitMarker: (t: number) => void;
  setKillMarker: (t: number) => void;
  setAimingAtEnemy: (v: boolean) => void;
  setTeammates: (t: TeammateInfo[]) => void;
  setMatch: (m: MatchInfo) => void;
  setRadar: (enemies: { x: number; z: number }[], allies: { x: number; z: number }[]) => void;
  showBanner: (text: string, ms?: number) => void;
  decayDamageFlash: (dt: number) => void;
  endMatch: (winner: Team, kills: number, deaths: number) => void;
  pause: () => void;
  resume: () => void;
}

const freshMatch = (): MatchInfo => ({
  round: 1,
  scoreAlpha: 0,
  scoreBravo: 0,
  ticketsAlpha: 14,
  ticketsBravo: 14,
  captureProgress: 0,
  captureOwner: "neutral",
  phase: "prep",
  phaseTimer: 3,
});

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: "menu",
  settings: storage.loadSettings(),
  career: storage.loadCareer(),
  selectedOp: "assault",
  hp: 100,
  maxHp: 100,
  armor: 0.25,
  ammo: 30,
  magSize: 30,
  reserveAmmo: 120,
  reloading: false,
  kills: 0,
  deaths: 0,
  alive: true,
  respawnTimer: 0,
  sprinting: false,
  damageFlash: 0,
  hitMarker: 0,
  killMarker: 0,
  aimingAtEnemy: false,
  teammates: [],
  match: freshMatch(),
  enemiesOnRadar: [],
  teammatesOnRadar: [],
  banner: null,
  matchWinner: null,

  setSettings: (s) => {
    const next = { ...get().settings, ...s };
    storage.saveSettings(next);
    set({ settings: next });
  },
  selectOp: (op) => set({ selectedOp: op }),

  goTo: (s) => set({ gameState: s, banner: null }),

  startMatch: (op) =>
    set({
      selectedOp: op,
      gameState: "playing",
      kills: 0,
      deaths: 0,
      match: freshMatch(),
      banner: null,
      damageFlash: 0,
      matchWinner: null,
    }),

  setPlayerStatus: (p) => set(p),
  setDamageFlash: (v) => set({ damageFlash: Math.max(0, Math.min(1, v)) }),
  setHitMarker: (t) => set({ hitMarker: t }),
  setKillMarker: (t) => set({ killMarker: t }),
  setAimingAtEnemy: (v) => {
    if (get().aimingAtEnemy !== v) set({ aimingAtEnemy: v });
  },
  setTeammates: (t) => set({ teammates: t }),
  setMatch: (m) => set({ match: m }),
  setRadar: (enemies, allies) =>
    set({ enemiesOnRadar: enemies, teammatesOnRadar: allies }),

  showBanner: (text, ms = 2400) => {
    set({ banner: text });
    setTimeout(() => {
      if (get().banner === text) set({ banner: null });
    }, ms);
  },
  decayDamageFlash: (dt) => {
    const k = Math.max(0, 1 - dt / 0.6);
    set({ damageFlash: get().damageFlash * k });
  },

  endMatch: (winner, kills, deaths) => {
    const c = get().career;
    const won = winner === "alpha";
    const next: CareerStats = {
      totalKills: c.totalKills + kills,
      totalDeaths: c.totalDeaths + deaths,
      matchesWon: c.matchesWon + (won ? 1 : 0),
      matchesPlayed: c.matchesPlayed + 1,
      bestRoundKills: Math.max(c.bestRoundKills, kills),
    };
    storage.saveCareer(next);
    set({ career: next, matchWinner: winner, gameState: "matchEnd" });
  },

  pause: () => {
    if (get().gameState === "playing") set({ gameState: "paused" });
  },
  resume: () => {
    if (get().gameState === "paused") set({ gameState: "playing" });
  },
}));

export { DEFAULT_SETTINGS } from "@/lib/storage";
