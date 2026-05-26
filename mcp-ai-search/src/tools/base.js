export class BaseTool {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this._cache = new Map();
    this._history = [];
  }

  getDefinition() {
    throw new Error('getDefinition() must be implemented');
  }

  async execute(args) {
    throw new Error('execute() must be implemented');
  }

  getCache() {
    return Object.fromEntries(this._cache);
  }

  getHistory() {
    return this._history;
  }

  _addToHistory(query, result) {
    this._history.push({
      tool: this.name,
      query,
      timestamp: new Date().toISOString(),
      resultCount: Array.isArray(result) ? result.length : 1,
    });
    if (this._history.length > 100) {
      this._history = this._history.slice(-100);
    }
  }

  _setCache(key, value) {
    this._cache.set(key, { value, timestamp: Date.now() });
    if (this._cache.size > 50) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
  }

  _getCache(key) {
    const cached = this._cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > 300000) {
      this._cache.delete(key);
      return null;
    }
    return cached.value;
  }
}
