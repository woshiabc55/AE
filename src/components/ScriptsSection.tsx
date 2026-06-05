import { scripts } from "@/data/scripts";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";
import { ScriptCard } from "./ScriptCard";

export function ScriptsSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="scripts" className="relative isolate py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-crimson/[0.05] blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-cyan/[0.05] blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6">
        {/* 章节标头 */}
        <div
          ref={ref}
          className={cn(
            "mb-16 grid grid-cols-12 items-end gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan">
              ⌜ 02 / SCRIPTS
            </p>
            <p className="mt-2 font-display text-6xl text-paper/90">剧本</p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              <span className="text-cyan">两集</span> 短剧分镜
              <br />
              <span className="text-paper/70">呆萌反转 × 鬼畜高燃</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <p className="font-mono text-[11px] tracking-[0.2em] text-ash">TOTAL</p>
            <p className="mt-1 font-display text-3xl text-paper">
              {scripts.length}
              <span className="ml-1 text-sm text-ash">EPISODES</span>
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-wider text-ash">
              ≈ 55-60 SECONDS
            </p>
          </div>
        </div>

        <div className="space-y-24">
          {scripts.map((s, i) => (
            <ScriptCard key={s.id} script={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
