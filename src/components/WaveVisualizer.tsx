import { useRef, useEffect, useState, useCallback } from 'react';

interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  layers: number;
}

type PresetName = 'ocean' | 'pulse' | 'vortex' | 'calm';

const PRESETS: Record<PresetName, WaveParams> = {
  ocean: { amplitude: 12, frequency: 0.04, phase: 0, speed: 1.5, layers: 4 },
  pulse: { amplitude: 20, frequency: 0.08, phase: 0, speed: 4, layers: 2 },
  vortex: { amplitude: 8, frequency: 0.12, phase: 0, speed: 6, layers: 5 },
  calm: { amplitude: 4, frequency: 0.02, phase: 0, speed: 0.8, layers: 3 },
};

const PRESET_LABELS: Record<PresetName, string> = {
  ocean: '海浪',
  pulse: '脉冲',
  vortex: '漩涡',
  calm: '平静',
};

export default function WaveVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [params, setParams] = useState<WaveParams>(PRESETS.ocean);

  const render = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    ctx.fillStyle = '#0A1628';
    ctx.fillRect(0, 0, w, h);

    const colors = [
      ['#003F87', '#0055BB'],
      ['#0055BB', '#0077DD'],
      ['#0077DD', '#0099FF'],
      ['#0099FF', '#00BBFF'],
      ['#00BBFF', '#00D4AA'],
    ];

    for (let li = params.layers - 1; li >= 0; li--) {
      const t = li / Math.max(params.layers - 1, 1);
      const layerAmp = params.amplitude * (1 - t * 0.3);
      const layerFreq = params.frequency * (1 + t * 0.5);
      const layerSpeed = params.speed * (1 + t * 0.2);
      const layerPhase = params.phase + li * 1.2;
      const baseY = h * (0.35 + t * 0.12);
      const colorPair = colors[li % colors.length];

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x++) {
        const waveY =
          Math.sin(x * layerFreq + time * layerSpeed + layerPhase) * layerAmp +
          Math.sin(x * layerFreq * 0.5 + time * layerSpeed * 0.7 + layerPhase * 1.3) * layerAmp * 0.3;
        ctx.lineTo(x, baseY + waveY);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, baseY - layerAmp, 0, h);
      gradient.addColorStop(0, colorPair[0]);
      gradient.addColorStop(0.5, colorPair[1]);
      gradient.addColorStop(1, '#001133');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.fillStyle = '#FFD100';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`A:${params.amplitude.toFixed(1)} F:${params.frequency.toFixed(3)} S:${params.speed.toFixed(1)}`, 8, 16);
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = 200;
    };
    resize();

    const ctx = canvas.getContext('2d')!;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      timeRef.current += dt;
      render(ctx, canvas.width, canvas.height, timeRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [render]);

  const updateParam = (key: keyof WaveParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div ref={(el) => {
        if (el) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = el.clientWidth;
            canvas.height = 200;
          }
        }
      }}>
        <canvas
          ref={canvasRef}
          className="w-full block border-2 border-belize-blue/30"
          style={{ imageRendering: 'pixelated', height: 200 }}
        />
      </div>

      <div className="space-y-2" style={{ fontFamily: '"Press Start 2P", monospace' }}>
        <div className="text-[7px] text-tropical-yellow mb-2">动画预设</div>
        <div className="grid grid-cols-4 gap-1">
          {(Object.keys(PRESETS) as PresetName[]).map((name) => (
            <button
              key={name}
              onClick={() => setParams(PRESETS[name])}
              className={`text-[7px] py-2 border transition-colors ${
                JSON.stringify(params) === JSON.stringify(PRESETS[name])
                  ? 'border-tropical-yellow text-tropical-yellow bg-belize-blue/40'
                  : 'border-belize-blue/50 text-pixel-white/50 hover:border-tropical-yellow/50'
              }`}
            >
              {PRESET_LABELS[name]}
            </button>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[7px] text-pixel-white/70">振幅</span>
              <span className="text-[7px] text-tropical-yellow">{params.amplitude.toFixed(1)}</span>
            </div>
            <input
              type="range" min="1" max="30" step="0.5"
              value={params.amplitude}
              onChange={(e) => updateParam('amplitude', Number(e.target.value))}
              className="w-full pixel-slider"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[7px] text-pixel-white/70">频率</span>
              <span className="text-[7px] text-tropical-yellow">{params.frequency.toFixed(3)}</span>
            </div>
            <input
              type="range" min="0.01" max="0.2" step="0.005"
              value={params.frequency}
              onChange={(e) => updateParam('frequency', Number(e.target.value))}
              className="w-full pixel-slider"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[7px] text-pixel-white/70">速度</span>
              <span className="text-[7px] text-tropical-yellow">{params.speed.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0.5" max="8" step="0.5"
              value={params.speed}
              onChange={(e) => updateParam('speed', Number(e.target.value))}
              className="w-full pixel-slider"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[7px] text-pixel-white/70">波层数</span>
              <span className="text-[7px] text-tropical-yellow">{params.layers}</span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={params.layers}
              onChange={(e) => updateParam('layers', Number(e.target.value))}
              className="w-full pixel-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
