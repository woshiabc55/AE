import { create } from "zustand";
import {
  api,
  type UserProgress,
  type CalendarData,
  type ProgressStats,
  type LessonResult,
} from "@/lib/api";

interface ProgressState {
  progress: UserProgress | null;
  calendar: CalendarData | null;
  stats: ProgressStats | null;
  isLoading: boolean;
  error: string | null;

  fetchProgress: () => Promise<void>;
  fetchCalendar: () => Promise<void>;
  fetchStats: () => Promise<void>;
  submitLessonResult: (result: LessonResult) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  calendar: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const progress = await api.progress.get();
      set({ progress, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch progress",
      });
    }
  },

  fetchCalendar: async () => {
    set({ isLoading: true, error: null });
    try {
      const calendar = await api.progress.calendar();
      set({ calendar, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch calendar",
      });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await api.progress.stats();
      set({ stats, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch stats",
      });
    }
  },

  submitLessonResult: async (result: LessonResult) => {
    set({ isLoading: true, error: null });
    try {
      await api.progress.submitLesson(result);
      set({ isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to submit lesson result",
      });
      throw err;
    }
  },
}));
