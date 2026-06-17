import { create } from 'zustand';
import type { ThemeId } from '@/themes/themes';

export type SourceId = 'synth' | 'mic' | 'file';

export interface StoreState {
  source: SourceId;
  theme: ThemeId;
  sensitivity: number; // 0..2
  density: number; // 0..1
  speed: number; // 0..2
  glow: number; // 0..2
  ripple: boolean;
  paused: boolean;
  fileName: string | null;
  fps: number;
  rms: number;
  bpm: number;
  beat: number; // 0..1 瞬时脉冲
  mode: string;
  resolution: string;
  setSource: (s: SourceId) => void;
  setTheme: (t: ThemeId) => void;
  setSensitivity: (v: number) => void;
  setDensity: (v: number) => void;
  setSpeed: (v: number) => void;
  setGlow: (v: number) => void;
  toggleRipple: () => void;
  togglePaused: () => void;
  setFileName: (n: string | null) => void;
  setHud: (data: Partial<Pick<StoreState, 'fps' | 'rms' | 'bpm' | 'beat' | 'mode' | 'resolution'>>) => void;
}

export const useStore = create<StoreState>((set) => ({
  source: 'synth',
  theme: 'aurora',
  sensitivity: 1.0,
  density: 0.85,
  speed: 1.0,
  glow: 1.0,
  ripple: true,
  paused: false,
  fileName: null,
  fps: 0,
  rms: 0,
  bpm: 120,
  beat: 0,
  mode: 'PULSE',
  resolution: '0 x 0',
  setSource: (s) => set({ source: s }),
  setTheme: (t) => set({ theme: t }),
  setSensitivity: (v) => set({ sensitivity: v }),
  setDensity: (v) => set({ density: v }),
  setSpeed: (v) => set({ speed: v }),
  setGlow: (v) => set({ glow: v }),
  toggleRipple: () => set((s) => ({ ripple: !s.ripple })),
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  setFileName: (n) => set({ fileName: n }),
  setHud: (data) => set(data),
}));
