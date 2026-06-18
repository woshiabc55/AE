import { memo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { KEY_MAP, SKILL_CONFIG, MECHA_TYPES, ELEMENT_CONFIG, ROUNDS_TO_WIN } from '@/utils/constants';
import type { Mecha } from '@/utils/types';
import { getMechaTypeColor, getMechaTypeDarkColor } from '@/utils/skills';

function formatKey(code: string): string {
  if (code === 'Space') return 'SP';
  if (code === 'Enter') return 'EN';
  if (code === 'Semicolon') return ';';
  if (code === 'Quote') return "'";
  if (code === 'BracketRight') return ']';
  if (code.startsWith('Key')) return code.replace('Key', '');
  if (code.startsWith('Arrow')) return code.replace('Arrow', '');
  return code;
}

const HealthBar = memo(function HealthBar({
  mecha,
  align,
}: {
  mecha: Mecha;
  align: 'left' | 'right';
}) {
  const percent = (mecha.hp / mecha.maxHp) * 100;
  const color = getMechaTypeColor(mecha.type);
  const darkColor = getMechaTypeDarkColor(mecha.type);
  const label = `${ELEMENT_CONFIG[mecha.element].name} ${MECHA_TYPES[mecha.type].name} ${mecha.id === 'red' ? 'P1' : 'P2'}`;

  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === 'left' ? 'flex-start' : 'flex-end' }}
    >
      <span className="text-xs tracking-wider" style={{ color }}>
        {label}
      </span>
      <div
        className="h-4 w-56 border-2 bg-black/50 sm:w-64"
        style={{ borderColor: darkColor }}
      >
        <div
          className="h-full transition-all duration-75"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
      <span className="text-[10px] text-white/70">
        {mecha.hp}/{mecha.maxHp}
      </span>
    </div>
  );
});

const SkillIcon = memo(function SkillIcon({
  name,
  keyLabel,
  cooldown,
  maxCooldown,
  color,
}: {
  name: string;
  keyLabel: string;
  cooldown: number;
  maxCooldown: number;
  color: string;
}) {
  const ratio = Math.max(0, cooldown / maxCooldown);
  return (
    <div className="relative flex h-9 w-9 flex-col items-center justify-center border border-white/20 bg-black/60 text-[9px] sm:h-10 sm:w-10">
      <span style={{ color }}>{name}</span>
      <span className="text-white/60">{keyLabel}</span>
      {cooldown > 0 && (
        <div
          className="absolute bottom-0 left-0 w-full bg-white/30"
          style={{ height: `${ratio * 100}%` }}
        />
      )}
    </div>
  );
});

const SkillBar = memo(function SkillBar({ id }: { id: Mecha['id'] }) {
  const mecha = useGameStore((s) => s[id]);
  const color = getMechaTypeColor(mecha.type);
  const keys = KEY_MAP[id];

  return (
    <div className="flex gap-1">
      <SkillIcon
        name="攻"
        keyLabel={formatKey(keys.attack)}
        cooldown={mecha.cooldowns.attack}
        maxCooldown={SKILL_CONFIG.attack.cooldown}
        color={color}
      />
      <SkillIcon
        name="技1"
        keyLabel={formatKey(keys.skill1)}
        cooldown={mecha.cooldowns.skill1}
        maxCooldown={SKILL_CONFIG.skill1.cooldown}
        color={color}
      />
      <SkillIcon
        name="技2"
        keyLabel={formatKey(keys.skill2)}
        cooldown={mecha.cooldowns.skill2}
        maxCooldown={SKILL_CONFIG.skill2.cooldown}
        color={color}
      />
      <SkillIcon
        name="投"
        keyLabel={formatKey(keys.throw)}
        cooldown={mecha.cooldowns.throw}
        maxCooldown={SKILL_CONFIG.throw.cooldown}
        color={color}
      />
      <SkillIcon
        name="冲"
        keyLabel={formatKey(keys.dash)}
        cooldown={mecha.cooldowns.dash}
        maxCooldown={SKILL_CONFIG.dash.cooldown}
        color={color}
      />
      <SkillIcon
        name="射"
        keyLabel={formatKey(keys.projectile)}
        cooldown={mecha.cooldowns.projectile}
        maxCooldown={SKILL_CONFIG.projectile.cooldown}
        color={color}
      />
      <SkillIcon
        name="反"
        keyLabel={formatKey(keys.counter)}
        cooldown={mecha.cooldowns.counter}
        maxCooldown={SKILL_CONFIG.counter.cooldown}
        color={color}
      />
      <SkillIcon
        name="必杀"
        keyLabel={formatKey(keys.ultimate)}
        cooldown={mecha.cooldowns.ultimate}
        maxCooldown={SKILL_CONFIG.ultimate.cooldown}
        color={color}
      />
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

  return (
    <>
      <div className="mb-2 flex items-start justify-between px-2">
        <HealthBar mecha={red} align="left" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white/90">VS</span>
          <span className="text-[10px] text-white/50">
            {redWins}-{blueWins}
          </span>
        </div>
        <HealthBar mecha={blue} align="right" />
      </div>

      <div className="mb-1 text-center text-sm text-white/80">
        回合 {round}/{ROUNDS_TO_WIN * 2 - 1} · 时间 {Math.max(0, timer)}s
      </div>

      <div className="mt-2 flex justify-between px-2">
        <SkillBar id="red" />
        <SkillBar id="blue" />
      </div>
    </>
  );
});
