import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, Search as SearchIcon, Wand2 } from "lucide-react";
import { GAMES } from "@/data/games";
import { CONCEPT_IMAGES, type ConceptImage } from "@/data/conceptImages";
import { ImageCard, Lightbox } from "@/components/ImageCard";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { cn, textToImageUrl } from "@/lib/utils";

const CATEGORY_TABS: { id: "all" | ConceptImage["category"]; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "skin", label: "皮肤立绘" },
  { id: "keyart", label: "角色立绘" },
  { id: "scene", label: "场景" },
  { id: "weapon", label: "武器" },
  { id: "wallpaper", label: "壁纸" },
];

export default function Gallery() {
  const [tab, setTab] = useState<(typeof CATEGORY_TABS)[number]["id"]>("all");
  const [game, setGame] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<ConceptImage | null>(null);

  // Pre-warm ALL concept image URLs on first mount so the wall populates fast
  usePreloadImages(
    useMemo(() => CONCEPT_IMAGES.map((c) => c.prompt + ", high res"), []),
  );

  const filtered = useMemo(() => {
    return CONCEPT_IMAGES.filter((c) => {
      if (tab !== "all" && c.category !== tab) return false;
      if (game !== "all" && c.game !== game) return false;
      if (q && !`${c.title}${c.subtitle}${c.hero ?? ""}${c.game}`.includes(q))
        return false;
      return true;
    });
  }, [tab, game, q]);

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回首页
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12">
        <div className="starfield absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(0,212,255,0.18), transparent 60%), radial-gradient(ellipse at bottom, rgba(168,85,247,0.18), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-xs text-neon-cyan">
            <Wand2 className="h-3.5 w-3.5" />
            CONCEPT GALLERY · 设定图墙
          </div>
          <h1 className="font-serif text-5xl font-black text-white sm:text-6xl">
            设定图 <span className="text-gradient-neon">海洋</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            收录 {CONCEPT_IMAGES.length}+ 张来自流行游戏的设定图、皮肤立绘、关键艺术与壁纸，
            全部支持右键下载 / 新窗口打开高清版，供二创参考。
          </p>
        </div>
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
              onClick={() => setTab(t.id)}
              className={cn("chip", tab === t.id && "chip-active")}
            >
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
          <div className="flex items-center gap-2 px-2 text-sm text-white/60">
            游戏
          </div>
          <button
            onClick={() => setGame("all")}
            className={cn("chip", game === "all" && "chip-active")}
          >
            全部游戏
          </button>
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGame(g.name)}
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
          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <SearchIcon className="h-3.5 w-3.5 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索标题/角色/游戏…"
              className="w-44 bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="text-sm text-white/50">
        共 {filtered.length} 张
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-12 text-center text-white/40">
          没有匹配的设定图
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
          {filtered.map((c) => (
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
      )}

      <Lightbox
        src={open ? textToImageUrl(open.prompt + ", masterpiece, best quality, 8k, ultra detailed", "portrait_4_3") : null}
        onClose={() => setOpen(null)}
        alt={open?.title}
      />
    </div>
  );
}
