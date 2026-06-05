import { useEffect, useState } from "react";
import { sections } from "@/data/sections";
import { useGameStore } from "@/store/useGameStore";
import { Diamond } from "./Decorations";
import { cn } from "@/lib/utils";

export function StickyNav() {
  const active = useGameStore((s) => s.activeSection);
  const progress = useGameStore((s) => s.scrollProgress);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="relative">
        {/* 进度条 */}
        <div className="h-[2px] w-full bg-line/40">
          <div
            className="h-full bg-gradient-to-r from-cyan via-paper to-crimson transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <nav className="border-b border-line/40 bg-ink/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-3">
            <a href="#hero" className="flex items-center gap-3">
              <Diamond className="h-3 w-3 text-cyan animate-flicker" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-ash">
                ENDFIELD / 龍裔檔案
              </span>
            </a>
            <ul className="hidden items-center gap-1 md:flex">
              {sections.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={cn(
                        "group relative flex items-center gap-2 px-3 py-2 font-mono text-[12px] tracking-[0.25em] transition-colors",
                        isActive ? "text-paper" : "text-ash hover:text-paper",
                      )}
                    >
                      <span className="text-[10px] text-cyan">{s.code}</span>
                      <span>{s.label}</span>
                      <span
                        className={cn(
                          "absolute -bottom-[1px] left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-300",
                          isActive ? "scale-x-100 bg-cyan" : "group-hover:scale-x-100 group-hover:bg-paper/50",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="hidden items-center gap-3 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-ash">
                {time} TWR
              </span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
