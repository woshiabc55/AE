import { Link } from "react-router-dom";
import type { OutlineChapter, MasteryLevel } from "@/data/types";

const levelColor: Record<MasteryLevel, string> = {
  "了解": "text-ink-light border-ink/20",
  "理解": "text-moss border-moss/30",
  "掌握": "text-gold border-gold/40",
  "熟练掌握": "text-crimson border-crimson/40",
};

interface OutlineRowProps {
  chapter: OutlineChapter;
  index: number;
}

export function OutlineRow({ chapter, index }: OutlineRowProps) {
  return (
    <Link
      to={`/outline/${chapter.id}`}
      className="group relative block border-b border-ink/15 last:border-b-0 hover:bg-paper-cream/60 transition-colors py-5 px-4 md:px-6 animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
        {/* 章节编号 */}
        <div className="col-span-2 md:col-span-1">
          <span className="chapter-numeral text-3xl md:text-4xl text-crimson/80 group-hover:text-crimson transition-colors">
            {chapter.numeral}
          </span>
        </div>

        {/* 标题 */}
        <div className="col-span-10 md:col-span-4">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
              {chapter.number}
            </span>
          </div>
          <h4 className="font-serif font-bold text-lg md:text-xl text-ink group-hover:text-crimson transition-colors leading-snug">
            {chapter.title}
          </h4>
          <p className="font-display-latin italic text-ink-muted text-xs mt-0.5">
            {chapter.subtitle}
          </p>
        </div>

        {/* 摘要 */}
        <div className="col-span-12 md:col-span-4 hidden md:block">
          <p className="font-serif text-sm text-ink-muted leading-relaxed line-clamp-2">
            {chapter.summary}
          </p>
        </div>

        {/* 权重条 */}
        <div className="col-span-7 md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-ink-light">权重</span>
            <span className="font-display-latin italic text-sm text-ink-soft">{chapter.weight}</span>
          </div>
          <div className="h-1.5 bg-ink/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-crimson to-gold origin-left transition-transform duration-700 group-hover:scale-x-110"
              style={{ width: `${chapter.weight}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-sans text-ink-light">
            <span>{chapter.points.length} 考点</span>
            <span>·</span>
            <span>{chapter.hours}h</span>
          </div>
        </div>

        {/* 箭头 */}
        <div className="col-span-5 md:col-span-1 flex justify-end">
          <span className="math-deco text-2xl text-ink-light group-hover:text-crimson group-hover:translate-x-1 transition-all">
            →
          </span>
        </div>
      </div>

      {/* 掌握程度小标签 */}
      <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
        {chapter.points.slice(0, 4).map((p) => (
          <span key={p.id} className={`text-[10px] px-1.5 py-0.5 border font-sans ${levelColor[p.level]}`}>
            {p.title}
          </span>
        ))}
      </div>
    </Link>
  );
}
