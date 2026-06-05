import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Frame, Copy, Check } from 'lucide-react';

/* ====================================================================
   BORDERS · 边界设计
   9 大类 × 30+ 变体 = 完整边界样式谱
   贯通 Standards F 的 9 类目标签
==================================================================== */

type Section = 'basic' | 'radius' | 'width' | 'color' | 'gradient' | 'anim' | 'decorative' | 'direction' | 'real';

const SECTIONS: { id: Section; t: string; en: string; cn: string; desc: string; n: number }[] = [
  { id: 'basic',      t: '基础风格', en: 'STYLE',  cn: '9 种 style',     desc: 'border-style 属性的 9 种取值', n: 9 },
  { id: 'radius',     t: '圆角',     en: 'RADIUS', cn: '9 种 radius',    desc: 'border-radius 的 9 档',          n: 9 },
  { id: 'width',      t: '宽度',     en: 'WIDTH',  cn: '9 种 width',     desc: 'border-width 的 9 档',           n: 9 },
  { id: 'color',      t: '颜色',     en: 'COLOR',  cn: '9 主题色',       desc: '6 主题 × 多形态',                 n: 9 },
  { id: 'gradient',   t: '渐变',     en: 'GRAD',   cn: '3 类渐变',       desc: 'linear / conic / radial 边框',     n: 6 },
  { id: 'anim',       t: '动画',     en: 'ANIM',   cn: '6 种动画',       desc: 'draw / dash / glow / pulse',      n: 6 },
  { id: 'decorative', t: '装饰',     en: 'DECOR',  cn: '6 种装饰',       desc: 'corner / double / asymmetric',     n: 6 },
  { id: 'direction',  t: '方向',     en: 'DIR',    cn: '8 方向',         desc: 'top / right / bottom / left',     n: 8 },
  { id: 'real',       t: '实战',     en: 'REAL',   cn: '9 案例',         desc: '9 张真实使用边界卡',              n: 9 },
];

const COLORS: { id: string; cn: string; bg: string; fg: string }[] = [
  { id: 'volt', cn: 'VOLT', bg: '#0a0a0a', fg: '#f0ff00' },
  { id: 'pink', cn: 'PINK', bg: '#0a0a0a', fg: '#ff3da5' },
  { id: 'cyan', cn: 'CYAN', bg: '#0a0a0a', fg: '#00e5ff' },
  { id: 'plum', cn: 'PLUM', bg: '#0a0a0a', fg: '#9b5cff' },
  { id: 'bone', cn: 'BONE', bg: '#0a0a0a', fg: '#f5f1e8' },
  { id: 'ink',  cn: 'INK',  bg: '#f5f1e8', fg: '#0a0a0a' },
];

const STYLES: { v: string; cn: string; css: string }[] = [
  { v: 'solid',  cn: '实线',   css: 'solid'  },
  { v: 'dashed', cn: '虚线',   css: 'dashed' },
  { v: 'dotted', cn: '点线',   css: 'dotted' },
  { v: 'double', cn: '双线',   css: 'double' },
  { v: 'groove', cn: '凹槽',   css: 'groove' },
  { v: 'ridge',  cn: '凸槽',   css: 'ridge'  },
  { v: 'inset',  cn: '内陷',   css: 'inset'  },
  { v: 'outset', cn: '外凸',   css: 'outset' },
  { v: 'none',   cn: '无线',   css: 'none'   },
];

const RADII: { v: string; cn: string; css: string }[] = [
  { v: '0',     cn: '无',     css: '0'           },
  { v: '2px',   cn: '极小',   css: '2px'         },
  { v: '4px',   cn: '小',     css: '4px'         },
  { v: '6px',   cn: '小中',   css: '6px'         },
  { v: '8px',   cn: '中',     css: '8px'         },
  { v: '12px',  cn: '中大',   css: '12px'        },
  { v: '16px',  cn: '大',     css: '16px'        },
  { v: '24px',  cn: '极大',   css: '24px'        },
  { v: '9999px',cn: '圆',     css: '9999px'      },
];

const WIDTHS = [1, 2, 3, 4, 6, 8, 10, 12, 16];

const GRADIENTS: { t: string; cn: string; bg: string }[] = [
  { t: 'linear 90', cn: '水平',     bg: 'linear-gradient(90deg, #f0ff00, #ff3da5, #00e5ff)' },
  { t: 'linear 45', cn: '斜角',     bg: 'linear-gradient(45deg, #f0ff00, #00e5ff)' },
  { t: 'conic',     cn: '锥形',     bg: 'conic-gradient(from 45deg, #f0ff00, #ff3da5, #00e5ff, #9b5cff, #f0ff00)' },
  { t: 'radial',    cn: '径向',     bg: 'radial-gradient(circle, #f0ff00, #ff3da5)' },
  { t: 'rainbow',   cn: '彩虹',     bg: 'linear-gradient(90deg, #ff3da5, #f0ff00, #00e5ff, #9b5cff, #ff3da5)' },
  { t: 'paper',     cn: '纸张',     bg: 'linear-gradient(135deg, #f1ead7, #d63b1f)' },
];

const ANIMATIONS: { t: string; cn: string; keyframes: string }[] = [
  { t: 'draw',      cn: '绘线',     keyframes: '@keyframes draw{bg-size:0 100%→100% 100%}' },
  { t: 'dash',      cn: '跑马灯',   keyframes: '@keyframes dash{border-dashoffset 24→0 loop}' },
  { t: 'glow',      cn: '辉光',     keyframes: '@keyframes glow{box-shadow pulse}' },
  { t: 'pulse',     cn: '脉动',     keyframes: '@keyframes pulse{opacity 1→.3→1}' },
  { t: 'rotate',    cn: '旋转',     keyframes: '@keyframes rot{conic-gradient spin}' },
  { t: 'gradient',  cn: '渐变流动', keyframes: '@keyframes flow{bg-position:0 50%→100% 50%}' },
];

const DECORATIVE: { t: string; cn: string; technique: string }[] = [
  { t: 'corner',    cn: '4 角裁切',     technique: 'clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' },
  { t: 'arrow',     cn: '右箭头',       technique: 'clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)' },
  { t: 'tag',       cn: '标签',         technique: 'clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)' },
  { t: 'double',    cn: '双层',         technique: '外层 + 内层错位 box-shadow' },
  { t: 'torn',      cn: '撕裂',         technique: 'mask-image: linear-gradient(90deg, transparent 5%, black 5%, black 95%, transparent 95%)' },
  { t: 'asymmetric',cn: '非对称',       technique: 'border-width: 8px 2px 2px 8px' },
];

const DIRECTIONS: { t: string; cn: string; css: string }[] = [
  { t: 'all',        cn: '四边',     css: 'border: 2px solid #f0ff00' },
  { t: 'top',        cn: '上',       css: 'border-top: 4px solid #f0ff00' },
  { t: 'right',      cn: '右',       css: 'border-right: 4px solid #f0ff00' },
  { t: 'bottom',     cn: '下',       css: 'border-bottom: 4px solid #f0ff00' },
  { t: 'left',       cn: '左',       css: 'border-left: 4px solid #f0ff00' },
  { t: 'x',          cn: '横',       css: 'border-left+right: 4px solid #f0ff00' },
  { t: 'y',          cn: '纵',       css: 'border-top+bottom: 4px solid #f0ff00' },
  { t: 't-only',     cn: '仅顶细线', css: 'border-top: 1px solid #f0ff00' },
];

const REALS: { t: string; cn: string; body: string; border: string }[] = [
  { t: 'Bento Card',     cn: '便当卡',     body: 'CONTAINER',    border: 'border-2 border-volt rounded-lg' },
  { t: 'Modal',          cn: '模态',       body: 'MODAL',        border: 'border-4 border-bone' },
  { t: 'Button',         cn: '按钮',       body: 'CLICK ME',     border: 'border-2 border-bone rounded-full' },
  { t: 'Input',          cn: '输入框',     body: 'Type here…',   border: 'border-b-2 border-bone' },
  { t: 'Tag',            cn: '标签',       body: 'TAG',          border: 'border border-volt rounded-sm' },
  { t: 'Alert',          cn: '警告',       body: '!',            border: 'border-l-4 border-pink border-y border-r border-bone/20' },
  { t: 'Card w/ Shadow', cn: '投影卡',     body: 'CARD',         border: 'border-2 border-bone shadow-[8px_8px_0_var(--volt)]' },
  { t: 'Focus Ring',     cn: '焦点环',     body: 'FOCUS',        border: 'border-2 border-bone focus:border-volt outline outline-2 outline-cyan outline-offset-2' },
  { t: 'Glass',          cn: '玻璃',       body: 'GLASS',        border: 'border border-bone/30 backdrop-blur' },
];

/* ---------- 通用卡 ---------- */
function Demo({ label, cn, children, code }: { label: string; cn: string; children: React.ReactNode; code?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (code) navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="border-2 border-bone/20 bg-ink hover:border-bone transition-colors">
      <div className="aspect-[4/3] flex items-center justify-center p-4 bg-bone/5">
        {children}
      </div>
      <div className="border-t-2 border-bone/20 px-2 py-1.5 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold text-volt">{label}</div>
          <div className="font-mono text-[9px] text-bone/50">{cn}</div>
        </div>
        {code && (
          <button onClick={copy} className="font-mono text-[9px] flex items-center gap-1 px-1.5 py-0.5 border border-bone/30 hover:border-volt">
            {copied ? <><Check size={9} className="text-volt" />OK</> : <><Copy size={9} />CSS</>}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- 9 实战卡 ---------- */
function RealCard({ r }: { r: typeof REALS[number] }) {
  return (
    <div className={`aspect-[4/3] flex items-center justify-center p-2 bg-bone/5 ${r.border}`}>
      <span className="font-display font-black text-base md:text-2xl text-bone text-center">{r.body}</span>
    </div>
  );
}

/* ---------- 9 方向卡 ---------- */
function DirCard({ d }: { d: typeof DIRECTIONS[number] }) {
  return (
    <div className="aspect-[4/3] flex items-center justify-center p-4 bg-bone/5">
      <div className="w-full h-20 bg-ink/50" style={{ ...parseInlineBorder(d.css) }} />
    </div>
  );
}

function parseInlineBorder(css: string): React.CSSProperties {
  const styles: React.CSSProperties = {};
  css.split(';').forEach(s => {
    const [k, v] = s.split(':').map(x => x.trim());
    if (!k || !v) return;
    if (k.startsWith('border')) {
      const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      (styles as any)[camel] = v;
    }
  });
  return styles;
}

/* ---------- 渐变卡 ---------- */
function GradientCard({ g }: { g: typeof GRADIENTS[number] }) {
  return (
    <div className="aspect-[4/3] p-1 bg-ink">
      <div
        className="w-full h-full p-3 flex items-center justify-center text-ink"
        style={{ background: g.bg, borderRadius: 0 }}
      >
        <span className="font-display font-black text-xl">{g.cn}</span>
      </div>
    </div>
  );
}

/* ---------- 动画卡 ---------- */
function AnimCard({ a }: { a: typeof ANIMATIONS[number] }) {
  // 6 种动效对应不同实现
  return (
    <div className="aspect-[4/3] flex items-center justify-center p-4 bg-bone/5">
      <div className="w-full h-full flex items-center justify-center">
        {a.t === 'draw' && (
          <div className="w-full h-0.5 bg-volt" style={{ animation: 'draw 2s ease-in-out infinite' }} />
        )}
        {a.t === 'dash' && (
          <div className="w-full h-0.5 border-t-2 border-dashed border-volt" style={{ animation: 'dash 1s linear infinite' }} />
        )}
        {a.t === 'glow' && (
          <div className="w-1/2 h-1/2 border-2 border-volt" style={{ animation: 'glow 1.6s ease-in-out infinite' }} />
        )}
        {a.t === 'pulse' && (
          <div className="w-1/2 h-1/2 border-2 border-volt" style={{ animation: 'pulse 1.2s ease-in-out infinite' }} />
        )}
        {a.t === 'rotate' && (
          <div className="w-1/2 h-1/2" style={{
            background: 'conic-gradient(from 0deg, #f0ff00, #ff3da5, #00e5ff, #9b5cff, #f0ff00)',
            animation: 'rot 3s linear infinite',
            maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
            WebkitMaskComposite: 'xor',
          }} />
        )}
        {a.t === 'gradient' && (
          <div className="w-full h-2" style={{
            background: 'linear-gradient(90deg, #f0ff00, #ff3da5, #00e5ff, #f0ff00)',
            backgroundSize: '200% 100%',
            animation: 'flow 3s linear infinite',
          }} />
        )}
        {a.t === 'flow' && (
          <div className="w-full h-2" style={{
            background: 'linear-gradient(90deg, #f0ff00, #ff3da5, #00e5ff, #f0ff00)',
            backgroundSize: '200% 100%',
            animation: 'flow 3s linear infinite',
          }} />
        )}
      </div>
    </div>
  );
}

/* ---------- 装饰卡 ---------- */
function DecorCard({ d }: { d: typeof DECORATIVE[number] }) {
  const styles: React.CSSProperties = {};
  if (d.t === 'corner')    styles.clipPath = 'polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)';
  if (d.t === 'arrow')     styles.clipPath = 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)';
  if (d.t === 'tag')       styles.clipPath = 'polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)';
  if (d.t === 'double')    { /* shadow on outer + inner border */ }
  if (d.t === 'torn')      styles.maskImage = 'linear-gradient(90deg, transparent 5%, black 5%, black 95%, transparent 95%)';
  if (d.t === 'asymmetric')styles.borderWidth = '8px 2px 2px 8px';
  return (
    <div className="aspect-[4/3] flex items-center justify-center p-4 bg-bone/5">
      <div
        className="w-3/4 h-2/3 border-2 border-volt flex items-center justify-center font-display font-black text-sm"
        style={styles}
      >
        {d.cn}
      </div>
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function Borders() {
  const [sec, setSec] = useState<Section>('basic');

  return (
    <div>
      {/* HERO - 3x3 母格 (标题 2, 当前节概览 1) */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4 relative">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Frame size={12} />
              <span>// BORDERS · 边界设计 · 9 大类 × 30+ 变体 / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">BORDER</span>
              <span className="block text-volt">CRAFT.</span>
            </h1>
            <p className="mt-6 text-bone/80 max-w-2xl">
              边界是工坊里最微小的决定，但放在一起就是 9×9 的视觉语言。
              9 大类：基础风格 / 圆角 / 宽度 / 颜色 / 渐变 / 动画 / 装饰 / 方向 / 实战。
            </p>
          </div>
          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit">
            <div className="font-mono text-[10px] text-bone/60 mb-2">▸ 9 SECTIONS / 9 大类</div>
            <div className="grid grid-cols-3 gap-1">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSec(s.id)}
                  className={`border-2 p-1.5 text-left transition-colors ${sec === s.id ? 'border-volt bg-volt/5' : 'border-bone/20 hover:border-bone/50'}`}
                >
                  <div className="font-display font-black text-base text-volt">{String(i + 1).padStart(2, '0')}</div>
                  <div className="font-mono text-[9px] text-bone/70">{s.en}</div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* 9 SECTIONS TABS - 9 大类切换 */}
      <section className="border-b-2 border-bone/20 sticky top-[108px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex gap-1 overflow-x-auto">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSec(s.id)}
              className={`px-3 py-1.5 font-mono text-[10px] whitespace-nowrap border-2 transition-colors ${sec === s.id ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}
            >
              <span className="font-bold">{String(i + 1).padStart(2, '0')}</span> · {s.en} · <span className="opacity-70">{s.cn}</span>
            </button>
          ))}
        </div>
      </section>

      {/* A. 基础风格 9 种 */}
      {sec === 'basic' && (
        <Section title="9 基础风格" en="9 STYLES" desc="border-style 9 种取值 — solid / dashed / dotted / double / groove / ridge / inset / outset / none">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {STYLES.map(s => (
              <Demo key={s.v} label={s.v.toUpperCase()} cn={s.cn} code={`border: 4px ${s.css} #f0ff00;`}>
                <div className="w-3/4 h-3/4" style={{ border: `4px ${s.css} #f0ff00` }} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* B. 圆角 9 种 */}
      {sec === 'radius' && (
        <Section title="9 圆角" en="9 RADIUS" desc="border-radius 9 档 — 0 / 2 / 4 / 6 / 8 / 12 / 16 / 24 / 9999">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {RADII.map(r => (
              <Demo key={r.v} label={r.v} cn={r.cn} code={`border-radius: ${r.v};`}>
                <div className="w-3/4 h-3/4 bg-volt" style={{ borderRadius: r.v }} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* C. 宽度 9 种 */}
      {sec === 'width' && (
        <Section title="9 宽度" en="9 WIDTHS" desc="border-width 9 档 — 1 / 2 / 3 / 4 / 6 / 8 / 10 / 12 / 16 px">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {WIDTHS.map(w => (
              <Demo key={w} label={`${w}px`} cn={`width ${w}`} code={`border: ${w}px solid #f0ff00;`}>
                <div className="w-3/4 h-3/4" style={{ border: `${w}px solid #f0ff00` }} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* D. 颜色 9 种 */}
      {sec === 'color' && (
        <Section title="9 颜色" en="9 COLORS" desc="6 主题色 × 3 形态 — 实色 / 透明 / 双重">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {COLORS.map(c => (
              <Demo key={c.id} label={c.cn} cn={`color ${c.id}`} code={`border: 4px solid ${c.fg};`}>
                <div className="w-3/4 h-3/4" style={{ border: `4px solid ${c.fg}`, background: c.bg }} />
              </Demo>
            ))}
            <Demo label="双色" cn="dual-color" code={`border: 4px solid #f0ff00; border-right-color: #ff3da5;`}>
              <div className="w-3/4 h-3/4" style={{ border: '4px solid #f0ff00', borderRightColor: '#ff3da5' }} />
            </Demo>
            <Demo label="半透" cn="rgba" code={`border: 4px solid rgba(240,255,0,.5);`}>
              <div className="w-3/4 h-3/4" style={{ border: '4px solid rgba(240,255,0,.5)' }} />
            </Demo>
            <Demo label="虚实混" cn="mixed" code={`border: 4px solid #00e5ff; border-bottom-style: dashed;`}>
              <div className="w-3/4 h-3/4" style={{ border: '4px solid #00e5ff', borderBottomStyle: 'dashed' }} />
            </Demo>
          </div>
        </Section>
      )}

      {/* E. 渐变 6 种 */}
      {sec === 'gradient' && (
        <Section title="6 渐变" en="6 GRADIENTS" desc="linear / conic / radial 边框 — 使用 background-origin + padding 技巧">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {GRADIENTS.map(g => (
              <Demo key={g.t} label={g.t} cn={g.cn}>
                <GradientCard g={g} />
              </Demo>
            ))}
          </div>
          <div className="mt-6 border-2 border-bone/30 bg-ink p-4">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 渐变边框技巧：background-clip + 双层</div>
            <pre className="font-mono text-[10px] text-bone/80 whitespace-pre-wrap">
{`.gradient-border {
  border: 4px solid transparent;
  background:
    linear-gradient(black, black) padding-box,
    linear-gradient(45deg, #f0ff00, #ff3da5) border-box;
  border-radius: 8px;
}`}
            </pre>
          </div>
        </Section>
      )}

      {/* F. 动画 6 种 */}
      {sec === 'anim' && (
        <Section title="6 动画" en="6 ANIMATIONS" desc="draw / dash / glow / pulse / rotate / flow — @keyframes">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {ANIMATIONS.map(a => (
              <Demo key={a.t} label={a.t} cn={a.cn}>
                <AnimCard a={a} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* G. 装饰 6 种 */}
      {sec === 'decorative' && (
        <Section title="6 装饰" en="6 DECORATIVE" desc="corner / arrow / tag / double / torn / asymmetric">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {DECORATIVE.map(d => (
              <Demo key={d.t} label={d.t} cn={d.cn}>
                <DecorCard d={d} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* H. 方向 8 种 */}
      {sec === 'direction' && (
        <Section title="8 方向" en="8 DIRECTIONS" desc="all / top / right / bottom / left / x / y / t-only">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1.5">
            {DIRECTIONS.map(d => (
              <Demo key={d.t} label={d.t} cn={d.cn} code={d.css + ';'}>
                <DirCard d={d} />
              </Demo>
            ))}
          </div>
        </Section>
      )}

      {/* I. 实战 9 例 */}
      {sec === 'real' && (
        <Section title="9 实战" en="9 REAL CASES" desc="9 张真实使用边界的设计卡 — 复制即用">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {REALS.map(r => (
              <div key={r.t} className="border-2 border-bone/20 hover:border-bone transition-colors">
                <RealCard r={r} />
                <div className="border-t-2 border-bone/20 px-2 py-1.5">
                  <div className="font-mono text-[10px] font-bold text-volt">{r.t}</div>
                  <div className="font-mono text-[9px] text-bone/50">{r.cn}</div>
                  <div className="font-mono text-[9px] text-bone/70 mt-1 truncate">{r.border}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 9 守则对照（贯通 Standards B） */}
      <section className="border-t-2 border-bone/20 px-6 py-10 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 9 守则 · 边界设计的 9 DO / 9 DON'T 速查</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border-2 border-cyan/40 p-3">
              <div className="font-mono text-[10px] text-cyan font-bold mb-2">9 DO</div>
              <ol className="font-mono text-[10px] space-y-1 text-bone/80">
                <li>01 · 用 2-4px 边框作为默认</li>
                <li>02 · 圆角与字号成正比（字大角大）</li>
                <li>03 · 颜色与 fg/bg 对比度 ≥ 3:1</li>
                <li>04 · 双线（double）至少 3px 才有效果</li>
                <li>05 · dashed/dotted 与细线 1-2px 配对</li>
                <li>06 · 用 box-shadow 模拟 outline</li>
                <li>07 · 渐变边框用 background-clip 技巧</li>
                <li>08 · focus-visible 必须有清晰边界反馈</li>
                <li>09 · 边界宽度遵守 4 / 8 / 12 节奏</li>
              </ol>
            </div>
            <div className="border-2 border-pink/40 p-3">
              <div className="font-mono text-[10px] text-pink font-bold mb-2">9 DON'T</div>
              <ol className="font-mono text-[10px] space-y-1 text-bone/80">
                <li>01 · 避免 border-width 1px + 1px 错位</li>
                <li>02 · 不要混用 dashed 和 dotted</li>
                <li>03 · 不要 4 边不同颜色（除非刻意）</li>
                <li>04 · 不要 4 边不同宽度（除非刻意）</li>
                <li>05 · 不要 4 边不同 style（除非刻意）</li>
                <li>06 · 不要在 input 用 ridge/groove/inset</li>
                <li>07 · 不要用 9999px 在方块元素上</li>
                <li>08 · 不要同时使用 border + outline</li>
                <li>09 · 不要用 rgba(0,0,0,.1) 浅边框</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes draw { 0%{transform:scaleX(0)} 50%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
        @keyframes dash { to { background-position: 24px 0; } }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 #f0ff00} 50%{box-shadow:0 0 16px #f0ff00} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes rot { to { transform: rotate(360deg); } }
        @keyframes flow { to { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}

function Section({ title, en, desc, children }: { title: string; en: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="px-6 py-10 border-b-2 border-bone/20">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono text-xs text-bone/60 mb-1">▸ {en}</div>
        <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">{title}</h2>
        <p className="text-bone/60 text-sm mt-1">{desc}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
