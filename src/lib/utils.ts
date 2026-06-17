import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

// Hash a string to a number in [0, 1) — used to deterministically pick colors / patterns
export function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}
