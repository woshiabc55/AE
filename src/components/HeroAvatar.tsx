import { cn, hashSeed } from "@/lib/utils";
import type { Hero } from "@/data/types";

interface HeroAvatarProps {
  hero: Hero;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showName?: boolean;
}

// Stylized geometric avatar — purely CSS/SVG, no external assets needed
// Picks a unique composition based on the hero id for visual variety
export function HeroAvatar({
  hero,
  size = "md",
  className,
  showName = true,
}: HeroAvatarProps) {
  const sizeMap = {
    sm: { box: "h-10 w-10", text: "text-sm", kanji: "text-base" },
    md: { box: "h-16 w-16", text: "text-base", kanji: "text-2xl" },
    lg: { box: "h-28 w-28", text: "text-lg", kanji: "text-4xl" },
    xl: { box: "h-44 w-44", text: "text-2xl", kanji: "text-7xl" },
  };

  const seed = hashSeed(hero.id);
  const angle = Math.floor(seed * 360);
  const ringOn = seed > 0.5;

  return (
    <div className={cn("relative shrink-0", sizeMap[size].box, className)}>
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(${angle}deg, ${hero.paletteFrom}, ${hero.paletteTo})`,
        }}
      >
        {/* Decorative layers */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.3) 0%, transparent 50%)",
          }}
        />
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full opacity-30"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`pat-${hero.id}`}
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${angle})`}
            >
              <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.4)" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#pat-${hero.id})`} />
        </svg>

        {/* Chinese character of hero name */}
        <div
          className={cn(
            "relative z-10 flex h-full w-full items-center justify-center font-serif font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
            sizeMap[size].kanji,
          )}
        >
          {hero.name[0]}
        </div>

        {ringOn && (
          <div className="absolute inset-2 rounded-xl border border-white/30" />
        )}
      </div>

      {showName && size === "lg" && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/80 px-3 py-1 text-xs text-white/80 backdrop-blur">
          {hero.name}
        </div>
      )}
    </div>
  );
}
