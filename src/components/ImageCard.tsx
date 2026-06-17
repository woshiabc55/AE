import { useEffect } from "react";
import { Download, Maximize2 } from "lucide-react";
import { cn, textToImageUrl } from "@/lib/utils";

interface ImageCardProps {
  prompt: string;
  title: string;
  subtitle?: string;
  paletteFrom: string;
  paletteTo: string;
  size?: "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  badge?: string;
  className?: string;
  onOpen?: () => void;
}

const SIZE_TO_API: Record<NonNullable<ImageCardProps["size"]>, "square" | "portrait_4_3" | "landscape_4_3"> = {
  square: "square",
  portrait_4_3: "portrait_4_3",
  portrait_16_9: "portrait_4_3", // api 仅支持 portrait_4_3，保持比例近似
  landscape_4_3: "landscape_4_3",
  landscape_16_9: "landscape_4_3",
};

const SIZE_TO_CLASS: Record<NonNullable<ImageCardProps["size"]>, string> = {
  square: "aspect-square",
  portrait_4_3: "aspect-[3/4]",
  portrait_16_9: "aspect-[9/16]",
  landscape_4_3: "aspect-[4/3]",
  landscape_16_9: "aspect-[16/9]",
};

export function ImageCard({
  prompt,
  title,
  subtitle,
  paletteFrom,
  paletteTo,
  size = "portrait_4_3",
  badge,
  className,
  onOpen,
}: ImageCardProps) {
  const url = textToImageUrl(prompt, SIZE_TO_API[size]);
  const downloadUrl = textToImageUrl(prompt + ", high resolution, masterpiece", "portrait_4_3");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900",
        SIZE_TO_CLASS[size],
        className,
      )}
    >
      {/* Gradient fallback */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${paletteFrom}, ${paletteTo})` }}
      />
      {/* Generated art */}
      <img
        src={url}
        alt={title}
        loading="eager"
        decoding="async"
        className="relative h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-105"
        onLoad={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "1";
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />
      {/* Bottom darkening */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent opacity-90" />

      {/* Top-left badge */}
      {badge && (
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
          {badge}
        </div>
      )}

      {/* Top-right actions */}
      <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/20 bg-black/50 p-1.5 text-white/80 backdrop-blur transition-colors hover:border-white/50 hover:text-white"
          onClick={(e) => e.stopPropagation()}
          aria-label="下载高清图"
        >
          <Download className="h-3.5 w-3.5" />
        </a>
        {onOpen && (
          <button
            onClick={onOpen}
            className="rounded-full border border-white/20 bg-black/50 p-1.5 text-white/80 backdrop-blur transition-colors hover:border-white/50 hover:text-white"
            aria-label="查看大图"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="line-clamp-1 text-sm font-bold text-white drop-shadow">
          {title}
        </div>
        {subtitle && (
          <div className="line-clamp-1 text-[11px] text-white/60">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

interface LightboxProps {
  src: string | null;
  onClose: () => void;
  alt?: string;
}

export function Lightbox({ src, onClose, alt }: LightboxProps) {
  useEffect(() => {
    if (!src) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt ?? "preview"}
        className="max-h-[90vh] max-w-[90vw] rounded-2xl border border-white/20 shadow-2xl"
      />
    </div>
  );
}
