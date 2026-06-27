import type { Plant } from "@/types";
import Sunflower from "@/svg/plants/Sunflower";
import Peashooter from "@/svg/plants/Peashooter";
import WallNut from "@/svg/plants/WallNut";
import { CELL_SIZE } from "@/engine/constants";

interface Props {
  plant: Plant;
}

const components = {
  sunflower: Sunflower,
  peashooter: Peashooter,
  wallnut: WallNut,
};

export default function PlantItem({ plant }: Props) {
  const Svg = components[plant.type];
  const ratio = plant.hp / plant.maxHp;
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: plant.col * CELL_SIZE,
        top: plant.row * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <Svg width={56} height={60} />
      {ratio < 1 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded bg-black/40 overflow-hidden">
          <div
            className="h-full bg-plant"
            style={{ width: `${Math.max(0, ratio * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
