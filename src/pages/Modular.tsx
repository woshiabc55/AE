import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Copy, Check, ArrowUpRight } from 'lucide-react';

/* ====================================================================
   MODULAR · 全向模块化设计
   9 布局方向 × 9 变体 = 81 全向组合
   贯通 Standards E (9 模块) + PlumGrid
==================================================================== */

type Axis = 'h' | 'v' | 'g' | 'a' | 'o';

const AXES: { id: Axis; t: string; en: string; cn: string; desc: string; tag: string }[] = [
  { id: 'h', t: '横向', en: 'HORIZONTAL', cn: '行向为主',    desc: '水平排布 / 时间轴 / banner 风格',     tag: 'H' },
  { id: 'v', t: '纵向', en: 'VERTICAL',   cn: '列向为主',    desc: '垂直堆叠 / 章节 / 滚动流',           tag: 'V' },
  { id: 'g', t: '网格', en: 'GRID',       cn: '母格为基',    desc: '3x3 / 4x4 / 6x6 / 12x12 各种密度',  tag: 'G' },
  { id: 'a', t: '非对称', en: 'ASYM',      cn: '不规则',      desc: '梅 / 钻 / 螺旋 / 错位 / 重叠',        tag: 'A' },
  { id: 'o', t: '外向', en: 'OUTWARD',    cn: '越界 / 出血', desc: 'fullbleed / 边角裁切 / 翻页',        tag: 'O' },
];

/* ====================================================================
   9 布局方向 × 9 变体 = 81 全向组合
==================================================================== */

const H_LAYOUTS = [
  { n: 'H1', t: '01 横流', cn: 'Banner Carousel', html: '<div class="grid grid-cols-1 md:grid-cols-3 gap-1.5">\n  <div class="aspect-video bg-volt">A</div>\n  <div class="aspect-video bg-pink">B</div>\n  <div class="aspect-video bg-cyan">C</div>\n</div>' },
  { n: 'H2', t: '02 横分', cn: 'Side-by-Side',    html: '<div class="grid grid-cols-2 gap-1.5">\n  <div class="aspect-square bg-volt">A</div>\n  <div class="aspect-square bg-pink">B</div>\n</div>' },
  { n: 'H3', t: '03 横条', cn: 'Strip',           html: '<div class="flex flex-col">\n  <div class="h-12 bg-volt">A</div>\n  <div class="h-12 bg-pink">B</div>\n  <div class="h-12 bg-cyan">C</div>\n</div>' },
  { n: 'H4', t: '04 时间轴', cn: 'Timeline',      html: '<div class="flex items-center gap-1.5">\n  <div class="w-2 h-2 rounded-full bg-volt"></div>\n  <div class="flex-1 h-0.5 bg-bone"></div>\n  <div class="w-2 h-2 rounded-full bg-pink"></div>\n  <div class="flex-1 h-0.5 bg-bone"></div>\n  <div class="w-2 h-2 rounded-full bg-cyan"></div>\n</div>' },
  { n: 'H5', t: '05 对比', cn: 'Compare',         html: '<div class="grid grid-cols-2 divide-x-2 divide-bone">\n  <div class="aspect-square bg-ink">前</div>\n  <div class="aspect-square bg-bone text-ink">后</div>\n</div>' },
  { n: 'H6', t: '06 标尺', cn: 'Ruler',           html: '<div class="grid grid-cols-9">\n  {Array.from({length:9}).map((_,i)=><div className="aspect-square bg-volt" key={i}>{i+1}</div>)}\n</div>' },
  { n: 'H7', t: '07 双行', cn: '2-Row Grid',      html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="aspect-video col-span-2 bg-volt">1</div>\n  <div class="aspect-video bg-pink">2</div>\n  <div class="aspect-video bg-cyan">3</div>\n  <div class="aspect-video col-span-2 bg-plum">4</div>\n</div>' },
  { n: 'H8', t: '08 旋转', cn: 'Rotated Strip',   html: '<div class="transform -skew-y-3 bg-volt h-12"></div>\n<div class="transform skew-y-3 bg-pink h-12 -mt-2"></div>' },
  { n: 'H9', t: '09 锚点', cn: 'Anchor Bar',      html: '<div class="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3">\n  <aside class="border-2 p-2">A·B·C</aside>\n  <main class="aspect-video bg-volt">M</main>\n</div>' },
];

const V_LAYOUTS = [
  { n: 'V1', t: '01 纵流', cn: 'Stack',           html: '<div class="flex flex-col gap-1.5">\n  <div class="h-24 bg-volt">1</div>\n  <div class="h-24 bg-pink">2</div>\n  <div class="h-24 bg-cyan">3</div>\n</div>' },
  { n: 'V2', t: '02 章节', cn: 'Chapter',         html: '<div class="space-y-6">\n  <section class="aspect-video bg-volt"></section>\n  <section class="aspect-video bg-pink"></section>\n  <section class="aspect-video bg-cyan"></section>\n</div>' },
  { n: 'V3', t: '03 卡片', cn: 'Cards Stack',     html: '<div class="space-y-3">\n  <div class="h-20 bg-volt border-2">CARD</div>\n  <div class="h-20 bg-pink border-2">CARD</div>\n</div>' },
  { n: 'V4', t: '04 长卷', cn: 'Scroll Story',    html: '<div class="h-[200vh] bg-gradient-to-b from-volt to-pink">SCROLL</div>' },
  { n: 'V5', t: '05 抽屉', cn: 'Drawer',          html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="h-32 bg-volt">1</div>\n  <div class="h-32 bg-pink">2</div>\n  <div class="h-32 bg-cyan">3</div>\n  <div class="h-32 bg-plum col-span-3">wide</div>\n</div>' },
  { n: 'V6', t: '06 侧栏', cn: 'Sidebar',         html: '<div class="grid grid-cols-[120px_1fr] gap-1.5">\n  <aside class="h-32 bg-volt">NAV</aside>\n  <main class="h-32 bg-pink">CONTENT</main>\n</div>' },
  { n: 'V7', t: '07 列表', cn: 'List',            html: '<ul class="divide-y-2 divide-bone">\n  <li class="p-2">ITEM 1</li>\n  <li class="p-2">ITEM 2</li>\n  <li class="p-2">ITEM 3</li>\n</ul>' },
  { n: 'V8', t: '08 阶梯', cn: 'Stairs',          html: '<div class="flex items-end gap-1">\n  <div class="w-8 h-8 bg-volt"></div>\n  <div class="w-8 h-16 bg-pink"></div>\n  <div class="w-8 h-24 bg-cyan"></div>\n  <div class="w-8 h-32 bg-plum"></div>\n</div>' },
  { n: 'V9', t: '09 塔', cn: 'Tower',            html: '<div class="flex flex-col items-stretch">\n  <div class="h-8 bg-volt"></div>\n  <div class="h-16 bg-pink"></div>\n  <div class="h-24 bg-cyan"></div>\n  <div class="h-32 bg-plum"></div>\n  <div class="h-40 bg-volt"></div>\n</div>' },
];

const G_LAYOUTS = [
  { n: 'G1', t: '01 3x3',   cn: '3x3 Basic',        html: '<div class="grid grid-cols-3 gap-1.5">\n  {Array.from({length:9}).map((_,i)=><div className="aspect-square bg-volt" key={i}>{i+1}</div>)}\n</div>' },
  { n: 'G2', t: '02 4x4',   cn: '4x4 Dense',        html: '<div class="grid grid-cols-4 gap-0.5">\n  {Array.from({length:16}).map((_,i)=><div className="aspect-square bg-pink" key={i}></div>)}\n</div>' },
  { n: 'G3', t: '03 6x6',   cn: '6x6 Micro',        html: '<div class="grid grid-cols-6 gap-0.5">\n  {Array.from({length:36}).map((_,i)=><div className="aspect-square bg-cyan" key={i}></div>)}\n</div>' },
  { n: 'G4', t: '04 12 列', cn: '12-Col Macro',     html: '<div class="grid grid-cols-12 gap-1">\n  {Array.from({length:12}).map((_,i)=><div className="h-12 bg-volt" key={i}>{i+1}</div>)}\n</div>' },
  { n: 'G5', t: '05 便当', cn: 'Bento',            html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="col-span-2 row-span-2 aspect-square bg-volt">1</div>\n  <div class="aspect-square bg-pink">2</div>\n  <div class="aspect-square bg-cyan">3</div>\n  <div class="col-span-2 aspect-video bg-plum">4</div>\n  <div class="aspect-square bg-volt">5</div>\n</div>' },
  { n: 'G6', t: '06 杂志', cn: 'Magazine',         html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="col-span-3 aspect-video bg-volt">HERO</div>\n  <div class="col-span-2 aspect-square bg-pink">A</div>\n  <div class="aspect-square bg-cyan">B</div>\n  <div class="aspect-square bg-plum">C</div>\n  <div class="col-span-2 aspect-square bg-volt">D</div>\n</div>' },
  { n: 'G7', t: '07 马赛克', cn: 'Mosaic',        html: '<div class="grid grid-cols-4 gap-1.5">\n  <div class="col-span-2 row-span-2 aspect-square bg-volt">1</div>\n  <div class="aspect-square bg-pink">2</div>\n  <div class="aspect-square bg-cyan">3</div>\n  <div class="aspect-square bg-plum">4</div>\n  <div class="aspect-square bg-volt">5</div>\n  <div class="col-span-2 aspect-square bg-pink">6</div>\n</div>' },
  { n: 'G8', t: '08 钻',   cn: 'Diamond',          html: '<div class="grid grid-cols-3 gap-1.5">\n  <div></div><div class="aspect-square bg-volt"></div><div></div>\n  <div class="aspect-square bg-pink"></div><div class="aspect-square bg-cyan"></div><div class="aspect-square bg-plum"></div>\n  <div></div><div class="aspect-square bg-volt"></div><div></div>\n</div>' },
  { n: 'G9', t: '09 L 形', cn: 'L-Shape',          html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="col-span-2 aspect-square bg-volt"></div>\n  <div></div>\n  <div class="aspect-square bg-pink"></div><div></div><div></div>\n  <div class="col-span-3 aspect-square bg-cyan"></div>\n</div>' },
];

const A_LAYOUTS = [
  { n: 'A1', t: '01 错位', cn: 'Offset Grid',      html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="aspect-square bg-volt translate-y-3">1</div>\n  <div class="aspect-square bg-pink">2</div>\n  <div class="aspect-square bg-cyan -translate-y-3">3</div>\n</div>' },
  { n: 'A2', t: '02 重叠', cn: 'Overlap',          html: '<div class="relative h-32">\n  <div class="absolute inset-0 bg-volt w-1/2"></div>\n  <div class="absolute right-0 top-4 bg-pink w-1/2 h-24"></div>\n  <div class="absolute left-1/4 top-8 bg-cyan w-1/2 h-24"></div>\n</div>' },
  { n: 'A3', t: '03 旋转', cn: 'Rotated Cards',    html: '<div class="relative h-32">\n  <div class="absolute w-20 h-20 bg-volt top-2 left-2 rotate-12"></div>\n  <div class="absolute w-20 h-20 bg-pink top-4 left-12 -rotate-6"></div>\n  <div class="absolute w-20 h-20 bg-cyan top-6 left-20 rotate-3"></div>\n</div>' },
  { n: 'A4', t: '04 螺旋', cn: 'Spiral',           html: '<div class="relative w-32 h-32 mx-auto">\n  <div class="absolute inset-0 m-auto w-4 h-4 rounded-full bg-volt"></div>\n  <div class="absolute inset-2 m-auto w-4 h-4 rounded-full bg-pink"></div>\n  <div class="absolute inset-4 m-auto w-4 h-4 rounded-full bg-cyan"></div>\n  <div class="absolute inset-6 m-auto w-4 h-4 rounded-full bg-plum"></div>\n  <div class="absolute inset-8 m-auto w-4 h-4 rounded-full bg-volt"></div>\n</div>' },
  { n: 'A5', t: '05 钻心', cn: 'Concentric',       html: '<div class="relative w-32 h-32 mx-auto">\n  <div class="absolute inset-0 border-4 border-volt"></div>\n  <div class="absolute inset-3 border-4 border-pink"></div>\n  <div class="absolute inset-6 border-4 border-cyan"></div>\n  <div class="absolute inset-9 border-4 border-plum"></div>\n</div>' },
  { n: 'A6', t: '06 错格', cn: 'Brickyard',        html: '<div class="grid grid-cols-6 gap-0.5">\n  {Array.from({length:18}).map((_,i)=>(<div className="h-8" style={{background:[\'#f0ff00\',\'#ff3da5\',\'#00e5ff\',\'#9b5cff\'][i%4]}} key={i}></div>))}\n</div>' },
  { n: 'A7', t: '07 倾斜', cn: 'Skew Grid',        html: '<div class="grid grid-cols-3 gap-1.5 transform -skew-y-2">\n  <div class="aspect-square bg-volt"></div>\n  <div class="aspect-square bg-pink"></div>\n  <div class="aspect-square bg-cyan"></div>\n</div>' },
  { n: 'A8', t: '08 瀑布', cn: 'Pinterest',        html: '<div class="grid grid-cols-3 gap-1.5">\n  <div class="aspect-[3/4] bg-volt"></div>\n  <div class="aspect-square bg-pink"></div>\n  <div class="aspect-[3/5] bg-cyan"></div>\n  <div class="aspect-[3/4] bg-plum"></div>\n  <div class="aspect-[3/5] bg-volt"></div>\n  <div class="aspect-square bg-pink"></div>\n</div>' },
  { n: 'A9', t: '09 多边形', cn: 'Polygon',        html: '<div class="grid grid-cols-4 gap-1.5">\n  <div class="aspect-square bg-volt col-span-2" style="clip-path:polygon(0 50%,50% 0,100% 50%,50% 100%)"></div>\n  <div class="aspect-square bg-pink col-span-2" style="clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)"></div>\n</div>' },
];

const O_LAYOUTS = [
  { n: 'O1', t: '01 出血', cn: 'Fullbleed',         html: '<div class="-mx-6 h-48 bg-volt"></div>' },
  { n: 'O2', t: '02 翻页', cn: 'Page Turn',         html: '<div class="grid grid-cols-2">\n  <div class="h-48 bg-volt"></div>\n  <div class="h-48 bg-pink"></div>\n</div>' },
  { n: 'O3', t: '03 边角', cn: 'Corner Cut',        html: '<div class="bg-volt h-32" style="clip-path:polygon(0 0,100% 0,100% 80%,80% 100%,0 100%)"></div>' },
  { n: 'O4', t: '04 撕边', cn: 'Torn Edge',         html: '<div class="bg-volt h-32" style="mask-image:linear-gradient(180deg,black 95%,transparent 100%)"></div>' },
  { n: 'O5', t: '05 透出', cn: 'Bleed Through',     html: '<div class="relative h-32 bg-volt">\n  <div class="absolute -bottom-8 left-4 right-4 h-16 bg-pink"></div>\n</div>' },
  { n: 'O6', t: '06 浮动', cn: 'Float',             html: '<div class="relative h-32">\n  <div class="absolute top-4 left-4 right-4 bottom-4 bg-volt"></div>\n  <div class="absolute top-8 left-8 right-8 bottom-8 bg-pink"></div>\n</div>' },
  { n: 'O7', t: '07 视差', cn: 'Parallax',          html: '<div class="grid grid-rows-3 h-32">\n  <div class="bg-volt"></div>\n  <div class="bg-pink translate-x-4"></div>\n  <div class="bg-cyan -translate-x-4"></div>\n</div>' },
  { n: 'O8', t: '08 折角', cn: 'Folded Corner',     html: '<div class="relative bg-volt h-32">\n  <div class="absolute bottom-0 right-0 w-12 h-12 bg-bone" style="clip-path:polygon(100% 0,100% 100%,0 100%)"></div>\n</div>' },
  { n: 'O9', t: '09 异形', cn: 'Custom Shape',      html: '<div class="bg-volt h-32" style="clip-path:polygon(0 0,100% 0,100% 70%,75% 100%,50% 80%,0 100%)"></div>' },
];

const AXIS_MAP = { h: H_LAYOUTS, v: V_LAYOUTS, g: G_LAYOUTS, a: A_LAYOUTS, o: O_LAYOUTS };

/* ---------- 卡片 ---------- */
function LayoutCard({ l, onShow }: { l: { n: string; t: string; cn: string; html: string }; onShow: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(l.html); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="border-2 border-bone/20 hover:border-bone bg-ink transition-colors group">
      <div className="aspect-[4/3] bg-bone/5 relative p-2 cursor-pointer" onClick={onShow}>
        {/* 渲染简化的 grid 演示 */}
        <RenderPreview html={l.html} />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 flex items-center justify-center transition-colors">
          <span className="opacity-0 group-hover:opacity-100 font-mono text-[10px] bg-ink border-2 border-bone px-2 py-1 flex items-center gap-1">
            <ArrowUpRight size={10} />VIEW HTML
          </span>
        </div>
      </div>
      <div className="border-t-2 border-bone/20 px-2 py-1.5 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold text-volt">{l.n}</div>
          <div className="font-mono text-[9px] text-bone/70">{l.t} · {l.cn}</div>
        </div>
        <button onClick={copy} className="font-mono text-[9px] flex items-center gap-1 px-1.5 py-0.5 border border-bone/30 hover:border-volt">
          {copied ? <><Check size={9} className="text-volt" />OK</> : <><Copy size={9} />HTML</>}
        </button>
      </div>
    </div>
  );
}

/* ---------- 简化 HTML 预览渲染器 ---------- */
function RenderPreview({ html }: { html: string }) {
  // 提取 grid-cols-X 和 内部 divs，做一个简化版本用于展示
  const cols = (html.match(/grid-cols-(\d+)/) || [])[1] || '3';
  const count = (html.match(/aspect-square/g) || []).length || 9;
  const colors = ['#f0ff00', '#ff3da5', '#00e5ff', '#9b5cff', '#f5f1e8'];
  return (
    <div
      className="w-full h-full grid gap-1 p-1"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: Math.min(count, 16) }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{ background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function Modular() {
  const [axis, setAxis] = useState<Axis>('g');
  const [showHtml, setShowHtml] = useState<string | null>(null);
  const layouts = AXIS_MAP[axis];

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="font-mono text-xs text-volt mb-3 flex items-center gap-2">
              <LayoutGrid size={12} />
              <span>// MODULAR · 全向模块化设计 · 5 轴 × 9 变体 = 45 布局 / V.10</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">ALL</span>
              <span className="block text-volt">DIRECTIONS.</span>
            </h1>
            <p className="mt-6 text-bone/80 max-w-2xl">
              5 个布局轴向 × 9 个变体 = 45 种模块化布局。
              横向、纵向、网格、非对称、出血——工坊里所有页面的母格都能从这里拼出来。
            </p>
          </div>
          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit">
            <div className="font-mono text-[10px] text-bone/60 mb-2">▸ 5 AXES / 5 轴向</div>
            <div className="grid grid-cols-5 gap-1">
              {AXES.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setAxis(a.id)}
                  className={`border-2 p-2 text-center transition-colors ${axis === a.id ? 'border-volt bg-volt/5' : 'border-bone/20 hover:border-bone/50'}`}
                >
                  <div className="font-display font-black text-lg text-volt">{a.tag}</div>
                  <div className="font-mono text-[9px] text-bone/70 mt-0.5">{a.en.slice(0, 4)}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 font-mono text-[10px] text-bone/60 leading-relaxed">
              <div>当前：<span className="text-volt font-bold">{AXES.find(a => a.id === axis)?.cn}</span></div>
              <div>变体：<span className="text-volt font-bold">{layouts.length}</span></div>
              <div>总计：<span className="text-volt font-bold">5 × 9 = 45</span></div>
            </div>
          </aside>
        </div>
      </section>

      {/* 5 AXES TABS */}
      <section className="border-b-2 border-bone/20 sticky top-[108px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex gap-1 overflow-x-auto">
          {AXES.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setAxis(a.id)}
              className={`px-3 py-1.5 font-mono text-[10px] whitespace-nowrap border-2 transition-colors ${axis === a.id ? 'border-volt bg-volt text-ink' : 'border-bone/30 hover:border-bone'}`}
            >
              <span className="font-bold">{String(i + 1).padStart(2, '0')}</span> · {a.tag} · <span className="opacity-70">{a.en}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 9 变体 */}
      <section className="px-6 py-10 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ {AXES.find(a => a.id === axis)?.en} · 9 VARIANTS</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">{AXES.find(a => a.id === axis)?.t} · 9 变体</h2>
              <p className="text-bone/60 text-sm mt-1">{AXES.find(a => a.id === axis)?.desc}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {layouts.map(l => (
              <LayoutCard key={l.n} l={l} onShow={() => setShowHtml(l.html)} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 守则贯通（贯通 Standards E 9 模块） */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 9 模块 · 模块化9 的页面母格</div>
          <p className="text-bone/70 text-sm mb-4">完整版见 [codex]→E。这里是 9 个模块化预制件的速查。</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 auto-rows-[minmax(100px,auto)]">
            {[
              { id: 'M1', t: 'Hero',     span: 3, desc: '页面第一印象' },
              { id: 'M2', t: 'Codex',    span: 2, desc: '3x3 网格索引' },
              { id: 'M3', t: 'Tags',     span: 1, desc: '9 类目过滤' },
              { id: 'M4', t: 'Preview',  span: 2, desc: '可交互 demo' },
              { id: 'M5', t: 'Source',   span: 1, desc: '可复制片段' },
              { id: 'M6', t: 'Rubric',   span: 3, desc: '9 维度评分' },
              { id: 'M7', t: 'CTA',      span: 2, desc: '行动按钮组' },
              { id: 'M8', t: 'Footer',   span: 1, desc: '辅助信息' },
              { id: 'M9', t: 'A11y',     span: 1, desc: '旁路导航' },
            ].map(m => (
              <div key={m.id} className="border-2 border-bone/30 p-3 hover:border-volt transition-colors" style={{ gridColumn: `span ${m.span}` }}>
                <div className="font-mono text-[10px] text-bone/40">{m.id} · SPAN {m.span}</div>
                <div className="font-display font-black text-lg">{m.t}</div>
                <div className="text-bone/60 text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 轴 × 9 变体 全景图 */}
      <section className="px-6 py-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ 45 LAYOUTS OVERVIEW · 全景</div>
          <div className="grid grid-cols-5 gap-2">
            {AXES.map(a => (
              <div key={a.id}>
                <div className="font-mono text-[10px] font-bold text-volt mb-1">{a.tag} · {a.cn}</div>
                <div className="grid grid-cols-3 gap-0.5">
                  {AXIS_MAP[a.id].map((l, i) => (
                    <div key={l.n} className="aspect-square bg-bone/5 border border-bone/20 hover:border-volt transition-colors relative group">
                      <RenderPreview html={l.html} />
                      <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="font-mono text-[9px]">{l.n}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HTML 详景模态 */}
      {showHtml && (
        <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setShowHtml(null)}>
          <div className="max-w-3xl w-full bg-ink border-2 border-bone" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b-2 border-bone/30 px-3 py-2">
              <span className="font-mono text-[10px] text-bone/60">// HTML SOURCE</span>
              <button onClick={() => setShowHtml(null)} className="font-mono text-xs px-2 py-1 border-2 border-bone/30 hover:border-bone">ESC</button>
            </div>
            <pre className="p-4 overflow-x-auto text-[10px] font-mono text-bone/90 max-h-[80vh]"><code>{showHtml}</code></pre>
          </div>
        </div>
      )}
    </div>
  );
}
