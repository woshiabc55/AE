import { Link } from 'react-router-dom';
import type { Template } from '@/types';
import { Star, Users } from 'lucide-react';
import { formatNumber } from '@/utils/format';

interface Props {
  template: Template;
  index?: number;
}

const sceneTypeLabel: Record<string, string> = {
  'short-video': '短视频',
  feature: '影视长片',
  ad: '商业广告',
  podcast: '播客',
  game: '游戏剧情',
};

export default function TemplateCard({ template, index = 0 }: Props) {
  const [c1, c2, c3] = template.coverGradient;
  return (
    <Link
      to={`/templates/${template.id}`}
      className="card group block fade-up"
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'backwards' }}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2} 60%, ${c3})` }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="bg-ink-900/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cream-100/80">
            {sceneTypeLabel[template.category]}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 bg-ink-900/80 px-2 py-0.5">
          <Star size={10} className="fill-gold-500 text-gold-500" />
          <span className="font-mono text-[10px] font-semibold text-gold-500">
            {template.rating.toFixed(1)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 font-display text-2xl font-bold leading-tight text-cream-50 transition-transform group-hover:translate-x-1">
          {template.title}
        </div>
      </div>

      <div className="p-4">
        <p className="line-clamp-2 min-h-[2.5em] text-xs leading-relaxed text-cream-200/60">
          {template.description}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-ink-600 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream-200/40">
            BY · {template.author}
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-cream-200/40">
            <Users size={10} strokeWidth={1.5} />
            <span>{formatNumber(template.usageCount)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
