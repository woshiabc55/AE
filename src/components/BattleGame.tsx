import { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useInput } from '@/hooks/useInput';
import { useGameLoop } from '@/hooks/useGameLoop';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS,
  KEY_MAP,
  SKILL_CONFIG,
  MECHA_TYPES,
  ROUNDS_TO_WIN,
} from '@/utils/constants';
import type { Mecha, MechaId, MechaType, GameMode, Difficulty } from '@/utils/types';
import {
  getMechaTypeColor,
  getMechaTypeDarkColor,
} from '@/utils/skills';

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

function HealthBar({ mecha, align }: { mecha: Mecha; align: 'left' | 'right' }): JSX.Element {
  const percent = (mecha.hp / mecha.maxHp) * 100;
  const color = getMechaTypeColor(mecha.type);
  const darkColor = getMechaTypeDarkColor(mecha.type);
  const label = `${MECHA_TYPES[mecha.type].name} ${mecha.id === 'red' ? 'P1' : mecha.id === 'blue' ? 'P2' : ''}`;

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
}

function SkillBar({ mecha }: { mecha: Mecha }): JSX.Element {
  const color = getMechaTypeColor(mecha.type);
  const keys = KEY_MAP[mecha.id];
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
}

function MenuButton({
  label,
  onClick,
  color = COLORS.blue,
}: {
  label: string;
  onClick: () => void;
  color?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-2 px-8 py-3 text-sm transition hover:scale-105 active:scale-95"
      style={{ borderColor: color, color }}
    >
      {label}
    </button>
  );
}

function MenuScreen({
  onStart,
}: {
  onStart: () => void;
}): JSX.Element {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h1
        className="mb-2 text-center text-3xl sm:text-5xl"
        style={{ color: COLORS.red, textShadow: `0 0 20px ${COLORS.red}` }}
      >
        PIXEL MECHA
      </h1>
      <h2
        className="mb-10 text-center text-xl sm:text-2xl"
        style={{ color: COLORS.blue, textShadow: `0 0 12px ${COLORS.blue}` }}
      >
        BATTLE
      </h2>
      <MenuButton label="开始游戏" onClick={onStart} color={COLORS.red} />
    </div>
  );
}

function ModeSelectScreen({
  onSelect,
}: {
  onSelect: (mode: GameMode) => void;
}): JSX.Element {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-8 text-2xl text-white/90">选择模式</h2>
      <div className="flex flex-col gap-4">
        <MenuButton label="双人对战 (PVP)" onClick={() => onSelect('pvp')} color={COLORS.blue} />
        <MenuButton label="人机对战 (PVE)" onClick={() => onSelect('pvc')} color={COLORS.red} />
      </div>
    </div>
  );
}

function DifficultySelectScreen({
  onSelect,
}: {
  onSelect: (difficulty: Difficulty) => void;
}): JSX.Element {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-8 text-2xl text-white/90">选择难度</h2>
      <div className="flex flex-col gap-4">
        <MenuButton label="简单" onClick={() => onSelect('easy')} color={COLORS.green} />
        <MenuButton label="普通" onClick={() => onSelect('normal')} color={COLORS.blue} />
        <MenuButton label="困难" onClick={() => onSelect('hard')} color={COLORS.red} />
      </div>
    </div>
  );
}

function CharacterCard({
  type,
  selected,
  onClick,
}: {
  type: MechaType;
  selected: boolean;
  onClick: () => void;
}): JSX.Element {
  const stats = MECHA_TYPES[type];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-40 flex-col items-center gap-2 border-2 p-3 transition hover:scale-105"
      style={{
        borderColor: selected ? stats.color : 'rgba(255,255,255,0.2)',
        backgroundColor: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
      }}
    >
      <div
        className="h-12 w-12"
        style={{ backgroundColor: stats.color, boxShadow: `0 0 12px ${stats.color}` }}
      />
      <span className="text-xs" style={{ color: stats.color }}>
        {stats.name}
      </span>
      <div className="text-[9px] text-white/60">
        HP {stats.maxHp} | 移速 {Math.round(stats.moveSpeed * 100)}%
      </div>
    </button>
  );
}

function CharacterSelectScreen({
  onConfirm,
}: {
  onConfirm: () => void;
}): JSX.Element {
  const redType = useGameStore((s) => s.redType);
  const blueType = useGameStore((s) => s.blueType);
  const mode = useGameStore((s) => s.mode);
  const setMechaType = useGameStore((s) => s.setMechaType);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-6 text-2xl text-white/90">选择机甲</h2>

      <div className="mb-6 flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: COLORS.red }}>
            P1
          </span>
          <div className="flex gap-2">
            {(Object.keys(MECHA_TYPES) as MechaType[]).map((type) => (
              <CharacterCard
                key={`red-${type}`}
                type={type}
                selected={redType === type}
                onClick={() => setMechaType('red', type)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: COLORS.blue }}>
            {mode === 'pvc' ? '电脑' : 'P2'}
          </span>
          <div className="flex gap-2">
            {(Object.keys(MECHA_TYPES) as MechaType[]).map((type) => (
              <CharacterCard
                key={`blue-${type}`}
                type={type}
                selected={blueType === type}
                onClick={() => setMechaType('blue', type)}
              />
            ))}
          </div>
        </div>
      </div>

      <MenuButton label="开始对战" onClick={onConfirm} color={COLORS.gold} />
    </div>
  );
}

function RoundEndScreen({
  winner,
  redWins,
  blueWins,
  onNext,
}: {
  winner: MechaId | 'draw';
  redWins: number;
  blueWins: number;
  onNext: () => void;
}): JSX.Element {
  const label = winner === 'draw' ? '平局' : winner === 'red' ? 'P1 胜' : 'P2 胜';
  const color = winner === 'draw' ? COLORS.white : winner === 'red' ? COLORS.red : COLORS.blue;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
      <h2 className="mb-4 text-4xl" style={{ color }}>
        {label}
      </h2>
      <div className="mb-6 text-sm text-white/80">
        比分 {redWins} - {blueWins}
      </div>
      <MenuButton label="下一回合" onClick={onNext} color={color} />
    </div>
  );
}

function MatchEndScreen({
  winner,
  onRestart,
}: {
  winner: MechaId;
  onRestart: () => void;
}): JSX.Element {
  const color = winner === 'red' ? COLORS.red : COLORS.blue;
  const label = winner === 'red' ? 'P1 获胜！' : 'P2 获胜！';

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2
        className="mb-6 text-5xl"
        style={{ color, textShadow: `0 0 24px ${color}` }}
      >
        {label}
      </h2>
      <div className="flex gap-4">
        <MenuButton label="再来一局" onClick={onRestart} color={color} />
        <MenuButton label="返回主菜单" onClick={() => useGameStore.getState().resetMatch()} />
      </div>
    </div>
  );
}

function GameOverlay(): JSX.Element | null {
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const setMode = useGameStore((s) => s.setMode);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const startMatch = useGameStore((s) => s.startMatch);
  const nextRound = useGameStore((s) => s.nextRound);
  const roundWinner = useGameStore((s) => s.roundWinner);
  const matchWinner = useGameStore((s) => s.matchWinner);
  const roundResult = useGameStore((s) => s.roundResult);

  if (screen === 'menu') {
    return <MenuScreen onStart={() => setScreen('modeSelect')} />;
  }
  if (screen === 'modeSelect') {
    return (
      <ModeSelectScreen
        onSelect={(mode) => {
          setMode(mode);
          setScreen(mode === 'pvc' ? 'difficultySelect' : 'characterSelect');
        }}
      />
    );
  }
  if (screen === 'difficultySelect') {
    return (
      <DifficultySelectScreen
        onSelect={(difficulty) => {
          setDifficulty(difficulty);
          setScreen('characterSelect');
        }}
      />
    );
  }
  if (screen === 'characterSelect') {
    return <CharacterSelectScreen onConfirm={startMatch} />;
  }
  if (screen === 'roundEnd' && roundWinner) {
    return (
      <RoundEndScreen
        winner={roundWinner}
        redWins={roundResult.redWins}
        blueWins={roundResult.blueWins}
        onNext={nextRound}
      />
    );
  }
  if (screen === 'matchEnd' && matchWinner) {
    return (
      <MatchEndScreen
        winner={matchWinner}
        onRestart={startMatch}
      />
    );
  }

  return null;
}

export function BattleGame(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useInput();
  useGameLoop(canvasRef, keysRef);

  const { red, blue, roundResult } = useGameStore();
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="relative mx-auto w-full max-w-[960px]">
      {/* HUD */}
      <div className="mb-2 flex items-start justify-between px-2">
        <HealthBar mecha={red} align="left" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white/90">VS</span>
          <span className="text-[10px] text-white/50">
            {roundResult.redWins}-{roundResult.blueWins}
          </span>
        </div>
        <HealthBar mecha={blue} align="right" />
      </div>

      {/* 倒计时 */}
      <div className="mb-1 text-center text-sm text-white/80">
        回合 {roundResult.round}/{ROUNDS_TO_WIN * 2 - 1} · 时间{' '}
        {Math.max(0, roundResult.timer)}s
      </div>

      {/* 画布 */}
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
        <GameOverlay />
      </div>

      {/* 技能 HUD */}
      {screen === 'fighting' && (
        <div className="mt-2 flex justify-between px-2">
          <SkillBar mecha={red} />
          <SkillBar mecha={blue} />
        </div>
      )}

      {/* 操作说明 */}
      {screen === 'fighting' && (
        <div className="mt-4 grid grid-cols-1 gap-4 px-2 text-[10px] text-white/70 sm:grid-cols-2">
          <div>
            <strong className="block text-xs" style={{ color: COLORS.red }}>
              P1
            </strong>
            移动 A/D 跳跃 W 防御 S 普攻 F 技1 G 技2/投 H 冲刺 Q 射击 E 反击 R 必杀 Space
          </div>
          <div className="text-left sm:text-right">
            <strong className="block text-xs" style={{ color: COLORS.blue }}>
              P2
            </strong>
            移动 ←/→ 跳跃 ↑ 防御 ↓ 普攻 L 技1 ; 技2/投 ' 冲刺 O 射击 P 反击 ] 必杀 Enter
          </div>
        </div>
      )}
    </div>
  );
}
