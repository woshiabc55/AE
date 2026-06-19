import { useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useInput } from '@/hooks/useInput';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useFullscreen } from '@/hooks/useFullscreen';
import { GameHUD } from '@/components/GameHUD';
import { GameOverlay } from '@/components/GameScreens';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '@/utils/constants';

export function BattleGame(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useInput();
  useGameLoop(canvasRef, keysRef);

  const screen = useGameStore((s) => s.screen);
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div
        className="crt-container relative overflow-hidden rounded-sm border-4 shadow-2xl"
        style={{
          borderColor: '#2A3A5A',
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
          maxHeight: '100vh',
          maxWidth: '100vw',
          width: 'auto',
          height: 'auto',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="h-full w-full"
          style={{
            imageRendering: 'pixelated',
            backgroundColor: COLORS.bg,
          }}
        />
        <GameHUD />
        <GameOverlay />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-2 z-30 rounded border border-white/20 bg-black/60 p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {screen === 'fighting' && (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-30 flex justify-between px-4 text-[10px] text-white/50 sm:px-8 sm:text-xs">
          <div>
            P1: A/D 移动 W 跳 S 防 F 攻 G/H/J 技 Q 冲 E 射 R 反 T 投 Space 必杀
          </div>
          <div className="text-right">
            P2: ←/→ 移动 ↑ 跳 ↓ 防 L 攻 ;/'/ 技 O 冲 P 射 ] 反 K 投 Enter 必杀
          </div>
        </div>
      )}
    </div>
  );
}
