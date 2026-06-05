import { useEffect, useRef, useState } from 'react';
import {
  AudioWaveform, AudioBars, AudioParticle,
  TypeGlitch, TypeWave, TypeLiquid,
  Depth3DCard, DepthParallax, DepthLayers,
  ColorWheel, ColorGradient, ColorMixer,
  LayoutBento, LayoutMasonry, LayoutIso,
  MotionStagger, MotionSpring, MotionMorph,
  MicroButton, MicroToggle, MicroFocus,
  PatternTruchet, PatternVoronoi, PatternBauhaus,
} from '../components/preview/Packs';

interface Section {
  id: string;
  number: string;
  chapter: string;
  title: string;
  metric: { value: string; unit: string; label: string };
  body: string;
  Demo: React.FC;
  color: 'volt' | 'cyan' | 'pink' | 'plum';
  layout: 'left' | 'right' | 'center' | 'fullbleed';
}

const SECTIONS: Section[] = [
  {
    id: 'origin',
    number: '00',
    chapter: '序章 / ORIGIN',
    title: '一座为前端手艺而生的档案馆',
    metric: { value: '59', unit: 'UI 原子', label: '总工具数' },
    body: 'SKILL FORGE 不是 UI 库。它是一座活档案馆 — 每一格都是可独立复制的小型实验，HTML / CSS / JS 三大基础技术的独立小品。',
    Demo: TypeGlitch,
    color: 'volt',
    layout: 'left',
  },
  {
    id: 'mass',
    number: '01',
    chapter: '规模 / MASS',
    title: '从单点工具到主题集群',
    metric: { value: '8', unit: '个技能包', label: '8 PACKS' },
    body: '工具按主题打包：Audio / Kinetic / Depth / Color / Layout / Motion / Micro / Pattern。每个包 4-5 个工具，共享装饰外壳与五级精细度。',
    Demo: LayoutBento,
    color: 'cyan',
    layout: 'right',
  },
  {
    id: 'spectrum',
    number: '02',
    chapter: '色谱 / SPECTRUM',
    title: '四色调色板贯穿全部界面',
    metric: { value: '4', unit: '主题色', label: 'PALETTE' },
    body: 'volt (黄) · cyan (青) · pink (粉) · plum (紫)。每色承担不同语义：volt 强调 / cyan 链接 / pink 警示 / plum 顶级装饰。',
    Demo: ColorWheel,
    color: 'pink',
    layout: 'left',
  },
  {
    id: 'gradient',
    number: '03',
    chapter: '渐变 / GRADIENT',
    title: '色相的连续过渡',
    metric: { value: '135°', unit: '默认角度', label: 'GRAD' },
    body: 'linear-gradient 135° 是品牌渐变。从 volt 到 pink 再到 cyan，色相均匀过渡。',
    Demo: ColorGradient,
    color: 'cyan',
    layout: 'right',
  },
  {
    id: 'mixer',
    number: '04',
    chapter: '混合 / BLEND',
    title: 'mix-blend-mode 创造新色',
    metric: { value: '4', unit: '层叠加', label: 'LAYERS' },
    body: 'screen 模式让黄色 + 青色 = 亮白。多层叠加产生单一通道无法达到的色彩。',
    Demo: ColorMixer,
    color: 'pink',
    layout: 'left',
  },
  {
    id: 'wave',
    number: '05',
    chapter: '波动 / WAVE',
    title: '让像素随时间摆动',
    metric: { value: '60', unit: '条 / 秒', label: 'FRAMERATE' },
    body: '60 根柱条以 0.04s 错位 delay 摆动 — CSS keyframes 完全替代 JS 动画，JS 线程 0% 占用。',
    Demo: AudioWaveform,
    color: 'volt',
    layout: 'right',
  },
  {
    id: 'bars',
    number: '06',
    chapter: '频谱 / SPECTRUM',
    title: '高度变化即节奏',
    metric: { value: '24', unit: '条柱', label: 'EQ' },
    body: 'cubic-bezier 缓动 + 错位 delay = 频谱跳动效果。',
    Demo: AudioBars,
    color: 'cyan',
    layout: 'left',
  },
  {
    id: 'float',
    number: '07',
    chapter: '粒子 / PARTICLE',
    title: '漂浮 30 颗像素',
    metric: { value: '30', unit: '颗粒', label: 'PARTICLES' },
    body: '每颗像素有独立的浮动轨迹和时长，靠 CSS @keyframes 自然漂移。',
    Demo: AudioParticle,
    color: 'pink',
    layout: 'right',
  },
  {
    id: 'depth',
    number: '08',
    chapter: '纵深 / DEPTH',
    title: '二维屏幕上的三维世界',
    metric: { value: '3', unit: '层堆叠', label: 'LAYERS' },
    body: 'perspective 800 + rotateX/Y + preserve-3d = 真实深度。',
    Demo: Depth3DCard,
    color: 'plum',
    layout: 'left',
  },
  {
    id: 'parallax',
    number: '09',
    chapter: '视差 / PARALLAX',
    title: '远小近大的视觉欺骗',
    metric: { value: '4', unit: '层深度', label: 'PARALLAX' },
    body: '4 块色块以递增偏移叠加，模拟相机景深。',
    Demo: DepthParallax,
    color: 'cyan',
    layout: 'right',
  },
  {
    id: 'iso',
    number: '10',
    chapter: '等距 / ISOMETRIC',
    title: '30° 倾角的空间',
    metric: { value: '30°', unit: '倾角', label: 'ISO' },
    body: '经典游戏 UI 视角：rotate(-30deg) skewX(30deg) 组合。',
    Demo: LayoutIso,
    color: 'volt',
    layout: 'left',
  },
  {
    id: 'masonry',
    number: '11',
    chapter: '瀑布 / MASONRY',
    title: '不等高网格的信息密度',
    metric: { value: '9', unit: '块', label: 'TILES' },
    body: 'Pinterest 式瀑布流：每列高度自适应，9 块以 40-70% 高度错落。',
    Demo: LayoutMasonry,
    color: 'cyan',
    layout: 'right',
  },
  {
    id: 'stagger',
    number: '12',
    chapter: '错位 / STAGGER',
    title: '序列感的诞生',
    metric: { value: '0.1s', unit: 'delay 步距', label: 'STAGGER' },
    body: '6 根柱以 0.1s 递增 delay 起跳 — stagger 是动效编排的基石。',
    Demo: MotionStagger,
    color: 'pink',
    layout: 'left',
  },
  {
    id: 'spring',
    number: '13',
    chapter: '弹簧 / SPRING',
    title: '物理回弹的弹性',
    metric: { value: '0.68', unit: '回弹系数', label: 'SPRING' },
    body: 'cubic-bezier(0.68, -0.55, 0.27, 1.55) — 越过终点的反弹。',
    Demo: MotionSpring,
    color: 'volt',
    layout: 'right',
  },
  {
    id: 'morph',
    number: '14',
    chapter: '形变 / MORPH',
    title: 'SVG 路径的形态切换',
    metric: { value: '2', unit: '形', label: 'SHAPES' },
    body: '菱形 ↔ 花瓣：CSS d 属性的关键帧插值。',
    Demo: MotionMorph,
    color: 'cyan',
    layout: 'left',
  },
  {
    id: 'button',
    number: '15',
    chapter: '按钮 / BUTTON',
    title: '五态细节里的魔鬼',
    metric: { value: '5', unit: '态', label: 'STATES' },
    body: 'default / hover / active / focus / disabled — 每一态都是独立设计。',
    Demo: MicroButton,
    color: 'plum',
    layout: 'right',
  },
  {
    id: 'toggle',
    number: '16',
    chapter: '开关 / TOGGLE',
    title: '状态即视觉',
    metric: { value: '2', unit: '态', label: 'ON / OFF' },
    body: '滑动指示器 + 颜色反转 + 弹性曲线，2 态做出层次感。',
    Demo: MicroToggle,
    color: 'cyan',
    layout: 'left',
  },
  {
    id: 'focus',
    number: '17',
    chapter: '焦点 / FOCUS',
    title: '无障碍的视觉语言',
    metric: { value: '2', unit: 'px', label: 'RING' },
    body: 'focus:ring-2 focus:ring-pink/50 让键盘用户追踪当前位置。',
    Demo: MicroFocus,
    color: 'pink',
    layout: 'right',
  },
  {
    id: 'truchet',
    number: '18',
    chapter: '拼砖 / TRUCHET',
    title: '1/4 圆弧的 64 块组合',
    metric: { value: '64', unit: '砖', label: 'TILES' },
    body: '8×8 网格每块按 0/90/180/270° 旋转，组成有机曲线。',
    Demo: PatternTruchet,
    color: 'volt',
    layout: 'left',
  },
  {
    id: 'voronoi',
    number: '19',
    chapter: '细胞 / VORONOI',
    title: '种子点决定形状',
    metric: { value: '4', unit: '种子点', label: 'SEEDS' },
    body: '径向渐变模拟细胞边界，4 颗种子点产生的不规则图案。',
    Demo: PatternVoronoi,
    color: 'cyan',
    layout: 'right',
  },
  {
    id: 'bauhaus',
    number: '20',
    chapter: '包豪斯 / BAUHAUS',
    title: '1920 的原色 + 几何',
    metric: { value: '5', unit: '元素', label: 'ELEMENTS' },
    body: '圆 + 方 + 十字 = 经典包豪斯。百年配色永不过时。',
    Demo: PatternBauhaus,
    color: 'pink',
    layout: 'left',
  },
  {
    id: 'wave2',
    number: '21',
    chapter: '波动 / WAVE 2',
    title: '字母也会跳舞',
    metric: { value: '4', unit: '字', label: 'LETTERS' },
    body: 'W · A · V · E 各以独立 delay 上下浮动，4 步距组成完整波形。',
    Demo: TypeWave,
    color: 'volt',
    layout: 'right',
  },
  {
    id: 'liquid',
    number: '22',
    chapter: '液态 / LIQUID',
    title: 'SVG 路径是流动的水',
    metric: { value: '6', unit: '字符', label: 'CHARS' },
    body: 'LIQUID 字样被 SVG 渐变 + 路径包围，几何与文字的融合。',
    Demo: TypeLiquid,
    color: 'cyan',
    layout: 'left',
  },
  {
    id: 'layers',
    number: '23',
    chapter: '堆叠 / LAYERS',
    title: '纸牌的物理错觉',
    metric: { value: '3', unit: '张', label: 'CARDS' },
    body: '3 张卡片以 -10°/-5°/0° 错位堆叠，呈现翻动效果。',
    Demo: DepthLayers,
    color: 'plum',
    layout: 'right',
  },
];

const COLOR_TEXT: Record<string, string> = {
  volt: 'text-volt', cyan: 'text-cyan', pink: 'text-pink', plum: 'text-plum',
};
const COLOR_BG: Record<string, string> = {
  volt: 'bg-volt', cyan: 'bg-cyan', pink: 'bg-pink', plum: 'bg-plum',
};
const COLOR_BORDER: Record<string, string> = {
  volt: 'border-volt', cyan: 'border-cyan', pink: 'border-pink', plum: 'border-plum',
};
const COLOR_CHIP: Record<string, string> = {
  volt: 'bg-volt/20 text-volt',
  cyan: 'bg-cyan/20 text-cyan',
  pink: 'bg-pink/20 text-pink',
  plum: 'bg-plum/20 text-plum',
};

export default function Manifesto() {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / Math.max(total, 1)));
      // 找出当前激活的 section
      const sections = el.querySelectorAll('[data-section]');
      let active = 0;
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.5) active = i;
      });
      setActiveIdx(active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* 进度条 - 固定在顶部 */}
      <div className="fixed top-[72px] left-0 right-0 z-30 h-[2px] bg-bone/10 pointer-events-none">
        <div className="h-full bg-volt transition-all" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* 右侧章节导航 */}
      <nav className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-1 max-h-[60vh] overflow-hidden">
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`flex items-center gap-2 group transition-all ${i === activeIdx ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
          >
            <span className="font-mono text-[9px] text-bone/40 w-6 text-right">{s.number}</span>
            <span className={`w-1 h-1 ${i === activeIdx ? COLOR_BG[s.color] : 'bg-bone/30'} transition-all`} />
          </a>
        ))}
      </nav>

      {/* 顶部统计 */}
      <section className="border-b-2 border-bone/20 px-6 py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6 font-mono text-xs">
            <span className="w-2 h-2 bg-pink rounded-full animate-pulse" />
            <span className="text-bone/60">A LONG-FORM VISUAL CODEX / 长界视觉展卷 / 24 SECTIONS</span>
          </div>
          <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.82] tracking-tighter">
            <span className="block">VISUAL</span>
            <span className="block">CODEX</span>
            <span className="block text-bone/30 text-[6vw] md:text-[4vw]">视觉法典 / 长卷</span>
          </h1>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
            {[
              { v: '24', l: 'SECTIONS' },
              { v: '8', l: 'PACKS' },
              { v: '38', l: 'NEW UI' },
              { v: '59', l: 'TOTAL TOOLS' },
              { v: '9', l: 'QA ISSUES' },
              { v: '5', l: 'LEVELS' },
            ].map(s => (
              <div key={s.l} className="border-l-2 border-volt pl-3 py-1">
                <div className="font-display font-black text-3xl text-volt">{s.v}</div>
                <div className="text-[10px] text-bone/50">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-2 font-mono text-xs text-bone/50">
            <span>↓ 向下滚动</span>
            <span className="block w-12 h-px bg-bone/30" />
            <span>SCROLL DOWN</span>
          </div>
        </div>
      </section>

      {/* 各 section */}
      {SECTIONS.map((s, i) => (
        <SectionBlock key={s.id} section={s} index={i} />
      ))}

      {/* 收尾 */}
      <section className="px-6 py-32 border-t-2 border-bone/20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="font-mono text-[10px] text-bone/40 mb-4">END OF CODEX / 法典完</div>
          <h2 className="font-display font-black text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter">
            <span className="text-volt">END.</span>
            <span className="text-bone/30">/</span>
            <span className="text-pink">▓▓▓</span>
          </h2>
          <div className="mt-8 font-mono text-xs text-bone/50 max-w-xl mx-auto">
            24 sections · scroll progress {Math.round(progress * 100)}%
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionBlock({ section, index }: { section: Section; index: number }) {
  const blockRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Demo = section.Demo;
  const accent = COLOR_TEXT[section.color];
  const accentBg = COLOR_BG[section.color];
  const accentBorder = COLOR_BORDER[section.color];
  const accentChip = COLOR_CHIP[section.color];

  if (section.layout === 'center') {
    return (
      <section
        ref={blockRef}
        id={section.id}
        data-section
        className="min-h-screen px-6 py-24 flex items-center justify-center border-b border-bone/10"
      >
        <div className={`max-w-3xl text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className={`inline-block px-3 py-1 ${accentChip} font-mono text-[10px] mb-4`}>
            {section.number} · {section.chapter}
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl leading-none tracking-tighter mb-6">
            {section.title}
          </h2>
          <p className="text-bone/70 leading-relaxed mb-8 max-w-2xl mx-auto">{section.body}</p>
          <div className="aspect-video max-w-2xl mx-auto border-2 overflow-hidden">
            <Demo />
          </div>
        </div>
      </section>
    );
  }

  if (section.layout === 'fullbleed') {
    return (
      <section
        ref={blockRef}
        id={section.id}
        data-section
        className="min-h-screen relative border-b border-bone/10"
      >
        <div className="absolute inset-0">
          <Demo />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        <div className={`relative z-10 min-h-screen flex items-center px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="max-w-xl">
            <div className={`inline-block px-3 py-1 ${accentChip} font-mono text-[10px] mb-4`}>
              {section.number} · {section.chapter}
            </div>
            <h2 className={`font-display font-black text-5xl md:text-7xl leading-none tracking-tighter mb-6 ${accent}`}>
              {section.title}
            </h2>
            <p className="text-bone/80 leading-relaxed">{section.body}</p>
          </div>
        </div>
      </section>
    );
  }

  // left or right
  const isRight = section.layout === 'right';
  return (
    <section
      ref={blockRef}
      id={section.id}
      data-section
      className="min-h-screen px-6 py-20 flex items-center border-b border-bone/10"
    >
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${isRight ? 'lg:order-2' : ''}`}>
          <div className="aspect-[4/3] border-2 overflow-hidden">
            <Demo />
          </div>
        </div>
        <div className={`transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${isRight ? 'lg:order-1' : ''}`}>
          <div className="flex items-baseline gap-3 mb-4">
            <span className={`font-display font-black text-6xl md:text-7xl ${accent}`}>{section.number}</span>
            <span className="font-mono text-[10px] text-bone/50 uppercase tracking-widest">{section.chapter}</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl leading-tight tracking-tighter mb-4">
            {section.title}
          </h2>
          <p className="text-bone/70 leading-relaxed mb-6 text-base md:text-lg">{section.body}</p>
          <div className={`inline-flex items-baseline gap-2 px-3 py-2 border-2 ${accentBorder}`}>
            <span className={`font-display font-black text-3xl ${accent}`}>{section.metric.value}</span>
            <span className="font-mono text-[10px] text-bone/60">{section.metric.unit} · {section.metric.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
