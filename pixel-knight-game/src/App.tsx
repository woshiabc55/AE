// 根组件：状态机驱动 标题 / 游戏 / 暂停 / 结算

import { useRef } from "react";
import GameCanvas from "@/components/GameCanvas";
import HUD from "@/components/HUD";
import TitleScreen from "@/components/TitleScreen";
import ResultScreen from "@/components/ResultScreen";
import { useGameStore } from "@/store/useGameStore";
import type { GameEngine } from "@/GameEngine";
import { Play } from "lucide-react";

export default function App() {
  const engineRef = useRef<GameEngine | null>(null);
  const phase = useGameStore((s) => s.phase);

  return (
    <div className="relative h-full w-full overflow-hidden bg-night-950">
      <GameCanvas onEngine={(e) => (engineRef.current = e)} />

      {phase === "title" && (
        <TitleScreen onStart={() => engineRef.current?.startGame()} />
      )}

      {(phase === "playing" || phase === "paused") && (
        <HUD onPause={() => engineRef.current?.togglePause()} />
      )}

      {phase === "paused" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <h2
              className="font-pixel text-3xl text-moon"
              style={{ textShadow: "4px 4px 0 #0b0814" }}
            >
              已 暂 停
            </h2>
            <button
              onClick={() => engineRef.current?.togglePause()}
              className="pixel-btn bg-ember px-8 py-3 text-white text-xs hover:bg-ember-fire flex items-center gap-2"
            >
              <Play size={14} /> 继 续
            </button>
            <button
              onClick={() => engineRef.current?.toTitle()}
              className="font-term text-xl text-moon/60 hover:text-moon"
            >
              返回标题
            </button>
          </div>
        </div>
      )}

      {(phase === "victory" || phase === "defeat") && (
        <ResultScreen
          isVictory={phase === "victory"}
          onRestart={() => engineRef.current?.restart()}
          onTitle={() => engineRef.current?.toTitle()}
        />
      )}
    </div>
  );
}
