import { Gamepad2, Globe2, Calendar, Sparkles } from 'lucide-react';
import { GAME_IPS } from '../data/ips';
import { WORKS } from '../data/works';
import Counter from './Counter';
import { useMemo } from 'react';

export default function StatsDashboard() {
  const stats = useMemo(() => {
    const regions = new Set(GAME_IPS.map((g) => g.region));
    const years = WORKS.map((w) => w.year);
    const minY = Math.min(...years);
    const maxY = Math.max(...years);
    const types = new Set(WORKS.map((w) => w.type));
    return {
      ips: GAME_IPS.length,
      works: WORKS.length,
      regions: regions.size,
      span: maxY - minY,
      types: types.size,
    };
  }, []);

  const items = [
    {
      icon: <Gamepad2 className="w-5 h-5" />,
      label: 'IP 数量',
      value: stats.ips,
      accent: 'from-neon-cyan to-neon-pink',
      iconColor: 'text-neon-cyan',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: '衍生作品',
      value: stats.works,
      accent: 'from-neon-pink to-neon-violet',
      iconColor: 'text-neon-pink',
    },
    {
      icon: <Globe2 className="w-5 h-5" />,
      label: '覆盖地区',
      value: stats.regions,
      accent: 'from-neon-violet to-neon-yellow',
      iconColor: 'text-neon-violet',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: '年份跨度',
      value: stats.span,
      suffix: ' 年',
      accent: 'from-neon-yellow to-neon-cyan',
      iconColor: 'text-neon-yellow',
    },
  ];

  return (
    <section className="container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div
            key={it.label}
            className="card-neon p-5 group hover:translate-y-[-2px] transition-transform"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-sm grid place-items-center border border-current/30 ${it.iconColor}`}>
                {it.icon}
              </div>
              <div className="font-mono text-[10px] text-white/30">
                {`// 0${i + 1}`}
              </div>
            </div>
            <div className={`font-display text-3xl md:text-4xl font-black bg-gradient-to-r ${it.accent} bg-clip-text text-transparent`}>
              <Counter end={it.value} suffix={it.suffix || ''} />
            </div>
            <div className="mt-1 text-sm text-white/60 font-medium">{it.label}</div>
            <div className="mt-3 h-1 bg-white/5 rounded overflow-hidden">
              <div
                className="bar-fill"
                style={{ width: `${Math.min(100, 40 + i * 15)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
