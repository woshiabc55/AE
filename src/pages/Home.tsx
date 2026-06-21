import { examPapers } from "@/data/exams";
import { outlineChapters } from "@/data/outlines";
import { HeroSection } from "@/components/home/HeroSection";
import { ExamCard } from "@/components/home/ExamCard";
import { OutlineRow } from "@/components/home/OutlineRow";

export default function Home() {
  const totalQuestions = examPapers.reduce(
    (sum, e) => sum + e.sections.reduce((s, sec) => s + sec.questions.length, 0),
    0
  );
  const totalPoints = outlineChapters.reduce((s, c) => s + c.points.length, 0);
  const yearsCovered = Array.from(new Set(examPapers.map((e) => e.year))).length;

  return (
    <>
      <HeroSection />

      {/* 数据统计带 */}
      <section className="border-b border-ink/20 bg-ink text-paper">
        <div className="container py-6 md:py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {[
              { num: examPapers.length, label: "试卷档案", labelEn: "Exam Papers", suffix: "份" },
              { num: totalQuestions, label: "题目总数", labelEn: "Questions", suffix: "题" },
              { num: outlineChapters.length, label: "章节提纲", labelEn: "Chapters", suffix: "章" },
              { num: totalPoints, label: "考点脉络", labelEn: "Key Points", suffix: "点" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center md:text-left md:border-l md:border-paper/20 md:pl-6 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="font-display-latin italic text-4xl md:text-5xl text-paper">
                    {stat.num}
                  </span>
                  <span className="font-serif text-sm text-paper/60">{stat.suffix}</span>
                </div>
                <div className="font-serif text-sm text-paper/80 mt-1">{stat.label}</div>
                <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-paper/40 mt-0.5">
                  {stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 试卷档案 */}
      <section id="exams" className="container py-16 md:py-20 scroll-mt-8">
        <SectionHeading
          numeral="Ⅰ"
          title="试卷档案"
          titleEn="Examination Archive"
          desc="按学期与难度编排的真题卷宗，每份试卷含选择、填空、计算、证明诸题型，附分值与作答时长。"
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {examPapers.map((exam, i) => (
            <ExamCard key={exam.id} exam={exam} index={i} />
          ))}
        </div>
      </section>

      {/* 提纲索引 */}
      <section id="outline" className="border-y border-ink/20 bg-paper-warm/30 scroll-mt-8">
        <div className="container py-16 md:py-20">
          <SectionHeading
            numeral="Ⅱ"
            title="复习提纲"
            titleEn="Review Outline"
            desc="以章节为经，以掌握程度为纬，编织高等数学之知识脉络。每章列考点、权重与典型例题之引用。"
          />

          <div className="mt-10 border-t border-ink/20">
            {outlineChapters.map((chapter, i) => (
              <OutlineRow key={chapter.id} chapter={chapter} index={i} />
            ))}
          </div>

          {/* 底部说明 */}
          <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-ink/15">
            <p className="font-display-latin italic text-ink-muted text-sm">
              共 {outlineChapters.length} 章 · {totalPoints} 考点 · 覆盖 {yearsCovered} 学年
            </p>
            <div className="flex items-center gap-4 text-[11px] font-sans uppercase tracking-widest text-ink-light">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 border border-ink/20" />了解</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 border border-moss/30" />理解</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 border border-gold/40" />掌握</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 border border-crimson/40" />熟练</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  numeral,
  title,
  titleEn,
  desc,
}: {
  numeral: string;
  title: string;
  titleEn: string;
  desc: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
      <div className="md:col-span-2">
        <span className="chapter-numeral text-6xl md:text-7xl text-crimson block leading-none">
          {numeral}
        </span>
      </div>
      <div className="md:col-span-7">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-crimson" />
          <span className="font-display-latin italic text-crimson text-xs uppercase tracking-widest-xl">
            Section
          </span>
        </div>
        <h3 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight">
          {title}
        </h3>
        <p className="font-display-latin italic text-ink-muted text-lg mt-1">{titleEn}</p>
        <p className="font-serif text-ink-soft text-base mt-4 leading-relaxed max-w-2xl">
          {desc}
        </p>
      </div>
      <div className="md:col-span-3 hidden md:flex justify-end">
        <span className="math-deco text-7xl text-ink/[0.08] select-none">∑</span>
      </div>
    </div>
  );
}
