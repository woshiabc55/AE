import { templates } from '@/mock/templates';
import type { Template } from '@/types';

const delay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const templatesApi = {
  list: async (): Promise<Template[]> => delay(templates),
  byId: async (id: string): Promise<Template | undefined> => delay(templates.find((t) => t.id === id)),
  byCategory: async (category: string): Promise<Template[]> =>
    delay(templates.filter((t) => t.category === category)),
  featured: async (n = 6): Promise<Template[]> =>
    delay([...templates].sort((a, b) => b.usageCount - a.usageCount).slice(0, n)),
  search: async (q: string): Promise<Template[]> => {
    if (!q.trim()) return delay(templates);
    const lower = q.toLowerCase();
    return delay(
      templates.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lower))
      )
    );
  },
};
