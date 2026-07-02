import { Flame } from "lucide-react";
import type { Artwork } from "@/types";
import { aiImage } from "@/lib/image";
import { formatHeat } from "@/lib/format";
import { kindLabels } from "@/data/meta";
import { useUIStore } from "@/store/useUIStore";
import SmartImage from "@/components/common/SmartImage";
import RarityBadge from "@/components/common/RarityBadge";
import FavoriteButton from "@/components/common/FavoriteButton";

const ASPECT: Record<Artwork["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[16/9]",
};

export default function ResultCard({ artwork: a }: { artwork: Artwork }) {
  const open = useUIStore((s) => s.openDetail);
  return (
    <button
      type="button"
      onClick={() => open(a.id)}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-400 hover:border-magenta/50 hover:shadow-glow-magenta"
    >
      <div className={`relative w-full ${ASPECT[a.aspect]}`}>
        <SmartImage
          src={aiImage(a.prompt, a.aspect)}
          alt={a.title}
          className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <RarityBadge rarity={a.rarity} />
          <span className="rounded-full border border-white/15 bg-ink-950/50 px-2 py-0.5 font-mono text-[10px] text-cyan-soft backdrop-blur">
            {kindLabels[a.kind]}
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <p className="truncate font-display text-base font-bold text-white">{a.title}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-xs text-white/55">{a.author}</span>
            <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-magenta-soft">
              <Flame size={11} /> {formatHeat(a.heat)}
            </span>
          </div>
        </div>
        <FavoriteButton
          id={a.id}
          className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          size={14}
        />
      </div>
    </button>
  );
}
