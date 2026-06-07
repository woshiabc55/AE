// 游戏主循环 - 通过 requestAnimationFrame 驱动

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const lastTime = useRef<number>(performance.now());
  const tickFn = useGameStore((s) => s.tick);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.5, (now - lastTime.current) / 1000); // 上限 0.5s
      lastTime.current = now;
      // 1x 速率（可由设置调整）
      tickFn(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tickFn]);
}
