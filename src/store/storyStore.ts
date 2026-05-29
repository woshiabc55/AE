import { create } from 'zustand'

type SectionId = 'intro' | 'ancient' | 'modern' | 'resonance' | 'epilogue'

interface StoryState {
  currentSection: SectionId
  scrollY: number
  ancientNodeIndex: number
  modernNodeIndex: number
  crackProgress: number
  shardProgress: number
  setSection: (section: SectionId) => void
  setScrollY: (y: number) => void
  setAncientNodeIndex: (index: number) => void
  setModernNodeIndex: (index: number) => void
  setCrackProgress: (progress: number) => void
  setShardProgress: (progress: number) => void
}

export const useStoryStore = create<StoryState>((set) => ({
  currentSection: 'intro',
  scrollY: 0,
  ancientNodeIndex: -1,
  modernNodeIndex: -1,
  crackProgress: 0,
  shardProgress: 0,
  setSection: (section) => set({ currentSection: section }),
  setScrollY: (y) => set({ scrollY: y }),
  setAncientNodeIndex: (index) => set({ ancientNodeIndex: index }),
  setModernNodeIndex: (index) => set({ modernNodeIndex: index }),
  setCrackProgress: (progress) => set({ crackProgress: progress }),
  setShardProgress: (progress) => set({ shardProgress: progress }),
}))
