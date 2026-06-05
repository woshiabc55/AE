import type { Script } from "@/data/types";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { Diamond } from "./Decorations";

interface ScriptCardProps {
  script: Script;
  index: number;
}

export function ScriptCard({ script, index }: ScriptCardProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isReversed = index % 2 === 1;

  return (
    <article
      ref={ref}
      className={cn(
        "relative grid grid-cols-12 gap-6 transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      {/* 左侧时间轴 */}
      <div className="col-span-12 md:col-span-3">
        <div className="sticky top-32 border border-line/60 bg-ink-elev/40 p-5 clip-bevel">
          <div className="flex items-center gap-3">
            <span className="font-display text-4xl text-crimson">{script.index}</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan">
              EPISODE
            </span>
          </div>
          <h3 className="mt-3 font-kuaile text-2xl leading-tight text-paper sm:text-3xl">
            {script.title}
          </h3>
          <p className="mt-1 font-mincho text-sm text-paper/60">{script.subtitle}</p>

          <div className="mt-5 space-y-2 border-t border-line/60 pt-4 font-mono text-[11px] tracking-wider">
            <div className="flex items-center justify-between">
              <span className="text-ash">DURATION</span>
              <span className="text-cyan">{script.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ash">STYLE</span>
              <span className="text-paper">{script.style}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-ash">JOKE</span>
              <span className="text-right text-crimson">{script.coreJoke}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧分镜剧本 */}
      <div className="col-span-12 md:col-span-9">
        <div className={cn("mb-6 flex items-center gap-3", isReversed && "md:justify-end")}>
          <Diamond className="h-2 w-2 text-cyan" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ash">
            STORYBOARD · {script.scenes.length} SHOTS
          </span>
          <div className="h-px flex-1 bg-line/60" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ash">
            {script.duration}
          </span>
        </div>

        <div className="space-y-4">
          {script.scenes.map((scene, i) => (
            <div
              key={i}
              className={cn(
                "group relative grid grid-cols-12 gap-3 border border-line/50 bg-ink-elev/30 p-4 transition-all hover:border-cyan/40 hover:bg-ink-elev/50",
                isReversed && "md:[direction:rtl]",
              )}
            >
              {/* 时间戳 */}
              <div
                className={cn(
                  "col-span-3 flex flex-col items-start md:col-span-2",
                  isReversed && "md:items-end",
                )}
                style={{ direction: "ltr" }}
              >
                <span className="font-mono text-xl text-cyan">
                  {String(Math.floor(scene.startTime)).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-ash">
                  {String(scene.startTime).padStart(2, "0")}″ — {String(scene.endTime).padStart(2, "0")}″
                </span>
                <span className="mt-1 font-mono text-[9px] tracking-widest text-paper/40">
                  SHOT&nbsp;{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* 分隔线 */}
              <div
                className="col-span-1 hidden border-l border-line/40 md:block"
                style={{ direction: "ltr" }}
              />

              {/* 内容 */}
              <div className="col-span-12 md:col-span-9" style={{ direction: "ltr" }}>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-wider">
                  <span className="rounded-sm border border-cyan/30 bg-cyan/5 px-1.5 py-0.5 text-cyan">
                    {scene.location}
                  </span>
                  {scene.speaker && (
                    <span className="rounded-sm border border-crimson/40 bg-crimson/5 px-1.5 py-0.5 text-crimson">
                      {scene.speaker}
                    </span>
                  )}
                  {scene.soundEffect && (
                    <span className="rounded-sm border border-paper/30 bg-paper/5 px-1.5 py-0.5 text-paper/80">
                      ♪ {scene.soundEffect}
                    </span>
                  )}
                  {scene.emoji && (
                    <span className="text-base" aria-hidden>
                      {scene.emoji}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[11px] tracking-wider text-ash">
                  ▶ {scene.action}
                </p>
                <p className="mt-1 font-serif text-base leading-relaxed text-paper/90">
                  <span className="text-cyan">「</span>
                  {scene.dialogue}
                  <span className="text-crimson">」</span>
                </p>
              </div>

              {/* 悬停时的左竖条 */}
              <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-cyan to-crimson transition-transform duration-300 group-hover:scale-y-100" />
            </div>
          ))}
        </div>

        {/* 金句横幅 */}
        <div className="mt-6 border border-crimson/40 bg-gradient-to-r from-crimson/10 via-ink-elev/40 to-cyan/10 p-5 clip-bevel">
          <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">PUNCHLINE</p>
          <p className="mt-1 font-kuaile text-2xl leading-snug text-paper sm:text-3xl">
            <span className="text-crimson">「</span>
            {script.punchline}
            <span className="text-cyan">」</span>
          </p>
        </div>
      </div>
    </article>
  );
}
