// 考验面板 - 黎明/正午/黄昏/午夜

import { useGameStore } from '../../store/gameStore';
import { colorHex, colorLabel, tierLabel } from '../../logic/ordealLogic';
import { Swords, ShieldAlert } from 'lucide-react';

export default function OrdealPanel() {
  const ordeal = useGameStore((s) => s.currentOrdeal);
  const resolved = useGameStore((s) => s.ordealResolved);
  const resolveOrdeal = useGameStore((s) => s.resolveOrdeal);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const suppress = () => resolveOrdeal(true);
  const forfeit = () => resolveOrdeal(false);

  if (!ordeal) {
    return (
      <div className="bg-panel border border-panel-light p-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-text-mute">
          <ShieldAlert className="w-3 h-3" />
          <span>当前时段：{tierLabel[timeOfDay]} · 暂无考验</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-2 p-3 font-mono text-xs"
      style={{
        borderColor: colorHex[ordeal.color],
        background: `linear-gradient(180deg, ${colorHex[ordeal.color]}10, transparent)`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Swords className="w-4 h-4" style={{ color: colorHex[ordeal.color] }} />
        <span className="font-display text-sm font-bold tracking-wider" style={{ color: colorHex[ordeal.color] }}>
          {ordeal.name}
        </span>
        <span className="ml-auto text-[9px] text-text-mute">镇压 +{ordeal.rewardPercent}% 能源</span>
      </div>
      <div className="text-bone/80 mb-1">{ordeal.description}</div>
      <div className="text-text-dim text-[10px] mb-2">失败后果：{ordeal.penalty}</div>
      {!resolved ? (
        <div className="flex gap-2">
          <button onClick={suppress} className="btn-pixel text-[10px] flex-1" style={{ borderColor: colorHex[ordeal.color], color: colorHex[ordeal.color] }}>
            ▣ 镇压
          </button>
          <button onClick={forfeit} className="btn-pixel text-[10px] flex-1 opacity-60 hover:opacity-100">
            × 放弃
          </button>
        </div>
      ) : (
        <div className="text-[10px] text-enkephalin">本时段考验已处理</div>
      )}
    </div>
  );
}
