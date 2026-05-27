const AssetManager = require('./AssetManager');

class SceneManager {
  constructor(senikDir) {
    this.assetMgr = new AssetManager(senikDir);
    this.scenesDir = 'scenes';
  }

  list() {
    return this.assetMgr.list(this.scenesDir);
  }

  get(name) {
    const relPath = `${this.scenesDir}/${name}`;
    const data = this.assetMgr.read(relPath);
    if (!data || data.type !== 'text') return null;
    try { return JSON.parse(data.content); }
    catch { return null; }
  }

  create(sceneDef) {
    const name = sceneDef.id ? `${sceneDef.id}.json` : `scene-${Date.now()}.json`;
    const relPath = `${this.scenesDir}/${name}`;
    const content = JSON.stringify({
      id: sceneDef.id || `scene-${Date.now()}`,
      name: sceneDef.name || '未命名场景',
      version: '1.0.0',
      surface: sceneDef.surface || 'plane',
      physics: sceneDef.physics || 'none',
      texture: sceneDef.texture || { type: 'pixel', pixelSize: 8, color1: '#00ff88', color2: '#ff3366' },
      physicsConfig: sceneDef.physicsConfig || { strength: 1.0, damping: 0.98, stiffness: 0.8 },
      transform: sceneDef.transform || { rotX: 0, rotY: 0, scale: 1.0 },
      layers: sceneDef.layers || [],
      pipeline: sceneDef.pipeline || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, null, 2);
    return this.assetMgr.write(relPath, content);
  }

  update(name, updates) {
    const existing = this.get(name);
    if (!existing) return { ok: false, error: 'scene not found' };
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    const relPath = `${this.scenesDir}/${name}`;
    return this.assetMgr.write(relPath, JSON.stringify(merged, null, 2));
  }

  delete(name) {
    return this.assetMgr.delete(`${this.scenesDir}/${name}`);
  }

  duplicate(name, newName) {
    const existing = this.get(name);
    if (!existing) return { ok: false, error: 'scene not found' };
    existing.id = newName.replace('.json', '');
    existing.name = `${existing.name} (副本)`;
    existing.createdAt = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();
    return this.create(existing);
  }

  exportScene(name) {
    const data = this.get(name);
    if (!data) return null;
    return JSON.stringify(data, null, 2);
  }

  importScene(jsonStr) {
    try {
      const sceneDef = JSON.parse(jsonStr);
      return this.create(sceneDef);
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

module.exports = SceneManager;
