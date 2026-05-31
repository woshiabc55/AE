import { create } from "zustand";
import { api, type Achievement, type LeaderboardEntry } from "@/lib/api";

interface AchievementState {
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;

  fetchAchievements: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  leaderboard: [],
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const achievements = await api.achievements.list();
      set({ achievements, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch achievements",
      });
    }
  },

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const leaderboard = await api.achievements.leaderboard();
      set({ leaderboard, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch leaderboard",
      });
    }
  },
}));
