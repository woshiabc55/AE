import { DerivativeMark } from '@/components/DerivativeMark'
import { HeroCanvas } from '@/components/HeroCanvas'
import { MaterialDeck } from '@/components/MaterialDeck'
import { TriptychStage } from '@/components/TriptychStage'
import { character } from '@/data/character'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <TopBar />
      <HeroCanvas />
      <TriptychStage />
      <MaterialDeck />
      <Footer />
      <DerivativeMark />
    </main>
  )
}

function TopBar() {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-4 mix-blend-difference">
      <div className="flex items-center gap-3">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
          <rect x="1" y="1" width="20" height="20" fill="none" stroke="rgba(234,230,221,0.9)" strokeWidth="1" />
          <path d="M 5 5 L 17 17 M 17 5 L 5 17" stroke="rgba(234,230,221,0.9)" strokeWidth="0.8" />
        </svg>
        <span className="font-mono text-[10px] tracking-widish uppercase text-bone-50/90">
          AE · Character Plate
        </span>
      </div>
      <nav className="pointer-events-auto flex items-center gap-6">
        {[
          { l: '01 · Hero', h: '#hero' },
          { l: '02 · Triptych', h: '#triptych' },
          { l: '03 · Material', h: '#material' },
          { l: '04 · Plate', h: '#plate' },
        ].map((it) => (
          <a
            key={it.l}
            href={it.h}
            className="font-mono text-[10px] tracking-widish uppercase text-bone-50/80 hover:text-bone-50 transition-colors"
          >
            {it.l}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-widish uppercase text-bone-50/80">
          {character.nationality}
        </span>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer id="plate" className="relative w-full border-t border-bone/10 bg-ink-900">
      <div className="mx-auto max-w-[1440px] px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <span className="tag">04 · PLATE</span>
          <h2 className="display text-bone-50 mt-3 text-[44px] leading-[0.95]">
            {character.codename}
          </h2>
          <p className="font-serif text-bone-100 text-[18px] italic mt-4 max-w-md">
            一面本色,<span className="text-coolgray"> 一面反色。</span>
            <br />
            硬线描边、颗粒噪点、自然侧逆光 ——
            一张可以被截屏、被转印的设计板。
          </p>
        </div>
        <div className="md:col-span-4 space-y-3">
          <span className="tag">DESIGNER</span>
          <p className="font-mono text-[12px] text-bone-100 tracking-wideish uppercase">
            {character.designer}
          </p>
          <div className="rule my-4" />
          <span className="tag">RIG TAGS</span>
          <ul className="font-mono text-[11px] text-coolgray space-y-1 mt-1">
            {character.rigTags.map((t) => (
              <li key={t} className="uppercase tracking-wideish">{t}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3 space-y-3">
          <span className="tag">LEGAL</span>
          <p className="font-mono text-[11px] text-coolgray leading-relaxed">
            DERIVATIVE WORK · 二创展示<br />
            角色、纹理、视角均为程序化生成,<br />
            不引用任何第三方版权素材。
          </p>
          <div className="rule my-4" />
          <span className="tag">BUILD</span>
          <p className="font-mono text-[11px] text-coolgray leading-relaxed">
            {character.buildVersion}<br />
            {character.buildDate}
          </p>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="mx-auto max-w-[1440px] px-8 py-4 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widish uppercase text-coolgray">
            © 2026 · AE STUDIO
          </span>
          <span className="font-mono text-[9px] tracking-widish uppercase text-coolgray">
            end of plate · 制作完成
          </span>
        </div>
      </div>
    </footer>
  )
}
