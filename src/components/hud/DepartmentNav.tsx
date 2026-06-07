// 部门侧边导航

import { useGameStore } from '../../store/gameStore';
import { departments } from '../../data/departments';

export default function DepartmentNav() {
  const depts = useGameStore((s) => s.departments);
  const currentDept = depts[0];

  return (
    <div className="bg-obsidian border-r border-panel-light/60 w-16 flex flex-col items-center py-3 font-mono text-[9px] gap-1 select-none overflow-y-auto">
      <div
        className="text-amber font-display font-bold tracking-widest mb-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        部门导航
      </div>
      {departments.map((d) => {
        const isUnlocked = depts.find(u => u.id === d.id)?.unlocked ?? false;
        const filledCount = currentDept.units.filter(u => u.anomalyId).length;
        return (
          <button
            key={d.id}
            disabled={!isUnlocked}
            className={
              'w-10 h-10 flex flex-col items-center justify-center border transition-all ' +
              (isUnlocked
                ? 'border-panel-light hover:border-amber bg-panel text-bone hover:text-amber'
                : 'border-panel/30 text-text-dim cursor-not-allowed')
            }
            style={isUnlocked ? { borderColor: d.color + '80' } : undefined}
            title={isUnlocked ? d.name : `${d.name}（未解锁 - 第 ${d.unlockedDay} 天）`}
          >
            <span
              className="font-display text-[10px] font-bold"
              style={{ color: isUnlocked ? d.color : undefined }}
            >
              {d.shortName}
            </span>
            {isUnlocked && (
              <span className="text-[7px] text-text-mute">{filledCount}/4</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
