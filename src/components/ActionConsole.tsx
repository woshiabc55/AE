import { useOpsStore } from '@/store/useOpsStore';
import { ArrowUpCircle, Wrench, Lock, Unlock, Sigma, AlertTriangle, Crosshair, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ActionConsole() {
  const groups = useOpsStore((s) => s.groups);
  const activeGroupId = useOpsStore((s) => s.activeGroupId);
  const selectedIds = useOpsStore((s) => s.selectedIds);
  const batchUpgrade = useOpsStore((s) => s.batchUpgrade);
  const batchEquip = useOpsStore((s) => s.batchEquip);
  const batchUnlock = useOpsStore((s) => s.batchUnlock);
  const batchLock = useOpsStore((s) => s.batchLock);

  const group = groups.find((g) => g.id === activeGroupId)!;
  const selectedPacks = group.packs.filter((p) => selectedIds.has(p.id));
  const totalCost = selectedPacks.reduce((acc, p) => acc + p.cost, 0);
  const lockedCount = selectedPacks.filter((p) => p.locked).length;
  const t6Count = selectedPacks.filter((p) => p.rarity === 'T6').length;
  const avgLevel = selectedPacks.length
    ? Math.round(selectedPacks.reduce((a, p) => a + p.level, 0) / selectedPacks.length)
    : 0;

  const canExecute = selectedIds.size > 0;

  return (
    <aside className="w-[320px] shrink-0 border-l border-line bg-bg-deep/60 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-line">
        <div className="font-mono text-[9px] tracking-[0.3em] text-line-strong">ACTION // CONSOLE</div>
        <div className="font-display text-base font-bold text-amber text-shadow-amber">批量操作面板</div>
      </div>

      <div className="p-4 space-y-3">
        {/* 选中态概览 */}
        <div className="relative p-3 border border-cyan/30 bg-cyan/5 clip-bevel-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[9px] tracking-widest text-line-strong">SELECTED TARGETS</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-orbitron text-3xl font-black text-cyan text-shadow-cyan leading-none">
                  {String(selectedIds.size).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs text-line-strong">/ {group.packs.length}</span>
              </div>
            </div>
            <Crosshair className="w-6 h-6 text-cyan" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px]">
            <Mini label="AVG LV" value={String(avgLevel).padStart(2, '0')} />
            <Mini label="T6" value={String(t6Count).padStart(2, '0')} accent="amber" />
            <Mini label="LOCK" value={String(lockedCount).padStart(2, '0')} accent="danger" />
          </div>
        </div>

        {/* 消耗估算 */}
        <div className="p-3 border border-line bg-bg-surface/40 clip-bevel-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-widest text-line-strong flex items-center gap-1">
              <Sigma className="w-3 h-3" /> TOTAL COST
            </span>
            <span className={cn('font-orbitron text-base font-bold', totalCost > 5000 ? 'text-danger text-shadow-amber' : 'text-amber')}>
              {totalCost.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 h-1 bg-bg-deep border border-line-dim overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                totalCost > 5000 ? 'bg-danger' : 'bg-amber',
              )}
              style={{ width: `${Math.min(100, (totalCost / 8000) * 100)}%` }}
            />
          </div>
          {totalCost > 5000 && (
            <div className="mt-1.5 flex items-center gap-1 text-danger font-mono text-[9px]">
              <AlertTriangle className="w-3 h-3" />
              WARNING · COST EXCEEDS BUDGET
            </div>
          )}
        </div>
      </div>

      {/* 主操作按钮 */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <ConsoleButton
          icon={<ArrowUpCircle className="w-4 h-4" />}
          label="BATCH UPGRADE"
          subLabel="批量升级"
          accent="amber"
          disabled={!canExecute}
          onClick={batchUpgrade}
          large
        />
        <ConsoleButton
          icon={<Wrench className="w-4 h-4" />}
          label="BATCH EQUIP"
          subLabel="批量装配"
          accent="cyan"
          disabled={!canExecute}
          onClick={batchEquip}
        />
        <ConsoleButton
          icon={<Unlock className="w-4 h-4" />}
          label="BATCH UNLOCK"
          subLabel="解除锁定"
          accent="ok"
          disabled={!canExecute}
          onClick={batchUnlock}
        />
        <ConsoleButton
          icon={<Lock className="w-4 h-4" />}
          label="BATCH LOCK"
          subLabel="批量锁定"
          accent="danger"
          disabled={!canExecute}
          onClick={batchLock}
        />
      </div>

      {/* 战术日志 */}
      <div className="mt-auto p-4 border-t border-line">
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[9px] tracking-widest text-line-strong">// TACTICAL LOG</div>
          <Zap className="w-3 h-3 text-amber" />
        </div>
        <div className="font-mono text-[10px] leading-relaxed space-y-1 text-line-strong">
          <div>&gt; ready <span className="text-ok">[ok]</span></div>
          <div>&gt; awaiting operator input…</div>
          <div className="text-amber">&gt; {canExecute ? `armed: ${selectedIds.size} targets` : 'idle'}</div>
        </div>
      </div>
    </aside>
  );
}

function Mini({ label, value, accent = 'cyan' }: { label: string; value: string; accent?: 'cyan' | 'amber' | 'danger' }) {
  const c = accent === 'amber' ? 'text-amber' : accent === 'danger' ? 'text-danger' : 'text-cyan';
  return (
    <div className="flex flex-col leading-none">
      <span className="text-line-strong text-[8px] tracking-widest">{label}</span>
      <span className={cn('font-orbitron text-sm font-bold mt-0.5', c)}>{value}</span>
    </div>
  );
}

function ConsoleButton({
  icon,
  label,
  subLabel,
  accent,
  disabled,
  onClick,
  large,
}: {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  accent: 'amber' | 'cyan' | 'ok' | 'danger';
  disabled?: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  const map = {
    amber: 'border-amber/60 text-amber hover:bg-amber hover:text-bg-deep hover:shadow-amber-glow',
    cyan: 'border-cyan/60 text-cyan hover:bg-cyan hover:text-bg-deep hover:shadow-cyan-glow',
    ok: 'border-ok/60 text-ok hover:bg-ok hover:text-bg-deep',
    danger: 'border-danger/60 text-danger hover:bg-danger hover:text-bg-deep',
  } as const;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-start p-2.5 border-2 bg-bg-surface/40 transition-all clip-bevel-sm text-left',
        large ? 'col-span-2' : '',
        disabled
          ? 'border-line text-line-strong opacity-50 cursor-not-allowed'
          : map[accent],
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-orbitron text-[10px] font-bold tracking-widest">{label}</span>
      </div>
      <span className="font-body text-[10px] mt-0.5 opacity-80">{subLabel}</span>
      {/* 角标 */}
      <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-current opacity-60" />
      <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-current opacity-60" />
    </button>
  );
}
