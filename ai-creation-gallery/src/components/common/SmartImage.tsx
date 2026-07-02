import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}

/** 图片：懒加载 + 加载骨架 + 淡入。 */
export default function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-ink-800", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900" />
      )}
      {error ? (
        <div className="absolute inset-0 grid place-items-center text-xs text-white/30">
          加载失败
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
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
