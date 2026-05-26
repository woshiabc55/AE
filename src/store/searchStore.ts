import { create } from 'zustand'
import type { SearchResult, Platform } from '@/types'

interface SearchState {
  keyword: string
  platforms: Platform[]
  isSearching: boolean
  result: SearchResult | null
  demoResult: SearchResult | null
  filterPlatform: Platform | 'all'
  setKeyword: (keyword: string) => void
  setPlatforms: (platforms: Platform[]) => void
  togglePlatform: (platform: Platform) => void
  setIsSearching: (isSearching: boolean) => void
  setResult: (result: SearchResult | null) => void
  setDemoResult: (result: SearchResult) => void
  setFilterPlatform: (platform: Platform | 'all') => void
  search: () => Promise<void>
  loadDemo: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keyword: '',
  platforms: ['jd', 'tb', 'pdd'] as Platform[],
  isSearching: false,
  result: null,
  demoResult: null,
  filterPlatform: 'all',

  setKeyword: (keyword) => set({ keyword }),
  setPlatforms: (platforms) => set({ platforms }),
  togglePlatform: (platform) => {
    const { platforms } = get()
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        set({ platforms: platforms.filter((p) => p !== platform) })
      }
    } else {
      set({ platforms: [...platforms, platform] })
    }
  },
  setIsSearching: (isSearching) => set({ isSearching }),
  setResult: (result) => set({ result }),
  setDemoResult: (demoResult) => set({ demoResult }),
  setFilterPlatform: (filterPlatform) => set({ filterPlatform }),

  search: async () => {
    const { keyword, platforms } = get()
    if (!keyword.trim()) return

    set({ isSearching: true, result: null })
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), platforms }),
      })
      const data = await res.json()
      if (data.success) {
        set({ result: data.result, filterPlatform: 'all' })
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      set({ isSearching: false })
    }
  },

  loadDemo: async () => {
    try {
      const res = await fetch('/api/search/demo')
      const data = await res.json()
      if (data.success) {
        set({ demoResult: data.result })
      }
    } catch (error) {
      console.error('Load demo failed:', error)
    }
  },
}))
