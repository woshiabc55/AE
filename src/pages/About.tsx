export default function About() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-16">
      <div className="font-mono text-xs text-volt mb-4">// ABOUT / 关于</div>
      <h1 className="font-display text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8">
        A FORGE FOR<br/><span className="text-volt">HTML CRAFTS.</span>
      </h1>
      <div className="grid md:grid-cols-2 gap-8 text-bone/80 leading-relaxed">
        <p>
          Skill Forge 是一个不断生长的 HTML/CSS/JS 技能集合。我们相信，网页的每一像素都可以被精心雕琢——从一行 text-shadow 到一整个粒子场。
        </p>
        <p>
          每一个工具卡片都是一个独立的小宇宙：你可以直接复制它的源码到自己的项目，也可以从中学到一种技巧，再去创造属于你的版本。
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-12 font-mono">
        {[
          { l: 'TOOLS', v: '28+' },
          { l: 'CATEGORIES', v: '5' },
          { l: 'DEPENDENCIES', v: '0' },
        ].map(s => (
          <div key={s.l} className="border-2 border-bone/30 p-6">
            <div className="text-5xl font-display font-black text-volt">{s.v}</div>
            <div className="text-xs text-bone/60 mt-2">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 border-t-2 border-bone/20 pt-8 text-sm text-bone/60 font-mono space-y-2">
        <p>→ MADE WITH VITE + REACT + TAILWIND</p>
        <p>→ NO BACKEND. NO TRACKING. NO BS.</p>
        <p>→ MIT LICENSED. FORK IT. SHIP IT.</p>
      </div>
    </div>
  );
}
