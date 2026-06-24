import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { Brain, TrendingUp, PieChartIcon, Smile, Lightbulb, History } from 'lucide-react';
import { useAnalysis } from '../../hooks/useMemes';
import type { TrendData, CategoryData, SentimentData, GenerationData } from '../../types';

const COLORS = ['#e94560', '#0f3460', '#533483', '#4ecdc4', '#ff6b35', '#ffe66d', '#a8e6cf', '#ff8b94'];

export default function AnalyzeDashboard() {
  const { analyses, analyzing, runAnalysis } = useAnalysis();
  const [activeAnalysis, setActiveAnalysis] = useState<Record<string, unknown> | null>(null);

  const latestTrend = analyses.find(a => a.type === 'trend')?.data as TrendData | undefined;
  const latestCategory = analyses.find(a => a.type === 'category')?.data as CategoryData | undefined;
  const latestSentiment = analyses.find(a => a.type === 'sentiment')?.data as SentimentData | undefined;
  const latestGen = analyses.find(a => a.type === 'generation')?.data as GenerationData | undefined;

  const analysisCards = [
    { key: 'trends', label: '热度趋势', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { key: 'categories', label: '分类统计', icon: PieChartIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { key: 'sentiment', label: '情感分析', icon: Smile, color: 'text-green-400', bg: 'bg-green-400/10' },
    { key: 'generate', label: 'AI灵感', icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 分析按钮 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {analysisCards.map(card => (
          <button
            key={card.key}
            onClick={() => {
              const body = card.key === 'generate' ? { tags: ['搞笑', 'AI'] } : undefined;
              runAnalysis(card.key, body).then(result => {
                if (result) setActiveAnalysis(result.data as Record<string, unknown>);
              });
            }}
            disabled={analyzing}
            className="glass p-4 text-center hover:border-accent/50 transition-all disabled:opacity-50 group"
          >
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <card.icon size={20} className={card.color} />
            </div>
            <span className="text-sm font-medium">{card.label}</span>
            {analyzing && (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full ml-1 align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* 分析结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 热度趋势 */}
        {latestTrend && (
          <div className="glass p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-400" /> 热度趋势
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{latestTrend.totalMemes}</div>
                <div className="text-xs text-text-dim">梗图总数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{latestTrend.avgHotScore.toFixed(0)}</div>
                <div className="text-xs text-text-dim">平均热度</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{latestTrend.topTags.length}</div>
                <div className="text-xs text-text-dim">热门标签</div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latestTrend.topTags.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#a0a0b0' }} />
                  <YAxis type="category" dataKey="tag" width={60} tick={{ fontSize: 10, fill: '#a0a0b0' }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#e94560" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 分类统计 */}
        {latestCategory && (
          <div className="glass p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <PieChartIcon size={16} className="text-blue-400" /> 分类统计
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={latestCategory.categories.slice(0, 8)}
                    dataKey="count"
                    nameKey="tag"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ tag, percentage }) => `${tag} ${percentage}%`}
                    labelLine={false}
                  >
                    {latestCategory.categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 情感分析 */}
        {latestSentiment && (
          <div className="glass p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Smile size={16} className="text-green-400" /> 情感分析
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-dim">整体情感倾向</span>
                <span className="text-xs font-mono text-accent">{(latestSentiment.overall * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all"
                  style={{ width: `${latestSentiment.overall * 100}%` }}
                />
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: '积极', value: latestSentiment.distribution.positive, fill: '#4ecdc4' },
                  { name: '中性', value: latestSentiment.distribution.neutral, fill: '#ffe66d' },
                  { name: '消极', value: latestSentiment.distribution.negative, fill: '#e94560' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a0a0b0' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#a0a0b0' }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[
                      { name: '积极', value: latestSentiment.distribution.positive },
                      { name: '中性', value: latestSentiment.distribution.neutral },
                      { name: '消极', value: latestSentiment.distribution.negative },
                    ].map((entry, i) => (
                      <Cell key={i} fill={['#4ecdc4', '#ffe66d', '#e94560'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AI灵感 */}
        {latestGen && (
          <div className="glass p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-purple-400" /> AI灵感生成
            </h3>
            <div className="bg-surface rounded-xl p-4 space-y-3">
              <div>
                <span className="text-xs text-text-dim">灵感标题</span>
                <p className="font-semibold text-lg">{latestGen.idea.title}</p>
              </div>
              <div>
                <span className="text-xs text-text-dim">描述</span>
                <p className="text-text-dim">{latestGen.idea.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {latestGen.idea.tags.map(tag => (
                  <span key={tag} className="bg-purple-400/20 text-purple-400 px-2 py-0.5 rounded-full text-xs">{tag}</span>
                ))}
              </div>
              <p className="text-xs text-text-dim">
                生成时间: {new Date(latestGen.generatedAt).toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 分析历史 */}
      {analyses.length > 0 && (
        <div className="glass p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <History size={16} className="text-text-dim" /> 分析历史
          </h3>
          <div className="space-y-2">
            {analyses.slice(0, 10).map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm bg-surface rounded-xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    a.type === 'trend' ? 'bg-orange-400' :
                    a.type === 'category' ? 'bg-blue-400' :
                    a.type === 'sentiment' ? 'bg-green-400' : 'bg-purple-400'
                  }`} />
                  <span className="text-text-dim">
                    {a.type === 'trend' ? '热度趋势' :
                     a.type === 'category' ? '分类统计' :
                     a.type === 'sentiment' ? '情感分析' : 'AI灵感'}
                  </span>
                </div>
                <span className="text-xs text-text-dim font-mono">
                  {new Date(a.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!latestTrend && !latestCategory && !latestSentiment && !latestGen && (
        <div className="text-center py-16 text-text-dim">
          <Brain size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">点击上方按钮启动 AI 分析</p>
          <p className="text-sm mt-1">AI 将通过 MCP 工具分析梗图数据并生成可视化报告</p>
        </div>
      )}
    </div>
  );
}