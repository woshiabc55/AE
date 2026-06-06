import Hero from '../components/Hero';
import StatsDashboard from '../components/StatsDashboard';
import HotIPCarousel from '../components/HotIPCarousel';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Layers, Cpu, Search, Database, BarChart3 } from 'lucide-react';
import { WORK_TYPE_LABELS } from '../data/types';
import { useMemo } from 'react';
import { WORKS } from '../data/works';

export default function Home() {
  const typeStats = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of WORKS) m.set(w.type, (m.get(w.type) || 0) + 1);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="relative">
      <Hero />

      {/* 数据条 */}
      <section id="stats" className="pb-20 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative">
          <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-6">
            <Database className="w-3.5 h-3.5" />
            <span>// STATISTICS_DASHBOARD</span>
          </div>
          <StatsDashboard />
        </div>
      </section>

      <HotIPCarousel />

      {/* 类型分布 */}
      <section className="py-16 relative">
        <div className="container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-neon-pink font-mono text-xs mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>// TYPE_DISTRIBUTION</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
                衍生类型分布
              </h2>
            </div>
            <Link to="/browse" className="btn-neon btn-pink text-xs">
              按类型浏览
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {typeStats.map(([t, n], i) => {
              const max = typeStats[0][1];
              const pct = (n / max) * 100;
              return (
                <Link
                  key={t}
                  to={`/browse?type=${t}`}
                  className="card-neon p-4 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs text-white/50 font-mono">
                      // 0{i + 1}
                    </div>
                    <div className="text-xs font-mono text-neon-cyan">
                      {n.toLocaleString()}
                    </div>
                  </div>
                  <div className="font-semibold text-white/90 group-hover:text-neon-cyan transition">
                    {WORK_TYPE_LABELS[t as keyof typeof WORK_TYPE_LABELS]}
                  </div>
                  <div className="mt-2 h-1 bg-white/5 rounded overflow-hidden">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center gap-2 text-neon-violet font-mono text-xs mb-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>// FEATURES</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-neon mb-10">
            强大功能 / 一站式浏览体验
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Search className="w-5 h-5" />}
              color="text-neon-cyan"
              border="border-neon-cyan/30"
              title="多维检索"
              desc="按 IP、类型、年份、地区、标签、关键词精准筛选，毫秒级响应。"
            />
            <FeatureCard
              icon={<Database className="w-5 h-5" />}
              color="text-neon-pink"
              border="border-neon-pink/30"
              title="海量数据"
              desc="覆盖 350+ 主流游戏 IP，4000+ 款衍生作品，记录每一份创作的可能。"
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              color="text-neon-violet"
              border="border-neon-violet/30"
              title="数据看板"
              desc="可视化展示类型分布、地区趋势、年份演进，看见 IP 生态全貌。"
            />
          </div>
        </div>
      </section>

      {/* 行动区 */}
      <section className="py-16">
        <div className="container">
          <div className="card-neon p-8 md:p-12 text-center bg-gradient-to-br from-neon-pink/5 via-neon-violet/5 to-neon-cyan/5">
            <Zap className="w-8 h-8 mx-auto text-neon-yellow mb-4" />
            <h2 className="font-display text-2xl md:text-4xl font-bold text-gradient-cyan">
              准备好探索游戏 IP 衍生宇宙了吗？
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto">
              立即进入浏览页，筛选你关注的 IP；或前往数据看板，俯瞰全球游戏文化衍生版图。
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/browse" className="btn-neon">
                <Search className="w-4 h-4" />
                开始浏览
              </Link>
              <Link to="/dashboard" className="btn-neon btn-pink">
                <BarChart3 className="w-4 h-4" />
                数据看板
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, border }: { icon: React.ReactNode; title: string; desc: string; color: string; border: string }) {
  return (
    <div className={`card-neon p-5 border-l-2 ${border} hover:translate-y-[-3px] transition`}>
      <div className={`w-10 h-10 rounded-sm grid place-items-center bg-white/5 ${color} mb-3`}>
        {icon}
      </div>
      <div className="font-semibold text-lg text-white/90 mb-1">{title}</div>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
