import ImagePixelator from '@/components/ImagePixelator';
import WaveVisualizer from '@/components/WaveVisualizer';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Image, Waves } from 'lucide-react';
import { useState } from 'react';

export default function Effects() {
  const navigate = useNavigate();
  const setCurrentPage = useGameStore((s) => s.setCurrentPage);
  const [activeSection, setActiveSection] = useState<'pixel' | 'wave'>('pixel');

  const goToGame = () => {
    setCurrentPage('game');
    navigate('/');
  };

  return (
    <div className="w-screen h-screen bg-deep-navy overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div
          className="flex items-center justify-between mb-8"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <div>
            <h1 className="text-tropical-yellow text-[12px] mb-2">效果展示</h1>
            <p className="text-pixel-white/50 text-[7px]">
              图像像素化转换 & 数学波形调节
            </p>
          </div>
          <button onClick={goToGame} className="pixel-btn flex items-center gap-2">
            <Gamepad2 size={12} />
            <span className="text-[7px]">返回游戏</span>
          </button>
        </div>

        <div
          className="flex gap-2 mb-6"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <button
            onClick={() => setActiveSection('pixel')}
            className={`flex items-center gap-2 px-4 py-3 border-2 transition-colors ${
              activeSection === 'pixel'
                ? 'border-tropical-yellow text-tropical-yellow bg-belize-blue/30'
                : 'border-belize-blue/50 text-pixel-white/50 hover:border-belize-blue'
            }`}
          >
            <Image size={14} />
            <span className="text-[8px]">图像像素化</span>
          </button>
          <button
            onClick={() => setActiveSection('wave')}
            className={`flex items-center gap-2 px-4 py-3 border-2 transition-colors ${
              activeSection === 'wave'
                ? 'border-tropical-yellow text-tropical-yellow bg-belize-blue/30'
                : 'border-belize-blue/50 text-pixel-white/50 hover:border-belize-blue'
            }`}
          >
            <Waves size={14} />
            <span className="text-[8px]">波形调节器</span>
          </button>
        </div>

        <div className="bg-deep-navy/80 border-2 border-belize-blue/30 p-6">
          {activeSection === 'pixel' && <ImagePixelator />}
          {activeSection === 'wave' && <WaveVisualizer />}
        </div>

        <div
          className="mt-8 text-center"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          <p className="text-[6px] text-pixel-white/30">
            PIXEL WAVE BELIZE v1.0 — 像素艺术 × 数学之美
          </p>
        </div>
      </div>
    </div>
  );
}
