import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { DragonSilhouette, Diamond } from "./Decorations";
import { sections } from "@/data/sections";
import { cn } from "@/lib/utils";

const DECLARATION =
  "公理与正义，是陈千语的人生信条。陈家的后人，绝不会向邪恶低头。";

export function Hero() {
  const bump = useGameStore((s) => s.bumpEasterEgg);
  const shake = useGameStore((s) => s.shakeMode);
  const setShake = useGameStore((s) => s.setShakeMode);
  const count = useGameStore((s) => s.easterEggCount);
  const [typed, setTyped] = useState("");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!entered) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(DECLARATION.slice(0, i));
      if (i >= DECLARATION.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [entered]);

  // 退出彩蛋模式
  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 4000);
    return () => clearTimeout(t);
  }, [shake, setShake]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24"
    >
      {/* 背景层 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <DragonSilhouette className="absolute right-[-8%] top-[8%] h-[80%] w-[70%] max-w-[900px] opacity-40 mix-blend-screen animate-dragon-breathe" />
        <div className="absolute inset-0 bg-scales opacity-50" />
        <div className="absolute inset-0 bg-noise" />
        {/* 扫描线 */}
        <div className="absolute inset-x-0 h-[120px] animate-scan-line bg-gradient-to-b from-transparent via-cyan/[0.05] to-transparent" />
        {/* 暗角 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* 顶部 HUD 标签 */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-6 font-mono text-[10px] tracking-[0.3em] text-ash">
        <div className="flex items-center gap-2">
          <Diamond className="h-2 w-2 text-cyan" />
          <span>SECTOR / 塔卫二 · 終末地</span>
        </div>
        <div className="flex items-center gap-4">
          <span>FILE No. 0001-CQ</span>
          <span className="hidden sm:inline">CLASSIFICATION · TOP SECRET · CUTE</span>
        </div>
      </div>

      {/* 主内容 */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6">
        <div className="grid grid-cols-12 items-end gap-6">
          {/* 巨型水印 */}
          <div className="col-span-12 lg:col-span-9">
            <p className="mb-3 font-mono text-[11px] tracking-[0.4em] text-cyan">
              ⌜ ENDFIELD DRAGON HEIR DOSSIER · 檔案序章 ⌝
            </p>
            <h1
              onClick={bump}
              className={cn(
                "group relative cursor-pointer select-none",
                shake ? "animate-head-shake" : "",
              )}
              title="连点 5 次触发鬼畜彩蛋"
            >
              <span
                data-text="陳千語"
                className={cn(
                  "glitch block font-kuaile text-[20vw] leading-[0.85] tracking-[-0.02em] sm:text-[18vw] lg:text-[15vw]",
                )}
                style={{ color: "var(--color-paper)" }}
              >
                陳千語
              </span>
            </h1>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-display text-3xl tracking-[0.15em] text-cyan sm:text-5xl">
                CHEN&nbsp;QIANYU
              </span>
              <span className="font-mono text-sm tracking-[0.4em] text-ash">
                EP.01 / EP.02
              </span>
              <span className="stamp text-xs">真龍後裔</span>
            </div>
          </div>

          {/* 右侧副信息 */}
          <div className="col-span-12 lg:col-span-3">
            <div className="relative border border-line/70 bg-ink-elev/70 p-5 clip-bevel hud-frame">
              <p className="font-mono text-[10px] tracking-[0.3em] text-cyan">
                DESCRIPTOR
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed text-paper/85">
                一本正经地
                <span className="mx-1 text-crimson">甩锅</span>
                ，用龙尾
                <span className="mx-1 text-cyan">鬼畜摇头</span>
                蒙混过关。
              </p>
              <div className="mt-4 h-px w-full bg-line" />
              <dl className="mt-4 space-y-2 font-mono text-[11px] tracking-wider text-ash">
                <div className="flex justify-between">
                  <dt>TAIL</dt>
                  <dd className="text-cyan">C-BLUE / CRIMSON</dd>
                </div>
                <div className="flex justify-between">
                  <dt>STYLE</dt>
                  <dd className="text-paper">呆萌 · 反转</dd>
                </div>
                <div className="flex justify-between">
                  <dt>STATUS</dt>
                  <dd className="text-crimson">SUSPICIOUS</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* 宣言区 */}
        <div className="mt-10 grid grid-cols-12 gap-6 border-t border-line/60 pt-6">
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan">DECLARATION</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-ash">00:00 — 00:04</p>
          </div>
          <p className="col-span-12 min-h-[3.5em] font-serif text-2xl leading-relaxed text-paper/95 sm:text-3xl md:col-span-9">
            <span className="text-cyan">「</span>
            {typed}
            <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-1 bg-crimson animate-flicker" />
            <span className="text-crimson">」</span>
          </p>
        </div>

        {/* 彩蛋提示 */}
        <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-ash">
          ⌞ HINT · 点击「陳千語」{count > 0 ? `( ${count} / 5 )` : "· 连续点击 5 次触发鬼畜彩蛋"} ⌟
        </p>
      </div>

      {/* 滚动脉动指示 */}
      <div className="mx-auto mb-8 flex w-full max-w-[1440px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ash">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          <span>SCROLL TO PROCEED · 向下滚动以继续</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-10 w-[1px] bg-gradient-to-b from-cyan to-transparent" />
          <div className="mt-1 h-2 w-2 rotate-45 border border-cyan" />
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-ash">
          {String(0).padStart(3, "0")} / {sections.length - 1}
        </div>
      </div>
    </section>
  );
}
