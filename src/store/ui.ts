import { create } from 'zustand'

type UIState = {
  activeSection: string
  setActiveSection: (id: string) => void

  navCondensed: boolean
  setNavCondensed: (v: boolean) => void

  // 路由驱动的案例详情 slug
  openCaseSlug: string | null
  openCase: (slug: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'hero',
  setActiveSection: (id) => set({ activeSection: id }),

  navCondensed: false,
  setNavCondensed: (v) => set({ navCondensed: v }),

  openCaseSlug: null,
  openCase: (slug) => set({ openCaseSlug: slug }),
}))
