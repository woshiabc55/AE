import { Link } from "react-router-dom";
import { ArrowUpRight, Users } from "lucide-react";
import type { Game } from "@/data/types";
import { HEROES } from "@/data/heroes";
import { CATEGORIES } from "@/data/games";
import { cn, textToImageUrl } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  variant?: "default" | "wide";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const count = HEROES.filter((h) => h.gameId === game.id).length;
  const cat = CATEGORIES.find((c) => c.id === game.category);
  const sample = HEROES.filter((h) => h.gameId === game.id).slice(0, 4);

  return (
    <Link
      to={`/game/${game.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:-translate-y-1 hover:border-white/30",
        variant === "wide" ? "md:col-span-2" : "",
      )}
    >
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: game.cover }}
        />
        {/* AI generated cover */}
        <img
          src={textToImageUrl(
            `${game.name} ${game.nameEn} game key art, ${game.tagline}, cinematic, ultra detailed, 4k`,
            "landscape_4_3",
          )}
          alt={game.name}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-110"
          onLoad={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0.7";
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 35%)",
          }}
        />
        <div className="absolute inset-0 bg-grid bg-grid opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/30 to-transparent" />

        {/* Huge sigil character */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 font-serif text-[10rem] font-black text-white/15 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/25">
          {game.symbol}
        </div>

        <div className="absolute left-5 top-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
            {game.year}
          </div>
        </div>

        <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white/90 backdrop-blur transition-all group-hover:bg-white group-hover:text-ink-900">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="glass relative space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-serif text-2xl font-black text-white">
              {game.name}
            </div>
            <div className="font-display text-[11px] uppercase tracking-[0.18em] text-white/40">
              {game.nameEn}
            </div>
          </div>
          {cat && (
            <span
              className="shrink-0 rounded-full border px-2 py-0.5 text-[10px]"
              style={{
                color: cat.color,
                borderColor: `${cat.color}50`,
                background: `${cat.color}1a`,
              }}
            >
              {cat.name}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-white/60">{game.description}</p>

        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {count} 位角色
          </div>
          <div className="flex -space-x-2">
            {sample.map((h) => (
              <div
                key={h.id}
                className="h-7 w-7 rounded-full border-2 border-ink-900"
                style={{
                  background: `linear-gradient(135deg, ${h.paletteFrom}, ${h.paletteTo})`,
                }}
                title={h.name}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
