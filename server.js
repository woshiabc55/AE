const express = require('express');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let client = null;
let transport = null;
let mcpStatus = { connected: false, error: null, tools: [] };

// 默认使用 Playwright MCP 作为浏览器自动化后端
// 如需接入其他 MCP Server（如 integrated_browser），可修改 MCP_COMMAND / MCP_ARGS 环境变量
const MCP_COMMAND = process.env.MCP_COMMAND || 'npx';
const MCP_ARGS = process.env.MCP_ARGS
  ? process.env.MCP_ARGS.split(/[;\s]+/).filter(Boolean)
  : ['-y', '@playwright/mcp@latest', '--headless'];

async function initMcpClient() {
  try {
    console.log(`[MCP] 启动浏览器 MCP Server: ${MCP_COMMAND} ${MCP_ARGS.join(' ')}`);
    transport = new StdioClientTransport({
      command: MCP_COMMAND,
      args: MCP_ARGS,
      stderr: 'pipe',
    });

    client = new Client(
      { name: 'browser-mcp-demo', version: '1.0.0' },
      { capabilities: {} }
    );

    transport.stderr.on('data', (data) => {
      console.log(`[MCP Server stderr] ${data.toString().trim()}`);
    });

    await client.connect(transport);

    const toolsResult = await client.listTools();
    mcpStatus = {
      connected: true,
      error: null,
      tools: toolsResult.tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    };
    console.log(`[MCP] 已连接，可用工具数: ${mcpStatus.tools.length}`);
  } catch (err) {
    mcpStatus = { connected: false, error: err.message, tools: [] };
    console.error('[MCP] 连接失败:', err.message);
  }
}

// 健康检查 / 状态
app.get('/api/status', (req, res) => {
  res.json(mcpStatus);
});

// 列出工具
app.get('/api/tools', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  try {
    const result = await client.listTools();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 调用工具（通用接口）
app.post('/api/call', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  const { name, args } = req.body;
  if (!name) return res.status(400).json({ error: '缺少 tool name' });
  try {
    const result = await client.callTool({ name, arguments: args || {} });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：导航到指定 URL
app.post('/api/navigate', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: '缺少 url' });
  try {
    const result = await client.callTool({
      name: 'browser_navigate',
      arguments: { url },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：获取页面快照
app.post('/api/snapshot', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  try {
    const result = await client.callTool({
      name: 'browser_snapshot',
      arguments: {},
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：截图
app.post('/api/screenshot', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  try {
    const result = await client.callTool({
      name: 'browser_take_screenshot',
      arguments: {},
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：点击元素
app.post('/api/click', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  const { ref, selector } = req.body;
  try {
    const result = await client.callTool({
      name: 'browser_click',
      arguments: { ref, selector },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：输入文本
app.post('/api/type', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  const { ref, selector, text } = req.body;
  try {
    const result = await client.callTool({
      name: 'browser_type',
      arguments: { ref, selector, text },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 便捷接口：执行 JS
app.post('/api/evaluate', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'MCP 尚未初始化' });
  const { script } = req.body;
  if (!script) return res.status(400).json({ error: '缺少 script' });
  try {
    const result = await client.callTool({
      name: 'browser_evaluate',
      arguments: { script },
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

initMcpClient().then(() => {
  app.listen(PORT, () => {
    console.log(`[HTTP] 浏览器 MCP Demo 已启动: http://localhost:${PORT}`);
  });
});

process.on('SIGINT', async () => {
  if (transport) await transport.close();
  process.exit(0);
});
