import type { Aspect, Artwork } from "@/types";

type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

const ENDPOINT = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

const SIZE_BY_ASPECT: Record<Aspect, ImageSize> = {
  portrait: "portrait_4_3",
  square: "square",
  landscape: "landscape_16_9",
};

/** Build an AI-generated image URL for a given prompt and aspect. */
export function aiImage(prompt: string, aspect: Aspect = "square"): string {
  const params = new URLSearchParams({
    prompt,
    image_size: SIZE_BY_ASPECT[aspect],
  });
  return `${ENDPOINT}?${params.toString()}`;
}

export interface ResolvedImage {
  /** 主图 URL（若有官方图则为官方图，否则为 AI 生成图） */
  src: string;
  /** 回退 URL（主图为官方图时，回退到 AI 生成图；否则为 undefined） */
  fallback?: string;
}

/**
 * 解析作品图源：优先使用官方图（二游 IP 官方立绘/场景图），
 * 加载失败时回退到内置 AI 生成图（契合"AI 二创"主题）。
 */
export function artworkImage(artwork: Artwork): ResolvedImage {
  const ai = aiImage(artwork.prompt, artwork.aspect);
  if (artwork.officialImage) {
    return { src: artwork.officialImage, fallback: ai };
  }
  return { src: ai };
}
