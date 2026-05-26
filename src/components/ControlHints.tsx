import { useGameStore } from '@/store/gameStore';
import { Keyboard, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ControlHints() {
  const currentFps = useGameStore((s) => s.currentFps);
  const targetFps = useGameStore((s) => s.renderer.targetFps);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div
        className="bg-deep-navy/90 border-2 border-belize-blue/60 px-6 py-3 flex items-center gap-6"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <div className="flex items-center gap-2">
          <Keyboard size={14} className="text-tropical-yellow" />
          <span className="text-[7px] text-pixel-white/70">操作</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center justify-center w-6 h-6 border border-belize-blue/50 bg-belize-blue/20">
              <ArrowUp size={10} className="text-tropical-yellow" />
            </div>
            <div className="flex gap-0.5">
              <div className="flex items-center justify-center w-6 h-6 border border-belize-blue/50 bg-belize-blue/20">
                <ArrowLeft size={10} className="text-tropical-yellow" />
              </div>
              <div className="flex items-center justify-center w-6 h-6 border border-belize-blue/50 bg-belize-blue/20">
                <ArrowDown size={10} className="text-tropical-yellow" />
              </div>
              <div className="flex items-center justify-center w-6 h-6 border border-belize-blue/50 bg-belize-blue/20">
                <ArrowRight size={10} className="text-tropical-yellow" />
              </div>
            </div>
          </div>
          <div className="text-[6px] text-pixel-white/50 ml-2 leading-relaxed">
            移动<br/>跳跃
          </div>
        </div>

        <div className="h-6 w-px bg-belize-blue/30" />

        <div className="text-[6px] text-pixel-white/50">
          <span className="text-tropical-yellow">WASD</span> / 方向键 移动
        </div>
        <div className="text-[6px] text-pixel-white/50">
          <span className="text-tropical-yellow">空格</span> / W 跳跃
        </div>

        <div className="h-6 w-px bg-belize-blue/30" />

        <div className="text-[7px]">
          <span className="text-pixel-white/50">FPS:</span>{' '}
          <span className={
            currentFps >= targetFps * 0.9 ? 'text-emerald-pixel' :
            currentFps >= targetFps * 0.5 ? 'text-tropical-yellow' : 'text-coral'
          }>
            {currentFps}
          </span>
          <span className="text-pixel-white/30">/{targetFps}</span>
        </div>
      </div>
    </div>
  );
}
