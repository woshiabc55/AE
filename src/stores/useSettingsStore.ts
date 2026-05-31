import { create } from 'zustand'
import type { SystemSettings } from '@/types'
import { WALLPAPERS } from '@/utils/apps'

interface SettingsStore {
  settings: SystemSettings
  updateSettings: (partial: Partial<SystemSettings>) => void
}

const savedSettings = (() => {
  try {
    const raw = localStorage.getItem('conceptos-settings')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: savedSettings || {
    theme: 'dark',
    wallpaper: WALLPAPERS[0],
    scale: 100,
    volume: 75,
    brightness: 100,
    doNotDisturb: false,
  },

  updateSettings: (partial: Partial<SystemSettings>) => {
    set((state) => {
      const newSettings = { ...state.settings, ...partial }
      try {
        localStorage.setItem('conceptos-settings', JSON.stringify(newSettings))
      } catch {}
      return { settings: newSettings }
    })
  },
}))
