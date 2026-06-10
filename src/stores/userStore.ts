import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Author, StageRun } from '../lib/types'

interface UserState {
  author: Author
  onboarded: boolean
  theme: 'screening-room'
  quota: { used: number; total: number }
  setName: (name: string) => void
  setOnboarded: (v: boolean) => void
  incrementQuota: (by?: number) => void
}

const defaultAuthor: Author = {
  id: 'u-self',
  name: '幕启主理人',
  bio: 'AI 剧本工坊 · 创作者',
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      author: defaultAuthor,
      onboarded: false,
      theme: 'screening-room',
      quota: { used: 23, total: 200 },
      setName: (name) =>
        set((s) => ({ author: { ...s.author, name } })),
      setOnboarded: (v) => set({ onboarded: v }),
      incrementQuota: (by = 1) =>
        set((s) => ({ quota: { ...s.quota, used: s.quota.used + by } })),
    }),
    {
      name: 'muse:user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

interface RunsState {
  runs: StageRun[]
  addRun: (run: StageRun) => void
  clear: () => void
}

export const useRunsStore = create<RunsState>()(
  persist(
    (set) => ({
      runs: [],
      addRun: (run) => set((s) => ({ runs: [run, ...s.runs].slice(0, 30) })),
      clear: () => set({ runs: [] }),
    }),
    {
      name: 'muse:runs',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
