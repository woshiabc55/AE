import { BaseTool } from './base.js';
import fs from 'fs/promises';
import path from 'path';

export class FileSearchTool extends BaseTool {
  constructor() {
    super('file_search', 'Search for files by name, type, size, or metadata in local filesystem');
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'Filename pattern to search for (supports wildcards)',
          },
          directory: {
            type: 'string',
            description: 'Root directory to search in',
            default: '.',
          },
          type: {
            type: 'string',
            enum: ['file', 'directory', 'any'],
            description: 'Type of entry to search for',
            default: 'any',
          },
          min_size: {
            type: 'number',
            description: 'Minimum file size in bytes',
          },
          max_size: {
            type: 'number',
            description: 'Maximum file size in bytes',
          },
          modified_after: {
            type: 'string',
            description: 'ISO date string - find files modified after this date',
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results (default: 50)',
            default: 50,
          },
        },
        required: ['filename'],
      },
    };
  }

  async execute(args) {
    const {
      filename,
      directory = '.',
      type = 'any',
      min_size,
      max_size,
      modified_after,
      max_results = 50,
    } = args;

    const cacheKey = `file:${filename}:${directory}:${type}`;
    const cached = this._getCache(cacheKey);
    if (cached) {
      this._addToHistory(filename, cached);
      return cached;
    }

    const results = await this._searchFiles(filename, directory, type, min_size, max_size, modified_after, max_results);
    this._setCache(cacheKey, results);
    this._addToHistory(filename, results);

    return results;
  }

  async _searchFiles(filename, directory, type, minSize, maxSize, modifiedAfter, maxResults) {
    const results = [];
    const absDir = path.resolve(directory);
    const pattern = this._globToRegex(filename);

    await this._walkFiles(absDir, pattern, type, minSize, maxSize, modifiedAfter, results, maxResults, 0);

    return {
      pattern: filename,
      directory: absDir,
      totalMatches: results.length,
      results,
    };
  }

  async _walkFiles(dir, pattern, type, minSize, maxSize, modifiedAfter, results, maxResults, depth) {
    if (depth > 15 || results.length >= maxResults) return;

    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'target', 'vendor', '.cache']);

    for (const entry of entries) {
      if (results.length >= maxResults) break;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (pattern.test(entry.name) && (type === 'directory' || type === 'any')) {
          results.push({
            path: fullPath,
            name: entry.name,
            type: 'directory',
          });
        }
        if (!skipDirs.has(entry.name)) {
          await this._walkFiles(fullPath, pattern, type, minSize, maxSize, modifiedAfter, results, maxResults, depth + 1);
        }
      } else if (entry.isFile()) {
        if (type === 'directory') continue;
        if (!pattern.test(entry.name)) continue;

        try {
          const stat = await fs.stat(fullPath);

          if (minSize && stat.size < minSize) continue;
          if (maxSize && stat.size > maxSize) continue;
          if (modifiedAfter && stat.mtime < new Date(modifiedAfter)) continue;

          results.push({
            path: fullPath,
            name: entry.name,
            type: 'file',
            size: stat.size,
            sizeFormatted: this._formatSize(stat.size),
            modified: stat.mtime.toISOString(),
            extension: path.extname(entry.name),
          });
        } catch {
          continue;
        }
      }
    }
  }

  _globToRegex(pattern) {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(escaped, 'i');
  }

  _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}
