import { create } from 'zustand'
import { EXHIBITS, type ExhibitId } from '@/lib/exhibits'

interface StellarisState {
  active: ExhibitId
  setActive: (id: ExhibitId) => void
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  count: number
  setCount: (n: number) => void
  muted: boolean
  toggleMuted: () => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  mobileMode: boolean
  setMobileMode: (b: boolean) => void
  quality: 'low' | 'high'
  setQuality: (q: 'low' | 'high') => void
  visited: Set<ExhibitId>
  markVisited: (id: ExhibitId) => void
}

const initialId: ExhibitId = 'overture'

export const useStellaris = create<StellarisState>((set, get) => ({
  active: initialId,
  setActive: (id) => {
    set({ active: id })
    get().markVisited(id)
    set({ count: get().count + Math.floor(Math.random() * 12) + 1 })
  },
  next: () => {
    const i = EXHIBITS.findIndex((e) => e.id === get().active)
    const next = EXHIBITS[(i + 1) % EXHIBITS.length]
    set({ active: next.id })
    get().markVisited(next.id)
  },
  prev: () => {
    const i = EXHIBITS.findIndex((e) => e.id === get().active)
    const prev = EXHIBITS[(i - 1 + EXHIBITS.length) % EXHIBITS.length]
    set({ active: prev.id })
    get().markVisited(prev.id)
  },
  goTo: (index) => {
    const target = EXHIBITS[index]
    if (target) {
      set({ active: target.id })
      get().markVisited(target.id)
    }
  },
  count: 0,
  setCount: (n) => set({ count: n }),
  muted: false,
  toggleMuted: () => set({ muted: !get().muted }),
  isFullscreen: false,
  toggleFullscreen: () => {
    const fs = !get().isFullscreen
    if (fs) document.documentElement.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
    set({ isFullscreen: fs })
  },
  mobileMode: false,
  setMobileMode: (b) => set({ mobileMode: b }),
  quality: 'high',
  setQuality: (q) => set({ quality: q }),
  visited: new Set<ExhibitId>([initialId]),
  markVisited: (id) => {
    const s = new Set(get().visited)
    s.add(id)
    set({ visited: s })
  },
}))
