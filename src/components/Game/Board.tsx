import { useGameStore } from "@/store/useGameStore";
import { ROWS, COLS, LAWN_WIDTH, LAWN_HEIGHT } from "@/engine/constants";
import Background from "@/svg/scenes/Background";
import PlantItem from "./PlantItem";
import ZombieItem from "./ZombieItem";
import ProjectileItem from "./ProjectileItem";
import SunItem from "./SunItem";
import { cn } from "@/lib/utils";

export default function Board() {
  const plants = useGameStore((s) => s.plants);
  const zombies = useGameStore((s) => s.zombies);
  const projectiles = useGameStore((s) => s.projectiles);
  const suns = useGameStore((s) => s.suns);
  const selectedSeed = useGameStore((s) => s.selectedSeed);
  const dispatch = useGameStore((s) => s.dispatch);

  return (
    <div
      className="relative select-none overflow-hidden rounded-xl border-4 border-lawn-700 shadow-2xl"
      style={{ width: LAWN_WIDTH, height: LAWN_HEIGHT }}
    >
      <Background width={LAWN_WIDTH} height={LAWN_HEIGHT} className="absolute inset-0" />
      <div
        className="absolute grid"
        style={{
          top: 0,
          left: 0,
          width: LAWN_WIDTH,
          height: LAWN_HEIGHT,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          return (
            <button
              key={`${row}-${col}`}
              className={cn(
                "relative border border-lawn-600/20 transition-colors",
                selectedSeed && "hover:bg-white/15 cursor-pointer",
                !selectedSeed && "cursor-default"
              )}
              onMouseEnter={() => dispatch({ type: "HOVER_CELL", cell: { row, col } })}
              onMouseLeave={() => dispatch({ type: "HOVER_CELL", cell: null })}
              onClick={() => dispatch({ type: "PLANT", row, col })}
              aria-label={`第 ${row + 1} 行第 ${col + 1} 列`}
            />
          );
        })}
      </div>
      {plants.map((p) => (
        <PlantItem key={p.id} plant={p} />
      ))}
      {zombies.map((z) => (
        <ZombieItem key={z.id} zombie={z} />
      ))}
      {projectiles.map((p) => (
        <ProjectileItem key={p.id} projectile={p} />
      ))}
      {suns.map((s) => (
        <SunItem key={s.id} sun={s} />
      ))}
    </div>
  );
}
