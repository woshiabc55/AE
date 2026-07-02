import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  /** 主图加载失败时的回退 URL（如官方图失败回退到 AI 生成图） */
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/** 图片：懒加载 + 加载骨架 + 淡入 + 主图失败回退到 fallbackSrc。 */
export default function SmartImage({
  src,
  fallbackSrc,
  alt,
  className,
  imgClassName,
  eager = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  // 当前使用的图源：主图失败后切换到 fallbackSrc
  const [current, setCurrent] = useState(src);
  const usedFallback = current !== src;

  return (
    <div className={cn("relative overflow-hidden bg-ink-800", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900" />
      )}
      {error && !fallbackSrc ? (
        <div className="absolute inset-0 grid place-items-center text-xs text-white/30">
          加载失败
        </div>
      ) : (
        <img
          src={current}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            setError(false);
          }}
          onError={() => {
            // 主图失败且有 fallback：切换到 fallback；否则标记错误
            if (!usedFallback && fallbackSrc) {
              setCurrent(fallbackSrc);
              setLoaded(false);
            } else {
              setError(true);
              setLoaded(true);
            }
          }}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
