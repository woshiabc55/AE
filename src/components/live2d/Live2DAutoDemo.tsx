import { useEffect, useState } from 'react';
import Live2DStage from './Live2DStage';
import type { Live2DProjectData } from '@/types';
import { applyMotions } from '@/engine/live2d-runtime';

export default function Live2DAutoDemo({ data, className }: { data: Live2DProjectData; className?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const values = applyMotions(data.motions, t, {});
  // 强制眨眼:每 4 秒插入一次
  const blinkPhase = t % 4;
  if (blinkPhase > 3.85 && blinkPhase < 4) {
    values.par_eye_l_open = Math.max(0.05, 1 - (blinkPhase - 3.85) / 0.075);
    values.par_eye_r_open = values.par_eye_l_open;
  }

  return <Live2DStage data={data} paramValues={values} className={className} time={t} />;
}
