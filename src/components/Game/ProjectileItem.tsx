import type { Projectile } from "@/types";
import Pea from "@/svg/ui/Pea";

interface Props {
  projectile: Projectile;
}

export default function ProjectileItem({ projectile }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: projectile.x - 8,
        top: projectile.y - 8,
        width: 16,
        height: 16,
      }}
    >
      <Pea width={16} height={16} />
    </div>
  );
}
