import type { Meme, AIAnalysis } from '../types.js';
import { addAnalysis } from '../store.js';

// 模拟 AI 分析 - 热度趋势分析
export function analyzeTrends(memes: Meme[]): AIAnalysis {
  const tagsCount: Record<string, number> = {};
  for (const m of memes) {
    for (const t of m.tags) {
      tagsCount[t] = (tagsCount[t] || 0) + 1;
    }
  }

  const sortedTags = Object.entries(tagsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const analysis: AIAnalysis = {
    id: `trend-${Date.now()}`,
    type: 'trend',
    data: {
      totalMemes: memes.length,
      topTags: sortedTags.map(([tag, count]) => ({ tag, count })),
      avgHotScore: memes.length > 0
        ? memes.reduce((sum, m) => sum + m.hotScore, 0) / memes.length
        : 0,
      hotMemes: memes
        .sort((a, b) => b.hotScore - a.hotScore)
        .slice(0, 5)
        .map(m => ({ id: m.id, title: m.title, hotScore: m.hotScore })),
    },
    createdAt: new Date().toISOString(),
  };

  return addAnalysis(analysis);
}

// 模拟 AI 分类分析
export function analyzeCategories(memes: Meme[]): AIAnalysis {
  const categories: Record<string, Meme[]> = {};
  for (const m of memes) {
    for (const t of m.tags) {
      if (!categories[t]) categories[t] = [];
      categories[t].push(m);
    }
  }

  const analysis: AIAnalysis = {
    id: `category-${Date.now()}`,
    type: 'category',
    data: {
      categories: Object.entries(categories).map(([tag, items]) => ({
        tag,
        count: items.length,
        percentage: memes.length > 0 ? (items.length / memes.length * 100).toFixed(1) : '0',
      })),
    },
    createdAt: new Date().toISOString(),
  };

  return addAnalysis(analysis);
}

// 模拟 AI 生成梗图描述
export function generateMemeIdea(tags: string[]): AIAnalysis {
  const templates = [
    { title: '当AI学会写代码', desc: '程序员集体失业的第一天', tags: ['AI', '程序员', '搞笑'] },
    { title: '调试代码的我', desc: '一行console.log走天下', tags: ['编程', '调试', '日常'] },
    { title: '产品经理的需求', desc: '这个需求很简单，怎么实现我不管', tags: ['产品', '职场', '吐槽'] },
    { title: '开源项目维护者', desc: 'PR越来越多，头发越来越少', tags: ['开源', 'GitHub', '程序员'] },
    { title: '周一早上的我', desc: '灵魂还在周末，身体已在工位', tags: ['职场', '日常', '周一'] },
    { title: 'AI绘画翻车现场', desc: '我想要的 vs AI给我的', tags: ['AI', '绘画', '搞笑'] },
    { title: '代码审查时', desc: '这段代码是谁写的？git blame一下', tags: ['编程', '代码审查', '日常'] },
    { title: '周五下班前', desc: 'git push --force 然后跑路', tags: ['职场', '周五', '程序员'] },
  ];

  const picked = templates[Math.floor(Math.random() * templates.length)];

  const analysis: AIAnalysis = {
    id: `generation-${Date.now()}`,
    type: 'generation',
    data: {
      idea: picked,
      basedOn: tags,
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  return addAnalysis(analysis);
}

// 模拟 AI 情感分析
export function analyzeSentiment(memes: Meme[]): AIAnalysis {
  const sentimentMap: Record<string, number> = {
    '搞笑': 0.9, '吐槽': 0.6, '日常': 0.5, '职场': 0.4,
    '治愈': 0.8, '悲伤': 0.2, '愤怒': 0.3, '感动': 0.7,
  };

  const sentiments = memes.map(m => {
    let score = 0.5;
    for (const tag of m.tags) {
      if (sentimentMap[tag] !== undefined) {
        score = sentimentMap[tag];
      }
    }
    return { id: m.id, title: m.title, score };
  });

  const analysis: AIAnalysis = {
    id: `sentiment-${Date.now()}`,
    type: 'sentiment',
    data: {
      overall: sentiments.length > 0
        ? sentiments.reduce((s, m) => s + m.score, 0) / sentiments.length
        : 0.5,
      distribution: {
        positive: sentiments.filter(m => m.score > 0.6).length,
        neutral: sentiments.filter(m => m.score >= 0.4 && m.score <= 0.6).length,
        negative: sentiments.filter(m => m.score < 0.4).length,
      },
      details: sentiments,
    },
    createdAt: new Date().toISOString(),
  };

  return addAnalysis(analysis);
}