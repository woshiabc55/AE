import { memo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { KEY_MAP, SKILL_CONFIG, ELEMENT_CONFIG, ROUNDS_TO_WIN } from '@/utils/constants';
import type { Mecha } from '@/utils/types';
import { getMechaTypeColor } from '@/utils/skills';

function formatKey(code: string): string {
  if (code === 'Space') return 'SP';
  if (code === 'Enter') return 'EN';
  if (code === 'Semicolon') return ';';
  if (code === 'Quote') return "'";
  if (code === 'BracketRight') return ']';
  if (code === 'Slash') return '/';
  if (code.startsWith('Key')) return code.replace('Key', '');
  if (code.startsWith('Arrow')) return code.replace('Arrow', '');
  return code;
}

const JobTitles: Record<Mecha['type'], string> = {
  striker: '战士',
  tank: '骑士',
  speed: '盗贼',
  mage: '黑魔',
};

const StatusWindow = memo(function StatusWindow({
  mecha,
  align,
}: {
  mecha: Mecha;
  align: 'left' | 'right';
}) {
  const percent = (mecha.hp / mecha.maxHp) * 100;
  const color = getMechaTypeColor(mecha.type);
  const elementName = ELEMENT_CONFIG[mecha.element].name;
  const job = JobTitles[mecha.type];
  const name = `${mecha.id === 'red' ? 'P1' : 'P2'} · ${elementName}${job}`;

  return (
    <div
      className="w-52 border-2 bg-gradient-to-b from-[#101830] to-[#080C18] p-2 sm:w-60"
      style={{ borderColor: '#3A5078' }}
    >
      <div
        className="mb-1 text-xs font-bold tracking-wider"
        style={{ color, textAlign: align }}
      >
        {name}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/80">HP</span>
        <div className="h-3 flex-1 border border-white/20 bg-black/50">
          <div
            className="h-full"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${color} 0%, #FFFFFF 100%)`,
            }}
          />
        </div>
        <span className="text-[10px] text-white/80">
          {mecha.hp}/{mecha.maxHp}
        </span>
      </div>
    </div>
  );
});

const CommandWindow = memo(function CommandWindow({ id }: { id: Mecha['id'] }) {
  const mecha = useGameStore((s) => s[id]);
  const keys = KEY_MAP[id];
  const items = [
    { label: '攻', k: keys.attack, cd: mecha.cooldowns.attack, max: SKILL_CONFIG.attack.cooldown },
    { label: '技1', k: keys.skill1, cd: mecha.cooldowns.skill1, max: SKILL_CONFIG.skill1.cooldown },
    { label: '技2', k: keys.skill2, cd: mecha.cooldowns.skill2, max: SKILL_CONFIG.skill2.cooldown },
    { label: '技3', k: keys.skill3, cd: mecha.cooldowns.skill3, max: SKILL_CONFIG.skill3.cooldown },
    { label: '射', k: keys.projectile, cd: mecha.cooldowns.projectile, max: SKILL_CONFIG.projectile.cooldown },
    { label: '冲', k: keys.dash, cd: mecha.cooldowns.dash, max: SKILL_CONFIG.dash.cooldown },
    { label: '反', k: keys.counter, cd: mecha.cooldowns.counter, max: SKILL_CONFIG.counter.cooldown },
    { label: '投', k: keys.throw, cd: mecha.cooldowns.throw, max: SKILL_CONFIG.throw.cooldown },
    { label: '必杀', k: keys.ultimate, cd: mecha.cooldowns.ultimate, max: SKILL_CONFIG.ultimate.cooldown },
  ];

  return (
    <div
      className="border-2 bg-gradient-to-b from-[#101830] to-[#080C18] p-1.5"
      style={{ borderColor: '#3A5078' }}
    >
      <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[9px] text-white/80 sm:text-[10px]">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-1">
            <span className="text-white/50">[{formatKey(it.k)}]</span>
            <span className={it.cd > 0 ? 'text-white/30' : 'text-white/90'}>
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export const GameHUD = memo(function GameHUD() {
  const red = useGameStore((s) => s.red);
  const blue = useGameStore((s) => s.blue);
  const round = useGameStore((s) => s.roundResult.round);
  const timer = useGameStore((s) => s.roundResult.timer);
  const redWins = useGameStore((s) => s.roundResult.redWins);
  const blueWins = useGameStore((s) => s.roundResult.blueWins);
  const screen = useGameStore((s) => s.screen);

  if (screen !== 'fighting') return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-4">
      <div className="flex items-start justify-between">
        <StatusWindow mecha={red} align="left" />
        <div
          className="border-2 bg-gradient-to-b from-[#101830] to-[#080C18] px-3 py-1 text-center"
          style={{ borderColor: '#3A5078' }}
        >
          <div className="text-[10px] text-white/60">
            回合 {round}/{ROUNDS_TO_WIN * 2 - 1}
          </div>
          <div className="text-lg font-bold text-white/90">
            {Math.max(0, timer)}s
          </div>
          <div className="text-[10px] text-white/60">
            {redWins} - {blueWins}
          </div>
        </div>
        <StatusWindow mecha={blue} align="right" />
      </div>

      <div className="flex items-end justify-between">
        <CommandWindow id="red" />
        <CommandWindow id="blue" />
      </div>
    </div>
  );
});
