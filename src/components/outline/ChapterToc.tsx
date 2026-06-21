import { Link } from "react-router-dom";
import type { OutlineChapter } from "@/data/types";
import { cn } from "@/lib/utils";

// 左侧章节目录
export function ChapterToc({
  chapters,
  activeId,
}: {
  chapters: OutlineChapter[];
  activeId: string;
}) {
  return (
    <nav className="sticky top-6">
      <div className="border border-ink/25 bg-paper-cream/80">
        {/* 头部 */}
        <div className="border-b border-ink/20 px-4 py-3 bg-ink text-paper">
          <div className="flex items-center justify-between">
            <span className="font-display-latin italic text-sm uppercase tracking-widest">
              Contents
            </span>
            <span className="math-deco text-lg">∂</span>
          </div>
          <div className="font-serif text-xs text-paper/70 mt-0.5">章节目录</div>
        </div>

        {/* 目录列表 */}
        <ol className="py-2 max-h-[70vh] overflow-y-auto">
          {chapters.map((ch) => {
            const active = ch.id === activeId;
            return (
              <li key={ch.id}>
                <Link
                  to={`/outline/${ch.id}`}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-2.5 border-l-2 transition-all",
                    active
                      ? "border-crimson bg-crimson/5"
                      : "border-transparent hover:border-ink/30 hover:bg-paper-warm/40"
                  )}
                >
                  <span
                    className={cn(
                      "chapter-numeral text-lg flex-shrink-0 w-6 text-center transition-colors",
                      active ? "text-crimson" : "text-ink-light group-hover:text-ink"
                    )}
                  >
                    {ch.numeral}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-serif text-sm leading-tight truncate transition-colors",
                        active ? "text-crimson font-semibold" : "text-ink-soft group-hover:text-ink"
                      )}
                    >
                      {ch.title}
                    </div>
                    <div className="font-display-latin italic text-[10px] text-ink-light truncate">
                      {ch.subtitle}
                    </div>
                  </div>
                  {/* 权重小条 */}
                  <div className="flex-shrink-0 w-8 h-0.5 bg-ink/10 overflow-hidden">
                    <div
                      className={cn("h-full", active ? "bg-crimson" : "bg-ink/40")}
                      style={{ width: `${ch.weight}%` }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* 底部 */}
        <div className="border-t border-ink/20 px-4 py-3 bg-paper-warm/40">
          <div className="flex items-baseline justify-between">
            <span className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
              Chapters
            </span>
            <span className="font-display-latin italic text-lg text-ink">
              {chapters.length}
            </span>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 border border-ink/15 bg-paper-cream/50 p-4">
        <div className="font-display-latin italic text-[10px] uppercase tracking-widest-xl text-crimson mb-2">
          Mastery Levels
        </div>
        <ul className="space-y-1.5 font-serif text-xs text-ink-soft">
          <li className="flex items-center gap-2"><span className="w-2 h-2 bg-ink-light" />了解 · Acquaintance</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 bg-moss" />理解 · Comprehension</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 bg-gold" />掌握 · Mastery</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 bg-crimson" />熟练掌握 · Proficiency</li>
        </ul>
      </div>
    </nav>
  );
}
