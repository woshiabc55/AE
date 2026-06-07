// 异想体图鉴

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { anomalies, anomaliesById } from '../data/anomalies';
import { ArrowLeft, Eye, Lock } from 'lucide-react';
import { workTypeLabel, workTypeColor } from '../logic/anomalyLogic';

export default function Codex() {
  const unlocked = useGameStore((s) => s.unlockedAnomalies);
  const progress = useGameStore((s) => s.researchProgress);
  const researched = useGameStore((s) => s.researchedAnomalies);
  const receiveAnomaly = useGameStore((s) => s.receiveAnomaly);
  const departments = useGameStore((s) => s.departments);

  // 找一个空单元
  const findEmpty = () => {
    for (const d of departments) {
      if (!d.unlocked) continue;
      const u = d.units.find(x => !x.anomalyId && !x.hasBroken);
      if (u) return u.id;
    }
    return null;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-auto">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">异想体图鉴</h1>
        <span className="text-text-dim font-mono text-[10px]">已解锁：{unlocked.length} / {anomalies.length}</span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {anomalies.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          const isResearched = researched.includes(a.id);
          const prog = progress[a.id] || 0;
          return (
            <div
              key={a.id}
              className={`bg-panel/40 border p-3 ${isUnlocked ? 'border-panel-light' : 'border-panel-light/20'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-10 h-10"
                  style={{
                    background: isUnlocked ? a.peColor : '#1a1a22',
                    opacity: isUnlocked ? 0.7 : 1,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className={`font-display text-base font-bold ${isUnlocked ? 'text-amber' : 'text-text-dim'}`}>
                    {isUnlocked ? a.name : '█████'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isUnlocked ? (
                      <span className={`class-badge class-${a.riskClass}`}>{a.riskClass}</span>
                    ) : (
                      <span className="text-text-dim text-[10px]">???</span>
                    )}
                    <span className="text-text-mute text-[10px]">恐惧 Lv.{a.fearLevel}</span>
                  </div>
                </div>
              </div>

              <div className={`text-[10px] mb-2 ${isUnlocked ? 'text-bone/70' : 'fog-text'}`}>
                {isUnlocked ? a.description : '███████ ████ ████████ ████████。'}
              </div>

              {isUnlocked && (
                <div className="text-[10px] text-text-mute mb-2 italic">
                  {isResearched ? a.lore : '█████ ████ ████ ███████。'}
                </div>
              )}

              {/* 偏好工作 */}
              {isUnlocked && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {a.preferredWork.map(wt => (
                    <span
                      key={wt}
                      className="text-[9px] px-1.5 py-0.5 border"
                      style={{ borderColor: workTypeColor(wt), color: workTypeColor(wt) }}
                    >
                      ◆ {workTypeLabel(wt)}
                    </span>
                  ))}
                  {a.badWork.map(wt => (
                    <span
                      key={wt}
                      className="text-[9px] px-1.5 py-0.5 border border-text-dim text-text-dim line-through"
                    >
                      {workTypeLabel(wt)}
                    </span>
                  ))}
                </div>
              )}

              {/* 研究进度 */}
              <div className="mt-2">
                <div className="text-[9px] text-text-mute flex justify-between mb-0.5">
                  <span>研究进度</span>
                  <span>{(prog * 100).toFixed(0)}%</span>
                </div>
                <div className="meter">
                  <div
                    className="meter-fill meter-fill-enkephalin"
                    style={{ width: `${prog * 100}%` }}
                  />
                </div>
              </div>

              {/* 操作 */}
              {isUnlocked && (
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => {
                      const slot = findEmpty();
                      if (slot) receiveAnomaly(slot, a.id);
                    }}
                    className="btn-pixel text-[9px] flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1 inline" /> 派遣至空单元
                  </button>
                </div>
              )}

              {!isUnlocked && (
                <div className="mt-2 text-center text-text-dim text-[9px] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> 未解锁
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
