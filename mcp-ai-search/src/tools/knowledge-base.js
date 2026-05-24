import { BaseTool } from './base.js';
import fs from 'fs/promises';
import path from 'path';

export class KnowledgeBaseTool extends BaseTool {
  constructor() {
    super('knowledge_base', 'Manage and search a local knowledge base with tagging and categorization');
    this.kbPath = null;
    this.entries = [];
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['search', 'add', 'list', 'delete', 'update', 'export'],
            description: 'Action to perform on the knowledge base',
          },
          query: {
            type: 'string',
            description: 'Search query (for search action)',
          },
          title: {
            type: 'string',
            description: 'Entry title (for add/update actions)',
          },
          content: {
            type: 'string',
            description: 'Entry content (for add/update actions)',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags for the entry',
          },
          category: {
            type: 'string',
            description: 'Category for the entry',
          },
          entry_id: {
            type: 'string',
            description: 'Entry ID (for delete/update actions)',
          },
          storage_path: {
            type: 'string',
            description: 'Path to store the knowledge base JSON file',
            default: './knowledge-base.json',
          },
          max_results: {
            type: 'number',
            description: 'Maximum search results (default: 10)',
            default: 10,
          },
        },
        required: ['action'],
      },
    };
  }

  async execute(args) {
    const { action, storage_path = './knowledge-base.json' } = args;
    this.kbPath = path.resolve(storage_path);
    await this._loadKB();

    switch (action) {
      case 'search': return this._search(args);
      case 'add': return this._add(args);
      case 'list': return this._list(args);
      case 'delete': return this._delete(args);
      case 'update': return this._update(args);
      case 'export': return this._export(args);
      default: return { error: `Unknown action: ${action}` };
    }
  }

  _search(args) {
    const { query, tags, category, max_results = 10 } = args;
    if (!query && !tags && !category) {
      return { error: 'At least one of query, tags, or category is required for search' };
    }

    let results = [...this.entries];

    if (query) {
      const queryLower = query.toLowerCase();
      const terms = queryLower.split(/\s+/);
      results = results.filter(entry => {
        const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')} ${entry.category}`.toLowerCase();
        return terms.some(t => text.includes(t));
      });

      results.sort((a, b) => {
        const scoreA = this._relevanceScore(a, terms);
        const scoreB = this._relevanceScore(b, terms);
        return scoreB - scoreA;
      });
    }

    if (tags && tags.length > 0) {
      results = results.filter(entry =>
        tags.some(tag => entry.tags.includes(tag))
      );
    }

    if (category) {
      results = results.filter(entry =>
        entry.category.toLowerCase() === category.toLowerCase()
      );
    }

    this._addToHistory(query || JSON.stringify({ tags, category }), results.slice(0, max_results));

    return {
      action: 'search',
      query: { text: query, tags, category },
      totalMatches: results.length,
      results: results.slice(0, max_results).map(e => ({
        id: e.id,
        title: e.title,
        content: e.content.slice(0, 300),
        tags: e.tags,
        category: e.category,
        created: e.created,
      })),
    };
  }

  async _add(args) {
    const { title, content, tags = [], category = 'general' } = args;
    if (!title || !content) {
      return { error: 'Title and content are required for add action' };
    }

    const entry = {
      id: `kb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      content,
      tags,
      category,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    this.entries.push(entry);
    await this._saveKB();

    return { action: 'add', success: true, entry: { id: entry.id, title: entry.title } };
  }

  _list(args) {
    const { category, tags } = args;
    let results = [...this.entries];

    if (category) {
      results = results.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (tags && tags.length > 0) {
      results = results.filter(e => tags.some(t => e.tags.includes(t)));
    }

    return {
      action: 'list',
      total: results.length,
      entries: results.map(e => ({
        id: e.id,
        title: e.title,
        tags: e.tags,
        category: e.category,
        created: e.created,
      })),
    };
  }

  async _delete(args) {
    const { entry_id } = args;
    if (!entry_id) return { error: 'entry_id is required for delete action' };

    const index = this.entries.findIndex(e => e.id === entry_id);
    if (index === -1) return { error: `Entry ${entry_id} not found` };

    const removed = this.entries.splice(index, 1)[0];
    await this._saveKB();

    return { action: 'delete', success: true, removed: { id: removed.id, title: removed.title } };
  }

  async _update(args) {
    const { entry_id, title, content, tags, category } = args;
    if (!entry_id) return { error: 'entry_id is required for update action' };

    const entry = this.entries.find(e => e.id === entry_id);
    if (!entry) return { error: `Entry ${entry_id} not found` };

    if (title) entry.title = title;
    if (content) entry.content = content;
    if (tags) entry.tags = tags;
    if (category) entry.category = category;
    entry.updated = new Date().toISOString();

    await this._saveKB();

    return { action: 'update', success: true, entry: { id: entry.id, title: entry.title } };
  }

  _export(args) {
    return {
      action: 'export',
      totalEntries: this.entries.length,
      categories: [...new Set(this.entries.map(e => e.category))],
      allTags: [...new Set(this.entries.flatMap(e => e.tags))],
      entries: this.entries,
    };
  }

  _relevanceScore(entry, terms) {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const contentLower = entry.content.toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10;
      if (contentLower.includes(term)) score += 2;
      if (entry.tags.some(t => t.toLowerCase().includes(term))) score += 5;
      if (entry.category.toLowerCase().includes(term)) score += 3;
    }

    return score;
  }

  async _loadKB() {
    try {
      const data = await fs.readFile(this.kbPath, 'utf-8');
      this.entries = JSON.parse(data);
    } catch {
      this.entries = [];
    }
  }

  async _saveKB() {
    try {
      await fs.writeFile(this.kbPath, JSON.stringify(this.entries, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save knowledge base:', error.message);
    }
  }
}
