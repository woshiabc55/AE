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
  audioEl: HTMLAudioElement | null;
  uploadError: string | null;
  setTick: (n: number) => void;
  setAudioEl: (el: HTMLAudioElement | null) => void;
  play: (id?: string) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (p: number) => void;
  setVolume: (v: number) => void;
  setOpen: (o: boolean) => void;
  addTrack: (t: Track) => void;
  removeTrack: (id: string) => void;
  setUploadError: (msg: string | null) => void;
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
  audioEl: null,
  uploadError: null,
  setTick: (n) => set({ tick: n }),
  setAudioEl: (el) => set({ audioEl: el }),
  play: (id) => {
    const s = get();
    const newId = id ?? s.currentId;
    const track = s.playlist.find((t) => t.id === newId);
    if (!track) return;
    set({
      currentId: newId,
      playing: true,
      currentTime: 0,
      duration: track.src ? 0 : parseDuration(track.dur),
    });
    if (s.audioEl) {
      // 真实音频文件
      if (track.src) {
        if (s.audioEl.src !== track.src) {
          s.audioEl.src = track.src;
          s.audioEl.load();
        }
        s.audioEl.play().catch(() => {
          // 自动播放可能被浏览器阻止
        });
      } else {
        // demo 曲目：暂停真实音频
        s.audioEl.pause();
      }
    }
  },
  pause: () => {
    set({ playing: false });
    const s = get();
    s.audioEl?.pause();
  },
  toggle: () => {
    const s = get();
    if (s.playing) s.pause();
    else s.play();
  },
  next: () => {
    const s = get();
    const i = s.playlist.findIndex((t) => t.id === s.currentId);
    const ni = (i + 1) % s.playlist.length;
    s.play(s.playlist[ni].id);
  },
  prev: () => {
    const s = get();
    const i = s.playlist.findIndex((t) => t.id === s.currentId);
    const pi = (i - 1 + s.playlist.length) % s.playlist.length;
    s.play(s.playlist[pi].id);
  },
  seek: (p) => {
    const np = Math.min(1, Math.max(0, p));
    set({ currentTime: np });
    const s = get();
    if (s.audioEl && s.audioEl.duration) {
      s.audioEl.currentTime = np * s.audioEl.duration;
    }
  },
  setVolume: (v) => {
    const nv = Math.min(1, Math.max(0, v));
    set({ volume: nv });
    const s = get();
    if (s.audioEl) s.audioEl.volume = nv;
  },
  setOpen: (o) => set({ open: o }),
  addTrack: (t) =>
    set((s) => ({
      playlist: [...s.playlist, t],
      // 上传后自动切到新曲目
      currentId: t.id,
      currentTime: 0,
      playing: true,
    })),
  removeTrack: (id) =>
    set((s) => {
      const track = s.playlist.find((x) => x.id === id);
      // 释放 blob URL
      if (track?.src?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(track.src);
        } catch {
          /* ignore */
        }
      }
      const list = s.playlist.filter((t) => t.id !== id);
      return {
        playlist: list,
        currentId: s.currentId === id ? list[0]?.id ?? "" : s.currentId,
        playing: s.currentId === id ? false : s.playing,
      };
    }),
  setUploadError: (msg) => set({ uploadError: msg }),
}));

function parseDuration(s: string): number {
  const [m, sec] = s.split(":").map(Number);
  return (m || 0) * 60 + (sec || 0);
}

export const formatTime = (p: number, total: number) => {
  if (!total || !isFinite(total)) {
    const m = "00";
    const s = "00";
    return `${m}:${s}`;
  }
  const cur = Math.floor(p * total);
  const m = Math.floor(cur / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(cur % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};
