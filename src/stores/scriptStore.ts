import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Script, Scene, Variable } from '@/types';
import { sampleScripts } from '@/mock/scripts';
import { generateId } from '@/utils/format';

interface ScriptState {
  scripts: Script[];
  drafts: Record<string, Script>; // 编辑中的草稿
  createFromTemplate: (templateId: string, templateTitle: string, scenes: Scene[], variables: Variable[]) => string;
  createBlank: () => string;
  getScript: (id: string) => Script | undefined;
  updateScript: (id: string, patch: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  duplicateScript: (id: string) => string;
  togglePublic: (id: string) => void;

  saveDraft: (draft: Script) => void;
  getDraft: (id: string) => Script | undefined;
  deleteDraft: (id: string) => void;
}

export const useScriptStore = create<ScriptState>()(
  persist(
    (set, get) => ({
      scripts: sampleScripts,
      drafts: {},
      createFromTemplate: (templateId, templateTitle, scenes, variables) => {
        const id = generateId('script');
        const now = new Date().toISOString();
        const defaults: Record<string, string> = {};
        variables.forEach((v) => {
          defaults[v.key] = v.defaultValue;
        });
        const newScript: Script = {
          id,
          title: `未命名 · ${templateTitle}`,
          templateId,
          variables: defaults,
          scenes: scenes.map((s) => ({ ...s })),
          tags: ['草稿'],
          isPublic: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ scripts: [newScript, ...state.scripts] }));
        return id;
      },
      createBlank: () => {
        const id = generateId('script');
        const now = new Date().toISOString();
        const newScript: Script = {
          id,
          title: '空白剧本',
          variables: {},
          scenes: [
            {
              id: generateId('scene'),
              order: 1,
              title: '开场',
              type: 'opening',
              prompt: '在这里写下你的开场提示词，使用 {{变量名}} 插入占位符。',
              duration: 0,
            },
          ],
          tags: ['草稿'],
          isPublic: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ scripts: [newScript, ...state.scripts] }));
        return id;
      },
      getScript: (id) => get().scripts.find((s) => s.id === id),
      updateScript: (id, patch) => {
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },
      deleteScript: (id) => {
        set((state) => ({
          scripts: state.scripts.filter((s) => s.id !== id),
          drafts: Object.fromEntries(
            Object.entries(state.drafts).filter(([k]) => k !== id)
          ),
        }));
      },
      duplicateScript: (id) => {
        const src = get().scripts.find((s) => s.id === id);
        if (!src) return '';
        const newId = generateId('script');
        const now = new Date().toISOString();
        const copy: Script = {
          ...src,
          id: newId,
          title: `${src.title} · 副本`,
          isPublic: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ scripts: [copy, ...state.scripts] }));
        return newId;
      },
      togglePublic: (id) => {
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === id ? { ...s, isPublic: !s.isPublic, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },
      saveDraft: (draft) => {
        set((state) => ({ drafts: { ...state.drafts, [draft.id]: draft } }));
      },
      getDraft: (id) => get().drafts[id],
      deleteDraft: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.drafts;
          return { drafts: rest };
        });
      },
    }),
    {
      name: 'promptstage-scripts',
    }
  )
);
