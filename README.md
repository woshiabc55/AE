# 浏览器 MCP 自动化 Demo

一个基于 MCP（Model Context Protocol）的浏览器自动化 Demo。后端使用 Node.js + Express + `@modelcontextprotocol/sdk` 连接浏览器 MCP Server，前端提供 Web 面板进行可视化操作。

## 类似工具整理

| 工具 | 技术栈 | 特点 | 适用场景 |
|------|--------|------|----------|
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Node.js / Playwright | 微软官方，使用可访问性树，LLM 友好，70+ 工具 | 可靠结构化自动化、测试 |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Node.js / Puppeteer | 官方 CDP 标准，支持性能分析、网络调试 | CI/CD、性能审计 |
| [browser-use MCP](https://github.com/Saik0s/mcp-browser-use) | Python / Playwright | 自然语言控制浏览器，支持深度研究 | AI Agent、复杂多步任务 |
| [Puppeteer MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) | Node.js / Puppeteer | Google 维护，API 简洁 | Chrome 自动化、轻量任务 |
| [Scrapeless Browser MCP](https://www.scrapeless.com/zh/blog/mcp-integration-guide) | 云服务 | 零本地部署，全球 IP，反检测 | 大规模并行、复杂网站 |
| TRAE `integrated_browser` MCP | Node.js | 当前环境内置，支持导航/点击/截图/执行 JS | IDE 内浏览器自动化 |

## 功能

- 连接任意浏览器 MCP Server（默认使用 `@playwright/mcp`）
- 页面导航、获取快照、截图
- 元素点击、文本输入
- 执行页面内 JavaScript
- 通用工具调用接口
- Web 可视化面板

## 快速开始

```bash
npm install

# 使用内置模拟浏览器 MCP Server 运行 Demo（无需下载浏览器）
npm run demo

# 或使用真实浏览器 MCP Server（需先安装浏览器二进制文件）
npm start
```

打开 http://localhost:3000 即可使用。

## 运行模式说明

- `npm run demo`：启动模拟浏览器 MCP Server（`mock-browser-mcp.js`），无需下载 Chrome/Chromium，适合快速体验 MCP 调用流程。
- `npm start`：默认连接 `@playwright/mcp`（stdio 传输），需先安装 Playwright 浏览器（`npx playwright install chromium`）。

## 接入其他 MCP Server

通过环境变量切换 MCP Server：

```bash
# 接入 Playwright MCP
npm start

# 接入本地 stdio MCP Server（用 ; 分隔参数）
MCP_COMMAND=node MCP_ARGS="mock-browser-mcp.js" npm start

# 接入其他 npx  MCP Server
MCP_COMMAND=npx MCP_ARGS="-y;@playwright/mcp@latest;--headless" npm start
```

## 项目结构

```
.
├── server.js              # Express + MCP 客户端
├── mock-browser-mcp.js    # 模拟浏览器 MCP Server（Demo 用）
├── test.js                # API 测试脚本
├── public/
│   ├── index.html         # 前端页面
│   ├── app.js             # 前端逻辑
│   └── style.css          # 样式
├── package.json
└── README.md
```

## 依赖

- Node.js >= 18
- npm
- `@modelcontextprotocol/sdk`
- `express`

## 许可证

MIT
