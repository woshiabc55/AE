import { create } from "zustand";
import { tracks, type Track } from "@/data/tracks";

interface PlayerState {
  playlist: Track[];
  currentId: string;
  playing: boolean;
  currentTime: number; // 0~1 进度
  duration: number; // 估算时长（秒）
  volume: number; // 0~1
  open: boolean; // 播放列表抽屉
  tick: number; // 心跳
  setTick: (n: number) => void;
  play: (id?: string) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (p: number) => void;
  setVolume: (v: number) => void;
  setOpen: (o: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: tracks,
  currentId: tracks[0].id,
  playing: false,
  currentTime: 0,
  duration: 222, // 3:42
  volume: 0.6,
  open: false,
  tick: 0,
  setTick: (n) => set({ tick: n }),
  play: (id) =>
    set((s) => {
      const newId = id ?? s.currentId;
      // 切换曲目时重置进度
      const track = s.playlist.find((t) => t.id === newId);
      return {
        currentId: newId,
        playing: true,
        currentTime: 0,
        duration: track ? parseDuration(track.dur) : s.duration,
      };
    }),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  next: () => {
    const s = get();
    const i = s.playlist.findIndex((t) => t.id === s.currentId);
    const ni = (i + 1) % s.playlist.length;
    set({
      currentId: s.playlist[ni].id,
      currentTime: 0,
      duration: parseDuration(s.playlist[ni].dur),
      playing: true,
    });
  },
  prev: () => {
    const s = get();
    const i = s.playlist.findIndex((t) => t.id === s.currentId);
    const pi = (i - 1 + s.playlist.length) % s.playlist.length;
    set({
      currentId: s.playlist[pi].id,
      currentTime: 0,
      duration: parseDuration(s.playlist[pi].dur),
      playing: true,
    });
  },
  seek: (p) => set({ currentTime: Math.min(1, Math.max(0, p)) }),
  setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
  setOpen: (o) => set({ open: o }),
}));

function parseDuration(s: string): number {
  const [m, sec] = s.split(":").map(Number);
  return (m || 0) * 60 + (sec || 0);
}

export const formatTime = (p: number, total: number) => {
  const cur = Math.floor(p * total);
  const m = Math.floor(cur / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(cur % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};
