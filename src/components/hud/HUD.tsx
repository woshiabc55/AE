// 顶部 HUD - 能源 / 天数 / 研究 / 设施 / 警报

import { useGameStore } from '../../store/gameStore';
import { tierBonus, tierOrder } from '../../logic/ordealLogic';

export default function HUD() {
  const day = useGameStore((s) => s.day);
  const maxDay = useGameStore((s) => s.maxDay);
  const peBox = useGameStore((s) => s.peBox);
  const peBoxTarget = useGameStore((s) => s.peBoxTarget);
  const totalCollected = useGameStore((s) => s.totalCollected);
  const research = useGameStore((s) => s.research);
  const facilityHealth = useGameStore((s) => s.facilityHealth);
  const totalDeaths = useGameStore((s) => s.totalDeaths);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const dayTime = useGameStore((s) => s.dayTime);
  const cycleTick = useGameStore((s) => s.cycleTick);
  const showHelp = useGameStore((s) => s.showHelp);
  const toggleHelp = useGameStore((s) => s.toggleHelp);

  const tierNames: Record<string, string> = {
    DAWN: '黎明',
    NOON: '正午',
    DUSK: '黄昏',
    MIDNIGHT: '午夜',
  };
  const segProgress = (dayTime / 15) * 100;

  return (
    <div className="bg-obsidian border-b border-panel-light/60 px-4 py-2 flex items-center gap-4 font-mono text-xs select-none">
      {/* Logo */}
      <div className="flex items-center gap-2 pr-4 border-r border-panel-light/60">
        <div className="w-2 h-2 bg-amber rounded-full animate-flicker" />
        <span className="font-display text-amber font-bold tracking-[0.2em] text-sm">LOBOTOMY</span>
        <span className="text-text-dim">·</span>
        <span className="text-bone/70">脑叶公司</span>
      </div>

      {/* 能源 */}
      <Stat
        label="能源 PE-BOX"
        value={`${peBox} / ${peBoxTarget}`}
        percent={(peBox / peBoxTarget) * 100}
        color="amber"
        glow
      />

      {/* 天数 */}
      <Stat
        label="当前日"
        value={`${day} / ${maxDay}`}
        percent={(day / maxDay) * 100}
        color="crt"
      />

      {/* 研究 */}
      <Stat
        label="研究点数"
        value={`${research}`}
        percent={Math.min(100, research * 5)}
        color="enkephalin"
        glow
      />

      {/* 设施 */}
      <Stat
        label="设施完整度"
        value={`${facilityHealth}%`}
        percent={facilityHealth}
        color={facilityHealth > 50 ? 'enkephalin' : 'alert'}
      />

      {/* 时段 */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <div className="flex justify-between text-[10px]">
          <span className="text-text-mute">时段</span>
          <span className="text-amber font-bold tracking-wider">{tierNames[timeOfDay]}</span>
        </div>
        <div className="meter h-2">
          <div
            className="meter-fill meter-fill-amber"
            style={{ width: `${segProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-text-dim">
          {tierOrder.map((t) => (
            <span key={t} className={t === timeOfDay ? 'text-amber' : ''}>
              {tierNames[t]}
            </span>
          ))}
        </div>
      </div>

      {/* 死亡 / 总能源 */}
      <div className="flex gap-3 text-[10px]">
        <div className="flex flex-col items-end">
          <span className="text-text-mute">累计能源</span>
          <span className="metric-number text-amber text-sm glow-amber">{totalCollected}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-text-mute">死亡</span>
          <span className="metric-number text-alert text-sm glow-alert">{totalDeaths}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 text-[10px] text-text-dim">
        <span>TICK {cycleTick.toString().padStart(6, '0')}</span>
        <button
          onClick={toggleHelp}
          className="btn-pixel text-[10px] py-1 px-2"
          title="帮助"
        >
          ?
        </button>
      </div>

      {showHelp && (
        <div className="absolute top-12 right-4 w-80 bg-panel border border-amber/40 p-3 z-50 font-mono text-[11px] leading-relaxed">
          <div className="flex justify-between items-center mb-2">
            <span className="font-display text-amber font-bold">主管手册</span>
            <button onClick={toggleHelp} className="text-text-mute hover:text-amber">[×]</button>
          </div>
          <ul className="space-y-1 text-bone/80">
            <li>· 派遣员工对异想体执行 6 种工作，产出 PE-BOX</li>
            <li>· 每 6 秒工作计数 +1，达到阈值触发逆卡巴拉熔毁</li>
            <li>· 熔毁 60 秒内不工作则异想体突破收容</li>
            <li>· 黎明/正午/黄昏/午夜触发考验，镇压获得额外能源</li>
            <li>· 员工 4 维属性对应工作类型，工作后成长</li>
            <li>· 精神归零或恐惧超载 → 恐慌，行为由最高属性决定</li>
            <li>· 完成研究后可锻造 E.G.O 装备强化员工</li>
            <li className="text-alert">· 50 天内完成每日能源目标即通关</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  percent,
  color,
  glow,
}: {
  label: string;
  value: string;
  percent: number;
  color: 'amber' | 'crt' | 'enkephalin' | 'alert';
  glow?: boolean;
}) {
  const fillClass = {
    amber: 'meter-fill-amber',
    crt: 'meter-fill-enkephalin',
    enkephalin: 'meter-fill-enkephalin',
    alert: 'meter-fill-alert',
  }[color];
  const textClass = {
    amber: 'text-amber glow-amber',
    crt: 'text-crt',
    enkephalin: 'text-enkephalin glow-enkephalin',
    alert: 'text-alert glow-alert',
  }[color];
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <div className="flex justify-between text-[10px]">
        <span className="text-text-mute">{label}</span>
        <span className={`metric-number text-xs ${textClass}`}>{value}</span>
      </div>
      <div className="meter">
        <div className={`meter-fill ${fillClass}`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
}
