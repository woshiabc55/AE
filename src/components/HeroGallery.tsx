import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";
import { FEATURED_HEROES } from "@/data/heroes";
import { GAMES } from "@/data/games";
import { cn, getHeroCover } from "@/lib/utils";
import { AssetBadge } from "@/components/AssetBadge";
import { useReveal } from "@/hooks/useReveal";

export function HeroGallery() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useReveal<HTMLDivElement>();
  const heroes = FEATURED_HEROES.slice(0, 6);
  const hero = heroes[index];
  const game = GAMES.find((g) => g.id === hero.gameId);
  const cover = getHeroCover(hero, "portrait_4_3");

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % heroes.length);
    }, 5000);
    return () => clearInterval(t);
  }, [auto, heroes.length]);

  return (
    <section
      ref={ref}
      className="reveal relative isolate overflow-hidden rounded-3xl border border-white/10"
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => setAuto(true)}
      style={{
        background: `linear-gradient(135deg, ${hero.paletteFrom}33, ${hero.paletteTo}33), radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.18), transparent 50%)`,
      }}
    >
      {/* Decorative starfield */}
      <div className="starfield absolute inset-0" />

      {/* Background motif */}
      <div className="absolute inset-0 bg-grid bg-grid opacity-20" />

      <div className="relative grid min-h-[480px] gap-6 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] md:items-center lg:p-14">
        {/* Left: text */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-neon-gold" />
            精选 · {game?.name}
          </div>
          <div className="font-display text-sm uppercase tracking-[0.4em] text-white/40">
            Hero of the Day
          </div>
          <h1 className="mt-2 font-serif text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            {hero.name}
            <span className="ml-3 text-2xl font-medium text-white/40 lg:text-3xl">
              {hero.nameEn}
            </span>
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 text-base text-neon-cyan sm:text-lg">
            <Zap className="h-4 w-4" />
            {hero.title}
          </div>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            {hero.bio}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {hero.skills.map((sk) => (
              <span key={sk} className="chip">
                {sk}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to={`/hero/${hero.id}`} className="btn-primary">
              <Sparkles className="h-4 w-4" />
              查看设定集
            </Link>
            <Link to={`/game/${hero.gameId}`} className="btn-ghost">
              浏览 {game?.name} 全图鉴
            </Link>
          </div>
        </div>

        {/* Right: floating character composition */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute h-64 w-64 rounded-full opacity-60 blur-2xl"
            style={{
              background: `radial-gradient(circle, ${hero.paletteFrom}, transparent)`,
            }}
          />
          <div
            className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl transition-transform duration-700"
              style={{
                transform: "rotateY(-12deg) rotateX(8deg)",
                background: `linear-gradient(135deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
                boxShadow: `0 30px 80px -20px ${hero.paletteFrom}80`,
              }}
            >
              {/* Hero cover (real asset or AI fallback) */}
              <img
                key={hero.id + (cover.isReal ? "-real" : "-ai")}
                src={cover.url}
                alt={hero.name}
                loading="eager"
                decoding="async"
                className={
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
                  (cover.isReal ? "opacity-100" : "opacity-0")
                }
                onLoad={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.95";
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div
                className="pointer-events-none absolute left-3 top-3 z-10"
              >
                <AssetBadge isReal={cover.isReal} source={cover.source} />
              </div>
              <div
                className="absolute inset-0 rounded-[2rem] opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.1) 12px 13px)",
                }}
              />
              {/* Big character initial behind/over */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[12rem] font-black text-white/95 drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                style={{ mixBlendMode: "overlay" }}
              >
                {hero.name[0]}
              </div>
              <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur">
                {hero.rarity}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="font-serif text-2xl font-black text-white drop-shadow">
                    {hero.name}
                  </div>
                  <div className="text-xs text-white/70">{hero.title}</div>
                </div>
                <div className="font-display text-xs uppercase tracking-widest text-white/60">
                  {hero.region}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators + nav */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/5 bg-ink-950/40 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          {heroes.map((h, i) => (
            <button
              key={h.id}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-10 bg-gradient-to-r from-neon-cyan to-neon-pink"
                  : "w-4 bg-white/20 hover:bg-white/40",
              )}
              aria-label={`切换到 ${h.name}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span className="font-display tracking-widest">
            {String(index + 1).padStart(2, "0")} / {String(heroes.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => setIndex((i) => (i - 1 + heroes.length) % heroes.length)}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 hover:border-white/30"
            aria-label="上一个"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % heroes.length)}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 hover:border-white/30"
            aria-label="下一个"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
