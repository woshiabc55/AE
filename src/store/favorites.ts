import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesStore = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
        } else {
          set({ ids: [id, ...ids] });
        }
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'icongalaxy.favorites' },
  ),
);
