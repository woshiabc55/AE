import { useState } from 'react';
import { PACKS, PACK_TOOLS } from '../components/preview/Packs';
import { Layers, Box, ChevronRight } from 'lucide-react';
import { TagLegend, type TagCategory, TAG_META } from '../components/Tag';

interface Pack {
  readonly id: string;
  readonly name: string;
  readonly cn: string;
  readonly level: number;
  readonly color: string;
  readonly icon: string;
  readonly description: string;
  readonly tools: ReadonlyArray<{ readonly slug: string; readonly name: string; readonly Preview: React.FC }>;
}

const COLOR_MAP: Record<string, { text: string; border: string; bg: string; chip: string }> = {
  volt: { text: 'text-volt', border: 'border-volt', bg: 'bg-volt', chip: 'bg-volt/20 text-volt' },
  cyan: { text: 'text-cyan', border: 'border-cyan', bg: 'bg-cyan', chip: 'bg-cyan/20 text-cyan' },
  pink: { text: 'text-pink', border: 'border-pink', bg: 'bg-pink', chip: 'bg-pink/20 text-pink' },
  plum: { text: 'text-plum', border: 'border-plum', bg: 'bg-plum', chip: 'bg-plum/20 text-plum' },
};

const LEVEL_LABEL: Record<number, { name: string; sub: string }> = {
  1: { name: 'L1 基础', sub: 'BASIC' },
  2: { name: 'L2 中等', sub: 'INTERMEDIATE' },
  3: { name: 'L3 精细', sub: 'REFINED' },
  4: { name: 'L4 高级', sub: 'ADVANCED' },
  5: { name: 'L5 顶级', sub: 'MASTERY' },
};

// 每个 Pack 关联 1-3 个 9-tag（贯通 Standards F 与模块化9）
const PACK_TAGS: Record<string, ReadonlyArray<TagCategory>> = {
  audio:    ['motion', 'interact'],
  kinetic:  ['motion', 'type'],
  depth:    ['visual', 'layout'],
  color:    ['color',  'visual'],
  layout:   ['layout', 'visual'],
  motion:   ['motion', 'interact'],
  micro:    ['interact', 'motion'],
  pattern:  ['visual', 'color'],
};

const PACK_LIST: Pack[] = PACKS.map(p => ({
  id: p.id, name: p.name, cn: p.cn, level: p.level, color: p.color,
  icon: p.icon, description: p.description, tools: p.tools as Pack['tools'],
}));

export default function Packs() {
  const [activePack, setActivePack] = useState<Pack>(PACK_LIST[0]);
  const [hoverTool, setHoverTool] = useState<string | null>(null);
  const colors = COLOR_MAP[activePack.color];

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6 font-mono text-xs">
              <Layers size={14} className="text-volt" />
              <span className="text-bone/60">8 PACKS / {PACK_TOOLS.length} UI ATOMS / 5 LEVELS / 9 TAGS</span>
            </div>
            <h1 className="font-display font-black text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter">
              <span className="block">SKILL</span>
              <span className="block relative">
                <span className="relative z-10">PACKS.</span>
                <span className="absolute -bottom-2 left-0 w-2/5 h-5 md:h-8 bg-pink -z-0" />
              </span>
            </h1>
            <p className="mt-8 text-lg text-bone/80 max-w-3xl">
              按主题打包的 UI 工具集，每个包内含 <span className="text-volt font-bold">4-5 个</span> 同主题的精细化组件，
              共享 <span className="text-pink font-bold">规范化外壳</span> 与 <span className="text-cyan font-bold">5 级装饰密度</span>。
              精细度按 L1→L5 逐级上升。
            </p>
          </div>
          {/* 9 tag 色板 — hero 第 3 列 */}
          <aside className="border-2 border-bone/30 p-3 bg-bone/5 h-fit">
            <div className="font-mono text-[10px] text-bone/60 mb-2 flex items-center gap-2">
              <span className="text-pink">▣</span> 9 TAGS / 模块化9
            </div>
            <TagLegend size="xs" />
            <div className="mt-2 font-mono text-[9px] text-bone/40 leading-relaxed">
              ▸ 每个 Pack 覆盖 1-3 个 tag。
              ▸ 9 tag 与 [codex]→F 同源。
            </div>
          </aside>
        </div>
      </section>

      {/* PACK SWITCHER */}
      <section className="sticky top-[72px] z-40 bg-ink/95 backdrop-blur border-b-2 border-bone/20">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex gap-1 overflow-x-auto">
          {PACKS.map((p) => {
            const c = COLOR_MAP[p.color];
            const isActive = activePack.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePack(p as Pack)}
                className={`flex items-center gap-2 px-3 py-2 border-2 font-mono text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? `${c.bg} text-ink border-transparent`
                    : `border-bone/30 text-bone/70 hover:border-bone hover:text-bone`
                }`}
              >
                <span className="text-base leading-none">{p.icon}</span>
                <span className="font-bold">{p.cn}</span>
                <span className="text-[9px] opacity-60">L{p.level}</span>
                <span className="text-[9px] opacity-50">×{p.tools.length}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* PACK DETAIL */}
      <section className="px-6 py-8 border-b-2 border-bone/20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-4xl ${colors.text}`}>{activePack.icon}</span>
                <h2 className="font-display font-black text-4xl md:text-5xl">
                  {activePack.name}
                </h2>
                <span className={`px-2 py-0.5 ${colors.chip} text-[10px] font-mono font-bold`}>
                  {LEVEL_LABEL[activePack.level].name}
                </span>
              </div>
              <p className="text-bone/70 text-sm max-w-2xl">{activePack.description}</p>
              {/* 关联 9-tag */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] text-bone/40">TAGS</span>
                {(PACK_TAGS[activePack.id] ?? []).map(t => {
                  const m = TAG_META[t];
                  return (
                    <span
                      key={t}
                      className="font-mono text-[9px] font-bold px-1.5 py-0.5 border-2 leading-none"
                      style={{ backgroundColor: m.hex, color: m.ink, borderColor: m.hex }}
                    >{m.id} {m.cn}</span>
                  );
                })}
              </div>
            </div>
            <div className="font-mono text-[10px] text-bone/40 space-y-1">
              <div>PACK ID: <span className={colors.text}>{activePack.id.toUpperCase()}</span></div>
              <div>LEVEL: <span className={colors.text}>{LEVEL_LABEL[activePack.level].sub}</span></div>
              <div>TOOLS: <span className={colors.text}>{activePack.tools.length}</span></div>
            </div>
          </div>

          {/* 工具网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
            {activePack.tools.map((t) => {
              const ToolPreview = t.Preview;
              return (
                <div
                  key={t.slug}
                  onMouseEnter={() => setHoverTool(t.slug)}
                  onMouseLeave={() => setHoverTool(null)}
                  className="group relative border-2 border-bone/20 hover:border-bone bg-ink overflow-hidden hover-lift focus-within:border-volt"
                >
                  <div className="aspect-[4/3] relative border-b-2 border-bone/20">
                    <ToolPreview />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors pointer-events-none" />
                    {hoverTool === t.slug && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-volt text-ink text-[9px] font-mono font-bold">
                        FOCUS
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display font-black text-base leading-tight truncate">
                        {t.name}
                      </div>
                      <div className="text-[10px] font-mono text-bone/40 mt-0.5">
                        {activePack.id}/{t.slug}
                      </div>
                    </div>
                    <Box size={12} className={`mt-1 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALL PACKS OVERVIEW */}
      <section className="px-6 py-12 bg-ink border-t-2 border-bone/20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-bone/60">
            <ChevronRight size={12} />
            <span>ALL PACKS / 全部技能包 / {PACK_TOOLS.length} UI ATOMS</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PACK_LIST.map((p) => {
              const c = COLOR_MAP[p.color];
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePack(p)}
                  className={`group text-left p-4 border-2 ${c.border} bg-ink hover:${c.bg} hover:text-ink transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl ${c.text} group-hover:text-ink`}>{p.icon}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 ${c.chip} group-hover:bg-ink/20 group-hover:text-ink`}>
                      L{p.level}
                    </span>
                  </div>
                  <div className="font-display font-black text-lg leading-tight">{p.cn}</div>
                  <div className="text-[10px] font-mono opacity-60 mt-1">{p.name}</div>
                  {/* 关联 9-tag 小条 */}
                  <div className="flex gap-0.5 mt-2">
                    {(PACK_TAGS[p.id] ?? []).map(t => (
                      <span
                        key={t}
                        className="font-mono text-[8px] font-bold w-5 h-3.5 flex items-center justify-center leading-none"
                        style={{ backgroundColor: TAG_META[t].hex, color: TAG_META[t].ink }}
                        title={`${TAG_META[t].cn} / ${TAG_META[t].en}`}
                      >{TAG_META[t].id}</span>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono opacity-40 mt-1.5">
                    {p.tools.length} tools
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-4 font-mono text-[10px] text-bone/50 leading-relaxed">
            <div className="border border-bone/20 p-4">
              <div className="text-volt font-bold mb-1">▸ NORMALIZED FRAME</div>
              所有 UI 共用 <code className="text-bone">DemoFrame</code> 外壳，统一顶部 chrome / 角标 / 信息弹层 / 底部索引。
              切换级别 (L1-L5) 自动调整装饰密度。
            </div>
            <div className="border border-bone/20 p-4">
              <div className="text-pink font-bold mb-1">▸ 5-LEVEL REFINEMENT</div>
              L1 基础 (Audio) → L2 中等 (Kinetic) → L3 精细 (Depth/Color) → L4 高级 (Layout/Motion) → L5 顶级 (Micro/Pattern)。
              级别越高，注释、动效、信息层越完整。
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
