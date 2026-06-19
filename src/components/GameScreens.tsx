import { memo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { COLORS, MECHA_TYPES } from '@/utils/constants';
import type { MechaType } from '@/utils/types';

const WindowFrame = memo(function WindowFrame({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-4 bg-gradient-to-b from-[#101830] to-[#080C18] shadow-2xl ${className}`}
      style={{ borderColor: '#3A5078' }}
    >
      {children}
    </div>
  );
});

const MenuButton = memo(function MenuButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-48 border-2 bg-[#1A2745] px-6 py-2 text-sm text-white/90 transition hover:bg-[#2A3F6A] hover:text-white active:scale-95"
      style={{ borderColor: '#5A7AAA' }}
    >
      {label}
    </button>
  );
});

export const MenuScreen = memo(function MenuScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
      <WindowFrame className="flex flex-col items-center gap-6 p-8 sm:p-12">
        <h1
          className="text-center text-3xl tracking-[0.3em] sm:text-5xl"
          style={{ color: COLORS.gold, textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
        >
          FANTASY ARENA
        </h1>
        <h2 className="text-center text-sm tracking-widest text-white/70 sm:text-base">
          像素幻想对决
        </h2>
        <div className="flex flex-col gap-3">
          <MenuButton label="开始游戏" onClick={() => setScreen('modeSelect')} />
        </div>
      </WindowFrame>
    </div>
  );
});

export const ModeSelectScreen = memo(function ModeSelectScreen() {
  const setMode = useGameStore((s) => s.setMode);
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
      <WindowFrame className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-xl tracking-widest text-white/90">选择战斗模式</h2>
        <div className="flex flex-col gap-3">
          <MenuButton
            label="双人对战 (PVP)"
            onClick={() => {
              setMode('pvp');
              setScreen('characterSelect');
            }}
          />
          <MenuButton
            label="人机对战 (PVE)"
            onClick={() => {
              setMode('pvc');
              setScreen('difficultySelect');
            }}
          />
        </div>
      </WindowFrame>
    </div>
  );
});

export const DifficultySelectScreen = memo(function DifficultySelectScreen() {
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
      <WindowFrame className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-xl tracking-widest text-white/90">选择难度</h2>
        <div className="flex flex-col gap-3">
          <MenuButton label="简单" onClick={() => { setDifficulty('easy'); setScreen('characterSelect'); }} />
          <MenuButton label="普通" onClick={() => { setDifficulty('normal'); setScreen('characterSelect'); }} />
          <MenuButton label="困难" onClick={() => { setDifficulty('hard'); setScreen('characterSelect'); }} />
        </div>
      </WindowFrame>
    </div>
  );
});

const JobIcons: Record<MechaType, string> = {
  striker: '⚔',
  tank: '🛡',
  speed: '🗡',
  mage: '🔮',
};

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
  const jobNames: Record<MechaType, string> = {
    striker: '战士',
    tank: '骑士',
    speed: '盗贼',
    mage: '黑魔道士',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-36 flex-col items-center gap-2 border-2 p-3 transition hover:scale-105 sm:w-44"
      style={{
        borderColor: selected ? '#FFD700' : 'rgba(255,255,255,0.2)',
        backgroundColor: selected ? 'rgba(255,215,0,0.12)' : 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center text-xl"
        style={{ backgroundColor: stats.color, boxShadow: `0 0 12px ${stats.color}` }}
      >
        {JobIcons[type]}
      </div>
      <span className="text-xs" style={{ color: stats.color }}>
        {jobNames[type]}
      </span>
      <div className="text-[9px] text-white/60">
        HP {stats.maxHp} · 移速 {Math.round(stats.moveSpeed * 100)}%
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
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
      <WindowFrame className="flex flex-col items-center gap-6 p-6 sm:p-10">
        <h2 className="text-xl tracking-widest text-white/90">选择职业</h2>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm" style={{ color: COLORS.red }}>
              P1 队伍
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
              {mode === 'pvc' ? '电脑 队伍' : 'P2 队伍'}
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

        <MenuButton label="开始对战" onClick={startMatch} />
      </WindowFrame>
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
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
      <WindowFrame className="flex flex-col items-center gap-4 p-8">
        <h2 className="text-3xl" style={{ color }}>
          {label}
        </h2>
        <div className="text-sm text-white/80">
          比分 {redWins} - {blueWins}
        </div>
        <MenuButton label="下一回合" onClick={nextRound} />
      </WindowFrame>
    </div>
  );
});

export const MatchEndScreen = memo(function MatchEndScreen() {
  const matchWinner = useGameStore((s) => s.matchWinner);
  const startMatch = useGameStore((s) => s.startMatch);
  const resetMatch = useGameStore((s) => s.resetMatch);

  if (!matchWinner) return null;
  const color = matchWinner === 'red' ? COLORS.red : COLORS.blue;
  const label = matchWinner === 'red' ? 'P1 获得胜利！' : 'P2 获得胜利！';

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
      <WindowFrame className="flex flex-col items-center gap-6 p-10">
        <h2
          className="text-4xl"
          style={{ color, textShadow: `0 0 24px ${color}` }}
        >
          {label}
        </h2>
        <div className="flex gap-4">
          <MenuButton label="再来一局" onClick={startMatch} />
          <MenuButton label="返回主菜单" onClick={resetMatch} />
        </div>
      </WindowFrame>
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
