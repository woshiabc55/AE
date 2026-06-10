// localStorage 命名空间封装
const PREFIX = 'muse:'

export function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota or serialization issue - ignore */
  }
}

export function remove(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(PREFIX + key)
}

export const STORAGE_KEYS = {
  templates: 'templates',
  user: 'user',
  runs: 'runs',
  onboarded: 'onboarded',
} as const
