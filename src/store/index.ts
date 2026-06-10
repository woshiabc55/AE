import { create } from "zustand";
import { db } from "@/db";
import { SEED_TEMPLATES } from "@/data/seed";
import type { TemplateRecord, FavoriteRecord, AppSettings } from "@/types";

interface AppState {
  templates: TemplateRecord[];
  favorites: FavoriteRecord[];
  settings: AppSettings;
  loaded: boolean;
  loadAll: () => Promise<void>;
  upsertTemplate: (tpl: TemplateRecord) => Promise<void>;
  removeTemplate: (id: string) => Promise<void>;
  incrementUsage: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  saveSettings: (s: Partial<AppSettings>) => void;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
  resetSeed: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  llmBaseUrl: "https://api.openai.com/v1",
  llmApiKey: "",
  llmModel: "gpt-4o-mini",
  temperature: 0.85,
  topP: 0.95,
  maxTokens: 2000,
  theme: "dark",
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem("lumiere.settings");
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as AppSettings) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  templates: [],
  favorites: [],
  settings: loadSettings(),
  loaded: false,

  async loadAll() {
    if (get().loaded) return;
    let tpls = await db.templates.toArray();
    if (tpls.length === 0) {
      await db.templates.bulkPut(SEED_TEMPLATES);
      tpls = SEED_TEMPLATES;
    }
    const favs = await db.favorites.toArray();
    set({ templates: tpls, favorites: favs, loaded: true });
  },

  async upsertTemplate(tpl) {
    await db.templates.put(tpl);
    const existing = get().templates;
    const idx = existing.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) {
      const next = [...existing];
      next[idx] = tpl;
      set({ templates: next });
    } else {
      set({ templates: [tpl, ...existing] });
    }
  },

  async removeTemplate(id) {
    await db.templates.delete(id);
    set({ templates: get().templates.filter((t) => t.id !== id) });
  },

  async incrementUsage(id) {
    const t = get().templates.find((x) => x.id === id);
    if (!t) return;
    const next: TemplateRecord = { ...t, usageCount: t.usageCount + 1 };
    await db.templates.put(next);
    set({
      templates: get().templates.map((x) => (x.id === id ? next : x)),
    });
  },

  async toggleFavorite(id) {
    const exists = get().favorites.find((f) => f.templateId === id);
    if (exists) {
      await db.favorites.delete(exists.id);
      set({ favorites: get().favorites.filter((f) => f.id !== exists.id) });
    } else {
      const rec: FavoriteRecord = {
        id: "fav_" + id + "_" + Date.now(),
        templateId: id,
        createdAt: Date.now(),
      };
      await db.favorites.put(rec);
      set({ favorites: [rec, ...get().favorites] });
    }
  },

  isFavorite(id) {
    return get().favorites.some((f) => f.templateId === id);
  },

  saveSettings(s) {
    const next = { ...get().settings, ...s };
    localStorage.setItem("lumiere.settings", JSON.stringify(next));
    set({ settings: next });
  },

  async exportData() {
    const [templates, favorites, versions, callLogs] = await Promise.all([
      db.templates.toArray(),
      db.favorites.toArray(),
      db.versions.toArray(),
      db.callLogs.toArray(),
    ]);
    return JSON.stringify(
      { templates, favorites, versions, callLogs, exportedAt: Date.now() },
      null,
      2
    );
  },

  async importData(json) {
    const data = JSON.parse(json);
    if (Array.isArray(data.templates))
      await db.templates.bulkPut(data.templates);
    if (Array.isArray(data.favorites))
      await db.favorites.bulkPut(data.favorites);
    if (Array.isArray(data.versions)) await db.versions.bulkPut(data.versions);
    if (Array.isArray(data.callLogs)) await db.callLogs.bulkPut(data.callLogs);
    await get().loadAll();
  },

  async resetSeed() {
    await Promise.all([
      db.templates.clear(),
      db.versions.clear(),
      db.callLogs.clear(),
      db.favorites.clear(),
    ]);
    set({ loaded: false, templates: [], favorites: [] });
    await get().loadAll();
  },
}));
