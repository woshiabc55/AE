/**
 * Express 入口
 * 端口：8787（开发）；生产可由环境变量 PORT 覆盖
 */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { themeRouter } from './routes/theme.js';
import { stateRouter } from './routes/state.js';
import { healthRouter } from './routes/health.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT ?? 8787);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '128kb' }));

// API 路由
app.use('/api', themeRouter);
app.use('/api', stateRouter);
app.use('/api', healthRouter);

// 静态资源（生产环境：服务 vite build 产物）
const distDir = resolve(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
  console.log(`[server] serving static from ${distDir}`);
} else {
  console.log('[server] dist/ not found — run `pnpm build` to enable static serving');
}

// 全局错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] error:', err);
  res.status(500).json({ error: err.message ?? 'internal error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] industrial-fantasy api listening on http://0.0.0.0:${PORT}`);
});
