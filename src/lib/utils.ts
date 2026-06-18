import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getRealAssetForHero } from "@/data/realAssets";
import type { Hero, Skin } from "@/data/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textToImageUrl(
  prompt: string,
  size: "square" | "portrait_4_3" | "landscape_4_3" = "square",
): string {
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`;
}

export interface CoverSource {
  url: string;
  isReal: boolean;
  source?: string;
}

/**
 * 角色封面：优先使用真实素材（来自官方 Wiki），否则回退到 AI 生成。
 */
export function getHeroCover(hero: Hero, apiSize: "portrait_4_3" | "landscape_4_3" | "square" = "landscape_4_3"): CoverSource {
  const real = hero.realAssetKey ? getRealAssetForHero(hero.realAssetKey) : undefined;
  if (real) {
    return { url: real.url, isReal: true, source: real.source };
  }
  const prompt = `${hero.motif} game character concept art, cinematic lighting, ultra detailed, 4k`;
  return { url: textToImageUrl(prompt, apiSize), isReal: false };
}

/**
 * 皮肤封面：若皮肤绑定真实素材则用素材，否则生成 AI 图。
 */
export function getSkinCover(
  hero: Hero,
  skin: Skin,
  apiSize: "portrait_4_3" | "landscape_4_3" = "landscape_4_3",
): CoverSource {
  // 复用 hero 的 realAssetKey 作皮肤占位（皮肤通常会共享角色主体立绘）
  const real = hero.realAssetKey ? getRealAssetForHero(hero.realAssetKey) : undefined;
  if (real) {
    return { url: real.url, isReal: true, source: real.source };
  }
  const prompt = `${hero.motif} ${skin.motif} skin concept art, ultra detailed, 4k`;
  return { url: textToImageUrl(prompt, apiSize), isReal: false };
}

// Hash a string to a number in [0, 1) — used to deterministically pick colors / patterns
export function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}
