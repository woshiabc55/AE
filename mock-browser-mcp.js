#!/usr/bin/env node
/**
 * 模拟浏览器 MCP Server（仅用于 Demo 测试）
 * 实现了与 Playwright MCP / integrated_browser 类似的工具接口：
 * - browser_navigate
 * - browser_snapshot
 * - browser_click
 * - browser_type
 * - browser_take_screenshot
 * - browser_evaluate
 * - browser_navigate_back
 */

const readline = require('readline');

let currentUrl = 'about:blank';
let history = [];
let title = 'Mock Page';
let snapshotCounter = 0;

function send(message) {
  console.log(JSON.stringify(message));
}

function sendResult(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

const tools = [
  {
    name: 'browser_navigate',
    description: '导航到指定 URL',
    inputSchema: {
      type: 'object',
      properties: { url: { type: 'string', description: '目标 URL' } },
      required: ['url'],
    },
  },
  {
    name: 'browser_navigate_back',
    description: '浏览器后退',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'browser_snapshot',
    description: '获取当前页面可访问性快照',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'browser_click',
    description: '点击页面元素',
    inputSchema: {
      type: 'object',
      properties: {
        ref: { type: 'string', description: '元素 ref' },
        selector: { type: 'string', description: 'CSS 选择器' },
      },
    },
  },
  {
    name: 'browser_type',
    description: '在输入框中输入文本',
    inputSchema: {
      type: 'object',
      properties: {
        ref: { type: 'string', description: '元素 ref' },
        selector: { type: 'string', description: 'CSS 选择器' },
        text: { type: 'string', description: '输入文本' },
      },
    },
  },
  {
    name: 'browser_take_screenshot',
    description: '截取当前页面屏幕',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'browser_evaluate',
    description: '在当前页面执行 JavaScript',
    inputSchema: {
      type: 'object',
      properties: {
        script: { type: 'string', description: 'JS 代码' },
      },
      required: ['script'],
    },
  },
];

function handleCallTool(id, params) {
  const { name, arguments: args } = params;
  snapshotCounter += 1;

  switch (name) {
    case 'browser_navigate': {
      if (!args.url) return sendError(id, -32602, '缺少 url 参数');
      history.push(currentUrl);
      currentUrl = args.url;
      title = `Mock Page - ${currentUrl}`;
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `已导航到 ${currentUrl}\n标题: ${title}`,
          },
        ],
      });
    }

    case 'browser_navigate_back': {
      const prev = history.pop() || 'about:blank';
      currentUrl = prev;
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `已后退到 ${currentUrl}`,
          },
        ],
      });
    }

    case 'browser_snapshot': {
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `Page: ${currentUrl}\n- heading "${title}" [ref=e1]\n- textbox "Search" [ref=e${snapshotCounter + 2}]\n- button "Submit" [ref=e${snapshotCounter + 3}]\n- link "About" [ref=e${snapshotCounter + 4}]`,
          },
        ],
      });
    }

    case 'browser_click': {
      const target = args.ref || args.selector || 'unknown';
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `已点击元素: ${target}`,
          },
        ],
      });
    }

    case 'browser_type': {
      const target = args.ref || args.selector || 'unknown';
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `已在 ${target} 输入: ${args.text || ''}`,
          },
        ],
      });
    }

    case 'browser_take_screenshot': {
      // 返回一个 1x1 像素的透明 PNG base64
      const pngBase64 =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      return sendResult(id, {
        content: [
          {
            type: 'image',
            data: pngBase64,
            mimeType: 'image/png',
          },
          {
            type: 'text',
            text: `截图完成: ${currentUrl}`,
          },
        ],
      });
    }

    case 'browser_evaluate': {
      const script = args.script || '';
      let result;
      try {
        // 仅模拟部分常用表达式
        if (script.includes('document.title')) result = title;
        else if (script.includes('location.href')) result = currentUrl;
        else if (script.includes('document.querySelector')) result = { mock: true, found: true };
        else result = { evaluated: script, mock: true };
      } catch (e) {
        return sendError(id, -32603, e.message);
      }
      return sendResult(id, {
        content: [
          {
            type: 'text',
            text: `执行结果: ${JSON.stringify(result)}`,
          },
        ],
      });
    }

    default:
      return sendError(id, -32601, `未知工具: ${name}`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch (e) {
    return sendError(null, -32700, 'Parse error');
  }

  const { id, method, params } = msg;

  if (method === 'initialize') {
    sendResult(id, {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'mock-browser-mcp', version: '1.0.0' },
    });
  } else if (method === 'notifications/initialized') {
    // no-op
  } else if (method === 'tools/list') {
    sendResult(id, { tools });
  } else if (method === 'tools/call') {
    handleCallTool(id, params);
  } else {
    sendError(id, -32601, `Method not found: ${method}`);
  }
});
