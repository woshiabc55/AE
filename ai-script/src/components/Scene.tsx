import { ArrowUpRight, Sparkles, Globe, CheckCircle2, Calendar } from 'lucide-react';
import type { Tool } from '../data/catalog';

export default function Scene({ tool, index }: { tool: Tool; index: number }) {
  return (
    <article
      className="group relative border border-gilt-600/40 hover:border-clapper-500 transition-colors bg-carbon-800/40 hover-bg-fade"
      style={{
        animation: `fadeUp 0.6s ${index * 0.05}s ease-out backwards`,
      }}
    >
      {/* 左侧场记条 */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gilt-600/60 group-hover:bg-clapper-500 transition-colors" />

      <div className="p-6 pl-8">
        {/* 顶部：场记编号 + 厂牌 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="slate text-[10px] text-clapper-500 mb-1">
              SCENE · {tool.id}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl md:text-3xl text-parchment-50 leading-tight">
                {tool.name}
              </h3>
              <span className="text-parchment-300/50">·</span>
              <span className="font-serif italic text-gilt-300 text-sm">{tool.vendor}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
              <Calendar size={9} />
              {tool.year}
            </div>
            {tool.isFree && (
              <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
                <Sparkles size={9} />
                FREE
              </div>
            )}
            {tool.cnFriendly && (
              <div className="slate text-[9px] text-gilt-300 flex items-center gap-1">
                <Globe size={9} />
                CN
              </div>
            )}
          </div>
        </div>

        {/* 对白 */}
        <div className="font-serif italic text-parchment-200 text-base md:text-lg my-4 pl-4 border-l border-gilt-600/60">
          {tool.tagline}
        </div>

        {/* 体例说明 */}
        <p className="font-serif text-parchment-100/80 text-[15px] leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* 能力清单 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {tool.capabilities.map((cap) => (
            <div key={cap} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={12} className="text-gilt-300 shrink-0" />
              <span className="font-serif text-parchment-100/80">{cap}</span>
            </div>
          ))}
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="slate text-[9px] px-1.5 py-0.5 border border-gilt-600/40 text-gilt-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部：定价 + 链接 */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gilt-600/30">
          <div>
            <div className="label">Pricing</div>
            <div className="font-mono text-xs text-parchment-100 mt-0.5">
              {tool.pricing}
            </div>
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hard"
          >
            Visit
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
