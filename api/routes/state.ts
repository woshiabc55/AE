import { Router } from 'express';
import { themeStore } from '../store/themeStore.js';

export const stateRouter = Router();

/** GET /api/state - 全局状态 */
stateRouter.get('/state', (_req, res) => {
  res.json(themeStore.getState());
});

/** POST /api/state/intensity - 滚轮调节 */
stateRouter.post('/state/intensity', (req, res) => {
  const { value } = req.body as { value?: number };
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return res.status(400).json({ error: 'value must be number' });
  }
  res.json(themeStore.setIntensity(value));
});
