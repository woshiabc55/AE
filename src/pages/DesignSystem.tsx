import { Link } from 'react-router-dom';

const TOKENS = [
  { name: 'ink', cn: '墨', val: '#0a0a0a', role: '主背景 / PRIMARY BG' },
  { name: 'bone', cn: '骨', val: '#f5f1e8', role: '主文本 / PRIMARY FG' },
  { name: 'volt', cn: '电', val: '#f0ff00', role: '强调黄 / ACCENT' },
  { name: 'pink', cn: '梅', val: '#ff3da5', role: '警示粉 / WARNING' },
  { name: 'cyan', cn: '青', val: '#00e5ff', role: '信息青 / INFO' },
  { name: 'plum', cn: '紫', val: '#9b5cff', role: '装饰紫 / ORNAMENT' },
];

const FONTS = [
  { id: 'fraunces', name: 'Fraunces', role: 'DISPLAY', desc: '可变衬线，9–144 opsz，500–900 weight' },
  { id: 'inter', name: 'Inter Tight', role: 'UI', desc: '现代无衬线，紧字距，UI 首选' },
  { id: 'jet', name: 'JetBrains Mono', role: 'CODE', desc: '等宽字体，代码块专用' },
  { id: 'noto-sc', name: 'Noto Serif SC', role: '中文', desc: '思源宋体，衬线中文标题' },
];

const PROMPTS = [
  { cn: '少即是多。', en: 'Less but better.' },
  { cn: '用排版说话。', en: 'Let typography speak.' },
  { cn: '颜色不必多，但每个都必须勇敢。', en: 'Use few colors, but be bold.' },
  { cn: '网格是骨架，不是牢笼。', en: 'The grid is a skeleton, not a cage.' },
  { cn: '动效是叙事，不是装饰。', en: 'Motion is narrative, not decoration.' },
  { cn: '复制即正义。', en: 'Copy-paste ready is justice.' },
  { cn: '每一个像素都应当知道自己在干什么。', en: 'Every pixel should know its job.' },
  { cn: 'AI 看不见的细节，决定作品的灵魂。', en: 'Details unseen by AI decide the soul.' },
];

const SECTIONS = [
  { n: 'I', t: '色彩', en: 'COLOR' },
  { n: 'II', t: '字体', en: 'TYPOGRAPHY' },
  { n: 'III', t: '间距', en: 'SPACING' },
  { n: 'IV', t: '边框', en: 'BORDERS' },
  { n: 'V', t: '动效', en: 'MOTION' },
  { n: 'VI', t: '组件', en: 'COMPONENTS' },
];

export default function DesignSystem() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-volt mb-4">// DESIGN SYSTEM / 设计系统</div>
          <h1 className="font-display font-black text-7xl md:text-9xl leading-[0.85] tracking-tighter">
            <span className="block">THE</span>
            <span className="block text-volt">CODEX</span>
            <span className="block">OF</span>
            <span className="block">CRAFT.</span>
          </h1>
          <p className="mt-8 text-bone/70 max-w-2xl text-lg leading-relaxed">
            一份不断完善的视觉语言手册：颜色、字体、间距、动效与组件。
            所有 Skill Forge 的页面都遵循以下规则，所有未来添加的工具也应如此。
          </p>
        </div>
      </section>

      {/* 索引条 */}
      <section className="border-b-2 border-bone/20 px-6 py-4 sticky top-[72px] z-30 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 font-mono text-xs">
          {SECTIONS.map(s => (
            <a key={s.n} href={`#sec-${s.n}`} className="px-3 py-1.5 border-2 border-bone/30 hover:border-volt hover:text-volt transition-colors">
              <span className="text-bone/40">{s.n}.</span> {s.t} <span className="opacity-50">/ {s.en}</span>
            </a>
          ))}
        </div>
      </section>

      {/* I. COLOR */}
      <Section id="sec-I" n="I" t="色彩" en="COLOR" sub="六种主色 + 一组语义">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          {TOKENS.map(t => (
            <div key={t.name} className="border-2 border-bone/30 overflow-hidden group hover:border-bone">
              <div className="aspect-[16/9] relative flex items-end p-4" style={{ background: t.val }}>
                <span className="font-mono text-xs mix-blend-difference text-white">{t.val}</span>
              </div>
              <div className="p-3">
                <div className="flex items-baseline justify-between">
                  <div className="font-display font-black text-2xl">{t.cn}</div>
                  <div className="font-mono text-[10px] text-bone/50">--{t.name}</div>
                </div>
                <div className="font-mono text-[10px] text-bone/60 mt-1">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 提示语 */}
        <div className="mt-6 border-2 border-volt/40 p-4 flex items-start gap-3 bg-volt/5">
          <div className="font-mono text-xs text-volt shrink-0 mt-1">PROMPT →</div>
          <div className="font-display text-lg">{PROMPTS[2].cn}<span className="text-bone/40 text-sm ml-2">/ {PROMPTS[2].en}</span></div>
        </div>
      </Section>

      {/* II. TYPOGRAPHY */}
      <Section id="sec-II" n="II" t="字体" en="TYPOGRAPHY" sub="三语一字族 + 角色分工" light>
        <div className="mt-6 space-y-4">
          {FONTS.map(f => (
            <div key={f.id} className="border-2 border-bone/30 p-5 hover:border-volt transition-colors group">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                <div className="font-mono text-[10px] text-volt">{f.role}</div>
                <div className="font-mono text-[10px] text-bone/40">{f.name}</div>
              </div>
              <div className={`text-5xl md:text-7xl font-black leading-none ${f.id === 'fraunces' ? 'font-display' : f.id === 'jet' ? 'font-mono' : 'font-sans'}`}>
                锻造 SKILL FORGE
              </div>
              <div className="text-bone/60 text-sm mt-2">{f.desc}</div>
            </div>
          ))}
          {/* 字阶 */}
          <div className="border-2 border-bone/30 p-5">
            <div className="font-mono text-[10px] text-volt mb-3">SCALE / 字阶</div>
            {[
              { t: '9vw DISPLAY', s: 'text-7xl md:text-9xl' },
              { t: 'H1 标题', s: 'text-4xl md:text-5xl' },
              { t: 'H2 副标', s: 'text-2xl md:text-3xl' },
              { t: 'BODY 正文', s: 'text-base' },
              { t: 'CAPTION 注释', s: 'text-xs font-mono' },
            ].map((s, i) => (
              <div key={i} className={`font-display font-black ${s.s} leading-tight`}>{s.t}</div>
            ))}
          </div>
        </div>
      </Section>

      {/* III. SPACING */}
      <Section id="sec-III" n="III" t="间距" en="SPACING" sub="4px 基础栅格">
        <div className="mt-6 space-y-2">
          {[4, 8, 12, 16, 24, 32, 48, 64, 96].map(n => (
            <div key={n} className="flex items-center gap-4">
              <div className="w-16 font-mono text-xs text-bone/60">--s-{n}</div>
              <div className="bg-volt" style={{ width: n, height: 24 }} />
              <div className="font-mono text-xs text-bone/40">{n}px</div>
            </div>
          ))}
        </div>
      </Section>

      {/* IV. BORDERS */}
      <Section id="sec-IV" n="IV" t="边框" en="BORDERS" sub="2px 是工坊的灵魂" light>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { w: '1px', t: 'FINE / 细描边' },
            { w: '2px', t: 'DEFAULT / 默认' },
            { w: '4px', t: 'BOLD / 重点' },
          ].map(b => (
            <div key={b.w} className="aspect-square border-2 border-bone/30 hover:border-volt flex flex-col items-center justify-center transition-colors" style={{ borderWidth: b.w }}>
              <div className="font-display font-black text-3xl">{b.w}</div>
              <div className="font-mono text-xs text-bone/60 mt-2">{b.t}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* V. MOTION */}
      <Section id="sec-V" n="V" t="动效" en="MOTION" sub="克制、有节奏、有惊喜">
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            { n: 'fade-in', d: '页面切换淡入上滑 0.4s', css: 'animate-fade-in' },
            { n: 'marquee', d: '无限横向滚动 30s', css: 'marquee' },
            { n: 'hover-lift', d: 'hover 上浮 4px', css: 'hover-lift' },
            { n: 'bounce', d: '5 柱错位弹跳', css: '' },
          ].map(m => (
            <div key={m.n} className="border-2 border-bone/30 p-4">
              <div className="font-mono text-[10px] text-volt">{m.n}</div>
              <div className={`text-bone/80 text-sm mt-1 ${m.css}`}>·  {m.d}</div>
              <div className="mt-3 h-12 bg-bone/5 border border-bone/20 flex items-center justify-center">
                {m.n === 'bounce' && (
                  <div className="flex gap-1">
                    {[0,1,2,3,4].map(i => <div key={i} className="w-2 h-6 bg-volt" style={{ animation: 'bounce 1s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}`}</style>
      </Section>

      {/* VI. COMPONENTS */}
      <Section id="sec-VI" n="VI" t="组件" en="COMPONENTS" sub="工坊的最小积木" light>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* 按钮 */}
          <div className="border-2 border-bone/30 p-5">
            <div className="font-mono text-[10px] text-volt mb-3">BUTTONS / 按钮</div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-volt text-ink font-bold border-2 border-volt">PRIMARY</button>
              <button className="px-4 py-2 bg-bone text-ink font-bold border-2 border-bone">SECONDARY</button>
              <button className="px-4 py-2 bg-transparent text-bone font-bold border-2 border-bone hover:border-volt">GHOST</button>
              <button className="px-4 py-2 bg-pink text-ink font-bold border-2 border-pink">DANGER</button>
            </div>
          </div>
          {/* 标签 */}
          <div className="border-2 border-bone/30 p-5">
            <div className="font-mono text-[10px] text-volt mb-3">TAGS / 标签</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-volt text-ink text-[10px] font-mono font-bold">视觉</span>
              <span className="px-2 py-0.5 bg-pink text-ink text-[10px] font-mono font-bold">交互</span>
              <span className="px-2 py-0.5 bg-cyan text-ink text-[10px] font-mono font-bold">动画</span>
              <span className="px-2 py-0.5 border-2 border-bone/40 text-[10px] font-mono">#blur</span>
              <span className="px-2 py-0.5 border-2 border-bone/40 text-[10px] font-mono">#card</span>
            </div>
          </div>
          {/* 卡片 */}
          <div className="border-2 border-bone/30 p-5">
            <div className="font-mono text-[10px] text-volt mb-3">CARD / 卡片</div>
            <div className="border-2 border-bone/20 p-3 hover:border-volt transition-colors">
              <div className="aspect-video bg-gradient-to-br from-pink to-cyan mb-2" />
              <div className="font-display font-black">卡片标题</div>
              <div className="text-xs text-bone/60 mt-1">副标题与说明文字。</div>
            </div>
          </div>
          {/* 输入框 */}
          <div className="border-2 border-bone/30 p-5">
            <div className="font-mono text-[10px] text-volt mb-3">INPUT / 输入</div>
            <input className="w-full bg-transparent border-2 border-bone/40 focus:border-volt focus:outline-none px-3 py-2 text-sm font-mono" placeholder="在此输入…" defaultValue="" />
            <div className="mt-2 font-mono text-[10px] text-bone/40">Focus 状态会变为黄色边框</div>
          </div>
        </div>
      </Section>

      {/* PROMPTS 区 */}
      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
            <span className="font-mono text-xs text-bone/40">VII</span>
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">提示词</h2>
            <span className="font-mono text-xs text-bone/60 ml-2">/ CONCEPTUAL PROMPTS</span>
          </div>
          <p className="mt-4 text-bone/60 text-sm max-w-2xl">为中文社区的工匠们准备的设计提示词——可作为创作灵感的起点。</p>
          <div className="mt-8 grid md:grid-cols-2 gap-3">
            {PROMPTS.map((p, i) => (
              <div key={i} className="border-2 border-bone/30 p-5 hover:border-volt transition-colors group">
                <div className="font-mono text-[10px] text-bone/40 mb-2">PROMPT {String(i+1).padStart(2,'0')}</div>
                <div className="font-display font-black text-2xl md:text-3xl leading-tight group-hover:text-volt transition-colors">{p.cn}</div>
                <div className="text-bone/50 text-sm mt-2 font-mono">{p.en}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/font-garden" className="inline-block px-6 py-3 bg-volt text-ink font-bold border-2 border-bone hover:rotate-1 transition-transform">
              继续探索 → 字体花园 / FONT GARDEN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ id, n, t, en, sub, children, light }: { id: string; n: string; t: string; en: string; sub: string; children: React.ReactNode; light?: boolean }) {
  return (
    <section id={id} className={`border-b-2 border-bone/20 px-6 py-12 ${light ? 'bg-ink' : 'bg-ink'}`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
          <span className="font-mono text-xs text-bone/40">{n}</span>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">{t}</h2>
          <span className="font-mono text-xs text-bone/60 ml-2">/ {en}</span>
          <span className="ml-auto font-mono text-xs text-bone/40 hidden md:inline">{sub}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
