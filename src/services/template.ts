// 模板服务 v2 - 基于 IndexedDB
// 兼容旧的 localStorage 数据（一次性迁移）
import type { Template, TemplateFilter, TemplateInput, Folder, Example } from '../types';
import { SEED_TEMPLATES, FOLDERS_SEED } from '../data/templates.seed';
import { sleep, uid } from '../lib/utils';
import { db, STORES, isDBAvailable, lsFallback } from './db';
import { AuthService } from './auth';

let migrated = false;

async function ensureMigrated() {
  if (migrated) return;
  migrated = true;
  // 把种子模板（如果还没在 DB 中）写入
  const ok = await isDBAvailable();
  if (!ok) return;
  for (const t of SEED_TEMPLATES) {
    const existing = await db.get(STORES.templates, t.id);
    if (!existing) {
      await db.put(STORES.templates, t);
    }
  }
  // 把默认文件夹也写入
  for (const f of FOLDERS_SEED) {
    const existing = await db.get(STORES.folders, f.id);
    if (!existing) {
      await db.put(STORES.folders, f);
    }
  }
  // 从旧 localStorage 迁移
  const oldTemplates = lsFallback.get<Template[]>('templates_v1');
  if (oldTemplates) {
    for (const t of oldTemplates) await db.put(STORES.templates, t);
    lsFallback.delete('templates_v1');
  }
  const oldFolders = lsFallback.get<Folder[]>('folders_v1');
  if (oldFolders) {
    for (const f of oldFolders) await db.put(STORES.folders, f);
    lsFallback.delete('folders_v1');
  }
  const oldFavs = lsFallback.get<string[]>('favorites_v1');
  if (oldFavs) {
    for (const tid of oldFavs) {
      await db.put(STORES.favorites, {
        id: `fav_${uid('x')}`,
        userId: AuthService.current()?.id ?? 'u_demo',
        templateId: tid,
        createdAt: new Date().toISOString(),
      });
    }
    lsFallback.delete('favorites_v1');
  }
  // 软删除列表
  const deleted = lsFallback.get<string[]>('deleted_v1');
  if (deleted) {
    await db.put(STORES.meta, { key: 'deleted', value: deleted });
    lsFallback.delete('deleted_v1');
  }
}

class TemplateServiceImpl {
  async list(filter?: TemplateFilter): Promise<Template[]> {
    await ensureMigrated();
    await sleep(60);
    const ok = await isDBAvailable();
    let all: Template[];
    if (!ok) {
      const deleted = new Set((lsFallback.get<string[]>('deleted') ?? []));
      all = [...SEED_TEMPLATES, ...(lsFallback.get<Template[]>('templates') ?? [])].filter((t) => !deleted.has(t.id));
    } else {
      const deleted = new Set(((await db.get<{ value: string[] }>(STORES.meta, 'deleted'))?.value) ?? []);
      const dbList = await db.getAll<Template>(STORES.templates);
      all = [...SEED_TEMPLATES.filter((t) => !dbList.find((d) => d.id === t.id)), ...dbList].filter((t) => !deleted.has(t.id));
    }
    let result = all;
    if (filter?.category && filter.category !== 'all') {
      result = result.filter((t) => t.category === filter.category);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (filter?.tags?.length) {
      result = result.filter((t) => filter.tags!.some((tag) => t.tags.includes(tag)));
    }
    if (filter?.variableCount) {
      const [min, max] = filter.variableCount;
      result = result.filter((t) => t.variables.length >= min && t.variables.length <= max);
    }
    switch (filter?.sort) {
      case 'popular':
        result = [...result].sort((a, b) => b.stats.uses - a.stats.uses);
        break;
      case 'favorites':
        result = [...result].sort((a, b) => b.stats.favorites - a.stats.favorites);
        break;
      default:
        result = [...result].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    }
    return result;
  }

  async get(id: string): Promise<Template | null> {
    await ensureMigrated();
    await sleep(40);
    const ok = await isDBAvailable();
    if (!ok) {
      const deleted = new Set((lsFallback.get<string[]>('deleted') ?? []));
      if (deleted.has(id)) return null;
      return SEED_TEMPLATES.find((t) => t.id === id) ?? (lsFallback.get<Template[]>('templates') ?? []).find((t) => t.id === id) ?? null;
    }
    const deleted = new Set(((await db.get<{ value: string[] }>(STORES.meta, 'deleted'))?.value) ?? []);
    if (deleted.has(id)) return null;
    const t = await db.get<Template>(STORES.templates, id);
    if (t) return t;
    return SEED_TEMPLATES.find((s) => s.id === id) ?? null;
  }

  async create(input: TemplateInput, authorId: string, authorName: string): Promise<Template> {
    await ensureMigrated();
    await sleep(120);
    const now = new Date().toISOString();
    const t: Template = {
      id: uid('t'),
      title: input.title,
      description: input.description,
      category: input.category,
      tags: input.tags,
      author: { id: authorId, name: authorName },
      cover: uid('cv'),
      body: input.body,
      variables: input.variables,
      examples: input.examples ?? [],
      versions: [{ id: uid('v'), createdAt: now, snapshot: input.body }],
      stats: { uses: 0, favorites: 0 },
      isPublic: input.isPublic ?? false,
      folderId: input.folderId,
      createdAt: now,
      updatedAt: now,
    };
    await this.persist(t);
    return t;
  }

  async update(id: string, patch: Partial<TemplateInput> & { body?: string }, note?: string): Promise<Template> {
    await ensureMigrated();
    await sleep(120);
    const existing = await this.get(id);
    if (!existing) throw new Error('Template not found');
    if (existing.id.startsWith('t_') && existing.id.length < 12) {
      // 编辑种子：自动 fork
      const forked: Template = {
        ...existing,
        id: uid('t'),
        title: existing.title + ' · 我的改编',
        author: { id: AuthService.current()?.id ?? 'u_demo', name: AuthService.current()?.name ?? '我' },
        isPublic: false,
        stats: { uses: 0, favorites: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [{ id: uid('v'), createdAt: new Date().toISOString(), snapshot: patch.body ?? existing.body, note: '改编自种子' }],
      };
      const merged: Template = { ...forked, ...patch, updatedAt: new Date().toISOString() };
      if (patch.body && patch.body !== existing.body) {
        merged.versions = [...merged.versions, { id: uid('v'), createdAt: new Date().toISOString(), snapshot: patch.body, note }];
      }
      await this.persist(merged);
      return merged;
    }
    const merged: Template = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    if (patch.body && patch.body !== existing.body) {
      merged.versions = [...existing.versions, { id: uid('v'), createdAt: new Date().toISOString(), snapshot: patch.body, note }];
    }
    await this.persist(merged);
    return merged;
  }

  private async persist(t: Template) {
    const ok = await isDBAvailable();
    if (!ok) {
      const list = lsFallback.get<Template[]>('templates') ?? [];
      const idx = list.findIndex((x) => x.id === t.id);
      if (idx === -1) list.push(t); else list[idx] = t;
      lsFallback.set('templates', list);
    } else {
      await db.put(STORES.templates, t);
    }
  }

  async remove(id: string): Promise<void> {
    await sleep(80);
    const ok = await isDBAvailable();
    if (!ok) {
      const deleted = new Set(lsFallback.get<string[]>('deleted') ?? []);
      deleted.add(id);
      lsFallback.set('deleted', [...deleted]);
      const list = (lsFallback.get<Template[]>('templates') ?? []).filter((t) => t.id !== id);
      lsFallback.set('templates', list);
    } else {
      const meta = await db.get<{ value: string[] }>(STORES.meta, 'deleted');
      const list = meta?.value ?? [];
      if (!list.includes(id)) list.push(id);
      await db.put(STORES.meta, { key: 'deleted', value: list });
      try { await db.delete(STORES.templates, id); } catch { /* ignore */ }
    }
  }

  async fork(id: string, authorId: string, authorName: string): Promise<Template> {
    const src = await this.get(id);
    if (!src) throw new Error('Source template not found');
    return this.create(
      {
        title: src.title + ' · 副本',
        description: src.description,
        category: src.category,
        tags: src.tags,
        body: src.body,
        variables: src.variables,
        examples: src.examples,
        isPublic: false,
      },
      authorId,
      authorName
    );
  }

  async addExample(templateId: string, example: Example): Promise<void> {
    await sleep(60);
    const existing = await this.get(templateId);
    if (!existing) return;
    const updated: Template = {
      ...existing,
      examples: [...existing.examples, example],
      updatedAt: new Date().toISOString(),
    };
    await this.persist(updated);
  }

  async listFolders(userId: string): Promise<Folder[]> {
    await ensureMigrated();
    await sleep(20);
    const ok = await isDBAvailable();
    if (!ok) {
      const all = [...FOLDERS_SEED.filter((f) => f.userId === 'u_demo'), ...(lsFallback.get<Folder[]>('folders') ?? []).filter((f) => f.userId === userId)];
      return all;
    }
    const all = await db.getAll<Folder>(STORES.folders);
    return [...FOLDERS_SEED.filter((f) => f.userId === 'u_demo'), ...all.filter((f) => f.userId === userId)];
  }

  async createFolder(name: string, userId: string, parentId: string | null = 'f_default'): Promise<Folder> {
    const f: Folder = {
      id: uid('f'),
      name,
      parentId,
      userId,
      createdAt: new Date().toISOString(),
    };
    const ok = await isDBAvailable();
    if (!ok) {
      const list = lsFallback.get<Folder[]>('folders') ?? [];
      list.push(f);
      lsFallback.set('folders', list);
    } else {
      await db.put(STORES.folders, f);
    }
    return f;
  }

  async toggleFavorite(templateId: string): Promise<boolean> {
    const userId = AuthService.current()?.id ?? 'u_demo';
    const ok = await isDBAvailable();
    if (!ok) {
      const list = lsFallback.get<{ templateId: string; userId: string }[]>('favorites') ?? [];
      const idx = list.findIndex((x) => x.templateId === templateId && x.userId === userId);
      if (idx === -1) list.push({ templateId, userId }); else list.splice(idx, 1);
      lsFallback.set('favorites', list);
      return idx === -1;
    }
    const existing = await db.getByIndex<{ id: string; templateId: string }>(STORES.favorites, 'templateId', templateId);
    if (existing) {
      await db.delete(STORES.favorites, existing.id);
      return false;
    }
    await db.put(STORES.favorites, {
      id: uid('fav'),
      userId,
      templateId,
      createdAt: new Date().toISOString(),
    });
    return true;
  }

  async listFavorites(): Promise<string[]> {
    const userId = AuthService.current()?.id ?? 'u_demo';
    const ok = await isDBAvailable();
    if (!ok) {
      return (lsFallback.get<{ templateId: string; userId: string }[]>('favorites') ?? [])
        .filter((x) => x.userId === userId)
        .map((x) => x.templateId);
    }
    const list = await db.getAllByIndex<{ templateId: string; userId: string }>(STORES.favorites, 'userId', userId);
    return list.map((x) => x.templateId);
  }

  isFavorited(templateId: string): boolean {
    // 同步访问时直接读 store，避免阻塞
    try {
      const state = (window as any).__psStore;
      if (state?.favorites) return state.favorites.has(templateId);
    } catch { /* ignore */ }
    return false;
  }

  async syncToCloud(_template: Template): Promise<void> {
    await sleep(400);
  }

  // 草稿
  async saveDraft(scope: 'workshop' | 'editor', key: string, value: unknown): Promise<void> {
    const store = scope === 'workshop' ? STORES.drafts : STORES.editors;
    const ok = await isDBAvailable();
    const lsKey = scope === 'workshop' ? `draft_${key}` : `editor_${key}`;
    if (!ok) {
      lsFallback.set(lsKey, value);
      return;
    }
    await db.put(store, { key, value, updatedAt: new Date().toISOString() });
  }

  async loadDraft<T>(scope: 'workshop' | 'editor', key: string): Promise<T | null> {
    const store = scope === 'workshop' ? STORES.drafts : STORES.editors;
    const ok = await isDBAvailable();
    const lsKey = scope === 'workshop' ? `draft_${key}` : `editor_${key}`;
    if (!ok) {
      return (lsFallback.get<T>(lsKey) ?? null);
    }
    const rec = await db.get<{ key: string; value: T }>(store, key);
    return rec?.value ?? null;
  }
}

export const TemplateService = new TemplateServiceImpl();
