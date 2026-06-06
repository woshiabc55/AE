import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Derivative, DerivativeType, Region, Status } from '../data/derivatives'

export type SortKey = 'year-desc' | 'year-asc' | 'rating-desc' | 'popularity-desc'

interface LibraryState {
  query: string
  setQuery: (q: string) => void

  filters: {
    types: DerivativeType[]
    regions: Region[]
    status: Status[]
    yearMin: number
    yearMax: number
    ratingMin: number
  }
  toggleType: (t: DerivativeType) => void
  toggleRegion: (r: Region) => void
  toggleStatus: (s: Status) => void
  setYearRange: (a: number, b: number) => void
  setRatingMin: (n: number) => void
  resetFilters: () => void

  sort: SortKey
  setSort: (s: SortKey) => void

  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  compareList: string[]
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void

  openDetailId: string | null
  openDetail: (id: string | null) => void
}

const initial = {
  query: '',
  filters: { types: [] as DerivativeType[], regions: [] as Region[], status: [] as Status[], yearMin: 1985, yearMax: 2026, ratingMin: 0 },
  sort: 'popularity-desc' as SortKey,
  favorites: [] as string[],
  compareList: [] as string[],
  openDetailId: null as string | null,
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      ...initial,
      setQuery: (q) => set({ query: q }),
      toggleType: (t) => set((s) => ({
        filters: {
          ...s.filters,
          types: s.filters.types.includes(t) ? s.filters.types.filter(x => x !== t) : [...s.filters.types, t],
        }
      })),
      toggleRegion: (r) => set((s) => ({
        filters: {
          ...s.filters,
          regions: s.filters.regions.includes(r) ? s.filters.regions.filter(x => x !== r) : [...s.filters.regions, r],
        }
      })),
      toggleStatus: (st) => set((s) => ({
        filters: {
          ...s.filters,
          status: s.filters.status.includes(st) ? s.filters.status.filter(x => x !== st) : [...s.filters.status, st],
        }
      })),
      setYearRange: (a, b) => set((s) => ({ filters: { ...s.filters, yearMin: a, yearMax: b } })),
      setRatingMin: (n) => set((s) => ({ filters: { ...s.filters, ratingMin: n } })),
      resetFilters: () => set({ filters: initial.filters }),

      setSort: (sort) => set({ sort }),

      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id]
      })),
      isFavorite: (id) => get().favorites.includes(id),

      addToCompare: (id) => set((s) => {
        if (s.compareList.includes(id)) return {}
        if (s.compareList.length >= 3) return { compareList: [...s.compareList.slice(1), id] }
        return { compareList: [...s.compareList, id] }
      }),
      removeFromCompare: (id) => set((s) => ({ compareList: s.compareList.filter(x => x !== id) })),
      clearCompare: () => set({ compareList: [] }),

      openDetail: (id) => set({ openDetailId: id }),
    }),
    {
      name: 'ip-codex',
      partialize: (s) => ({ favorites: s.favorites, compareList: s.compareList, sort: s.sort }),
    }
  )
)

// Filter / sort pipeline
export function applyPipeline(
  data: Derivative[],
  query: string,
  filters: LibraryState['filters'],
  sort: SortKey,
): Derivative[] {
  const q = query.trim().toLowerCase()
  let out = data
  if (q) {
    out = out.filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.originalTitle?.toLowerCase().includes(q) ?? false) ||
      d.ip.toLowerCase().includes(q) ||
      d.ipKey.toLowerCase().includes(q) ||
      d.creator.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      (d.cast?.some(c => c.toLowerCase().includes(q)) ?? false)
    )
  }
  if (filters.types.length) out = out.filter(d => filters.types.includes(d.type))
  if (filters.regions.length) out = out.filter(d => filters.regions.includes(d.region))
  if (filters.status.length) out = out.filter(d => filters.status.includes(d.status))
  out = out.filter(d => d.year >= filters.yearMin && d.year <= filters.yearMax)
  out = out.filter(d => d.rating >= filters.ratingMin)

  switch (sort) {
    case 'year-desc': out = [...out].sort((a, b) => b.year - a.year); break
    case 'year-asc': out = [...out].sort((a, b) => a.year - b.year); break
    case 'rating-desc': out = [...out].sort((a, b) => b.rating - a.rating); break
    case 'popularity-desc': out = [...out].sort((a, b) => b.popularity - a.popularity); break
  }
  return out
}
