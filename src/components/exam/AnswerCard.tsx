import { useEffect, useState } from "react";
import type { ExamPaper } from "@/data/types";

const romanNumerals = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ"];

// 答题卡侧栏
export function AnswerCard({ exam }: { exam: ExamPaper }) {
  const [activeQuestion, setActiveQuestion] = useState<string>("");

  // 监听滚动高亮当前题
  useEffect(() => {
    const handler = () => {
      const all = exam.sections.flatMap((s, si) =>
        s.questions.map((q) => ({ id: `q-${si}-${q.number}`, label: `${si + 1}-${q.number}` }))
      );
      let current = "";
      for (const item of all) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = item.id;
          else break;
        }
      }
      setActiveQuestion(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [exam]);

  const totalScore = exam.totalScore;
  const answered = 0; // mock

  return (
    <aside className="sticky top-6">
      <div className="border border-ink/25 bg-paper-cream/80">
        {/* 头部 */}
        <div className="border-b border-ink/20 px-4 py-3 bg-ink text-paper">
          <div className="flex items-center justify-between">
            <span className="font-display-latin italic text-sm uppercase tracking-widest">
              Answer Card
            </span>
            <span className="math-deco text-lg">§</span>
          </div>
          <div className="font-serif text-xs text-paper/70 mt-0.5">答题卡</div>
        </div>

        {/* 进度 */}
        <div className="px-4 py-3 border-b border-ink/15">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
              Progress
            </span>
            <span className="font-display-latin italic text-sm text-ink-soft">
              {answered} / {exam.sections.reduce((s, sec) => s + sec.questions.length, 0)}
            </span>
          </div>
          <div className="h-1.5 bg-ink/10 overflow-hidden">
            <div className="h-full bg-crimson transition-all duration-500" style={{ width: "0%" }} />
          </div>
        </div>

        {/* 题号网格 */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {exam.sections.map((section, si) => (
            <div key={si}>
              <div className="flex items-center gap-2 mb-2">
                <span className="chapter-numeral text-crimson text-sm">{romanNumerals[si]}</span>
                <span className="font-serif text-xs text-ink-muted">{section.title}</span>
                <span className="ml-auto font-display-latin italic text-[10px] text-ink-light">
                  {section.questions.reduce((s, q) => s + q.score, 0)} pts
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {section.questions.map((q) => {
                  const id = `q-${si}-${q.number}`;
                  const active = activeQuestion === id;
                  return (
                    <a
                      key={q.id}
                      href={`#${id}`}
                      className={`aspect-square flex items-center justify-center border text-sm font-display-latin italic transition-all
                        ${active
                          ? "bg-crimson text-paper border-crimson scale-110 shadow-md"
                          : "border-ink/25 text-ink-soft hover:border-crimson hover:text-crimson"}`}
                    >
                      {q.number}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 底部 */}
        <div className="border-t border-ink/20 px-4 py-3 bg-paper-warm/40">
          <div className="flex items-baseline justify-between">
            <span className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
              Total
            </span>
            <span className="font-display-latin italic text-lg text-ink">
              {totalScore} <span className="text-xs text-ink-muted">分</span>
            </span>
          </div>
        </div>
      </div>

      {/* 装饰小卡 */}
      <div className="mt-4 border border-ink/15 bg-paper-cream/50 p-4">
        <div className="font-display-latin italic text-[10px] uppercase tracking-widest-xl text-crimson mb-2">
          Tip
        </div>
        <p className="font-serif text-xs text-ink-muted leading-relaxed">
          点击题号可快速跳转至对应题目。建议先通览全卷，由易至难，合理分配时间。
        </p>
      </div>
    </aside>
  );
}
