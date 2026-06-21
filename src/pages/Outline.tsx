import { useParams, Link } from "react-router-dom";
import { getChapterById, outlineChapters } from "@/data/outlines";
import { ChapterContent } from "@/components/outline/ChapterContent";
import { ChapterToc } from "@/components/outline/ChapterToc";

export default function Outline() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = chapterId ? getChapterById(chapterId) : undefined;

  if (!chapter) {
    return (
      <div className="container py-32 text-center">
        <p className="font-display-latin italic text-2xl text-ink-muted">Chapter not found.</p>
        <Link to="/" className="font-serif text-crimson underline mt-4 inline-block">
          返回卷宗首页
        </Link>
      </div>
    );
  }

  const index = outlineChapters.findIndex((c) => c.id === chapter.id);
  const prev = index > 0 ? outlineChapters[index - 1] : null;
  const next = index < outlineChapters.length - 1 ? outlineChapters[index + 1] : null;

  return (
    <>
      {/* 章节封面横幅 */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-paper-warm/40">
        <div className="absolute inset-0 bg-grid-fine bg-grid-24 opacity-50 pointer-events-none" />
        <div className="absolute -left-8 top-4 math-deco text-[14rem] leading-none text-moss/[0.06] select-none pointer-events-none">
          ∑
        </div>

        <div className="container relative py-8 md:py-10">
          {/* 面包屑 */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-sans text-ink-light mb-4 animate-fade-in">
            <Link to="/" className="hover:text-crimson transition-colors">卷宗</Link>
            <span className="math-deco">/</span>
            <span className="text-ink-muted">复习提纲</span>
            <span className="math-deco">/</span>
            <span className="text-crimson">{chapter.number}</span>
          </div>

          <div className="flex items-baseline gap-4 animate-fade-up">
            <span className="font-display-latin italic text-crimson text-sm uppercase tracking-widest-xl">
              Outline
            </span>
            <span className="h-px flex-1 bg-ink/20" />
            <span className="font-display-latin italic text-ink-muted text-sm">
              {index + 1} / {outlineChapters.length}
            </span>
          </div>
        </div>
      </section>

      {/* 主体 */}
      <section className="container py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 目录侧栏 */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
            <div className="hidden lg:block">
              <ChapterToc chapters={outlineChapters} activeId={chapter.id} />
            </div>

            {/* 移动端章节切换 */}
            <div className="lg:hidden">
              <MobileChapterSwitcher chapters={outlineChapters} activeId={chapter.id} />
            </div>
          </div>

          {/* 章节内容 */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
            <ChapterContent chapter={chapter} />

            {/* 翻页导航 */}
            <nav className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t-2 border-ink/20">
              {prev ? (
                <Link
                  to={`/outline/${prev.id}`}
                  className="group border border-ink/20 hover:border-ink/50 p-5 transition-colors"
                >
                  <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light mb-1">
                    ← Previous Chapter
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="chapter-numeral text-crimson">{prev.numeral}</span>
                    <span className="font-serif font-semibold text-ink group-hover:text-crimson transition-colors">
                      {prev.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={`/outline/${next.id}`}
                  className="group border border-ink/20 hover:border-ink/50 p-5 transition-colors text-right"
                >
                  <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light mb-1">
                    Next Chapter →
                  </div>
                  <div className="flex items-baseline justify-end gap-2">
                    <span className="font-serif font-semibold text-ink group-hover:text-crimson transition-colors">
                      {next.title}
                    </span>
                    <span className="chapter-numeral text-crimson">{next.numeral}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}

function MobileChapterSwitcher({
  chapters,
  activeId,
}: {
  chapters: typeof outlineChapters;
  activeId: string;
}) {
  return (
    <div className="border border-ink/25 bg-paper-cream/80">
      <div className="border-b border-ink/20 px-4 py-2.5 bg-ink text-paper flex items-center justify-between">
        <span className="font-display-latin italic text-xs uppercase tracking-widest">
          Contents
        </span>
        <span className="math-deco">∂</span>
      </div>
      <div className="flex gap-2 overflow-x-auto p-3">
        {chapters.map((ch) => {
          const active = ch.id === activeId;
          return (
            <Link
              key={ch.id}
              to={`/outline/${ch.id}`}
              className={`flex-shrink-0 px-3 py-1.5 border text-sm font-serif transition-colors ${
                active
                  ? "bg-crimson text-paper border-crimson"
                  : "border-ink/20 text-ink-soft"
              }`}
            >
              <span className="chapter-numeral mr-1">{ch.numeral}</span>
              {ch.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
