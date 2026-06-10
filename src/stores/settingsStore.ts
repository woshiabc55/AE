import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  setTheme: (t: 'dark' | 'light') => void;
  setFontSize: (s: 'sm' | 'md' | 'lg') => void;
  setAutoSaveInterval: (n: number) => void;
  setDefaultModel: (m: AppSettings['defaultModel']) => void;
  setApiKey: (k: string) => void;
  setEditorMode: (m: 'split' | 'preview' | 'edit') => void;
}

const defaults: AppSettings = {
  theme: 'dark',
  fontSize: 'md',
  autoSaveInterval: 3,
  defaultModel: 'gpt-4',
  apiKey: '',
  editorMode: 'split',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
      setDefaultModel: (defaultModel) => set({ defaultModel }),
      setApiKey: (apiKey) => set({ apiKey }),
      setEditorMode: (editorMode) => set({ editorMode }),
    }),
    {
      name: 'promptstage-settings',
    }
  )
);
