import { create } from "zustand";

interface UIState {
  /** 当前打开详情抽屉的作品 id；null 表示关闭 */
  detailId: string | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  detailId: null,
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
}));
