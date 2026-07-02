import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { cn } from "@/lib/utils";

export default function FavoriteButton({
  id,
  className,
  size = 18,
}: {
  id: string;
  className?: string;
  size?: number;
}) {
  const active = useFavoriteStore((s) => s.ids.includes(id));
  const toggle = useFavoriteStore((s) => s.toggle);
  return (
    <button
      type="button"
      aria-label={active ? "取消收藏" : "收藏"}
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "grid place-items-center rounded-full border transition-all duration-300",
        active
          ? "border-magenta/60 bg-magenta/20 text-magenta shadow-glow-magenta"
          : "border-white/15 bg-white/5 text-white/60 hover:border-magenta/50 hover:text-magenta",
        className,
      )}
    >
      <Heart size={size} className={active ? "fill-current" : ""} />
    </button>
  );
}
