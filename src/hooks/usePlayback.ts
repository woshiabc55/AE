import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ALL_SHOTS } from '@/data/scripts';

/**
 * 主时间轴：按 RAF 推进，到达 shot.duration 时调用 next()
 * 慢动作时（speed=0.4）实际播放时间 = duration * (1/0.4) = 2.5x
 */
export function usePlayback() {
  const lastTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const elapsedTotalRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ isPlaying: false, currentIndex: 0, speed: 1 as 1 | 0.4 });

  useEffect(() => {
    lastTimeRef.current = performance.now();
    const unsub = usePlayerStore.subscribe((state) => {
      stateRef.current = { isPlaying: state.isPlaying, currentIndex: state.currentIndex, speed: state.speed };
      if (state.isPlaying) {
        lastTimeRef.current = performance.now();
        accumulatedRef.current = 0;
      }
    });

    const tick = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const { isPlaying, speed } = stateRef.current;
      if (isPlaying) {
        // 慢动作时时间走得慢（speed=0.4 实际推进 = dt * 0.4）
        const advance = dt * speed;
        accumulatedRef.current += advance;
        elapsedTotalRef.current += advance;
        const shot = ALL_SHOTS[stateRef.current.currentIndex];
        if (shot && accumulatedRef.current >= shot.duration) {
          accumulatedRef.current = 0;
          usePlayerStore.getState().next();
        }
      }
      // 推一个自定义事件供 HUD 读取总时长
      (window as unknown as { __playbackElapsed?: number }).__playbackElapsed = elapsedTotalRef.current;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
}

/** 读取当前累计播放时间（毫秒），需要外部 forceUpdate 才能响应 */
export function getPlaybackElapsed(): number {
  return (window as unknown as { __playbackElapsed?: number }).__playbackElapsed ?? 0;
}
