import { useEffect, useState, useMemo } from 'react';
import { DemoFrame } from './Frame';

export interface PackTool {
  slug: string;
  name: string;
  Preview: React.FC;
}

export interface Pack {
  id: string;
  name: string;
  cn: string;
  level: 1 | 2 | 3 | 4 | 5;
  color: 'volt' | 'cyan' | 'pink' | 'plum';
  icon: string;
  description: string;
  tools: PackTool[];
}

/* ====================================================================
   PACK 1 — AUDIO VISUALIZER (基础 L1)  4 件
==================================================================== */
export const AudioWaveform = () => (
  <DemoFrame title="Audio Waveform" pack="Audio" level={1} tags={['wave', 'svg', 'oscilloscope']}>
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {Array.from({ length: 60 }).map((_, i) => {
        const h = 10 + Math.abs(Math.sin(i * 0.4 + Date.now() / 200) * 80) + Math.random() * 10;
        return <rect key={i} x={i * 6 + 4} y={100 - h / 2} width="3" height={h} fill="#f0ff00" />;
      })}
    </svg>
  </DemoFrame>
);

export const AudioBars = () => (
  <DemoFrame title="Audio Bars" pack="Audio" level={1} tags={['bars', 'eq', 'rhythm']}>
    <div className="w-full h-full flex items-end justify-center gap-1 p-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="flex-1 bg-cyan"
          style={{ height: `${20 + Math.abs(Math.sin(i * 0.5 + Date.now() / 300) * 70)}%` }} />
      ))}
    </div>
  </DemoFrame>
);

export const AudioCircular = () => (
  <DemoFrame title="Audio Circular" pack="Audio" level={1} tags={['circular', 'radial']}>
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-32 h-32">
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r = 60 + Math.abs(Math.sin(i * 0.3 + Date.now() / 250) * 20);
          return (
            <line key={i}
              x1={100 + Math.cos(a) * 60} y1={100 + Math.sin(a) * 60}
              x2={100 + Math.cos(a) * r} y2={100 + Math.sin(a) * r}
              stroke="#ff3da5" strokeWidth="2" />
          );
        })}
      </svg>
    </div>
  </DemoFrame>
);

export const AudioParticle = () => (
  <DemoFrame title="Audio Particle" pack="Audio" level={1} tags={['particle', 'reactive']}>
    <div className="w-full h-full relative">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-volt rounded-full"
          style={{
            left: `${(i * 13 + Date.now() / 30) % 100}%`,
            top: `${50 + Math.sin(i + Date.now() / 200) * 40}%`,
            opacity: 0.4 + (i % 5) * 0.1,
          }} />
      ))}
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 2 — KINETIC TYPOGRAPHY (中等 L2)  5 件
==================================================================== */
export const TypeGlitch = () => (
  <DemoFrame title="Glitch Type" pack="Kinetic" level={2} tags={['glitch', 'rgb', 'hover']}>
    <div className="w-full h-full flex items-center justify-center text-5xl font-display font-black relative">
      <span className="absolute text-pink" style={{ transform: 'translate(2px,0)' }}>GLITCH</span>
      <span className="absolute text-cyan" style={{ transform: 'translate(-2px,0)' }}>GLITCH</span>
      <span className="relative z-10">GLITCH</span>
    </div>
  </DemoFrame>
);

export const TypeWave = () => (
  <DemoFrame title="Wave Type" pack="Kinetic" level={2} tags={['wave', 'sine', 'path']}>
    <div className="w-full h-full flex items-center justify-center">
      {['W', 'A', 'V', 'E'].map((c, i) => (
        <span key={i} className="text-6xl font-display font-black text-volt"
          style={{ transform: `translateY(${Math.sin(i + Date.now() / 300) * 8}px)` }}>
          {c}
        </span>
      ))}
    </div>
  </DemoFrame>
);

export const TypeBounce = () => (
  <DemoFrame title="Bounce Type" pack="Kinetic" level={2} tags={['bounce', 'spring', 'loop']}>
    <div className="w-full h-full flex items-end justify-center pb-12">
      {['B', 'O', 'U', 'N', 'C', 'E'].map((c, i) => (
        <span key={i} className="text-3xl font-display font-black text-cyan mx-1"
          style={{ animation: `bounce 1s ${i * 0.1}s ease-in-out infinite` }}>
          {c}
        </span>
      ))}
    </div>
    <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }`}</style>
  </DemoFrame>
);

export const TypeRotate3D = () => (
  <DemoFrame title="3D Rotate Type" pack="Kinetic" level={2} tags={['3d', 'rotate', 'perspective']}>
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: 600 }}>
      <div className="text-5xl font-display font-black text-pink"
        style={{ transform: `rotateY(${Date.now() / 20}deg)`, transformStyle: 'preserve-3d' }}>
        3D
      </div>
    </div>
  </DemoFrame>
);

export const TypeLiquid = () => (
  <DemoFrame title="Liquid Type" pack="Kinetic" level={2} tags={['liquid', 'morph', 'blob']}>
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 100" className="w-3/4">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0ff00" />
            <stop offset="100%" stopColor="#ff3da5" />
          </linearGradient>
        </defs>
        <path fill="url(#lg)"
          d={`M 10 50 Q ${50 + Math.sin(Date.now() / 400) * 30} ${20 + Math.cos(Date.now() / 400) * 20} 100 50 T 190 50`}
          stroke="#fff" strokeWidth="1" />
        <text x="100" y="55" textAnchor="middle" fill="#000" fontSize="20" fontWeight="900" fontFamily="monospace">LIQUID</text>
      </svg>
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 3 — 3D DEPTH (精细 L3)  4 件
==================================================================== */
export const Depth3DCard = () => (
  <DemoFrame title="3D Card" pack="Depth" level={3} tags={['tilt', 'mouse', 'perspective']}>
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: 800 }}>
      <div className="w-32 h-40 bg-gradient-to-br from-cyan to-pink border-2 border-bone shadow-2xl flex items-center justify-center font-display font-black text-2xl text-ink"
        style={{ transform: 'rotateX(15deg) rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
        DEPTH
      </div>
    </div>
  </DemoFrame>
);

export const DepthParallax = () => (
  <DemoFrame title="Parallax" pack="Depth" level={3} tags={['parallax', 'layers', 'depth']}>
    <div className="w-full h-full relative flex items-center justify-center">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute w-24 h-24 border-2 border-bone"
          style={{
            background: i % 2 ? '#ff3da5' : '#00e5ff',
            transform: `translate(${(i - 1.5) * 20}px, ${(i - 1.5) * 20}px)`,
            opacity: 0.4 + i * 0.15,
          }} />
      ))}
    </div>
  </DemoFrame>
);

export const DepthTilt = () => (
  <DemoFrame title="Tilt Surface" pack="Depth" level={3} tags={['tilt', 'rotate', 'surface']}>
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-40 grid grid-cols-3 gap-1"
        style={{ transform: 'rotateX(45deg) rotateZ(-10deg)', transformStyle: 'preserve-3d' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-volt/40 border border-volt" style={{ transform: `translateZ(${(i % 3) * 10}px)` }} />
        ))}
      </div>
    </div>
  </DemoFrame>
);

export const DepthLayers = () => (
  <DemoFrame title="Layered Card" pack="Depth" level={3} tags={['stacked', 'layers', 'paper']}>
    <div className="w-full h-full flex items-center justify-center">
      {[
        { c: '#f0ff00', r: -10, y: 10 },
        { c: '#ff3da5', r: -5, y: 5 },
        { c: '#00e5ff', r: 0, y: 0 },
      ].map((s, i) => (
        <div key={i} className="absolute w-28 h-36 border-2 border-bone shadow-xl"
          style={{ background: s.c, transform: `rotate(${s.r}deg) translateY(${s.y}px)` }} />
      ))}
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 4 — COLOR THEORY (精细 L3)  5 件
==================================================================== */
export const ColorWheel = () => (
  <DemoFrame title="Color Wheel" pack="Color" level={3} tags={['hsl', 'wheel', 'hue']}>
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full"
        style={{ background: 'conic-gradient(#f0ff00,#ff3da5,#00e5ff,#9b00ff,#f0ff00)' }} />
    </div>
  </DemoFrame>
);

export const ColorHarmony = () => (
  <DemoFrame title="Color Harmony" pack="Color" level={3} tags={['complementary', 'triadic']}>
    <div className="w-full h-full grid grid-cols-3 gap-1 p-4">
      <div className="bg-[#f0ff00]" />
      <div className="bg-[#ff3da5]" />
      <div className="bg-[#00e5ff]" />
    </div>
  </DemoFrame>
);

export const ColorGradient = () => (
  <DemoFrame title="Gradient Map" pack="Color" level={3} tags={['gradient', 'interpolate']}>
    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#f0ff00 0%,#ff3da5 50%,#00e5ff 100%)' }} />
  </DemoFrame>
);

export const ColorMixer = () => (
  <DemoFrame title="Color Mixer" pack="Color" level={3} tags={['mix', 'blend', 'rgb']}>
    <div className="w-full h-full grid grid-cols-2">
      <div className="bg-[#ff3da5] mix-blend-screen" />
      <div className="bg-[#00e5ff] mix-blend-screen" />
      <div className="bg-[#f0ff00] mix-blend-screen" />
      <div className="bg-[#9b00ff] mix-blend-screen" />
    </div>
  </DemoFrame>
);

export const ColorPalette = () => (
  <DemoFrame title="Palette Gen" pack="Color" level={3} tags={['palette', 'generator']}>
    <div className="w-full h-full grid grid-cols-5">
      {['#0a0a0a', '#f0ff00', '#ff3da5', '#00e5ff', '#9b00ff'].map(c => (
        <div key={c} className="flex flex-col items-center justify-end p-1 text-[8px]"
          style={{ background: c, color: parseInt(c.slice(1), 16) > 0x808080 ? '#000' : '#fff' }}>
          {c}
        </div>
      ))}
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 5 — LAYOUT LAB (高级 L4)  5 件
==================================================================== */
export const LayoutMasonry = () => (
  <DemoFrame title="Masonry" pack="Layout" level={4} tags={['masonry', 'grid', 'pinterest']}
    detail="瀑布流布局：每列高度自适应，常用于图片墙、灵感板">
    <div className="w-full h-full p-3 grid grid-cols-3 gap-2 content-start overflow-hidden">
      {[40, 60, 30, 50, 70, 35, 55, 45, 65].map((h, i) => (
        <div key={i} className="border border-bone/40" style={{ height: `${h}%`, background: ['#f0ff00','#ff3da5','#00e5ff','#9b00ff'][i % 4] }} />
      ))}
    </div>
  </DemoFrame>
);

export const LayoutBento = () => (
  <DemoFrame title="Bento Grid" pack="Layout" level={4} tags={['bento', 'apple', 'asymmetric']}
    detail="便当盒布局：大小不等的网格，Apple 风格信息密度">
    <div className="w-full h-full p-2 grid grid-cols-4 grid-rows-4 gap-1">
      <div className="col-span-2 row-span-2 bg-volt" />
      <div className="col-span-1 row-span-1 bg-pink" />
      <div className="col-span-1 row-span-1 bg-cyan" />
      <div className="col-span-1 row-span-2 bg-plum" />
      <div className="col-span-1 row-span-1 bg-bone" />
      <div className="col-span-1 row-span-1 bg-ink border border-bone" />
      <div className="col-span-2 row-span-1 bg-pink" />
      <div className="col-span-2 row-span-1 bg-cyan" />
    </div>
  </DemoFrame>
);

export const LayoutAsymmetric = () => (
  <DemoFrame title="Asymmetric" pack="Layout" level={4} tags={['asymmetric', 'editorial']}
    detail="非对称排版：杂志感、视觉张力强">
    <div className="w-full h-full p-2 grid grid-cols-5 grid-rows-3 gap-1">
      <div className="col-span-3 row-span-3 bg-volt" />
      <div className="col-span-2 row-span-1 bg-pink" />
      <div className="col-span-2 row-span-2 bg-cyan" />
    </div>
  </DemoFrame>
);

export const LayoutMagazine = () => (
  <DemoFrame title="Magazine" pack="Layout" level={4} tags={['magazine', 'columns', 'text']}
    detail="杂志多栏：文本 + 大图 + 跨栏标题">
    <div className="w-full h-full p-3 grid grid-cols-12 gap-2">
      <div className="col-span-12 row-span-1 bg-bone text-ink flex items-center px-2 font-display font-black text-lg">TITLE</div>
      <div className="col-span-5 row-span-3 bg-pink" />
      <div className="col-span-7 row-span-3 bg-ink border border-bone/40 p-2 text-[8px] leading-tight">
        Lorem ipsum dolor sit amet consectetur. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
      </div>
    </div>
  </DemoFrame>
);

export const LayoutIso = () => (
  <DemoFrame title="Isometric" pack="Layout" level={4} tags={['isometric', '30deg', 'depth']}
    detail="等距投影：30°/30° 倾角，营造立体场景">
    <div className="w-full h-full flex items-center justify-center">
      {[0, 1, 2].map(row => [0, 1, 2].map(col => (
        <div key={`${row}-${col}`} className="absolute w-16 h-16 border-2 border-bone"
          style={{
            background: ['#f0ff00', '#ff3da5', '#00e5ff'][col],
            transform: `translate(${(col - row) * 32}px, ${(col + row) * 16}px) rotate(-30deg) skewX(30deg)`,
            opacity: 0.7,
          }} />
      )))}
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 6 — MOTION CHOREOGRAPHY (高级 L4)  5 件
==================================================================== */
export const MotionStagger = () => (
  <DemoFrame title="Stagger" pack="Motion" level={4} tags={['stagger', 'sequence', 'delay']}
    detail="错位动画：每个元素带递增 delay，形成序列感">
    <div className="w-full h-full flex items-center justify-center gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-8 h-8 bg-volt"
          style={{ animation: `stg 1s ${i * 0.1}s ease-in-out infinite alternate` }} />
      ))}
    </div>
    <style>{`@keyframes stg { from{transform:translateY(-30px)} to{transform:translateY(30px)} }`}</style>
  </DemoFrame>
);

export const MotionSpring = () => (
  <DemoFrame title="Spring" pack="Motion" level={4} tags={['spring', 'elastic', 'bounce']}
    detail="弹簧物理：cubic-bezier(0.68,-0.55,0.27,1.55)">
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 bg-pink rounded-full"
        style={{ animation: 'spring 2s ease-in-out infinite' }} />
    </div>
    <style>{`@keyframes spring { 0%{transform:scale(0.5)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }`}</style>
  </DemoFrame>
);

export const MotionMorph = () => (
  <DemoFrame title="Morph" pack="Motion" level={4} tags={['morph', 'path', 'shape']}
    detail="形变动画：path 的 d 属性平滑插值">
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <path fill="#f0ff00"
          d={Math.sin(Date.now() / 500) > 0
            ? 'M 10 50 Q 50 10 90 50 Q 50 90 10 50'
            : 'M 50 10 L 90 50 L 50 90 L 10 50 Z'} />
      </svg>
    </div>
  </DemoFrame>
);

export const MotionEasing = () => (
  <DemoFrame title="Easing Curves" pack="Motion" level={4} tags={['easing', 'cubic-bezier']}
    detail="缓动曲线对比：linear / ease-in / ease-out / custom">
    <div className="w-full h-full p-3 flex flex-col justify-end gap-2 text-[8px] font-mono">
      {[
        { name: 'linear', fn: 'linear' },
        { name: 'ease-in', fn: 'cubic-bezier(0.42,0,1,1)' },
        { name: 'ease-out', fn: 'cubic-bezier(0,0,0.58,1)' },
        { name: 'bounce', fn: 'cubic-bezier(0.68,-0.55,0.27,1.55)' },
      ].map((e, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-12 text-cyan">{e.name}</span>
          <div className="flex-1 h-3 bg-bone/20 overflow-hidden">
            <div className="h-full w-1/3 bg-volt"
              style={{ animation: `ease ${1 + i * 0.2}s ${e.fn} infinite alternate` }} />
          </div>
        </div>
      ))}
    </div>
    <style>{`@keyframes ease { from{transform:translateX(0)} to{transform:translateX(200%)} }`}</style>
  </DemoFrame>
);

export const MotionPath = () => (
  <DemoFrame title="Path Motion" pack="Motion" level={4} tags={['path', 'offset-path', 'motion']}
    detail="沿路径运动：offset-path 让元素沿 SVG 路径移动">
    <div className="w-full h-full relative">
      <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
        <path d="M 20 80 Q 100 0 180 80" stroke="#ff3da5" strokeWidth="1" fill="none" strokeDasharray="3,3" />
      </svg>
      <div className="absolute w-3 h-3 bg-cyan rounded-full"
        style={{
          offsetPath: 'path("M 20 80 Q 100 0 180 80")',
          animation: 'pathmove 3s linear infinite',
        }} />
    </div>
    <style>{`@keyframes pathmove { from{offset-distance:0%} to{offset-distance:100%} }`}</style>
  </DemoFrame>
);

/* ====================================================================
   PACK 7 — MICROINTERACTION (顶级 L5)  5 件
==================================================================== */
export const MicroButton = () => (
  <DemoFrame title="Button States" pack="Micro" level={5} tags={['button', 'state', 'press']}
    detail="按钮五态：default / hover / active / focus / disabled">
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <button className="px-4 py-2 bg-volt text-ink font-bold text-xs hover:scale-105 active:scale-95 transition">CLICK ME</button>
        <div className="flex gap-1 text-[8px] font-mono">
          <span className="px-1.5 py-0.5 border border-bone/40">:hover</span>
          <span className="px-1.5 py-0.5 border border-bone/40">:active</span>
          <span className="px-1.5 py-0.5 border border-bone/40">:focus</span>
        </div>
      </div>
    </div>
  </DemoFrame>
);

export const MicroToggle = () => {
  const [on, setOn] = useState(false);
  return (
    <DemoFrame title="Toggle" pack="Micro" level={5} tags={['toggle', 'switch', 'state']}
      detail="开关：滑动指示器 + 颜色反转 + 弹性">
      <div className="w-full h-full flex items-center justify-center">
        <button onClick={() => setOn(!on)}
          className="relative w-16 h-8 border-2 border-bone transition-colors"
          style={{ background: on ? '#f0ff00' : '#333' }}>
          <div className="absolute top-0 bottom-0 w-7 bg-bone border border-ink transition-all"
            style={{ left: on ? 'calc(100% - 1.75rem)' : 0, background: on ? '#0a0a0a' : '#f5f1e8' }} />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold"
            style={{ color: on ? '#0a0a0a' : '#f5f1e8' }}>{on ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </DemoFrame>
  );
};

export const MicroDrag = () => (
  <DemoFrame title="Drag Handle" pack="Micro" level={5} tags={['drag', 'grab', 'cursor']}
    detail="拖拽手柄：cursor: grab + 阴影 + 倾斜反馈">
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-16 bg-ink border-2 border-bone shadow-2xl flex items-center justify-center font-mono text-[10px] cursor-grab active:cursor-grabbing"
        style={{ transform: 'rotate(-2deg)' }}>
        ≡ DRAG ME
      </div>
    </div>
  </DemoFrame>
);

export const MicroHover = () => (
  <DemoFrame title="Hover Lift" pack="Micro" level={5} tags={['hover', 'lift', 'shadow']}
    detail="悬停抬升：translateY + shadow + 边框颜色">
    <div className="w-full h-full flex items-center justify-center gap-2">
      {['#f0ff00', '#ff3da5', '#00e5ff'].map(c => (
        <div key={c} className="w-12 h-12 border-2 border-bone transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
          style={{ background: c }} />
      ))}
    </div>
  </DemoFrame>
);

export const MicroFocus = () => (
  <DemoFrame title="Focus Ring" pack="Micro" level={5} tags={['focus', 'a11y', 'keyboard']}
    detail="焦点环：无障碍键盘导航的可视反馈">
    <div className="w-full h-full flex items-center justify-center gap-2">
      {['A', 'B', 'C'].map((c, i) => (
        <button key={c} className="w-10 h-10 bg-ink border-2 border-bone/40 text-bone font-bold focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/50">
          {c}
        </button>
      ))}
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK 8 — GENERATIVE PATTERN (顶级 L5)  5 件
==================================================================== */
export const PatternTruchet = () => (
  <DemoFrame title="Truchet Tiles" pack="Pattern" level={5} tags={['truchet', 'tile', 'procedural']}
    detail="Truchet 拼砖：每块 1/4 圆弧，组合成有机曲线">
    <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0 p-2">
      {Array.from({ length: 64 }).map((_, i) => {
        const r = [0, 90, 180, 270][i % 4];
        return <div key={i} className="border border-bone/20 relative overflow-hidden"
          style={{ transform: `rotate(${r}deg)` }}>
          <div className="absolute inset-0 border-t-2 border-r-2 border-volt rounded-tr-full" />
          <div className="absolute inset-0 border-b-2 border-l-2 border-pink rounded-bl-full" />
        </div>;
      })}
    </div>
  </DemoFrame>
);

export const PatternVoronoi = () => (
  <DemoFrame title="Voronoi" pack="Pattern" level={5} tags={['voronoi', 'cell', 'organic']}
    detail="Voronoi 图：根据种子点生成的不规则细胞图案">
    <div className="w-full h-full" style={{
      background: `radial-gradient(circle at 20% 30%, #f0ff00 0%, transparent 20%),
                   radial-gradient(circle at 70% 60%, #ff3da5 0%, transparent 25%),
                   radial-gradient(circle at 40% 80%, #00e5ff 0%, transparent 18%),
                   radial-gradient(circle at 85% 20%, #9b00ff 0%, transparent 22%),
                   #0a0a0a`,
    }} />
  </DemoFrame>
);

export const PatternIso = () => (
  <DemoFrame title="Iso Grid" pack="Pattern" level={5} tags={['iso', '30deg', 'rhombus']}
    detail="等距网格：30° 倾角线条，工业感">
    <div className="w-full h-full" style={{
      background: `repeating-linear-gradient(60deg, transparent, transparent 20px, #f0ff00 20px, #f0ff00 21px),
                   repeating-linear-gradient(-60deg, transparent, transparent 20px, #ff3da5 20px, #ff3da5 21px),
                   #0a0a0a`,
    }} />
  </DemoFrame>
);

export const PatternHalftone = () => (
  <DemoFrame title="Halftone" pack="Pattern" level={5} tags={['halftone', 'dot', 'print']}
    detail="半色调：大小渐变的圆点模拟灰度">
    <div className="w-full h-full" style={{
      background: `radial-gradient(circle, #f0ff00 2px, transparent 2.5px) 0 0 / 8px 8px,
                   radial-gradient(circle at 50% 50%, #f0ff00 0%, transparent 30%) center / 100% 100% #0a0a0a`,
    }} />
  </DemoFrame>
);

export const PatternBauhaus = () => (
  <DemoFrame title="Bauhaus" pack="Pattern" level={5} tags={['bauhaus', 'geometric', 'primary']}
    detail="包豪斯：原色 + 几何形状，1920 风格">
    <div className="w-full h-full relative">
      <div className="absolute top-2 left-2 w-16 h-16 bg-volt rounded-full" />
      <div className="absolute top-4 right-4 w-20 h-12 bg-pink" />
      <div className="absolute bottom-2 left-4 w-24 h-8 bg-cyan" />
      <div className="absolute bottom-4 right-2 w-12 h-12 bg-plum rotate-45" />
      <div className="absolute top-1/2 left-1/2 w-1 h-32 bg-bone -translate-x-1/2" />
    </div>
  </DemoFrame>
);

/* ====================================================================
   PACK INDEX - 全部导出
==================================================================== */
export const PACKS: Pack[] = [
  {
    id: 'audio',
    name: 'Audio Visualizer',
    cn: '音频可视化',
    level: 1,
    color: 'volt',
    icon: '◉',
    description: '声音的视觉化呈现。波形、频谱、粒子。',
    tools: [
      { slug: 'audio-waveform', name: 'Audio Waveform', Preview: AudioWaveform },
      { slug: 'audio-bars', name: 'Audio Bars', Preview: AudioBars },
      { slug: 'audio-circular', name: 'Audio Circular', Preview: AudioCircular },
      { slug: 'audio-particle', name: 'Audio Particle', Preview: AudioParticle },
    ],
  },
  {
    id: 'kinetic',
    name: 'Kinetic Typography',
    cn: '动态字体',
    level: 2,
    color: 'cyan',
    icon: '✎',
    description: '让文字动起来。波动、抖动、3D、液态。',
    tools: [
      { slug: 'type-glitch', name: 'Glitch Type', Preview: TypeGlitch },
      { slug: 'type-wave', name: 'Wave Type', Preview: TypeWave },
      { slug: 'type-bounce', name: 'Bounce Type', Preview: TypeBounce },
      { slug: 'type-rotate3d', name: '3D Rotate Type', Preview: TypeRotate3D },
      { slug: 'type-liquid', name: 'Liquid Type', Preview: TypeLiquid },
    ],
  },
  {
    id: 'depth',
    name: '3D Depth',
    cn: '三维纵深',
    level: 3,
    color: 'pink',
    icon: '◇',
    description: '在二维屏幕上营造三维纵深。倾斜、视差、堆叠。',
    tools: [
      { slug: 'depth-3dcard', name: '3D Card', Preview: Depth3DCard },
      { slug: 'depth-parallax', name: 'Parallax', Preview: DepthParallax },
      { slug: 'depth-tilt', name: 'Tilt Surface', Preview: DepthTilt },
      { slug: 'depth-layers', name: 'Layered Card', Preview: DepthLayers },
    ],
  },
  {
    id: 'color',
    name: 'Color Theory',
    cn: '色彩理论',
    level: 3,
    color: 'volt',
    icon: '◐',
    description: '色彩搭配与生成。色环、和谐、混合。',
    tools: [
      { slug: 'color-wheel', name: 'Color Wheel', Preview: ColorWheel },
      { slug: 'color-harmony', name: 'Color Harmony', Preview: ColorHarmony },
      { slug: 'color-gradient', name: 'Gradient Map', Preview: ColorGradient },
      { slug: 'color-mixer', name: 'Color Mixer', Preview: ColorMixer },
      { slug: 'color-palette', name: 'Palette Gen', Preview: ColorPalette },
    ],
  },
  {
    id: 'layout',
    name: 'Layout Lab',
    cn: '版式实验室',
    level: 4,
    color: 'cyan',
    icon: '▦',
    description: '五种高密度版式。瀑布、便当、非对称、杂志、等距。',
    tools: [
      { slug: 'layout-masonry', name: 'Masonry', Preview: LayoutMasonry },
      { slug: 'layout-bento', name: 'Bento Grid', Preview: LayoutBento },
      { slug: 'layout-asymmetric', name: 'Asymmetric', Preview: LayoutAsymmetric },
      { slug: 'layout-magazine', name: 'Magazine', Preview: LayoutMagazine },
      { slug: 'layout-iso', name: 'Isometric', Preview: LayoutIso },
    ],
  },
  {
    id: 'motion',
    name: 'Motion Choreography',
    cn: '动效编排',
    level: 4,
    color: 'pink',
    icon: '↯',
    description: '动画的节奏与编排。错位、弹簧、形变、缓动、路径。',
    tools: [
      { slug: 'motion-stagger', name: 'Stagger', Preview: MotionStagger },
      { slug: 'motion-spring', name: 'Spring', Preview: MotionSpring },
      { slug: 'motion-morph', name: 'Morph', Preview: MotionMorph },
      { slug: 'motion-easing', name: 'Easing Curves', Preview: MotionEasing },
      { slug: 'motion-path', name: 'Path Motion', Preview: MotionPath },
    ],
  },
  {
    id: 'micro',
    name: 'Microinteraction',
    cn: '微交互',
    level: 5,
    color: 'plum',
    icon: '◈',
    description: '细节里的魔鬼。按钮、开关、拖拽、悬停、焦点。',
    tools: [
      { slug: 'micro-button', name: 'Button States', Preview: MicroButton },
      { slug: 'micro-toggle', name: 'Toggle', Preview: MicroToggle },
      { slug: 'micro-drag', name: 'Drag Handle', Preview: MicroDrag },
      { slug: 'micro-hover', name: 'Hover Lift', Preview: MicroHover },
      { slug: 'micro-focus', name: 'Focus Ring', Preview: MicroFocus },
    ],
  },
  {
    id: 'pattern',
    name: 'Generative Pattern',
    cn: '生成图案',
    level: 5,
    color: 'volt',
    icon: '⬡',
    description: '算法生成的有机图案。Truchet、Voronoi、包豪斯。',
    tools: [
      { slug: 'pattern-truchet', name: 'Truchet Tiles', Preview: PatternTruchet },
      { slug: 'pattern-voronoi', name: 'Voronoi', Preview: PatternVoronoi },
      { slug: 'pattern-iso', name: 'Iso Grid', Preview: PatternIso },
      { slug: 'pattern-halftone', name: 'Halftone', Preview: PatternHalftone },
      { slug: 'pattern-bauhaus', name: 'Bauhaus', Preview: PatternBauhaus },
    ],
  },
];

export const PACK_TOOLS: PackTool[] = PACKS.flatMap(p => p.tools);
