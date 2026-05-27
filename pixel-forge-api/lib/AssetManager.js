const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AssetManager {
  constructor(baseDir) {
    this.baseDir = path.resolve(baseDir);
    this.cache = new Map();
    this.watchers = new Map();
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  _resolve(relPath) {
    const resolved = path.resolve(this.baseDir, relPath);
    if (!resolved.startsWith(this.baseDir)) return null;
    return resolved;
  }

  _ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  list(relDir = '') {
    const target = this._resolve(relDir);
    if (!target || !fs.existsSync(target)) return [];
    return fs.readdirSync(target, { withFileTypes: true })
      .filter(e => !e.name.startsWith('.'))
      .map(e => {
        const fullPath = path.join(target, e.name);
        const stat = e.isDirectory() ? null : fs.statSync(fullPath);
        return {
          name: e.name,
          path: relDir ? `${relDir}/${e.name}` : e.name,
          type: e.isDirectory() ? 'directory' : 'file',
          size: stat ? stat.size : 0,
          modified: stat ? stat.mtime.toISOString() : '',
          hash: stat ? this._hash(fullPath) : ''
        };
      });
  }

  tree(relDir = '') {
    const target = this._resolve(relDir);
    if (!target || !fs.existsSync(target)) return [];
    return fs.readdirSync(target, { withFileTypes: true })
      .filter(e => !e.name.startsWith('.'))
      .sort((a, b) => {
        if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map(e => {
        const childPath = relDir ? `${relDir}/${e.name}` : e.name;
        if (e.isDirectory()) {
          return { name: e.name, path: childPath, type: 'directory', children: this.tree(childPath) };
        }
        const stat = fs.statSync(path.join(target, e.name));
        return {
          name: e.name, path: childPath, type: 'file',
          size: stat.size, modified: stat.mtime.toISOString(),
          hash: this._hash(path.join(target, e.name))
        };
      });
  }

  read(relPath) {
    const target = this._resolve(relPath);
    if (!target || !fs.existsSync(target)) return null;
    const ext = path.extname(target).toLowerCase();
    const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.glb', '.gltf'];
    if (imgExts.includes(ext)) {
      const data = fs.readFileSync(target);
      const mime = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
      return { type: 'binary', mime, base64: `data:${mime};base64,${data.toString('base64')}`, size: data.length };
    }
    const content = fs.readFileSync(target, 'utf-8');
    const stat = fs.statSync(target);
    return { type: 'text', content, size: stat.size, modified: stat.mtime.toISOString(), hash: this._hash(target) };
  }

  write(relPath, content) {
    const target = this._resolve(relPath);
    if (!target) return { ok: false, error: 'invalid path' };
    this._ensureDir(target);
    fs.writeFileSync(target, content, 'utf-8');
    this.cache.delete(relPath);
    return { ok: true, path: relPath, size: content.length, hash: this._hash(target) };
  }

  writeBinary(relPath, buffer) {
    const target = this._resolve(relPath);
    if (!target) return { ok: false, error: 'invalid path' };
    this._ensureDir(target);
    fs.writeFileSync(target, buffer);
    return { ok: true, path: relPath, size: buffer.length };
  }

  mkdir(relPath) {
    const target = this._resolve(relPath);
    if (!target) return { ok: false, error: 'invalid path' };
    fs.mkdirSync(target, { recursive: true });
    return { ok: true, path: relPath };
  }

  delete(relPath) {
    const target = this._resolve(relPath);
    if (!target || !fs.existsSync(target)) return { ok: false, error: 'not found' };
    const stat = fs.statSync(target);
    if (stat.isDirectory()) fs.rmSync(target, { recursive: true });
    else fs.unlinkSync(target);
    this.cache.delete(relPath);
    return { ok: true, path: relPath };
  }

  exists(relPath) {
    const target = this._resolve(relPath);
    return target && fs.existsSync(target);
  }

  stat(relPath) {
    const target = this._resolve(relPath);
    if (!target || !fs.existsSync(target)) return null;
    const stat = fs.statSync(target);
    return {
      path: relPath,
      isDirectory: stat.isDirectory(),
      size: stat.size,
      created: stat.birthtime.toISOString(),
      modified: stat.mtime.toISOString(),
      hash: stat.isDirectory() ? '' : this._hash(target)
    };
  }

  copy(srcRel, destRel) {
    const src = this._resolve(srcRel);
    const dest = this._resolve(destRel);
    if (!src || !fs.existsSync(src)) return { ok: false, error: 'source not found' };
    if (!dest) return { ok: false, error: 'invalid dest path' };
    this._ensureDir(dest);
    fs.copyFileSync(src, dest);
    return { ok: true, from: srcRel, to: destRel };
  }

  move(srcRel, destRel) {
    const result = this.copy(srcRel, destRel);
    if (!result.ok) return result;
    this.delete(srcRel);
    return { ok: true, from: srcRel, to: destRel };
  }

  search(query, relDir = '') {
    const results = [];
    const target = this._resolve(relDir);
    if (!target || !fs.existsSync(target)) return results;
    const q = query.toLowerCase();
    const walk = (dir, prefix) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const childPath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.name.toLowerCase().includes(q)) {
          results.push({ name: entry.name, path: childPath, type: entry.isDirectory() ? 'directory' : 'file' });
        }
        if (entry.isDirectory()) {
          walk(path.join(dir, entry.name), childPath);
        }
      }
    };
    walk(target, relDir);
    return results;
  }

  _hash(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return crypto.createHash('md5').update(data).digest('hex').slice(0, 8);
    } catch { return ''; }
  }

  watch(relPath, callback) {
    const target = this._resolve(relPath);
    if (!target) return null;
    const watcher = fs.watch(target, { recursive: true }, (event, filename) => {
      callback(event, filename);
    });
    this.watchers.set(relPath, watcher);
    return () => { watcher.close(); this.watchers.delete(relPath); };
  }

  dispose() {
    for (const watcher of this.watchers.values()) watcher.close();
    this.watchers.clear();
    this.cache.clear();
  }
}

module.exports = AssetManager;
