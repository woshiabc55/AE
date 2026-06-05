import { storyline } from "@/data/storyline";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { Diamond } from "./Decorations";

const statusMap = {
  completed: { label: "已完成", color: "text-cyan", dot: "bg-cyan" },
  "in-progress": { label: "进行中", color: "text-crimson", dot: "bg-crimson" },
  planned: { label: "规划中", color: "text-ash", dot: "bg-ash" },
} as const;

export function StorylineTimeline() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { acts, recurringElements, extensions } = storyline;

  return (
    <section id="storyline" className="relative isolate py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6">
        {/* 章节标头 */}
        <div
          ref={ref}
          className={cn(
            "mb-12 grid grid-cols-12 items-end gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan">
              ⌜ 03 / STORYLINE
            </p>
            <p className="mt-2 font-display text-6xl text-paper/90">主线</p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              <span className="text-cyan">{storyline.title}</span>
            </h2>
            <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-paper/75">
              {storyline.overview}
            </p>
          </div>
        </div>

        {/* 三段式时间线 */}
        <div className="relative">
          {/* 横向时间线 */}
          <div className="relative mb-10 hidden h-[2px] w-full bg-line/60 md:block">
            <div className="absolute inset-0 origin-left animate-[scan-line_8s_linear_infinite] bg-gradient-to-r from-transparent via-cyan to-transparent" />
            {acts.map((act, i) => {
              const left = `${(i / Math.max(1, acts.length - 1)) * 100}%`;
              return (
                <div
                  key={act.phase}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left }}
                >
                  <div className="h-3 w-3 rotate-45 border border-paper bg-ink" />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {acts.map((act) => {
              const s = statusMap[act.status];
              return (
                <div
                  key={act.phase}
                  className="group relative border border-line/60 bg-ink-elev/40 p-6 clip-bevel transition-colors hover:border-cyan/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl text-paper/90">
                      {String(act.phase).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 font-mono text-[10px] tracking-wider",
                        s.color,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot, act.status === "in-progress" && "animate-pulse")} />
                      {s.label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-kuaile text-2xl text-paper">{act.title}</h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-paper/80">
                    {act.summary}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-line/60 pt-4 font-mono text-[11px] tracking-wider text-ash">
                    {act.keyPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-cyan">▸</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 贯穿元素 + 可扩展子主题 */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="border border-line/60 bg-ink-elev/30 p-6 clip-bevel">
            <p className="font-mono text-[10px] tracking-[0.3em] text-cyan">RECURRING · 贯穿元素</p>
            <h3 className="mt-2 font-serif text-xl text-paper">系列统一的『陈千语公式』</h3>
            <ul className="mt-4 space-y-3">
              {recurringElements.map((e) => (
                <li
                  key={e.name}
                  className="flex items-start gap-3 border-b border-line/40 pb-3 last:border-b-0 last:pb-0"
                >
                  <Diamond className="mt-1 h-2 w-2 text-cyan" />
                  <div>
                    <p className="font-kuaile text-base text-paper">{e.name}</p>
                    <p className="mt-0.5 text-xs text-paper/65">{e.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-line/60 bg-ink-elev/30 p-6 clip-bevel">
            <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">EXTENSIONS · 扩展子主题</p>
            <h3 className="mt-2 font-serif text-xl text-paper">可延展的衍生剧系列表</h3>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {extensions.map((ex) => (
                <div
                  key={ex.name}
                  className="flex items-center justify-between border border-line/40 bg-ink-deep/40 px-3 py-2 transition-colors hover:border-crimson/40"
                >
                  <div>
                    <p className="font-kuaile text-sm text-paper">{ex.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-wider text-ash">
                      {ex.hook}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ml-3 shrink-0 font-mono text-[9px] tracking-widest",
                      ex.status === "ready" ? "text-cyan" : "text-ash",
                    )}
                  >
                    {ex.status === "ready" ? "READY" : "STOCK"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
