import { create } from "zustand";
import { api, type Course, type Lesson } from "@/lib/api";

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;

  fetchCourses: (language?: string, level?: string) => Promise<void>;
  fetchCourseDetail: (id: string) => Promise<void>;
  fetchLessons: (courseId: string) => Promise<void>;
  clearCurrentCourse: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  lessons: [],
  isLoading: false,
  error: null,

  fetchCourses: async (language?: string, level?: string) => {
    set({ isLoading: true, error: null });
    try {
      const courses = await api.courses.list({ language, level });
      set({ courses, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch courses",
      });
    }
  },

  fetchCourseDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const course = await api.courses.detail(id);
      set({ currentCourse: course, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch course detail",
      });
    }
  },

  fetchLessons: async (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const lessons = await api.courses.lessons(courseId);
      set({ lessons, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch lessons",
      });
    }
  },

  clearCurrentCourse: () => set({ currentCourse: null, lessons: [] }),
}));
