const AssetManager = require('./AssetManager');

const BUILTIN_EFFECTS = [
  {
    id: 'pixelate', name: '像素化', category: 'basic',
    params: [
      { name: 'pixelSize', label: '像素尺寸', type: 'range', min: 2, max: 32, default: 8 },
      { name: 'gridShow', label: '网格线', type: 'boolean', default: false }
    ]
  },
  {
    id: 'ionize', name: '离子化消散', category: 'particle',
    params: [
      { name: 'pixelSize', label: '像素尺寸', type: 'range', min: 2, max: 16, default: 4 },
      { name: 'speed', label: '扩散速度', type: 'range', min: 0.5, max: 5, step: 0.1, default: 2.0 },
      { name: 'spread', label: '扩散范围', type: 'range', min: 0.5, max: 4, step: 0.1, default: 1.5 },
      { name: 'gravity', label: '重力', type: 'range', min: 0, max: 2, step: 0.1, default: 0.3 },
      { name: 'fade', label: '渐隐', type: 'boolean', default: true }
    ]
  },
  {
    id: 'wave', name: '波浪纹线条', category: 'line',
    params: [
      { name: 'amplitude', label: '振幅', type: 'range', min: 2, max: 60, default: 20 },
      { name: 'frequency', label: '频率', type: 'range', min: 0.005, max: 0.1, step: 0.001, default: 0.03 },
      { name: 'speed', label: '速度', type: 'range', min: 0.5, max: 8, step: 0.1, default: 2.0 },
      { name: 'waveType', label: '波形', type: 'select', default: 'sine', options: [
        { label: '正弦', value: 'sine' }, { label: '三角', value: 'triangle' }, { label: '锯齿', value: 'sawtooth' }
      ]},
      { name: 'lineWidth', label: '线宽', type: 'range', min: 1, max: 6, default: 2 },
      { name: 'gap', label: '行间距', type: 'range', min: 1, max: 8, default: 3 }
    ]
  },
  {
    id: 'glitch', name: '数字故障', category: 'distortion',
    params: [
      { name: 'sliceCount', label: '切片数', type: 'range', min: 2, max: 20, default: 5 },
      { name: 'shiftAmount', label: '偏移量', type: 'range', min: 1, max: 50, default: 15 },
      { name: 'rgbShift', label: 'RGB偏移', type: 'range', min: 0, max: 20, default: 5 },
      { name: 'scanlines', label: '扫描线', type: 'boolean', default: true }
    ]
  },
  {
    id: 'chromatic', name: '色差分离', category: 'distortion',
    params: [
      { name: 'redOffsetX', label: 'R偏移X', type: 'range', min: -20, max: 20, default: 3 },
      { name: 'greenOffsetX', label: 'G偏移X', type: 'range', min: -20, max: 20, default: 0 },
      { name: 'blueOffsetX', label: 'B偏移X', type: 'range', min: -20, max: 20, default: -3 },
      { name: 'intensity', label: '强度', type: 'range', min: 0, max: 2, step: 0.1, default: 1.0 }
    ]
  }
];

class EffectRegistry {
  constructor(senikDir) {
    this.assetMgr = new AssetManager(senikDir);
    this.effectsDir = 'effects';
    this.customEffects = new Map();
    this._loadCustom();
  }

  _loadCustom() {
    const files = this.assetMgr.list(this.effectsDir);
    for (const f of files) {
      if (f.type === 'file' && f.name.endsWith('.json')) {
        const data = this.assetMgr.read(`${this.effectsDir}/${f.name}`);
        if (data && data.type === 'text') {
          try {
            const effect = JSON.parse(data.content);
            if (effect.id) this.customEffects.set(effect.id, effect);
          } catch {}
        }
      }
    }
  }

  listAll() {
    const custom = Array.from(this.customEffects.values());
    return {
      builtin: BUILTIN_EFFECTS,
      custom,
      total: BUILTIN_EFFECTS.length + custom.length
    };
  }

  get(effectId) {
    const builtin = BUILTIN_EFFECTS.find(e => e.id === effectId);
    if (builtin) return { ...builtin, source: 'builtin' };
    const custom = this.customEffects.get(effectId);
    if (custom) return { ...custom, source: 'custom' };
    return null;
  }

  register(effectDef) {
    if (!effectDef.id || !effectDef.name) return { ok: false, error: 'id and name required' };
    if (BUILTIN_EFFECTS.find(e => e.id === effectDef.id)) return { ok: false, error: 'cannot override builtin' };
    const relPath = `${this.effectsDir}/${effectDef.id}.json`;
    const content = JSON.stringify({
      id: effectDef.id,
      name: effectDef.name,
      category: effectDef.category || 'custom',
      params: effectDef.params || [],
      author: effectDef.author || 'anonymous',
      tags: effectDef.tags || [],
      createdAt: new Date().toISOString()
    }, null, 2);
    const result = this.assetMgr.write(relPath, content);
    if (result.ok) this.customEffects.set(effectDef.id, JSON.parse(content));
    return result;
  }

  unregister(effectId) {
    if (BUILTIN_EFFECTS.find(e => e.id === effectId)) return { ok: false, error: 'cannot remove builtin' };
    const relPath = `${this.effectsDir}/${effectId}.json`;
    const result = this.assetMgr.delete(relPath);
    if (result.ok) this.customEffects.delete(effectId);
    return result;
  }

  getPresets() {
    const presets = this.assetMgr.list(this.effectsDir);
    return presets.map(p => {
      const data = this.assetMgr.read(`${this.effectsDir}/${p.name}`);
      if (data && data.type === 'text') {
        try { return JSON.parse(data.content); } catch { return null; }
      }
      return null;
    }).filter(Boolean);
  }
}

EffectRegistry.BUILTIN_EFFECTS = BUILTIN_EFFECTS;

module.exports = EffectRegistry;
