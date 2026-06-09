import { create } from 'zustand';

export type TotalMinutes = 10 | 20 | 30 | 40 | 60;
export type Resolution = 720 | 1080;
export type Speed = 0.5 | 1 | 1.5 | 2;
export type StyleKey = 'brainrot' | 'neon' | 'newspaper' | 'bauhaus' | 'magazine' | 'pixel';

export interface AppState {
  totalMinutes: TotalMinutes;
  resolution: Resolution;
  speed: Speed;
  volume: number;
  style: StyleKey;
  watermark: boolean;
  particles: boolean;
  subtitles: boolean;
  running: boolean;
  fps: number;
  width: number;
  height: number;
  cardDuration: number;
  logs: { ts: string; type: 'ok' | 'warn' | 'err'; msg: string }[];
  set: (patch: Partial<AppState>) => void;
  log: (msg: string, type?: 'ok' | 'warn' | 'err') => void;
}

export const useAppStore = create<AppState>((set) => ({
  totalMinutes: 20,
  resolution: 1080,
  speed: 1,
  volume: 0.6,
  style: 'brainrot',
  watermark: true,
  particles: true,
  subtitles: true,
  running: false,
  fps: 30,
  width: 1920,
  height: 1080,
  cardDuration: 5000,
  logs: [],
  set: (patch) => set(patch),
  log: (msg, type = 'ok') =>
    set((s) => {
      const ts = new Date().toTimeString().slice(0, 8);
      const next = [...s.logs, { ts, type, msg }];
      while (next.length > 200) next.shift();
      return { logs: next };
    }),
}));
