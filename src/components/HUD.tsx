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

function Metric({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] tracking-[0.22em] text-white/40 font-mono uppercase">{label}</span>
      <span className="text-[13px] font-mono text-white tabular-nums" style={accent ? { color: accent } : undefined}>{value}</span>
      {unit && <span className="text-[9px] tracking-widest text-white/35 font-mono">{unit}</span>}
    </div>
  );
}

function BeatBar({ beat }: { beat: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.22em] text-white/40 font-mono uppercase">BEAT</span>
      <div className="relative h-1.5 w-14 bg-white/10 overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7DF9FF] via-[#9B5DE5] to-[#FF3CAC]"
          style={{ width: `${Math.min(100, beat * 100)}%`, transition: 'width 60ms linear' }}
        />
      </div>
    </div>
  );
}

function VUMeter({ rms, beat }: { rms: number; beat: number }) {
  const segs = 14;
  const lit = Math.min(segs, Math.floor((rms * 1.6 + beat * 0.4) * segs));
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] tracking-[0.22em] text-white/40 font-mono uppercase">VU</span>
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: segs }).map((_, i) => {
          const on = i < lit;
          const hot = i > segs * 0.7;
          const color = on ? (hot ? '#FF3CAC' : i > segs * 0.5 ? '#9B5DE5' : '#7DF9FF') : 'rgba(255,255,255,0.08)';
          return (
            <div
              key={i}
              className="h-2.5 w-[3px] rounded-[1px]"
              style={{ background: color, boxShadow: on ? `0 0 6px ${color}` : 'none' }}
            />
          );
        })}
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
  const source = useStore((s) => s.source);
  const fileName = useStore((s) => s.fileName);
  const t = themes[theme];
  const time = useClock();

  const sourceLabel =
    source === 'synth' ? 'SYNTH · PULSE' : source === 'mic' ? 'MIC · LIVE' : `FILE · ${fileName ?? '—'}`;

  return (
    <>
      {/* 顶部左侧 - 标识 + 指标 */}
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-black/45 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF3CAC] shadow-[0_0_8px_#FF3CAC] animate-pulse" />
          <span className="text-[10px] tracking-[0.36em] text-white font-mono">NEON&nbsp;HORIZON</span>
        </div>
        <div className="px-3 py-2 rounded-md border border-white/10 bg-black/45 backdrop-blur-md flex flex-col gap-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <Metric label="BPM" value={bpm} accent={t.hud} />
            <Metric label="RMS" value={rms} />
            <BeatBar beat={beat} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Metric label="MODE" value={mode} accent={mode === 'PEAK' ? '#FF3CAC' : undefined} />
            <Metric label="FPS" value={fps} />
            <Metric label="THEME" value={t.name.toUpperCase()} accent={t.hud} />
          </div>
        </div>
      </div>

      {/* 顶部右侧 - VU + 时钟 */}
      <div className="pointer-events-none absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="px-3 py-2 rounded-md border border-white/10 bg-black/45 backdrop-blur-md flex flex-col items-end gap-1.5">
          <div className="text-[9px] tracking-[0.32em] text-white/40 font-mono uppercase">SIGNAL · LIVE</div>
          <VUMeter rms={parseFloat(rms)} beat={beat} />
          <div className="text-[14px] font-mono text-white tabular-nums tracking-wider">{time}</div>
        </div>
        <div className="px-3 py-1.5 rounded-md border border-white/10 bg-black/45 backdrop-blur-md">
          <div className="text-[10px] font-mono text-white/70 tracking-wider">{resolution}</div>
        </div>
      </div>

      {/* 底部中央 - 当前音源 */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-black/45 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />
        <span className="text-[10px] font-mono tracking-[0.22em] text-white/85 uppercase">{sourceLabel}</span>
      </div>

      {/* 左下角 - 装饰 */}
      <div className="pointer-events-none absolute bottom-3 left-4 text-[9px] font-mono tracking-[0.32em] text-white/30 uppercase">
        synthwave · 2D · field
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
