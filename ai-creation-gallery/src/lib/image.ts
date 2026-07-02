import type { Aspect } from "@/types";

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
