import { create } from "zustand";
import { db, safePut } from "@/db";
import { SEED_TEMPLATES } from "@/data/seed";
import type {
  TemplateRecord,
  FavoriteRecord,
  AppSettings,
  CommentRecord,
  RatingRecord,
  VersionRecord,
} from "@/types";
import { nanoid } from "nanoid";

interface AppState {
  templates: TemplateRecord[];
  favorites: FavoriteRecord[];
  settings: AppSettings;
  loaded: boolean;
  // 派生
  loadAll: () => Promise<void>;
  // 模板
  upsertTemplate: (tpl: TemplateRecord, opts?: { snapshot?: boolean; changelog?: string }) => Promise<void>;
  removeTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<TemplateRecord | null>;
  incrementUsage: (id: string) => Promise<void>;
  publishTemplate: (id: string) => Promise<void>;
  unpublishTemplate: (id: string) => Promise<void>;
  // 收藏
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  // 评论与评分
  addComment: (templateId: string, body: string, fieldKey?: string) => Promise<void>;
  removeComment: (id: string) => Promise<void>;
  rateTemplate: (templateId: string, stars: number, body?: string) => Promise<void>;
  // 版本
  listVersions: (templateId: string) => Promise<VersionRecord[]>;
  rollbackToVersion: (versionId: string) => Promise<void>;
  // 设置
  saveSettings: (s: Partial<AppSettings>) => void;
  addCustomProvider: (label: string, baseUrl: string, model: string) => void;
  removeCustomProvider: (idx: number) => void;
  // 数据
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
  retryCount: 2,
  retryDelay: 1200,
  customProviders: [],
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem("lumiere.settings");
    if (!raw) return DEFAULT_SETTINGS;
    return {
      ...DEFAULT_SETTINGS,
      ...(JSON.parse(raw) as AppSettings),
    };
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

  async upsertTemplate(tpl, opts) {
    const next: TemplateRecord = {
      ...tpl,
      updatedAt: Date.now(),
    };
    await safePut(db.templates, next);
    if (opts?.snapshot) {
      const existing = await db.versions
        .where("templateId")
        .equals(next.id)
        .reverse()
        .sortBy("versionNo");
      const versionNo = (existing[0]?.versionNo ?? 0) + 1;
      const ver: VersionRecord = {
        id: "v_" + nanoid(8),
        templateId: next.id,
        versionNo,
        snapshot: (() => {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = next;
          return rest;
        })(),
        changelog: opts.changelog ?? "manual save",
        createdAt: Date.now(),
      };
      await safePut(db.versions, ver);
      next.version = versionNo;
      await safePut(db.templates, next);
    }
    const existing = get().templates;
    const idx = existing.findIndex((t) => t.id === next.id);
    if (idx >= 0) {
      const arr = [...existing];
      arr[idx] = next;
      set({ templates: arr });
    } else {
      set({ templates: [next, ...existing] });
    }
  },

  async removeTemplate(id) {
    await db.templates.delete(id);
    set({ templates: get().templates.filter((t) => t.id !== id) });
  },

  async duplicateTemplate(id) {
    const t = get().templates.find((x) => x.id === id);
    if (!t) return null;
    const copy: TemplateRecord = {
      ...t,
      id: "tpl_" + nanoid(8),
      title: t.title + " · 副本",
      slug: t.slug + "-copy-" + nanoid(4),
      authorId: "me",
      authorName: "You",
      isPublic: 0,
      usageCount: 0,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await safePut(db.templates, copy);
    set({ templates: [copy, ...get().templates] });
    return copy;
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

  async publishTemplate(id) {
    const t = get().templates.find((x) => x.id === id);
    if (!t) return;
    const next: TemplateRecord = { ...t, isPublic: 1, updatedAt: Date.now() };
    await safePut(db.templates, next);
    set({ templates: get().templates.map((x) => (x.id === id ? next : x)) });
  },

  async unpublishTemplate(id) {
    const t = get().templates.find((x) => x.id === id);
    if (!t) return;
    const next: TemplateRecord = { ...t, isPublic: 0, updatedAt: Date.now() };
    await safePut(db.templates, next);
    set({ templates: get().templates.map((x) => (x.id === id ? next : x)) });
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

  async addComment(templateId, body, fieldKey) {
    const c: CommentRecord = {
      id: "cm_" + nanoid(8),
      templateId,
      fieldKey,
      author: "You",
      body,
      createdAt: Date.now(),
    };
    await safePut(db.comments, c);
  },

  async removeComment(id) {
    await db.comments.delete(id);
  },

  async rateTemplate(templateId, stars, body) {
    const r: RatingRecord = {
      id: "rt_" + nanoid(8),
      templateId,
      stars: Math.min(5, Math.max(1, stars)),
      reviewer: "You",
      body,
      createdAt: Date.now(),
    };
    await safePut(db.ratings, r);
  },

  async listVersions(templateId) {
    return db.versions
      .where("templateId")
      .equals(templateId)
      .reverse()
      .sortBy("versionNo");
  },

  async rollbackToVersion(versionId) {
    const v = await db.versions.get(versionId);
    if (!v) return;
    const t = get().templates.find((x) => x.id === v.templateId);
    if (!t) return;
    const next: TemplateRecord = {
      ...t,
      ...v.snapshot,
      id: t.id,
      version: t.version + 1,
      updatedAt: Date.now(),
    };
    await safePut(db.templates, next);
    set({ templates: get().templates.map((x) => (x.id === t.id ? next : x)) });
    // 记录一个新版本
    const ver: VersionRecord = {
      id: "v_" + nanoid(8),
      templateId: next.id,
      versionNo: next.version,
      snapshot: (() => {
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = next;
        return rest;
      })(),
      changelog: "rollback to v" + v.versionNo,
      createdAt: Date.now(),
    };
    await safePut(db.versions, ver);
  },

  saveSettings(s) {
    const next = { ...get().settings, ...s };
    localStorage.setItem("lumiere.settings", JSON.stringify(next));
    set({ settings: next });
  },

  addCustomProvider(label, baseUrl, model) {
    const next = {
      ...get().settings,
      customProviders: [
        ...get().settings.customProviders,
        { label, baseUrl, model },
      ],
    };
    localStorage.setItem("lumiere.settings", JSON.stringify(next));
    set({ settings: next });
  },

  removeCustomProvider(idx) {
    const list = [...get().settings.customProviders];
    list.splice(idx, 1);
    const next = { ...get().settings, customProviders: list };
    localStorage.setItem("lumiere.settings", JSON.stringify(next));
    set({ settings: next });
  },

  async exportData() {
    const [templates, favorites, versions, callLogs, comments, ratings] = await Promise.all([
      db.templates.toArray(),
      db.favorites.toArray(),
      db.versions.toArray(),
      db.callLogs.toArray(),
      db.comments.toArray(),
      db.ratings.toArray(),
    ]);
    return JSON.stringify(
      {
        templates,
        favorites,
        versions,
        callLogs,
        comments,
        ratings,
        exportedAt: Date.now(),
      },
      null,
      2
    );
  },

  async importData(json) {
    let data: any;
    try {
      data = JSON.parse(json);
    } catch (e) {
      throw new Error("JSON 解析失败：" + (e as Error).message);
    }
    // 顶层结构校验
    if (typeof data !== "object" || data === null) {
      throw new Error("数据格式非法：根必须是对象");
    }
    if (Array.isArray(data.templates)) {
      // 过滤掉非法模板
      const safe: TemplateRecord[] = [];
      for (const t of data.templates) {
        if (t && typeof t === "object" && typeof t.id === "string" && typeof t.title === "string") {
          safe.push(t as TemplateRecord);
        }
      }
      await db.templates.bulkPut(safe);
    }
    if (Array.isArray(data.favorites)) await db.favorites.bulkPut(data.favorites);
    if (Array.isArray(data.versions)) await db.versions.bulkPut(data.versions);
    if (Array.isArray(data.callLogs)) await db.callLogs.bulkPut(data.callLogs);
    if (Array.isArray(data.comments)) await db.comments.bulkPut(data.comments);
    if (Array.isArray(data.ratings)) await db.ratings.bulkPut(data.ratings);
    set({ loaded: false });
    await get().loadAll();
  },

  async resetSeed() {
    await Promise.all([
      db.templates.clear(),
      db.versions.clear(),
      db.callLogs.clear(),
      db.favorites.clear(),
      db.comments.clear(),
      db.ratings.clear(),
    ]);
    set({ loaded: false, templates: [], favorites: [] });
    await get().loadAll();
  },
}));
