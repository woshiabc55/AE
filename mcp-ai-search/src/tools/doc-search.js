import { BaseTool } from './base.js';
import fs from 'fs/promises';
import path from 'path';

export class DocSearchTool extends BaseTool {
  constructor() {
    super('doc_search', 'Search documentation files (Markdown, HTML, text) with semantic understanding');
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for documentation',
          },
          directory: {
            type: 'string',
            description: 'Directory containing documentation files',
            default: '.',
          },
          doc_types: {
            type: 'array',
            items: { type: 'string' },
            description: 'Document file extensions to search (default: [".md", ".txt", ".html"])',
            default: ['.md', '.txt', '.html'],
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results (default: 15)',
            default: 15,
          },
        },
        required: ['query'],
      },
    };
  }

  async execute(args) {
    const { query, directory = '.', doc_types = ['.md', '.txt', '.html'], max_results = 15 } = args;

    const cacheKey = `doc:${query}:${directory}:${doc_types.join(',')}`;
    const cached = this._getCache(cacheKey);
    if (cached) {
      this._addToHistory(query, cached);
      return cached;
    }

    const results = await this._searchDocs(query, directory, doc_types, max_results);
    this._setCache(cacheKey, results);
    this._addToHistory(query, results);

    return results;
  }

  async _searchDocs(query, directory, docTypes, maxResults) {
    const results = [];
    const absDir = path.resolve(directory);
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/);

    await this._walkDocs(absDir, docTypes, queryTerms, results, maxResults, 0);

    results.sort((a, b) => b.score - a.score);

    return {
      query,
      directory: absDir,
      totalMatches: results.length,
      results: results.slice(0, maxResults),
    };
  }

  async _walkDocs(dir, docTypes, queryTerms, results, maxResults, depth) {
    if (depth > 8 || results.length >= maxResults * 2) return;

    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '.docusaurus']);

    for (const entry of entries) {
      if (results.length >= maxResults * 2) break;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) {
          await this._walkDocs(fullPath, docTypes, queryTerms, results, maxResults, depth + 1);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!docTypes.includes(ext)) continue;

        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const score = this._calculateRelevance(content, queryTerms);

          if (score > 0) {
            const sections = this._extractSections(content, queryTerms);
            results.push({
              file: fullPath,
              title: this._extractTitle(content) || entry.name,
              score,
              matchingSections: sections.slice(0, 3),
              snippet: this._extractSnippet(content, queryTerms),
            });
          }
        } catch {
          continue;
        }
      }
    }
  }

  _calculateRelevance(content, queryTerms) {
    const lower = content.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      const regex = new RegExp(term, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    const title = this._extractTitle(content);
    if (title) {
      const titleLower = title.toLowerCase();
      for (const term of queryTerms) {
        if (titleLower.includes(term)) score += 5;
      }
    }

    return score;
  }

  _extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  _extractSections(content, queryTerms) {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { heading: 'Introduction', lines: [] };

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (currentSection.lines.length > 0) {
          const text = currentSection.lines.join(' ').toLowerCase();
          const hasMatch = queryTerms.some(t => text.includes(t));
          if (hasMatch) {
            sections.push({
              heading: currentSection.heading,
              content: currentSection.lines.join('\n').slice(0, 500),
            });
          }
        }
        currentSection = { heading: headingMatch[2], lines: [] };
      } else {
        currentSection.lines.push(line);
      }
    }

    return sections;
  }

  _extractSnippet(content, queryTerms) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (queryTerms.some(t => lower.includes(t))) {
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 3);
        return lines.slice(start, end).join('\n');
      }
    }
    return content.slice(0, 200) + '...';
  }
}
