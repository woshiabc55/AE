import type { ExamPaper, Difficulty } from "@/data/types";

const difficultyMap: Record<Difficulty, { label: string; labelEn: string; cls: string }> = {
  easy: { label: "基础", labelEn: "Elementary", cls: "text-moss border-moss" },
  medium: { label: "中等", labelEn: "Intermediate", cls: "text-gold border-gold" },
  hard: { label: "困难", labelEn: "Advanced", cls: "text-crimson border-crimson" },
};

// 试卷封面信息块
export function ExamCover({ exam, index }: { exam: ExamPaper; index: number }) {
  const diff = difficultyMap[exam.difficulty];
  const totalQuestions = exam.sections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0 bg-grid-fine bg-grid-24 opacity-50 pointer-events-none" />
      <div className="absolute -right-10 -top-10 math-deco text-[16rem] leading-none text-crimson/[0.05] select-none pointer-events-none">
        ∂
      </div>

      <div className="container relative py-12 md:py-16">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-sans text-ink-light mb-8 animate-fade-in">
          <a href="/" className="hover:text-crimson transition-colors">卷宗</a>
          <span className="math-deco">/</span>
          <span className="text-ink-muted">试卷档案</span>
          <span className="math-deco">/</span>
          <span className="text-crimson">No.{String(index + 1).padStart(2, "0")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 左：标题 */}
          <div className="lg:col-span-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-crimson" />
              <span className="font-display-latin italic text-crimson text-xs uppercase tracking-widest-xl">
                Examination Paper
              </span>
            </div>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] tracking-tight">
              {exam.title}
            </h1>
            <p className="font-display-latin italic text-ink-muted text-xl mt-3">
              {exam.course} · {exam.semester}
            </p>

            {/* 难度标签 */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 border ${diff.cls} text-xs font-sans uppercase tracking-widest`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {diff.label} · {diff.labelEn}
              </span>
              <span className="font-display-latin italic text-ink-light text-sm">
                命题：{exam.setter}
              </span>
            </div>
          </div>

          {/* 右：元数据卡 */}
          <div className="lg:col-span-4 animate-fade-up delay-200">
            <div className="border border-ink/30 bg-paper-cream/80 p-6">
              <div className="font-display-latin italic text-[10px] uppercase tracking-widest-xl text-crimson mb-4 pb-3 border-b border-ink/20">
                Paper Specification
              </div>
              <dl className="space-y-3">
                {[
                  { k: "满分 / Total", v: `${exam.totalScore} 分`, vEn: "points" },
                  { k: "时长 / Duration", v: `${exam.duration} 分钟`, vEn: "minutes" },
                  { k: "题量 / Questions", v: `${totalQuestions} 题`, vEn: "items" },
                  { k: "大题 / Sections", v: `${exam.sections.length} 部分`, vEn: "parts" },
                ].map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/15 pb-2 last:border-0">
                    <dt className="font-sans text-[11px] uppercase tracking-widest text-ink-light">{row.k}</dt>
                    <dd className="text-right">
                      <span className="font-serif font-semibold text-ink">{row.v}</span>
                      <span className="font-display-latin italic text-ink-light text-xs ml-1">{row.vEn}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="mt-10 border-t border-ink/20 pt-6 animate-fade-up delay-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="math-deco text-crimson">§</span>
            <span className="font-display-latin italic text-ink-muted text-sm uppercase tracking-widest">
              Notes to Candidates
            </span>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 font-serif text-sm text-ink-soft">
            {exam.notes.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-display-latin italic text-crimson text-xs mt-0.5">{i + 1}.</span>
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
