import { create } from "zustand";
import { api, type AuthResponse } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  targetLanguage: string;
  level: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

function persistToken(token: string) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function mapAuthResponse(data: AuthResponse) {
  return {
    user: data.user,
    token: data.token,
    isAuthenticated: true,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.auth.login({ email, password });
      persistToken(data.token);
      set({
        ...mapAuthResponse(data),
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Login failed",
      });
      throw err;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.auth.register({ email, password, username });
      persistToken(data.token);
      set({
        ...mapAuthResponse(data),
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Registration failed",
      });
      throw err;
    }
  },

  logout: () => {
    clearToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchMe: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const user = await api.auth.me();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
