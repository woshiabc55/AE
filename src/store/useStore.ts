import { create } from 'zustand'
import { items, type Item } from '../data/items'

interface UserState {
  isKeeper: boolean
  collection: string[]
  toggleKeeper: () => void
  toggleCollect: (id: string) => void
  collectedItems: () => Item[]
  catalogFilter: Item['category'] | 'all'
  setCatalogFilter: (f: Item['category'] | 'all') => void
}

export const useStore = create<UserState>((set, get) => ({
  isKeeper: false,
  collection: [],
  toggleKeeper: () => set((s) => ({ isKeeper: !s.isKeeper })),
  toggleCollect: (id) =>
    set((s) => ({
      collection: s.collection.includes(id)
        ? s.collection.filter((x) => x !== id)
        : [...s.collection, id],
    })),
  collectedItems: () => items.filter((i) => get().collection.includes(i.id)),
  catalogFilter: 'all',
  setCatalogFilter: (f) => set({ catalogFilter: f }),
}))
