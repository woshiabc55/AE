import { useState, useMemo } from 'react';
import { Grid3x3, Layers, Shuffle, Sparkles } from 'lucide-react';

/* ====================================================================
   9 梅花布局 (9x9 GRID) — 每种用一个 3x3 母格 + 9 子格
==================================================================== */
type Cell = { id: number; color: string; span: number; tag: string; v: 1 | 2 | 3 };
type Layout = { id: string; name: string; cn: string; desc: string; cells: Cell[] };

const PALETTE = ['#f0ff00', '#ff3da5', '#00e5ff', '#9b00ff', '#f5f1e8', '#0a0a0a'];

function cell(i: number, color: number, span: number, tag: string, v: Cell['v'] = 1): Cell {
  return { id: i, color: PALETTE[color % PALETTE.length], span, tag, v };
}

const LAYOUTS: Layout[] = [
  {
    id: 'bento', name: 'Bento', cn: '便当盒', desc: '1 大 + 2 中 + 6 小，Apple 风格信息密度',
    cells: [
      cell(0, 0, 4, 'HERO', 3), cell(1, 1, 2, 'A', 2), cell(2, 2, 2, 'B', 2),
      cell(3, 3, 2, 'C', 1), cell(4, 0, 1, 'D', 1), cell(5, 1, 1, 'E', 1),
      cell(6, 2, 1, 'F', 1), cell(7, 3, 1, 'G', 1), cell(8, 4, 1, 'H', 1),
    ],
  },
  {
    id: 'magazine', name: 'Magazine', cn: '杂志', desc: '跨页 6 列主图 + 3 列正文',
    cells: [
      cell(0, 0, 9, 'TITLE', 3), cell(1, 1, 6, 'PHOTO', 2),
      cell(2, 5, 3, 'TEXT', 1), cell(3, 2, 3, 'NOTE', 1), cell(4, 3, 3, 'QUOTE', 1),
      cell(5, 4, 3, 'DATA', 1), cell(6, 0, 3, 'CTA', 1), cell(7, 1, 3, 'LIST', 1),
      cell(8, 2, 3, 'END', 1),
    ],
  },
  {
    id: 'mosaic', name: 'Mosaic', cn: '马赛克', desc: '9 等格，最经典的网格',
    cells: Array.from({ length: 9 }, (_, i) => cell(i, i, 1, `0${i + 1}`, 1)),
  },
  {
    id: 'cross', name: 'Cross', cn: '十字', desc: '中心 1 大 + 4 周对称',
    cells: [
      cell(0, 1, 2, 'L'), cell(1, 0, 4, 'CORE', 3), cell(2, 1, 2, 'R'),
      cell(3, 0, 2, 'TL'), cell(4, 2, 2, 'TR'),
      cell(5, 3, 1, '·'), cell(6, 0, 1, '·'), cell(7, 2, 1, '·'), cell(8, 1, 1, '·'),
    ],
  },
  {
    id: 'diamond', name: 'Diamond', cn: '菱形', desc: '1 中心大 + 8 围绕',
    cells: [
      cell(0, 0, 1, 'T', 1), cell(1, 1, 2, 'TR', 1), cell(2, 2, 1, 'R', 1),
      cell(3, 3, 2, 'BR', 1), cell(4, 4, 1, 'B', 1), cell(5, 0, 2, 'BL', 1),
      cell(6, 1, 1, 'L', 1), cell(7, 2, 2, 'TL', 1), cell(8, 5, 1, 'C', 3),
    ],
  },
  {
    id: 'l-shape', name: 'L-Shape', cn: 'L 形', desc: '左侧 2×2 + 底部一排',
    cells: [
      cell(0, 0, 1, '·'), cell(1, 0, 1, '·'), cell(2, 0, 1, '·'),
      cell(3, 1, 1, '·'), cell(4, 0, 9, 'C', 3), cell(5, 0, 1, '·'),
      cell(6, 0, 1, '·'), cell(7, 0, 1, '·'), cell(8, 0, 1, '·'),
    ],
  },
  {
    id: 'spiral', name: 'Spiral', cn: '螺旋', desc: '从外到内的螺旋',
    cells: [
      cell(0, 0, 2, '01'), cell(1, 0, 2, '02'),
      cell(2, 0, 2, '03'), cell(3, 0, 1, '04'),
      cell(4, 0, 2, '05'), cell(5, 0, 1, '06'),
      cell(6, 0, 1, '07'), cell(7, 0, 1, '08'),
      cell(8, 0, 1, 'C', 1),
    ],
  },
  {
    id: 'tower', name: 'Tower', cn: '高塔', desc: '3 段垂直堆叠',
    cells: [
      cell(0, 0, 1, 'T1'), cell(1, 1, 1, 'T2'), cell(2, 2, 1, 'T3'),
      cell(3, 3, 1, 'M1'), cell(4, 0, 1, 'M2'), cell(5, 1, 1, 'M3'),
      cell(6, 2, 1, 'B1'), cell(7, 3, 1, 'B2'), cell(8, 0, 1, 'B3'),
    ],
  },
  {
    id: 'pinterest', name: 'Pinterest', cn: '瀑布', desc: '高度不等的内容流',
    cells: [
      cell(0, 0, 3, 'A', 1), cell(1, 1, 3, 'B', 2), cell(2, 2, 3, 'C', 1),
      cell(3, 3, 3, 'D', 3), cell(4, 0, 3, 'E', 1), cell(5, 1, 3, 'F', 2),
      cell(6, 2, 3, 'G', 1), cell(7, 3, 3, 'H', 2), cell(8, 0, 3, 'I', 1),
    ],
  },
];

/* ====================================================================
   现代背景板 (9+ ANIMATED BACKGROUNDS)
==================================================================== */
type Bg = { id: string; name: string; cn: string; css: React.CSSProperties; className?: string };

const BGS: Bg[] = [
  {
    id: 'mesh', name: 'Mesh Gradient', cn: '网格渐变',
    css: { background: 'radial-gradient(at 20% 30%, #f0ff00 0%, transparent 50%), radial-gradient(at 80% 70%, #ff3da5 0%, transparent 50%), radial-gradient(at 50% 50%, #00e5ff 0%, transparent 50%), #0a0a0a' },
  },
  {
    id: 'noise', name: 'Noise Grain', cn: '噪点',
    className: 'noise',
    css: { backgroundColor: '#0a0a0a' },
  },
  {
    id: 'halftone', name: 'Halftone', cn: '半色调',
    css: { background: 'radial-gradient(circle, #f0ff00 2px, transparent 2.5px) 0 0 / 12px 12px, #0a0a0a' },
  },
  {
    id: 'grid', name: 'Grid Lines', cn: '网格',
    css: { backgroundImage: 'linear-gradient(#f0ff0020 1px, transparent 1px), linear-gradient(90deg, #f0ff0020 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundColor: '#0a0a0a' },
  },
  {
    id: 'wave', name: 'Wave', cn: '波浪',
    css: { background: 'repeating-linear-gradient(0deg, transparent 0 30px, #f0ff0015 30px 31px), #0a0a0a' },
  },
  {
    id: 'triangle', name: 'Triangle', cn: '三角',
    css: { background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 60deg, #f0ff0010 60deg 120deg), #0a0a0a', backgroundSize: '40px 40px' },
  },
  {
    id: 'circle', name: 'Circle Field', cn: '圆阵',
    css: { background: 'radial-gradient(circle, #ff3da5 1px, transparent 1.5px) 0 0 / 16px 16px, #0a0a0a' },
  },
  {
    id: 'iso', name: 'Iso Lines', cn: '等距',
    css: { background: 'repeating-linear-gradient(60deg, transparent 0 20px, #00e5ff20 20px 21px), repeating-linear-gradient(-60deg, transparent 0 20px, #ff3da520 20px 21px), #0a0a0a' },
  },
  {
    id: 'scan', name: 'Scanlines', cn: '扫描线',
    css: { background: 'repeating-linear-gradient(0deg, #f0ff0008 0 1px, transparent 1px 4px), #0a0a0a' },
  },
  {
    id: 'gradient', name: 'Linear Gradient', cn: '线性渐变',
    css: { background: 'linear-gradient(135deg, #f0ff00 0%, #ff3da5 50%, #00e5ff 100%)' },
  },
  {
    id: 'conic', name: 'Conic', cn: '锥形渐变',
    css: { background: 'conic-gradient(from 45deg, #f0ff00, #ff3da5, #00e5ff, #9b00ff, #f0ff00)' },
  },
  {
    id: 'truchet', name: 'Truchet Tiles', cn: '拼砖',
    css: { background: 'radial-gradient(circle at 0 50%, transparent 8px, #f0ff00 8px 9px, transparent 9px), radial-gradient(circle at 100% 50%, transparent 8px, #ff3da5 8px 9px, transparent 9px)', backgroundSize: '24px 24px', backgroundColor: '#0a0a0a' },
  },
];

/* ====================================================================
   程序化生成器 - 用 5 个种子产出 N×N 变体
==================================================================== */
function generateVariants(seed: number, count: number) {
  // 简易 LCG
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.floor(rand() * 360);
    const size = 8 + Math.floor(rand() * 24);
    const op = 0.3 + rand() * 0.6;
    const delay = (rand() * 0.8).toFixed(2);
    return {
      id: i,
      hue, size, op, delay,
      bg: `hsl(${hue}, 80%, 55%)`,
    };
  });
}

/* ====================================================================
   PAGE
==================================================================== */
export default function PlumGrid() {
  const [activeLayout, setActiveLayout] = useState(0);
  const [activeBg, setActiveBg] = useState(0);
  const [seed, setSeed] = useState(42);
  const [variantCount, setVariantCount] = useState(64);
  const variants = useMemo(() => generateVariants(seed, variantCount), [seed, variantCount]);

  const layout = LAYOUTS[activeLayout];
  const bg = BGS[activeBg];

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6 font-mono text-xs">
            <Grid3x3 size={14} className="text-volt" />
            <span className="text-bone/60">9 LAYOUTS / 12 BACKGROUNDS / {variantCount} VARIANTS / ∞ SEEDS</span>
          </div>
          <h1 className="font-display font-black text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter">
            <span className="block">PLUM</span>
            <span className="block relative">
              <span className="relative z-10">GRID.</span>
              <span className="absolute -bottom-2 left-0 w-2/5 h-5 md:h-8 bg-volt -z-0" />
            </span>
          </h1>
          <p className="mt-8 text-lg text-bone/80 max-w-3xl">
            <span className="text-volt font-bold">9 梅花布局</span> · <span className="text-cyan font-bold">12 现代背景</span> · <span className="text-pink font-bold">程序化生成器</span>。
            三合一：从固定布局到无限变体的视觉工具箱。
          </p>
        </div>
      </section>

      {/* ============ 9 LAYOUTS ============ */}
      <section className="px-6 py-8 border-b-2 border-bone/20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-bone/60">
            <Layers size={12} />
            <span>9 布局 / 9 LAYOUTS / 梅花九宫</span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-9 gap-1 mb-6">
            {LAYOUTS.map((l, i) => (
              <button key={l.id} onClick={() => setActiveLayout(i)}
                className={`px-2 py-3 font-mono text-xs border-2 transition-all ${
                  i === activeLayout
                    ? 'bg-volt text-ink border-volt'
                    : 'border-bone/30 text-bone/60 hover:border-bone'
                }`}>
                <div className="font-bold">{l.cn}</div>
                <div className="text-[9px] opacity-60 mt-0.5">{l.name}</div>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border-2 border-bone p-4 bg-ink">
              <div className="font-mono text-[10px] text-bone/40 mb-2 flex items-center justify-between">
                <span>LAYOUT: {layout.name} ({layout.cn})</span>
                <span>9 CELLS / 3x3 MASTER</span>
              </div>
              <div className="grid grid-cols-9 gap-1 aspect-square bg-bone/10 p-1">
                {layout.cells.map(c => (
                  <div key={c.id}
                    className="border border-ink/30 flex items-center justify-center font-mono text-[9px] font-bold relative overflow-hidden group"
                    style={{
                      backgroundColor: c.color,
                      gridColumn: `span ${c.span}`,
                      color: c.color === '#0a0a0a' || c.color === '#9b00ff' ? '#f5f1e8' : '#0a0a0a',
                      minHeight: c.v === 3 ? '120px' : c.v === 2 ? '80px' : '40px',
                    }}>
                    {c.v === 3 ? (
                      <div className="text-center">
                        <div className="text-2xl font-display font-black">{c.tag}</div>
                        <div className="text-[8px] opacity-60 mt-1">SPAN {c.span}</div>
                      </div>
                    ) : (
                      <span className="opacity-60">{c.tag}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-volt/40 p-4 bg-ink">
                <div className="font-display font-black text-2xl text-volt mb-2">{layout.cn}</div>
                <div className="font-mono text-xs text-bone/60 mb-3">{layout.name.toUpperCase()}</div>
                <p className="text-sm text-bone/80 leading-relaxed">{layout.desc}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="border border-bone/30 p-2">
                  <div className="text-bone/40">CELLS</div>
                  <div className="text-volt font-bold text-lg">9</div>
                </div>
                <div className="border border-bone/30 p-2">
                  <div className="text-bone/40">SPANS</div>
                  <div className="text-cyan font-bold text-lg">
                    {new Set(layout.cells.map(c => c.span)).size}
                  </div>
                </div>
                <div className="border border-bone/30 p-2">
                  <div className="text-bone/40">MAX SPAN</div>
                  <div className="text-pink font-bold text-lg">
                    {Math.max(...layout.cells.map(c => c.span))}
                  </div>
                </div>
              </div>
              <div className="font-mono text-[10px] text-bone/40 leading-relaxed border-l-2 border-volt/40 pl-3">
                <div className="text-volt font-bold mb-1">▸ GRID SYSTEM</div>
                9 列基础网格 + 1/2/3/4/6/9 跨格预设。每格有 3 个权重：v1 简单 / v2 强调 / v3 主视觉。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 12 BACKGROUNDS ============ */}
      <section className="px-6 py-8 border-b-2 border-bone/20 bg-ink/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-bone/60">
            <Sparkles size={12} />
            <span>12 背景 / 12 BACKGROUNDS / 现代背景板</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {BGS.map((b, i) => (
              <button key={b.id} onClick={() => setActiveBg(i)}
                className={`group text-left border-2 ${i === activeBg ? 'border-volt' : 'border-bone/30'} hover:border-bone transition-all`}>
                <div className={`aspect-video relative overflow-hidden border-b border-bone/20 ${b.className ?? ''}`} style={b.css}>
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
                </div>
                <div className="p-2 font-mono text-[10px] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-bone">{b.cn}</div>
                    <div className="text-bone/40 text-[9px]">{b.name}</div>
                  </div>
                  {i === activeBg && <span className="text-volt">●</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 border-2 border-volt/40 p-4 bg-ink font-mono text-[10px]">
            <div className="text-volt font-bold mb-2">▸ SELECTED: {bg.cn} ({bg.name})</div>
            <pre className="text-bone/60 overflow-x-auto whitespace-pre-wrap">
{`background: ${bg.css.background ?? `${bg.className ?? 'noise'} (SVG filter)`};
backgroundSize: ${(bg.css as any).backgroundSize ?? 'auto'};
backgroundColor: ${(bg.css as any).backgroundColor ?? 'transparent'};`}
            </pre>
          </div>
        </div>
      </section>

      {/* ============ PROCEDURAL GENERATOR ============ */}
      <section className="px-6 py-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-bone/60">
            <Shuffle size={12} />
            <span>程序化生成 / PROCEDURAL GENERATOR / {variantCount} 变体 / seed = {seed}</span>
          </div>

          <div className="grid lg:grid-cols-4 gap-3 mb-6">
            <div className="border border-bone/30 p-3">
              <label className="font-mono text-[10px] text-bone/40">SEED</label>
              <input type="number" value={seed} onChange={e => setSeed(Number(e.target.value) || 0)}
                className="w-full bg-transparent border-b border-bone/30 text-volt font-display text-2xl font-black py-1 focus:outline-none focus:border-volt" />
            </div>
            <div className="border border-bone/30 p-3">
              <label className="font-mono text-[10px] text-bone/40">COUNT</label>
              <div className="font-display text-2xl font-black text-cyan py-1">{variantCount}</div>
              <input type="range" min="16" max="225" step="1" value={variantCount}
                onChange={e => setVariantCount(Number(e.target.value))}
                className="w-full accent-cyan" />
            </div>
            <div className="border border-bone/30 p-3">
              <label className="font-mono text-[10px] text-bone/40">PRESETS</label>
              <div className="flex gap-1 mt-1">
                {[16, 49, 64, 100, 225].map(n => (
                  <button key={n} onClick={() => setVariantCount(n)}
                    className="px-2 py-0.5 text-[10px] border border-bone/40 hover:border-volt hover:text-volt">
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-bone/30 p-3">
              <label className="font-mono text-[10px] text-bone/40">RANDOMIZE</label>
              <button onClick={() => setSeed(Math.floor(Math.random() * 99999))}
                className="block w-full mt-1 px-3 py-1.5 bg-pink text-ink font-bold text-xs hover:bg-volt transition-colors">
                ↻ NEW SEED
              </button>
            </div>
          </div>

          <div className="border-2 border-bone/20 bg-ink p-3 mb-3">
            <style>{`@keyframes var-float { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-8px) rotate(180deg)} }`}</style>
            <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(variantCount))}, minmax(0,1fr))` }}>
              {variants.map(v => (
                <div key={v.id} className="aspect-square relative group"
                  style={{
                    background: v.bg,
                    opacity: v.op,
                    animation: `var-float 3s ease-in-out ${v.delay}s infinite`,
                  }}>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-ink/60 opacity-0 group-hover:opacity-100">
                    {v.size}px
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3 font-mono text-[10px] text-bone/50">
            <div className="border border-bone/20 p-3">
              <div className="text-volt font-bold mb-1">▸ ALGORITHM</div>
              LCG (Linear Congruential Generator): s = (s × 9301 + 49297) mod 233280。
              同一种子永远产出相同序列。
            </div>
            <div className="border border-bone/20 p-3">
              <div className="text-pink font-bold mb-1">▸ DIMENSIONS</div>
              hue (0-360) · size (8-32px) · opacity (0.3-0.9) · delay (0-0.8s) — 4 维参数空间。
            </div>
            <div className="border border-bone/20 p-3">
              <div className="text-cyan font-bold mb-1">▸ SCALE</div>
              16 起步, 49, 64, 100, 225 — 最多可生成 225 变体 / 每屏。
              种子空间：2^32 ≈ 42 亿种。
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
