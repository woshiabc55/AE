import type { Rarity } from "@/types";
import { rarityLabels } from "@/data/meta";
import { cn } from "@/lib/utils";

const STYLES: Record<Rarity, string> = {
  common: "text-rarity-common border-rarity-common/40 bg-rarity-common/10",
  rare: "text-rarity-rare border-rarity-rare/40 bg-rarity-rare/10",
  epic: "text-rarity-epic border-rarity-epic/40 bg-rarity-epic/10",
  legendary: "text-rarity-legendary border-rarity-legendary/40 bg-rarity-legendary/10",
};

const GLOW: Record<Rarity, string> = {
  common: "",
  rare: "shadow-[0_0_12px_-2px_rgba(77,141,255,0.5)]",
  epic: "shadow-[0_0_12px_-2px_rgba(177,92,255,0.55)]",
  legendary: "shadow-[0_0_14px_-2px_rgba(255,181,71,0.6)]",
};

export default function RarityBadge({
  rarity,
  className,
}: {
  rarity: Rarity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        STYLES[rarity],
        GLOW[rarity],
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {rarityLabels[rarity]}
    </span>
  );
}
