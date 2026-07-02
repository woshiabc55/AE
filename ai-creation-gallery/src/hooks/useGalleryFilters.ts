import { useMemo, useState } from "react";
import type { ArtworkKind, Rarity, SortKey } from "@/types";
import type { FilterState } from "./useFilteredArtworks";

interface GroupConfig {
  key: "factions" | "moods" | "itemCategories";
  options: string[];
  label: string;
}

export const GROUP_CONFIG: Record<ArtworkKind, GroupConfig> = {
  card: { key: "factions", options: [], label: "阵营" },
  scene: { key: "moods", options: [], label: "氛围" },
  item: { key: "itemCategories", options: [], label: "类型" },
};

export function useGalleryFilters(kind: ArtworkKind) {
  const [rarities, setRarities] = useState<Rarity[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("heat");

  const groupKey = GROUP_CONFIG[kind].key;

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (value: T) =>
    setter((list) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]));

  const filters: FilterState = useMemo(() => {
    const base: FilterState = { kinds: [kind], rarities, tags, sort };
    base[groupKey] = groups;
    return base;
  }, [kind, rarities, tags, sort, groups, groupKey]);

  const activeCount =
    rarities.length + tags.length + groups.length + (sort !== "heat" ? 0 : 0);

  const reset = () => {
    setRarities([]);
    setTags([]);
    setGroups([]);
    setSort("heat");
  };

  return {
    filters,
    rarities,
    tags,
    groups,
    sort,
    toggleRarity: toggle(setRarities),
    toggleTag: toggle(setTags),
    toggleGroup: toggle(setGroups),
    setSort,
    reset,
    activeCount,
  };
}
