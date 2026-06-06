import { create } from "zustand";
import type { LayerKey, ShotId } from "@/data/shots";

interface AppState {
  activeShot: ShotId;
  activeLayer: LayerKey;
  setShot: (id: ShotId) => void;
  setLayer: (key: LayerKey) => void;
  scrollProgress: number;
  setScrollProgress: (n: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  hasEntered: boolean;
  setEntered: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeShot: "shot-21",
  activeLayer: "narrative",
  setShot: (id) => set({ activeShot: id }),
  setLayer: (key) => set({ activeLayer: key }),
  scrollProgress: 0,
  setScrollProgress: (n) => set({ scrollProgress: n }),
  isMuted: true,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  hasEntered: false,
  setEntered: (v) => set({ hasEntered: v }),
}));
