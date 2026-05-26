#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { WebSearchTool } from './tools/web-search.js';
import { CodeSearchTool } from './tools/code-search.js';
import { DocSearchTool } from './tools/doc-search.js';
import { FileSearchTool } from './tools/file-search.js';
import { ApiSearchTool } from './tools/api-search.js';
import { KnowledgeBaseTool } from './tools/knowledge-base.js';

const server = new Server(
  {
    name: 'mcp-ai-search',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

const tools = [
  new WebSearchTool(),
  new CodeSearchTool(),
  new DocSearchTool(),
  new FileSearchTool(),
  new ApiSearchTool(),
  new KnowledgeBaseTool(),
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(t => t.getDefinition()),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const tool = tools.find(t => t.name === name);
  if (!tool) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await tool.execute(args);
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error executing ${name}: ${error.message}` }],
      isError: true,
    };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'search://cache',
      name: 'Search Cache',
      description: 'Cached search results from previous queries',
      mimeType: 'application/json',
    },
    {
      uri: 'search://history',
      name: 'Search History',
      description: 'History of all search queries',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'search://cache') {
    const cache = {};
    tools.forEach(t => { cache[t.name] = t.getCache(); });
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(cache, null, 2) }] };
  }

  if (uri === 'search://history') {
    const history = [];
    tools.forEach(t => { history.push(...t.getHistory()); });
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(history, null, 2) }] };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP AI Search Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
