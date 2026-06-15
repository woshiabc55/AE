import express, { Request, Response } from 'express';
import cors from 'cors';
import { Router as LLMRouter } from './providers';
import { ExecutionEngine } from './engine';
import { Workflow } from './types';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const llm = new LLMRouter();
const engine = new ExecutionEngine();

// 持久化目录
const dataDir = path.join(os.homedir(), '.flowforge');
const frameworksDir = path.join(dataDir, 'frameworks');
const workflowsDir = path.join(dataDir, 'workflows');
fs.mkdirSync(frameworksDir, { recursive: true });
fs.mkdirSync(workflowsDir, { recursive: true });

// === 大模型路由 ===
app.get('/api/providers', (_req, res) => {
  res.json({ providers: llm.list() });
});

app.post('/api/ping', async (req: Request, res: Response) => {
  const { provider } = req.body || {};
  const r = await llm.health(provider || 'mock');
  res.json(r);
});

// === 框架(模板)持久化 ===
app.get('/api/framework/list', (_req, res) => {
  const items = fs
    .readdirSync(frameworksDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(frameworksDir, f), 'utf-8'));
      return { id: data.id, name: data.name, category: data.category, updated_at: data.updated_at };
    });
  res.json({ frameworks: items });
});

app.get('/api/framework/:id', (req, res) => {
  const f = path.join(frameworksDir, req.params.id + '.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf-8')));
});

app.post('/api/framework/save', (req, res) => {
  const w = req.body as Workflow & { id: string; name: string; category?: string };
  if (!w || !w.id) return res.status(400).json({ error: 'missing id' });
  const data = { ...w, updated_at: new Date().toISOString() };
  fs.writeFileSync(path.join(frameworksDir, w.id + '.json'), JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.delete('/api/framework/:id', (req, res) => {
  const f = path.join(frameworksDir, req.params.id + '.json');
  if (fs.existsSync(f)) fs.unlinkSync(f);
  res.json({ ok: true });
});

// === 工作流持久化 ===
app.get('/api/workflow/list', (_req, res) => {
  const items = fs
    .readdirSync(workflowsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(workflowsDir, f), 'utf-8'));
      return { id: data.id, name: data.name, updated_at: data.updated_at };
    });
  res.json({ workflows: items });
});

app.post('/api/workflow/save', (req, res) => {
  const w = req.body as Workflow & { id: string; name: string };
  if (!w || !w.id) return res.status(400).json({ error: 'missing id' });
  const data = { ...w, updated_at: new Date().toISOString() };
  fs.writeFileSync(path.join(workflowsDir, w.id + '.json'), JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// === 执行(SSE 流式) ===
app.post('/api/run', (req, res) => {
  const { workflow, inputs } = req.body as { workflow: Workflow; inputs?: Record<string, string> };
  if (!workflow) return res.status(400).json({ error: 'missing workflow' });
  const id = engine.runId(workflow, inputs || {});
  res.json({ runId: id });
});

app.get('/api/stream/:id', (req, res) => {
  const id = req.params.id;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const off = engine.subscribe(id, (e) => {
    res.write(`data: ${JSON.stringify(e)}\n\n`);
    if (e.type === 'end' || e.type === 'error') {
      // 保留连接,前端主动断开
    }
  });
  // 心跳
  const hb = setInterval(() => res.write(`: ping\n\n`), 15000);
  req.on('close', () => {
    clearInterval(hb);
    off();
  });
});

app.post('/api/run/:id/abort', (req, res) => {
  engine.abort(req.params.id);
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'flowforge-backend', port: PORT });
});

const PORT = Number(process.env.FLOWFORGE_PORT) || 4317;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[flowforge] backend listening on http://127.0.0.1:${PORT}`);
});
