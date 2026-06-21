import type { ExamPaper, Difficulty } from "@/data/types";

const difficultyMap: Record<Difficulty, { label: string; labelEn: string; cls: string; dot: string }> = {
  easy: { label: "基础", labelEn: "Elementary", cls: "text-moss border-moss/40 bg-moss/5", dot: "bg-moss" },
  medium: { label: "中等", labelEn: "Intermediate", cls: "text-gold border-gold/40 bg-gold/5", dot: "bg-gold" },
  hard: { label: "困难", labelEn: "Advanced", cls: "text-crimson border-crimson/40 bg-crimson/5", dot: "bg-crimson" },
};

const sectionTypeLabel: Record<string, string> = {
  choice: "选择",
  fill: "填空",
  compute: "计算",
  proof: "证明",
};

interface ExamCardProps {
  exam: ExamPaper;
  index: number;
}

export function ExamCard({ exam, index }: ExamCardProps) {
  const diff = difficultyMap[exam.difficulty];
  const totalQuestions = exam.sections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <a
      href={`/exam/${exam.id}`}
      className="group relative block border border-ink/15 bg-paper-cream/70 hover:bg-paper-cream hover:border-ink/40 hover:shadow-[0_12px_40px_-12px_rgba(26,26,26,0.25)] transition-all duration-500 p-6 md:p-7 animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* 卷宗编号 */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-display-latin italic text-ink-light text-sm">
            No.
          </span>
          <span className="font-display-latin italic text-3xl text-crimson leading-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] uppercase tracking-widest font-sans ${diff.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
          {diff.label} · {diff.labelEn}
        </span>
      </div>

      {/* 标题 */}
      <h3 className="font-serif font-bold text-xl md:text-2xl text-ink leading-snug group-hover:text-crimson transition-colors">
        {exam.title}
      </h3>
      <p className="font-display-latin italic text-ink-muted text-sm mt-1.5">
        {exam.course} · {exam.semester}
      </p>

      {/* 分隔线 */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="math-deco text-ink-light text-sm">§</span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      {/* 元数据 */}
      <dl className="grid grid-cols-3 gap-3 font-sans">
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-light">满分</dt>
          <dd className="font-serif font-semibold text-ink text-lg mt-0.5">
            {exam.totalScore}<span className="text-xs text-ink-muted ml-0.5">分</span>
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-light">时长</dt>
          <dd className="font-serif font-semibold text-ink text-lg mt-0.5">
            {exam.duration}<span className="text-xs text-ink-muted ml-0.5">min</span>
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-light">题量</dt>
          <dd className="font-serif font-semibold text-ink text-lg mt-0.5">
            {totalQuestions}<span className="text-xs text-ink-muted ml-0.5">题</span>
          </dd>
        </div>
      </dl>

      {/* 题型标签 */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {exam.sections.map((sec, i) => (
          <span
            key={i}
            className="inline-flex items-center px-2 py-0.5 text-[11px] font-serif text-ink-soft border border-ink/15 bg-paper/50"
          >
            {sectionTypeLabel[sec.type]} {sec.questions.length}
          </span>
        ))}
      </div>

      {/* 悬停提示 */}
      <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between">
        <span className="font-display-latin italic text-ink-light text-xs">
          {exam.setter}
        </span>
        <span className="font-serif text-sm text-crimson opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          展卷 <span className="math-deco">→</span>
        </span>
      </div>
    </a>
  );
}
