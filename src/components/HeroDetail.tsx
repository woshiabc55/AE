import { Link } from "react-router-dom";
import { ArrowLeft, Download, Heart, Share2, Sparkles } from "lucide-react";
import type { Hero } from "@/data/types";
import { GAMES, CATEGORIES } from "@/data/games";
import { useAppStore } from "@/store/useAppStore";
import { cn, textToImageUrl } from "@/lib/utils";
import { useState } from "react";

interface HeroDetailProps {
  hero: Hero;
}

export function HeroDetail({ hero }: HeroDetailProps) {
  const [activeSkin, setActiveSkin] = useState(0);
  const { isFavorite, toggleFavorite } = useAppStore();
  const fav = isFavorite(hero.id);
  const game = GAMES.find((g) => g.id === hero.gameId);
  const cat = CATEGORIES.find((c) => c.id === hero.category);
  const skin = hero.skins[activeSkin];

  const coverPrompt = skin
    ? `${hero.motif} ${skin.motif} game character full body concept art, dramatic lighting, ultra detailed, 4k`
    : `${hero.motif} game character full body concept art, dramatic lighting, ultra detailed, 4k`;

  const cover = textToImageUrl(coverPrompt, "portrait_4_3");
  const downloadUrl = textToImageUrl(
    `${hero.motif} ${skin?.motif ?? ""} full art wallpaper, masterpiece, best quality, 4k, ultra detailed`,
    "portrait_4_3",
  );

  return (
    <div className="space-y-8">
      <Link
        to={`/game/${hero.gameId}`}
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回 {game?.name}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Artwork */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
            }}
          />
          <img
            src={cover}
            alt={hero.name}
            className="relative h-full min-h-[480px] w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                color: cat?.color,
                borderColor: `${cat?.color}60`,
                background: `${cat?.color}26`,
              }}
            >
              {cat?.name}
            </span>
            <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
              {hero.rarity}
            </span>
            {skin && (
              <span className="rounded-full border border-neon-gold/40 bg-neon-gold/20 px-3 py-1 text-xs text-neon-gold backdrop-blur">
                {skin.rarity} · {skin.name}
              </span>
            )}
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="font-display text-xs uppercase tracking-[0.4em] text-white/40">
              {hero.nameEn}
            </div>
            <h1 className="mt-1 font-serif text-5xl font-black text-white sm:text-6xl">
              {hero.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-white/70">
              <span className="text-neon-cyan">{hero.title}</span>
              <span className="text-white/30">·</span>
              <span>{hero.region}</span>
              <span className="text-white/30">·</span>
              <span>{game?.name}</span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
              <Sparkles className="h-4 w-4 text-neon-gold" />
              角色简介
            </div>
            <p className="leading-relaxed text-white/85">{hero.bio}</p>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="mb-3 text-sm text-white/50">技能</div>
            <div className="grid grid-cols-3 gap-2">
              {hero.skills.map((sk, i) => (
                <div
                  key={sk}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <div
                    className="mx-auto mb-1 h-1.5 w-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
                    }}
                  />
                  <div className="text-xs font-semibold text-white">{sk}</div>
                  <div className="text-[10px] text-white/40">
                    Skill {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => toggleFavorite(hero.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-4 transition-all",
                fav
                  ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/30",
              )}
            >
              <Heart className="h-5 w-5" fill={fav ? "currentColor" : "none"} />
              <span className="text-xs">{fav ? "已收藏" : "收藏"}</span>
            </button>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/60 transition-all hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">获取设定图</span>
            </a>
            <button className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/60 transition-all hover:border-white/30">
              <Share2 className="h-5 w-5" />
              <span className="text-xs">分享</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skin list */}
      {hero.skins.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl font-black text-white">皮肤图鉴</h2>
            <div className="text-sm text-white/40">
              共 {hero.skins.length} 款 · 点击切换预览
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {hero.skins.map((sk, i) => (
              <button
                key={sk.id}
                onClick={() => setActiveSkin(i)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all",
                  i === activeSkin
                    ? "border-neon-cyan/60 bg-neon-cyan/10"
                    : "border-white/10 bg-white/5 hover:border-white/30",
                )}
              >
                <div
                  className="mb-2 h-24 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
                  }}
                />
                <div className="text-sm font-semibold text-white">{sk.name}</div>
                <div className="text-[11px] text-white/40">{sk.rarity}</div>
                {i === activeSkin && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_8px_currentColor]" />
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
