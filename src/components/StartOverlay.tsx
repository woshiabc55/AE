import { useEffect, useState } from 'react';
import { Play, Sparkles, Waves } from 'lucide-react';

export default function StartOverlay() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const start = () => {
    setHiding(true);
    // 通知 AudioManager 启动
    window.dispatchEvent(new CustomEvent('pulse:start'));
    setTimeout(() => setVisible(false), 700);
  };

  if (!visible) return null;
  return (
    <div
      className={`pointer-events-auto fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        hiding ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(80% 60% at 50% 50%, rgba(125,249,255,0.05), rgba(5,6,11,0.92) 70%)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={start}
    >
      <div className="relative max-w-md w-[88%] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 text-center shadow-[0_30px_120px_-20px_rgba(125,249,255,0.25)]">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#7DF9FF] to-transparent" />
        <div className="flex items-center justify-center gap-2 mb-5">
          <Waves size={18} className="text-[#7DF9FF]" />
          <span className="text-[10px] tracking-[0.4em] text-white/55 font-mono uppercase">PULSE·PARTICLES</span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          音乐粒子场
        </h1>
        <p className="text-[12px] font-mono tracking-[0.18em] uppercase text-white/45 mb-6">
          2D · Digital Wave · Field
        </p>
        <p className="text-[13px] text-white/70 leading-relaxed mb-7">
          一场由声波驱动的现代化数字可视化。<br />
          点击下方按钮，唤醒你的「数字波场」。
        </p>
        <button
          onClick={start}
          className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-mono tracking-[0.22em] uppercase text-white"
          style={{
            background:
              'linear-gradient(135deg, rgba(125,249,255,0.16), rgba(155,93,229,0.18) 55%, rgba(255,60,172,0.16))',
            boxShadow:
              'inset 0 0 0 1px rgba(125,249,255,0.45), 0 12px 40px -10px rgba(125,249,255,0.5)',
          }}
        >
          <Play size={14} className="transition-transform group-hover:translate-x-0.5" />
          Enter the Field
          <Sparkles size={12} className="text-[#FF3CAC]" />
        </button>
        <div className="mt-5 text-[10px] font-mono tracking-widest text-white/35">
          默认内置合成音源 · 无需麦克风授权
        </div>
      </div>
    </div>
  );
}
