import { Diamond } from "./Decorations";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line/60 bg-ink-deep py-12">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3">
              <Diamond className="h-2 w-2 text-cyan" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan">
                ENDFIELD / 龍裔檔案 · END OF FILE
              </span>
            </div>
            <h3 className="mt-3 font-kuaile text-3xl text-paper sm:text-4xl">
              陳千語 · 真龍後裔
            </h3>
            <p className="mt-2 font-serif text-sm text-paper/65">
              终末地最大『关系户』背锅侠 · 系列 IP 展示站
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ash">CHAPTERS</p>
            <ul className="mt-3 space-y-1.5 font-mono text-xs text-paper/70">
              <li>
                <a href="#hero" className="hover:text-cyan">
                  00 · 序章
                </a>
              </li>
              <li>
                <a href="#profile" className="hover:text-cyan">
                  01 · 档案
                </a>
              </li>
              <li>
                <a href="#scripts" className="hover:text-cyan">
                  02 · 剧本
                </a>
              </li>
              <li>
                <a href="#storyline" className="hover:text-cyan">
                  03 · 主线
                </a>
              </li>
              <li>
                <a href="#slogans" className="hover:text-cyan">
                  04 · 彩蛋
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-4 md:text-right">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ash">CREDITS</p>
            <p className="mt-3 font-serif text-sm text-paper/70">
              剧本 · 终末地创作组
              <br />
              视觉 · 龍紋 HUD Studio
              <br />
              互动 · React + Vite + Tailwind + Zustand
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line/60 pt-6 font-mono text-[10px] tracking-wider text-ash sm:flex-row sm:items-center">
          <span>© {year} · 陳千語 × 終末地 · All Wrongs Reserved</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson" />
            SYS · ONLINE · CLASSIFICATION · TOP SECRET · CUTE
          </span>
        </div>
      </div>
    </footer>
  );
}
