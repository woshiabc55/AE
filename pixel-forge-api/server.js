const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AssetManager = require('./lib/AssetManager');
const SceneManager = require('./lib/SceneManager');
const EffectRegistry = require('./lib/EffectRegistry');
const { DocPlanner, SelectDraft } = require('./lib/DocPlanner');
const DatasetManager = require('./lib/DatasetManager');
const { TrainingPipeline } = require('./lib/TrainingNode');
const EmptyChain = require('./lib/EmptyChain');

const app = express();
const PORT = 4000;

const SENIK_DIR = path.join(__dirname, 'senik');
const PROJECTS_DIR = path.join(__dirname, '..', 'pixel-forge-modules');
const TS_DIR = path.join(__dirname, '..', 'pixel-forge-ts');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const senikAssets = new AssetManager(SENIK_DIR);
const projectAssets = new AssetManager(PROJECTS_DIR);
const tsAssets = new AssetManager(TS_DIR);
const sceneManager = new SceneManager(SENIK_DIR);
const effectRegistry = new EffectRegistry(SENIK_DIR);
const docPlanner = new DocPlanner(SENIK_DIR);
const datasetManager = new DatasetManager(SENIK_DIR);
const trainingPipeline = new TrainingPipeline();
const emptyChain = new EmptyChain();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(SENIK_DIR, req.body.directory || 'scenes');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  })
});

const datasetUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dsId = req.params.id || req.body.datasetId;
      if (!dsId) return cb(new Error('datasetId required'));
      const dir = path.join(SENIK_DIR, 'datasets', dsId, 'images');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  })
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'pixel-forge-api',
    version: '1.0.0',
    modules: {
      AssetManager: 'active',
      SceneManager: 'active',
      EffectRegistry: `active (${effectRegistry.listAll().total} effects)`,
      DocPlanner: 'active',
      SelectDraft: 'active',
      DatasetManager: `active (${datasetManager.getStats().totalDatasets} datasets)`,
      TrainingPipeline: `active (${trainingPipeline.nodes.size} nodes)`,
      EmptyChain: `active (${emptyChain.getStats().totalChains} chains)`,
    },
    stats: {
      senikFiles: senikAssets.tree('').length,
      scenes: sceneManager.list().length,
      effects: effectRegistry.listAll().total,
      drafts: docPlanner.getStats().total,
      ...datasetManager.getStats(),
      chains: emptyChain.getStats().totalChains,
      pipelines: trainingPipeline.nodes.size,
    }
  });
});

// === Senik File CRUD ===
app.get('/api/senik/tree', (req, res) => res.json({ root: 'senik', children: senikAssets.tree('') }));
app.get('/api/senik/list', (req, res) => res.json({ dir: req.query.dir || '', items: senikAssets.list(req.query.dir || '') }));
app.get('/api/senik/read', (req, res) => { const d = senikAssets.read(req.query.path || ''); d ? res.json(d) : res.status(404).json({ error: 'not found' }); });
app.post('/api/senik/write', (req, res) => res.json(senikAssets.write(req.body.path, req.body.content)));
app.post('/api/senik/mkdir', (req, res) => res.json(senikAssets.mkdir(req.body.path)));
app.delete('/api/senik/delete', (req, res) => res.json(senikAssets.delete(req.query.path || '')));
app.get('/api/senik/stat', (req, res) => { const s = senikAssets.stat(req.query.path || ''); s ? res.json(s) : res.status(404).json({ error: 'not found' }); });
app.get('/api/senik/search', (req, res) => res.json({ query: req.query.q || '', results: senikAssets.search(req.query.q || '') }));
app.post('/api/senik/copy', (req, res) => res.json(senikAssets.copy(req.body.from, req.body.to)));
app.post('/api/senik/move', (req, res) => res.json(senikAssets.move(req.body.from, req.body.to)));
app.post('/api/senik/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  res.json({ ok: true, filename: req.file.originalname, path: `${req.body.directory || 'scenes'}/${req.file.originalname}`, size: req.file.size });
});
app.get('/api/senik/preview', (req, res) => {
  const target = senikAssets._resolve(req.query.path || '');
  if (!target || !fs.existsSync(target)) return res.status(404).send('not found');
  const ext = path.extname(target).toLowerCase();
  const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
  if (imgExts.includes(ext)) {
    res.setHeader('Content-Type', ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`);
  } else {
    res.setHeader('Content-Type', 'text/plain');
  }
  res.sendFile(target);
});

// === Scene Management ===
app.get('/api/scenes', (req, res) => res.json(sceneManager.list()));
app.get('/api/scenes/:name', (req, res) => { const s = sceneManager.get(req.params.name); s ? res.json(s) : res.status(404).json({ error: 'not found' }); });
app.post('/api/scenes', (req, res) => res.json(sceneManager.create(req.body)));
app.put('/api/scenes/:name', (req, res) => res.json(sceneManager.update(req.params.name, req.body)));
app.delete('/api/scenes/:name', (req, res) => res.json(sceneManager.delete(req.params.name)));
app.post('/api/scenes/:name/duplicate', (req, res) => res.json(sceneManager.duplicate(req.params.name, req.body.newName || `${req.params.name}-copy.json`)));
app.post('/api/scenes/import', (req, res) => res.json(sceneManager.importScene(req.body.json)));
app.get('/api/scenes/:name/export', (req, res) => { const d = sceneManager.exportScene(req.params.name); d ? res.setHeader('Content-Type', 'application/json').send(d) : res.status(404).json({ error: 'not found' }); });

// === Effect Registry ===
app.get('/api/effects', (req, res) => res.json(effectRegistry.listAll()));
app.get('/api/effects/:id', (req, res) => { const e = effectRegistry.get(req.params.id); e ? res.json(e) : res.status(404).json({ error: 'not found' }); });
app.post('/api/effects', (req, res) => res.json(effectRegistry.register(req.body)));
app.delete('/api/effects/:id', (req, res) => res.json(effectRegistry.unregister(req.params.id)));
app.get('/api/effects/presets', (req, res) => res.json(effectRegistry.getPresets()));

// === Doc Planner + Select Draft ===
app.get('/api/drafts', (req, res) => res.json(docPlanner.getStats()));
app.get('/api/drafts/all', (req, res) => res.json(SelectDraft.STATES));
app.get('/api/drafts/:state', (req, res) => {
  const states = Object.values(SelectDraft.STATES);
  if (!states.includes(req.params.state)) return res.status(400).json({ error: `invalid state. valid: ${states.join(',')}` });
  res.json(docPlanner.selectDraft.listByState(req.params.state));
});
app.get('/api/drafts/item/:id', (req, res) => { const d = docPlanner.selectDraft.get(req.params.id); d ? res.json(d) : res.status(404).json({ error: 'not found' }); });
app.post('/api/drafts', (req, res) => res.json(docPlanner.selectDraft.create(req.body)));
app.put('/api/drafts/:id', (req, res) => res.json(docPlanner.selectDraft.update(req.params.id, req.body)));
app.delete('/api/drafts/:id', (req, res) => res.json(docPlanner.selectDraft.delete(req.params.id)));
app.post('/api/drafts/:id/transition', (req, res) => res.json(docPlanner.selectDraft.transition(req.params.id, req.body.state, req.body.note || '')));

app.get('/api/plans', (req, res) => res.json(docPlanner.getPlans()));
app.post('/api/plans', (req, res) => res.json(docPlanner.createPlan(req.body)));
app.post('/api/plans/:id/approve', (req, res) => res.json(docPlanner.approve(req.params.id)));
app.post('/api/plans/:id/publish', (req, res) => res.json(docPlanner.publish(req.params.id)));
app.post('/api/plans/:id/review', (req, res) => res.json(docPlanner.review(req.params.id)));
app.post('/api/plans/:id/archive', (req, res) => res.json(docPlanner.archive(req.params.id)));

app.get('/api/specs/modules', (req, res) => res.json(docPlanner.getModuleSpecs()));
app.post('/api/specs/modules', (req, res) => res.json(docPlanner.createModuleSpec(req.body)));
app.get('/api/specs/effects', (req, res) => res.json(docPlanner.getEffectSpecs()));
app.post('/api/specs/effects', (req, res) => res.json(docPlanner.createEffectSpec(req.body)));

// === Datasets: 数据集处理 ===
app.get('/api/datasets', (req, res) => res.json(datasetManager.list()));
app.get('/api/datasets/stats', (req, res) => res.json(datasetManager.getStats()));
app.get('/api/datasets/:id', (req, res) => { const d = datasetManager.get(req.params.id); d ? res.json(d) : res.status(404).json({ error: 'not found' }); });
app.post('/api/datasets', (req, res) => res.json(datasetManager.create(req.body)));
app.delete('/api/datasets/:id', (req, res) => res.json(datasetManager.delete(req.params.id)));

app.post('/api/datasets/:id/images', datasetUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' });
  res.json(datasetManager.addImage(req.params.id, req.file.originalname, fs.readFileSync(req.file.path)));
});
app.post('/api/datasets/:id/texts', (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'name and content required' });
  res.json(datasetManager.addText(req.params.id, name, content));
});

app.post('/api/datasets/:id/annotate', (req, res) => res.json(datasetManager.annotate(req.params.id, req.body)));
app.post('/api/datasets/:id/annotate-batch', (req, res) => res.json(datasetManager.batchAnnotate(req.params.id, req.body.annotations || [])));
app.post('/api/datasets/:id/auto-label', (req, res) => res.json(datasetManager.autoLabel(req.params.id, req.body)));

app.post('/api/datasets/:id/export', (req, res) => {
  const format = req.body.format || 'jsonl';
  const result = datasetManager.exportDataset(req.params.id, format);
  result.ok ? res.json(result) : res.status(400).json(result);
});

// === Training Pipeline: 节点训练管线 ===
app.get('/api/nodes', (req, res) => res.json(trainingPipeline.toJSON()));
app.post('/api/nodes', (req, res) => res.json(trainingPipeline.createNode(req.body)));
app.delete('/api/nodes/:id', (req, res) => res.json(trainingPipeline.removeNode(req.params.id)));
app.post('/api/nodes/connect', (req, res) => res.json(trainingPipeline.connect(req.body.from, req.body.to)));
app.get('/api/nodes/:id', (req, res) => { const n = trainingPipeline.getNode(req.params.id); n ? res.json(n.toJSON()) : res.status(404).json({ error: 'not found' }); });
app.post('/api/nodes/run', async (req, res) => {
  const result = await trainingPipeline.run(req.body.datasetSize || 100);
  res.json(result);
});

// === Empty Chain: 空链云端处理 ===
app.get('/api/chains', (req, res) => res.json(emptyChain.list()));
app.get('/api/chains/stats', (req, res) => res.json(emptyChain.getStats()));
app.post('/api/chains', (req, res) => res.json(emptyChain.create(req.body)));
app.delete('/api/chains/:id', (req, res) => res.json(emptyChain.delete(req.params.id)));
app.get('/api/chains/:id', (req, res) => { const c = emptyChain.get(req.params.id); c ? res.json(c) : res.status(404).json({ error: 'not found' }); });
app.post('/api/chains/:id/links', (req, res) => res.json(emptyChain.addLink(req.params.id, req.body)));
app.delete('/api/chains/:id/links/:linkId', (req, res) => res.json(emptyChain.removeLink(req.params.id, req.params.linkId)));
app.post('/api/chains/:id/execute', async (req, res) => {
  const result = await emptyChain.execute(req.params.id, req.body.input || {});
  res.json(result);
});

// === Project Files ===
app.get('/api/projects/tree', (req, res) => res.json({ root: 'pixel-forge-modules', children: projectAssets.tree('') }));
app.get('/api/projects/read', (req, res) => { const d = projectAssets.read(req.query.path || ''); d ? res.json(d) : res.status(404).json({ error: 'not found' }); });
app.post('/api/projects/write', (req, res) => res.json(projectAssets.write(req.body.path, req.body.content)));

app.get('/api/ts/tree', (req, res) => res.json({ root: 'pixel-forge-ts', children: tsAssets.tree('') }));
app.get('/api/ts/read', (req, res) => { const d = tsAssets.read(req.query.path || ''); d ? res.json(d) : res.status(404).json({ error: 'not found' }); });
app.post('/api/ts/write', (req, res) => res.json(tsAssets.write(req.body.path, req.body.content)));

app.post('/api/render/preview', (req, res) => {
  const { content, type = 'html' } = req.body;
  if (!content) return res.status(400).json({ error: 'content required' });
  res.setHeader('Content-Type', type === 'html' ? 'text/html' : 'text/plain');
  res.send(content);
});

app.listen(PORT, () => {
  console.log(`PIXEL FORGE API Server running on http://localhost:${PORT}`);
  console.log(`Modules: AssetManager, SceneManager, EffectRegistry, DocPlanner, SelectDraft, DatasetManager, TrainingPipeline, EmptyChain`);
  console.log(`Senik: ${SENIK_DIR}`);
  console.log(`Scenes: ${sceneManager.list().length} | Effects: ${effectRegistry.listAll().total} | Drafts: ${docPlanner.getStats().total}`);
  console.log(`Datasets: ${datasetManager.getStats().totalDatasets} | Nodes: ${trainingPipeline.nodes.size} | Chains: ${emptyChain.getStats().totalChains}`);
});