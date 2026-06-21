import { Link } from "react-router-dom";
import type { OutlineChapter, MasteryLevel } from "@/data/types";

const levelStyle: Record<MasteryLevel, { cls: string; dot: string; weight: number }> = {
  "了解": { cls: "text-ink-muted border-ink/25 bg-paper/40", dot: "bg-ink-light", weight: 25 },
  "理解": { cls: "text-moss border-moss/40 bg-moss/5", dot: "bg-moss", weight: 50 },
  "掌握": { cls: "text-gold border-gold/50 bg-gold/5", dot: "bg-gold", weight: 75 },
  "熟练掌握": { cls: "text-crimson border-crimson/50 bg-crimson/5", dot: "bg-crimson", weight: 100 },
};

// 知识点项
function PointItem({
  point,
  index,
}: {
  point: OutlineChapter["points"][number];
  index: number;
}) {
  const style = levelStyle[point.level];

  return (
    <div
      id={`pt-${point.id}`}
      className="group relative scroll-mt-24 py-5 border-b border-ink/10 last:border-0 animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex gap-4 md:gap-6">
        {/* 编号 */}
        <div className="flex-shrink-0 w-8 md:w-10 text-right">
          <span className="font-display-latin italic text-lg md:text-xl text-ink-light">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-serif font-semibold text-lg text-ink leading-snug group-hover:text-crimson transition-colors">
              {point.title}
            </h4>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 border text-[11px] font-sans ${style.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {point.level}
            </span>
          </div>

          <p className="font-serif text-[15px] text-ink-soft leading-relaxed">
            {point.description}
          </p>

          {/* 掌握程度条 */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1 bg-ink/10 overflow-hidden max-w-[200px]">
              <div
                className={`h-full ${style.dot} origin-left transition-transform duration-700 group-hover:scale-x-105`}
                style={{ width: `${style.weight}%` }}
              />
            </div>
            <span className="font-display-latin italic text-[10px] text-ink-light uppercase tracking-widest">
              Mastery {style.weight}%
            </span>
          </div>

          {/* 典型例题引用 */}
          {point.exampleRef && (
            <Link
              to={`/exam/${point.exampleRef.examId}`}
              className="mt-3 inline-flex items-center gap-2 font-serif text-sm text-crimson border border-crimson/30 hover:bg-crimson hover:text-paper px-3 py-1 transition-colors"
            >
              <span className="math-deco">§</span>
              <span>典型例题 · {point.exampleRef.questionLabel}</span>
              <span className="math-deco">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChapterContent({ chapter }: { chapter: OutlineChapter }) {
  const mastered = chapter.points.filter(
    (p) => p.level === "掌握" || p.level === "熟练掌握"
  ).length;

  return (
    <article>
      {/* 章节大标题 */}
      <header className="border-b-2 border-ink pb-6 mb-8">
        <div className="flex items-start gap-5 md:gap-8">
          <span className="chapter-numeral text-7xl md:text-8xl text-crimson leading-none flex-shrink-0">
            {chapter.numeral}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-crimson" />
              <span className="font-sans text-[11px] uppercase tracking-widest-xl text-crimson">
                {chapter.number}
              </span>
            </div>
            <h1 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight">
              {chapter.title}
            </h1>
            <p className="font-display-latin italic text-ink-muted text-lg md:text-xl mt-1">
              {chapter.subtitle}
            </p>
          </div>
        </div>

        {/* 章节摘要 */}
        <p className="font-serif text-ink-soft text-base md:text-lg leading-relaxed mt-6 max-w-3xl">
          {chapter.summary}
        </p>

        {/* 章节元数据 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "考点数", v: chapter.points.length, vEn: "points" },
            { k: "建议学时", v: chapter.hours, vEn: "hours" },
            { k: "权重", v: chapter.weight, vEn: "weight" },
            { k: "已掌握", v: mastered, vEn: "mastered" },
          ].map((m) => (
            <div key={m.k} className="border-l-2 border-crimson/40 pl-3">
              <div className="flex items-baseline gap-1">
                <span className="font-display-latin italic text-2xl md:text-3xl text-ink">{m.v}</span>
              </div>
              <div className="font-serif text-xs text-ink-muted mt-0.5">{m.k}</div>
              <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light">
                {m.vEn}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* 考点列表 */}
      <div className="mb-6 flex items-center gap-3">
        <span className="math-deco text-crimson text-xl">§</span>
        <h2 className="font-serif font-bold text-xl text-ink">考点脉络</h2>
        <span className="font-display-latin italic text-ink-muted text-sm">
          Key Points
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <div className="border-t border-ink/20">
        {chapter.points.map((p, i) => (
          <PointItem key={p.id} point={p} index={i} />
        ))}
      </div>
    </article>
  );
}
