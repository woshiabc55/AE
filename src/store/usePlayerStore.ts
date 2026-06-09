import { create } from 'zustand';
import { ALL_SHOTS } from '@/data/scripts';

interface PlayerState {
  currentIndex: number;
  isPlaying: boolean;
  muted: boolean;
  showSubtitles: boolean;
  showPrompts: boolean;
  speed: 1 | 0.4;
  setIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleSubtitles: () => void;
  togglePrompts: () => void;
  setSpeed: (s: 1 | 0.4) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentIndex: 0,
  isPlaying: false,
  muted: false,
  showSubtitles: true,
  showPrompts: false,
  speed: 1,
  setIndex: (i) => set({ currentIndex: Math.max(0, Math.min(ALL_SHOTS.length - 1, i)) }),
  next: () => {
    const i = get().currentIndex;
    set({ currentIndex: i + 1 >= ALL_SHOTS.length ? 0 : i + 1 });
  },
  prev: () => {
    const i = get().currentIndex;
    set({ currentIndex: i - 1 < 0 ? ALL_SHOTS.length - 1 : i - 1 });
  },
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
  toggleMute: () => set({ muted: !get().muted }),
  toggleSubtitles: () => set({ showSubtitles: !get().showSubtitles }),
  togglePrompts: () => set({ showPrompts: !get().showPrompts }),
  setSpeed: (s) => set({ speed: s }),
  reset: () => set({ currentIndex: 0, isPlaying: false }),
}));
