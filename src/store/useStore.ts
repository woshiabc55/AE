import { create } from 'zustand';
import type { User, Language, Level, LearningProgress } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  progress: LearningProgress;
  currentLanguage: Language;
  sidebarCollapsed: boolean;

  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setCurrentLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  addXP: (amount: number) => void;
  updateProgress: (data: Partial<LearningProgress>) => void;
  completeLesson: (lessonId: string) => void;
}

const defaultProgress: LearningProgress = {
  userId: '',
  language: 'en',
  level: 'A1',
  completedLessons: ['en-a1-01-l01', 'en-a1-01-l02'],
  vocabularyMastered: 78,
  grammarMastered: 35,
  speakingScore: 75,
  listeningScore: 60,
  totalXP: 450,
  streak: 5,
  lastStudyDate: '2026-05-31',
  dailyMinutes: 25,
  weeklyData: [
    { day: '周一', minutes: 30, words: 12 },
    { day: '周二', minutes: 45, words: 18 },
    { day: '周三', minutes: 20, words: 8 },
    { day: '周四', minutes: 35, words: 15 },
    { day: '周五', minutes: 50, words: 22 },
    { day: '周六', minutes: 40, words: 16 },
    { day: '周日', minutes: 25, words: 10 },
  ],
};

const loadUser = (): User | null => {
  try {
    const stored = localStorage.getItem('lingua_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('lingua_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('lingua_user');
  }
};

export const useStore = create<AppState>((set, get) => ({
  user: loadUser(),
  isAuthenticated: !!loadUser(),
  progress: { ...defaultProgress, userId: loadUser()?.id || '' },
  currentLanguage: loadUser()?.targetLanguage || 'en',
  sidebarCollapsed: false,

  login: (email: string, _password: string) => {
    const user: User = {
      id: 'user-01',
      email,
      name: email.split('@')[0],
      avatar: '🧑‍💻',
      targetLanguage: 'en',
      level: 'A1',
      xp: 450,
      streak: 5,
      dailyGoal: 30,
      createdAt: '2026-05-25',
    };
    saveUser(user);
    set({
      user,
      isAuthenticated: true,
      progress: { ...defaultProgress, userId: user.id },
      currentLanguage: user.targetLanguage,
    });
    return true;
  },

  register: (name: string, email: string, _password: string) => {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      avatar: '🧑‍💻',
      targetLanguage: 'en',
      level: 'A1',
      xp: 0,
      streak: 0,
      dailyGoal: 30,
      createdAt: new Date().toISOString(),
    };
    saveUser(user);
    set({
      user,
      isAuthenticated: true,
      progress: { ...defaultProgress, userId: user.id, totalXP: 0, streak: 0, completedLessons: [], vocabularyMastered: 0, grammarMastered: 0, speakingScore: 0, listeningScore: 0 },
      currentLanguage: user.targetLanguage,
    });
    return true;
  },

  logout: () => {
    saveUser(null);
    set({ user: null, isAuthenticated: false, progress: defaultProgress });
  },

  updateUser: (data) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    saveUser(updated);
    set({ user: updated });
  },

  setCurrentLanguage: (lang) => {
    set({ currentLanguage: lang });
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, targetLanguage: lang };
      saveUser(updated);
      set({ user: updated });
    }
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  addXP: (amount) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, xp: currentUser.xp + amount };
    saveUser(updated);
    set((state) => ({
      user: updated,
      progress: { ...state.progress, totalXP: state.progress.totalXP + amount },
    }));
  },

  updateProgress: (data) => {
    set((state) => ({ progress: { ...state.progress, ...data } }));
  },

  completeLesson: (lessonId) => {
    set((state) => ({
      progress: {
        ...state.progress,
        completedLessons: [...state.progress.completedLessons, lessonId],
        totalXP: state.progress.totalXP + 25,
      },
      user: state.user ? { ...state.user, xp: state.user.xp + 25 } : null,
    }));
  },
}));
