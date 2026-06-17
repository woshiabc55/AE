import { useStore } from '@/store/useStore';
import SourceSwitcher from './SourceSwitcher';
import ThemePicker from './ThemePicker';
import Slider from './Slider';
import { Pause, Play, Waves, Activity, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function ControlPanel() {
  const sensitivity = useStore((s) => s.sensitivity);
  const density = useStore((s) => s.density);
  const speed = useStore((s) => s.speed);
  const glow = useStore((s) => s.glow);
  const ripple = useStore((s) => s.ripple);
  const paused = useStore((s) => s.paused);
  const setSensitivity = useStore((s) => s.setSensitivity);
  const setDensity = useStore((s) => s.setDensity);
  const setSpeed = useStore((s) => s.setSpeed);
  const setGlow = useStore((s) => s.setGlow);
  const toggleRipple = useStore((s) => s.toggleRipple);
  const togglePaused = useStore((s) => s.togglePaused);

  return (
    <div className="pointer-events-auto w-[320px] rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl p-4 shadow-[0_24px_80px_-12px_rgba(125,249,255,0.15)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <div className="relative h-7 w-7 rounded-md border border-white/15 flex items-center justify-center">
            <Waves size={14} className="text-[#7DF9FF]" />
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[#FF3CAC] shadow-[0_0_8px_#FF3CAC]" />
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-wide leading-none">PULSE&nbsp;PARTICLES</div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-white/45 mt-1">v1.0 · 2D&nbsp;DIGITAL&nbsp;FIELD</div>
          </div>
        </div>
        <button
          onClick={togglePaused}
          className="h-7 w-7 rounded-full border border-white/15 hover:border-white/40 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          title={paused ? '继续' : '暂停'}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>

      <div className="mb-4">
        <SourceSwitcher />
      </div>

      <div className="mb-4">
        <ThemePicker />
      </div>

      <div className="space-y-3">
        <Slider
          label="反应灵敏度"
          value={sensitivity}
          min={0.2}
          max={2.5}
          onChange={setSensitivity}
        />
        <Slider
          label="粒子密度"
          value={density}
          min={0.2}
          max={1}
          onChange={setDensity}
          format={(v) => `${Math.round(200 + v * 800)}`}
        />
        <Slider
          label="波动速度"
          value={speed}
          min={0.2}
          max={2.5}
          onChange={setSpeed}
        />
        <Slider
          label="辉光强度"
          value={glow}
          min={0}
          max={2}
          onChange={setGlow}
        />
        <button
          onClick={toggleRipple}
          className={clsx(
            'w-full flex items-center justify-between rounded-lg border px-3 py-2 text-[11px] font-mono tracking-[0.18em] uppercase transition-colors',
            ripple
              ? 'border-[#7DF9FF]/40 bg-[#7DF9FF]/10 text-white'
              : 'border-white/10 text-white/55 hover:border-white/30',
          )}
        >
          <span className="flex items-center gap-2">
            <Sparkles size={12} />
            节拍涟漪
          </span>
          <span className="text-white/70">{ripple ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-wider">
        <Activity size={11} className="text-[#7DF9FF]/70" />
        <span>DRAG POINTER TO DISTURB THE FIELD</span>
      </div>
    </div>
  );
}
