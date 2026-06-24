import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import type { Meme } from '../types.js';
import {
  getAllMemes, getMemeById, searchMemes, addMeme,
  updateMeme, deleteMeme, getAnalyses, getUploadsDir,
} from '../store.js';
import {
  analyzeTrends, analyzeCategories, generateMemeIdea, analyzeSentiment,
} from '../services/ai.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, getUploadsDir()),
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop() || 'png';
    cb(null, `${uuid()}.${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// 获取所有梗图
router.get('/', (_req, res) => {
  res.json(getAllMemes());
});

// 搜索梗图
router.get('/search', (req, res) => {
  const q = req.query.q as string || '';
  res.json(searchMemes(q));
});

// 获取单个梗图
router.get('/:id', (req, res) => {
  const meme = getMemeById(req.params.id);
  if (!meme) return res.status(404).json({ error: 'Meme not found' });
  res.json(meme);
});

// 上传梗图
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file' });

  const imageUrl = `/uploads/${req.file.filename}`;
  const { title, description, tags, source } = req.body;

  const meme: Meme = {
    id: uuid(),
    title: title || '未命名梗图',
    description: description || '',
    tags: tags ? JSON.parse(tags) : [],
    imageUrl,
    source: source || 'user_upload',
    width: 0,
    height: 0,
    hotScore: Math.floor(Math.random() * 50) + 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addMeme(meme);
  res.status(201).json(meme);
});

// 创建梗图（纯文本，无需图片）
router.post('/create', (req, res) => {
  const { title, description, tags, source } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const meme: Meme = {
    id: uuid(),
    title,
    description: description || '',
    tags: tags || [],
    imageUrl: '',
    source: source || 'text_created',
    width: 0,
    height: 0,
    hotScore: Math.floor(Math.random() * 50) + 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addMeme(meme);
  res.status(201).json(meme);
});

// 更新梗图
router.patch('/:id', (req, res) => {
  const updated = updateMeme(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Meme not found' });
  res.json(updated);
});

// 删除梗图
router.delete('/:id', (req, res) => {
  const ok = deleteMeme(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Meme not found' });
  res.json({ success: true });
});

// AI 分析接口
router.post('/analyze/trends', (req, res) => {
  const memes = getAllMemes();
  const analysis = analyzeTrends(memes);
  res.json(analysis);
});

router.post('/analyze/categories', (req, res) => {
  const memes = getAllMemes();
  const analysis = analyzeCategories(memes);
  res.json(analysis);
});

router.post('/analyze/sentiment', (req, res) => {
  const memes = getAllMemes();
  const analysis = analyzeSentiment(memes);
  res.json(analysis);
});

router.post('/analyze/generate', (req, res) => {
  const tags = req.body.tags || [];
  const analysis = generateMemeIdea(tags);
  res.json(analysis);
});

// 获取分析历史
router.get('/analyze/history', (_req, res) => {
  res.json(getAnalyses());
});

export default router;