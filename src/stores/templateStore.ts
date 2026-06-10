import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  PromptTemplate,
  PromptSection,
  PromptVariable,
  TemplateVersion,
} from '../lib/types'
import { SEED_TEMPLATES } from '../lib/seed'
import { mergeVariables } from '../lib/variableParser'

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3)

function emptyTemplate(authorId: string, authorName: string): PromptTemplate {
  const now = Date.now()
  return {
    id: uid(),
    title: '未命名模板',
    description: '',
    category: 'short_drama',
    tags: [],
    visibility: 'private',
    author: { id: authorId, name: authorName },
    sections: [
      { id: uid(), key: 'premise', title: '前置设定', body: '', collapsed: false },
      { id: uid(), key: 'character', title: '角色档案', body: '', collapsed: false },
      { id: uid(), key: 'scene', title: '场景描述', body: '', collapsed: false },
      { id: uid(), key: 'camera', title: '镜头语言', body: '', collapsed: false },
      { id: uid(), key: 'tone', title: '风格基调', body: '', collapsed: false },
      { id: uid(), key: 'output', title: '输出约束', body: '', collapsed: false },
    ],
    variables: [],
    versions: [],
    createdAt: now,
    updatedAt: now,
    cloneCount: 0,
    rating: 0,
  }
}

interface TemplateState {
  templates: PromptTemplate[]
  hydrated: boolean
  setHydrated: (v: boolean) => void
  getById: (id: string) => PromptTemplate | undefined
  createBlank: (authorId: string, authorName: string) => PromptTemplate
  update: (id: string, patch: Partial<PromptTemplate>) => void
  updateSection: (
    id: string,
    sectionId: string,
    patch: Partial<PromptSection>,
  ) => void
  updateVariable: (
    id: string,
    key: string,
    patch: Partial<PromptVariable>,
  ) => void
  syncVariables: (id: string) => void
  addVersion: (id: string, label: string) => void
  clone: (id: string, authorId: string, authorName: string) => PromptTemplate
  publish: (id: string) => void
  setVisibility: (id: string, v: PromptTemplate['visibility']) => void
  remove: (id: string) => void
  resetSeed: () => void
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: SEED_TEMPLATES,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      getById: (id) => get().templates.find((t) => t.id === id),
      createBlank: (authorId, authorName) => {
        const t = emptyTemplate(authorId, authorName)
        set((s) => ({ templates: [t, ...s.templates] }))
        return t
      },
      update: (id, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t,
          ),
        })),
      updateSection: (id, sectionId, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  updatedAt: Date.now(),
                  sections: t.sections.map((sec) =>
                    sec.id === sectionId ? { ...sec, ...patch } : sec,
                  ),
                }
              : t,
          ),
        })),
      updateVariable: (id, key, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  updatedAt: Date.now(),
                  variables: t.variables.map((v) =>
                    v.key === key ? { ...v, ...patch } : v,
                  ),
                }
              : t,
          ),
        })),
      syncVariables: (id) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  variables: mergeVariables(t.sections, t.variables),
                }
              : t,
          ),
        })),
      addVersion: (id, label) =>
        set((s) => ({
          templates: s.templates.map((t) => {
            if (t.id !== id) return t
            const v: TemplateVersion = {
              id: uid(),
              label: label || `v${t.versions.length + 1}`,
              body: t.sections.map((sec) => ({ ...sec })),
              createdAt: Date.now(),
            }
            return { ...t, versions: [v, ...t.versions] }
          }),
        })),
      clone: (id, authorId, authorName) => {
        const src = get().templates.find((t) => t.id === id)
        if (!src) throw new Error('Template not found')
        const copy: PromptTemplate = {
          ...src,
          id: uid(),
          title: `${src.title} · 副本`,
          visibility: 'private',
          author: { id: authorId, name: authorName },
          versions: [],
          cloneCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          sections: src.sections.map((s) => ({ ...s, id: uid() })),
        }
        set((s) => ({ templates: [copy, ...s.templates] }))
        // 同步对原模板的克隆数 +1
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, cloneCount: t.cloneCount + 1 } : t,
          ),
        }))
        return copy
      },
      publish: (id) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, visibility: 'public' } : t,
          ),
        })),
      setVisibility: (id, v) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, visibility: v } : t,
          ),
        })),
      remove: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      resetSeed: () => set({ templates: SEED_TEMPLATES }),
    }),
    {
      name: 'muse:templates',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
