import { useEffect, useState, useCallback } from 'react'
import { useStore } from './store/useStore'
import { chapters, type Chapter } from './data/chapters'
import { ChapterScene } from './components/chapters/ChapterScene'
import { TopBar } from './components/TopBar'
import { SideScroll } from './components/SideScroll'
import { HeroOpening } from './components/HeroOpening'
import { ChapterSection } from './components/ChapterSection'
import { JianghuDirectory } from './components/JianghuDirectory'
import { Cabinet } from './components/Cabinet'
import { Library } from './components/Library'
import { DesignModule } from './components/DesignModule'
import { SealNote } from './components/SealNote'
import { Footer } from './components/Footer'
import { CinemaBar } from './components/CinemaBar'
import { SoundPad } from './components/SoundPad'
import Lenis from 'lenis'

export default function App() {
  const [active, setActive] = useState(1)
  const [progress, setProgress] = useState(0)
  const isKeeper = useStore((s) => s.isKeeper)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    const sections = chapters.map((_, i) => document.getElementById(`chapter-${i + 1}`))
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.4
      let current = 1
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i]
        if (el && el.offsetTop <= y) current = i + 1
      }
      setActive(current)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      lenis.destroy()
    }
  }, [])

  const goTo = useCallback((id: number) => {
    const el = document.getElementById(`chapter-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="relative bg-ink-950 text-silk-100 min-h-screen">
      <TopBar onJump={goTo} />
      <SideScroll active={active} progress={progress} onJump={goTo} />

      <main>
        <section id="hero" className="relative h-screen overflow-hidden">
          <HeroOpening onStart={() => goTo(1)} />
        </section>

        {chapters.map((c, i) => (
          <ChapterSection
            key={c.id}
            index={i}
            chapter={c}
            active={active === c.id}
            onPrev={() => goTo(Math.max(1, c.id - 1))}
            onNext={() => goTo(Math.min(4, c.id + 1))}
            progress={progress}
          />
        ))}

        <section id="catalog" className="relative min-h-[100vh] bg-paper py-32 px-8 border-t border-gold-700/30">
          <JianghuDirectory onJump={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <section id="cabinet" className="relative bg-ricepaper py-32 px-8 border-t border-gold-700/30">
          <Cabinet />
        </section>
        <section id="library" className="relative bg-paper py-32 px-8 border-t border-gold-700/30">
          <Library />
        </section>
        <section id="design" className="relative bg-ink-950 py-32 px-8 border-t border-gold-700/30">
          <DesignModule />
        </section>
        <section id="seal" className="relative bg-ricepaper py-32 px-8 border-t border-gold-700/30">
          <SealNote />
        </section>
      </main>

      <Footer />
      <CinemaBar chapter={chapters.find((c) => c.id === active) as Chapter} />
      <SoundPad />

      {isKeeper && <KeeperDrawer />}
    </div>
  )
}

function KeeperDrawer() {
  const collected = useStore((s) => s.collectedItems)()
  const toggleKeeper = useStore((s) => s.toggleKeeper)
  return (
    <div className="fixed right-6 top-24 z-40 w-80 max-h-[70vh] overflow-y-auto scroll-rail p-5 shadow-scroll">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-brush text-2xl text-gold-500">私藏墨宝</h3>
        <button onClick={toggleKeeper} className="text-silk-300/60 hover:text-silk-100 text-sm">关</button>
      </div>
      <div className="divider-tassel mb-4" />
      {collected.length === 0 ? (
        <p className="text-silk-300/60 text-sm leading-7">
          阁中尚空。客官可在雅物柜上方<span className="text-cinnabar mx-1">「卷藏」</span>任意一物。
        </p>
      ) : (
        <ul className="space-y-3">
          {collected.map((it) => (
            <li key={it.id} className="card-paper p-3 flex items-center gap-3">
              <span className="seal-stamp" style={{ width: 32, height: 32, fontSize: 14 }}>{it.seal}</span>
              <div className="flex-1 min-w-0">
                <div className="font-brush text-silk-100 truncate">{it.name}</div>
                <div className="text-[11px] text-silk-300/60">{it.origin}</div>
              </div>
              <div className="text-cinnabar text-sm font-seal">{it.price}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
