import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp/tools.js';
import memeRoutes from './routes/memes.js';
import { getUploadsDir } from './store.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// 确保上传目录存在
const uploadsDir = getUploadsDir();
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json());

// 静态文件 - 上传的图片
app.use('/uploads', express.static(uploadsDir));

// API 路由
app.use('/api/memes', memeRoutes);

// MCP 端点 - 每次请求创建新的 server 实例
const handleMcp = async (req: express.Request, res: express.Response) => {
  try {
    const mcpServer = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res);
  } catch (err) {
    console.error('MCP 请求处理失败:', err);
    res.status(500).json({ error: 'MCP server error' });
  }
};

app.post('/mcp', handleMcp);
app.get('/mcp', handleMcp);
app.delete('/mcp', handleMcp);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'meme-ai-studio', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`\n  🎨 梗图AI工坊 已启动`);
  console.log(`  📡 API 服务: http://localhost:${PORT}/api`);
  console.log(`  🔧 MCP 端点: http://localhost:${PORT}/mcp`);
  console.log(`  🖼️  图片静态: http://localhost:${PORT}/uploads`);
  console.log();
});

export default app;