import { useEffect, useRef } from 'react';
import { GameEngine } from '@/game/engine';
import { useGameStore } from '@/store/gameStore';
import { CANVAS_W, CANVAS_H } from '@/game/types';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const setResult = useGameStore((s) => s.setResult);
  const setPhase = useGameStore((s) => s.setPhase);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine();
    engineRef.current = engine;

    engine.init(canvas, (result) => {
      setResult(result);
      setPhase('result');
    });

    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [setResult, setPhase]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: `${CANVAS_W}px`,
          maxHeight: `${CANVAS_H}px`,
          imageRendering: 'pixelated',
          aspectRatio: `${CANVAS_W}/${CANVAS_H}`,
        }}
      />
    </div>
  );
}
