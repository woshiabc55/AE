import { Link } from "react-router-dom";
import { Heart, Layers, MapPin } from "lucide-react";
import type { Hero } from "@/data/types";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES } from "@/data/games";
import { cn, textToImageUrl } from "@/lib/utils";

interface HeroCardProps {
  hero: Hero;
  activeSkinIndex?: number;
}

export function HeroCard({ hero, activeSkinIndex = 0 }: HeroCardProps) {
  const { isFavorite, toggleFavorite } = useAppStore();
  const fav = isFavorite(hero.id);
  const cat = CATEGORIES.find((c) => c.id === hero.category);
  const activeSkin = hero.skins[activeSkinIndex];

  const coverPrompt = activeSkin
    ? `${hero.motif} ${activeSkin.motif} game character concept art, cinematic lighting, ultra detailed, 4k`
    : `${hero.motif} game character concept art, cinematic lighting, ultra detailed, 4k`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 transition-all duration-500 hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl">
      {/* Cover with art prompt + gradient fallback */}
      <Link to={`/hero/${hero.id}`} className="block">
        <div className="relative h-44 overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
            }}
          />
          <img
            src={textToImageUrl(coverPrompt, "landscape_4_3")}
            alt={hero.name}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:scale-110 group-hover:opacity-90"
            onLoad={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.9";
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
              style={{
                color: cat?.color,
                borderColor: `${cat?.color}50`,
                background: `${cat?.color}1a`,
              }}
            >
              {cat?.name}
            </span>
            <span className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
              {hero.rarity}
            </span>
          </div>

          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/70 font-serif text-lg font-black text-white backdrop-blur">
            {hero.name[0]}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <div className="font-serif text-xl font-black text-white">
                {hero.name}
              </div>
              <div className="text-xs text-white/70">{hero.title}</div>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <MapPin className="h-3 w-3" />
          {hero.region}
          {activeSkin && (
            <>
              <span className="text-white/20">·</span>
              <Layers className="h-3 w-3" />
              {activeSkin.name}
            </>
          )}
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-white/55">
          {hero.bio}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {hero.skills.slice(0, 3).map((sk) => (
              <span
                key={sk}
                className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/60"
              >
                {sk}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(hero.id);
            }}
            className={cn(
              "rounded-full border p-1.5 transition-all",
              fav
                ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink"
                : "border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white",
            )}
            aria-label="收藏"
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={fav ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
