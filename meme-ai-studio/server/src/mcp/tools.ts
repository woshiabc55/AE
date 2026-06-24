import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getAllMemes, searchMemes, addMeme, deleteMeme, getAnalyses } from '../store.js';
import { analyzeTrends, analyzeCategories, generateMemeIdea, analyzeSentiment } from '../services/ai.js';
import type { Meme } from '../types.js';
import { v4 as uuid } from 'uuid';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'meme-ai-studio',
    version: '1.0.0',
  });

  // 工具：搜索梗图
  server.tool(
    'search_memes',
    '搜索梗图库，支持按标题、描述、标签搜索',
    { query: z.string().describe('搜索关键词') },
    async ({ query }) => {
      const results = searchMemes(query);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(results.map(m => ({
            id: m.id, title: m.title, description: m.description,
            tags: m.tags, hotScore: m.hotScore, source: m.source,
          })), null, 2),
        }],
      };
    }
  );

  // 工具：获取所有梗图
  server.tool(
    'list_all_memes',
    '获取所有梗图列表',
    {},
    async () => {
      const memes = getAllMemes();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(memes.map(m => ({
            id: m.id, title: m.title, tags: m.tags,
            hotScore: m.hotScore, source: m.source,
          })), null, 2),
        }],
      };
    }
  );

  // 工具：创建梗图
  server.tool(
    'create_meme',
    '创建一条新的梗图记录',
    {
      title: z.string().describe('梗图标题'),
      description: z.string().optional().describe('梗图描述'),
      tags: z.array(z.string()).optional().describe('标签列表'),
      source: z.string().optional().describe('来源'),
    },
    async ({ title, description, tags, source }) => {
      const meme: Meme = {
        id: uuid(),
        title,
        description: description || '',
        tags: tags || [],
        imageUrl: '',
        source: source || 'mcp_created',
        width: 0,
        height: 0,
        hotScore: Math.floor(Math.random() * 30) + 70,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addMeme(meme);
      return {
        content: [{ type: 'text', text: `梗图创建成功: ${JSON.stringify(meme, null, 2)}` }],
      };
    }
  );

  // 工具：删除梗图
  server.tool(
    'delete_meme',
    '删除指定梗图',
    { id: z.string().describe('梗图ID') },
    async ({ id }) => {
      const ok = deleteMeme(id);
      return {
        content: [{ type: 'text', text: ok ? `梗图 ${id} 已删除` : `梗图 ${id} 不存在` }],
      };
    }
  );

  // 工具：AI 趋势分析
  server.tool(
    'analyze_meme_trends',
    'AI分析梗图趋势：热门标签、热度排行、平均热度',
    {},
    async () => {
      const memes = getAllMemes();
      const analysis = analyzeTrends(memes);
      return {
        content: [{ type: 'text', text: JSON.stringify(analysis.data, null, 2) }],
      };
    }
  );

  // 工具：AI 分类分析
  server.tool(
    'analyze_meme_categories',
    'AI分析梗图分类：按标签统计分布',
    {},
    async () => {
      const memes = getAllMemes();
      const analysis = analyzeCategories(memes);
      return {
        content: [{ type: 'text', text: JSON.stringify(analysis.data, null, 2) }],
      };
    }
  );

  // 工具：AI 生成梗图灵感
  server.tool(
    'generate_meme_idea',
    'AI生成梗图创意灵感',
    {
      tags: z.array(z.string()).optional().describe('参考标签'),
    },
    async ({ tags }) => {
      const analysis = generateMemeIdea(tags || []);
      return {
        content: [{ type: 'text', text: JSON.stringify(analysis.data, null, 2) }],
      };
    }
  );

  // 工具：AI 情感分析
  server.tool(
    'analyze_meme_sentiment',
    'AI分析梗图情感倾向',
    {},
    async () => {
      const memes = getAllMemes();
      const analysis = analyzeSentiment(memes);
      return {
        content: [{ type: 'text', text: JSON.stringify(analysis.data, null, 2) }],
      };
    }
  );

  // 工具：获取分析历史
  server.tool(
    'get_analysis_history',
    '获取AI分析历史记录',
    {},
    async () => {
      const analyses = getAnalyses();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(analyses.map(a => ({
            id: a.id, type: a.type, createdAt: a.createdAt,
          })), null, 2),
        }],
      };
    }
  );

  return server;
}