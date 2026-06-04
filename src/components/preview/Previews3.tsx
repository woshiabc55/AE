import { useEffect, useRef, useState } from 'react';

/* ============ EXTRA VISUAL ============ */

export function GooeyFilter() {
  return (
    <div className="w-full h-full relative bg-ink overflow-hidden flex items-center justify-center">
      <svg width="0" height="0"><filter id="goo"><feGaussianBlur stdDeviation="6" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" /></filter></svg>
      <div className="relative" style={{ filter: 'url(#goo)' }}>
        <div className="w-20 h-20 rounded-full bg-volt absolute -translate-x-8" />
        <div className="w-20 h-20 rounded-full bg-pink absolute translate-x-8" />
        <div className="w-20 h-20 rounded-full bg-cyan absolute" style={{ marginTop: '40px' }} />
      </div>
      <div className="absolute bottom-4 font-mono text-[10px] text-bone/40">SVG GOOEY FILTER</div>
    </div>
  );
}

export function KineticText() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="text-center">
        <div className="font-display font-black text-5xl text-bone">KINETIC</div>
        <div className="font-mono text-volt text-sm mt-2">type in motion</div>
      </div>
    </div>
  );
}

export function BrickWall() {
  return (
    <div className="w-full h-full p-3" style={{
      background: '#0a0a0a',
      backgroundImage: `
        linear-gradient(335deg, #f0ff00 23%, transparent 23%),
        linear-gradient(155deg, #f0ff00 23%, transparent 23%),
        linear-gradient(335deg, transparent 67%, #f0ff00 67%),
        linear-gradient(155deg, transparent 67%, #f0ff00 67%)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 0, 10px -10px, 0 10px',
    }}>
      <div className="w-full h-full flex items-center justify-center font-display font-black text-3xl text-ink bg-bone/80">BRICK</div>
    </div>
  );
}

export function SplitFlap() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="font-mono font-black text-7xl text-volt flex gap-1">
        {['S','K','I','L','L'].map((c, i) => (
          <div key={i} className="w-14 h-20 bg-bone border-2 border-bone flex items-center justify-center text-ink" style={{ animation: `flip ${1+i*0.2}s ease-in-out infinite` }}>
            {c}
          </div>
        ))}
      </div>
      <style>{`@keyframes flip { 0%,90%,100%{transform:rotateX(0)} 95%{transform:rotateX(90deg)} }`}</style>
    </div>
  );
}

/* ============ EXTRA INTERACTION ============ */

export function SwipeCards() {
  const [idx, setIdx] = useState(0);
  const cards = ['A', 'B', 'C', 'D'];
  return (
    <div className="w-full h-full bg-gradient-to-br from-pink to-cyan flex items-center justify-center relative">
      {cards.map((c, i) => {
        const off = i - idx;
        return (
          <div key={i} className="absolute w-32 h-44 bg-ink text-bone flex items-center justify-center font-display font-black text-5xl border-2 border-bone shadow-2xl transition-all duration-300"
            style={{
              transform: `translateX(${off * 20}px) translateY(${Math.abs(off) * 10}px) rotate(${off * 5}deg)`,
              zIndex: cards.length - Math.abs(off),
              opacity: Math.abs(off) > 2 ? 0 : 1,
            }}>
            {c}
          </div>
        );
      })}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        <button onClick={() => setIdx(i => Math.max(0, i-1))} className="px-3 py-1 bg-bone text-ink font-mono text-xs">‹ PREV</button>
        <button onClick={() => setIdx(i => Math.min(cards.length-1, i+1))} className="px-3 py-1 bg-bone text-ink font-mono text-xs">NEXT ›</button>
      </div>
    </div>
  );
}

export function Hover3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({x: 0, y: 0});
  return (
    <div ref={ref} className="w-full h-full bg-ink flex items-center justify-center"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setT({ x: ((e.clientX - r.left) / r.width - 0.5) * 30, y: ((e.clientY - r.top) / r.height - 0.5) * -30 });
      }}
      onMouseLeave={() => setT({x:0,y:0})}
    >
      <div className="w-40 h-56 bg-volt text-ink flex items-center justify-center font-display font-black text-2xl" style={{ transform: `perspective(800px) rotateY(${t.x}deg) rotateX(${t.y}deg)`, transition: 'transform 0.1s' }}>
        HOVER
      </div>
    </div>
  );
}

/* ============ EXTRA ANIMATION ============ */

export function Heartbeat() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="text-7xl text-pink" style={{ animation: 'hb 1.2s ease-in-out infinite' }}>♥</div>
      <style>{`@keyframes hb { 0%,100%{transform:scale(1)} 20%{transform:scale(1.2)} 40%{transform:scale(0.95)} 60%{transform:scale(1.1)} 80%{transform:scale(0.98)} }`}</style>
    </div>
  );
}

export function Rain() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-ink">
      {Array.from({length: 30}).map((_, i) => (
        <div key={i} className="absolute w-0.5 h-8 bg-cyan" style={{
          left: `${(i*37)%100}%`,
          top: '-20%',
          animation: `rain ${0.5 + (i%5)*0.2}s linear ${i*0.05}s infinite`,
        }} />
      ))}
      <style>{`@keyframes rain { to { transform: translateY(120vh); } }`}</style>
    </div>
  );
}

export function Strobe() {
  const [on, setOn] = useState(true);
  return (
    <div className="w-full h-full relative cursor-pointer" style={{ background: on ? '#f0ff00' : '#0a0a0a' }} onClick={() => setOn(p => !p)}>
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-6xl" style={{ color: on ? '#0a0a0a' : '#f0ff00' }}>CLICK</div>
    </div>
  );
}

/* ============ EXTRA GENERATOR ============ */

export function LoremGen() {
  const words = ['锻造','工坊','像素','字形','动效','玻璃','噪点','网格','渐变','质感','粗细','倾斜','彩色','对比','层次','节奏','呼吸'];
  return (
    <div className="w-full h-full bg-bone p-3 text-ink">
      <div className="font-mono text-[10px] mb-2">// LOREM 2 SENT</div>
      <div className="text-sm leading-relaxed">
        {Array.from({length: 18}).map((_, i) => (
          <span key={i} className="mr-1">
            {words[Math.floor(Math.random()*words.length)]}
            {[',','.','—',';'][Math.floor(Math.random()*4)]}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}

export function NameGen() {
  const prefixes = ['思','幻','墨','光','影','空','镜','铁','灰','苍','幽','赤'];
  const middles = ['之','之','之','之','的','的','之','之'];
  const suffixes = ['焰','渊','海','风','沙','夜','翼','路','日','潮','心','痕'];
  return (
    <div className="w-full h-full bg-ink p-3 space-y-1">
      <div className="font-mono text-[10px] text-volt">// NAME GEN</div>
      {Array.from({length: 8}).map((_, i) => {
        const name = prefixes[Math.floor(Math.random()*prefixes.length)] + middles[Math.floor(Math.random()*middles.length)] + suffixes[Math.floor(Math.random()*suffixes.length)];
        return <div key={i} className="font-display font-black text-2xl text-bone">{name}</div>;
      })}
    </div>
  );
}

export function Waveform() {
  const [b, setB] = useState(Array(20).fill(50));
  useEffect(() => {
    const t = setInterval(() => setB(p => p.map(() => 10 + Math.random() * 90)), 100);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full h-full bg-ink p-3 flex items-end gap-1">
      {b.map((v, i) => (
        <div key={i} className="flex-1 transition-all duration-100" style={{ height: `${v}%`, background: i % 2 ? '#f0ff00' : '#00e5ff' }} />
      ))}
    </div>
  );
}

/* ============ EXTRA EXPERIMENT ============ */

export function HoloCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({x: 50, y: 50});
  return (
    <div ref={ref} className="w-full h-full relative overflow-hidden cursor-crosshair"
      style={{ background: `radial-gradient(circle at ${p.x}% ${p.y}%, #ff3da5, #00e5ff 50%, #0a0a0a)` }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-5xl text-white mix-blend-difference">HOLO</div>
    </div>
  );
}

export function PixelDissolve() {
  return (
    <div className="w-full h-full bg-ink grid grid-cols-12 gap-0.5 p-1">
      {Array.from({length: 144}).map((_, i) => (
        <div key={i} className="aspect-square" style={{
          background: ['#f0ff00','#ff3da5','#00e5ff','#f5f1e8'][i%4],
          animation: `dis ${1 + (i%5)*0.3}s ease-in-out infinite`,
          animationDelay: `${(i%30)*0.05}s`,
        }} />
      ))}
      <style>{`@keyframes dis { 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:0.2; transform:scale(0.5)} }`}</style>
    </div>
  );
}

export function LensDistort() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-ink to-pink/40 flex items-center justify-center">
      <div className="w-3/5 h-3/5 bg-volt" style={{
        animation: 'bulge 4s ease-in-out infinite',
        borderRadius: '40% 60% 50% 50% / 50% 50% 40% 60%',
      }} />
      <style>{`@keyframes bulge { 0%,100%{transform:scale(1) rotate(0)} 50%{transform:scale(1.3) rotate(20deg)} }`}</style>
    </div>
  );
}
