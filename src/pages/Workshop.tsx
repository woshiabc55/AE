// E.G.O 装备工坊

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { egoEquipment, egoByAnomaly } from '../data/ego';
import { anomaliesById } from '../data/anomalies';
import { ArrowLeft, Hammer, Wrench, Shield, Sword, Check } from 'lucide-react';

export default function Workshop() {
  const research = useGameStore((s) => s.research);
  const researched = useGameStore((s) => s.researchedAnomalies);
  const owned = useGameStore((s) => s.ownedEGO);
  const craft = useGameStore((s) => s.craftEGO);
  const equip = useGameStore((s) => s.equipEGO);
  const employees = useGameStore((s) => s.employees);

  // 按异想体分组
  const grouped = researched.map(aid => {
    const a = anomaliesById(aid);
    if (!a) return null;
    const items = egoByAnomaly(aid);
    return { anomaly: a, items };
  }).filter((g): g is NonNullable<typeof g> => !!g);

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-auto">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">E.G.O 装备工坊</h1>
        <span className="text-text-dim font-mono text-[10px]">研究点数：<span className="text-enkephalin glow-enkephalin">{research}</span></span>
      </div>

      <div className="p-4 font-mono text-xs space-y-6">
        {grouped.length === 0 ? (
          <div className="text-text-dim text-center py-12">
            <Hammer className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <div>尚未研究任何异想体。请在监控室派遣员工对异想体执行工作以积累研究进度。</div>
          </div>
        ) : (
          grouped.map(({ anomaly, items }) => (
            <div key={anomaly.id} className="bg-panel/40 border border-panel-light p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8" style={{ background: anomaly.peColor }} />
                <div>
                  <div className="font-display text-amber text-base font-bold">{anomaly.name}</div>
                  <div className="text-text-mute text-[10px]">[{anomaly.riskClass}] · 恐惧等级 Lv.{anomaly.fearLevel}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((e) => {
                  const isOwned = owned.includes(e.id);
                  const canAfford = research >= e.researchCost;
                  return (
                    <div key={e.id} className="bg-obsidian border border-panel-light/60 p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {e.slot === 'WEAPON' ? <Sword className="w-4 h-4 text-amber" /> : <Shield className="w-4 h-4 text-crt" />}
                        <span className="font-display text-bone text-sm font-bold">{e.name}</span>
                        <span className="text-[9px] text-text-mute ml-auto">{e.slot === 'WEAPON' ? '武器' : '护甲'}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[9px]">
                        <Bonus v={e.fortitudeBonus} label="勇" color="#c14a4a" />
                        <Bonus v={e.prudenceBonus} label="慎" color="#4a8ac1" />
                        <Bonus v={e.temperanceBonus} label="律" color="#7ac14a" />
                        <Bonus v={e.justiceBonus} label="义" color="#c19a4a" />
                      </div>
                      {e.selfDamage && <div className="text-alert text-[9px]">⚠ 副作用：可伤及自身</div>}
                      <div className="text-text-mute text-[9px]">研究消耗：<span className={canAfford ? 'text-enkephalin' : 'text-alert'}>{e.researchCost}</span></div>
                      <div className="flex gap-1.5">
                        {isOwned ? (
                          <>
                            <div className="text-[9px] text-enkephalin flex items-center gap-1">
                              <Check className="w-3 h-3" /> 已拥有
                            </div>
                            <select
                              className="bg-obsidian border border-panel-light text-bone text-[10px] px-1.5 py-1"
                              onChange={(ev) => {
                                const eid = ev.target.value;
                                if (eid) {
                                  equip(eid, e.id);
                                  ev.target.value = '';
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>装备给...</option>
                              {Object.values(employees).filter(emp => emp.status === 'NORMAL').map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <button
                            disabled={!canAfford}
                            onClick={() => craft(anomaly.id, e.slot)}
                            className="btn-pixel text-[10px] flex-1"
                          >
                            <Wrench className="w-3 h-3 mr-1" /> 锻造
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Bonus({ v, label, color }: { v: number; label: string; color: string }) {
  return (
    <div>
      <div className="text-text-mute">{label}</div>
      <div className="metric-number" style={{ color: v > 0 ? color : '#3a3a45' }}>
        {v > 0 ? '+' : ''}{v}
      </div>
    </div>
  );
}
