import { Link } from "react-router-dom";

// 首页刊头 Hero - 学术期刊式
export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/20">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-grid-fine bg-grid-24 opacity-60 pointer-events-none" />

      {/* 装饰性大数学符号 */}
      <div className="absolute -right-8 top-8 md:top-12 math-deco text-[12rem] md:text-[20rem] leading-none text-crimson/[0.06] select-none pointer-events-none animate-float-slow">
        ∫
      </div>
      <div className="absolute left-4 bottom-8 math-deco text-[8rem] md:text-[12rem] leading-none text-moss/[0.07] select-none pointer-events-none">
        ∂
      </div>

      <div className="container relative py-16 md:py-24">
        {/* 卷期号 */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <span className="h-px w-12 bg-crimson" />
          <span className="font-display-latin italic text-crimson text-sm tracking-widest-xl uppercase">
            Vol. Ⅻ · Issue 04 · 2024
          </span>
        </div>

        {/* 主标题 */}
        <h2 className="font-serif font-black text-ink leading-[0.95] tracking-tight animate-fade-up">
          <span className="block text-5xl md:text-7xl lg:text-8xl">高等数学</span>
          <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 text-ink-soft">
            试卷与提纲卷宗
          </span>
        </h2>

        {/* 副标题分隔线 */}
        <div className="mt-8 mb-8 flex items-center gap-6 animate-fade-up delay-200">
          <span className="h-px flex-1 bg-ink/30 origin-left animate-draw-line" />
          <span className="font-display-latin italic text-ink-muted text-lg md:text-xl">
            Papers &amp; Outlines
          </span>
          <span className="h-px flex-1 bg-ink/30 origin-left animate-draw-line" />
        </div>

        {/* 双栏引言 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 animate-fade-up delay-300">
          <div className="md:col-span-7">
            <p className="font-serif text-lg md:text-xl text-ink-soft leading-relaxed first-letter:font-display-latin first-letter:italic first-letter:text-6xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.8] first-letter:text-crimson">
              本卷宗汇集历年高等数学真题试卷与章节复习提纲，以学术期刊之版式编排，使题与纲相互印证。读者可循提纲之脉络，索试卷之真题，于严谨阅读中收复习之效。
            </p>
          </div>
          <div className="md:col-span-5 md:border-l md:border-ink/20 md:pl-10">
            <div className="font-display-latin italic text-ink-muted text-base leading-relaxed">
              <p className="mb-3">
                <span className="text-crimson not-italic font-serif font-bold mr-1">§</span>
                Examinations archived by semester &amp; difficulty.
              </p>
              <p className="mb-3">
                <span className="text-crimson not-italic font-serif font-bold mr-1">§</span>
                Outlines organised by chapter &amp; mastery level.
              </p>
              <p>
                <span className="text-crimson not-italic font-serif font-bold mr-1">§</span>
                Cross-referenced between papers and key points.
              </p>
            </div>
            <Link
              to="/exam/exam-2024-final"
              className="inline-flex items-center gap-2 mt-6 font-serif text-sm font-semibold text-crimson border-b border-crimson/40 hover:border-crimson pb-0.5 transition-colors"
            >
              展卷阅读 · Open the Archive
              <span className="math-deco">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
