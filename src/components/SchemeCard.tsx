import { PromptScheme } from '@/data/schemes';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SchemeCardProps {
  scheme: PromptScheme;
  index: number;
}

export default function SchemeCard({ scheme, index }: SchemeCardProps) {
  return (
    <div
      className="paper-card corner-bracket p-0 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="border-b border-[#1a1a1a] px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="param-highlight">{scheme.tag}</span>
          <span className="font-mono-cn text-[10px] text-[#909060]">
            SCHEME_{scheme.id.toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-1">{scheme.name}</h2>
        <p className="text-sm text-[#606060] leading-relaxed">{scheme.subtitle}</p>
      </div>

      <div className="px-5 py-4 border-b border-dashed border-[#d0d0d0]">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {Object.entries(scheme.params).map(([key, val]) => {
            const labels: Record<string, string> = {
              style: '风格',
              palette: '色彩',
              composition: '构图',
              depth: '深度',
              text: '文字',
              decoration: '装饰',
            };
            return (
              <div key={key} className="space-y-1">
                <span className="font-mono-cn text-[10px] text-[#909090] uppercase">
                  {labels[key] || key}
                </span>
                <p className="text-[#1a1a1a] leading-snug">{val}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex gap-2">
          {scheme.sections.slice(0, 4).map((s) => (
            <span key={s.id} className="tag-label" style={{ transform: `rotate(${(Math.random() - 0.5) * 4}deg)` }}>
              {s.title}
            </span>
          ))}
        </div>
        <Link
          to={`/scheme/${scheme.id}`}
          className="inline-flex items-center gap-1 text-xs font-mono-cn text-[#1a3a6b] hover:underline"
        >
          详情 <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
