/**
 * 用于在 Layers / Atlas / Preview 等页面渲染像素画布的缩略图
 */
import type { PixelCanvas } from "@/types";

export function PixelPreviewImage({
  pixel,
  className = "",
  pixelated = true,
}: {
  pixel: PixelCanvas | null | undefined;
  className?: string;
  pixelated?: boolean;
}) {
  if (!pixel) return null;
  return (
    <canvas
      ref={(el) => {
        if (!el) return;
        const ctx = el.getContext("2d");
        if (!ctx) return;
        el.width = pixel.width;
        el.height = pixel.height;
        ctx.imageSmoothingEnabled = false;
        // 棋盘背景
        for (let y = 0; y < pixel.height; y++) {
          for (let x = 0; x < pixel.width; x++) {
            const odd = (x + y) % 2 === 0;
            ctx.fillStyle = odd ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)";
            ctx.fillRect(x, y, 1, 1);
          }
        }
        for (let y = 0; y < pixel.height; y++) {
          for (let x = 0; x < pixel.width; x++) {
            const ci = pixel.data[y * pixel.width + x];
            if (ci === 0) continue;
            ctx.fillStyle = pixel.palette[ci] ?? "transparent";
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }}
      className={className}
      style={{ imageRendering: pixelated ? "pixelated" : "auto" }}
    />
  );
}
