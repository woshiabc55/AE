import { Tag, TagLegend, type TagCategory } from '../components/Tag';

const STATS: { l: string; v: string; tag: TagCategory }[] = [
  { l: 'TOOLS',        v: '60+',  tag: 'visual'  },
  { l: 'CATEGORIES',   v: '5',    tag: 'layout'  },
  { l: 'TAGS',         v: '9',    tag: 'interact'},
  { l: 'PACKS',        v: '8',    tag: 'motion'  },
  { l: 'UI ATOMS',     v: '38',   tag: 'visual'  },
  { l: 'DEPENDENCIES', v: '0',    tag: 'compat'  },
  { l: 'LICENSE',      v: 'MIT',  tag: 'a11y'    },
  { l: 'BUILT WITH',   v: 'V+R+T',tag: 'type'    },
  { l: 'COLORWAYS',    v: '7',    tag: 'color'   },
];

export default function About() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* HERO - 3x3 母格 (标题占 2, 9 tag 概览占 1) */}
      <section className="border-b-2 border-bone/20 pb-10 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="font-mono text-xs text-volt mb-3">// ABOUT / 关于 / V.09</div>
          <h1 className="font-display text-6xl md:text-8xl font-black leading-none tracking-tighter">
            A FORGE FOR<br/><span className="text-volt">HTML CRAFTS.</span>
          </h1>
          <p className="mt-6 text-bone/80 leading-relaxed max-w-2xl">
            Skill Forge 是一个不断生长的 HTML/CSS/JS 技能集合。
            我们相信，网页的每一像素都可以被精心雕琢——从一行 <span className="text-volt font-bold">text-shadow</span> 到一整个粒子场。
          </p>
          <p className="mt-3 text-bone/70 leading-relaxed max-w-2xl">
            每一个工具卡片都是一个独立的小宇宙：你可以直接复制它的源码到自己的项目，
            也可以从中学到一种技巧，再去创造属于你的版本。
          </p>
        </div>
        <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit">
          <div className="font-mono text-[10px] text-bone/60 mb-2 flex items-center gap-2">
            <span className="text-volt">▣</span> 9 TAGS / 模块化9
          </div>
          <TagLegend size="xs" />
        </aside>
      </section>

      {/* 9 STATS — 3x3 母格 */}
      <section className="py-10">
        <div className="font-mono text-xs text-bone/60 mb-4">▸ 9 STATS / 3x3 母格</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
          {STATS.map(s => (
            <div key={s.l} className="border-2 border-bone/30 p-5 hover:border-volt transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="font-display font-black text-5xl text-volt group-hover:rotate-3 transition-transform">{s.v}</div>
                <Tag cat={s.tag} size="xs" variant="dot" showId />
              </div>
              <div className="font-mono text-[10px] text-bone/60 tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 9 PRINCIPLES 模块化9 一行 */}
      <section className="py-10 border-t-2 border-bone/20">
        <div className="font-mono text-xs text-bone/60 mb-4">▸ 9 PRINCIPLES / 9 原则</div>
        <p className="text-bone/70 text-sm max-w-2xl mb-6">
          完整版见 [codex]→A。这里是 9 个不可妥协的工坊法则的速查。
        </p>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
          {['OBSESS','BOLD','READY','FORK','PURPOSE','VOICE','PERFORM','INCLUDE','MODULAR'].map((p, i) => (
            <div key={p} className="border-2 border-bone/30 p-2 text-center hover:border-volt transition-colors">
              <div className="font-display font-black text-2xl text-volt leading-none">{String(i + 1).padStart(2, '0')}</div>
              <div className="font-mono text-[9px] text-bone mt-1">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER 收束 */}
      <section className="py-10 border-t-2 border-bone/20 mt-6 text-sm text-bone/60 font-mono space-y-2">
        <p>→ MADE WITH VITE + REACT + TAILWIND</p>
        <p>→ NO BACKEND. NO TRACKING. NO BS.</p>
        <p>→ MIT LICENSED. FORK IT. SHIP IT.</p>
        <p className="pt-3 text-bone/40">// CODEX V.09 · 模块化9 · 9 类目标签 · 9 评分维度 · 9 评分项</p>
      </section>
    </div>
  );
}
