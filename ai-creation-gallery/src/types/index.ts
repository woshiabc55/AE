export type ArtworkKind = "card" | "scene" | "item";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type ItemCategory = "weapon" | "accessory" | "prop" | "vehicle";

export type Aspect = "portrait" | "square" | "landscape";

export interface Artwork {
  id: string;
  kind: ArtworkKind;
  title: string;
  author: string;
  prompt: string;
  rarity: Rarity;
  aspect: Aspect;
  tags: string[];
  heat: number;
  createdAt: string;
  featured?: boolean;
  // item
  itemCategory?: ItemCategory;
  // card
  faction?: string;
  backInscription?: string;
  // scene
  mood?: string;
  // 官方图（二游 IP 官方立绘/场景图 URL）；为空时回退到 AI 生成图
  officialImage?: string;
}

export type SortKey = "heat" | "newest";
