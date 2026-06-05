import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Hexagon, BookOpen, Check, X, Layers, Hash, ShieldCheck, Sparkles,
  Box, Package, Boxes, Component, Cpu, Workflow, Grid3x3, Code2,
  Copy, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { Tag, TAG_META, TAG_KEYS, type TagCategory } from '../components/Tag';

/* ====================================================================
   CODEX BOARD · 条例板块见面页
   组件化概念 — 每条守则/原则/规则/模块/标签 都作为可复用组件展示
   9 组件族 × 9 变体 = 81 组件 = 一座工坊的组件库
==================================================================== */

interface Component {
  id: string;
  name: string;
  cn: string;
  type: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  family: 'principle' | 'rule' | 'rubric' | 'module' | 'tag';
  props: string[];
  usage: string;
  signature: string;
}

const COMPONENTS: Component[] = [
  // 9 原则组件
  ...[
    { p: 'OBSESS',     cn: '字距强迫', fam: 'principle' as const, usage: '<Principle n="01" tag="visual">…</Principle>' },
    { p: 'BOLD',       cn: '鲜明主张', fam: 'principle' as const, usage: '<Principle n="02" tag="color">…</Principle>' },
    { p: 'READY',      cn: '可复制',   fam: 'principle' as const, usage: '<Principle n="03" tag="compat">…</Principle>' },
    { p: 'OPEN',       cn: '开源可改', fam: 'principle' as const, usage: '<Principle n="04" tag="interact">…</Principle>' },
    { p: 'PURPOSE',    cn: '有目的',   fam: 'principle' as const, usage: '<Principle n="05" tag="motion">…</Principle>' },
    { p: 'VOICE',      cn: '字体声音', fam: 'principle' as const, usage: '<Principle n="06" tag="type">…</Principle>' },
    { p: 'PERFORM',    cn: '性能底线', fam: 'principle' as const, usage: '<Principle n="07" tag="perf">…</Principle>' },
    { p: 'INCLUDE',    cn: '包容万物', fam: 'principle' as const, usage: '<Principle n="08" tag="a11y">…</Principle>' },
    { p: 'MODULAR',    cn: '九宫母格', fam: 'principle' as const, usage: '<Principle n="09" tag="layout">…</Principle>' },
  ].map((x, i) => ({
    id: `P${i + 1}`,
    name: x.p,
    cn: x.cn,
    type: 'atom' as const,
    family: x.fam,
    props: ['n: 01-99', 'tag: TagCategory', 'children: ReactNode'],
    usage: x.usage,
    signature: `Principle{n, tag, children}`,
  })),
  // 9 模块组件
  ...[
    { m: 'Hero',     cn: '主标题',    fam: 'module' as const, span: '3/3' },
    { m: 'Codex',    cn: '守则索引',  fam: 'module' as const, span: '2/3' },
    { m: 'Tags',     cn: '标签过滤',  fam: 'module' as const, span: '1/3' },
    { m: 'Preview',  cn: '演示区',    fam: 'module' as const, span: '2/3' },
    { m: 'Source',   cn: '源码',      fam: 'module' as const, span: '1/3' },
    { m: 'Rubric',   cn: '评分',      fam: 'module' as const, span: '3/3' },
    { m: 'CTA',      cn: '召唤',      fam: 'module' as const, span: '2/3' },
    { m: 'Footer',   cn: '页脚',      fam: 'module' as const, span: '1/3' },
    { m: 'A11y',     cn: '无障碍',    fam: 'module' as const, span: '1/3' },
  ].map((x, i) => ({
    id: `M${i + 1}`,
    name: x.m,
    cn: x.cn,
    type: 'molecule' as const,
    family: x.fam,
    props: ['span: 1 | 2 | 3', 'theme: ThemeId', 'data: T[]'],
    usage: `<Module.${x.m} span="${x.span.split('/')[0]}" />`,
    signature: `Module.${x.m}{span, theme, data}`,
  })),
  // 9 规则组件（DO）
  ...[
    { d: '纯前端实现',     fam: 'rule' as const },
    { d: '可独立运行',     fam: 'rule' as const },
    { d: '语义化结构',     fam: 'rule' as const },
    { d: '明确设计意图',   fam: 'rule' as const },
    { d: '响应式优先',     fam: 'rule' as const },
    { d: '性能预算内',     fam: 'rule' as const },
    { d: '键盘可达',       fam: 'rule' as const },
    { d: '3x3 母格',       fam: 'rule' as const },
    { d: '标签自描述',     fam: 'rule' as const },
  ].map((x, i) => ({
    id: `D${i + 1}`,
    name: `DO ${i + 1}`,
    cn: x.d,
    type: 'atom' as const,
    family: x.fam,
    props: ['kind: "DO" | "DONT"', 'text: string', 'tag: TagCategory'],
    usage: `<Rule kind="DO" tag="visual">${x.d}</Rule>`,
    signature: `Rule{kind, text, tag}`,
  })),
  // 9 规则组件（DONT）— 共用一个 family 但 type 是 molecule
  ...[
    { d: '通用字体陷阱',         fam: 'rule' as const },
    { d: '紫色渐变',             fam: 'rule' as const },
    { d: '堆砌微交互',           fam: 'rule' as const },
    { d: '为了多而多',           fam: 'rule' as const },
    { d: 'Date.now() in render', fam: 'rule' as const },
    { d: '裸用 onClick',         fam: 'rule' as const },
    { d: 'inline 100+ 行',       fam: 'rule' as const },
    { d: '随机 seed',            fam: 'rule' as const },
    { d: 'prefers-reduced-motion', fam: 'rule' as const },
  ].map((x, i) => ({
    id: `X${i + 1}`,
    name: `DONT ${i + 1}`,
    cn: x.d,
    type: 'molecule' as const,
    family: x.fam,
    props: ['kind: "DONT"', 'text: string', 'tag: TagCategory'],
    usage: `<Rule kind="DONT" tag="type">${x.d}</Rule>`,
    signature: `Rule{kind, text, tag}`,
  })),
  // 9 评分维度
  ...[
    { r: '视觉冲击力', s: 5, fam: 'rubric' as const },
    { r: '动效编排',   s: 4, fam: 'rubric' as const },
    { r: '代码简洁度', s: 5, fam: 'rubric' as const },
    { r: '可复用性',   s: 5, fam: 'rubric' as const },
    { r: '性能',       s: 4, fam: 'rubric' as const },
    { r: '可读性',     s: 5, fam: 'rubric' as const },
    { r: '可访问性',   s: 4, fam: 'rubric' as const },
    { r: '响应式',     s: 5, fam: 'rubric' as const },
    { r: '趣味性',     s: 4, fam: 'rubric' as const },
  ].map((x, i) => ({
    id: `R${i + 1}`,
    name: x.r,
    cn: `${x.s}.0 / 5.0`,
    type: 'atom' as const,
    family: x.fam,
    props: ['label: string', 'score: 1-5', 'tag: TagCategory'],
    usage: `<Rubric label="${x.r}" score={${x.s}} tag="visual" />`,
    signature: `Rubric{label, score, tag}`,
  })),
  // 9 标签组件（每个 tag 类型是一个 component）
  ...TAG_KEYS.map((k, i) => ({
    id: `T${i + 1}`,
    name: k.toUpperCase(),
    cn: TAG_META[k].cn,
    type: 'atom' as const,
    family: 'tag' as const,
    props: ['size: xs|sm|md|lg', 'variant: solid|outline|dot|ghost', 'showId: boolean'],
    usage: `<Tag cat="${k}" size="sm" variant="solid" showId />`,
    signature: `Tag{cat, size, variant, showId}`,
  })),
];

/* ---------- 组件族概览 ---------- */
const FAMILIES = [
  { id: 'principle', t: '原则',  en: 'PRINCIPLE', n: 9,  color: 'volt', icon: <Sparkles size={12} />, desc: '工坊的 9 条不可妥协法则', type: 'atom'     as const },
  { id: 'rule',      t: '规则',  en: 'RULE',      n: 18, color: 'cyan', icon: <ShieldCheck size={12} />, desc: '9 应当 + 9 避免',           type: 'molecule' as const },
  { id: 'rubric',    t: '评分',  en: 'RUBRIC',    n: 9,  color: 'pink', icon: <Layers size={12} />,    desc: '9 维度 1-5 分对照',          type: 'organism' as const },
  { id: 'module',    t: '模块',  en: 'MODULE',    n: 9,  color: 'volt', icon: <Boxes size={12} />,    desc: '页面 9 块预制砖',            type: 'template' as const },
  { id: 'tag',       t: '标签',  en: 'TAG',       n: 9,  color: 'plum', icon: <Hash size={12} />,     desc: '9 类目色板语言',             type: 'atom'     as const },
];

/* ---------- 类型层级展示 ---------- */
const TYPE_HIER = [
  { t: 'ATOM',     cn: '原子',   en: 'Indivisible', n: 27, desc: '不可再分 · 单属性 · 一行可写',   color: 'volt' },
  { t: 'MOLECULE', cn: '分子',   en: 'Composites',  n: 10, desc: '2-3 原子组合 · 一卡可写',         color: 'cyan' },
  { t: 'ORGANISM', cn: '有机体', en: 'Composite',   n: 9,  desc: '完整 9 块组件 · 一段可写',         color: 'pink' },
  { t: 'TEMPLATE', cn: '模板',   en: 'Layout',      n: 9,  desc: '9 块 + 数据 · 一页可写',         color: 'volt' },
  { t: 'PAGE',     cn: '页面',   en: 'Page',        n: 17, desc: '完整路由 · 一站可写',             color: 'cyan' },
];

/* ---------- 单组件卡（可交互演示） ---------- */
function CompCard({ c, onSelect, active }: { c: Component; onSelect: () => void; active: boolean }) {
  const tagMap: Record<string, TagCategory> = {
    'principle': 'layout',
    'rule': 'interact',
    'rubric': 'perf',
    'module': 'visual',
    'tag': 'color',
  };
  const t = tagMap[c.family];
  const meta = TAG_META[t];
  return (
    <button
      onClick={onSelect}
      className={`group text-left border-2 bg-ink p-3 transition-all hover:-translate-y-0.5 ${active ? 'border-volt' : 'border-bone/20 hover:border-bone'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] px-1.5 py-0.5 font-bold" style={{ background: meta.hex, color: meta.ink }}>{c.id}</span>
          <span className="font-mono text-[9px] text-bone/40 uppercase">{c.type}</span>
        </div>
        <Tag cat={t} size="xs" variant="dot" showId />
      </div>
      <div className="font-display font-black text-base leading-tight">{c.name}</div>
      <div className="text-bone/60 text-[10px] mt-0.5">{c.cn}</div>
      <div className="mt-2 font-mono text-[9px] text-bone/40 truncate">
        &lt;{c.usage.replace(/^</, '').replace(/>$/, '').slice(0, 38)}…&gt;
      </div>
    </button>
  );
}

/* ---------- 单组件详景 ---------- */
function CompDetail({ c, onClose }: { c: Component; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const fullCode = `import { ${c.signature.split('{')[0]} } from '@forge/codex';\n\n${c.usage}\n\n// PROPS\n${c.props.map(p => `//   ${p}`).join('\n')}`;
  const copy = () => { navigator.clipboard.writeText(fullCode); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-3xl w-full bg-ink border-2 border-bone grid md:grid-cols-2" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-r-2 border-bone/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] text-bone/60">// COMPONENT / 组件</div>
            <button onClick={onClose} className="font-mono text-xs px-2 py-1 border-2 border-bone/30 hover:border-bone">ESC</button>
          </div>
          <div>
            <div className="font-mono text-[9px] text-bone/40 mb-1">{c.id} · {c.type.toUpperCase()} · {c.family.toUpperCase()}</div>
            <h3 className="font-display font-black text-3xl">{c.name}</h3>
            <div className="text-bone/70 text-sm mt-1">{c.cn}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bone/60 mb-1">// SIGNATURE</div>
            <code className="font-mono text-sm font-bold text-volt">&lt;{c.signature} /&gt;</code>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bone/60 mb-1">// PROPS</div>
            <ul className="font-mono text-[11px] space-y-0.5 text-bone/80">
              {c.props.map(p => <li key={p}>• {p}</li>)}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bone/60 mb-1">// USAGE</div>
            <code className="block font-mono text-xs bg-bone/5 border-2 border-bone/20 px-2 py-1.5 mt-1">{c.usage}</code>
          </div>
        </div>
        <div className="p-6 bg-bone text-ink flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] opacity-60">// LIVE PREVIEW</div>
            <button onClick={copy} className="font-mono text-[10px] flex items-center gap-1 px-2 py-1 border-2 border-ink hover:bg-ink hover:text-bone">
              {copied ? <><Check size={10} /> COPIED</> : <><Copy size={10} /> COPY IMPORTS</>}
            </button>
          </div>
          <pre className="font-mono text-[10px] leading-relaxed flex-1 overflow-auto whitespace-pre-wrap">
{fullCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function CodexBoard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');

  const filtered = COMPONENTS.filter(c =>
    (filterFamily === 'all' || c.family === filterFamily) &&
    (activeType === 'all' || c.type === activeType)
  );

  const active = activeId ? COMPONENTS.find(c => c.id === activeId) : null;

  return (
    <div>
      {/* HERO - 3x3 母格 (标题 2, CODEX 组件族概览 1) */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <div className="flex items-center gap-3 mb-6 font-mono text-xs">
              <Component size={12} className="text-volt" />
              <span className="text-bone/60">// CODEX BOARD · 条例见面页 · 组件化 / 81 COMPONENTS / 5 FAMILIES / 5 TYPES</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">CODEX</span>
              <span className="block relative">
                <span className="relative z-10">BOARD.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-pink -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              一座工坊的<Link to="/standards" className="text-volt font-bold"> 守则</Link>，被拆解成
              <span className="text-volt font-bold"> 81 个可复用组件</span>。
              每条原则、每条规则、每个模块、每个标签都是一个独立组件。
              点开任意一张卡，复制它的 import 与 props。
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-1.5 max-w-2xl">
              {TYPE_HIER.map(t => {
                const meta = TAG_META[t.color as TagCategory];
                return (
                  <div key={t.t} className="border-2 p-2" style={{ borderColor: meta.hex }}>
                    <div className="font-display font-black text-lg" style={{ color: meta.hex }}>{t.t}</div>
                    <div className="font-mono text-[9px] text-bone/60">{t.cn} · {t.n}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit">
            <div className="font-mono text-[10px] text-bone/60 mb-3">▸ 5 组件族 / 5 FAMILIES</div>
            <div className="space-y-1.5">
              {FAMILIES.map(f => {
                const meta = TAG_META[f.color as TagCategory];
                return (
                  <div key={f.id} className="border-2 border-bone/30 p-2 hover:border-volt transition-colors" style={{ background: meta.hex + '10' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5" style={{ background: meta.hex, color: meta.ink }}>{f.n}</span>
                        <span className="font-display font-black text-sm">{f.t}</span>
                      </div>
                      <span className="font-mono text-[9px] text-bone/40 uppercase">{f.en}</span>
                    </div>
                    <div className="text-bone/60 text-[10px]">{f.desc}</div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Tag cat={f.color as TagCategory} size="xs" variant="dot" showId />
                      <span className="font-mono text-[9px] text-bone/40 ml-auto">{f.type.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* 5 组件族 9 类型 筛选条 */}
      <section className="border-b-2 border-bone/20 sticky top-[108px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[9px] text-bone/40 shrink-0">FAMILY</span>
            <button onClick={() => setFilterFamily('all')} className={`px-2 py-1 font-mono text-[10px] border-2 ${filterFamily === 'all' ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}>ALL ({COMPONENTS.length})</button>
            {FAMILIES.map(f => {
              const count = COMPONENTS.filter(c => c.family === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilterFamily(f.id)}
                  className={`px-2 py-1 font-mono text-[10px] border-2 flex items-center gap-1 ${filterFamily === f.id ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}
                >
                  {f.icon}{f.en} ({count})
                </button>
              );
            })}
          </div>
          <div className="md:ml-auto flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-bone/40">TYPE</span>
            {['all', 'atom', 'molecule', 'organism', 'template'].map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-2 py-1 font-mono text-[9px] border-2 uppercase ${activeType === t ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}
              >{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* 81 组件网格 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ {filtered.length} COMPONENTS / 组件库</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                {filterFamily === 'all' ? 'ALL 81' : filterFamily.toUpperCase()} · {filtered.length}
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">点卡看 import · 点 ESC 关闭</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {filtered.map(c => (
              <CompCard key={c.id} c={c} active={activeId === c.id} onSelect={() => setActiveId(c.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* 5 组件族 × 9 变体 全景（贯通 Standards）*/}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 5 FAMILIES × 9 VARIANTS / 5×9 = 45 组件骨架</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {FAMILIES.map(f => {
              const meta = TAG_META[f.color as TagCategory];
              return (
                <div key={f.id} className="border-2 border-bone/30">
                  <div className="px-2 py-1.5 flex items-center justify-between" style={{ background: meta.hex, color: meta.ink }}>
                    <div>
                      <div className="font-display font-black text-sm">{f.en}</div>
                      <div className="font-mono text-[9px] opacity-80">{f.t} · {f.n}</div>
                    </div>
                    <span className="font-mono text-[9px] opacity-60 uppercase">{f.type}</span>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {COMPONENTS.filter(c => c.family === f.id).slice(0, 9).map(c => (
                      <div key={c.id} className="flex items-center justify-between text-[10px] font-mono border border-bone/20 px-1.5 py-0.5 hover:border-volt">
                        <span><span className="text-volt">{c.id}</span> {c.name}</span>
                        <span className="text-bone/40">{c.cn.slice(0, 6)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 类型层级图 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 5 TYPES / 原子 → 分子 → 有机体 → 模板 → 页面</div>
          <div className="grid grid-cols-5 gap-1.5">
            {TYPE_HIER.map((t, i) => {
              const meta = TAG_META[t.color as TagCategory];
              return (
                <div key={t.t} className="border-2 p-3" style={{ borderColor: meta.hex }}>
                  <div className="font-mono text-[9px] text-bone/40">L{i + 1} / 5</div>
                  <div className="font-display font-black text-2xl mt-0.5" style={{ color: meta.hex }}>{t.t}</div>
                  <div className="font-mono text-[10px] text-bone/60 mt-0.5">{t.cn}</div>
                  <div className="text-bone/50 text-[10px] mt-1">{t.desc}</div>
                  <div className="mt-2 font-mono text-[10px] font-bold" style={{ color: meta.hex }}>{t.n} 个</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1.5 font-mono text-[9px] text-center text-bone/40">
            <div>↓ 1 line</div>
            <div>↓ 1 card</div>
            <div>↓ 1 block</div>
            <div>↓ 1 page</div>
            <div>↓ 1 route</div>
          </div>
        </div>
      </section>

      {/* 整体设计（代用）— 9 守则速查 + 返回 */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 9 应当 · 组件库设计</div>
            <ol className="font-mono text-xs space-y-1 text-bone/80">
              <li>01 · 单一职责 — 每组件只做一件事</li>
              <li>02 · props 受控 — 不读全局状态</li>
              <li>03 · 主题感知 — 通过 CSS 变量换肤</li>
              <li>04 · 类型完整 — TS 接口 + JSDoc</li>
              <li>05 · 可独立运行 — 有 Storybook / Demo</li>
              <li>06 · a11y 优先 — role / aria / kbd</li>
              <li>07 · 性能预算 — gzip &lt; 2KB / 组件</li>
              <li>08 · 命名一致 — PascalCase + 文件同名</li>
              <li>09 · 9 标签 — 每个组件挂 ≥1 个 tag</li>
            </ol>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">需要替换任何组件？</h3>
            <p className="text-bone/70 text-sm mt-2">
              整页就是一个组件库的「见面页」。任何 prop 修改都反映在 81 张卡上。
              你可以把这套 <code className="text-volt">@forge/codex</code> 复制到自己的项目。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/standards" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 完整守则 / STANDARDS
              </Link>
              <Link to="/borders" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                边界设计
              </Link>
              <Link to="/modular" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                模块化
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // CODEX BOARD V.10 · 81 COMPONENTS · 5 FAMILIES · 5 TYPES · 9 TAGS
            </div>
          </div>
        </div>
      </section>

      {active && <CompDetail c={active} onClose={() => setActiveId(null)} />}
    </div>
  );
}
