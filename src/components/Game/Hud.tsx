import { Sun, Heart, Waves } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

export default function Hud() {
  const sun = useGameStore((s) => s.sun);
  const lives = useGameStore((s) => s.lives);
  const wave = useGameStore((s) => s.wave);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-lawn-800/90 px-6 py-3 text-white shadow-hud backdrop-blur">
      <div className="flex items-center gap-2">
        <Sun className="h-6 w-6 fill-sun-400 text-sun-500" />
        <span className="font-pixel text-lg">{sun}</span>
      </div>
      <div className="h-6 w-px bg-white/20" />
      <div className="flex items-center gap-2">
        <Waves className="h-6 w-6 text-sky-300" />
        <span className="font-pixel text-sm">第 {wave} 波</span>
      </div>
      <div className="h-6 w-px bg-white/20" />
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 fill-red-500 text-red-600" />
        <span className="font-pixel text-sm">{lives}</span>
      </div>
    </div>
  );
}
