import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { themes } from '@/themes/themes';

function useTickingNumber(value: number, decimals = 0) {
  const [v, setV] = useState(value);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 80) {
        setV(value);
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return v.toFixed(decimals);
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] tracking-[0.22em] text-white/40 font-mono uppercase">{label}</span>
      <span className="text-[13px] font-mono text-white tabular-nums">{value}</span>
      {unit && <span className="text-[9px] tracking-widest text-white/35 font-mono">{unit}</span>}
    </div>
  );
}

function BeatDot({ beat }: { beat: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.22em] text-white/40 font-mono uppercase">BEAT</span>
      <div className="relative h-2 w-12 bg-white/8 overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7DF9FF] via-[#9B5DE5] to-[#FF3CAC]"
          style={{ width: `${Math.min(100, beat * 100)}%`, transition: 'width 60ms linear' }}
        />
      </div>
    </div>
  );
}

export default function HUD() {
  const fps = useTickingNumber(useStore((s) => s.fps));
  const rms = useTickingNumber(useStore((s) => s.rms), 3);
  const bpm = useTickingNumber(useStore((s) => s.bpm));
  const beat = useStore((s) => s.beat);
  const mode = useStore((s) => s.mode);
  const resolution = useStore((s) => s.resolution);
  const theme = useStore((s) => s.theme);
  const t = themes[theme];
  const time = useClock();

  return (
    <>
      {/* 顶部左侧 */}
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-1.5 px-3 py-2 rounded-lg border border-white/8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF3CAC] shadow-[0_0_8px_#FF3CAC] animate-pulse" />
          <span className="text-[9px] tracking-[0.32em] text-white/65 font-mono">PULSE·PARTICLES</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Metric label="BPM" value={bpm} />
          <Metric label="RMS" value={rms} />
          <BeatDot beat={beat} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Metric label="MODE" value={mode} />
          <Metric label="FPS" value={fps} />
          <Metric label="THEME" value={t.name.toUpperCase()} />
        </div>
      </div>

      {/* 顶部右侧 */}
      <div className="pointer-events-none absolute top-4 right-4 flex flex-col items-end gap-1.5 px-3 py-2 rounded-lg border border-white/8 bg-black/40 backdrop-blur-md">
        <div className="text-[10px] tracking-[0.22em] text-white/40 font-mono uppercase">SIGNAL · LIVE</div>
        <div className="text-[11px] font-mono text-white/85 tabular-nums">{time}</div>
        <div className="text-[10px] font-mono text-white/45 tracking-wider">{resolution}</div>
      </div>

      {/* 底部签名 */}
      <div className="pointer-events-none absolute bottom-3 left-4 text-[9px] font-mono tracking-[0.32em] text-white/30 uppercase">
        digital · wave · field
      </div>
    </>
  );
}

function useClock() {
  const [t, setT] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function formatTime(d: Date) {
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
