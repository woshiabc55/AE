import { create } from 'zustand';

type ToastKind = 'success' | 'error' | 'info';
type Toast = { id: number; text: string; kind: ToastKind };

type ToastStore = {
  toasts: Toast[];
  push: (text: string, kind?: ToastKind) => void;
  remove: (id: number) => void;
};

let _id = 0;

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: (text, kind = 'success') => {
    const id = ++_id;
    set((s) => ({ toasts: [...s.toasts, { id, text, kind }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2200);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
