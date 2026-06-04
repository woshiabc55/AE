import { useEffect, useRef, useState } from 'react';

/* ============ VISUAL · 视觉 ============ */

export function Brackets() {
  return (
    <div className="w-full h-full bg-bone flex items-center justify-center gap-1 flex-wrap p-4">
      {['{','}','[',']','(',')','<','>','/','\\'].map((c, i) => (
        <span key={i} className="font-display font-black text-ink" style={{ fontSize: `${30 + (i%3)*10}px`, transform: `rotate(${(i%2 ? 6 : -6)}deg)`, color: ['#f0ff00','#ff3da5','#00e5ff','#0a0a0a'][i%4] }}>{c}</span>
      ))}
    </div>
  );
}

export function Conic() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0" style={{ background: 'conic-gradient(from 45deg, #f0ff00, #ff3da5, #00e5ff, #f0ff00, #f5f1e8, #f0ff00)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/5 h-3/5 rounded-full bg-ink flex items-center justify-center font-display font-black text-3xl text-bone">CONIC</div>
      </div>
    </div>
  );
}

export function Stripes() {
  return (
    <div className="w-full h-full" style={{
      backgroundImage: 'repeating-linear-gradient(45deg, #f0ff00 0 20px, #0a0a0a 20px 40px)',
    }}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="font-display font-black text-7xl text-bone italic">STRIPE</div>
      </div>
    </div>
  );
}

export function IsometricCard() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-ink to-cyan/30 flex items-center justify-center" style={{ perspective: 1000 }}>
      <div className="w-40 h-40 bg-pink relative" style={{ transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(0deg)', boxShadow: '20px 20px 0 #f0ff00, 20px 20px 0 1px #0a0a0a' }}>
        <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl text-ink">ISO</div>
      </div>
    </div>
  );
}

export function DottedGrid() {
  return (
    <div className="w-full h-full bg-bone p-3">
      <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #0a0a0a 1.5px, transparent 2px)', backgroundSize: '12px 12px' }} />
    </div>
  );
}

export function Checker() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #f0ff00 25%, transparent 25%), linear-gradient(-45deg, #f0ff00 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0a0a0a 75%), linear-gradient(-45deg, transparent 75%, #0a0a0a 75%)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0' }} />
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-4xl text-ink mix-blend-difference">CHECK</div>
    </div>
  );
}

export function SkewFrame() {
  return (
    <div className="w-full h-full bg-pink flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-ink" style={{ transform: 'skewX(-8deg)' }}>
        <div className="w-full h-full flex items-center justify-center" style={{ transform: 'skewX(8deg)' }}>
          <div className="font-display font-black text-3xl text-bone">SKEW</div>
        </div>
      </div>
    </div>
  );
}

export function DotsBubbles() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-cyan to-pink">
      {Array.from({length: 12}).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white/30" style={{
          width: 20 + (i%4)*15, height: 20 + (i%4)*15,
          left: `${(i*37)%100}%`, top: `${(i*53)%100}%`,
          animation: `floaty ${3+i%3}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`@keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }`}</style>
    </div>
  );
}

/* ============ INTERACTION · 交互 ============ */

export function RippleClick() {
  const [r, setR] = useState<{x:number,y:number,id:number}[]>([]);
  return (
    <div
      className="w-full h-full bg-ink relative overflow-hidden cursor-pointer"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setR(p => [...p, { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() }].slice(-10));
      }}
    >
      {r.map(rip => (
        <span key={rip.id} className="absolute rounded-full border-2 border-volt pointer-events-none" style={{
          left: rip.x - 10, top: rip.y - 10,
          animation: 'rip 0.6s ease-out forwards',
        }} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl text-bone">CLICK ↓</div>
      <style>{`@keyframes rip { to { transform: scale(20); opacity: 0; } }`}</style>
    </div>
  );
}

export function ToggleSwitch() {
  const [on, setOn] = useState(false);
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center gap-3">
      <div className="font-mono text-xs text-bone/60">OFF</div>
      <button
        onClick={() => setOn(!on)}
        className="w-16 h-8 border-2 border-bone flex items-center px-1 transition-colors"
        style={{ background: on ? '#f0ff00' : 'transparent', justifyContent: on ? 'flex-end' : 'flex-start' }}
      >
        <span className="w-5 h-5 bg-bone" />
      </button>
      <div className="font-mono text-xs" style={{ color: on ? '#f0ff00' : '#666' }}>ON</div>
    </div>
  );
}

export function ParallaxLayers() {
  const [x, setX] = useState(0);
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-pink to-cyan cursor-move"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setX(((e.clientX - r.left) / r.width - 0.5) * 30);
      }}
    >
      <div className="absolute inset-0" style={{ transform: `translateX(${x*0.5}px)`, fontSize: '120px', opacity: 0.3 }}>☁ ☁ ☁</div>
      <div className="absolute inset-0" style={{ transform: `translateX(${x*1}px)`, fontSize: '80px', opacity: 0.5 }}>☁ ☁</div>
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl text-ink">PARALLAX</div>
    </div>
  );
}

export function HoverSplats() {
  const [dots, setDots] = useState<{x:number,y:number,c:string}[]>([]);
  const colors = ['#f0ff00','#ff3da5','#00e5ff'];
  return (
    <div className="w-full h-full bg-bone relative overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        if (Math.random() > 0.85) setDots(p => [...p, { x: e.clientX - r.left, y: e.clientY - r.top, c: colors[Math.floor(Math.random()*3)] }].slice(-30));
      }}
    >
      {dots.map((d, i) => (
        <span key={i} className="absolute w-2 h-2 rounded-full" style={{ left: d.x, top: d.y, background: d.c }} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl text-ink">MOVE MOUSE</div>
    </div>
  );
}

export function DragReorder() {
  const [items, setItems] = useState(['A', 'B', 'C', 'D', 'E']);
  const drag = useRef<number | null>(null);
  return (
    <div className="w-full h-full bg-ink p-4 flex flex-col gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          onMouseDown={() => drag.current = i}
          onMouseUp={() => drag.current = null}
          onMouseEnter={() => {
            if (drag.current !== null && drag.current !== i) {
              const arr = [...items];
              const [m] = arr.splice(drag.current, 1);
              arr.splice(i, 0, m);
              setItems(arr);
              drag.current = i;
            }
          }}
          className="px-4 py-3 bg-volt text-ink font-display font-black text-2xl border-2 border-bone cursor-grab active:cursor-grabbing"
        >
          {it} · DRAG
        </div>
      ))}
    </div>
  );
}

/* ============ ANIMATION · 动画 ============ */

export function Confetti() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-ink via-pink to-cyan">
      {Array.from({length: 40}).map((_, i) => {
        const colors = ['#f0ff00','#ff3da5','#00e5ff','#f5f1e8'];
        return (
          <div key={i} className="absolute" style={{
            left: `${(i*13)%100}%`,
            top: '-10%',
            width: 6 + (i%3)*3,
            height: 10 + (i%3)*5,
            background: colors[i%4],
            animation: `fall ${2+(i%4)}s linear ${i*0.1}s infinite`,
            transform: `rotate(${i*30}deg)`,
          }} />
        );
      })}
      <style>{`@keyframes fall { to { transform: translateY(120vh) rotate(720deg); } }`}</style>
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-4xl text-bone">CONFETTI</div>
    </div>
  );
}

export function CircularText() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center relative">
      <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 animate-spin" style={{ animationDuration: '20s' }}>
        <defs>
          <path id="circle" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
        </defs>
        <text fill="#f0ff00" fontSize="14" fontWeight="900" fontFamily="monospace">
          <textPath href="#circle">★ CIRCULAR TEXT ★ LOOPING AROUND ★ </textPath>
        </text>
      </svg>
      <div className="absolute font-display font-black text-2xl text-bone">CIRC</div>
    </div>
  );
}

export function BouncingLetters() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="flex font-display font-black text-5xl text-bone">
        {'BOUNCE'.split('').map((c, i) => (
          <span key={i} style={{ animation: `b 0.8s ease-in-out ${i*0.08}s infinite alternate` }}>{c}</span>
        ))}
      </div>
      <style>{`@keyframes b { from { transform: translateY(0); } to { transform: translateY(-20px); color: #f0ff00; } }`}</style>
    </div>
  );
}

export function ProgressRing() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setV(p => (p + 5) % 105), 80);
    return () => clearInterval(t);
  }, []);
  const r = 40;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(v, 100) / 100) * c;
  return (
    <div className="w-full h-full bg-ink flex flex-col items-center justify-center">
      <svg width="120" height="120">
        <circle cx="60" cy="60" r={r} stroke="#333" strokeWidth="8" fill="none" />
        <circle cx="60" cy="60" r={r} stroke="#f0ff00" strokeWidth="8" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="butt"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.1s' }} />
        <text x="60" y="68" textAnchor="middle" fill="#f5f1e8" fontSize="22" fontWeight="900" fontFamily="monospace">{Math.min(v, 100)}%</text>
      </svg>
      <div className="font-mono text-xs text-bone/60 mt-2">PROGRESS RING</div>
    </div>
  );
}

export function Spinner3D() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center" style={{ perspective: 800 }}>
      <div className="w-16 h-16 border-4 border-b border-volt" style={{ animation: 'sp 1s linear infinite', transformStyle: 'preserve-3d' }} />
      <style>{`@keyframes sp { to { transform: rotateY(360deg) rotateX(360deg); } }`}</style>
    </div>
  );
}

export function TypeAlong() {
  const text = 'Type, by, character';
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % (text.length + 4)), 150);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center font-mono text-2xl text-volt">
      {text.slice(0, i)}
      <span className="animate-pulse">_</span>
    </div>
  );
}

/* ============ GENERATOR · 生成器 ============ */

export function AvatarGen() {
  const faces = ['◠‿◠', 'ಠ_ಠ', '◕‿◕', '◑﹏◐', '◔_◔', '◉_◉', '✧_✧', '◐ω◑'];
  return (
    <div className="w-full h-full bg-bone p-3">
      <div className="grid grid-cols-4 gap-2 h-full">
        {Array.from({length: 12}).map((_, i) => {
          const c = ['#f0ff00','#ff3da5','#00e5ff','#0a0a0a'][i%4];
          return (
            <div key={i} className="flex items-center justify-center font-mono text-xl" style={{ background: c, color: c === '#0a0a0a' ? '#f5f1e8' : '#0a0a0a' }}>
              {faces[i%faces.length]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EmojiWall() {
  const e = ['🚀','💎','🔥','⚡','🌈','🍄','👾','🎯','🌊','⭐','🪐','🌙'];
  return (
    <div className="w-full h-full bg-ink p-2 grid grid-cols-6 grid-rows-2 gap-1">
      {Array.from({length: 24}).map((_, i) => (
        <div key={i} className="flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-default" style={{ background: `hsl(${(i*30)%360}, 60%, 30%)` }}>
          {e[i%e.length]}
        </div>
      ))}
    </div>
  );
}

export function PatternGen() {
  const [seed, setSeed] = useState(0);
  return (
    <div className="w-full h-full bg-ink p-3">
      <div className="grid grid-cols-8 gap-0.5 h-[calc(100%-2rem)]">
        {Array.from({length: 64}).map((_, i) => (
          <div key={`${seed}-${i}`} style={{ background: `hsl(${(i*37+seed*53)%360}, 70%, 50%)` }} />
        ))}
      </div>
      <button onClick={() => setSeed(s => s + 1)} className="w-full bg-volt text-ink font-mono text-xs py-1 mt-1">↻ GENERATE</button>
    </div>
  );
}

export function FontStack() {
  const stacks = [
    '"Fraunces", serif',
    '"Inter Tight", sans-serif',
    '"JetBrains Mono", monospace',
    'Georgia, serif',
    '"Courier New", monospace',
    'system-ui, sans-serif',
  ];
  return (
    <div className="w-full h-full bg-bone text-ink p-2 space-y-1 overflow-hidden">
      {stacks.map((s, i) => (
        <div key={i} className="text-sm leading-tight" style={{ fontFamily: s }}>
          <span className="text-[8px] font-mono opacity-50">{s}</span><br />
          The quick brown fox.
        </div>
      ))}
    </div>
  );
}

export function QrPattern() {
  return (
    <div className="w-full h-full bg-bone p-3 flex items-center justify-center">
      <div className="grid grid-cols-12 gap-0.5 w-32 h-32">
        {Array.from({length: 144}).map((_, i) => {
          const corner = (i < 36 && (i%12 < 3 || i%12 > 8 || (i < 12) || (i > 23 && i < 36)));
          return (
            <div key={i} className="bg-ink" style={{ opacity: corner || Math.random() > 0.5 ? 1 : 0 }} />
          );
        })}
      </div>
    </div>
  );
}

export function RandomShape() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS(p => p + 1), 600);
    return () => clearInterval(t);
  }, []);
  const shapes = [
    { type: 'circle', c: '#f0ff00' },
    { type: 'square', c: '#ff3da5' },
    { type: 'triangle', c: '#00e5ff' },
    { type: 'diamond', c: '#f5f1e8' },
    { type: 'cross', c: '#9b5cff' },
  ];
  const cur = shapes[s % shapes.length];
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      {cur.type === 'circle' && <div className="w-32 h-32 rounded-full" style={{ background: cur.c }} />}
      {cur.type === 'square' && <div className="w-32 h-32" style={{ background: cur.c }} />}
      {cur.type === 'triangle' && <div className="w-0 h-0" style={{ borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: `100px solid ${cur.c}` }} />}
      {cur.type === 'diamond' && <div className="w-28 h-28 rotate-45" style={{ background: cur.c }} />}
      {cur.type === 'cross' && <div className="relative w-24 h-24"><div className="absolute inset-0" style={{ background: cur.c, clipPath: 'polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%)' }} /></div>}
    </div>
  );
}

/* ============ EXPERIMENT · 实验 ============ */

export function Vaporwave() {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ff71ce 0%, #01cdfe 40%, #b967ff 70%, #05ffa1 100%)' }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(180deg, transparent, #000)' }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49%, #f0ff00 49%, #f0ff00 51%, transparent 51%)', backgroundSize: '40px 10px', height: '40px', transform: 'perspective(200px) rotateX(60deg)', transformOrigin: 'bottom' }} />
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-7xl text-white" style={{ textShadow: '4px 0 #ff71ce, -4px 0 #01cdfe' }}>V A P O R</div>
    </div>
  );
}

export function Terminal() {
  const lines = ['$ npm init forge', '✓ Initializing...', '$ forge build', '✓ 247 tools compiled', '$ _'];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown(p => Math.min(p+1, lines.length)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full h-full bg-black p-3 font-mono text-xs overflow-hidden">
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className={l.startsWith('$') ? 'text-volt' : 'text-green-400'}>{l}</div>
      ))}
      <div className="text-volt animate-pulse">▌</div>
    </div>
  );
}

export function GlitchImage() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center relative overflow-hidden">
      <div className="font-display font-black text-8xl text-bone relative" data-text="GLITCH">
        <span className="absolute inset-0 text-pink" style={{ transform: 'translate(3px,0)', mixBlendMode: 'screen' }}>GLITCH</span>
        <span className="absolute inset-0 text-cyan" style={{ transform: 'translate(-3px,0)', mixBlendMode: 'screen' }}>GLITCH</span>
        <span>GLITCH</span>
      </div>
    </div>
  );
}

export function AsciiPortrait() {
  const chars = '@#%&*+=-:. ';
  return (
    <div className="w-full h-full bg-bone p-2 font-mono text-[8px] leading-[8px] text-ink overflow-hidden flex flex-wrap content-center justify-center">
      {Array.from({length: 200}).map((_, i) => (
        <span key={i} style={{ opacity: Math.random() > 0.3 ? 1 : 0.2 }}>{chars[Math.floor(Math.random()*chars.length)]}</span>
      ))}
    </div>
  );
}

export function Scanlines() {
  return (
    <div className="w-full h-full bg-ink relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.04) 2px 4px)' }} />
      <div className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl text-volt">SCANLINES</div>
    </div>
  );
}

export function HalftoneImg() {
  return (
    <div className="w-full h-full bg-pink p-3">
      <div className="w-full h-full relative" style={{
        backgroundImage: 'radial-gradient(circle, #0a0a0a 30%, transparent 50%)',
        backgroundSize: '8px 8px',
      }}>
        <div className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl text-bone mix-blend-difference">HALFTONE</div>
      </div>
    </div>
  );
}

export function DataMosh() {
  return (
    <div className="w-full h-full bg-ink p-2 font-mono text-[10px] text-volt overflow-hidden">
      {Array.from({length: 25}).map((_, i) => (
        <div key={i} className="whitespace-nowrap" style={{ transform: `translateX(${(Math.sin(i*1.3)*10)}px)`, opacity: 0.3 + (i%5)*0.15 }}>
          {Array.from({length: 60}).map((_, j) => String.fromCharCode(33 + ((i*j+i+j)%94))).join('')}
        </div>
      ))}
    </div>
  );
}

export function PixelShifter() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="grid grid-cols-8 gap-0.5 w-3/4 h-3/4">
        {Array.from({length: 64}).map((_, i) => {
          const colors = ['#f0ff00','#ff3da5','#00e5ff','#f5f1e8','#0a0a0a'];
          return (
            <div key={i} className="transition-colors duration-500" style={{
              background: colors[(i + Math.floor(Date.now()/1000)) % colors.length],
            }} />
          );
        })}
      </div>
    </div>
  );
}
