import { Link } from 'react-router-dom';
import { Check, X, BookOpen } from 'lucide-react';

const DO_RULES = [
  { t: '纯前端实现', d: '所有工具只使用 HTML / CSS / 原生 JS 或 React，不引入服务端依赖。' },
  { t: '可独立运行', d: '每个工具的源码必须可单独复制粘贴后直接运行，不依赖外部资源。' },
  { t: '语义化结构', d: '使用正确的 HTML5 语义标签（section / article / nav / aside 等），便于无障碍阅读。' },
  { t: '明确的设计意图', d: '在动效、颜色、排版上做出清晰可被识别的设计选择，避免"AI 平均感"。' },
  { t: '响应式优先', d: '在 360px ~ 1920px 的视口下都能保持视觉完整性。' },
  { t: '性能预算内', d: '单工具首屏体积不超过 20KB（gzip 后），动画使用 transform / opacity 优先。' },
];

const DONT_RULES = [
  { t: '避免通用字体陷阱', d: '不要使用 Inter / Roboto / Arial / system-ui 作为唯一显示字体。' },
  { t: '避免紫色渐变', d: '白底 + 紫色渐变是 AI 视觉的典型，请使用真正符合主题的对比色。' },
  { t: '不要堆砌微交互', d: '一次精心编排的入场动画胜过 30 个 hover 抖动。' },
  { t: '不要为了多而多', d: '功能密度应服务于清晰度，而非展示"我能做很多事"。' },
];

const PRINCIPLES = [
  { n: '01', t: 'OBSESS OVER DETAILS', d: '字距、阴影偏移、border-radius 都不是 0.5 的倍数，每一个数值都为设计服务。' },
  { n: '02', t: 'BOLD BY DEFAULT', d: '要么极简到极致，要么热闹到极致。中间地带不属于 Skill Forge。' },
  { n: '03', t: 'COPY-PASTE READY', d: '源码应当可以无修改地运行在用户的项目中，不留 TODO。' },
  { n: '04', t: 'OPEN & FORKABLE', d: 'MIT 协议。拆解、改造、二次发布都是被鼓励的。' },
];

export default function Standards() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-16">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="font-mono text-xs text-volt mb-4">// STANDARDS / 条例</div>
            <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.85] tracking-tighter">
              THE<br />
              <span className="text-volt">FORGE</span><br />
              CODEX.
            </h1>
            <p className="mt-8 text-bone/70 max-w-2xl text-lg leading-relaxed">
              Skill Forge 的工坊守则——关于什么应该被锻造，什么应该被丢弃。
              任何想要 <Link to="/about" className="text-volt underline">投稿</Link> 新工具的工匠，都应该先通读这份文档。
            </p>
          </div>
          <aside className="border-2 border-bone/30 p-5 h-fit">
            <div className="flex items-center gap-2 font-mono text-xs text-bone/60 mb-3">
              <BookOpen size={14} /> INDEX
            </div>
            <ul className="space-y-2 font-mono text-sm">
              <li><a href="#principles" className="hover:text-volt">A. 设计原则</a></li>
              <li><a href="#do" className="hover:text-volt">B. 应当 DO</a></li>
              <li><a href="#dont" className="hover:text-volt">C. 避免 DONT</a></li>
              <li><a href="#ratings" className="hover:text-volt">D. 评分维度</a></li>
              <li><a href="#contribute" className="hover:text-volt">E. 投稿方式</a></li>
            </ul>
          </aside>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section id="principles" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <Header n="A" t="设计原则" en="DESIGN PRINCIPLES" />
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {PRINCIPLES.map(p => (
              <div key={p.n} className="border-2 border-bone/30 p-6 hover:border-volt transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-display font-black text-5xl text-volt group-hover:rotate-3 transition-transform">{p.n}</span>
                  <span className="font-mono text-[10px] text-bone/40 mt-2">PRINCIPLE</span>
                </div>
                <div className="font-display font-black text-xl tracking-tight">{p.t}</div>
                <p className="text-bone/70 text-sm mt-2 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DO */}
      <section id="do" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <Header n="B" t="应当" en="DO" color="text-cyan" />
          <div className="mt-8 grid md:grid-cols-2 gap-3">
            {DO_RULES.map((r, i) => (
              <div key={i} className="border-2 border-cyan/40 p-5 flex gap-3 bg-cyan/5">
                <div className="shrink-0 w-8 h-8 bg-cyan text-ink flex items-center justify-center">
                  <Check size={18} strokeWidth={3} />
                </div>
                <div>
                  <div className="font-display font-black text-lg">{r.t}</div>
                  <p className="text-bone/70 text-sm mt-1">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONT */}
      <section id="dont" className="border-b-2 border-bone/20 px-6 py-12 bg-pink/5">
        <div className="max-w-[1400px] mx-auto">
          <Header n="C" t="避免" en="DON'T" color="text-pink" />
          <div className="mt-8 grid md:grid-cols-2 gap-3">
            {DONT_RULES.map((r, i) => (
              <div key={i} className="border-2 border-pink/40 p-5 flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-pink text-ink flex items-center justify-center">
                  <X size={18} strokeWidth={3} />
                </div>
                <div>
                  <div className="font-display font-black text-lg">{r.t}</div>
                  <p className="text-bone/70 text-sm mt-1">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RATINGS */}
      <section id="ratings" className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <Header n="D" t="评分维度" en="RUBRIC" />
          <p className="mt-4 text-bone/60 text-sm max-w-2xl">每个被收录的工具都按以下 6 个维度评分，1-5 分。</p>
          <div className="mt-8 grid md:grid-cols-3 gap-3">
            {[
              { l: '视觉冲击力', d: 'VISUAL IMPACT' },
              { l: '代码简洁度', d: 'CODE BREVITY' },
              { l: '可复用性', d: 'REUSABILITY' },
              { l: '性能', d: 'PERFORMANCE' },
              { l: '可读性', d: 'READABILITY' },
              { l: '趣味性', d: 'DELIGHT' },
            ].map((d, i) => (
              <div key={i} className="border-2 border-bone/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-bone/60">{d.d}</span>
                  <span className="font-mono text-xs font-bold text-volt">5.0</span>
                </div>
                <div className="font-display font-black text-lg mt-1">{d.l}</div>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <div key={k} className={`h-1 flex-1 ${k < 4 ? 'bg-volt' : 'bg-bone/20'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRIBUTE */}
      <section id="contribute" className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <Header n="E" t="投稿方式" en="CONTRIBUTE" />
          <div className="mt-8 grid md:grid-cols-3 gap-4 font-mono text-sm">
            {[
              { n: '01', t: 'FORK', d: '在 GitHub 上 fork skill-forge 仓库。' },
              { n: '02', t: 'ADD', d: '在 src/data/tools.ts 中按 Tool 接口新增一条记录，附上可独立运行的 Preview 与 code 字符串。' },
              { n: '03', t: 'PUSH', d: '提交 PR，附上 100 字以内的设计说明。' },
            ].map(s => (
              <div key={s.n} className="border-2 border-bone/30 p-5">
                <div className="font-display font-black text-3xl text-volt">{s.n}</div>
                <div className="font-display font-black text-xl tracking-tight mt-2">{s.t}</div>
                <p className="text-bone/70 mt-2">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-2 border-volt p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-display font-black text-2xl">READY TO FORGE?</div>
              <div className="text-bone/60 text-sm mt-1">来为工坊添一件工具，或通读 28 个现有工具寻找灵感。</div>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="px-4 py-2 bg-bone text-ink font-mono font-bold border-2 border-bone hover:bg-volt">浏览工具 →</Link>
              <a href="https://github.com" className="px-4 py-2 bg-ink text-bone font-mono font-bold border-2 border-bone hover:border-volt">GITHUB ↗</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Header({ n, t, en, color = 'text-volt' }: { n: string; t: string; en: string; color?: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
      <span className={`font-display font-black text-3xl ${color}`}>{n}</span>
      <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">{t}</h2>
      <span className="font-mono text-xs text-bone/60 ml-2">/ {en}</span>
    </div>
  );
}
