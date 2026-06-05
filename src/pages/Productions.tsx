import { Link } from 'react-router-dom';
import {
  Hexagon, Hammer, Wrench, Box, Component, Layers, Sparkles, Palette,
  Type, Move, Ruler, Image, Grid3x3, ArrowRight, BookOpen, Frame,
  LayoutGrid, MousePointer2, Hash, Boxes,
} from 'lucide-react';
import { Tag, TAG_META, TAG_KEYS, type TagCategory } from '../components/Tag';

/* ====================================================================
   PRODUCTIONS · 大规模制作中心
   ─────────────────────────────────────────────────────────────
   9 座工坊 × 9 件代表作 = 81 件产出
   每座工坊都是 9×9 矩阵,工坊内可独立进入完整页面
==================================================================== */

const SAFE = (k: string) => TAG_META[k as TagCategory] ?? { id: '??', cn: '?', en: '?', hex: '#888888', ink: '#0a0a0a' };

interface Workshop {
  id: string;
  n: string;
  t: string;          // 中名
  en: string;         // 英文
  desc: string;       // 描述
  href: string;       // 链接
  tag: TagCategory;   // 主标签
  icon: React.ReactNode;
  outputs: string[];  // 9 件代表作名
  status: 'shipped' | 'wip' | 'planned';
  count: number;
}

const WORKSHOPS: Workshop[] = [
  {
    id: 'W1', n: '01', t: '组件',   en: 'COMPONENTS',
    desc: '9 族 × 9 变体 = 81 UI 组件',
    href: '/forge/components', tag: 'visual',  icon: <Component size={14} />,
    outputs: ['Button', 'Card', 'Input', 'Modal', 'Nav', 'List', 'Form', 'Feedback', 'Media'],
    status: 'shipped', count: 81,
  },
  {
    id: 'W2', n: '02', t: '模式',   en: 'PATTERNS',
    desc: '9 类设计模式 × 9 变体 = 81 模式',
    href: '/forge/patterns', tag: 'layout',  icon: <LayoutGrid size={14} />,
    outputs: ['Container', 'Navigation', 'Data', 'Feedback', 'Input', 'Layout', 'Media', 'Type', 'Motion'],
    status: 'shipped', count: 81,
  },
  {
    id: 'W3', n: '03', t: '动效',   en: 'ANIMATIONS',
    desc: '9 类动效 × 9 曲线 = 81 动效语言',
    href: '/forge/animations', tag: 'motion', icon: <Move size={14} />,
    outputs: ['Enter', 'Exit', 'Transition', 'Attention', 'Loading', 'Scroll', 'Hover', 'Click', 'Idle'],
    status: 'shipped', count: 81,
  },
  {
    id: 'W4', n: '04', t: '令牌',   en: 'TOKENS',
    desc: '9 类设计令牌 × 9 阶 = 81 原子',
    href: '/forge/tokens', tag: 'color',   icon: <Ruler size={14} />,
    outputs: ['Color', 'Spacing', 'Type', 'Radius', 'Shadow', 'Z', 'Motion', 'Layout', 'Sizing'],
    status: 'shipped', count: 81,
  },
  {
    id: 'W5', n: '05', t: '版式',   en: 'TYPOGRAPHY',
    desc: '9 字体角色 × 9 排印变体 = 81',
    href: '/font-garden', tag: 'type',  icon: <Type size={14} />,
    outputs: ['Display', 'Heading', 'Body', 'Caption', 'Mono', 'Code', 'Label', 'Quote', 'Number'],
    status: 'wip', count: 81,
  },
  {
    id: 'W6', n: '06', t: '配色',   en: 'COLOR',
    desc: '9 主题色 × 9 灰阶 = 81 板',
    href: '/themes', tag: 'color',  icon: <Palette size={14} />,
    outputs: ['Primary', 'Secondary', 'Accent', 'Neutral', 'Success', 'Warning', 'Error', 'Info', 'Surface'],
    status: 'wip', count: 81,
  },
  {
    id: 'W7', n: '07', t: '图标',   en: 'ICONS',
    desc: '9 类目 × 9 描边 = 81 图标',
    href: '/forge/icons', tag: 'visual',  icon: <Hash size={14} />,
    outputs: ['Action', 'Nav', 'State', 'Media', 'Content', 'Social', 'System', 'Brand', 'Tool'],
    status: 'planned', count: 81,
  },
  {
    id: 'W8', n: '08', t: '布局',   en: 'LAYOUTS',
    desc: '9 骨架 × 9 区域 = 81 页面布局',
    href: '/modular', tag: 'layout',  icon: <Frame size={14} />,
    outputs: ['Hero', 'Codex', 'Tags', 'Preview', 'Source', 'Rubric', 'CTA', 'Footer', 'A11y'],
    status: 'wip', count: 81,
  },
  {
    id: 'W9', n: '09', t: '模板',   en: 'TEMPLATES',
    desc: '9 页面 × 9 套版 = 81 模板',
    href: '/forge/templates', tag: 'compat', icon: <Boxes size={14} />,
    outputs: ['Landing', 'Article', 'Gallery', 'Dashboard', 'Profile', 'Pricing', 'Docs', 'Changelog', 'About'],
    status: 'planned', count: 81,
  },
];

const STATUS_META: Record<Workshop['status'], { cn: string; en: string; hex: string }> = {
  shipped: { cn: '已发布', en: 'SHIPPED', hex: '#39ff14' },
  wip:     { cn: '在制',   en: 'WIP',     hex: '#f0ff00' },
  planned: { cn: '计划',   en: 'PLANNED', hex: '#888888' },
};

export default function Productions() {
  const totalOutputs = WORKSHOPS.reduce((s, w) => s + w.count, 0);
  const shippedCount = WORKSHOPS.filter(w => w.status === 'shipped').length;
  const wipCount = WORKSHOPS.filter(w => w.status === 'wip').length;

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <Hexagon size={12} />
              <span>// PRODUCTIONS · 大规模制作中心 / 9 WORKSHOPS × 9 OUTPUTS / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.82] tracking-tighter">
              <span className="block">MASS</span>
              <span className="block relative">
                <span className="relative z-10">PRODUCTIONS.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-pink -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-bone/80 max-w-2xl text-lg leading-relaxed">
              <span className="text-volt font-bold">9 座工坊</span>并行锻造,
              每座工坊都是<Link to="/codex-studio" className="text-cyan font-bold"> 9 步管线</Link>,
              每条管线都产出<Link to="/codex" className="text-pink font-bold"> 9 件代表作</Link>。
              <span className="text-pink font-bold">9 × 9 × 9 = 729</span> 件 —
              从组件到模板,从动效到令牌,大规模制作的呼吸法。
            </p>

            {/* 9 类目色板条 */}
            <div className="mt-8 grid grid-cols-9 gap-1 max-w-2xl">
              {TAG_KEYS.map((k, i) => {
                const m = SAFE(k);
                return (
                  <div key={k} className="border-2 p-1.5" style={{ borderColor: m.hex, background: m.hex + '10' }}>
                    <div className="font-mono text-[8px] opacity-60">0{i + 1}</div>
                    <div className="font-display font-black text-xs leading-none mt-0.5" style={{ color: m.hex }}>{m.en}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit space-y-3">
            <div className="font-mono text-[10px] text-bone/60">▸ 9 工坊 / 总览</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { l: '工坊',     v: '9',     c: 'text-volt' },
                { l: '产出/坊',  v: '9',     c: 'text-cyan' },
                { l: '总产出',   v: '729',   c: 'text-pink' },
                { l: '已发布',   v: `${shippedCount}/9`, c: 'text-perf' },
                { l: '在制',     v: `${wipCount}/9`,     c: 'text-volt' },
                { l: '类目',     v: '9',     c: 'text-plum' },
              ].map(s => (
                <div key={s.l} className="border-2 border-bone/20 p-2">
                  <div className="font-mono text-[9px] text-bone/50">{s.l}</div>
                  <div className={`font-display font-black text-2xl ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="font-mono text-[9px] text-bone/40 pt-1 border-t border-bone/20">
              // 每座工坊的 9 件代表作均可独立访问
            </div>
          </aside>
        </div>
      </section>

      {/* ============== 9 步大规模制作节拍 ============== */}
      <section className="px-6 py-8 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 9-BEAT CADENCE / 9 节拍呼吸</div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
            {['BRIEF', 'CUT', 'BATCH', 'PUMP', 'TURN', 'COOL', 'TEST', 'PACK', 'SHIP'].map((w, i) => (
              <div key={w} className="border-2 border-bone/30 p-2 text-center">
                <div className="font-mono text-[9px] text-bone/40">0{i + 1}</div>
                <div className="font-display font-black text-sm">{w}</div>
                <div className="font-mono text-[9px] text-bone/50 mt-0.5">
                  {['简报', '切片', '批量', '浇注', '翻面', '冷却', '质检', '包装', '出库'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 3×3 工坊网格 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9 WORKSHOPS / 3×3 矩阵</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
                9 座 <span className="text-volt">工坊</span> · 729 件产出
              </h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">// 绿=已发布 · 黄=在制 · 灰=计划</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {WORKSHOPS.map(w => {
              const m = SAFE(w.tag);
              const st = STATUS_META[w.status];
              return (
                <div key={w.id} className="border-2 border-bone/30 hover:border-volt transition-colors group">
                  {/* 头 */}
                  <div className="px-3 py-2 flex items-center justify-between" style={{ background: m.hex, color: m.ink }}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-ink/30">{w.n}</span>
                      <span className="font-display font-black text-base">{w.t}</span>
                      <span className="font-mono text-[9px] opacity-70">{w.en}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[8px] font-bold px-1.5 py-0.5" style={{ background: st.hex, color: '#0a0a0a' }}>{st.en}</span>
                      {w.icon}
                    </div>
                  </div>
                  {/* 描述 */}
                  <div className="p-3 border-b-2 border-bone/20">
                    <div className="text-bone/80 text-[12px]">{w.desc}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Tag cat={w.tag} size="xs" variant="dot" showId />
                      <span className="font-mono text-[9px] text-bone/40 ml-auto">{w.count} 件</span>
                    </div>
                  </div>
                  {/* 9 件代表作 */}
                  <div className="p-3 space-y-0.5">
                    <div className="font-mono text-[9px] text-bone/40 mb-1.5">// 9 OUTPUTS</div>
                    {w.outputs.map((o, i) => (
                      <div key={o} className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-bone/30 w-5">0{i + 1}</span>
                        <span className={w.status === 'shipped' ? 'text-bone' : 'text-bone/50'}>{o}</span>
                      </div>
                    ))}
                  </div>
                  {/* 跳转 */}
                  <div className="border-t-2 border-bone/20 p-2">
                    {w.status === 'shipped' ? (
                      <Link
                        to={w.href}
                        className="block text-center font-mono font-bold text-[10px] py-1.5 border-2 border-bone/30 hover:border-volt hover:bg-volt hover:text-ink transition-colors"
                      >
                        → 进入工坊 / {w.en}
                      </Link>
                    ) : (
                      <div className="text-center font-mono text-[9px] py-1.5 border-2 border-dashed border-bone/20 text-bone/40">
                        {st.cn} · 等待开工
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== 9 工艺图 ============== */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ FACTORY MAP / 工厂鸟瞰</div>
          <div className="border-2 border-bone/30 p-4 bg-ink">
            <pre className="font-mono text-[10px] md:text-[11px] leading-[1.4] text-bone/80 overflow-x-auto">
{`┌──────────────────────────────────────────────────────────────────────────────┐
│  MASS PRODUCTIONS · 大规模制作中心 · V.10                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─ 9 BEAT CADENCE ─────────┐    ┌─ 9 WORKSHOPS ─────────────────────┐     │
│    │ BRIEF→CUT→BATCH→PUMP    │    │ 01 组件  02 模式  03 动效         │     │
│    │ →TURN→COOL→TEST→PACK    │    │ 04 令牌  05 版式  06 配色         │     │
│    │ →SHIP                   │    │ 07 图标  08 布局  09 模板         │     │
│    └─────────────────────────┘    └───────────────────────────────────┘     │
│              │                              │                                │
│              ▼                              ▼                                │
│    ┌─ 9 STAGES PER WORKSHOP ──────┐  ┌─ 9 OUTPUTS PER WORKSHOP ──────┐       │
│    │ SPEC→TAG→DRAFT→PEER→SCORE   │  │ 工坊1: Btn·Card·Input·Modal…  │       │
│    │ →A11Y→PERF→LIB→SHIP         │  │ 工坊2: Cont·Nav·Data·Feed…   │       │
│    └─────────────────────────────┘  └────────────────────────────────┘       │
│                       │                            │                         │
│                       └─────────────┬──────────────┘                         │
│                                     ▼                                        │
│            ┌──── 729 OUTPUTS · 9×9×9 ─────┐                                 │
│            │ 每件产出可独立打开 / 复制源码  │                                 │
│            │ 通过 9 道质量门才可发布        │                                 │
│            └──────────────────────────────┘                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
          <div className="border-2 border-bone/30 p-6">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 9 应当 · 大规模制作</div>
            <ol className="font-mono text-xs space-y-1 text-bone/80">
              <li>01 · 9 工坊并行 — 单工坊瓶颈即停</li>
              <li>02 · 9 节拍呼吸 — BRIEF 与 SHIP 一一对应</li>
              <li>03 · 每工坊 9 步管线 — 不跳步</li>
              <li>04 · 每工坊 9 件代表作 — 不堆量</li>
              <li>05 · 9 类目色板统一 — 视觉语言一致</li>
              <li>06 · 9 道质量门 — 任一未过不发布</li>
              <li>07 · 9×9×9 = 729 件 — 单一索引可遍历</li>
              <li>08 · 已发布 / 在制 / 计划 三色看板</li>
              <li>09 · 复制整页源码即可复用整套工艺</li>
            </ol>
          </div>
          <div className="border-2 border-bone/30 p-6 bg-bone/5">
            <div className="font-mono text-[10px] text-bone/60 mb-2">// 整体设计 · 代用</div>
            <h3 className="font-display font-black text-2xl">想新建一座工坊?</h3>
            <p className="text-bone/70 text-sm mt-2">
              <code className="text-volt">Productions</code> 是<Link to="/codex-studio" className="text-cyan font-bold"> 守则制作方案</Link>的「量产版」。
              任何工坊的 9 件代表作都共享同一套 9 步管线和 9 道门。
              复制本目录结构即可在 1 小时内开出你自己的工坊。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/codex-studio" className="px-3 py-1.5 bg-bone text-ink font-mono font-bold text-xs hover:bg-volt">
                → 制作方案 / STUDIO
              </Link>
              <Link to="/codex" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                81 组件
              </Link>
              <Link to="/standards" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt font-mono text-xs">
                工坊守则
              </Link>
            </div>
            <div className="mt-4 font-mono text-[9px] text-bone/40">
              // PRODUCTIONS V.10 · 9 WORKSHOPS · 9×9 OUTPUTS · 729 PIECES
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
