import type { Sun } from "@/types";
import SunSvg from "@/svg/ui/Sun";
import { useGameStore } from "@/store/useGameStore";

interface Props {
  sun: Sun;
}

export default function SunItem({ sun }: Props) {
  const dispatch = useGameStore((s) => s.dispatch);
  return (
    <button
      className="absolute cursor-pointer transition-transform hover:scale-110 active:scale-95 animate-float"
      style={{
        left: sun.x - 18,
        top: sun.y - 18,
        width: 36,
        height: 36,
      }}
      onClick={() => dispatch({ type: "COLLECT_SUN", id: sun.id })}
      aria-label="收集阳光"
    >
      <SunSvg width={36} height={36} />
    </button>
  );
}
