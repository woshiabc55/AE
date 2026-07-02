import type { Artwork, ItemCategory, Rarity } from "@/types";
import { artworks } from "./artworks";

export const kindLabels: Record<Artwork["kind"], string> = {
  card: "角色卡牌",
  scene: "场景壁纸",
  item: "物品设计",
};

export const rarityLabels: Record<Rarity, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

export const rarityOrder: Rarity[] = [
  "legendary",
  "epic",
  "rare",
  "common",
];

export const itemCategoryLabels: Record<ItemCategory, string> = {
  weapon: "武器",
  accessory: "配饰",
  prop: "道具",
  vehicle: "载具",
};

export const itemCategoryOrder: ItemCategory[] = [
  "weapon",
  "accessory",
  "prop",
  "vehicle",
];

/** 阵营（卡牌） */
export const factions: string[] = Array.from(
  new Set(artworks.filter((a) => a.faction).map((a) => a.faction!)),
).sort();

/** 氛围（场景） */
export const moods: string[] = Array.from(
  new Set(artworks.filter((a) => a.mood).map((a) => a.mood!)),
).sort();

/** 所有标签按出现频率降序 */
export const allTags: { tag: string; count: number }[] = (() => {
  const map = new Map<string, number>();
  artworks.forEach((a) => a.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
})();

export const topTags = allTags.slice(0, 14);

export const allAuthors: string[] = Array.from(
  new Set(artworks.map((a) => a.author)),
).sort();

export interface GalleryStats {
  total: number;
  authors: number;
  tags: number;
  recent: number;
}

export const stats: GalleryStats = {
  total: artworks.length,
  authors: allAuthors.length,
  tags: allTags.length,
  recent: artworks.filter((a) => Date.parse(a.createdAt) > Date.now() - 1000 * 60 * 60 * 24 * 30).length,
};

export const featured: Artwork[] = artworks.filter((a) => a.featured);

/** 相关推荐：同类型 + 标签重合，排除自身 */
export function getRelated(artwork: Artwork, limit = 6): Artwork[] {
  return artworks
    .filter((a) => a.id !== artwork.id)
    .map((a) => ({
      a,
      score:
        (a.kind === artwork.kind ? 2 : 0) +
        a.tags.filter((t) => artwork.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}
