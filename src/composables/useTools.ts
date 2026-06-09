import { ref, computed, watch } from 'vue'
import type { ToolCategory } from '@/data/categories'
import { TOOLS } from '@/data/tools'
import type { AITool } from '@/data/tools'

const STORAGE_KEY = 'ai-toolverse:state-v1'

interface PersistState {
  category: ToolCategory
  search: string
  favorites: string[]
}

const state = ref<PersistState>({
  category: 'all',
  search: '',
  favorites: []
})

let initialized = false

function loadFromStorage() {
  if (initialized) return
  initialized = true
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as PersistState
    if (parsed.category) state.value.category = parsed.category
    if (typeof parsed.search === 'string') state.value.search = parsed.search
    if (Array.isArray(parsed.favorites)) state.value.favorites = parsed.favorites
  } catch (e) {
    // 静默失败
  }
}

watch(
  state,
  (val) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch (e) {
      // 静默失败
    }
  },
  { deep: true }
)

export function useTools() {
  loadFromStorage()

  const category = computed({
    get: () => state.value.category,
    set: (v: ToolCategory) => (state.value.category = v)
  })

  const search = computed({
    get: () => state.value.search,
    set: (v: string) => (state.value.search = v)
  })

  const favorites = computed(() => state.value.favorites)

  const visibleTools = computed<AITool[]>(() => {
    const cat = category.value
    const q = search.value.trim().toLowerCase()
    return TOOLS.filter((tool) => {
      const catOk = cat === 'all' || tool.category === cat
      if (!catOk) return false
      if (!q) return true
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q)) ||
        (tool.vendor || '').toLowerCase().includes(q)
      )
    })
  })

  function setCategory(c: ToolCategory) {
    category.value = c
  }

  function setSearch(s: string) {
    search.value = s
  }

  function toggleFavorite(id: string) {
    const set = new Set(state.value.favorites)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    state.value.favorites = Array.from(set)
  }

  function isFavorite(id: string) {
    return state.value.favorites.includes(id)
  }

  function getToolById(id: string) {
    return TOOLS.find((t) => t.id === id)
  }

  const favoriteTools = computed<AITool[]>(() => {
    return TOOLS.filter((t) => state.value.favorites.includes(t.id))
  })

  return {
    category,
    search,
    favorites,
    visibleTools,
    favoriteTools,
    setCategory,
    setSearch,
    toggleFavorite,
    isFavorite,
    getToolById
  }
}
