import { useState } from "react";
import { Flame, RotateCw } from "lucide-react";
import type { Artwork } from "@/types";
import { artworkImage } from "@/lib/image";
import { formatHeat } from "@/lib/format";
import { useUIStore } from "@/store/useUIStore";
import { useTilt } from "@/hooks/useTilt";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

const RARITY_BORDER: Record<Artwork["rarity"], string> = {
  common: "border-white/12",
  rare: "border-rarity-rare/50",
  epic: "border-rarity-epic/55",
  legendary: "border-rarity-legendary/60",
};
const RARITY_GLOW: Record<Artwork["rarity"], string> = {
  common: "",
  rare: "hover:shadow-[0_0_30px_-8px_rgba(77,141,255,0.5)]",
  epic: "hover:shadow-[0_0_34px_-8px_rgba(177,92,255,0.55)]",
  legendary: "hover:shadow-[0_0_38px_-8px_rgba(255,181,71,0.6)]",
};

export default function CardTile({ artwork }: { artwork: Artwork }) {
  const open = useUIStore((s) => s.openDetail);
  const [flipped, setFlipped] = useState(false);
  const { ref, onMove, onLeave } = useTilt(10);

  return (
    <div className="perspective-1000">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`preserve-3d relative aspect-[3/4.4] cursor-pointer rounded-2xl border ${RARITY_BORDER[artwork.rarity]} ${RARITY_GLOW[artwork.rarity]} bg-ink-800 transition-all duration-300`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => open(artwork.id)}
      >
        {/* sheen following cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.14), transparent 60%)",
          }}
        />

        <div
          className="preserve-3d relative h-full w-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          {/* FRONT */}
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl">
            <SmartImage
              src={artworkImage(artwork).src}
              fallbackSrc={artworkImage(artwork).fallback}
              alt={artwork.title}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />

            <div className="absolute left-3 top-3 flex items-center gap-2">
              <RarityBadge rarity={artwork.rarity} />
              {artwork.faction && (
                <span className="rounded-full border border-white/15 bg-ink-950/50 px-2 py-0.5 font-mono text-[10px] text-magenta-soft backdrop-blur">
                  {artwork.faction}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-ink-950/50 text-white/60 backdrop-blur transition-colors hover:text-cyan-soft"
              aria-label="翻转卡牌"
            >
              <RotateCw size={14} />
            </button>

            <div className="absolute inset-x-3 bottom-3">
              <p className="font-display text-lg font-bold text-white neon-text">
                {artwork.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/55">{artwork.author}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-magenta-soft">
                  <Flame size={11} /> {formatHeat(artwork.heat)}
                </span>
                <FavoriteButton id={artwork.id} className="h-7 w-7" size={13} />
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 p-5"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div>
              <div className="flex items-center justify-between">
                <RarityBadge rarity={artwork.rarity} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-white/60 hover:text-cyan-soft"
                  aria-label="翻回正面"
                >
                  <RotateCw size={13} />
                </button>
              </div>
              <p className="mt-4 font-display text-xl font-bold text-white">
                {artwork.title}
              </p>
              <p className="mt-1 text-xs text-white/45">{artwork.author}</p>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-magenta/50 to-transparent" />
              <p className="mt-4 font-sans text-sm leading-relaxed text-white/70">
                {artwork.backInscription ?? "——"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {artwork.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
