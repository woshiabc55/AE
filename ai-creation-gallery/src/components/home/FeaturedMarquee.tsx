import { Link } from "react-router-dom";
import { Flame, ArrowUpRight } from "lucide-react";
import { featured } from "@/data/meta";
import { aiImage } from "@/lib/image";
import { formatHeat } from "@/lib/format";
import { useUIStore } from "@/store/useUIStore";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";

export default function FeaturedMarquee() {
  const open = useUIStore((s) => s.openDetail);
  const row = [...featured, ...featured];

  return (
    <section className="relative py-20">
      <div className="container mb-8 flex items-end justify-between">
        <div>
          <div className="section-eyebrow">
            <Flame size={13} className="text-magenta" /> Featured · 策展精选
          </div>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            本期<span className="text-gradient">高光</span>作品
          </h2>
        </div>
        <Link
          to="/search"
          className="hidden items-center gap-1 text-sm text-white/50 transition-colors hover:text-cyan-soft sm:inline-flex"
        >
          查看全部 <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="group relative overflow-hidden mask-fade-x">
        <div className="flex w-max gap-5 animate-marquee px-4 group-hover:[animation-play-state:paused]">
          {row.map((a, i) => (
            <button
              key={`${a.id}-${i}`}
              type="button"
              onClick={() => open(a.id)}
              className="group/card relative w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-500 hover:border-magenta/50 hover:shadow-glow-magenta"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <SmartImage
                  src={aiImage(a.prompt, a.aspect)}
                  alt={a.title}
                  eager={i < 6}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                <div className="absolute left-3 top-3">
                  <RarityBadge rarity={a.rarity} />
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="font-display text-base font-bold text-white">{a.title}</p>
                  <p className="mt-0.5 truncate text-xs text-white/55">{a.author}</p>
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-magenta-soft">
                    <Flame size={11} /> {formatHeat(a.heat)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
