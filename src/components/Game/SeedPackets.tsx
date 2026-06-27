import { useGameStore } from "@/store/useGameStore";
import type { PlantType } from "@/types";
import Sunflower from "@/svg/plants/Sunflower";
import Peashooter from "@/svg/plants/Peashooter";
import WallNut from "@/svg/plants/WallNut";
import { cn } from "@/lib/utils";

const icons: Record<PlantType, React.ComponentType<{ width?: number; height?: number }>> = {
  sunflower: Sunflower,
  peashooter: Peashooter,
  wallnut: WallNut,
};

export default function SeedPackets() {
  const sun = useGameStore((s) => s.sun);
  const selectedSeed = useGameStore((s) => s.selectedSeed);
  const packets = useGameStore((s) => s.seedPackets);
  const dispatch = useGameStore((s) => s.dispatch);
  const now = performance.now();

  return (
    <div className="flex gap-3 rounded-2xl bg-lawn-800/90 p-3 shadow-hud backdrop-blur">
      {packets.map((pkt) => {
        const Icon = icons[pkt.type];
        const ready = now >= pkt.rechargedAt;
        const affordable = sun >= pkt.cost;
        const disabled = !ready || !affordable;
        const progress = Math.min(1, Math.max(0, (now - (pkt.rechargedAt - pkt.cooldown)) / pkt.cooldown));
        const isSelected = selectedSeed === pkt.type;
        return (
          <button
            key={pkt.type}
            disabled={disabled}
            onClick={() => dispatch({ type: "SELECT_SEED", seed: isSelected ? null : pkt.type })}
            className={cn(
              "relative flex h-20 w-16 flex-col items-center justify-between rounded-xl border-2 p-1 transition-transform active:scale-95",
              isSelected
                ? "border-sun-400 bg-lawn-600"
                : "border-lawn-600 bg-lawn-700 hover:bg-lawn-600",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            <Icon width={32} height={32} />
            <span className="text-xs font-bold text-white">{pkt.cost}</span>
            {!ready && (
              <div
                className="pointer-events-none absolute inset-0 rounded-xl bg-black/55"
                style={{ height: `${(1 - progress) * 100}%`, top: 0 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
