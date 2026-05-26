import { useEffect, useRef } from 'react';
import { GameEngine } from '@/game/GameEngine';
import { useGameStore } from '@/store/gameStore';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const wave = useGameStore((s) => s.wave);
  const belize = useGameStore((s) => s.belize);
  const renderer = useGameStore((s) => s.renderer);
  const setCurrentFps = useGameStore((s) => s.setCurrentFps);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (engineRef.current) {
      engineRef.current.stop();
    }

    const engine = new GameEngine(canvas, {
      pixelSize: renderer.pixelSize,
      targetFps: renderer.targetFps,
      wave,
      belize,
    });

    engine.setFpsCallback((fps) => setCurrentFps(fps));
    engine.start();
    engineRef.current = engine;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !engineRef.current) return;
      engineRef.current.resize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig({
        wave,
        belize,
        pixelSize: renderer.pixelSize,
        targetFps: renderer.targetFps,
      });
    }
  }, [wave, belize, renderer]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
