export type GameId =
  | "kog"
  | "genshin"
  | "lol"
  | "csgo"
  | "mc"
  | "naraka"
  | "pubg"
  | "zzz";

export type CategoryId =
  | "tank"
  | "warrior"
  | "assassin"
  | "mage"
  | "marksman"
  | "support"
  | "open-world"
  | "fps"
  | "sandbox"
  | "battle-royale";

export type Rarity = "勇者" | "史诗" | "传说" | "无双" | "限定";

export interface Game {
  id: GameId;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  category: CategoryId;
  cover: string; // CSS gradient string
  accent: string; // accent hex
  symbol: string; // decorative sigil character
  year: number;
}

export interface Skin {
  id: string;
  heroId: string;
  name: string;
  rarity: Rarity;
  motif: string; // motif keywords, used for cover generation
  realAssetKey?: string; // 可选：关联真实素材 key（'hok:李 白' / 'lol:ahri' 等）
}

export interface Hero {
  id: string;
  gameId: GameId;
  name: string;
  nameEn: string;
  title: string; // e.g. "剑仙"
  category: CategoryId;
  region: string;
  rarity: Rarity;
  motif: string; // visual motif keywords for avatar gradient + art
  paletteFrom: string;
  paletteTo: string;
  bio: string;
  skills: string[];
  featured: boolean;
  realAssetKey?: string; // 可选：关联真实素材 key
  skins: Skin[];
}
