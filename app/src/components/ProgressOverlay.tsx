import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatTime } from '../lib/audio';
import { MEME } from '../data/memes';

interface Props {
  active: boolean;
  current: { card: { title: string; category: string }; idx: number; total: number } | null;
  elapsedMs: number;
}

export default function ProgressOverlay({ active, current, elapsedMs }: Props) {
  const totalMs = useAppStore(s => s.totalMinutes) * 60 * 1000;
  const [rain, setRain] = useState<number[]>([]);

  useEffect(() => {
    if (active && rain.length === 0) {
      setRain(Array.from({ length: 36 }, (_, i) => i));
    } else if (!active) {
      setRain([]);
    }
  }, [active, rain.length]);

  if (!active) return null;
  const remain = Math.max(0, totalMs - elapsedMs);
  const pct = Math.min(100, (elapsedMs / totalMs) * 100);

  return (
    <div className="overlay on">
      <div className="emojis">
        {rain.map(i => (
          <i key={i} style={{
            left: `${(i * 137) % 100}%`,
            animationDuration: `${4 + (i % 7)}s`,
            animationDelay: `${(i % 5) * 0.6}s`,
            fontSize: `${24 + (i % 6) * 6}px`,
          }}>{MEME[i % MEME.length].emoji}</i>
        ))}
      </div>
      <h2>RECORDING</h2>
      <div className="bigtime">{formatTime(remain)}</div>
      <div className="now">
        {current ? `${current.card.title}` : '准备中…'}
        <span>{current ? `${current.idx} / ${current.total} · ${current.card.category}` : '—'}</span>
      </div>
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <div className="hint">请勿切换标签页 · 正在本地合成 WebM</div>
    </div>
  );
}
