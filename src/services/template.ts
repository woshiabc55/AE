// 模板服务 - 内存 + localStorage
import type { Template, TemplateFilter, TemplateInput, Folder, Example } from '../types';
import { SEED_TEMPLATES, FOLDERS_SEED } from '../data/templates.seed';
import { sleep, uid } from '../lib/utils';

const LS_TEMPLATES = 'ps_templates_v1';
const LS_FOLDERS = 'ps_folders_v1';
const LS_FAVORITES = 'ps_favorites_v1';
const LS_DELETED = 'ps_deleted_v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

class TemplateServiceImpl {
  private getAllTemplates(): Template[] {
    return load<Template[]>(LS_TEMPLATES, []);
  }
  private setAllTemplates(list: Template[]) {
    save(LS_TEMPLATES, list);
  }

  async list(filter?: TemplateFilter): Promise<Template[]> {
    await sleep(60);
    const deleted = new Set(load<string[]>(LS_DELETED, []));
    const base = SEED_TEMPLATES.concat(this.getAllTemplates()).filter((t) => !deleted.has(t.id));
    let result = base;
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
    await sleep(40);
    const deleted = new Set(load<string[]>(LS_DELETED, []));
    if (deleted.has(id)) return null;
    if (id.startsWith('t_') && id.length < 12) {
      return SEED_TEMPLATES.find((t) => t.id === id) ?? null;
    }
    return this.getAllTemplates().find((t) => t.id === id) ?? null;
  }

  async create(input: TemplateInput, authorId: string, authorName: string): Promise<Template> {
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
    const list = this.getAllTemplates();
    list.push(t);
    this.setAllTemplates(list);
    return t;
  }

  async update(id: string, patch: Partial<TemplateInput> & { body?: string }, note?: string): Promise<Template> {
    await sleep(120);
    const list = this.getAllTemplates();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Template not found in user library');
    const old = list[idx];
    const next: Template = {
      ...old,
      ...patch,
      variables: patch.variables ?? old.variables,
      tags: patch.tags ?? old.tags,
      versions: patch.body && patch.body !== old.body
        ? [...old.versions, { id: uid('v'), createdAt: new Date().toISOString(), snapshot: patch.body, note }]
        : old.versions,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = next;
    this.setAllTemplates(list);
    return next;
  }

  async remove(id: string): Promise<void> {
    await sleep(80);
    const list = this.getAllTemplates();
    this.setAllTemplates(list.filter((t) => t.id !== id));
    const deleted = new Set(load<string[]>(LS_DELETED, []));
    deleted.add(id);
    save(LS_DELETED, [...deleted]);
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
    const list = this.getAllTemplates();
    const idx = list.findIndex((t) => t.id === templateId);
    if (idx === -1) return;
    list[idx].examples = [...list[idx].examples, example];
    list[idx].updatedAt = new Date().toISOString();
    this.setAllTemplates(list);
  }

  // Folders
  async listFolders(userId: string): Promise<Folder[]> {
    await sleep(20);
    const custom = load<Folder[]>(LS_FOLDERS, []);
    return [...FOLDERS_SEED.filter((f) => f.userId === 'u_demo'), ...custom.filter((f) => f.userId === userId)];
  }

  async createFolder(name: string, userId: string, parentId: string | null = 'f_default'): Promise<Folder> {
    const custom = load<Folder[]>(LS_FOLDERS, []);
    const f: Folder = {
      id: uid('f'),
      name,
      parentId,
      userId,
      createdAt: new Date().toISOString(),
    };
    custom.push(f);
    save(LS_FOLDERS, custom);
    return f;
  }

  // Favorites
  async toggleFavorite(templateId: string): Promise<boolean> {
    const set = new Set(load<string[]>(LS_FAVORITES, []));
    let on: boolean;
    if (set.has(templateId)) {
      set.delete(templateId);
      on = false;
    } else {
      set.add(templateId);
      on = true;
    }
    save(LS_FAVORITES, [...set]);
    return on;
  }

  isFavorited(templateId: string): boolean {
    return load<string[]>(LS_FAVORITES, []).includes(templateId);
  }

  // 模拟云同步
  async syncToCloud(_template: Template): Promise<void> {
    await sleep(400);
  }
}

export const TemplateService = new TemplateServiceImpl();
