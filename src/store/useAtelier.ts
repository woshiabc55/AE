import { create } from 'zustand';

export type Mode = 'paper' | 'silk';

export type CharTick = { t: number; ch: string };

type Store = {
  mode: Mode;
  chars: CharTick[];
  pulseAt: number;
  sealed: boolean;
  rainId: number;     // 单调递增，触发像素雨
  rainFrom: { x: number; y: number };
  rainTo: { x: number; y: number };
  text: string;
  // actions
  pushChar: (ch: string) => void;
  setText: (t: string) => void;
  seal: () => void;
  switchMode: () => void;
  reset: () => void;
  clear: () => void;
};

export const useAtelier = create<Store>((set) => ({
  mode: 'paper',
  chars: [],
  pulseAt: 0,
  sealed: false,
  rainId: 0,
  rainFrom: { x: 50, y: 50 },
  rainTo: { x: 20, y: 30 },
  text: '',
  pushChar: (ch) =>
    set((s) => ({
      chars: [...s.chars.slice(-48), { t: Date.now(), ch }],
      pulseAt: Date.now(),
      rainId: s.rainId + 1,
    })),
  setText: (t) => set({ text: t }),
  seal: () => set({ sealed: true, pulseAt: Date.now() }),
  switchMode: () =>
    set((s) => ({ mode: s.mode === 'paper' ? 'silk' : 'paper' })),
  reset: () =>
    set({
      chars: [],
      pulseAt: Date.now(),
      sealed: false,
      rainId: 0,
      text: '',
    }),
  clear: () => set({ text: '' }),
}));
