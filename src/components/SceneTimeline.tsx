import { useEffect, useRef, useState } from "react";
import { scenes } from "../data/world";
import {
  SectionHeader,
  BronzeDivider,
  VolumetricCloud,
  GatePortal,
} from "../lib/ornaments";

export default function SceneTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? passed / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));

  return (
    <section
      ref={ref}
      className="relative min-h-[300vh] temp-mid py-24 md:py-32"
    >
      {/* 体积云背景层 */}
      <div className="pointer-events-none absolute inset-0">
        <VolumetricCloud className="absolute top-1/4 h-32 w-full opacity-50" />
        <VolumetricCloud className="absolute top-1/2 h-24 w-full opacity-30" />
        <VolumetricCloud className="absolute top-3/4 h-28 w-full opacity-40" />
      </div>

      <div className="sticky top-0 mx-auto max-w-6xl px-6 pt-12 md:px-12">
        <SectionHeader
          index="02 / 03"
          en="Sequence · The Dive"
          zh="场景时间线"
          intro="建木 → 紊流海 → 穿界门 → 朱雀门。四段递进，色温从冷紫渐变至暖金。"
        />

        {/* 进度条 */}
        <div className="relative mt-6 h-1 w-full overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full bg-gradient-to-r from-ink-500 via-bronze-500 to-gold-500 transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
          <span>00 · JIANMU</span>
          <span>{String(active + 1).padStart(2, "0")} · NOW</span>
          <span>04 · ZHUQUE</span>
        </div>
      </div>

      {/* 场景卡 · 横向四段 */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {scenes.map((s, i) => {
            const isActive = i === active;
            const isPast = i < active;
            return (
              <article
                key={s.id}
                className={`relative overflow-hidden rounded-sm border p-6 transition-all duration-700 ${
                  isActive
                    ? "border-gold-500/80 bg-ink-800/60 shadow-[0_0_50px_-15px_rgba(212,162,76,0.45)]"
                    : isPast
                    ? "border-bronze-500/40 bg-ink-800/40 opacity-70"
                    : "border-ink-700 bg-ink-900/50 opacity-50"
                }`}
              >
                {/* 色温小色卡 */}
                <div
                  className={`mb-4 h-1 w-full bg-gradient-to-r ${s.swatch}`}
                />
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
                    STAGE {s.id}
                  </span>
                  <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
                    {String(i + 1).padStart(2, "0")} / 04
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold-200">
                  {s.name}
                </h3>
                <p className="mt-1 font-display text-xs italic text-bronze-300/80">
                  {s.subtitle}
                </p>

                <dl className="mt-5 space-y-1.5 text-xs">
                  <Field label="色温" value={s.colorTemp} />
                  <Field label="灯光" value={s.lighting} />
                  <Field label="氛围" value={s.atmosphere} />
                </dl>

                <p className="mt-4 border-t border-bronze-600/30 pt-3 text-[0.7rem] leading-relaxed text-ink-200/65">
                  {s.detail}
                </p>

                {/* 穿界门（19）场景特殊装饰 */}
                {s.id === "C" && (
                  <div className="absolute -right-2 -top-2 h-32 w-20 opacity-40">
                    <GatePortal className="h-full w-full" />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* 速查：转场流程 */}
        <div className="mt-20 rounded-sm border border-bronze-600/30 bg-ink-900/40 p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-bronze-500" />
            <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
              TRANSITION FLOW
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs md:gap-3 md:text-sm">
            <Step label="建木集结" color="ink" active={active >= 0} />
            <Arrow />
            <Step label="俯冲起跳" color="ink" active={active >= 1} />
            <Arrow />
            <Step label="穿界门 19" color="bronze" active={active >= 2} />
            <Arrow />
            <Step label="朱雀门 16" color="gold" active={active >= 3} />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <BronzeDivider />
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-10 shrink-0 font-mono text-[0.6rem] tracking-widest2 text-bronze-400/80">
        {label}
      </span>
      <span className="text-[0.72rem] text-ink-200/80">{value}</span>
    </div>
  );
}

function Step({
  label,
  color,
  active,
}: {
  label: string;
  color: "ink" | "bronze" | "gold";
  active: boolean;
}) {
  const colorMap = {
    ink: "border-ink-500 text-ink-200/70",
    bronze: "border-bronze-500 text-bronze-200",
    gold: "border-gold-500 text-gold-200 shadow-[0_0_25px_-5px_rgba(212,162,76,0.5)]",
  } as const;
  return (
    <span
      className={`rounded-sm border px-3 py-1.5 transition-all duration-500 ${
        active
          ? colorMap[color] + " bg-ink-800/60"
          : "border-ink-700 text-ink-200/30"
      }`}
    >
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <span className="font-display text-bronze-400/50">→</span>
  );
}
