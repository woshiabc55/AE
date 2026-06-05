// ====================================================================
// Previews4 — 第 4 批 16 个独立工具的预览组件
// 全部是可在 Home 卡中渲染的微演示
// ====================================================================
import { useEffect, useState } from 'react';

const palettes = [
  { bg: '#0a0a0a', fg: '#f5f1e8', a: '#f0ff00', b: '#ff3da5', c: '#00e5ff' },
  { bg: '#1a0033', fg: '#fff0ff', a: '#ff71ce', b: '#01cdfe', c: '#b967ff' },
  { bg: '#f1ead7', fg: '#1a1410', a: '#d63b1f', b: '#2b5d4e', c: '#1f4ed6' },
];

function usePalette() {
  const [i] = useState(0);
  return palettes[i];
}

// 1. CheckboxFlip - 3D 翻转复选框
export function CheckboxFlip() {
  const [on, setOn] = useState(false);
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <button
        onClick={() => setOn(o => !o)}
        className="w-16 h-16 border-4 font-display font-black text-3xl transition-transform duration-500"
        style={{
          borderColor: p.fg,
          background: on ? p.a : 'transparent',
          color: on ? p.bg : p.fg,
          transform: on ? 'rotateY(360deg)' : 'rotateY(0)',
          transformStyle: 'preserve-3d',
        }}
      >{on ? '✓' : ''}</button>
    </div>
  );
}

// 2. StickerPeel - 撕纸贴纸
export function StickerPeel() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="relative w-20 h-20 cursor-pointer group">
        <div className="absolute inset-0" style={{ background: p.a, transform: 'rotate(-3deg)' }} />
        <div className="absolute inset-0 group-hover:translate-y-1 transition-transform" style={{ background: p.b, transform: 'rotate(2deg)' }} />
        <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl" style={{ color: p.bg }}>★</div>
      </div>
    </div>
  );
}

// 3. BouncingAvatar - 弹跳头像
export function BouncingAvatar() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="w-16 h-16 rounded-full font-display font-black text-2xl flex items-center justify-center" style={{
        background: `linear-gradient(135deg, ${p.a}, ${p.c})`,
        color: p.bg,
        animation: 'bounce 1.2s ease-in-out infinite',
      }}>A</div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
    </div>
  );
}

// 4. TagsCloud - 浮动标签云
export function TagsCloud() {
  const p = usePalette();
  const tags = ['FORGE', 'CRAFT', 'NEON', 'GRID', 'GLOW', 'PIXEL'];
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="flex flex-wrap gap-1 max-w-[140px] justify-center">
        {tags.map((t, i) => (
          <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 border" style={{
            borderColor: p.fg,
            color: i % 2 ? p.a : p.fg,
            animation: `float${i % 3} 2s ease-in-out ${i * 0.2}s infinite`,
          }}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes float0{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes float1{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}
@keyframes float2{0%,100%{transform:rotate(0)}50%{transform:rotate(2deg)}}`}</style>
    </div>
  );
}

// 5. GradientText - 渐变文字
export function GradientTextPreview() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="font-display font-black text-6xl tracking-tighter" style={{
        background: `linear-gradient(90deg, ${p.a}, ${p.b}, ${p.c})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>Aa</div>
    </div>
  );
}

// 6. MorphingShape - 形变几何
export function MorphingShape() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="w-24 h-24" style={{
        background: `linear-gradient(45deg, ${p.a}, ${p.c})`,
        animation: 'ms 6s ease-in-out infinite',
        borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
      }} />
      <style>{`@keyframes ms{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;transform:rotate(0)}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;transform:rotate(180deg)}}`}</style>
    </div>
  );
}

// 7. Cube3D - 3D 立方体
export function Cube3DPreview() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg, perspective: 600 }}>
      <div className="w-16 h-16 relative" style={{ transformStyle: 'preserve-3d', animation: 'cub 4s linear infinite' }}>
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((f, i) => (
          <div key={f} className="absolute w-16 h-16 border-2 flex items-center justify-center font-display font-black text-xs" style={{
            background: [p.a, p.b, p.c, p.fg, p.a, p.b][i],
            color: [p.bg, p.bg, p.bg, p.bg, p.bg, p.bg][i],
            borderColor: p.fg,
            transform: f === 'front' ? 'translateZ(32px)' : f === 'back' ? 'rotateY(180deg) translateZ(32px)' : f === 'right' ? 'rotateY(90deg) translateZ(32px)' : f === 'left' ? 'rotateY(-90deg) translateZ(32px)' : f === 'top' ? 'rotateX(90deg) translateZ(32px)' : 'rotateX(-90deg) translateZ(32px)',
          }} />
        ))}
      </div>
      <style>{`@keyframes cub{0%{transform:rotateX(0) rotateY(0)}100%{transform:rotateX(360deg) rotateY(360deg)}}`}</style>
    </div>
  );
}

// 8. RetroTv - 复古电视
export function RetroTv() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="border-4 p-2" style={{ borderColor: p.fg, background: p.fg }}>
        <div className="w-20 h-14 relative overflow-hidden" style={{ background: '#000' }}>
          <div className="absolute inset-0" style={{
            background: `repeating-linear-gradient(0deg, ${p.a}22 0 1px, transparent 1px 3px)`,
          }} />
          <div className="absolute inset-0 flex items-center justify-center font-display font-black text-lg" style={{ color: p.a }}>ON</div>
        </div>
      </div>
    </div>
  );
}

// 9. PixelAvatar - 像素头像
export function PixelAvatar() {
  const p = usePalette();
  const grid = [
    '00111100',
    '01111110',
    '11100111',
    '11111111',
    '11000011',
    '01111110',
    '00111100',
    '00011000',
  ];
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="grid grid-cols-8 gap-px">
        {grid.flatMap((row, y) => row.split('').map((c, x) => (
          <div key={`${x}-${y}`} className="w-2 h-2" style={{ background: c === '1' ? (y < 3 ? p.fg : (y < 5 ? p.b : p.a)) : 'transparent' }} />
        )))}
      </div>
    </div>
  );
}

// 10. ShineButton - 高光按钮
export function ShineButton() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <button className="px-6 py-2 font-mono text-sm font-bold border-2 relative overflow-hidden group" style={{
        borderColor: p.fg, color: p.fg, background: 'transparent',
      }}>
        <span className="relative z-10">SHINE</span>
        <span className="absolute inset-y-0 -left-1/3 w-1/3 group-hover:left-full transition-all duration-700" style={{ background: `linear-gradient(90deg, transparent, ${p.a}88, transparent)` }} />
      </button>
    </div>
  );
}

// 11. DatePicker - 极简日期选择
export function DatePicker() {
  const p = usePalette();
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <div className="p-2 border-2 w-40" style={{ borderColor: p.fg, color: p.fg }}>
        <div className="font-mono text-[9px] flex justify-between mb-1">
          <span>JUN 2026</span>
          <span style={{ color: p.a }}>●</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center font-mono text-[8px]">
          {days.map((d, i) => {
            const day = d > 0 && d <= 30 ? d : '';
            const isToday = d === 5;
            return (
              <div key={i} className="aspect-square flex items-center justify-center" style={{
                background: isToday ? p.a : 'transparent',
                color: isToday ? p.bg : (d <= 0 || d > 30 ? 'transparent' : p.fg),
              }}>{day}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 12. SpinnerDots - 点点加载
export function SpinnerDots() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center gap-2" style={{ background: p.bg }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="w-3 h-3 rounded-full" style={{
          background: [p.a, p.b, p.c, p.fg][i],
          animation: `sd 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
      <style>{`@keyframes sd{0%,80%,100%{transform:scale(0.4);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// 13. HeartIcon - 心形脉动
export function HeartIcon() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <svg viewBox="0 0 24 24" className="w-12 h-12" style={{ color: p.a, animation: 'hi 1.2s ease-in-out infinite' }}>
        <path fill="currentColor" d="M12 21s-7-4.5-9.5-9.5C0 7 3 3 6.5 3 9 3 11 4.5 12 6c1-1.5 3-3 5.5-3C21 3 24 7 21.5 11.5 19 16.5 12 21 12 21z" />
      </svg>
      <style>{`@keyframes hi{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}`}</style>
    </div>
  );
}

// 14. ScrollProgress - 滚动进度
export function ScrollProgress() {
  const [pct, setPct] = useState(20);
  useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (sc / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const p = usePalette();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: p.bg }}>
      <div className="font-mono text-3xl font-display font-black" style={{ color: p.a }}>{Math.round(pct)}%</div>
      <div className="w-32 h-2 border-2" style={{ borderColor: p.fg }}>
        <div className="h-full" style={{ width: `${pct}%`, background: p.a }} />
      </div>
    </div>
  );
}

// 15. RandomBar - 随机柱状图
export function RandomBar() {
  const p = usePalette();
  const [seed] = useState(Math.random() * 100);
  const bars = Array.from({ length: 12 }, (_, i) => 30 + Math.abs(Math.sin(seed + i * 1.7)) * 70);
  return (
    <div className="w-full h-full flex items-end justify-center gap-1 p-3" style={{ background: p.bg }}>
      {bars.map((h, i) => (
        <div key={i} className="w-2" style={{ height: `${h}%`, background: i % 3 === 0 ? p.a : i % 3 === 1 ? p.b : p.c }} />
      ))}
    </div>
  );
}

// 16. Scribble - 涂鸦线条
export function Scribble() {
  const p = usePalette();
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path
          d="M 10,50 Q 25,10 50,50 T 90,50 Q 75,90 50,50 T 10,50"
          fill="none"
          stroke={p.a}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'draw 3s ease-in-out infinite' }}
        />
      </svg>
      <style>{`@keyframes draw{0%{stroke-dashoffset:300}50%,100%{stroke-dashoffset:0}}`}</style>
    </div>
  );
}
