import { create } from 'zustand'
import type { WindowState } from '@/types'
import { APP_DEFINITIONS } from '@/utils/apps'

interface WindowStore {
  windows: WindowState[]
  activeWindowId: string | null
  nextZIndex: number
  openWindow: (appId: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMinimize: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
  resizeWindow: (id: string, size: { width: number; height: number }) => void
}

let windowCounter = 0

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (appId: string) => {
    const appDef = APP_DEFINITIONS.find((a) => a.id === appId)
    if (!appDef) return

    windowCounter++
    const id = `win-${windowCounter}`
    const offset = (windowCounter % 8) * 30
    const newWindow: WindowState = {
      id,
      appId,
      title: appDef.name,
      icon: appDef.icon,
      position: { x: 100 + offset, y: 60 + offset },
      size: { ...appDef.defaultSize },
      isMinimized: false,
      isMaximized: false,
      zIndex: get().nextZIndex,
    }

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  closeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }))
  },

  minimizeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }))
  },

  toggleMinimize: (id: string) => {
    const win = get().windows.find((w) => w.id === id)
    if (!win) return

    if (win.isMinimized) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
        ),
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      }))
    } else if (get().activeWindowId === id) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isMinimized: true } : w
        ),
        activeWindowId: null,
      }))
    } else {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: state.nextZIndex } : w
        ),
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      }))
    }
  },

  maximizeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }))
  },

  focusWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  moveWindow: (id: string, position: { x: number; y: number }) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }))
  },

  resizeWindow: (id: string, size: { width: number; height: number }) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    }))
  },
}))
