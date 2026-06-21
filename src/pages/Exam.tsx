import { useParams, Link } from "react-router-dom";
import { getExamById, examPapers } from "@/data/exams";
import { ExamCover } from "@/components/exam/ExamCover";
import { ExamSectionBlock } from "@/components/exam/ExamSectionBlock";
import { AnswerCard } from "@/components/exam/AnswerCard";

export default function Exam() {
  const { id } = useParams<{ id: string }>();
  const exam = id ? getExamById(id) : undefined;

  if (!exam) {
    return (
      <div className="container py-32 text-center">
        <p className="font-display-latin italic text-2xl text-ink-muted">Paper not found.</p>
        <Link to="/" className="font-serif text-crimson underline mt-4 inline-block">
          返回卷宗首页
        </Link>
      </div>
    );
  }

  const index = examPapers.findIndex((e) => e.id === exam.id);
  const prevExam = index > 0 ? examPapers[index - 1] : null;
  const nextExam = index < examPapers.length - 1 ? examPapers[index + 1] : null;

  return (
    <>
      <ExamCover exam={exam} index={index} />

      {/* 试卷正文 */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 题目区 */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-14">
            {/* 卷头装饰 */}
            <div className="flex items-center justify-center gap-4 py-2">
              <span className="h-px w-16 bg-ink/30" />
              <span className="math-deco text-ink-light text-xl">∞</span>
              <span className="font-display-latin italic text-ink-muted text-sm uppercase tracking-widest">
                Questions Begin
              </span>
              <span className="math-deco text-ink-light text-xl">∞</span>
              <span className="h-px w-16 bg-ink/30" />
            </div>

            {exam.sections.map((section, si) => (
              <ExamSectionBlock key={si} section={section} sectionIndex={si} />
            ))}

            {/* 卷尾 */}
            <div className="text-center py-8 border-t-2 border-ink/30">
              <span className="math-deco text-3xl text-crimson/60">— § —</span>
              <p className="font-display-latin italic text-ink-muted text-sm mt-2">
                End of Paper · 卷终
              </p>
            </div>

            {/* 翻页导航 */}
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {prevExam ? (
                <Link
                  to={`/exam/${prevExam.id}`}
                  className="group border border-ink/20 hover:border-ink/50 p-5 transition-colors"
                >
                  <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light mb-1">
                    ← Previous
                  </div>
                  <div className="font-serif font-semibold text-ink group-hover:text-crimson transition-colors">
                    {prevExam.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextExam ? (
                <Link
                  to={`/exam/${nextExam.id}`}
                  className="group border border-ink/20 hover:border-ink/50 p-5 transition-colors text-right"
                >
                  <div className="font-display-latin italic text-[10px] uppercase tracking-widest text-ink-light mb-1">
                    Next →
                  </div>
                  <div className="font-serif font-semibold text-ink group-hover:text-crimson transition-colors">
                    {nextExam.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>

          {/* 答题卡侧栏 */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="hidden lg:block">
              <AnswerCard exam={exam} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
