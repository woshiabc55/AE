import { create } from "zustand";
import type { SectionId } from "@/data/sections";

interface GameState {
  activeSection: SectionId;
  scrollProgress: number;
  easterEggCount: number;
  shakeMode: boolean;
  setActiveSection: (id: SectionId) => void;
  setScrollProgress: (p: number) => void;
  bumpEasterEgg: () => void;
  resetEasterEgg: () => void;
  setShakeMode: (v: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeSection: "hero",
  scrollProgress: 0,
  easterEggCount: 0,
  shakeMode: false,
  setActiveSection: (id) => set({ activeSection: id }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  bumpEasterEgg: () =>
    set((state) => {
      const next = state.easterEggCount + 1;
      if (next >= 5 && !state.shakeMode) {
        return { easterEggCount: 0, shakeMode: true };
      }
      return { easterEggCount: next };
    }),
  resetEasterEgg: () => set({ easterEggCount: 0 }),
  setShakeMode: (v) => set({ shakeMode: v }),
}));
