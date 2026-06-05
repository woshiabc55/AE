import { useEffect, useState } from 'react';
import { Activity, Shield, Zap, Cpu, Radio } from 'lucide-react';
import { useOpsStore } from '@/store/useOpsStore';
import { formatClock, formatDate } from '@/lib/format';

export function HudBar() {
  const hud = useOpsStore((s) => s.hud);
  const updateHud = useOpsStore((s) => s.updateHud);
  const [clock, setClock] = useState(formatClock());

  useEffect(() => {
    const t = setInterval(() => {
      setClock(formatClock());
      // 神经同步率缓慢波动
      const drift = (Math.random() - 0.5) * 0.4;
      updateHud({ sync: Math.max(70, Math.min(100, hud.sync + drift)) });
    }, 1000);
    return () => clearInterval(t);
  }, [hud.sync, updateHud]);

  return (
    <header className="relative h-16 border-b border-line bg-bg-deep/80 backdrop-blur-sm z-20">
      {/* 顶部 1px 琥珀渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber to-transparent opacity-80" />

      <div className="flex items-stretch h-full px-4">
        {/* 左：系统标识 */}
        <div className="flex items-center gap-3 pr-4 border-r border-line">
          <div className="relative w-9 h-9 grid place-items-center bg-amber/10 border border-amber/40 clip-bevel-sm">
            <Cpu className="w-4 h-4 text-amber" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[10px] tracking-[0.3em] text-line-strong">RHODES // TERMINAL</span>
            <span className="font-orbitron text-sm font-bold text-amber text-shadow-amber">BATCH-OPS · v4.2.1</span>
          </div>
        </div>

        {/* 中：神经同步率 */}
        <div className="flex-1 flex items-center gap-6 px-6">
          <Stat label="OPERATOR" value={hud.operator} icon={<Shield className="w-3.5 h-3.5" />} accent="cyan" />
          <SyncBar value={hud.sync} />
          <Stat
            label="CLEARANCE"
            value={hud.security}
            icon={<Radio className="w-3.5 h-3.5" />}
            accent="amber"
            mono
          />
          <Stat label="POWER" value={`${hud.power.toFixed(0)}%`} icon={<Zap className="w-3.5 h-3.5" />} accent="ok" mono />
        </div>

        {/* 右：UTC 时钟 */}
        <div className="flex items-center gap-4 pl-4 border-l border-line">
          <div className="text-right leading-none">
            <div className="font-orbitron text-2xl font-bold text-cyan text-shadow-cyan tracking-wider">{clock.split(' ')[0]}</div>
            <div className="font-mono text-[10px] text-line-strong tracking-widest mt-0.5">{formatDate()}</div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 border border-ok/30 bg-ok/5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
            <span className="font-mono text-[10px] text-ok tracking-widest">LINK OK</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  icon,
  accent,
  mono,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: 'cyan' | 'amber' | 'ok' | 'danger';
  mono?: boolean;
}) {
  const colorMap = {
    cyan: 'text-cyan border-cyan/30 bg-cyan/5',
    amber: 'text-amber border-amber/30 bg-amber/5',
    ok: 'text-ok border-ok/30 bg-ok/5',
    danger: 'text-danger border-danger/30 bg-danger/5',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2 py-1 border ${colorMap[accent]}`}>
        {icon}
        <span className="font-mono text-[9px] tracking-[0.2em]">{label}</span>
      </div>
      <span className={`${mono ? 'font-mono' : 'font-display font-semibold'} text-sm ${accent === 'amber' ? 'text-amber' : accent === 'cyan' ? 'text-cyan' : accent === 'ok' ? 'text-ok' : 'text-danger'}`}>
        {value}
      </span>
    </div>
  );
}

function SyncBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="flex-1 max-w-md flex flex-col gap-1">
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-line-strong">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-amber" />
          NEURAL SYNC
        </span>
        <span className="text-amber text-shadow-amber">{safe.toFixed(1)}%</span>
      </div>
      <div className="relative h-2 border border-line bg-bg-deep overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber/60 via-amber to-amber-glow origin-left"
          style={{ width: `${safe}%`, transition: 'width 0.6s ease-out' }}
        />
        <div
          className="absolute inset-y-0 left-0 w-1 bg-amber-glow"
          style={{ left: `${safe}%`, boxShadow: '0 0 8px #ffd17a' }}
        />
        {/* 刻度 */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="w-px h-full bg-bg-deep" />
          ))}
        </div>
      </div>
    </div>
  );
}
