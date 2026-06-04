// 字体花园：20+ 种展示组合，按"风格 × 情绪"组织
const SPECIMENS = [
  { id: 'f1', family: '"Fraunces", serif', weight: 900, size: 'clamp(60px, 12vw, 200px)', text: 'Bold', cn: '勇敢', tag: 'SERIF · 黑重' },
  { id: 'f2', family: '"Fraunces", serif', weight: 300, size: 'clamp(60px, 12vw, 200px)', text: 'Elegant', cn: '优雅', tag: 'SERIF · 细纤' },
  { id: 'f3', family: '"Inter Tight", sans-serif', weight: 700, size: 'clamp(60px, 12vw, 200px)', text: 'Modern', cn: '现代', tag: 'SANS · 紧凑' },
  { id: 'f4', family: '"Inter Tight", sans-serif', weight: 300, size: 'clamp(60px, 12vw, 200px)', text: 'Quiet', cn: '静默', tag: 'SANS · 极细' },
  { id: 'f5', family: '"JetBrains Mono", monospace', weight: 700, size: 'clamp(40px, 8vw, 140px)', text: 'CODE', cn: '代码', tag: 'MONO · 规整' },
  { id: 'f6', family: '"JetBrains Mono", monospace', weight: 400, size: 'clamp(40px, 8vw, 140px)', text: 'function()', cn: '函数', tag: 'MONO · 文档' },
  { id: 'f7', family: '"Fraunces", serif', weight: 700, size: 'clamp(80px, 15vw, 260px)', text: 'Aa', cn: '字形', tag: 'DECK · 封面' },
  { id: 'f8', family: '"Inter Tight", sans-serif', weight: 900, size: 'clamp(60px, 12vw, 200px)', text: 'IMPACT', cn: '冲击', tag: 'BOLD · 标题' },
  { id: 'f9', family: 'Georgia, "Times New Roman", serif', weight: 400, size: 'clamp(50px, 10vw, 160px)', text: 'Classic', cn: '古典', tag: 'SERIF · 系统' },
  { id: 'f10', family: '"Courier New", monospace', weight: 700, size: 'clamp(40px, 8vw, 120px)', text: 'TYPE', cn: '打字机', tag: 'MONO · 系统' },
  { id: 'f11', family: '"Fraunces", serif', weight: 900, size: 'clamp(80px, 14vw, 240px)', text: 'AЯ', cn: '异国', tag: 'CYRILLIC' },
  { id: 'f12', family: '"Inter Tight", sans-serif', weight: 700, size: 'clamp(50px, 10vw, 180px)', text: '中文', cn: '汉字', tag: 'CJK' },
];

const ROTATIONS = ['-2deg', '1deg', '-1deg', '2deg', '0deg', '-3deg', '1.5deg', '-1.5deg', '2.5deg', '-2.5deg', '1deg', '-1deg'];

export default function FontGarden() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative">
          <div className="font-mono text-xs text-volt mb-6">// FONT GARDEN / 字体花园</div>
          <h1 className="font-display font-black text-[16vw] md:text-[12vw] leading-[0.82] tracking-tighter">
            <span className="block italic">A garden</span>
            <span className="block text-volt">of glyphs</span>
            <span className="block">— and silence.</span>
          </h1>
          <p className="mt-10 text-bone/70 max-w-2xl text-lg leading-relaxed">
            字体不是装饰。每一个字形都是一段历史的回声——粗细、衬线、字距、倾斜角，决定了文字"听起来"的样子。
            这一页是工坊字体选用的速览。
          </p>
          <div className="absolute right-0 top-0 hidden md:block font-mono text-[10px] text-bone/40 text-right">
            <div>12 SPECIMENS</div>
            <div>3 FAMILIES</div>
            <div>∞ GLYPHS</div>
          </div>
        </div>
      </section>

      {/* 主展示 */}
      <section className="border-b-2 border-bone/20">
        <div className="max-w-[1400px] mx-auto">
          {SPECIMENS.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr_180px] gap-6 px-6 py-10 border-b-2 border-bone/20 hover:bg-bone/5 transition-colors group"
            >
              <div>
                <div className="font-mono text-[10px] text-bone/40">№ {String(i+1).padStart(2,'0')}</div>
                <div className="font-mono text-xs text-volt mt-1">{s.tag}</div>
              </div>
              <div
                className="leading-[0.85] tracking-tighter select-none break-all"
                style={{
                  fontFamily: s.family,
                  fontWeight: s.weight as any,
                  fontSize: s.size,
                  transform: `rotate(${ROTATIONS[i % ROTATIONS.length]})`,
                  transformOrigin: 'left center',
                }}
              >
                {s.text}
              </div>
              <div className="text-right font-mono text-xs text-bone/60 md:text-left">
                <div className="text-bone/40">CHINESE</div>
                <div className="font-display font-black text-2xl text-bone mt-1">{s.cn}</div>
                <div className="mt-3 text-bone/40">SPECIMEN</div>
                <div className="mt-1 break-all">{s.family.split(',')[0].replace(/"/g, '')}</div>
                <div className="mt-1">weight {s.weight}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 中文字体抽屉 */}
      <section className="border-b-2 border-bone/20 px-6 py-12 bg-bone text-ink">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 border-b-2 border-ink/20 pb-3">
            <span className="font-mono text-xs text-ink/40">CJK</span>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">汉字的魅力</h2>
            <span className="ml-auto font-mono text-xs text-ink/40">建议：使用系统默认衬线中文即可</span>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-3">
            {[
              { t: '笔墨纸砚', f: '"Fraunces", "Noto Serif SC", serif', w: 900 },
              { t: '工匠精神', f: '"Inter Tight", "Noto Sans SC", sans-serif', w: 700 },
              { t: '锻造未来', f: '"JetBrains Mono", "Noto Sans Mono CJK SC", monospace', w: 700 },
            ].map((s, i) => (
              <div key={i} className="border-2 border-ink/20 p-6 hover:border-ink transition-colors group">
                <div className="font-mono text-[10px] text-ink/40 mb-2">№ 0{i+1}</div>
                <div className="font-black text-4xl md:text-5xl leading-tight" style={{ fontFamily: s.f, fontWeight: s.w as any }}>
                  {s.t}
                </div>
                <div className="mt-3 font-mono text-[10px] text-ink/50 break-all">{s.f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 配对示例 */}
      <section className="px-6 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-baseline gap-4 border-b-2 border-bone/20 pb-3">
            <span className="font-mono text-xs text-bone/40">PAIR</span>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">搭配示例</h2>
            <span className="ml-auto font-mono text-xs text-bone/40">推荐 3 种</span>
          </div>
          <div className="mt-8 space-y-4">
            {[
              { head: 'Fraunces 900', headStyle: 'font-display font-black', sub: 'Inter Tight 700', subStyle: 'font-sans font-bold', text: '在像素的森林里，' },
              { head: 'Inter Tight 900', headStyle: 'font-sans font-black', sub: 'JetBrains Mono', subStyle: 'font-mono', text: 'measure twice, cut once.' },
              { head: 'JetBrains Mono 700', headStyle: 'font-mono font-bold', sub: 'Fraunces 300', subStyle: 'font-display font-light', text: '工坊守则 第 04 条：' },
            ].map((p, i) => (
              <div key={i} className="border-2 border-bone/30 p-6 hover:border-volt transition-colors">
                <div className="font-mono text-[10px] text-bone/40 mb-2">PAIR {String(i+1).padStart(2,'0')}</div>
                <div className={`text-6xl md:text-8xl leading-[0.85] ${p.headStyle}`}>{p.text}</div>
                <div className={`mt-3 text-sm ${p.subStyle}`}>{p.sub} · 永远是说明文字与脚注的最佳搭档</div>
              </div>
            ))}
          </div>

          {/* 返回 */}
          <div className="mt-12 text-center">
            <a href="#/" className="inline-block px-6 py-3 bg-bone text-ink font-bold border-2 border-bone hover:bg-volt">
              ← 返回首页 / BACK TO GRID
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
