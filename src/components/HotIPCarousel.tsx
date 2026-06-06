import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, Flame, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { GAME_IPS } from '../data/ips';
import { WORKS } from '../data/works';
import { topNByIpCount } from '../utils/format';

export default function HotIPCarousel() {
  const top = useMemo(() => {
    const list = topNByIpCount(WORKS, 16);
    return list.map((x) => ({
      ...x,
      ip: GAME_IPS.find((g) => g.id === x.id)!,
    })).filter((x) => x.ip);
  }, []);

  // 复制一份用于 marquee 无缝滚动
  const loop = [...top, ...top];

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="container">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-neon-pink font-mono text-xs mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>// TOP_RANKING</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
              衍生最丰富的 IP TOP 16
            </h2>
          </div>
          <Link to="/browse" className="btn-neon btn-pink text-xs">
            查看全部
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* marquee 横向滚动 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 animate-marquee w-max pl-4 pr-4">
          {loop.map((x, i) => (
            <IPCard key={`${x.id}-${i}`} ipName={x.name} count={x.count} color={x.ip.color} ipId={x.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IPCard({ ipName, count, color, ipId }: { ipName: string; count: number; color: string; ipId: string }) {
  return (
    <Link
      to={`/browse?ip=${ipId}`}
      className="group relative w-56 shrink-0 card-neon block"
    >
      <div
        className="h-32 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}aa 0%, ${color}33 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-2 right-2 chip text-white border-white/30 bg-black/30">
          <TrendingUp className="w-3 h-3" /> #{count}
        </div>
        <div className="absolute bottom-2 left-3 font-display text-3xl font-black text-white/90 leading-none">
          {ipName.length > 4 ? ipName.slice(0, 4) : ipName}
        </div>
        <Sparkles className="absolute top-2 left-2 w-4 h-4 text-white/60 group-hover:text-neon-yellow transition" />
      </div>
      <div className="p-3">
        <div className="font-semibold text-sm text-white/90 line-clamp-1">{ipName}</div>
        <div className="font-mono text-xs text-neon-cyan/80 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
          {count} 款衍生作品
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {['动画', '周边', '漫画'].map((t) => (
            <span key={t} className="text-[10px] text-white/50 font-mono">#{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
