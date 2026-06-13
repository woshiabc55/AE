import { Router } from 'express';
import { themeStore } from '../store/themeStore.js';
import type { Theme } from '../types.js';

export const themeRouter = Router();

/** GET /api/theme - 获取当前主题 */
themeRouter.get('/theme', (_req, res) => {
  res.json({
    theme: themeStore.getTheme(),
    available: themeStore.listThemes(),
  });
});

/** POST /api/theme - 更新主题（部分字段） */
themeRouter.post('/theme', (req, res) => {
  const body = req.body as Partial<Theme> & { id?: string };
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }
  const next = themeStore.updateTheme(body);
  res.json({ theme: next });
});
