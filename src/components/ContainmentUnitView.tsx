// 单个收容单元渲染

import { useEffect, useRef } from 'react';
import type { ContainmentUnit, Employee } from '../store/gameStore';
import { anomaliesById } from '../data/anomalies';
import { drawAnomaly } from './canvas/drawAnomaly';
import { drawEmployee } from './canvas/drawEmployee';
import { cn } from '../lib/utils';
import { useGameStore } from '../store/gameStore';

interface Props {
  unit: ContainmentUnit;
  deptEmployees: Employee[];
  isSelected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function ContainmentUnitView({ unit, deptEmployees, isSelected, onClick, size = 'md' }: Props) {
  const tick = useGameStore((s) => s.cycleTick);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const anomaly = unit.anomalyId ? anomaliesById(unit.anomalyId) : null;
  const dim = size === 'sm' ? 96 : size === 'md' ? 160 : 220;

  // 找到本单元附近的员工（简化：第一个正常员工）
  const firstEmp = deptEmployees.find((e) => e && e.status === 'NORMAL') || null;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

    if (anomaly) {
      drawAnomaly(ctx, dim / 2 - 32, 16, 64, anomaly, tick, unit.isMeltdown);
    }

    if (firstEmp) {
      const state = firstEmp.status === 'PANIC' ? 'PANIC' : unit.isMeltdown ? 'WORKING' : 'NORMAL';
      drawEmployee(ctx, dim / 2 - 8, dim - 56, 16, firstEmp.color, state, tick);
    } else {
      // 站位标记
      ctx.save();
      ctx.translate(dim / 2 - 8, dim - 56);
      ctx.scale(1, 1);
      ctx.fillStyle = '#2a2a35';
      ctx.fillRect(2, 6, 12, 10);
      ctx.fillStyle = '#3a3a45';
      ctx.fillRect(5, 2, 6, 6);
      ctx.restore();
    }
  }, [tick, anomaly, unit.isMeltdown, firstEmp, dim]);

  const borderClass = unit.hasBroken
    ? 'border-alert'
    : unit.isMeltdown
    ? 'border-alert alert-border'
    : isSelected
    ? 'border-amber'
    : 'border-panel-light';

  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-panel/60 border-2 transition-all relative flex flex-col items-center group',
        borderClass,
        isSelected && 'shadow-[0_0_16px_rgba(255,230,0,0.4)]',
        'hover:border-amber/60'
      )}
      style={{ width: dim, height: dim + 28 }}
    >
      {/* 单元编号 */}
      <div className="absolute top-1 left-1 font-display text-[9px] text-text-mute z-10">
        U-{unit.id.split('-').pop()}
      </div>
      {/* 危险等级 */}
      {anomaly && (
        <div className={cn('absolute top-1 right-1 class-badge z-10', `class-${anomaly.riskClass}`)}>
          {anomaly.riskClass}
        </div>
      )}
      {/* 计数器 */}
      {anomaly && !unit.hasBroken && (
        <div className="absolute bottom-7 left-1 right-1 flex flex-col gap-0.5 z-10">
          <div className="text-[8px] text-text-mute">计数 {unit.workCount}/{anomaly.counterThreshold}</div>
          <div className="meter h-1.5">
            <div
              className={cn(
                'meter-fill',
                unit.workCount > anomaly.counterThreshold * 0.7 ? 'meter-fill-alert' : 'meter-fill-amber'
              )}
              style={{ width: `${Math.min(100, (unit.workCount / anomaly.counterThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={dim}
        height={dim}
        className="pixel-canvas"
      />
      {/* 熔毁倒计时 */}
      {unit.isMeltdown && (
        <div className="absolute top-8 left-0 right-0 bg-alert/80 text-bone text-center font-display font-bold text-sm py-0.5 animate-flicker z-20">
          {unit.meltdownTimer.toFixed(0)}s
        </div>
      )}
      {unit.hasBroken && (
        <div className="absolute inset-0 bg-alert/30 flex items-center justify-center z-20">
          <span className="font-display text-alert text-sm tracking-widest">突破</span>
        </div>
      )}
      {/* 状态文字 */}
      <div className="absolute bottom-0 left-0 right-0 text-center font-mono text-[9px] bg-obsidian/80 py-0.5">
        {anomaly ? anomaly.name : '空'}
      </div>
    </button>
  );
}
