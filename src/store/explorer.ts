import { create } from 'zustand';
import type { IconSource, IconCategory } from '@/api/types';

type ExplorerStore = {
  activeSource: IconSource | 'all';
  activeCategory: IconCategory | 'all';
  keyword: string;
  setSource: (s: IconSource | 'all') => void;
  setCategory: (c: IconCategory | 'all') => void;
  setKeyword: (k: string) => void;
  reset: () => void;
};

export const useExplorer = create<ExplorerStore>((set) => ({
  activeSource: 'all',
  activeCategory: 'all',
  keyword: '',
  setSource: (s) => set({ activeSource: s }),
  setCategory: (c) => set({ activeCategory: c }),
  setKeyword: (k) => set({ keyword: k }),
  reset: () => set({ activeSource: 'all', activeCategory: 'all', keyword: '' }),
}));
