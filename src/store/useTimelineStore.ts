import { create } from 'zustand';
import type { EasingData } from '../types';
import { defaultEasing } from '../types';

interface TimelineState {
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  isLooping: boolean;
  fps: number;
  selectedEasing: EasingData;

  setCurrentFrame: (f: number) => void;
  setTotalFrames: (f: number) => void;
  togglePlay: () => void;
  setIsPlaying: (p: boolean) => void;
  toggleLoop: () => void;
  setFps: (fps: number) => void;
  setSelectedEasing: (e: EasingData) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  currentFrame: 0,
  totalFrames: 180,
  isPlaying: false,
  isLooping: true,
  fps: 60,
  selectedEasing: defaultEasing,

  setCurrentFrame: (f) => set({ currentFrame: Math.max(0, f) }),
  setTotalFrames: (f) => set({ totalFrames: f }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setIsPlaying: (p) => set({ isPlaying: p }),
  toggleLoop: () => set((s) => ({ isLooping: !s.isLooping })),
  setFps: (fps) => set({ fps }),
  setSelectedEasing: (e) => set({ selectedEasing: e }),
}));
