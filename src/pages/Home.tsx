import GameCanvas from '@/components/GameCanvas';
import ControlPanel from '@/components/ControlPanel';
import ControlHints from '@/components/ControlHints';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const setCurrentPage = useGameStore((s) => s.setCurrentPage);

  const goToEffects = () => {
    setCurrentPage('effects');
    navigate('/effects');
  };

  return (
    <div className="w-screen h-screen bg-deep-navy overflow-hidden relative">
      <GameCanvas />
      <ControlPanel />
      <ControlHints />

      <button
        onClick={goToEffects}
        className="fixed top-4 left-4 z-50 pixel-btn flex items-center gap-2"
      >
        <Sparkles size={12} />
        <span className="text-[7px]">效果展示</span>
      </button>

      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <h1 className="text-tropical-yellow text-[10px] tracking-wider animate-pixel-float">
          PIXEL WAVE BELIZE
        </h1>
      </div>
    </div>
  );
}
