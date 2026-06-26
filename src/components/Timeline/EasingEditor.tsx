import { useRef, useEffect } from 'react';
import { useTimelineStore } from '../../store/useTimelineStore';
import { getEasingFunction } from '../../engine/easing';
import type { EasingPreset } from '../../types';

const PRESETS: EasingPreset[] = [
  'linear', 'ease-in', 'ease-out', 'ease-in-out',
  'back-in', 'back-out', 'elastic-out', 'bounce-out',
];

const PRESET_LABELS: Record<EasingPreset, string> = {
  'linear': '线性',
  'ease-in': '渐入',
  'ease-out': '渐出',
  'ease-in-out': '渐入出',
  'back-in': '回弹入',
  'back-out': '回弹出',
  'elastic-in': '弹入',
  'elastic-out': '弹出',
  'back-in-out': '回弹入出',
  'bounce-in': '弹跳入',
  'bounce-out': '弹跳出',
};

const W = 200, H = 150, PAD = 16;

export default function EasingEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedEasing, setSelectedEasing } = useTimelineStore();

  const easingFn = getEasingFunction(selectedEasing);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const plotW = W - PAD * 2;
    const plotH = H - PAD * 2;

    // 背景
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, W, H);

    // 网格
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = PAD + (plotW * i) / 4;
      const y = PAD + (plotH * i) / 4;
      ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, PAD + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(PAD + plotW, y); ctx.stroke();
    }

    // 对角参考线 (linear)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD, PAD + plotH);
    ctx.lineTo(PAD + plotW, PAD);
    ctx.stroke();
    ctx.setLineDash([]);

    // 缓动曲线
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const v = easingFn(t);
      const x = PAD + t * plotW;
      const y = PAD + plotH - v * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 端点
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath(); ctx.arc(PAD, PAD + plotH, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(PAD + plotW, PAD, 3, 0, Math.PI * 2); ctx.fill();
  }, [easingFn]);

  const handlePreset = (name: EasingPreset) => {
    setSelectedEasing({ type: 'preset', name });
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-[#1a1d27] border-t border-white/10">
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H }}
        className="rounded border border-white/10 self-center"
      />
      <div className="grid grid-cols-4 gap-1">
        {PRESETS.map((name) => {
          const active = selectedEasing.type === 'preset' && selectedEasing.name === name;
          return (
            <button
              key={name}
              onClick={() => handlePreset(name)}
              className={`text-[10px] px-1 py-1 rounded transition-colors ${
                active
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              {PRESET_LABELS[name]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
