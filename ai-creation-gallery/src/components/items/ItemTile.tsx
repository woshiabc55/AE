import { Flame } from "lucide-react";
import type { Artwork } from "@/types";
import { artworkImage } from "@/lib/image";
import { formatHeat } from "@/lib/format";
import { itemCategoryLabels } from "@/data/meta";
import { useUIStore } from "@/store/useUIStore";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

const RARITY_RING: Record<Artwork["rarity"], string> = {
  common: "from-white/10 to-white/5",
  rare: "from-rarity-rare/30 to-rarity-rare/5",
  epic: "from-rarity-epic/35 to-rarity-epic/5",
  legendary: "from-rarity-legendary/35 to-rarity-legendary/5",
};

export default function ItemTile({ artwork }: { artwork: Artwork }) {
  const open = useUIStore((s) => s.openDetail);
  return (
    <button
      type="button"
      onClick={() => open(artwork.id)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800 text-left transition-all duration-400 hover:border-magenta/50 hover:shadow-glow-magenta"
    >
      <div className="relative aspect-square overflow-hidden">
        {/* radial backdrop by rarity */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${RARITY_RING[artwork.rarity]}`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.06),transparent_60%)]" />
        <SmartImage
          src={artworkImage(artwork).src}
          fallbackSrc={artworkImage(artwork).fallback}
          alt={artwork.title}
          className="absolute inset-0 h-full w-full p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
          imgClassName="object-contain [mix-blend-mode:normal] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        />

        <div className="absolute left-3 top-3">
          <RarityBadge rarity={artwork.rarity} />
        </div>
        {artwork.itemCategory && (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-ink-950/50 px-2 py-0.5 font-mono text-[10px] text-cyan-soft backdrop-blur">
            {itemCategoryLabels[artwork.itemCategory]}
          </span>
        )}
      </div>

      <div className="border-t border-white/8 bg-ink-900/60 p-3.5">
        <p className="truncate font-display text-base font-bold text-white">
          {artwork.title}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="truncate text-xs text-white/45">{artwork.author}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-magenta-soft">
              <Flame size={11} /> {formatHeat(artwork.heat)}
            </span>
            <FavoriteButton id={artwork.id} className="h-7 w-7" size={13} />
          </div>
        </div>
      </div>
    </button>
  );
}
