import type { Zombie } from "@/types";
import BasicZombie from "@/svg/zombies/BasicZombie";
import ConeheadZombie from "@/svg/zombies/ConeheadZombie";
import BucketheadZombie from "@/svg/zombies/BucketheadZombie";
import { CELL_SIZE } from "@/engine/constants";

interface Props {
  zombie: Zombie;
}

const components = {
  basic: BasicZombie,
  conehead: ConeheadZombie,
  buckethead: BucketheadZombie,
};

export default function ZombieItem({ zombie }: Props) {
  const Svg = components[zombie.type];
  const ratio = zombie.hp / zombie.maxHp;
  return (
    <div
      className="absolute flex flex-col items-center justify-end"
      style={{
        left: zombie.x - 30,
        top: zombie.row * CELL_SIZE - 8,
        width: 60,
        height: CELL_SIZE + 16,
      }}
    >
      <Svg width={52} height={64} isHit={zombie.isHit} isAttacking={zombie.isAttacking} />
      <div className="h-1.5 w-12 rounded bg-black/40 overflow-hidden mt-1">
        <div
          className="h-full bg-red-500"
          style={{ width: `${Math.max(0, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
