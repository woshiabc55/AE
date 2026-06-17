import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter, Grid3X3 } from "lucide-react";
import { GAMES, CATEGORIES } from "@/data/games";
import { HEROES } from "@/data/heroes";
import { HeroCard } from "@/components/HeroCard";
import { cn, textToImageUrl } from "@/lib/utils";
import type { CategoryId } from "@/data/types";

export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = GAMES.find((g) => g.id === gameId);
  const [activeCat, setActiveCat] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<"rarity" | "name">("rarity");

  const heroes = useMemo(() => {
    if (!game) return [];
    let list = HEROES.filter((h) => h.gameId === game.id);
    if (activeCat !== "all") list = list.filter((h) => h.category === activeCat);
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "zh");
      const order = { 限定: 0, 无双: 1, 传说: 2, 史诗: 3, 勇者: 4 } as const;
      return order[a.rarity] - order[b.rarity];
    });
    return list;
  }, [game, activeCat, sort]);

  if (!game) {
    return (
      <div className="py-20 text-center">
        <div className="text-2xl text-white/60">未找到该游戏</div>
        <Link to="/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="absolute inset-0" style={{ background: game.cover }} />
        <img
          src={textToImageUrl(
            `${game.name} ${game.nameEn} panoramic game key art, ${game.tagline}, ultra detailed, 4k`,
            "landscape_4_3",
          )}
          alt={game.name}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
          onLoad={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0.7";
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="starfield absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/50 to-transparent" />
        <div className="relative grid gap-6 p-8 sm:p-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-3 font-display text-xs uppercase tracking-[0.4em] text-white/50">
              {game.nameEn} · {game.year}
            </div>
            <h1 className="font-serif text-5xl font-black text-white sm:text-6xl">
              {game.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
              {game.description}
            </p>
          </div>
          <div className="text-right">
            <div className="font-serif text-5xl font-black text-white/15">
              {game.symbol}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass sticky top-16 z-30 flex flex-wrap items-center gap-3 rounded-2xl p-3 backdrop-blur-2xl">
        <div className="flex items-center gap-2 px-2 text-sm text-white/60">
          <Filter className="h-4 w-4" />
          筛选
        </div>
        <button
          onClick={() => setActiveCat("all")}
          className={cn("chip", activeCat === "all" && "chip-active")}
        >
          全部 ({HEROES.filter((h) => h.gameId === game.id).length})
        </button>
        {CATEGORIES.filter((c) =>
          HEROES.some((h) => h.gameId === game.id && h.category === c.id),
        ).map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id as CategoryId)}
            className={cn("chip", activeCat === c.id && "chip-active")}
            style={
              activeCat === c.id
                ? {
                    color: c.color,
                    borderColor: `${c.color}80`,
                    background: `${c.color}26`,
                  }
                : undefined
            }
          >
            {c.name} (
            {HEROES.filter((h) => h.gameId === game.id && h.category === c.id)
              .length}
            )
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSort("rarity")}
            className={cn("chip", sort === "rarity" && "chip-active")}
          >
            按稀有度
          </button>
          <button
            onClick={() => setSort("name")}
            className={cn("chip", sort === "name" && "chip-active")}
          >
            按名称
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Grid3X3 className="h-4 w-4" />
        共 {heroes.length} 位角色
      </div>
      {heroes.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-12 text-center text-white/40">
          该分类下暂无角色
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {heroes.map((h) => (
            <HeroCard key={h.id} hero={h} />
          ))}
        </div>
      )}
    </div>
  );
}
