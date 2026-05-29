import { create } from 'zustand'
import type { CharacterId, Expression, SceneId, BgmId, GameState, DialogueLine } from '@/engine/types'

interface GameStore extends GameState {
  setLine: (id: string) => void
  setVar: (key: string, value: string | number | boolean) => void
  pushHistory: (character: CharacterId | undefined, text: string) => void
  setTyping: (typing: boolean) => void
  setMenu: (show: boolean) => void
  setHistory: (show: boolean) => void
  setScene: (scene: SceneId) => void
  setBgm: (bgm: BgmId | null) => void
  showCharacter: (id: CharacterId) => void
  hideCharacter: (id: CharacterId) => void
  setExpression: (id: CharacterId, expr: Expression) => void
  setChapter: (chapter: string) => void
  reset: () => void
  applyLine: (line: DialogueLine) => void
}

const initialState: GameState = {
  currentLineId: 'start',
  variables: {},
  history: [],
  chapter: 'intro',
  isTyping: false,
  showMenu: false,
  showHistory: false,
  currentScene: 'kiln_night',
  currentBgm: null,
  visibleCharacters: [],
  currentExpression: {} as Record<CharacterId, Expression>,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setLine: (id) => set({ currentLineId: id }),
  setVar: (key, value) =>
    set((s) => ({ variables: { ...s.variables, [key]: value } })),
  pushHistory: (character, text) =>
    set((s) => ({ history: [...s.history, { character, text }] })),
  setTyping: (typing) => set({ isTyping: typing }),
  setMenu: (show) => set({ showMenu: show }),
  setHistory: (show) => set({ showHistory: show }),
  setScene: (scene) => set({ currentScene: scene }),
  setBgm: (bgm) => set({ currentBgm: bgm }),
  showCharacter: (id) =>
    set((s) => ({
      visibleCharacters: s.visibleCharacters.includes(id)
        ? s.visibleCharacters
        : [...s.visibleCharacters, id],
    })),
  hideCharacter: (id) =>
    set((s) => ({
      visibleCharacters: s.visibleCharacters.filter((c) => c !== id),
    })),
  setExpression: (id, expr) =>
    set((s) => ({
      currentExpression: { ...s.currentExpression, [id]: expr },
    })),
  setChapter: (chapter) => set({ chapter }),
  reset: () => set(initialState),

  applyLine: (line) => {
    const updates: Partial<GameState> = {}
    if (line.scene) updates.currentScene = line.scene
    if (line.bgm) updates.currentBgm = line.bgm
    if (line.showCharacters) {
      const current = get().visibleCharacters
      const toAdd = line.showCharacters.filter((id) => !current.includes(id))
      if (toAdd.length > 0) {
        updates.visibleCharacters = [...current, ...toAdd]
      }
    }
    if (line.hideCharacters) {
      updates.visibleCharacters = get().visibleCharacters.filter(
        (c) => !line.hideCharacters!.includes(c)
      )
    }
    if (line.expression && line.character) {
      updates.currentExpression = {
        ...get().currentExpression,
        [line.character]: line.expression,
      }
    }
    if (line.chapter) updates.chapter = line.chapter
    if (line.setVar) {
      updates.variables = { ...get().variables, [line.setVar.key]: line.setVar.value }
    }
    set(updates)
  },
}))
