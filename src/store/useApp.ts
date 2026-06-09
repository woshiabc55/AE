// 全局状态：用户、收藏、Toast
import { create } from 'zustand';
import type { User } from '../types';
import { AuthService } from '../services/auth';
import { TemplateService } from '../services/template';
import { uid } from '../lib/utils';

export interface Toast {
  id: string;
  kind: 'success' | 'info' | 'warn' | 'error';
  message: string;
  ttl?: number;
}

interface AppState {
  user: User | null;
  favorites: Set<string>;
  toasts: Toast[];
  bootstrapped: boolean;

  // 动作
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;

  toggleFavorite: (id: string) => void;

  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useApp = create<AppState>((set, get) => ({
  user: null,
  favorites: new Set<string>(),
  toasts: [],
  bootstrapped: false,

  bootstrap: async () => {
    const u = await AuthService.bootstrap();
    const favs = new Set<string>();
    try {
      const list = await TemplateService.listFavorites();
      list.forEach((id) => favs.add(id));
    } catch { /* ignore */ }
    set({ user: u, favorites: favs, bootstrapped: true });
  },

  login: async (email, password) => {
    const u = await AuthService.login(email, password);
    set({ user: u });
    get().pushToast({ kind: 'success', message: `欢迎回来，${u.name}` });
  },

  register: async (email, password, name) => {
    const u = await AuthService.register(email, password, name);
    set({ user: u });
    get().pushToast({ kind: 'success', message: `欢迎加入剧幕，${u.name}` });
  },

  loginDemo: async () => {
    const u = await AuthService.loginAsDemo();
    set({ user: u });
    get().pushToast({ kind: 'info', message: '已进入演示账号，云端模板已同步' });
  },

  logout: async () => {
    await AuthService.logout();
    set({ user: null });
    get().pushToast({ kind: 'info', message: '已退出登录' });
  },

  toggleFavorite: (id) => {
    TemplateService.toggleFavorite(id);
    const next = new Set(get().favorites);
    if (next.has(id)) {
      next.delete(id);
      get().pushToast({ kind: 'info', message: '已取消收藏' });
    } else {
      next.add(id);
      get().pushToast({ kind: 'success', message: '已加入收藏' });
    }
    set({ favorites: next });
  },

  pushToast: (t) => {
    const id = uid('toast');
    const toast: Toast = { id, ttl: 2400, ...t };
    set({ toasts: [...get().toasts, toast] });
    setTimeout(() => get().dismissToast(id), toast.ttl);
  },

  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
