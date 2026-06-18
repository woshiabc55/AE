import { useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useInput } from '@/hooks/useInput';
import { useGameLoop } from '@/hooks/useGameLoop';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS,
  KEY_MAP,
  SKILL_CONFIG,
} from '@/utils/constants';
import type { Mecha, MechaId } from '@/utils/types';
import { getMechaColor, getMechaDarkColor } from '@/utils/skills';

function HealthBar({
  mecha,
  align,
}: {
  mecha: Mecha;
  align: 'left' | 'right';
}): JSX.Element {
  const percent = (mecha.hp / mecha.maxHp) * 100;
  const color = getMechaColor(mecha.id);
  const darkColor = getMechaDarkColor(mecha.id);

  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === 'left' ? 'flex-start' : 'flex-end' }}
    >
      <span
        className="text-xs tracking-wider"
        style={{ color }}
      >
        {mecha.id === 'red' ? '赤焰机甲 P1' : '雷霆机甲 P2'}
      </span>
      <div
        className="h-4 w-64 border-2 bg-black/50"
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
      <span className="text-[10px] text-white/70">{mecha.hp}/100</span>
    </div>
  );
}

function SkillIcon({
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
}): JSX.Element {
  const ratio = Math.max(0, cooldown / maxCooldown);
  return (
    <div className="relative flex h-10 w-10 flex-col items-center justify-center border border-white/20 bg-black/60 text-[10px]">
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
}

function SkillBar({ mecha }: { mecha: Mecha }): JSX.Element {
  const color = getMechaColor(mecha.id);
  const keys = KEY_MAP[mecha.id];
  return (
    <div className="flex gap-1">
      <SkillIcon
        name="攻"
        keyLabel={keys.attack.replace('Key', '')}
        cooldown={mecha.cooldowns.attack}
        maxCooldown={SKILL_CONFIG.attack.cooldown}
        color={color}
      />
      <SkillIcon
        name="技1"
        keyLabel={keys.skill1.replace('Key', '')}
        cooldown={mecha.cooldowns.skill1}
        maxCooldown={SKILL_CONFIG.skill1.cooldown}
        color={color}
      />
      <SkillIcon
        name="技2"
        keyLabel={keys.skill2.replace('Key', '')}
        cooldown={mecha.cooldowns.skill2}
        maxCooldown={SKILL_CONFIG.skill2.cooldown}
        color={color}
      />
      <SkillIcon
        name="必杀"
        keyLabel={keys.ultimate === 'Space' ? 'Sp' : 'En'}
        cooldown={mecha.cooldowns.ultimate}
        maxCooldown={SKILL_CONFIG.ultimate.cooldown}
        color={color}
      />
    </div>
  );
}

function WinnerOverlay({
  winner,
  onRestart,
}: {
  winner: MechaId;
  onRestart: () => void;
}): JSX.Element {
  const color = getMechaColor(winner);
  const label = winner === 'red' ? '赤焰机甲 P1 胜利' : '雷霆机甲 P2 胜利';

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
      <h2
        className="mb-6 text-4xl"
        style={{ color, textShadow: `0 0 20px ${color}` }}
      >
        {label}
      </h2>
      <button
        type="button"
        onClick={onRestart}
        className="border-2 px-6 py-3 text-sm font-bold transition hover:scale-105"
        style={{ borderColor: color, color }}
      >
        再来一局
      </button>
    </div>
  );
}

export function BattleGame(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useInput();
  useGameLoop(canvasRef, keysRef);

  const { red, blue, winner } = useGameStore();
  const resetGame = useGameStore((s) => s.resetGame);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="relative mx-auto w-full max-w-[960px]">
      {/* HUD */}
      <div className="mb-2 flex items-start justify-between px-2">
        <HealthBar mecha={red} align="left" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white/90">VS</span>
          <span className="text-[10px] text-white/50">先归零者败</span>
        </div>
        <HealthBar mecha={blue} align="right" />
      </div>

      {/* 画布容器 */}
      <div className="crt-container relative overflow-hidden rounded border-4 border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full"
          style={{
            imageRendering: 'pixelated',
            backgroundColor: COLORS.bg,
          }}
        />
        {winner && <WinnerOverlay winner={winner} onRestart={handleRestart} />}
      </div>

      {/* 技能冷却 HUD */}
      <div className="mt-2 flex justify-between px-2">
        <SkillBar mecha={red} />
        <SkillBar mecha={blue} />
      </div>

      {/* 操作说明 */}
      <div className="mt-4 grid grid-cols-2 gap-4 px-2 text-[10px] text-white/70">
        <div>
          <strong className="block text-xs" style={{ color: COLORS.red }}>
            P1 赤焰机甲
          </strong>
          移动：A/D 跳跃：W 防御：S 普攻：F 突刺：G 重斩：H 必杀：Space
        </div>
        <div className="text-right">
          <strong className="block text-xs" style={{ color: COLORS.blue }}>
            P2 雷霆机甲
          </strong>
          移动：←/→ 跳跃：↑ 防御：↓ 普攻：L 突刺：; 重斩：' 必杀：Enter
        </div>
      </div>
    </div>
  );
}
