import type { Live2DProjectData } from '@/types';
import { sampleKeyframes } from './easing';

export function applyMotions(
  motions: Live2DProjectData['motions'],
  time: number,
  current: Record<string, number>,
): Record<string, number> {
  const out = { ...current };
  for (const m of motions) {
    if (m.trigger !== 'idle' || !m.loop) continue;
    const period = m.tracks.reduce((max, t) => {
      const last = t.keyframes[t.keyframes.length - 1]?.time ?? 0;
      return Math.max(max, last);
    }, 0);
    if (period <= 0) continue;
    const local = time % period;
    for (const tr of m.tracks) {
      const v = sampleKeyframes(tr.keyframes, local);
      if (typeof v === 'number') out[tr.parameterId] = v;
    }
  }
  return out;
}
