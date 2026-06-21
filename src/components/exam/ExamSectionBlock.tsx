import type { ExamSection, Question } from "@/data/types";

const romanNumerals = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ"];

const typeLabel: Record<string, string> = {
  choice: "选择题",
  fill: "填空题",
  compute: "计算题",
  proof: "证明题",
};

// 题目项
function QuestionItem({ question, sectionIndex }: { question: Question; sectionIndex: number }) {
  return (
    <div
      id={`q-${sectionIndex}-${question.number}`}
      className="group relative scroll-mt-24 py-6 border-b border-ink/10 last:border-0"
    >
      <div className="flex gap-4 md:gap-6">
        {/* 题号 */}
        <div className="flex-shrink-0 w-10 md:w-12 text-right">
          <span className="font-display-latin italic text-2xl md:text-3xl text-crimson">
            {question.number}
          </span>
        </div>

        {/* 题干 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="question-content text-ink-soft text-base md:text-[17px]">
              {question.content}
            </p>
            <span className="flex-shrink-0 font-display-latin italic text-sm text-ink-muted border border-ink/20 px-2 py-0.5 whitespace-nowrap">
              {question.score}<span className="text-[10px] ml-0.5">分</span>
            </span>
          </div>

          {/* 选项 */}
          {question.options && (
            <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 question-content text-ink-soft text-[15px]">
              {question.options.map((opt, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-display-latin italic text-crimson/80">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{opt}</span>
                </li>
              ))}
            </ol>
          )}

          {/* 作答区 */}
          <div className="mt-4">
            {question.options ? (
              <div className="flex gap-2">
                {question.options.map((_, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 border border-ink/25 flex items-center justify-center font-display-latin italic text-ink-light text-sm hover:border-crimson hover:text-crimson cursor-pointer transition-colors"
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                ))}
              </div>
            ) : (
              <div className="border-l-2 border-ink/15 pl-3">
                <div className="font-display-latin italic text-[11px] uppercase tracking-widest text-ink-light mb-1.5">
                  Answer Space · 作答区
                </div>
                <div className="h-16 md:h-20 border border-dashed border-ink/20 bg-paper-cream/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 大题分区
export function ExamSectionBlock({
  section,
  sectionIndex,
}: {
  section: ExamSection;
  sectionIndex: number;
}) {
  const sectionScore = section.questions.reduce((s, q) => s + q.score, 0);

  return (
    <section className="scroll-mt-24">
      {/* 大题标题 */}
      <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3 mb-2">
        <div className="flex items-baseline gap-4">
          <span className="chapter-numeral text-4xl md:text-5xl text-crimson leading-none">
            {romanNumerals[sectionIndex]}
          </span>
          <div>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-ink leading-tight">
              {section.title}
            </h3>
            <p className="font-display-latin italic text-ink-muted text-sm mt-0.5">
              {typeLabel[section.type]}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display-latin italic text-2xl text-ink">
            {sectionScore}<span className="text-sm text-ink-muted ml-0.5">分</span>
          </div>
          <div className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
            {section.questions.length} questions
          </div>
        </div>
      </div>

      {/* 答题说明 */}
      <p className="font-serif text-sm text-ink-muted italic leading-relaxed py-4 px-4 border-l-2 border-crimson/40 bg-paper-cream/50 mb-2">
        {section.instruction}
      </p>

      {/* 题目 */}
      <div>
        {section.questions.map((q) => (
          <QuestionItem key={q.id} question={q} sectionIndex={sectionIndex} />
        ))}
      </div>
    </section>
  );
}
