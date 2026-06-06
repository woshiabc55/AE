import { ChevronDown, Compass } from "lucide-react";
import { meta } from "../data/world";
import { WedgeSilhouette, BronzeDivider } from "../lib/ornaments";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden temp-jianmu">
      {/* 远景光晕 */}
      <div className="pointer-events-none absolute inset-0 bg-cloud-noise opacity-80" />

      {/* 楔形站位剪影 */}
      <div className="absolute inset-x-0 bottom-0 h-2/3">
        <WedgeSilhouette className="h-full w-full" />
      </div>

      {/* 顶部光柱 */}
      <div className="light-pillar absolute left-1/4 top-0 h-2/3 w-12 opacity-30" />
      <div className="light-pillar absolute right-1/3 top-0 h-1/2 w-10 opacity-20" />

      {/* 主标题 */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 pt-24 pb-20 md:px-12">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest2 text-bronze-400">
          <span className="flex items-center gap-2">
            <Compass className="h-3.5 w-3.5" />
            Scene Sequence · 2026
          </span>
          <span className="hidden md:block">{meta.source}</span>
        </div>

        <div className="max-w-3xl">
          <p className="mb-4 font-display text-sm italic tracking-widest text-bronze-300">
            A cinematic storyboard
          </p>
          <h1 className="font-serif text-5xl font-black leading-[0.95] text-gold-200 md:text-7xl lg:text-8xl">
            建木
            <span className="mx-3 inline-block translate-y-[-0.15em] text-bronze-400">
              →
            </span>
            长安
          </h1>
          <p className="mt-6 font-display text-lg italic text-ink-200/80 md:text-xl">
            {meta.subtitle}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-200/60 md:text-base">
            {meta.tagline}。从冷紫集结到暖金出画，一段十秒的电影级俯冲转场。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="chip">0 → 200 km/h</span>
            <span className="chip chip-blue">RGB · 0.3s</span>
            <span className="chip chip-bronze">50 Hz</span>
            <span className="chip chip-bronze">2 Hz ripple</span>
            <span className="chip">7 shots · 10-15s</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-bronze-300/70">
          <BronzeDivider />
          <p className="text-xs tracking-widest2 text-bronze-300/60">SCROLL</p>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
