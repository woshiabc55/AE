import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Ruler, Copy, Check } from 'lucide-react';
import { Tag, TAG_META, type TagCategory } from '../components/Tag';

/* ====================================================================
   TOKEN FORGE · 令牌工坊
   ─────────────────────────────────────────────────────────────
   9 令牌族 × 9 阶 = 81 原子
   配色 / 间距 / 字号 / 圆角 / 阴影 / Z 轴 / 动效 / 布局 / 尺寸
==================================================================== */

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

/* 9 阶 token 序列 (通用阶梯 0-8) */
const STEPS = ['00', '01', '02', '03', '04', '05', '06', '07', '08'];

interface TokenFamily {
  id: string; n: string; name: string; cn: string; en: string; tag: TagCategory;
  cssVar: string;       // CSS 变量名
  unit: string;         // 单位
  values: string[];     // 9 阶值
  preview: (v: string, i: number, m: { hex: string; ink: string }) => React.ReactNode;
  desc: string;
}

const FAMILIES: TokenFamily[] = [
  {
    id: 'F1', n: '01', name: 'COLOR', cn: '颜色', en: 'PALETTE', tag: 'color',
    cssVar: '--color-scale', unit: '',
    values: ['#0a0a0a', '#1a1a1a', '#333333', '#555555', '#888888', '#aaaaaa', '#cccccc', '#e6e6e6', '#f5f1e8'],
    desc: '9 阶灰度 + 主题色',
    preview: (v) => <div className="w-full h-full" style={{ background: v }} />,
  },
  {
    id: 'F2', n: '02', name: 'SPACING', cn: '间距', en: 'GAP', tag: 'layout',
    cssVar: '--space', unit: 'px',
    values: ['0', '2', '4', '8', '12', '16', '24', '32', '64'],
    desc: '0/2/4/8/12/16/24/32/64',
    preview: (v) => <div className="w-full h-full flex items-end"><div style={{ width: `${v}px`, background: SAFE('layout').hex, height: '4px' }} /></div>,
  },
  {
    id: 'F3', n: '03', name: 'TYPE', cn: '字号', en: 'FONT-SIZE', tag: 'type',
    cssVar: '--text', unit: 'px',
    values: ['10', '11', '12', '14', '16', '20', '28', '40', '64'],
    desc: '10/11/12/14/16/20/28/40/64',
    preview: (v) => <div className="w-full h-full flex items-center justify-center font-display font-black leading-none" style={{ fontSize: `${Math.min(parseInt(v), 36)}px` }}>Aa</div>,
  },
  {
    id: 'F4', n: '04', name: 'RADIUS', cn: '圆角', en: 'BORDER-RADIUS', tag: 'visual',
    cssVar: '--radius', unit: 'px',
    values: ['0', '2', '4', '6', '8', '12', '16', '24', '9999'],
    desc: '0-9999px (含胶囊)',
    preview: (v) => <div className="w-full h-full" style={{ background: SAFE('visual').hex, borderRadius: `${v === '9999' ? 50 : parseInt(v) * 2}px` }} />,
  },
  {
    id: 'F5', n: '05', name: 'SHADOW', cn: '阴影', en: 'BOX-SHADOW', tag: 'visual',
    cssVar: '--shadow', unit: '',
    values: [
      'none',
      '0 1px 2px rgba(0,0,0,.1)',
      '0 2px 4px rgba(0,0,0,.15)',
      '0 4px 8px rgba(0,0,0,.2)',
      '0 6px 12px rgba(0,0,0,.25)',
      '0 8px 16px rgba(0,0,0,.3)',
      '0 12px 24px rgba(0,0,0,.35)',
      '0 16px 32px rgba(0,0,0,.4)',
      '0 24px 48px rgba(0,0,0,.5)',
    ],
    desc: '0-24px × 2 模糊',
    preview: (v) => <div className="w-full h-full flex items-center justify-center"><div className="w-10 h-10 bg-volt" style={{ boxShadow: v }} /></div>,
  },
  {
    id: 'F6', n: '06', name: 'Z-INDEX', cn: '层级', en: 'STACKING', tag: 'layout',
    cssVar: '--z', unit: '',
    values: ['-1', '0', '1', '10', '20', '30', '50', '100', '9999'],
    desc: '-1 / 0 / 1 / 10-9999',
    preview: (v) => {
      const m = SAFE('layout');
      return (
        <div className="w-full h-full relative">
          <div className="absolute" style={{ left: `${parseInt(v) % 60}%`, top: '20%', width: 18, height: 18, background: m.hex, zIndex: parseInt(v) }} />
        </div>
      );
    },
  },
  {
    id: 'F7', n: '07', name: 'MOTION', cn: '动效', en: 'DURATION', tag: 'motion',
    cssVar: '--dur', unit: 'ms',
    values: ['0', '50', '100', '150', '200', '300', '500', '800', '1500'],
    desc: '0-1500ms 9 阶',
    preview: (v) => {
      const dur = parseInt(v);
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: SAFE('motion').hex,
              animation: dur > 0 ? `tf-pulse ${dur}ms ease-in-out infinite` : 'none',
            }}
          />
        </div>
      );
    },
  },
  {
    id: 'F8', n: '08', name: 'LAYOUT', cn: '布局', en: 'GRID-SPAN', tag: 'layout',
    cssVar: '--col-span', unit: '/3',
    values: ['1/3', '1/3', '1/3', '2/3', '2/3', '2/3', '3/3', '3/3', '3/3'],
    desc: '1/3 跨 1·2·3 列',
    preview: (v) => {
      const span = parseInt(v);
      return (
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
          <div className="col-span-3 bg-bone/10 rounded-sm" />
          <div className={`col-span-${span} bg-volt rounded-sm h-2 self-center`} style={{ gridColumn: `span ${span} / span ${span}` }} />
        </div>
      );
    },
  },
  {
    id: 'F9', n: '09', name: 'SIZING', cn: '尺寸', en: 'SIZES', tag: 'visual',
    cssVar: '--size', unit: 'px',
    values: ['12', '16', '20', '24', '32', '40', '56', '80', '120'],
    desc: '12-120px 容器',
    preview: (v) => <div className="w-full h-full flex items-center justify-center"><div className="border-2 border-volt" style={{ width: `${Math.min(parseInt(v), 60)}px`, height: `${Math.min(parseInt(v), 60)}px` }} /></div>,
  },
];

/* 复制小工具 */
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = (text: string, k: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(k);
      setTimeout(() => setCopiedKey(null), 1200);
    } catch {}
  };
  return { copiedKey, copy };
}

export default function TokenForge() {
  const [activeFamily, setActiveFamily] = useState<string>('F1');
  const { copiedKey, copy } = useCopy();
  const family = FAMILIES.find(f => f.id === activeFamily) ?? FAMILIES[0];

  // 注入 motion preview keyframes
  useMemo(() => {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('token-forge-kf');
    if (!el) {
      el = document.createElement('style');
      el.id = 'token-forge-kf';
      document.head.appendChild(el);
    }
    el.textContent = `@keyframes tf-pulse { 0%,100% { opacity: .3; } 50% { opacity: 1; } }`;
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-plum mb-3 flex items-center gap-2">
              <Ruler size={12} />
              <span>// TOKEN FORGE · 令牌工坊 / 9 FAMILIES × 9 STEPS / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">TOKEN</span>
              <span className="block relative">
                <span className="relative z-10">FORGE.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-plum -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              9 令牌族 · 9 阶 ·<span className="text-plum font-bold"> 81 原子</span>。
              所有变量都通过<Link to="/themes" className="text-volt font-bold"> CSS 变量</Link>驱动,
              主题切换 = 替换 81 个值。
            </p>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9 令牌族 / 81 阶</div>
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
                    <code className="font-mono text-[9px] text-bone/40">{f.cssVar}</code>
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
                onClick={() => setActiveFamily(f.id)}
                className={`px-2 py-1 font-mono text-[10px] border-2 flex items-center gap-1 ${active ? 'border-volt' : 'border-bone/30 hover:border-bone'}`}
                style={active ? { background: m.hex, color: m.ink, borderColor: m.hex } : {}}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 当前族:9 阶矩阵 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ {family.name} · 9 STEPS · {family.cssVar}</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                <span style={{ color: SAFE(family.tag).hex }}>{family.name}</span> · {family.cn} · {family.en}
              </h2>
              <p className="text-bone/70 text-sm mt-1">{family.desc}</p>
            </div>
            <Tag cat={family.tag} size="md" variant="outline" showId showEn />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            {family.values.map((v, i) => {
              const m = SAFE(family.tag);
              const k = `${family.id}-${i}`;
              const cssText = `${family.cssVar}-${STEPS[i]}: ${v}${family.unit};`;
              return (
                <button
                  key={k}
                  onClick={() => copy(cssText, k)}
                  className="group border-2 border-bone/30 p-2 hover:border-volt transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 border border-bone/30">{STEPS[i]}</span>
                      <span className="font-mono text-[9px] text-bone/50">step {i + 1}/9</span>
                    </div>
                    {copiedKey === k ? <Check size={10} className="text-perf" /> : <Copy size={10} className="text-bone/40 opacity-0 group-hover:opacity-100" />}
                  </div>
                  <div className="h-16 border border-bone/20 mb-2 bg-bone/5">
                    {family.preview(v, i, m)}
                  </div>
                  <code className="block font-mono text-[9px] text-volt truncate">{cssText}</code>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9 族 9×9 全矩阵 */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 9×9 GRID / 81 原子全矩阵</div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[9px]">
              <thead>
                <tr>
                  <th className="text-left text-bone/50 p-1.5 sticky left-0 bg-ink/95">FAMILY</th>
                  {STEPS.map(s => (
                    <th key={s} className="text-bone/50 p-1.5 text-center">step {s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map(f => {
                  const m = SAFE(f.tag);
                  return (
                    <tr key={f.id} className="border-t border-bone/20">
                      <td className="p-1.5 sticky left-0 bg-ink/95">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold px-1.5 py-0.5" style={{ background: m.hex, color: m.ink }}>{f.n}</span>
                          <span className="font-display font-black text-sm">{f.name}</span>
                        </div>
                      </td>
                      {f.values.map((v, i) => (
                        <td key={i} className="p-1.5 text-center text-bone/80">
                          <div className="h-6 w-full mb-1 border border-bone/20">
                            {f.preview(v, i, m)}
                          </div>
                          <code className="text-[8px] text-volt">{v}{f.unit}</code>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CSS 变量导出 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ CSS VARIABLES / 完整令牌导出</div>
          <pre className="border-2 border-bone/30 bg-ink p-4 font-mono text-[10px] leading-[1.5] text-bone/80 overflow-x-auto">
{`:root {
${FAMILIES.map(f =>
  f.values.map((v, i) => `  ${f.cssVar}-${STEPS[i]}: ${v}${f.unit};`).join('\n')
).join('\n')}
}`}
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 9 应当 · 令牌</div>
            <ol className="font-mono text-xs space-y-1 text-bone/80">
              <li>01 · 9 阶足够覆盖所有场景</li>
              <li>02 · 阶间比例保持 1.5x 或 2x</li>
              <li>03 · 0 阶 = 初始,8 阶 = 极端</li>
              <li>04 · 任何值都需经过 9 道门</li>
              <li>05 · 变量名稳定,值可变</li>
              <li>06 · 不在 inline 写裸值</li>
              <li>07 · 主题切换 = 替换 81 变量</li>
              <li>08 · 复制即用,无需引入构建</li>
              <li>09 · 9×9 全矩阵一眼可比</li>
            </ol>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想替换一族令牌?</h3>
            <p className="text-bone/70 text-sm mt-2">
              任何族 9 阶都可整组复制。Filter 切换可只看一族 9 件。
              返回<Link to="/productions" className="text-plum font-bold"> 制作中心</Link>看其他 8 座工坊。
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
              // TOKEN FORGE V.10 · 9 FAMILIES · 9 STEPS · 81 ATOMS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
