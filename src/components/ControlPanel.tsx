import { useGameStore } from '@/store/gameStore';
import { Settings, Gamepad2, Waves, Palette, Gauge } from 'lucide-react';
import { useState } from 'react';

export default function ControlPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'fps' | 'wave' | 'belize' | 'pixel'>('fps');

  const wave = useGameStore((s) => s.wave);
  const belize = useGameStore((s) => s.belize);
  const renderer = useGameStore((s) => s.renderer);
  const currentFps = useGameStore((s) => s.currentFps);
  const setWave = useGameStore((s) => s.setWave);
  const setBelize = useGameStore((s) => s.setBelize);
  const setRenderer = useGameStore((s) => s.setRenderer);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-4 right-4 z-50 pixel-btn flex items-center gap-2"
      >
        <Settings size={14} />
      </button>
    );
  }

  const tabs = [
    { id: 'fps' as const, icon: Gauge, label: 'FPS' },
    { id: 'wave' as const, icon: Waves, label: 'WAVE' },
    { id: 'belize' as const, icon: Palette, label: 'BELIZE' },
    { id: 'pixel' as const, icon: Gamepad2, label: 'PIXEL' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 w-64" style={{ fontFamily: '"Press Start 2P", monospace' }}>
      <div className="bg-deep-navy/95 border-2 border-belize-blue">
        <div className="flex items-center justify-between px-3 py-2 bg-belize-blue/30 border-b-2 border-belize-blue">
          <div className="flex items-center gap-2">
            <Gamepad2 size={12} className="text-tropical-yellow" />
            <span className="text-tropical-yellow text-[8px]">控制面板</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-pixel-white hover:text-coral text-[8px]"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-belize-blue/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 flex flex-col items-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? 'bg-belize-blue/40 text-tropical-yellow'
                  : 'text-pixel-white/60 hover:text-pixel-white'
              }`}
            >
              <tab.icon size={12} />
              <span className="text-[6px]">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 space-y-3">
          {activeTab === 'fps' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">目标帧率</span>
                  <span className="text-[7px] text-tropical-yellow">{renderer.targetFps} FPS</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={renderer.targetFps}
                  onChange={(e) => setRenderer({ targetFps: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div className="flex items-center justify-between bg-belize-blue/20 p-2">
                <span className="text-[7px] text-pixel-white/70">当前帧率</span>
                <span className={`text-[9px] font-bold ${
                  currentFps >= renderer.targetFps * 0.9 ? 'text-emerald-pixel' :
                  currentFps >= renderer.targetFps * 0.5 ? 'text-tropical-yellow' : 'text-coral'
                }`}>
                  {currentFps} FPS
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[10, 24, 30, 60].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setRenderer({ targetFps: fps })}
                    className={`text-[7px] py-1 border ${
                      renderer.targetFps === fps
                        ? 'border-tropical-yellow text-tropical-yellow bg-belize-blue/40'
                        : 'border-belize-blue/50 text-pixel-white/50 hover:border-tropical-yellow/50'
                    }`}
                  >
                    {fps}
                  </button>
                ))}
              </div>
              <div className="text-[6px] text-pixel-white/40 leading-relaxed">
                低帧率 → 复古8bit感<br/>
                高帧率 → 流畅现代感
              </div>
            </div>
          )}

          {activeTab === 'wave' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">振幅</span>
                  <span className="text-[7px] text-tropical-yellow">{wave.amplitude.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={wave.amplitude}
                  onChange={(e) => setWave({ amplitude: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">频率</span>
                  <span className="text-[7px] text-tropical-yellow">{wave.frequency.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.005"
                  value={wave.frequency}
                  onChange={(e) => setWave({ frequency: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">速度</span>
                  <span className="text-[7px] text-tropical-yellow">{wave.speed.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={wave.speed}
                  onChange={(e) => setWave({ speed: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">波层数</span>
                  <span className="text-[7px] text-tropical-yellow">{wave.layers}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={wave.layers}
                  onChange={(e) => setWave({ layers: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
            </div>
          )}

          {activeTab === 'belize' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">强度</span>
                  <span className="text-[7px] text-tropical-yellow">{belize.intensity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={belize.intensity}
                  onChange={(e) => setBelize({ intensity: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">色彩偏移</span>
                  <span className="text-[7px] text-tropical-yellow">{belize.colorShift.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6.28"
                  step="0.1"
                  value={belize.colorShift}
                  onChange={(e) => setBelize({ colorShift: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">扭曲度</span>
                  <span className="text-[7px] text-tropical-yellow">{belize.distortion.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={belize.distortion}
                  onChange={(e) => setBelize({ distortion: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
            </div>
          )}

          {activeTab === 'pixel' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[7px] text-pixel-white/70">像素大小</span>
                  <span className="text-[7px] text-tropical-yellow">{renderer.pixelSize}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={renderer.pixelSize}
                  onChange={(e) => setRenderer({ pixelSize: Number(e.target.value) })}
                  className="w-full pixel-slider"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[2, 4, 8, 16].map((size) => (
                  <button
                    key={size}
                    onClick={() => setRenderer({ pixelSize: size })}
                    className={`text-[7px] py-1 border ${
                      renderer.pixelSize === size
                        ? 'border-tropical-yellow text-tropical-yellow bg-belize-blue/40'
                        : 'border-belize-blue/50 text-pixel-white/50 hover:border-tropical-yellow/50'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
              <div className="text-[6px] text-pixel-white/40 leading-relaxed">
                小像素 → 精细画面<br/>
                大像素 → 复古8bit风
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
