import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, X, Flame, Clock, Heart, ArrowLeft } from "lucide-react";
import type { ArtworkKind, Rarity, SortKey } from "@/types";
import { artworks, artworksById } from "@/data/artworks";
import { useFilteredArtworks } from "@/hooks/useFilteredArtworks";
import { topTags, rarityLabels, rarityOrder, kindLabels } from "@/data/meta";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import ResultCard from "@/components/common/ResultCard";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

const KIND_TABS: { value: ArtworkKind | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "card", label: kindLabels.card },
  { value: "scene", label: kindLabels.scene },
  { value: "item", label: kindLabels.item },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const favIds = useFavoriteStore((s) => s.ids);
  const favMode = params.get("fav") === "1";

  const [input, setInput] = useState(params.get("q") ?? "");
  const [kind, setKind] = useState<ArtworkKind | "all">("all");
  const [tags, setTags] = useState<string[]>(() => {
    const t = params.get("tag");
    return t ? [t] : [];
  });
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [sort, setSort] = useState<SortKey>("heat");

  // keep input synced if navigated with a new ?q=
  useEffect(() => {
    setInput(params.get("q") ?? "");
    const t = params.get("tag");
    setTags(t ? [t] : []);
  }, [params]);

  const toggleTag = (t: string) =>
    setTags((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
  const toggleRarity = (r: Rarity) =>
    setRarities((list) => (list.includes(r) ? list.filter((x) => x !== r) : [...list, r]));

  const filters = {
    kinds: kind === "all" ? undefined : ([kind] as ArtworkKind[]),
    rarities,
    tags,
    sort,
    query: input.trim() || undefined,
  };

  const filtered = useFilteredArtworks(filters);
  const favList = useMemo(
    () => favIds.map((id) => artworksById[id]).filter(Boolean),
    [favIds],
  );
  const results = favMode ? favList : filtered;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (input.trim()) next.set("q", input.trim());
    else next.delete("q");
    next.delete("fav");
    setParams(next, { replace: true });
  };

  const activeCount = rarities.length + tags.length + (kind !== "all" ? 1 : 0);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="section-eyebrow">
          <SearchIcon size={13} className="text-cyan" /> Global Search · 全馆搜索
        </div>
        <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          {favMode ? (
            <>
              我的<Heart size={36} className="mx-2 inline fill-magenta text-magenta" />收藏
            </>
          ) : (
            <>
              搜索<span className="text-gradient">结果</span>
            </>
          )}
        </h1>
      </div>

      {!favMode && (
        <form onSubmit={submit} className="mb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-5 py-4 transition-colors focus-within:border-cyan/50">
            <SearchIcon size={20} className="text-white/40" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              placeholder="输入作品名 / 作者 / 标签 / 阵营 / 氛围…"
              className="w-full bg-transparent text-lg text-white placeholder:text-white/30 focus:outline-none"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="text-white/30 hover:text-white"
                aria-label="清空"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      )}

      {/* kind tabs + sort */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {KIND_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setKind(t.value)}
              disabled={favMode}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-all",
                kind === t.value
                  ? "border-magenta/60 bg-magenta/15 text-magenta-soft"
                  : "border-white/12 bg-white/5 text-white/55 hover:text-white",
                favMode && "cursor-not-allowed opacity-50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSort("heat")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              sort === "heat"
                ? "border-magenta/60 bg-magenta/15 text-magenta-soft"
                : "border-white/12 bg-white/5 text-white/55",
            )}
          >
            <Flame size={12} /> 热度
          </button>
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              sort === "newest"
                ? "border-cyan/60 bg-cyan/15 text-cyan-soft"
                : "border-white/12 bg-white/5 text-white/55",
            )}
          >
            <Clock size={12} /> 最新
          </button>
        </div>
      </div>

      {/* active filters + rarity */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          稀有度
        </span>
        {rarityOrder.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => toggleRarity(r)}
            disabled={favMode}
            className={cn("chip text-xs", rarities.includes(r) && "chip-active", favMode && "opacity-50")}
          >
            {rarityLabels[r]}
          </button>
        ))}
        {activeCount > 0 && !favMode && (
          <button
            type="button"
            onClick={() => {
              setRarities([]);
              setTags([]);
              setKind("all");
            }}
            className="ml-2 inline-flex items-center gap-1 text-xs text-white/40 hover:text-magenta-soft"
          >
            <X size={12} /> 清空筛选
          </button>
        )}
      </div>

      {/* tag quick pick */}
      {!favMode && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            热门标签
          </span>
          {topTags.slice(0, 10).map(({ tag }) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn("chip text-xs", tags.includes(tag) && "chip-active")}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="mb-5 flex items-center gap-3 font-mono text-xs text-white/35">
        <span className="h-px w-12 bg-gradient-to-r from-magenta to-transparent" />
        {favMode ? `共 ${results.length} 件收藏` : `共 ${results.length} 件匹配作品`}
      </div>

      {favMode && favIds.length === 0 ? (
        <EmptyState
          message="还没有收藏"
          hint="浏览作品时点击爱心，即可在这里聚合查看"
        />
      ) : results.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {results.map((a) => (
            <ResultCard key={a.id} artwork={a} />
          ))}
        </div>
      )}

      {favMode && (
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-cyan-soft"
          >
            <ArrowLeft size={15} /> 返回首页继续探索
          </Link>
        </div>
      )}

      {/* tiny stats footer */}
      <div className="mt-16 grid grid-cols-3 gap-4 text-center">
        {([
          ["馆藏总量", artworks.length],
          ["创作者", new Set(artworks.map((a) => a.author)).size],
          ["风格标签", new Set(artworks.flatMap((a) => a.tags)).size],
        ] as const).map(([label, n]) => (
          <div key={label} className="glass rounded-2xl py-5">
            <p className="font-display text-2xl font-black text-white">{n}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
