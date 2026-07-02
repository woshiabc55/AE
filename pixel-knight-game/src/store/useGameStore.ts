// 像素骑士：暗影征伐 - 游戏元状态（驱动 HUD / 界面层）

import { create } from "zustand";
import type { EngineSnapshot, GamePhase, SkillId, PassiveId, ChapterStage } from "@/types";
import { SKILL_ORDER, TOTAL_CHAPTERS } from "@/config";

interface GameStoreState {
  phase: GamePhase;
  hp: number;
  maxHp: number;
  focus: number;
  maxFocus: number;
  combo: number;
  maxCombo: number;
  score: number;
  wave: number;
  totalWaves: number;
  enemiesLeft: number;
  waveLabel: string;
  flashRed: number;
  cooldowns: Record<SkillId, number>;
  passives: PassiveId[];
  chapter: number;
  totalChapters: number;
  chapterName: string;
  stage: ChapterStage;
  bossActive: boolean;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  bossPhase: number;
  transitionText: string;
  // 控制动作
  startGame: () => void;
  restart: () => void;
  toTitle: () => void;
  togglePause: () => void;
  skipTransition: () => void;
  // 引擎回写
  sync: (s: EngineSnapshot) => void;
}

const zeroCooldowns = (): Record<SkillId, number> => {
  const o = {} as Record<SkillId, number>;
  for (const id of SKILL_ORDER) o[id] = 0;
  return o;
};

const initial = {
  phase: "title" as GamePhase,
  hp: 100,
  maxHp: 100,
  focus: 0,
  maxFocus: 100,
  combo: 0,
  maxCombo: 0,
  score: 0,
  wave: 1,
  totalWaves: 2,
  enemiesLeft: 0,
  waveLabel: "",
  flashRed: 0,
  cooldowns: zeroCooldowns(),
  passives: [] as PassiveId[],
  chapter: 1,
  chapterName: "亡者墓地",
  stage: "waves" as ChapterStage,
  bossActive: false,
  bossName: "",
  bossHp: 0,
  bossMaxHp: 0,
  bossPhase: 1,
  transitionText: "",
};

export const useGameStore = create<GameStoreState>((set) => ({
  ...initial,
  totalChapters: TOTAL_CHAPTERS,
  totalWaves: 2,
  startGame: () => set({ phase: "playing" }),
  restart: () => set({ ...initial, totalChapters: TOTAL_CHAPTERS, cooldowns: zeroCooldowns() }),
  toTitle: () => set({ ...initial, totalChapters: TOTAL_CHAPTERS, cooldowns: zeroCooldowns() }),
  togglePause: () =>
    set((s) => ({
      phase: s.phase === "playing" ? "paused" : s.phase === "paused" ? "playing" : s.phase,
    })),
  skipTransition: () => set({ phase: "playing", transitionText: "" }),
  sync: (s) =>
    set({
      phase: s.phase,
      hp: s.hp,
      maxHp: s.maxHp,
      focus: s.focus,
      maxFocus: s.maxFocus,
      combo: s.combo,
      maxCombo: s.maxCombo,
      score: s.score,
      wave: s.wave,
      totalWaves: s.totalWaves,
      enemiesLeft: s.enemiesLeft,
      waveLabel: s.waveLabel,
      flashRed: s.flashRed,
      cooldowns: s.cooldowns,
      passives: s.passives,
      chapter: s.chapter,
      chapterName: s.chapterName,
      stage: s.stage,
      bossActive: s.bossActive,
      bossName: s.bossName,
      bossHp: s.bossHp,
      bossMaxHp: s.bossMaxHp,
      bossPhase: s.bossPhase,
      transitionText: s.transitionText,
    }),
}));
