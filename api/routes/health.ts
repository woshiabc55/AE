import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    version: '1.0.0',
    ts: Date.now(),
  });
});
