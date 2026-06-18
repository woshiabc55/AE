import { useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useInput } from '@/hooks/useInput';
import { useGameLoop } from '@/hooks/useGameLoop';
import { GameHUD } from '@/components/GameHUD';
import { GameOverlay } from '@/components/GameScreens';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '@/utils/constants';

export function BattleGame(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useInput();
  useGameLoop(canvasRef, keysRef);

  const screen = useGameStore((s) => s.screen);

  return (
    <div className="relative mx-auto w-full max-w-[960px]">
      <GameHUD />

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

      {/* 操作说明 */}
      {screen === 'fighting' && (
        <div className="mt-4 grid grid-cols-1 gap-4 px-2 text-[10px] text-white/70 sm:grid-cols-2">
          <div>
            <strong className="block text-xs" style={{ color: COLORS.red }}>
              P1 赤焰
            </strong>
            移动 A/D 跳跃 W 防御 S 普攻 F 技1 G 技2 H 投 T 冲刺 Q 射击 E 反击 R 必杀 Space
          </div>
          <div className="text-left sm:text-right">
            <strong className="block text-xs" style={{ color: COLORS.blue }}>
              P2 雷霆
            </strong>
            移动 ←/→ 跳跃 ↑ 防御 ↓ 普攻 L 技1 ; 技2 ' 投 K 冲刺 O 射击 P 反击 ] 必杀 Enter
          </div>
        </div>
      )}
    </div>
  );
}
