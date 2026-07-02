import { useMemo } from "react";
import type { Artwork, ArtworkKind, Rarity, SortKey } from "@/types";
import { artworks } from "@/data/artworks";

export interface FilterState {
  kinds?: ArtworkKind[];
  rarities?: Rarity[];
  tags?: string[];
  factions?: string[];
  moods?: string[];
  itemCategories?: string[];
  authors?: string[];
  query?: string;
  sort?: SortKey;
}

function matchAny<T>(list: T[] | undefined, value: T | undefined) {
  return !list || list.length === 0 || (value != null && list.includes(value));
}

export function useFilteredArtworks(state: FilterState): Artwork[] {
  return useMemo(() => {
    const q = state.query?.trim().toLowerCase();
    const list = artworks.filter((a) => {
      if (state.kinds?.length && !state.kinds.includes(a.kind)) return false;
      if (state.rarities?.length && !state.rarities.includes(a.rarity)) return false;
      if (state.tags?.length && !state.tags.every((t) => a.tags.includes(t))) return false;
      if (!matchAny(state.factions, a.faction)) return false;
      if (!matchAny(state.moods, a.mood)) return false;
      if (!matchAny(state.itemCategories, a.itemCategory)) return false;
      if (!matchAny(state.authors, a.author)) return false;
      if (q) {
        const hay = `${a.title} ${a.author} ${a.tags.join(" ")} ${
          a.faction ?? ""
        } ${a.mood ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sort = state.sort ?? "heat";
    list.sort((a, b) =>
      sort === "newest"
        ? Date.parse(b.createdAt) - Date.parse(a.createdAt)
        : b.heat - a.heat,
    );
    return list;
  }, [state]);
}
