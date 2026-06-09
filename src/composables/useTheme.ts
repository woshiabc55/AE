import { ref, watch } from 'vue'

export type ThemeName = 'light' | 'dark' | 'cream'
const STORAGE_KEY = 'ai-toolverse:theme-v1'

const theme = ref<ThemeName>('light')

function applyTheme(t: ThemeName) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = t
}

function load() {
  if (typeof window === 'undefined') return
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null
    if (stored === 'light' || stored === 'dark' || stored === 'cream') {
      theme.value = stored
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  } catch (e) {
    // 静默
  }
  applyTheme(theme.value)
}

watch(theme, (v) => {
  applyTheme(v)
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, v)
    } catch (e) {
      // 静默
    }
  }
})

export function useTheme() {
  if (typeof window !== 'undefined' && !document.documentElement.dataset.theme) {
    load()
  }

  function setTheme(t: ThemeName) {
    theme.value = t
  }

  function next() {
    const order: ThemeName[] = ['light', 'dark', 'cream']
    const idx = order.indexOf(theme.value)
    theme.value = order[(idx + 1) % order.length]
  }

  return {
    theme,
    setTheme,
    next
  }
}
