import { useEffect, useRef } from 'react';
import type { KeyState } from '@/utils/types';
import { useGameStore } from '@/store/gameStore';
import { tickGame } from '@/utils/physics';
import { drawScene } from '@/utils/render';
import { MechaAI } from '@/utils/ai';

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  keysRef: React.MutableRefObject<KeyState>,
): void {
  const rafRef = useRef<number | null>(null);
  const aiRef = useRef<MechaAI | null>(null);
  const setGameState = useGameStore((s) => s.setGameState);
  const mode = useGameStore((s) => s.mode);
  const difficulty = useGameStore((s) => s.difficulty);
  const screen = useGameStore((s) => s.screen);

  useEffect(() => {
    if (mode === 'pvc' && screen === 'fighting') {
      aiRef.current = new MechaAI(difficulty, 'blue');
    } else {
      aiRef.current = null;
    }
  }, [mode, difficulty, screen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const loop = () => {
      setGameState((state) => {
        const next = { ...state };
        if (aiRef.current) {
          aiRef.current.update(next, keysRef.current);
        }
        tickGame(next, keysRef.current);
        drawScene(ctx, next);
        return next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [canvasRef, keysRef, setGameState]);
}
