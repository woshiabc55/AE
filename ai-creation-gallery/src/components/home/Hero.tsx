import { Link } from "react-router-dom";
import { ArrowRight, Images, Mountain, Sparkle, ChevronDown } from "lucide-react";
import { stats } from "@/data/meta";
import { useCountUp } from "@/hooks/useCountUp";
import StatsStrip from "./StatsStrip";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* floating orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-magenta/20 blur-3xl animate-floatY" />
        <div className="absolute right-[10%] top-[22%] h-80 w-80 rounded-full bg-cyan/15 blur-3xl animate-floatY2" />
        <div className="absolute bottom-[6%] left-[40%] h-72 w-72 rounded-full bg-rarity-epic/15 blur-3xl animate-floatY" />
        <div
          className="absolute inset-0 opacity-[0.4] bg-grid-faint"
          style={{ backgroundSize: "44px 44px", maskImage: "radial-gradient(circle at 50% 40%, #000, transparent 75%)" }}
        />
      </div>

      <div className="container relative flex min-h-[88vh] flex-col justify-center py-24">
        <div className="max-w-3xl animate-fadeUp">
          <div className="section-eyebrow">
            <Sparkle size={13} className="text-magenta" />
            抖音热门 · AI 二创聚合策展
          </div>

          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            CYBER
            <br />
            <span className="text-gradient neon-text">CURATORIUM</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            将散落于短视频平台的 AI 二创精品，按
            <span className="mx-1 text-magenta-soft">角色卡牌</span>·
            <span className="mx-1 text-cyan-soft">场景壁纸</span>·
            <span className="mx-1 text-rarity-legendary">物品设计</span>
            三大维度系统化聚合，打造你的 AI 创作灵感中枢。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/cards" className="btn-primary">
              <Images size={18} /> 探索馆藏
              <ArrowRight size={16} />
            </Link>
            <Link to="/scenes" className="btn-ghost">
              <Mountain size={18} /> 热门场景
            </Link>
          </div>
        </div>

        <StatsStrip />

        <div className="mt-16 flex items-center gap-2 text-xs font-mono text-white/30 animate-glowPulse">
          <ChevronDown size={14} className="animate-bounce" />
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
