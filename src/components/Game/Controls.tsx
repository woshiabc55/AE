import { Play, Pause, RotateCcw, BookOpen } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Controls() {
  const status = useGameStore((s) => s.status);
  const dispatch = useGameStore((s) => s.dispatch);
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-lawn-800/90 p-3 shadow-hud backdrop-blur">
      <button
        onClick={() => dispatch({ type: "START" })}
        className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-white transition-transform active:scale-95",
          status === "running" ? "bg-amber-600 hover:bg-amber-500" : "bg-plant hover:bg-lawn-400"
        )}
      >
        {status === "running" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {status === "running" ? "暂停" : "开始"}
      </button>
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="flex items-center gap-2 rounded-xl bg-zombie-suit px-4 py-2 font-bold text-white transition-transform hover:bg-zombie-dark active:scale-95"
      >
        <RotateCcw className="h-5 w-5" />
        重置
      </button>
      <button
        onClick={() => navigate("/gallery")}
        className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 font-bold text-white transition-transform hover:bg-sky-500 active:scale-95"
      >
        <BookOpen className="h-5 w-5" />
        图鉴
      </button>
    </div>
  );
}
