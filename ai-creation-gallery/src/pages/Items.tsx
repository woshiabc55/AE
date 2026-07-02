import { useState } from "react";
import { Swords, Flame, Clock } from "lucide-react";
import type { Rarity, SortKey, ItemCategory } from "@/types";
import { artworks } from "@/data/artworks";
import { useFilteredArtworks } from "@/hooks/useFilteredArtworks";
import {
  itemCategoryOrder,
  itemCategoryLabels,
  rarityLabels,
  rarityOrder,
} from "@/data/meta";
import ItemTile from "@/components/items/ItemTile";
import GalleryHeader from "@/components/common/GalleryHeader";
import EmptyState from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";

type CatFilter = ItemCategory | "all";

const TABS: { value: CatFilter; label: string }[] = [
  { value: "all", label: "全部" },
  ...itemCategoryOrder.map((c) => ({ value: c, label: itemCategoryLabels[c] })),
];

export default function Items() {
  const [cat, setCat] = useState<CatFilter>("all");
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [sort, setSort] = useState<SortKey>("heat");

  const toggleRarity = (r: Rarity) =>
    setRarities((list) => (list.includes(r) ? list.filter((x) => x !== r) : [...list, r]));

  const list = useFilteredArtworks({
    kinds: ["item"],
    rarities,
    itemCategories: cat === "all" ? [] : [cat],
    sort,
  });
  const total = artworks.filter((a) => a.kind === "item").length;

  return (
    <div className="container py-10">
      <GalleryHeader
        eyebrow="Item Designs · 物品设计"
        icon={Swords}
        title="物品"
        highlight="馆"
        subtitle="武器、配饰、道具、载具的精致 AI 概念设计，稀有度光环衬底，悬浮微旋呈现立体质感。"
        count={total}
      />

      {/* category tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setCat(t.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
              cat === t.value
                ? "border-magenta/60 bg-magenta/15 text-magenta-soft shadow-glow-magenta"
                : "border-white/12 bg-white/5 text-white/55 hover:text-white",
            )}
          >
            {t.label}
            <span className="ml-1.5 font-mono text-[10px] text-white/35">
              {t.value === "all"
                ? total
                : artworks.filter((a) => a.itemCategory === t.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* sort + rarity inline bar */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            稀有度
          </span>
          {rarityOrder.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRarity(r)}
              className={cn("chip text-xs", rarities.includes(r) && "chip-active")}
            >
              {rarityLabels[r]}
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

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {list.map((a) => (
            <ItemTile key={a.id} artwork={a} />
          ))}
        </div>
      )}
    </div>
  );
}
