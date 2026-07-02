import { SlidersHorizontal, X, Flame, Clock } from "lucide-react";
import type { ArtworkKind, Rarity, SortKey } from "@/types";
import {
  rarityLabels,
  rarityOrder,
  factions,
  moods,
  itemCategoryOrder,
  itemCategoryLabels,
  allTags,
} from "@/data/meta";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  kind: ArtworkKind;
  rarities: Rarity[];
  toggleRarity: (r: Rarity) => void;
  groups: string[];
  toggleGroup: (g: string) => void;
  tags: string[];
  toggleTag: (t: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  reset: () => void;
  activeCount: number;
  resultCount: number;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/8 py-5 first:border-t-0 first:pt-0">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
        {title}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("chip text-sm", active && "chip-active")}
    >
      {children}
    </button>
  );
}

export default function FilterSidebar({
  kind,
  rarities,
  toggleRarity,
  groups,
  toggleGroup,
  tags,
  toggleTag,
  sort,
  setSort,
  reset,
  activeCount,
  resultCount,
}: FilterSidebarProps) {
  const groupLabel = kind === "card" ? "阵营" : kind === "scene" ? "氛围" : "类型";
  const groupOptions =
    kind === "card"
      ? factions.map((f) => ({ value: f, label: f }))
      : kind === "scene"
        ? moods.map((m) => ({ value: m, label: m }))
        : itemCategoryOrder.map((c) => ({ value: c, label: itemCategoryLabels[c] }));

  return (
    <div className="glass sticky top-20 rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-cyan" />
          <span className="font-display text-sm font-bold tracking-wide text-white">
            筛选
          </span>
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 font-mono text-[10px] font-bold text-ink-950">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs text-white/45 transition-colors hover:text-magenta-soft"
          >
            <X size={12} /> 清空
          </button>
        )}
      </div>

      <Section title="稀有度">
        <div className="flex flex-wrap gap-2">
          {rarityOrder.map((r) => (
            <Toggle key={r} active={rarities.includes(r)} onClick={() => toggleRarity(r)}>
              {rarityLabels[r]}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section title={groupLabel}>
        <div className="flex flex-wrap gap-2">
          {groupOptions.map((g) => (
            <Toggle
              key={g.value}
              active={groups.includes(g.value)}
              onClick={() => toggleGroup(g.value)}
            >
              {g.label}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section title="风格标签">
        <div className="flex flex-wrap gap-2">
          {allTags.map(({ tag }) => (
            <Toggle key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
              #{tag}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section title="排序">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSort("heat")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors",
              sort === "heat"
                ? "border-magenta/60 bg-magenta/15 text-magenta-soft"
                : "border-white/12 bg-white/5 text-white/55 hover:text-white",
            )}
          >
            <Flame size={13} /> 热度
          </button>
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors",
              sort === "newest"
                ? "border-cyan/60 bg-cyan/15 text-cyan-soft"
                : "border-white/12 bg-white/5 text-white/55 hover:text-white",
            )}
          >
            <Clock size={13} /> 最新
          </button>
        </div>
      </Section>

      <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
        <span className="font-display text-2xl font-black text-white">{resultCount}</span>
        <span className="ml-1 text-xs text-white/40">件匹配作品</span>
      </div>
    </div>
  );
}
