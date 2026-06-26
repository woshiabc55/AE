import { useRef, useEffect, useState } from 'react';
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

export default function EasingEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedEasing, setSelectedEasing } = useTimelineStore();
  const [canvasSize, setCanvasSize] = useState({ w: 180, h: 120 });

  const easingFn = getEasingFunction(selectedEasing);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = 14;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const plotW = W - PAD * 2;
    const plotH = H - PAD * 2;

    // 背景
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, W, H);

    // 内嵌边框
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, W, H);

    // 网格
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= 4; i++) {
      const x = PAD + (plotW * i) / 4;
      const y = PAD + (plotH * i) / 4;
      ctx.beginPath(); ctx.moveTo(x, PAD); ctx.lineTo(x, PAD + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(PAD + plotW, y); ctx.stroke();
    }

    // 对角参考线
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
    ctx.shadowColor = 'rgba(0,229,255,0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const v = Math.max(0, Math.min(1, easingFn(t)));
      const x = PAD + t * plotW;
      const y = PAD + plotH - v * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 端点
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath(); ctx.arc(PAD, PAD + plotH, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(PAD + plotW, PAD, 3, 0, Math.PI * 2); ctx.fill();
  }, [easingFn, canvasSize]);

  // 监听容器宽度变化
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.max(160, el.clientWidth - 24);
      const h = Math.max(100, Math.round(w * 0.55));
      setCanvasSize({ w, h });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handlePreset = (name: EasingPreset) => {
    setSelectedEasing({ type: 'preset', name });
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        className="rounded border border-white/10 self-center"
      />
      <div className="grid grid-cols-2 gap-1">
        {PRESETS.map((name) => {
          const active = selectedEasing.type === 'preset' && selectedEasing.name === name;
          return (
            <button
              key={name}
              onClick={() => handlePreset(name)}
              className={`text-[10px] px-1.5 py-1 rounded transition-all ${
                active
                  ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 shadow-[0_0_6px_rgba(0,229,255,0.15)]'
                  : 'bg-white/[0.04] text-gray-400 border border-transparent hover:bg-white/10 hover:text-gray-200'
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
