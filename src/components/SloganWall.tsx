import { quoteWall } from "@/data/scripts";
import { storyline } from "@/data/storyline";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { DragonScalePattern } from "./Decorations";

export function SloganWall() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="slogans" className="relative isolate overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DragonScalePattern className="absolute inset-0 h-full w-full text-cyan/15" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.4),rgba(10,10,15,0.95))]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6">
        <div
          ref={ref}
          className={cn(
            "mb-12 grid grid-cols-12 items-end gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan">
              ⌜ 04 / EASTER
            </p>
            <p className="mt-2 font-display text-6xl text-paper/90">彩蛋</p>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              系列 <span className="text-crimson">Slogan</span> 与金句回响
            </h2>
          </div>
        </div>

        {/* 双 Slogan */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {storyline.slogans.map((s, i) => (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden border p-10 clip-bevel hud-frame",
                i === 0
                  ? "border-crimson/50 bg-gradient-to-br from-crimson/10 to-ink-elev/40"
                  : "border-cyan/50 bg-gradient-to-br from-cyan/10 to-ink-elev/40",
              )}
            >
              <span
                className={cn(
                  "absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em]",
                  i === 0 ? "text-crimson" : "text-cyan",
                )}
              >
                SLOGAN · 0{i + 1}
              </span>
              <p
                className={cn(
                  "font-kuaile text-3xl leading-tight sm:text-4xl lg:text-5xl",
                  i === 0 ? "text-crimson" : "text-cyan",
                )}
              >
                {s.main}
              </p>
              <p className="mt-4 font-mono text-xs tracking-wider text-paper/65">
                {s.sub}
              </p>
              <div
                className={cn(
                  "mt-6 h-px w-24",
                  i === 0 ? "bg-crimson" : "bg-cyan",
                )}
              />
            </div>
          ))}
        </div>

        {/* 金句墙 */}
        <div className="mt-16">
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan">QUOTES · 金句回响</p>
          <h3 className="mt-1 font-serif text-2xl text-paper sm:text-3xl">
            把陈千语塞进你脑子的几句话
          </h3>

          <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {quoteWall.map((q, i) => (
              <figure
                key={i}
                className="mb-6 break-inside-avoid border border-line/50 bg-ink-elev/40 p-5 transition-colors hover:border-cyan/40"
              >
                <blockquote
                  className={cn(
                    "font-kuaile text-lg leading-relaxed",
                    i % 2 === 0 ? "text-paper" : "text-cyan",
                  )}
                >
                  <span className="text-crimson">「</span>
                  {q.text}
                  <span className="text-crimson">」</span>
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-wider text-ash">
                  <span>— {q.speaker}</span>
                  <span className="text-cyan">{q.ep}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* 互动提示 */}
        <div className="mt-16 border border-cyan/30 bg-ink-elev/30 p-6 clip-bevel text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan">HIDDEN · 隐藏彩蛋</p>
          <p className="mt-2 font-serif text-lg text-paper">
            返回顶部，连点 <span className="text-crimson">「陳千語」</span> 标题 5 次
            <br className="sm:hidden" />
            <span className="text-cyan"> —— 触发鬼畜摇头 · 魔性 BGM</span>
          </p>
        </div>
      </div>
    </section>
  );
}
