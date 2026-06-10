// 全局 Toast 通知 store
import { create } from "zustand";
import { nanoid } from "nanoid";

export type ToastKind = "info" | "success" | "warn" | "error";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number;
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id" | "createdAt" | "duration"> & { id?: string; duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? "t_" + nanoid(6);
    const toast: Toast = {
      id,
      kind: t.kind,
      title: t.title,
      description: t.description,
      duration: t.duration ?? 3500,
      createdAt: Date.now(),
    };
    set({ toasts: [...get().toasts, toast] });
    if (toast.duration > 0) {
      setTimeout(() => get().dismiss(id), toast.duration);
    }
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  clear: () => set({ toasts: [] }),
}));

// 便捷方法
export const toast = {
  info: (title: string, description?: string) =>
    useToast.getState().push({ kind: "info", title, description }),
  success: (title: string, description?: string) =>
    useToast.getState().push({ kind: "success", title, description }),
  warn: (title: string, description?: string) =>
    useToast.getState().push({ kind: "warn", title, description }),
  error: (title: string, description?: string) =>
    useToast.getState().push({ kind: "error", title, description, duration: 5500 }),
};
