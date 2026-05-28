const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DatasetManager {
  constructor(baseDir) {
    this.baseDir = path.join(baseDir, 'datasets');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    this.datasets = new Map();
    this._load();
  }

  _load() {
    const metaPath = path.join(this.baseDir, '_meta.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      for (const [id, info] of Object.entries(meta)) {
        this.datasets.set(id, info);
      }
    }
  }

  _save() {
    const meta = {};
    for (const [id, info] of this.datasets) {
      meta[id] = info;
    }
    fs.writeFileSync(path.join(this.baseDir, '_meta.json'), JSON.stringify(meta, null, 2));
  }

  _id() {
    return 'ds_' + crypto.randomBytes(6).toString('hex');
  }

  create(config) {
    const id = this._id();
    const dataset = {
      id,
      name: config.name || `dataset-${id.slice(0, 8)}`,
      description: config.description || '',
      type: config.type || 'image-text', // image-text | image-only | text-only
      format: config.format || 'jsonl',
      tags: config.tags || [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      stats: {
        total: 0,
        images: 0,
        texts: 0,
        annotated: 0,
        sizeBytes: 0,
      },
      annotations: [],
      exportReady: false,
    };

    const dir = path.join(this.baseDir, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'texts'), { recursive: true });

    this.datasets.set(id, dataset);
    this._save();
    return dataset;
  }

  list() {
    return [...this.datasets.values()].sort((a, b) =>
      new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );
  }

  get(id) {
    const ds = this.datasets.get(id);
    if (!ds) return null;
    const dir = path.join(this.baseDir, id);
    if (fs.existsSync(dir)) {
      const annPath = path.join(dir, 'annotations.json');
      if (fs.existsSync(annPath)) {
        ds.annotations = JSON.parse(fs.readFileSync(annPath, 'utf-8'));
        ds.stats.annotated = ds.annotations.length;
      }
    }
    return ds;
  }

  delete(id) {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'not found' };
    const dir = path.join(this.baseDir, id);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
    this.datasets.delete(id);
    this._save();
    return { ok: true };
  }

  addImage(id, imageName, buffer) {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'dataset not found' };
    const imgDir = path.join(this.baseDir, id, 'images');
    const imgPath = path.join(imgDir, imageName);
    fs.writeFileSync(imgPath, buffer);
    ds.stats.images++;
    ds.stats.sizeBytes += buffer.length;
    ds.stats.total = Math.max(ds.stats.images, ds.stats.texts);
    ds.updated = new Date().toISOString();
    this._save();
    return { ok: true, name: imageName, size: buffer.length };
  }

  addText(id, textName, content) {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'dataset not found' };
    const txtDir = path.join(this.baseDir, id, 'texts');
    const txtPath = path.join(txtDir, textName);
    fs.writeFileSync(txtPath, content, 'utf-8');
    ds.stats.texts++;
    ds.stats.sizeBytes += Buffer.byteLength(content, 'utf-8');
    ds.stats.total = Math.max(ds.stats.images, ds.stats.texts);
    ds.updated = new Date().toISOString();
    this._save();
    return { ok: true, name: textName, size: Buffer.byteLength(content, 'utf-8') };
  }

  annotate(id, annotation) {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'dataset not found' };

    const dir = path.join(this.baseDir, id);
    const annPath = path.join(dir, 'annotations.json');

    let annotations = [];
    if (fs.existsSync(annPath)) {
      annotations = JSON.parse(fs.readFileSync(annPath, 'utf-8'));
    }

    const entry = {
      id: 'ann_' + crypto.randomBytes(4).toString('hex'),
      image: annotation.image || null,
      text: annotation.text || null,
      prompt: annotation.prompt || '',
      labels: annotation.labels || [],
      caption: annotation.caption || '',
      params: annotation.params || {},
      quality: annotation.quality || { score: 0, notes: '' },
      created: new Date().toISOString(),
    };

    annotations.push(entry);
    fs.writeFileSync(annPath, JSON.stringify(annotations, null, 2));

    ds.annotations = annotations;
    ds.stats.annotated = annotations.length;
    ds.updated = new Date().toISOString();
    this._save();
    return { ok: true, entry };
  }

  batchAnnotate(id, annotations) {
    const results = [];
    for (const ann of annotations) {
      results.push(this.annotate(id, ann));
    }
    return { ok: true, count: results.length, results };
  }

  autoLabel(id, options = {}) {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'dataset not found' };

    const dir = path.join(this.baseDir, id);
    const imgDir = path.join(dir, 'images');
    const txtDir = path.join(dir, 'texts');

    const images = fs.existsSync(imgDir)
      ? fs.readdirSync(imgDir).filter(f => !f.startsWith('.'))
      : [];

    const texts = fs.existsSync(txtDir)
      ? fs.readdirSync(txtDir).filter(f => !f.startsWith('.'))
      : [];

    const generated = [];
    const maxPairs = options.maxPairs || Math.min(images.length, texts.length || images.length);

    for (let i = 0; i < maxPairs; i++) {
      const img = images[i] || images[0] || null;
      const txt = texts[i] || texts[0] || null;

      let textContent = '';
      if (txt) {
        textContent = fs.readFileSync(path.join(txtDir, txt), 'utf-8').slice(0, 200);
      }

      const autoLabels = this._generateLabels(img, textContent);
      const autoCaption = textContent || `Image annotation for ${img || 'unknown'}`;

      const ann = {
        image: img,
        text: txt,
        prompt: options.promptTemplate || `Describe this image with labels: ${autoLabels.join(', ')}`,
        labels: autoLabels,
        caption: autoCaption,
        params: { autoGenerated: true, method: 'heuristic', confidence: 0.7 + Math.random() * 0.25 },
        quality: { score: Math.round((0.7 + Math.random() * 0.25) * 100) / 100, notes: 'auto-generated' },
      };

      const result = this.annotate(id, ann);
      generated.push(result.entry);
    }

    return { ok: true, generated: generated.length, entries: generated };
  }

  _generateLabels(imageName, textContent) {
    const labels = [];
    const combined = `${imageName || ''} ${textContent || ''}`.toLowerCase();

    const labelMap = {
      '人物': ['portrait', 'face', 'person', 'human', 'character'],
      '风景': ['landscape', 'nature', 'outdoor', 'scenery', 'mountain'],
      '建筑': ['building', 'architecture', 'city', 'structure', 'urban'],
      '动物': ['animal', 'creature', 'wildlife', 'pet'],
      '食物': ['food', 'dish', 'cuisine', 'meal', 'cooking'],
      '抽象': ['abstract', 'pattern', 'geometric', 'design'],
      '像素': ['pixel', '8bit', 'retro', 'game', 'sprite'],
      '科技': ['tech', 'digital', 'cyber', 'future', 'scifi'],
    };

    for (const [category, keywords] of Object.entries(labelMap)) {
      if (keywords.some(k => combined.includes(k))) {
        labels.push(category);
      }
    }

    if (labels.length === 0) {
      labels.push('general');
    }

    return labels;
  }

  exportDataset(id, format = 'jsonl') {
    const ds = this.datasets.get(id);
    if (!ds) return { ok: false, error: 'dataset not found' };

    const dir = path.join(this.baseDir, id);
    const annPath = path.join(dir, 'annotations.json');
    if (!fs.existsSync(annPath)) return { ok: false, error: 'no annotations' };

    const annotations = JSON.parse(fs.readFileSync(annPath, 'utf-8'));

    let exportContent = '';
    let exportFile = '';

    if (format === 'jsonl') {
      exportContent = annotations.map(a => JSON.stringify(a)).join('\n');
      exportFile = `dataset-${id}-export.jsonl`;
    } else if (format === 'json') {
      exportContent = JSON.stringify({
        dataset: { id: ds.id, name: ds.name, type: ds.type, tags: ds.tags },
        annotations,
        stats: ds.stats,
      }, null, 2);
      exportFile = `dataset-${id}-export.json`;
    } else if (format === 'csv') {
      const headers = ['id', 'image', 'text', 'prompt', 'labels', 'caption', 'quality_score'];
      const rows = [headers.join(',')];
      for (const a of annotations) {
        rows.push([
          a.id, a.image || '', a.text || '',
          `"${(a.prompt || '').replace(/"/g, '""')}"`,
          `"${(a.labels || []).join(';')}"`,
          `"${(a.caption || '').replace(/"/g, '""')}"`,
          a.quality?.score || 0,
        ].join(','));
      }
      exportContent = rows.join('\n');
      exportFile = `dataset-${id}-export.csv`;
    }

    const exportDir = path.join(dir, 'exports');
    fs.mkdirSync(exportDir, { recursive: true });
    const exportPath = path.join(exportDir, exportFile);
    fs.writeFileSync(exportPath, exportContent, 'utf-8');

    ds.exportReady = true;
    ds.updated = new Date().toISOString();
    this._save();

    return {
      ok: true,
      format,
      file: exportFile,
      path: exportPath,
      size: Buffer.byteLength(exportContent, 'utf-8'),
      count: annotations.length,
    };
  }

  getStats() {
    let totalDatasets = 0, totalAnnotations = 0, totalImages = 0, totalTexts = 0, totalSize = 0;
    for (const ds of this.datasets.values()) {
      totalDatasets++;
      totalAnnotations += ds.stats.annotated || 0;
      totalImages += ds.stats.images || 0;
      totalTexts += ds.stats.texts || 0;
      totalSize += ds.stats.sizeBytes || 0;
    }
    return { totalDatasets, totalAnnotations, totalImages, totalTexts, totalSize };
  }
}

module.exports = DatasetManager;