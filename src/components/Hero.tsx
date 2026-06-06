import { Link } from 'react-router-dom';
import { Sparkles, Cpu, ArrowDown } from 'lucide-react';
import Counter from './Counter';
import { TOTAL_WORKS } from '../data/works';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 noise" />

      {/* 装饰光斑 */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl" />
      <div className="absolute top-32 -right-32 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-violet/10 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* 顶部 tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-neon-cyan/40 bg-neon-cyan/5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-neon-cyan">
              DATABASE_v2.0 // RELEASED 2026-06-08
            </span>
          </div>

          {/* 标题 */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            <span className="block text-glow text-neon-cyan">GAME IP</span>
            <span className="block mt-1 text-gradient-neon">DERIVATIVES</span>
            <span className="block mt-1 text-white/90 text-3xl md:text-4xl lg:text-5xl">
              衍生作品 <span className="text-neon-pink">资料库</span>
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
            全球首个开源、现代化的 <span className="text-neon-cyan font-medium">游戏 IP 衍生作品</span> 浏览平台。
            聚合动画、漫画、电影、小说、舞台剧、手办、周边、音乐等
            <span className="text-neon-pink font-medium"> {TOTAL_WORKS.toLocaleString()}+ </span>
            款条目，覆盖 <span className="text-neon-violet font-medium">355+ </span> 个 IP，
            横跨 <span className="text-neon-yellow font-medium">40+ </span> 年游戏文化史。
          </p>

          {/* 大数字 */}
          <div className="mt-10 grid grid-cols-3 gap-4 md:gap-12">
            <HeroStat n={TOTAL_WORKS} label="DERIVATIVES" color="text-neon-pink" />
            <HeroStat n={355} label="GAME_IPS" color="text-neon-cyan" />
            <HeroStat n={10} label="CATEGORIES" color="text-neon-violet" />
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/browse" className="btn-neon group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition" />
              开始浏览
            </Link>
            <Link to="/dashboard" className="btn-neon btn-pink group">
              <Cpu className="w-4 h-4 group-hover:scale-110 transition" />
              数据看板
            </Link>
            <a
              href="#stats"
              className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition"
            >
              <span className="font-mono">// 向下滚动</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`font-display text-3xl md:text-5xl font-black ${color}`}>
        <Counter end={n} />
        <span className="text-white/40 text-2xl md:text-3xl">+</span>
      </div>
      <div className="mt-1 font-mono text-[10px] md:text-xs text-white/40 tracking-widest">
        {label}
      </div>
    </div>
  );
}
