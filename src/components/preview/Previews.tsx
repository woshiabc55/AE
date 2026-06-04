import { useEffect, useRef, useState } from 'react';

/* ---------- VISUAL ---------- */

export function GlassMorphism() {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#ff3da5,#00e5ff,#f0ff00)' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-2xl backdrop-blur-xl bg-white/20 border border-white/40 shadow-2xl flex items-center justify-center">
          <div className="text-white text-2xl font-black tracking-tight">GLASSMORPHISM</div>
        </div>
      </div>
      <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-volt mix-blend-multiply opacity-70 blur-sm" />
      <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-pink mix-blend-multiply opacity-70 blur-sm" />
    </div>
  );
}

export function NoiseTexture() {
  return (
    <div className="w-full h-full relative noise" style={{ background: '#f0ff00' }}>
      <div className="absolute inset-0 flex items-center justify-center text-ink">
        <div className="font-display text-5xl font-black">NOISE</div>
      </div>
    </div>
  );
}

export function GradientMesh() {
  return (
    <div className="w-full h-full relative" style={{
      background: 'radial-gradient(at 20% 30%, #f0ff00 0px, transparent 50%), radial-gradient(at 80% 0%, #ff3da5 0px, transparent 50%), radial-gradient(at 0% 80%, #00e5ff 0px, transparent 50%), radial-gradient(at 80% 80%, #f5f1e8 0px, transparent 50%), #0a0a0a'
    }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-display text-4xl font-black text-bone mix-blend-difference">MESH</div>
      </div>
    </div>
  );
}

export function AuroraBg() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-ink">
      <div className="absolute -top-1/2 -left-1/4 w-[120%] h-[120%] animate-spin" style={{
        background: 'conic-gradient(from 0deg at 50% 50%, #f0ff00, #ff3da5, #00e5ff, #f0ff00)',
        filter: 'blur(60px)',
        opacity: 0.4,
        animationDuration: '30s',
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-display text-4xl font-black text-bone">AURORA</div>
      </div>
    </div>
  );
}

export function HalftoneDots() {
  return (
    <div className="w-full h-full relative bg-bone p-4">
      <div className="absolute inset-0 flex items-center justify-center" style={{
        backgroundImage: 'radial-gradient(circle, #0a0a0a 2px, transparent 3px)',
        backgroundSize: '14px 14px',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
        maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-black text-ink">HALFTONE</div>
    </div>
  );
}

/* ---------- INTERACTION ---------- */

export function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handle = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: e.clientX - r.left - r.width/2, y: e.clientY - r.top - r.height/2 });
  };
  return (
    <div className="w-full h-full flex items-center justify-center bg-ink">
      <button
        ref={ref}
        onMouseMove={handle}
        onMouseLeave={() => setPos({x:0,y:0})}
        className="px-8 py-4 bg-volt text-ink font-mono font-bold border-2 border-bone transition-transform"
        style={{ transform: `translate(${pos.x*0.3}px, ${pos.y*0.3}px)` }}
      >
        MAGNETIC →
      </button>
    </div>
  );
}

export function DragCard() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef({ active: false, ox: 0, oy: 0 });
  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gradient-to-br from-pink to-cyan"
      onMouseMove={(e) => {
        if (!drag.current.active) return;
        setPos({ x: e.clientX - drag.current.ox, y: e.clientY - drag.current.oy });
      }}
      onMouseUp={() => drag.current.active = false}
      onMouseLeave={() => drag.current.active = false}
    >
      <div
        onMouseDown={(e) => { drag.current = { active: true, ox: e.clientX - pos.x, oy: e.clientY - pos.y }; }}
        className="absolute w-32 h-40 bg-ink text-bone p-3 cursor-grab active:cursor-grabbing shadow-xl"
        style={{ left: `calc(50% - 64px + ${pos.x}px)`, top: `calc(50% - 80px + ${pos.y}px)` }}
      >
        <div className="text-xs font-mono">DRAG ME</div>
        <div className="mt-2 font-display font-black text-2xl">FORGE</div>
      </div>
    </div>
  );
}

export function KeyboardVisual() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  useEffect(() => {
    const down = (e: KeyboardEvent) => setPressed(p => new Set(p).add(e.key.toUpperCase()));
    const up = (e: KeyboardEvent) => setPressed(p => { const n = new Set(p); n.delete(e.key.toUpperCase()); return n; });
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  const keys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
  return (
    <div className="w-full h-full bg-ink p-3 flex flex-col items-center justify-center">
      <div className="text-volt font-mono text-xs mb-2">敲击键盘试试 / PRESS ANY KEY</div>
      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {keys.map(k => (
          <div key={k} className={`w-6 h-6 border ${pressed.has(k) ? 'bg-volt text-ink border-volt' : 'border-bone/40 text-bone/50'} text-[10px] font-mono flex items-center justify-center transition-colors`}>
            {k}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiquidButton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-ink">
      <button className="group relative px-8 py-3 bg-bone text-ink font-bold border-2 border-bone overflow-hidden">
        <span className="relative z-10 group-hover:text-bone transition-colors">LIQUID HOVER</span>
        <span className="absolute inset-0 bg-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>
    </div>
  );
}

/* ---------- ANIMATION ---------- */

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const resize = () => { c.width = c.clientWidth; c.height = c.clientHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.5,
    }));
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.25)';
      ctx.fillRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.fillStyle = '#f0ff00';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="w-full h-full block" />;
}

export function TypeWriter() {
  const words = ['FORGE', 'BUILD', 'CREATE', 'BREAK'];
  const [w, setW] = useState(0);
  const [text, setText] = useState('');
  useEffect(() => {
    const word = words[w % words.length];
    let i = 0; let typing = true;
    const tick = () => {
      if (typing) {
        setText(word.slice(0, i+1));
        i++;
        if (i === word.length) { typing = false; setTimeout(tick, 1200); return; }
      } else {
        setText(word.slice(0, i-1));
        i--;
        if (i === 0) { setW(w+1); return; }
      }
      setTimeout(tick, typing ? 120 : 60);
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [w]);
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="font-display text-5xl font-black text-volt caret">{text || ' '}</div>
    </div>
  );
}

export function MarqueeText() {
  const items = Array(8).fill('★ SKILL FORGE ★ CRAFT HTML ★');
  return (
    <div className="w-full h-full bg-volt overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap marquee">
        {items.concat(items).map((t, i) => (
          <span key={i} className="font-display font-black text-4xl text-ink px-6">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function MorphingBlob() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="w-32 h-32 bg-pink" style={{
        animation: 'morph 8s ease-in-out infinite',
        borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
        filter: 'blur(2px)',
      }} />
      <style>{`@keyframes morph {
        0%,100%{ border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; transform: rotate(0deg) scale(1); background: #ff3da5; }
        33%{ border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; transform: rotate(120deg) scale(1.1); background: #00e5ff; }
        66%{ border-radius: 50% 50% 30% 60%/40% 60% 50% 50%; transform: rotate(240deg) scale(0.95); background: #f0ff00; }
      }`}</style>
    </div>
  );
}

/* ---------- GENERATOR ---------- */

export function ColorPalette() {
  const palettes = [
    ['#f0ff00','#ff3da5','#00e5ff','#0a0a0a','#f5f1e8'],
    ['#ff6b6b','#4ecdc4','#ffe66d','#1a535c','#f7fff7'],
    ['#000000','#ffde22','#5eb1bf','#0e5b6e','#f5f5f5'],
    ['#ef476f','#ffd166','#06d6a0','#118ab2','#073b4c'],
  ];
  const [p, setP] = useState(0);
  const palette = palettes[p];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex">
        {palette.map(c => (
          <div key={c} className="flex-1 flex items-end p-2" style={{ background: c }}>
            <span className="font-mono text-[10px] mix-blend-difference text-white">{c}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setP((p+1)%palettes.length)} className="bg-ink text-bone py-2 font-mono text-xs hover:bg-volt hover:text-ink">
        换一组 / SHUFFLE
      </button>
    </div>
  );
}

export function TypographyPair() {
  const pairs = [
    { display: 'Fraunces', body: 'Inter Tight' },
    { display: 'JetBrains Mono', body: 'Inter Tight' },
    { display: 'Inter Tight', body: 'JetBrains Mono' },
  ];
  const [i, setI] = useState(0);
  const p = pairs[i];
  return (
    <div className="w-full h-full bg-bone text-ink p-4 flex flex-col justify-between" onClick={() => setI((i+1)%pairs.length)}>
      <div>
        <div className="text-[10px] font-mono">DISPLAY · {p.display}</div>
        <div className="font-display text-5xl font-black leading-none mt-1" style={{ fontFamily: p.display }}>Aa Bb 12</div>
        <div className="text-[10px] font-mono mt-4">BODY · {p.body}</div>
        <div className="text-sm mt-1" style={{ fontFamily: p.body }}>
          The quick brown fox jumps over the lazy dog. 1234567890
        </div>
      </div>
      <div className="text-[10px] font-mono text-ink/50">点击换一对 / CLICK</div>
    </div>
  );
}

export function ShadowGen() {
  const [x, setX] = useState(8);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(20);
  const [color, setColor] = useState('#f0ff00');
  return (
    <div className="w-full h-full bg-ink p-4 flex flex-col gap-2">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-20 h-20 bg-bone" style={{ boxShadow: `${x}px ${y}px ${blur}px ${color}` }} />
      </div>
      <div className="font-mono text-[10px] space-y-1">
        {([['X',x,setX],['Y',y,setY],['BLUR',blur,setBlur]] as const).map(([l,v,s]) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-10">{l}</span>
            <input type="range" min={-30} max={30} value={v} onChange={e => s(+e.target.value as any)} className="flex-1 accent-volt" />
            <span className="w-6 text-volt">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GradientGen() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const [a, setA] = useState(135);
  const [c1, setC1] = useState('#f0ff00');
  const [c2, setC2] = useState('#ff3da5');
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1" style={{ background: `linear-gradient(${a}deg, ${c1}, ${c2})` }} />
      <div className="bg-ink p-2 flex items-center gap-2 font-mono text-[10px]">
        <input type="color" value={c1} onChange={e=>setC1(e.target.value)} />
        <input type="range" min={0} max={360} value={a} onChange={e=>setA(+e.target.value)} className="flex-1 accent-volt" />
        <input type="color" value={c2} onChange={e=>setC2(e.target.value)} />
      </div>
    </div>
  );
}

/* ---------- EXPERIMENT ---------- */

export function GlitchText() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center scanline relative overflow-hidden">
      <div className="glitch font-display text-5xl font-black" data-text="GLITCH">GLITCH</div>
    </div>
  );
}

export function AsciiFilter() {
  const chars = '·°*o+x#@';
  return (
    <div className="w-full h-full bg-ink p-3 font-mono text-volt text-xs overflow-hidden flex flex-wrap gap-1 content-center">
      {Array.from({length: 220}).map((_,i)=>(
        <span key={i} style={{opacity: Math.random()*0.8+0.2}}>
          {chars[Math.floor(Math.random()*chars.length)]}
        </span>
      ))}
    </div>
  );
}

export function Pixelated() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center" style={{ imageRendering: 'pixelated' as any }}>
      <div className="font-display text-7xl font-black text-volt" style={{ textShadow: '4px 0 #ff3da5, -4px 0 #00e5ff' }}>PIX</div>
    </div>
  );
}

export function ChromaticText() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="relative font-display text-6xl font-black text-bone">
        <span className="absolute -translate-x-1 text-pink mix-blend-screen">RGB</span>
        <span className="absolute translate-x-1 text-cyan mix-blend-screen">RGB</span>
        <span>RGB</span>
      </div>
    </div>
  );
}

export function MagneticCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const r = ref.current!.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return (
    <div ref={ref} className="w-full h-full bg-gradient-to-br from-ink to-cyan/20 relative overflow-hidden">
      <div className="absolute w-6 h-6 rounded-full bg-volt mix-blend-difference pointer-events-none" style={{ left: pos.x-12, top: pos.y-12 }} />
      <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-black text-bone">FOLLOW</div>
    </div>
  );
}

export function CounterUp() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = 9999;
    let cur = 0;
    const id = setInterval(() => {
      cur += Math.ceil((target - cur) * 0.1);
      if (cur >= target) { cur = target; clearInterval(id); }
      setN(cur);
    }, 30);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full h-full bg-volt text-ink flex items-center justify-center font-display text-6xl font-black tabular-nums">
      {n.toLocaleString()}
    </div>
  );
}

export function StickerTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <div ref={ref} className="w-full h-full bg-pink flex items-center justify-center"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setT({ rx: -y * 25, ry: x * 25 });
      }}
      onMouseLeave={() => setT({rx:0, ry:0})}
    >
      <div className="tilt-wrap">
        <div className="tilt-card w-32 h-32 bg-ink text-bone flex items-center justify-center font-display text-3xl font-black border-2 border-bone" style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
          3D
        </div>
      </div>
    </div>
  );
}

export function LiquidLoader() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center gap-2">
      {[0,1,2,3,4].map(i => (
        <div key={i} className="w-3 h-12 bg-volt" style={{
          animation: 'bounce 1s ease-in-out infinite',
          animationDelay: `${i*0.1}s`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,100%{ transform: scaleY(0.3);} 50%{ transform: scaleY(1);} }`}</style>
    </div>
  );
}

export function WaveText() {
  return (
    <div className="w-full h-full bg-ink flex items-center justify-center">
      <div className="font-display text-5xl font-black text-bone flex">
        {'WAVE'.split('').map((c, i) => (
          <span key={i} style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: `${i*0.1}s`, display: 'inline-block' }}>{c}</span>
        ))}
      </div>
      <style>{`@keyframes wave { 0%,100%{ transform: translateY(0); color: #f5f1e8; } 50%{ transform: translateY(-12px); color: #f0ff00; } }`}</style>
    </div>
  );
}

export function HoverReveal() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: ((e.clientX-r.left)/r.width)*100, y: ((e.clientY-r.top)/r.height)*100 });
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-black text-bone/30">HOVER ME</div>
      <div className="absolute w-32 h-32 rounded-full bg-volt blur-2xl pointer-events-none" style={{ left: `calc(${pos.x}% - 64px)`, top: `calc(${pos.y}% - 64px)` }} />
    </div>
  );
}
