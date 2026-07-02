// Canvas 挂载 + 引擎生命周期管理

import { useEffect, useRef } from "react";
import { GameEngine } from "@/GameEngine";
import { VIEW_W, VIEW_H } from "@/config";

interface Props {
  onEngine: (e: GameEngine) => void;
}

export default function GameCanvas({ onEngine }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = VIEW_W;
    canvas.height = VIEW_H;
    const engine = new GameEngine(canvas);
    engineRef.current = engine;
    onEngine(engine);
    engine.start();

    // 暂停快捷键
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" || e.code === "KeyP") {
        e.preventDefault();
        engine.togglePause();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-night-950">
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] aspect-video shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}
