import { memo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { COLORS, MECHA_TYPES } from '@/utils/constants';
import type { MechaType } from '@/utils/types';

const MenuButton = memo(function MenuButton({
  label,
  onClick,
  color = COLORS.blue,
}: {
  label: string;
  onClick: () => void;
  color?: string;
}) {
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
});

export const MenuScreen = memo(function MenuScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
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
      <MenuButton label="开始游戏" onClick={() => setScreen('modeSelect')} color={COLORS.red} />
    </div>
  );
});

export const ModeSelectScreen = memo(function ModeSelectScreen() {
  const setMode = useGameStore((s) => s.setMode);
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-8 text-2xl text-white/90">选择模式</h2>
      <div className="flex flex-col gap-4">
        <MenuButton
          label="双人对战 (PVP)"
          onClick={() => {
            setMode('pvp');
            setScreen('characterSelect');
          }}
          color={COLORS.blue}
        />
        <MenuButton
          label="人机对战 (PVE)"
          onClick={() => {
            setMode('pvc');
            setScreen('difficultySelect');
          }}
          color={COLORS.red}
        />
      </div>
    </div>
  );
});

export const DifficultySelectScreen = memo(function DifficultySelectScreen() {
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-8 text-2xl text-white/90">选择难度</h2>
      <div className="flex flex-col gap-4">
        <MenuButton label="简单" onClick={() => { setDifficulty('easy'); setScreen('characterSelect'); }} color={COLORS.green} />
        <MenuButton label="普通" onClick={() => { setDifficulty('normal'); setScreen('characterSelect'); }} color={COLORS.blue} />
        <MenuButton label="困难" onClick={() => { setDifficulty('hard'); setScreen('characterSelect'); }} color={COLORS.red} />
      </div>
    </div>
  );
});

const CharacterCard = memo(function CharacterCard({
  type,
  selected,
  onClick,
}: {
  type: MechaType;
  selected: boolean;
  onClick: () => void;
}) {
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
});

export const CharacterSelectScreen = memo(function CharacterSelectScreen() {
  const redType = useGameStore((s) => s.redType);
  const blueType = useGameStore((s) => s.blueType);
  const mode = useGameStore((s) => s.mode);
  const setMechaType = useGameStore((s) => s.setMechaType);
  const startMatch = useGameStore((s) => s.startMatch);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2 className="mb-6 text-2xl text-white/90">选择机甲</h2>

      <div className="mb-6 flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: COLORS.red }}>
            P1 赤焰
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
            {mode === 'pvc' ? '电脑 雷霆' : 'P2 雷霆'}
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

      <MenuButton label="开始对战" onClick={startMatch} color={COLORS.gold} />
    </div>
  );
});

export const RoundEndScreen = memo(function RoundEndScreen() {
  const roundWinner = useGameStore((s) => s.roundWinner);
  const redWins = useGameStore((s) => s.roundResult.redWins);
  const blueWins = useGameStore((s) => s.roundResult.blueWins);
  const nextRound = useGameStore((s) => s.nextRound);

  if (!roundWinner) return null;
  const label = roundWinner === 'draw' ? '平局' : roundWinner === 'red' ? 'P1 胜' : 'P2 胜';
  const color = roundWinner === 'draw' ? COLORS.white : roundWinner === 'red' ? COLORS.red : COLORS.blue;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
      <h2 className="mb-4 text-4xl" style={{ color }}>
        {label}
      </h2>
      <div className="mb-6 text-sm text-white/80">
        比分 {redWins} - {blueWins}
      </div>
      <MenuButton label="下一回合" onClick={nextRound} color={color} />
    </div>
  );
});

export const MatchEndScreen = memo(function MatchEndScreen() {
  const matchWinner = useGameStore((s) => s.matchWinner);
  const startMatch = useGameStore((s) => s.startMatch);
  const resetMatch = useGameStore((s) => s.resetMatch);

  if (!matchWinner) return null;
  const color = matchWinner === 'red' ? COLORS.red : COLORS.blue;
  const label = matchWinner === 'red' ? 'P1 获胜！' : 'P2 获胜！';

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
      <h2
        className="mb-6 text-5xl"
        style={{ color, textShadow: `0 0 24px ${color}` }}
      >
        {label}
      </h2>
      <div className="flex gap-4">
        <MenuButton label="再来一局" onClick={startMatch} color={color} />
        <MenuButton label="返回主菜单" onClick={resetMatch} />
      </div>
    </div>
  );
});

export const GameOverlay = memo(function GameOverlay() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case 'menu':
      return <MenuScreen />;
    case 'modeSelect':
      return <ModeSelectScreen />;
    case 'difficultySelect':
      return <DifficultySelectScreen />;
    case 'characterSelect':
      return <CharacterSelectScreen />;
    case 'roundEnd':
      return <RoundEndScreen />;
    case 'matchEnd':
      return <MatchEndScreen />;
    default:
      return null;
  }
});
