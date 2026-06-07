// 工作面板 - 6 种工作按钮

import { useGameStore } from '../store/gameStore';
import type { WorkType } from '../data/anomalies';
import { workTypeLabel, workTypeColor } from '../logic/anomalyLogic';

const WORK_TYPES: WorkType[] = ['INSTINCT', 'INSIGHT', 'COMMUNICATION', 'OPPRESSION', 'SUPPRESSION', 'CONTAINMENT'];

const attrName = (wt: WorkType) => {
  const map: Record<WorkType, string> = {
    INSTINCT: '勇气',
    INSIGHT: '谨慎',
    COMMUNICATION: '自律',
    OPPRESSION: '正义',
    SUPPRESSION: '勇气',
    CONTAINMENT: '谨慎',
  };
  return map[wt];
};

const attrKey = (wt: WorkType): 'fortitude' | 'prudence' | 'temperance' | 'justice' => {
  const map = {
    INSTINCT: 'fortitude',
    INSIGHT: 'prudence',
    COMMUNICATION: 'temperance',
    OPPRESSION: 'justice',
    SUPPRESSION: 'fortitude',
    CONTAINMENT: 'prudence',
  } as const;
  return map[wt];
};

const workIcon = (wt: WorkType) => {
  const map: Record<WorkType, string> = {
    INSTINCT: '◆',
    INSIGHT: '◈',
    COMMUNICATION: '◇',
    OPPRESSION: '▼',
    SUPPRESSION: '✕',
    CONTAINMENT: '◉',
  };
  return map[wt];
};

export default function WorkPanel() {
  const depts = useGameStore((s) => s.departments);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const selectedEmp = useGameStore((s) => s.selectedEmployeeId);
  const employees = useGameStore((s) => s.employees);
  const startWork = useGameStore((s) => s.startWork);
  const doMeltdownWork = useGameStore((s) => s.doMeltdownWork);

  // 派生：选中的单元
  let selectedUnit = null;
  if (selectedUnitId) {
    for (const d of depts) {
      const u = d.units.find(x => x.id === selectedUnitId);
      if (u) { selectedUnit = u; break; }
    }
  }
  const emp = selectedEmp ? employees[selectedEmp] : null;

  if (!selectedUnit) {
    return (
      <div className="bg-panel border border-panel-light p-3 font-mono text-[10px] text-text-dim text-center">
        ← 在画布上选择收容单元 →
      </div>
    );
  }

  if (!selectedUnit.anomalyId) {
    return (
      <div className="bg-panel border border-panel-light p-3 font-mono text-[10px] text-text-mute">
        单元 U-{selectedUnit.id.split('-').pop()} 为空。前往「异想体图鉴」选派异想体入库。
      </div>
    );
  }

  if (selectedUnit.hasBroken) {
    return (
      <div className="bg-alert/20 border-2 border-alert p-3 font-mono text-[10px] text-alert">
        ▣ 单元已损坏。异想体突破收容。等待修复或更换单元。
      </div>
    );
  }

  if (!emp || emp.status !== 'NORMAL') {
    return (
      <div className="bg-panel border border-panel-light p-3 font-mono text-[10px] text-amber">
        ⚠ 请选择一名「正常」状态的员工。
      </div>
    );
  }

  const handleWork = (wt: WorkType) => {
    if (selectedUnit.isMeltdown) {
      doMeltdownWork(selectedUnit.id, emp.id);
    } else {
      startWork(selectedUnit.id, wt, emp.id);
    }
  };

  return (
    <div className="bg-panel border border-panel-light p-3 font-mono text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-display text-amber text-sm font-bold tracking-wider">
          {selectedUnit.isMeltdown ? '⚠ 熔 毁 镇 压' : '工作面板'}
        </span>
        <span className="text-text-dim text-[10px] ml-auto">
          员工 <span className="text-bone">{emp.name}</span>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {WORK_TYPES.map((wt) => {
          const a = attrKey(wt);
          const val = emp[a];
          return (
            <button
              key={wt}
              onClick={() => handleWork(wt)}
              className="border border-panel-light p-2 hover:border-amber hover:shadow-[0_0_8px_rgba(255,230,0,0.3)] transition-all group"
              style={{ background: workTypeColor(wt) + '08' }}
            >
              <div className="font-display text-base font-bold" style={{ color: workTypeColor(wt) }}>
                {workIcon(wt)}
              </div>
              <div className="text-bone text-[11px] mt-0.5">{workTypeLabel(wt)}</div>
              <div className="text-[9px] text-text-mute">
                {attrName(wt)} <span className={val > 50 ? 'text-enkephalin' : 'text-amber'}>{val}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
