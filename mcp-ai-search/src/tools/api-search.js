import { BaseTool } from './base.js';
import https from 'https';
import http from 'http';

export class ApiSearchTool extends BaseTool {
  constructor() {
    super('api_search', 'Search and test API endpoints with configurable providers');
    this.providers = {
      github: { baseUrl: 'https://api.github.com', headers: { 'User-Agent': 'mcp-ai-search' } },
      npm: { baseUrl: 'https://registry.npmjs.org', headers: {} },
      pypi: { baseUrl: 'https://pypi.org/pypi', headers: {} },
    };
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            enum: ['github', 'npm', 'pypi', 'custom'],
            description: 'API provider to search',
          },
          query: {
            type: 'string',
            description: 'Search query',
          },
          endpoint: {
            type: 'string',
            description: 'Custom API endpoint URL (for provider=custom)',
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST'],
            description: 'HTTP method',
            default: 'GET',
          },
          headers: {
            type: 'object',
            description: 'Custom HTTP headers',
          },
          params: {
            type: 'object',
            description: 'Query parameters or request body',
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results (default: 10)',
            default: 10,
          },
        },
        required: ['provider', 'query'],
      },
    };
  }

  async execute(args) {
    const { provider, query, endpoint, method = 'GET', headers = {}, params = {}, max_results = 10 } = args;

    const cacheKey = `api:${provider}:${query}:${JSON.stringify(params)}`;
    const cached = this._getCache(cacheKey);
    if (cached) {
      this._addToHistory(query, cached);
      return cached;
    }

    let results;
    switch (provider) {
      case 'github':
        results = await this._searchGitHub(query, max_results, headers);
        break;
      case 'npm':
        results = await this._searchNpm(query, max_results);
        break;
      case 'pypi':
        results = await this._searchPyPI(query, max_results);
        break;
      case 'custom':
        results = await this._searchCustom(endpoint, method, headers, params);
        break;
      default:
        results = { error: `Unknown provider: ${provider}` };
    }

    this._setCache(cacheKey, results);
    this._addToHistory(query, results);

    return results;
  }

  async _searchGitHub(query, maxResults, customHeaders) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${maxResults}`;
    try {
      const data = await this._httpGet(url, { ...this.providers.github.headers, ...customHeaders });
      return {
        provider: 'github',
        query,
        total: data.total_count,
        results: (data.items || []).map(repo => ({
          name: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          updated: repo.updated_at,
        })),
      };
    } catch (error) {
      return { provider: 'github', query, error: error.message };
    }
  }

  async _searchNpm(query, maxResults) {
    const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${maxResults}`;
    try {
      const data = await this._httpGet(url);
      return {
        provider: 'npm',
        query,
        total: data.total,
        results: (data.objects || []).map(pkg => ({
          name: pkg.package.name,
          description: pkg.package.description,
          version: pkg.package.version,
          url: pkg.package.links?.npm,
          author: pkg.package.author?.name,
        })),
      };
    } catch (error) {
      return { provider: 'npm', query, error: error.message };
    }
  }

  async _searchPyPI(query, maxResults) {
    const url = `https://pypi.org/search/?q=${encodeURIComponent(query)}`;
    return {
      provider: 'pypi',
      query,
      url,
      suggestion: 'PyPI search requires HTML parsing. Use the JSON API for specific packages: pypi.org/pypi/{package_name}/json',
    };
  }

  async _searchCustom(endpoint, method, headers, params) {
    if (!endpoint) {
      return { error: 'Custom endpoint URL is required when provider=custom' };
    }

    try {
      let url = endpoint;
      if (method === 'GET' && params) {
        const qs = new URLSearchParams(params).toString();
        url += (url.includes('?') ? '&' : '?') + qs;
      }

      const data = await this._httpGet(url, headers);
      return { provider: 'custom', endpoint, data };
    } catch (error) {
      return { provider: 'custom', endpoint, error: error.message };
    }
  }

  _httpGet(url, headers = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, { headers }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({ raw: data.slice(0, 5000) });
          }
        });
      }).on('error', reject);
    });
  }
}
