const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 4000;

const SENIK_DIR = path.join(__dirname, 'senik');
const PROJECTS_DIR = path.join(__dirname, '..', 'pixel-forge-modules');
const TS_DIR = path.join(__dirname, '..', 'pixel-forge-ts');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(SENIK_DIR, req.body.directory || 'scenes');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

function safePath(base, rel) {
  const resolved = path.resolve(base, rel);
  if (!resolved.startsWith(path.resolve(base))) return null;
  return resolved;
}

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'pixel-forge-api',
    version: '1.0.0',
    endpoints: [
      'GET  /api/status',
      'GET  /api/senik/tree',
      'GET  /api/senik/list?dir=',
      'GET  /api/senik/read?path=',
      'POST /api/senik/write',
      'POST /api/senik/mkdir',
      'DELETE /api/senik/delete?path=',
      'POST /api/senik/upload',
      'GET  /api/projects/tree',
      'GET  /api/projects/read?path=',
      'POST /api/projects/write',
      'GET  /api/ts/tree',
      'GET  /api/ts/read?path=',
      'POST /api/ts/write',
      'POST /api/render/preview',
      'GET  /api/senik/preview?path='
    ]
  });
});

function buildTree(dir, prefix = '') {
  const items = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          path: relPath,
          type: 'directory',
          children: buildTree(fullPath, relPath)
        });
      } else {
        const stat = fs.statSync(fullPath);
        const ext = path.extname(entry.name).toLowerCase();
        items.push({
          name: entry.name,
          path: relPath,
          type: 'file',
          size: stat.size,
          modified: stat.mtime.toISOString(),
          lang: extToLang(ext)
        });
      }
    }
  } catch (e) {}
  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function extToLang(ext) {
  const map = {
    '.html': 'HTML', '.htm': 'HTML', '.css': 'CSS', '.js': 'JS',
    '.ts': 'TS', '.json': 'JSON', '.md': 'MD', '.png': 'IMG',
    '.jpg': 'IMG', '.jpeg': 'IMG', '.gif': 'IMG', '.svg': 'SVG',
    '.glb': '3D', '.gltf': '3D', '.obj': '3D',
    '.yaml': 'YAML', '.yml': 'YAML', '.txt': 'TXT'
  };
  return map[ext] || 'FILE';
}

app.get('/api/senik/tree', (req, res) => {
  res.json({ root: 'senik', children: buildTree(SENIK_DIR) });
});

app.get('/api/senik/list', (req, res) => {
  const dir = req.query.dir || '';
  const target = safePath(SENIK_DIR, dir);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  try {
    const entries = fs.readdirSync(target, { withFileTypes: true });
    const items = entries
      .filter(e => !e.name.startsWith('.'))
      .map(e => {
        const fullPath = path.join(target, e.name);
        const isDir = e.isDirectory();
        const stat = isDir ? null : fs.statSync(fullPath);
        return {
          name: e.name,
          type: isDir ? 'directory' : 'file',
          size: stat ? stat.size : 0,
          modified: stat ? stat.mtime.toISOString() : ''
        };
      });
    res.json({ dir, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/senik/read', (req, res) => {
  const relPath = req.query.path || '';
  const target = safePath(SENIK_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  try {
    const ext = path.extname(target).toLowerCase();
    const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
    if (imgExts.includes(ext)) {
      const data = fs.readFileSync(target);
      const base64 = data.toString('base64');
      const mime = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
      res.json({ type: 'binary', mime, base64: `data:${mime};base64,${base64}` });
    } else {
      const content = fs.readFileSync(target, 'utf-8');
      const stat = fs.statSync(target);
      res.json({
        type: 'text',
        content,
        size: stat.size,
        modified: stat.mtime.toISOString(),
        lang: extToLang(ext)
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/senik/write', (req, res) => {
  const { path: relPath, content } = req.body;
  if (!relPath) return res.status(400).json({ error: 'path required' });
  const target = safePath(SENIK_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  try {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, content, 'utf-8');
    res.json({ ok: true, path: relPath, size: content.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/senik/mkdir', (req, res) => {
  const { path: relPath } = req.body;
  if (!relPath) return res.status(400).json({ error: 'path required' });
  const target = safePath(SENIK_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  try {
    fs.mkdirSync(target, { recursive: true });
    res.json({ ok: true, path: relPath });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/senik/delete', (req, res) => {
  const relPath = req.query.path || '';
  if (!relPath) return res.status(400).json({ error: 'path required' });
  const target = safePath(SENIK_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  try {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      fs.rmSync(target, { recursive: true });
    } else {
      fs.unlinkSync(target);
    }
    res.json({ ok: true, path: relPath });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/senik/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  res.json({
    ok: true,
    filename: req.file.originalname,
    path: `${req.body.directory || 'scenes'}/${req.file.originalname}`,
    size: req.file.size
  });
});

app.get('/api/senik/preview', (req, res) => {
  const relPath = req.query.path || '';
  const target = safePath(SENIK_DIR, relPath);
  if (!target || !fs.existsSync(target)) return res.status(404).send('not found');
  const ext = path.extname(target).toLowerCase();
  const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
  if (imgExts.includes(ext)) {
    const mime = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`;
    res.setHeader('Content-Type', mime);
    res.sendFile(target);
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(target);
  }
});

app.get('/api/projects/tree', (req, res) => {
  res.json({ root: 'pixel-forge-modules', children: buildTree(PROJECTS_DIR) });
});

app.get('/api/projects/read', (req, res) => {
  const relPath = req.query.path || '';
  const target = safePath(PROJECTS_DIR, relPath);
  if (!target || !fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  try {
    const content = fs.readFileSync(target, 'utf-8');
    const stat = fs.statSync(target);
    res.json({
      type: 'text',
      content,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      lang: extToLang(path.extname(target))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/projects/write', (req, res) => {
  const { path: relPath, content } = req.body;
  if (!relPath) return res.status(400).json({ error: 'path required' });
  const target = safePath(PROJECTS_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  try {
    fs.writeFileSync(target, content, 'utf-8');
    res.json({ ok: true, path: relPath, size: content.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ts/tree', (req, res) => {
  res.json({ root: 'pixel-forge-ts', children: buildTree(TS_DIR) });
});

app.get('/api/ts/read', (req, res) => {
  const relPath = req.query.path || '';
  const target = safePath(TS_DIR, relPath);
  if (!target || !fs.existsSync(target)) return res.status(404).json({ error: 'not found' });
  try {
    const content = fs.readFileSync(target, 'utf-8');
    const stat = fs.statSync(target);
    res.json({ type: 'text', content, size: stat.size, modified: stat.mtime.toISOString(), lang: extToLang(path.extname(target)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ts/write', (req, res) => {
  const { path: relPath, content } = req.body;
  if (!relPath) return res.status(400).json({ error: 'path required' });
  const target = safePath(TS_DIR, relPath);
  if (!target) return res.status(400).json({ error: 'invalid path' });
  try {
    fs.writeFileSync(target, content, 'utf-8');
    res.json({ ok: true, path: relPath, size: content.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/render/preview', (req, res) => {
  const { content, type = 'html' } = req.body;
  if (!content) return res.status(400).json({ error: 'content required' });
  if (type === 'html') {
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  }
});

app.listen(PORT, () => {
  console.log(`PIXEL FORGE API Server running on http://localhost:${PORT}`);
  console.log(`Senik content dir: ${SENIK_DIR}`);
  console.log(`Projects dir: ${PROJECTS_DIR}`);
  console.log(`TS dir: ${TS_DIR}`);
  console.log(`API status: http://localhost:${PORT}/api/status`);
});
