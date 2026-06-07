// 员工选择器 - 在控制室页面右侧列出员工

import { useGameStore } from '../store/gameStore';
import { statusColor, statusLabel } from '../logic/employeeLogic';
import { cn } from '../lib/utils';
import { egoEquipment } from '../data/ego';

export default function EmployeeSelector() {
  const departments = useGameStore((s) => s.departments);
  const employees = useGameStore((s) => s.employees);
  const selected = useGameStore((s) => s.selectedEmployeeId);
  const selectEmployee = useGameStore((s) => s.selectEmployee);

  // 当前部门：默认第一个解锁的部门
  const dept = departments[0];

  return (
    <div className="bg-obsidian border-t border-panel-light/60 p-2 font-mono text-[10px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-display text-amber tracking-widest text-[10px]">员工</span>
        <span className="text-text-dim">{dept.id.toUpperCase()} · 5 / 5</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {dept.employees.map((eid, i) => {
          const e = eid ? employees[eid] : null;
          const isSel = eid === selected;
          if (!e) {
            return (
              <div key={i} className="bg-panel/40 border border-panel-light/40 p-1.5 text-center text-text-dim h-[58px] flex items-center justify-center">
                空位
              </div>
            );
          }
          const weapon = e.equippedWeapon ? egoEquipment.find(x => x.id === e.equippedWeapon) : null;
          const armor = e.equippedArmor ? egoEquipment.find(x => x.id === e.equippedArmor) : null;
          return (
            <button
              key={eid}
              onClick={() => selectEmployee(eid)}
              className={cn(
                'border p-1.5 text-left transition-all relative',
                isSel ? 'border-amber bg-amber/10' : 'border-panel-light hover:border-amber/60 bg-panel/40'
              )}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ background: e.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-bone truncate text-[10px]">{e.name}</div>
                </div>
              </div>
              <div className="flex justify-between text-[8px] mt-0.5 text-text-mute">
                <span>勇 {e.fortitude}</span>
                <span>慎 {e.prudence}</span>
              </div>
              <div className="flex justify-between text-[8px] text-text-mute">
                <span>律 {e.temperance}</span>
                <span>义 {e.justice}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[8px]">
                <span style={{ color: statusColor(e.status) }}>● {statusLabel(e.status)}</span>
                {weapon && <span className="text-amber">⚔</span>}
                {armor && <span className="text-crt">🛡</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
