import { BaseTool } from './base.js';
import fs from 'fs/promises';
import path from 'path';

export class CodeSearchTool extends BaseTool {
  constructor() {
    super('code_search', 'Search code in local repositories and files using pattern matching and semantic analysis');
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Search pattern (regex supported)',
          },
          directory: {
            type: 'string',
            description: 'Directory to search in (default: current working directory)',
            default: '.',
          },
          file_pattern: {
            type: 'string',
            description: 'File glob pattern to filter (e.g., "*.js", "*.py")',
            default: '*',
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results (default: 20)',
            default: 20,
          },
          context_lines: {
            type: 'number',
            description: 'Number of context lines around matches (default: 3)',
            default: 3,
          },
        },
        required: ['pattern'],
      },
    };
  }

  async execute(args) {
    const {
      pattern,
      directory = '.',
      file_pattern = '*',
      max_results = 20,
      context_lines = 3,
    } = args;

    const cacheKey = `code:${pattern}:${directory}:${file_pattern}`;
    const cached = this._getCache(cacheKey);
    if (cached) {
      this._addToHistory(pattern, cached);
      return cached;
    }

    const results = await this._searchCode(pattern, directory, file_pattern, max_results, context_lines);
    this._setCache(cacheKey, results);
    this._addToHistory(pattern, results);

    return results;
  }

  async _searchCode(pattern, directory, filePattern, maxResults, contextLines) {
    const results = [];
    let regex;
    try {
      regex = new RegExp(pattern, 'gi');
    } catch (e) {
      return { error: `Invalid regex pattern: ${e.message}` };
    }

    const absDir = path.resolve(directory);

    try {
      await this._walkDir(absDir, regex, filePattern, results, maxResults, contextLines, 0);
    } catch (error) {
      return { error: `Search failed: ${error.message}`, results: [] };
    }

    return {
      pattern,
      directory: absDir,
      totalMatches: results.length,
      results: results.slice(0, maxResults),
    };
  }

  async _walkDir(dir, regex, filePattern, results, maxResults, contextLines, depth) {
    if (depth > 10 || results.length >= maxResults) return;

    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'target', 'vendor']);

    for (const entry of entries) {
      if (results.length >= maxResults) break;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) {
          await this._walkDir(fullPath, regex, filePattern, results, maxResults, contextLines, depth + 1);
        }
      } else if (entry.isFile()) {
        if (!this._matchesFilePattern(entry.name, filePattern)) continue;

        try {
          const stat = await fs.stat(fullPath);
          if (stat.size > 1024 * 1024) continue;

          const content = await fs.readFile(fullPath, 'utf-8');
          const lines = content.split('\n');

          for (let i = 0; i < lines.length && results.length < maxResults; i++) {
            if (regex.test(lines[i])) {
              const start = Math.max(0, i - contextLines);
              const end = Math.min(lines.length, i + contextLines + 1);
              results.push({
                file: fullPath,
                line: i + 1,
                match: lines[i].trim(),
                context: lines.slice(start, end).map((l, idx) => ({
                  line: start + idx + 1,
                  content: l,
                  isMatch: start + idx === i,
                })),
              });
              regex.lastIndex = 0;
            }
          }
        } catch {
          continue;
        }
      }
    }
  }

  _matchesFilePattern(filename, pattern) {
    if (pattern === '*') return true;
    const ext = pattern.replace('*.', '');
    return filename.endsWith('.' + ext);
  }
}
