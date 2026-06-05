import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Move, Play, RotateCcw } from 'lucide-react';
import { Tag, TAG_META, type TagCategory } from '../components/Tag';

/* ====================================================================
   ANIMATION FORGE · 动效工坊
   ─────────────────────────────────────────────────────────────
   9 动效族 × 9 曲线/类型 = 81 动效
   每族是一类语义,每变体是一条曲线
==================================================================== */

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

interface Curve {
  name: string;
  css: string;       // CSS cubic-bezier
  desc: string;
}

const CURVES: Curve[] = [
  { name: 'LINEAR',    css: 'linear',                    desc: '0,0,1,1',   },
  { name: 'EASE',      css: 'ease',                      desc: '.25,.1,.25,1' },
  { name: 'EASE-IN',   css: 'ease-in',                   desc: '.42,0,1,1', },
  { name: 'EASE-OUT',  css: 'ease-out',                  desc: '0,0,.58,1', },
  { name: 'IN-OUT',    css: 'ease-in-out',               desc: '.42,0,.58,1' },
  { name: 'SPRING',    css: 'cubic-bezier(.34,1.56,.64,1)', desc: '回弹' },
  { name: 'EXPO',      css: 'cubic-bezier(1,0,0,1)',     desc: '极速' },
  { name: 'BACK',      css: 'cubic-bezier(.68,-.55,.27,1.55)', desc: '拉回' },
  { name: 'BEZIER',    css: 'cubic-bezier(.7,0,.3,1)',    desc: '通用' },
];

interface AnimFamily {
  id: string; n: string; name: string; cn: string; en: string; tag: TagCategory;
  icon: React.ReactNode;
  desc: string;
  duration: number;     // ms
  property: 'transform' | 'opacity' | 'all';
}

const FAMILIES: AnimFamily[] = [
  { id: 'F1', n: '01', name: 'ENTER',     cn: '入场', en: 'IN',      tag: 'motion',  icon: <span>→</span>,     desc: '元素进入视口的节奏',         duration: 360, property: 'transform' },
  { id: 'F2', n: '02', name: 'EXIT',      cn: '出场', en: 'OUT',     tag: 'motion',  icon: <span>←</span>,     desc: '元素离开视口的节奏',         duration: 280, property: 'transform' },
  { id: 'F3', n: '03', name: 'TRANSITION',cn: '过渡', en: 'STATE',   tag: 'motion',  icon: <span>⇄</span>,     desc: '状态切换的连贯性',           duration: 200, property: 'transform' },
  { id: 'F4', n: '04', name: 'ATTENTION', cn: '注意', en: 'ALERT',   tag: 'interact',icon: <span>!</span>,     desc: '吸引视觉焦点的脉冲',         duration: 600, property: 'transform' },
  { id: 'F5', n: '05', name: 'LOADING',   cn: '加载', en: 'PROG',    tag: 'motion',  icon: <span>◐</span>,     desc: '持续的进度反馈',             duration: 1200,property: 'transform' },
  { id: 'F6', n: '06', name: 'SCROLL',    cn: '滚动', en: 'SCROLL',  tag: 'motion',  icon: <span>↕</span>,     desc: '滚动驱动的叙事',             duration: 500, property: 'transform' },
  { id: 'F7', n: '07', name: 'HOVER',     cn: '悬停', en: 'HOVER',   tag: 'interact',icon: <span>·</span>,     desc: '指针接近时的反馈',           duration: 150, property: 'transform' },
  { id: 'F8', n: '08', name: 'CLICK',     cn: '点按', en: 'PRESS',   tag: 'interact',icon: <span>○</span>,     desc: '按下的物理感',               duration: 100, property: 'transform' },
  { id: 'F9', n: '09', name: 'IDLE',      cn: '待机', en: 'IDLE',    tag: 'motion',  icon: <span>~</span>,     desc: '未操作时的环境动效',         duration: 4000,property: 'transform' },
];

/* 单个动画演示盒 */
function AnimDemo({ family, curve, replayKey }: { family: AnimFamily; curve: Curve; replayKey: string }) {
  const [playing, setPlaying] = useState(false);
  const m = SAFE(family.tag);

  useEffect(() => {
    setPlaying(false);
    const t = setTimeout(() => setPlaying(true), 50);
    return () => clearTimeout(t);
  }, [replayKey]);

  return (
    <div className="border-2 border-bone/30 p-3 hover:border-volt transition-colors flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 border border-bone/30">{curve.name}</span>
          <span className="font-mono text-[9px] text-bone/50">{family.duration}ms</span>
        </div>
        <span className="font-mono text-[9px] text-bone/40">{family.property}</span>
      </div>

      {/* 动画舞台 */}
      <div className="relative h-16 border-2 border-bone/20 bg-bone/5 overflow-hidden">
        <div
          key={replayKey}
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 font-display font-black text-base flex items-center justify-center"
          style={{
            background: m.hex,
            color: m.ink,
            animation: playing
              ? `${family.name.toLowerCase()}-${curve.name.toLowerCase()} ${family.duration}ms ${curve.css === 'linear' ? 'linear' : curve.css === 'ease' ? 'ease' : curve.css} forwards`
              : 'none',
            left: 0,
            transform: 'translateY(-50%)',
          }}
        >
          {family.icon}
        </div>
      </div>

      <div className="mt-2 font-mono text-[9px] text-bone/50 truncate">
        {curve.css}
      </div>
    </div>
  );
}

export default function AnimationForge() {
  const [replayKey, setReplayKey] = useState<string>('0');
  const [activeFamily, setActiveFamily] = useState<string>('F1');
  const family = FAMILIES.find(f => f.id === activeFamily) ?? FAMILIES[0];

  // 注入 keyframes
  useEffect(() => {
    const id = 'animation-forge-keyframes';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `
      @keyframes enter-fade  { from { opacity: 0; left: 0; } to { opacity: 1; left: 100%; } }
      @keyframes enter-slide { from { transform: translate(-100%, -50%); } to { transform: translate(0, -50%); } }
      @keyframes enter-zoom  { from { transform: translateY(-50%) scale(0); } to { transform: translateY(-50%) scale(1); } }
      @keyframes exit-fade   { from { opacity: 1; left: 100%; } to { opacity: 0; left: 0; } }
      @keyframes exit-slide  { from { transform: translate(0, -50%); } to { transform: translate(100%, -50%); } }
      @keyframes exit-zoom   { from { transform: translateY(-50%) scale(1); } to { transform: translateY(-50%) scale(0); } }
      @keyframes state-swap  { 0% { transform: translateY(-50%) rotate(0); } 50% { transform: translateY(-50%) rotate(180deg); } 100% { transform: translateY(-50%) rotate(360deg); } }
      @keyframes alert-pulse { 0% { transform: translateY(-50%) scale(1); } 50% { transform: translateY(-50%) scale(1.4); } 100% { transform: translateY(-50%) scale(1); } }
      @keyframes prog-spin   { from { transform: translateY(-50%) rotate(0); } to { transform: translateY(-50%) rotate(360deg); } }
      @keyframes scroll-move { 0% { left: 0; } 50% { left: 70%; } 100% { left: 0; } }
      @keyframes hover-lift  { from { transform: translateY(-50%); } to { transform: translate(-10px, -50%) scale(1.1); } }
      @keyframes press-down  { 0% { transform: translateY(-50%) scale(1); } 50% { transform: translateY(-50%) scale(0.85); } 100% { transform: translateY(-50%) scale(1); } }
      @keyframes idle-breath { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
    `;
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-cyan mb-3 flex items-center gap-2">
              <Move size={12} />
              <span>// ANIMATION FORGE · 动效工坊 / 9 FAMILIES × 9 CURVES / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">ANIMATION</span>
              <span className="block relative">
                <span className="relative z-10">FORGE.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-cyan -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              9 动效族 · 9 曲线 ·<span className="text-cyan font-bold"> 81 动效</span>。
              <span className="text-pink font-bold">只动 transform / opacity</span>,
              永远尊重 <code className="text-volt">prefers-reduced-motion</code>。
            </p>

            <button
              onClick={() => setReplayKey(k => `${parseInt(k) + 1}`)}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs"
            >
              <Play size={11} /> REPLAY ALL
            </button>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9 动效族 / 81 件</div>
            <div className="space-y-1.5">
              {FAMILIES.map(f => {
                const m = SAFE(f.tag);
                return (
                  <div key={f.id} className="flex items-center gap-2 p-1.5 border border-bone/20">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{f.n}</span>
                    <div className="flex-1">
                      <div className="font-display font-black text-sm">{f.name}</div>
                      <div className="font-mono text-[9px] text-bone/50">{f.cn} · {f.en}</div>
                    </div>
                    <span className="font-mono text-[9px] text-bone/40">{f.duration}ms</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* 族筛选 */}
      <section className="px-6 py-3 border-b-2 border-bone/20 sticky top-[108px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[9px] text-bone/40 shrink-0">FAMILY</span>
          {FAMILIES.map(f => {
            const m = SAFE(f.tag);
            const active = activeFamily === f.id;
            return (
              <button
                key={f.id}
                onClick={() => { setActiveFamily(f.id); setReplayKey(k => `${parseInt(k) + 1}`); }}
                className={`px-2 py-1 font-mono text-[10px] border-2 flex items-center gap-1 ${active ? 'border-volt' : 'border-bone/30 hover:border-bone'}`}
                style={active ? { background: m.hex, color: m.ink, borderColor: m.hex } : {}}
              >
                <span>{f.icon}</span> {f.name}
              </button>
            );
          })}
          <button
            onClick={() => setReplayKey(k => `${parseInt(k) + 1}`)}
            className="ml-auto px-2 py-1 font-mono text-[10px] border-2 border-bone/30 hover:border-volt flex items-center gap-1"
          >
            <RotateCcw size={10} /> REPLAY
          </button>
        </div>
      </section>

      {/* 当前族:9 曲线矩阵 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ {family.name} · 9 CURVES</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                <span style={{ color: SAFE(family.tag).hex }}>{family.name}</span> · {family.cn} · {family.en}
              </h2>
              <p className="text-bone/70 text-sm mt-1">{family.desc} · {family.duration}ms · property: {family.property}</p>
            </div>
            <Tag cat={family.tag} size="md" variant="outline" showId showEn />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {CURVES.map(c => (
              <AnimDemo key={`${family.id}-${c.name}-${replayKey}`} family={family} curve={c} replayKey={`${family.id}-${c.name}-${replayKey}`} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 族总览(ASCII 时间轴) */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 9 FAMILY TIMELINE / 9 族时间轴</div>
          <div className="border-2 border-bone/30 p-4 bg-ink">
            <pre className="font-mono text-[10px] md:text-[11px] leading-[1.4] text-bone/80 overflow-x-auto">
{`0ms      100      200      300      400      500      600      800      1200     4000
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ 01 ENTER  ▓▓▓▓▓▓▓▓▓▓▓▓ ~360ms
│ 02 EXIT       ▓▓▓▓▓▓▓▓ ~280ms
│ 03 STATE      ▓▓▓▓▓▓ ~200ms
│ 04 ALERT            ▓▓▓▓▓▓▓▓ ~600ms (loop)
│ 05 PROG                       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ~1200ms (loop)
│ 06 SCROLL           ▓▓▓▓▓▓▓▓▓▓▓▓ ~500ms
│ 07 HOVER  ▓▓ ~150ms
│ 08 PRESS  ▓ ~100ms
│ 09 IDLE                              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ~4000ms (loop)`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 9 应当 · 动效</div>
            <ol className="font-mono text-xs space-y-1 text-bone/80">
              <li>01 · 仅动 transform / opacity</li>
              <li>02 · 永远尊重 prefers-reduced-motion</li>
              <li>03 · 入口 ≤ 400ms,出口 ≤ 300ms</li>
              <li>04 · 持续动画可关闭 (loop = opt-in)</li>
              <li>05 · 缓动用 cubic-bezier,不用 linear</li>
              <li>06 · 一次入场 ≥ 30 个 hover</li>
              <li>07 · transform 优先于 left/top</li>
              <li>08 · GPU 加速 will-change 慎用</li>
              <li>09 · 9 族语义清晰,9 曲线可复用</li>
            </ol>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想替换一族动效?</h3>
            <p className="text-bone/70 text-sm mt-2">
              任何族 9 曲线都可整组复制。Filter 切换可只看一族 9 件。
              返回<Link to="/productions" className="text-cyan font-bold"> 制作中心</Link>看其他 8 座工坊。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/productions" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 制作中心 / PRODUCTIONS
              </Link>
              <Link to="/forge/components" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                组件工坊
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // ANIMATION FORGE V.10 · 9 FAMILIES · 9 CURVES · 81 ANIMATIONS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
