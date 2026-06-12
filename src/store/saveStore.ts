import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LevelState = {
  id: number;
  unlocked: boolean;
  bestScore: number;
  bestTimeMs: number;
};

export type SaveState = {
  version: 1;
  levels: LevelState[];
};

const TOTAL_LEVELS = 10;

function createDefault(): SaveState {
  return {
    version: 1,
    levels: Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      id: i + 1,
      unlocked: i === 0,
      bestScore: 0,
      bestTimeMs: 0,
    })),
  };
}

type SaveStore = SaveState & {
  reset: () => void;
  recordResult: (levelId: number, score: number, timeMs: number) => {
    newBest: boolean;
    unlockedNext: boolean;
  };
};

export const useSaveStore = create<SaveStore>()(
  persist(
    (set, get) => ({
      ...createDefault(),
      reset: () => set({ ...createDefault() }),
      recordResult: (levelId, score, timeMs) => {
        const levels = get().levels.map((lv) => ({ ...lv }));
        const idx = levels.findIndex((l) => l.id === levelId);
        if (idx < 0) return { newBest: false, unlockedNext: false };
        const lv = levels[idx];
        const newBest = score > lv.bestScore;
        if (newBest) {
          lv.bestScore = score;
          lv.bestTimeMs = timeMs;
        } else if (lv.bestTimeMs === 0) {
          lv.bestTimeMs = timeMs;
        }
        // 通关条件:消灭所有敌人计为通过
        // 我们把"得分大于0"视为通关以简化(分数代表击杀)
        if (score > 0 && idx + 1 < levels.length) {
          const next = levels[idx + 1];
          if (!next.unlocked) {
            next.unlocked = true;
          }
        }
        set({ levels });
        return { newBest, unlockedNext: idx + 1 < levels.length && levels[idx + 1].unlocked };
      },
    }),
    {
      name: 'ball-game-save-v1',
      version: 1,
    }
  )
);

export { TOTAL_LEVELS };
