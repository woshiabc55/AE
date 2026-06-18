import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Filter,
  Search as SearchIcon,
  Wand2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Plus,
  Grid3X3,
  ImageIcon,
} from "lucide-react";
import { GAMES } from "@/data/games";
import { CONCEPT_IMAGES, type ConceptImage } from "@/data/conceptImages";
import { ImageCard, Lightbox } from "@/components/ImageCard";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { cn, textToImageUrl } from "@/lib/utils";
import { allRealAssets, realAssetCount } from "@/data/realAssets";

const CATEGORY_TABS: { id: "all" | ConceptImage["category"]; label: string; icon: string }[] = [
  { id: "all", label: "全部", icon: "✦" },
  { id: "keyart", label: "角色立绘", icon: "★" },
  { id: "skin", label: "皮肤", icon: "✿" },
  { id: "scene", label: "场景", icon: "▲" },
  { id: "weapon", label: "武器", icon: "⚔" },
  { id: "wallpaper", label: "壁纸", icon: "▣" },
  { id: "creature", label: "生物/Boss", icon: "☠" },
  { id: "npc", label: "NPC/伙伴", icon: "♥" },
  { id: "event", label: "节日活动", icon: "❀" },
  { id: "logo", label: "Logo", icon: "◈" },
];

const PAGE_SIZE = 24;

export default function Gallery() {
  const [tab, setTab] = useState<(typeof CATEGORY_TABS)[number]["id"]>("all");
  const [game, setGame] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "name" | "game">("new");
  const [open, setOpen] = useState<ConceptImage | null>(null);
  const [page, setPage] = useState(1);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Featured: 随机抽 6 张作为顶部轮播
  const featured = useMemo(() => {
    return [...CONCEPT_IMAGES]
      .filter((c) => c.category === "keyart" || c.category === "skin")
      .slice(0, 6);
  }, []);
  const heroOfMoment = featured[carouselIdx];

  // 预热：所有图的 URL
  usePreloadImages(
    useMemo(
      () => CONCEPT_IMAGES.map((c) => c.prompt + ", masterpiece, best quality, 4k"),
      [],
    ),
  );

  const filtered = useMemo(() => {
    let list = CONCEPT_IMAGES.filter((c) => {
      if (tab !== "all" && c.category !== tab) return false;
      if (game !== "all" && c.game !== game) return false;
      if (q && !`${c.title}${c.subtitle}${c.hero ?? ""}${c.game}${c.category}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "zh"));
    if (sort === "game") list = [...list].sort((a, b) => a.game.localeCompare(b.game, "zh"));
    return list;
  }, [tab, game, q, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const stats = useMemo(() => {
    const cat: Record<string, number> = {};
    const g: Record<string, number> = {};
    for (const c of CONCEPT_IMAGES) {
      cat[c.category] = (cat[c.category] || 0) + 1;
      g[c.game] = (g[c.game] || 0) + 1;
    }
    return { cat, g };
  }, []);

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      {/* Hero of the moment */}
      {heroOfMoment && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${heroOfMoment.paletteFrom}40, ${heroOfMoment.paletteTo}40)`,
            }}
          />
          <div className="starfield absolute inset-0" />
          <div className="absolute inset-0 bg-grid bg-grid opacity-20" />
          <div className="relative grid gap-6 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-gold/40 bg-neon-gold/10 px-3 py-1 text-xs text-neon-gold">
                <Sparkles className="h-3.5 w-3.5" />
                FEATURED · 今日精选
              </div>
              <div className="font-display text-sm uppercase tracking-[0.4em] text-white/40">
                Art of the Moment
              </div>
              <h1 className="mt-2 font-serif text-5xl font-black leading-tight text-white sm:text-6xl">
                {heroOfMoment.title}
              </h1>
              <div className="mt-2 text-neon-cyan">{heroOfMoment.subtitle}</div>
              <p className="mt-3 max-w-xl text-sm text-white/65">
                来自 {heroOfMoment.game} 的精选设定图。共 {CONCEPT_IMAGES.length}+ 张图像横跨 8 款游戏、10 大分类，等你发现。
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setOpen(heroOfMoment)}
                  className="btn-primary"
                >
                  <Sparkles className="h-4 w-4" /> 查看高清大图
                </button>
                <button
                  onClick={() =>
                    setCarouselIdx((i) => (i + 1) % featured.length)
                  }
                  className="btn-ghost"
                >
                  <Shuffle className="h-4 w-4" /> 换一张
                </button>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-50 blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${heroOfMoment.paletteFrom}, transparent 70%)`,
                }}
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${heroOfMoment.paletteFrom}, ${heroOfMoment.paletteTo})`,
                  }}
                />
                <img
                  src={textToImageUrl(
                    heroOfMoment.prompt + ", masterpiece, best quality, 8k, ultra detailed",
                    "portrait_4_3",
                  )}
                  alt={heroOfMoment.title}
                  loading="eager"
                  decoding="async"
                  className="relative h-full w-full object-cover opacity-0 transition-opacity duration-700"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "1";
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                <button
                  onClick={() =>
                    setCarouselIdx((i) => (i - 1 + featured.length) % featured.length)
                  }
                  className="rounded-full border border-white/10 bg-white/5 p-1.5 hover:border-white/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-display tracking-widest">
                  {String(carouselIdx + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setCarouselIdx((i) => (i + 1) % featured.length)}
                  className="rounded-full border border-white/10 bg-white/5 p-1.5 hover:border-white/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 原画素材区 */}
      {realAssetCount() > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                <ImageIcon className="h-3.5 w-3.5" />
                官方原画素材 · REAL ASSETS
              </div>
              <h2 className="font-serif text-3xl font-black text-white sm:text-4xl">
                原画素材库
              </h2>
              <p className="mt-1 text-sm text-white/50">
                收录自 Fandom 公开 Wiki 的 {realAssetCount()} 张真实图片资源（王者荣耀 / LoL / 原神 / 我的世界），可直接下载用于二创参考。
              </p>
            </div>
          </div>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-5 [&>*]:mb-3">
            {allRealAssets().slice(0, 30).map(({ key, asset }) => {
              const [, sub] = key.split(":");
              const name = sub ?? key;
              // 根据来源选择调色板
              const sourceColor =
                asset.source.startsWith("honor-of-kings")
                  ? ["#ff5e5e", "#7a1b1b"]
                  : asset.source.startsWith("leagueoflegends")
                  ? ["#1e90ff", "#0a2540"]
                  : asset.source.startsWith("genshin-impact")
                  ? ["#7b61ff", "#1a1340"]
                  : ["#5fa84d", "#0f3a1a"];
              return (
                <a
                  key={key}
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block break-inside-avoid overflow-hidden rounded-2xl border border-emerald-400/20 bg-ink-900/60 transition-transform hover:-translate-y-0.5 hover:border-emerald-400/50"
                  title={`来自 ${asset.source} · 原图下载`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${sourceColor[0]}, ${sourceColor[1]})`,
                      }}
                    />
                    <img
                      src={asset.url}
                      alt={name}
                      loading="eager"
                      decoding="async"
                      className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                    <div className="absolute left-2 top-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200 backdrop-blur">
                        <ImageIcon className="h-3 w-3" />
                        原画
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="line-clamp-1 text-sm font-semibold text-white">{name}</div>
                    <div className="line-clamp-1 text-[10px] text-white/40">{asset.source}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <div className="glass rounded-2xl p-4">
          <div className="text-xs text-white/50">总图量</div>
          <div className="mt-1 font-serif text-3xl font-black text-gradient-neon">
            {CONCEPT_IMAGES.length}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-4">
          <div className="text-xs text-emerald-300/80">原画素材</div>
          <div className="mt-1 font-serif text-3xl font-black text-emerald-300">
            {realAssetCount()}
          </div>
        </div>
        {Object.entries(stats.cat)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([catId, count]) => {
            const tab = CATEGORY_TABS.find((t) => t.id === catId);
            return (
              <div key={catId} className="glass rounded-2xl p-4">
                <div className="text-xs text-white/50">{tab?.label ?? catId}</div>
                <div className="mt-1 font-serif text-3xl font-black text-white">{count}</div>
              </div>
            );
          })}
      </div>

      {/* Filter bar */}
      <div className="glass sticky top-16 z-30 space-y-3 rounded-2xl p-4 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-2 text-sm text-white/60">
            <Filter className="h-4 w-4" /> 类型
          </div>
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={cn("chip", tab === t.id && "chip-active")}
            >
              <span className="mr-1 text-[10px]">{t.icon}</span>
              {t.label}
              <span className="ml-1 text-[10px] text-white/30">
                {t.id === "all"
                  ? CONCEPT_IMAGES.length
                  : CONCEPT_IMAGES.filter((c) => c.category === t.id).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-2 text-sm text-white/60">游戏</div>
          <button
            onClick={() => {
              setGame("all");
              setPage(1);
            }}
            className={cn("chip", game === "all" && "chip-active")}
          >
            全部游戏
          </button>
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setGame(g.name);
                setPage(1);
              }}
              className={cn("chip", game === g.name && "chip-active")}
              style={
                game === g.name
                  ? {
                      color: g.accent,
                      borderColor: `${g.accent}80`,
                      background: `${g.accent}26`,
                    }
                  : undefined
              }
            >
              {g.name}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSort("new")}
              className={cn("chip", sort === "new" && "chip-active")}
            >
              最新
            </button>
            <button
              onClick={() => setSort("name")}
              className={cn("chip", sort === "name" && "chip-active")}
            >
              按名称
            </button>
            <button
              onClick={() => setSort("game")}
              className={cn("chip", sort === "game" && "chip-active")}
            >
              按游戏
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <SearchIcon className="h-3.5 w-3.5 text-white/40" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="搜索标题/角色/游戏…"
                className="w-44 bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Grid3X3 className="h-4 w-4" />
        {filtered.length === 0 ? "0 张" : `已显示 ${visible.length} / ${filtered.length} 张`}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-12 text-center text-white/40">
          <Wand2 className="mx-auto mb-3 h-10 w-10 text-white/20" />
          没有匹配的设定图
        </div>
      ) : (
        <>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
            {visible.map((c) => (
              <ImageCard
                key={c.id}
                prompt={c.prompt}
                title={c.title}
                subtitle={c.subtitle}
                paletteFrom={c.paletteFrom}
                paletteTo={c.paletteTo}
                size="portrait_4_3"
                badge={c.game}
                onOpen={() => setOpen(c)}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="btn-ghost"
              >
                <Plus className="h-4 w-4" />
                加载更多（还有 {filtered.length - visible.length} 张）
              </button>
            </div>
          )}
        </>
      )}

      <Lightbox
        src={
          open
            ? textToImageUrl(
                open.prompt + ", masterpiece, best quality, 8k, ultra detailed",
                "portrait_4_3",
              )
            : null
        }
        onClose={() => setOpen(null)}
        alt={open?.title}
      />
    </div>
  );
}
