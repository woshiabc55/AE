import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Volume2, Camera, Eye, Maximize2, Copy, Check } from 'lucide-react';

/* ====================================================================
   HALFTONE EXHIBITION · 半色调展览会客厅
   9 镜故事性分镜 · 130 年印刷史 + 数字复兴
==================================================================== */

interface Panel {
  no: string;
  year: string;
  shot: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'PAN' | 'TALL' | 'WIDE' | 'SQUARE';
  camera: string;
  sfx: string;
  caption: string;
  narration: string;
  /** 9 类目标签，用于贯通 Standards F */
  tags: ReadonlyArray<'visual' | 'color' | 'type' | 'motion' | 'layout'>;
  /** 半色调参数 */
  pattern: {
    /** 基础色 */
    bg: string;
    /** 点色 */
    dot: string;
    /** 点尺寸 px */
    size: number;
    /** 间距 px */
    gap: number;
    /** 形状 */
    shape: 'circle' | 'square' | 'diamond';
    /** 渐变蒙版 */
    mask?: 'radial' | 'linear' | 'conic' | 'none';
  };
}

const PANELS: Panel[] = [
  {
    no: '01', year: '1893', shot: '机械臂·墨辊',
    size: 'TALL', camera: '中景·近景', sfx: '咔嗒·咔嗒·咔嗒',
    caption: '在德国慕尼黑的一间地下室，Georg Meisenbach 用丝网把一张照片变成了可印刷的点阵。',
    narration: '半色调（Halftone）这个词首次出现。新闻业从此可以廉价地再现灰阶。',
    tags: ['visual', 'type'],
    pattern: { bg: '#f1ead7', dot: '#0a0a0a', size: 3, gap: 8, shape: 'circle', mask: 'radial' },
  },
  {
    no: '02', year: '1920s', shot: '电报员·油墨',
    size: 'WIDE', camera: '远景', sfx: '嘭·嗡·啪',
    caption: '纽约地下印刷厂，《纽约每日新闻》用 64 线半色调把罗斯福的脸搬上头版。',
    narration: '摄影新闻诞生。每一颗点都是一次心跳。',
    tags: ['visual', 'color'],
    pattern: { bg: '#1a1410', dot: '#f1ead7', size: 2, gap: 10, shape: 'circle', mask: 'linear' },
  },
  {
    no: '03', year: '1962', shot: '红唇·泪滴',
    size: 'XL', camera: '特写', sfx: '啵·!',
    caption: 'Roy Lichtenstein 在纽约 Leo Castelli 画廊挂出《Whaam!》，1.7×4 米油画纯用半色调手绘。',
    narration: '波普艺术把「廉价印刷」变成昂贵艺术。Benday dots 成了反讽。',
    tags: ['color', 'visual'],
    pattern: { bg: '#f0ff00', dot: '#ff3da5', size: 6, gap: 14, shape: 'circle', mask: 'none' },
  },
  {
    no: '04', year: '1977', shot: '拼贴·剪刀',
    size: 'S', camera: '俯拍', sfx: '嘶·嚓·嚓',
    caption: '伦敦地下室，Sex Pistols 同人志《Sideburns》用复印机放大点阵做封面。',
    narration: 'DIY 美学。半色调是反主流的「业余证明」。',
    tags: ['type', 'visual'],
    pattern: { bg: '#0a0a0a', dot: '#ff3da5', size: 4, gap: 12, shape: 'diamond', mask: 'none' },
  },
  {
    no: '05', year: '1991', shot: '吉他·烟雾',
    size: 'M', camera: '中景', sfx: '嗡——嗡嗡',
    caption: '西雅图 Sub Pop 唱片厂牌，Nirvana《Nevermind》内页用粗网点半色调做肖像。',
    narration: '垃圾摇滚的粗糙感。点越大，越不完美，越真实。',
    tags: ['visual', 'motion'],
    pattern: { bg: '#1a1a1a', dot: '#9b9b9b', size: 5, gap: 9, shape: 'circle', mask: 'radial' },
  },
  {
    no: '06', year: '2003', shot: '显示器·16px',
    size: 'PAN', camera: '截屏', sfx: '滴·嘟·哔',
    caption: 'MySpace 模板用 GIF 半色调做头像滤镜。16px 的 8-bit 时代。',
    narration: 'Web 1.0。半色调第一次被浏览器「重新发明」。',
    tags: ['color', 'layout'],
    pattern: { bg: '#00e5ff', dot: '#0a0a0a', size: 2, gap: 6, shape: 'square', mask: 'none' },
  },
  {
    no: '07', year: '2014', shot: '咖啡·相机',
    size: 'L', camera: '特写', sfx: '咔嚓',
    caption: 'Instagram Hipster 滤镜 Hudsons 大量用半色调 + 漏光 + 颗粒。',
    narration: '审美回潮。半色调与 Lo-fi 永远是一对。',
    tags: ['color', 'visual'],
    pattern: { bg: '#9b5cff', dot: '#f5f1e8', size: 3, gap: 11, shape: 'circle', mask: 'radial' },
  },
  {
    no: '08', year: '2020', shot: '代码·CSS',
    size: 'WIDE', camera: '屏幕', sfx: '嘀·嗒·嘀',
    caption: 'Conic-gradient + mask 出现。CSS 可以纯代码生成任意角度的半色调。',
    narration: '半色调不再需要印刷机。一个 div + 一段 CSS。',
    tags: ['motion', 'layout'],
    pattern: { bg: '#050018', dot: '#b4ff00', size: 4, gap: 13, shape: 'circle', mask: 'conic' },
  },
  {
    no: '09', year: '2026', shot: '工坊·九宫',
    size: 'XL', camera: '广角', sfx: '✦',
    caption: 'Skill Forge 把半色调列为 9 模块之一。模块化 9 母格 · 9 类目标签 · 9 评分维度。',
    narration: '130 年。9 个镜头。从德国地下室到工坊。回到你眼前。',
    tags: ['visual', 'layout', 'type'],
    pattern: { bg: '#0a0a0a', dot: '#f0ff00', size: 4, gap: 12, shape: 'circle', mask: 'conic' },
  },
];

/* ---------- 半色调画布 ---------- */
function HalftoneField({ bg, dot, size, gap, shape, mask = 'none' }: Panel['pattern']) {
  const bgImage = shape === 'square'
    ? `linear-gradient(45deg, ${dot} 25%, transparent 25%), linear-gradient(-45deg, ${dot} 25%, transparent 25%)`
    : shape === 'diamond'
      ? `linear-gradient(45deg, ${dot} 25%, transparent 25%, transparent 75%, ${dot} 75%), linear-gradient(45deg, ${dot} 25%, transparent 25%, transparent 75%, ${dot} 75%)`
      : `radial-gradient(circle, ${dot} ${Math.max(1, size - 1)}px, transparent ${size}px)`;
  const maskImage = mask === 'radial'
    ? 'radial-gradient(circle at center, black 0%, transparent 70%)'
    : mask === 'linear'
      ? 'linear-gradient(135deg, black 0%, transparent 60%, black 100%)'
      : mask === 'conic'
        ? 'conic-gradient(from 45deg at 50% 50%, black 0deg, transparent 90deg, black 180deg, transparent 270deg, black 360deg)'
        : 'none';
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: bg,
        backgroundImage: shape === 'circle' ? bgImage : undefined,
        backgroundSize: shape === 'circle' ? `${gap}px ${gap}px` : undefined,
        WebkitMaskImage: maskImage,
        maskImage: maskImage,
      }}
    />
  );
}

/* ---------- 9 类目标签（贯通 Standards F） ---------- */
const TAGS: Record<Panel['tags'][number], { id: string; cn: string; hex: string }> = {
  visual: { id: '01', cn: '视觉', hex: '#f0ff00' },
  motion: { id: '02', cn: '动效', hex: '#ff3da5' },
  type:   { id: '03', cn: '字体', hex: '#00e5ff' },
  color:  { id: '04', cn: '颜色', hex: '#9b00ff' },
  layout: { id: '05', cn: '布局', hex: '#f5f1e8' },
};

/* ---------- 单格分镜面板 ---------- */
function StoryboardPanel({ p, onClick, active }: { p: Panel; onClick: () => void; active: boolean }) {
  const sizeCls: Record<Panel['size'], string> = {
    XS: 'col-span-1 row-span-1 aspect-square',
    S:  'col-span-1 row-span-1 aspect-[4/5]',
    M:  'col-span-1 row-span-1 aspect-square',
    L:  'md:col-span-2 row-span-1 aspect-[2/1]',
    XL: 'md:col-span-2 md:row-span-2 aspect-square',
    PAN:'md:col-span-3 row-span-1 aspect-[3/1]',
    TALL:'col-span-1 md:row-span-2 aspect-[1/2]',
    WIDE:'md:col-span-2 row-span-1 aspect-[2/1]',
    SQUARE:'col-span-1 row-span-1 aspect-square',
  };
  return (
    <button
      id={`panel-${p.no}`}
      onClick={onClick}
      className={`group relative overflow-hidden border-2 text-left transition-all ${active ? 'border-volt' : 'border-bone/40 hover:border-bone'} ${sizeCls[p.size]}`}
    >
      {/* 半色调背景 */}
      <HalftoneField {...p.pattern} />
      {/* 黑色蒙版 + 镜头信息 */}
      <div className="absolute inset-0 flex flex-col p-3 md:p-4 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] flex items-center gap-2 px-1.5 py-0.5" style={{ background: p.pattern.dot, color: p.pattern.bg }}>
            <span>PANEL {p.no}</span>
            <span>·</span>
            <span>{p.year}</span>
          </div>
          <div className="font-mono text-[10px] px-1.5 py-0.5 border flex items-center gap-1" style={{ borderColor: p.pattern.dot, color: p.pattern.dot }}>
            <Camera size={9} /> {p.camera}
          </div>
        </div>

        <div className="mt-auto">
          <div className="font-display font-black tracking-tight text-2xl md:text-4xl leading-none mb-1.5" style={{ color: p.pattern.dot, mixBlendMode: 'difference', WebkitTextStroke: `1px ${p.pattern.bg}` }}>
            {p.shot}
          </div>
          <div className="font-mono text-[10px] flex items-center gap-1.5 mb-1" style={{ color: p.pattern.dot }}>
            <Volume2 size={9} /> {p.sfx}
          </div>
          <div className="text-[11px] md:text-xs leading-relaxed max-w-full line-clamp-3" style={{ color: p.pattern.bg, mixBlendMode: 'difference' }}>
            {p.caption}
          </div>
        </div>
      </div>

      {/* 角标 - 半色调图案小卡 */}
      <div className="absolute top-3 right-3 hidden md:flex gap-1">
        {p.tags.map(t => (
          <span key={t} className="font-mono text-[8px] font-bold px-1 py-0.5" style={{ background: TAGS[t].hex, color: '#0a0a0a' }}>{TAGS[t].id}</span>
        ))}
      </div>
    </button>
  );
}

/* ---------- 详景模态 ---------- */
function PanelDetail({ p, onClose }: { p: Panel; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div className="max-w-5xl w-full bg-ink border-2 border-bone grid md:grid-cols-2" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-square overflow-hidden">
          <HalftoneField {...p.pattern} />
          <div className="absolute inset-0 flex flex-col p-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs flex items-center gap-2 px-2 py-1" style={{ background: p.pattern.dot, color: p.pattern.bg }}>
                <Camera size={10} /> PANEL {p.no} · {p.year}
              </div>
              <div className="font-mono text-[10px] px-2 py-1 border" style={{ borderColor: p.pattern.dot, color: p.pattern.dot }}>
                {p.camera} · {p.size}
              </div>
            </div>
            <div className="mt-auto font-display font-black text-5xl leading-none" style={{ color: p.pattern.dot, mixBlendMode: 'difference' }}>
              {p.shot}
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col gap-4 bg-bone text-ink">
          <div>
            <div className="font-mono text-[10px] opacity-60">// SCENE / 镜头</div>
            <h3 className="font-display font-black text-3xl mt-1">{p.shot}</h3>
            <div className="font-mono text-xs opacity-60 mt-1">{p.year} · 镜头 {p.no} / 9 · {p.camera}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] opacity-60">// SFX / 音效</div>
            <div className="font-display font-black text-xl flex items-center gap-2 mt-1">
              <Volume2 size={16} /> {p.sfx}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] opacity-60">// CAPTION / 字幕</div>
            <p className="mt-1 leading-relaxed">{p.caption}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] opacity-60">// NARRATION / 旁白</div>
            <p className="mt-1 leading-relaxed italic">{p.narration}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] opacity-60">// TAGS / 9 类目标签</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {p.tags.map(t => (
                <span key={t} className="font-mono text-[10px] font-bold px-1.5 py-0.5" style={{ background: TAGS[t].hex, color: '#0a0a0a' }}>{TAGS[t].id} {TAGS[t].cn}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] opacity-60">// PARAMS / 半色调参数</div>
            <div className="font-mono text-[10px] grid grid-cols-2 gap-1 mt-1">
              <div>BG <span className="font-bold">{p.pattern.bg}</span></div>
              <div>DOT <span className="font-bold">{p.pattern.dot}</span></div>
              <div>SIZE <span className="font-bold">{p.pattern.size}px</span></div>
              <div>GAP <span className="font-bold">{p.pattern.gap}px</span></div>
              <div>SHAPE <span className="font-bold">{p.pattern.shape}</span></div>
              <div>MASK <span className="font-bold">{p.pattern.mask}</span></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 border-2 border-ink hover:bg-ink hover:text-bone font-mono font-bold self-start"
          >
            ← ESC 退出
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 源码片段 ---------- */
function SourceCode() {
  const [copied, setCopied] = useState(false);
  const code = `/* HALFTONE CORE — 单行 CSS 即实现 */
.halftone {
  background-color: #f1ead7;
  background-image:
    radial-gradient(circle, #0a0a0a 2px, transparent 3px);
  background-size: 12px 12px;
  -webkit-mask-image: radial-gradient(circle, black 30%, transparent 75%);
          mask-image: radial-gradient(circle, black 30%, transparent 75%);
}

/* 进阶：conic 蒙版 + 错位点阵 */
.halftone-conic {
  background: #050018;
  background-image: radial-gradient(circle, #b4ff00 3px, transparent 4px);
  background-size: 14px 14px;
  -webkit-mask-image: conic-gradient(from 0deg, black, transparent 90deg, black 180deg, transparent 270deg, black 360deg);
          mask-image: conic-gradient(from 0deg, black, transparent 90deg, black 180deg, transparent 270deg, black 360deg);
}`;
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="border-2 border-bone/30">
      <div className="flex items-center justify-between border-b-2 border-bone/30 px-3 py-2 bg-bone/5">
        <div className="font-mono text-[10px] text-bone/60">// halftone.css · 复制即用</div>
        <button onClick={copy} className="font-mono text-[10px] flex items-center gap-1.5 px-2 py-1 border-2 border-bone/30 hover:border-volt">
          {copied ? <><Check size={10} className="text-volt" /> COPIED</> : <><Copy size={10} /> COPY</>}
        </button>
      </div>
      <pre className="p-3 md:p-4 overflow-x-auto text-[10px] md:text-xs leading-relaxed font-mono text-bone/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------- 9 大小 × 9 参数矩阵 ---------- */
function ParamMatrix() {
  const sizes = [2, 3, 4, 5, 6, 8, 10, 12, 16];
  const gaps  = [6, 8, 10, 12, 14, 16, 18, 20, 24];
  return (
    <div className="grid grid-cols-9 gap-1">
      {sizes.map((s, i) => gaps.map((g, j) => {
        const ratio = s / g;
        return (
          <div key={`${i}-${j}`} className="aspect-square relative overflow-hidden border border-bone/20" title={`size=${s} gap=${g} ratio=${ratio.toFixed(2)}`}>
            <HalftoneField bg="#0a0a0a" dot="#f0ff00" size={s} gap={g} shape="circle" mask="none" />
          </div>
        );
      }))}
    </div>
  );
}

/* ---------- 主页面 ---------- */
export default function HalftoneExhibition() {
  const [active, setActive] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'HALFTONE EXHIBITION — Skill Forge'; }, []);

  const scrollTo = (no: string) => {
    const el = document.getElementById(`panel-${no}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      {/* HERO · 客厅入口 */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <HalftoneField bg="#0a0a0a" dot="#f0ff00" size={3} gap={12} shape="circle" mask="radial" />
        </div>
        <div className="max-w-[1400px] mx-auto relative">
          <div className="flex items-center gap-3 mb-6 font-mono text-xs">
            <span className="w-2 h-2 bg-volt rounded-full animate-pulse" />
            <span className="text-bone/60">EXHIBITION / 展客厅 · 9 镜分镜 · HALFTONE DOTS</span>
          </div>
          <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
            <span className="block">HALFTONE</span>
            <span className="block relative">
              <span className="relative z-10">SHOWROOM.</span>
              <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-volt -z-0" />
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-bone/80 max-w-3xl leading-relaxed">
            一间<Link to="/standards" className="text-volt font-bold"> 9 镜分镜</Link>的展览客厅。
            从 1893 年的慕尼黑地下室到 2026 年的工坊 ——
            <span className="text-volt">半色调（Halftone）</span>用 130 年时间，从印刷机走进了浏览器。
            每一格都是一个镜头，带音效、字幕、旁白。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 border-2 border-bone/30">9 PANELS / 9 镜分镜</div>
            <div className="px-3 py-1.5 border-2 border-bone/30">9 PARAMS / 9 关键参数</div>
            <div className="px-3 py-1.5 border-2 border-bone/30">5 SIZES / 5 镜头尺寸</div>
            <div className="px-3 py-1.5 border-2 border-bone/30">4 MASKS / 4 蒙版</div>
          </div>
        </div>
      </section>

      {/* STORYBOARD · 9 镜分镜 */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ STORYBOARD / 9 镜分镜</div>
              <h2 className="font-display font-black text-4xl md:text-5xl mt-1">130 YEARS OF DOTS.</h2>
            </div>
            <div className="font-mono text-[10px] text-bone/40 hidden md:block">点格 = 镜头 · 双击进入详景</div>
          </div>

          {/* 分镜网格 - 9 格不规则 (9 类大小) */}
          <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(0,auto)] gap-1.5" ref={mapRef}>
            {PANELS.map(p => (
              <StoryboardPanel key={p.no} p={p} onClick={() => setActive(p.no)} active={active === p.no} />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY MAP · 9 格小缩略 */}
      <section className="px-6 py-10 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ GALLERY MAP / 9 镜索引 · 点击跳转</div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
            {PANELS.map(p => (
              <button
                key={p.no}
                onClick={() => scrollTo(p.no)}
                className="group text-left border-2 border-bone/30 hover:border-volt transition-colors"
              >
                <div className="relative aspect-square overflow-hidden">
                  <HalftoneField {...p.pattern} />
                  <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl" style={{ color: p.pattern.dot, mixBlendMode: 'difference' }}>
                    {p.no}
                  </div>
                </div>
                <div className="px-1.5 py-1 font-mono text-[9px] flex items-center justify-between" style={{ background: p.pattern.dot, color: p.pattern.bg }}>
                  <span>{p.year}</span>
                  <span>{p.size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9×9 PARAM MATRIX */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ 9×9 MATRIX / 81 个半色调变体</div>
              <h2 className="font-display font-black text-4xl md:text-5xl mt-1">DOTS × DOTS.</h2>
              <p className="text-bone/60 text-sm mt-2">9 size × 9 gap = 81 种半色调密度。hover 看具体参数。</p>
            </div>
          </div>
          <ParamMatrix />
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-bone/50">
            <span>↖ 最小 2px/6px (印刷品)</span>
            <span>↘ 最大 16px/24px (Lichtenstein 油画风)</span>
          </div>
        </div>
      </section>

      {/* 5 SHAPES × 4 MASKS */}
      <section className="px-6 py-12 border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-bone/60 mb-3">▸ SHAPES × MASKS / 3 形状 × 4 蒙版 = 12 变体</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {([
              { shape: 'circle', mask: 'none' as const, label: 'CIRCLE · 圆点' },
              { shape: 'circle', mask: 'radial' as const, label: 'CIRCLE · 径向蒙版' },
              { shape: 'square', mask: 'none' as const, label: 'SQUARE · 方点' },
              { shape: 'square', mask: 'conic' as const, label: 'SQUARE · 锥形蒙版' },
              { shape: 'diamond', mask: 'none' as const, label: 'DIAMOND · 菱点' },
              { shape: 'diamond', mask: 'linear' as const, label: 'DIAMOND · 线性蒙版' },
              { shape: 'circle', mask: 'linear' as const, label: 'CIRCLE · 线性蒙版' },
              { shape: 'circle', mask: 'conic' as const, label: 'CIRCLE · 锥形蒙版' },
            ] as const).map((cfg, i) => (
              <div key={i} className="border-2 border-bone/30 aspect-square relative overflow-hidden group">
                <HalftoneField bg="#0a0a0a" dot={['#f0ff00','#ff3da5','#00e5ff','#9b5cff','#f5f1e8','#f0ff00','#ff3da5','#00e5ff'][i]} size={5} gap={12} shape={cfg.shape} mask={cfg.mask} />
                <div className="absolute bottom-2 left-2 right-2 font-mono text-[9px] px-1.5 py-0.5 bg-ink/80 text-bone group-hover:bg-volt group-hover:text-ink">
                  {cfg.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCE CODE */}
      <section className="px-6 py-12 border-b-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-bone/60">▸ SOURCE / 源码片段</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mt-1">COPY-PASTE READY.</h2>
            </div>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-bone/60 hover:text-volt">
              VIEW ON GITHUB <ArrowUpRight size={10} />
            </a>
          </div>
          <SourceCode />
        </div>
      </section>

      {/* FOOTER */}
      <section className="px-6 py-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="font-mono text-[10px] text-bone/40 space-y-1">
            <div>// HALFTONE EXHIBITION · 9 PANELS · 130 YEARS · 1 DREAM</div>
            <div>// 关联 [codex]→A 原则01 OBSESS · 09 MODULAR · 9 tag · 9 sizes</div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <Link to="/standards" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt">← CODEX</Link>
            <Link to="/themes" className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt">THEMES</Link>
            <Link to="/" className="px-3 py-1.5 bg-volt text-ink hover:bg-bone font-bold">HOME →</Link>
          </div>
        </div>
      </section>

      {active && <PanelDetail p={PANELS.find(x => x.no === active)!} onClose={() => setActive(null)} />}
    </div>
  );
}
