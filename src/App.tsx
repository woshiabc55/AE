import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStellaris } from '@/store/useStellaris'
import { EXHIBITS } from '@/lib/exhibits'
import { audio } from '@/lib/audio'
import { Cursor } from '@/components/Cursor'
import { TopBar } from '@/components/TopBar'
import { SideDrawer } from '@/components/SideDrawer'
import { Overture } from '@/components/exhibits/Overture'
import { StarMap } from '@/components/exhibits/StarMap'
import { GlyphSea } from '@/components/exhibits/GlyphSea'
import { Crystal } from '@/components/exhibits/Crystal'
import { Pulse } from '@/components/exhibits/Pulse'
import { Specimens } from '@/components/exhibits/Specimens'
import { Echo } from '@/components/exhibits/Echo'
import { Chroma } from '@/components/exhibits/Chroma'
import { DataForest } from '@/components/exhibits/DataForest'
import { Sandbox } from '@/components/exhibits/Sandbox'
import { Manifesto } from '@/components/exhibits/Manifesto'
import { Coda } from '@/components/exhibits/Coda'

const COMPONENTS: Record<string, () => JSX.Element> = {
  overture: Overture,
  starmap: StarMap,
  glyphsea: GlyphSea,
  crystal: Crystal,
  pulse: Pulse,
  specimens: Specimens,
  echo: Echo,
  chroma: Chroma,
  dataforest: DataForest,
  sandbox: Sandbox,
  manifesto: Manifesto,
  coda: Coda,
}

function App() {
  const active = useStellaris((s) => s.active)
  const next = useStellaris((s) => s.next)
  const prev = useStellaris((s) => s.prev)
  const goTo = useStellaris((s) => s.goTo)
  const muted = useStellaris((s) => s.muted)
  const setActive = useStellaris((s) => s.setActive)

  const ActiveComponent = useMemo(() => COMPONENTS[active] ?? Overture, [active])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); next() }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev() }
      else if (e.key === 'r' || e.key === 'R') setActive('overture')
      else if (/^[0-9]$/.test(e.key)) {
        const idx = e.key === '0' ? 9 : parseInt(e.key, 10) - 1
        if (idx >= 0 && idx < EXHIBITS.length) goTo(idx)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo, setActive])

  // hash
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace('#', '')
      const ex = EXHIBITS.find((e) => e.id === h)
      if (ex) setActive(ex.id)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [setActive])

  useEffect(() => {
    window.location.hash = active
  }, [active])

  // audio engine mute
  useEffect(() => {
    audio.setMuted(muted)
  }, [muted])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink no-cursor">
      {/* AnimatePresence with mode="wait" for cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.985, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.01, filter: 'blur(6px)' }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>

      <Cursor />
      <TopBar />
      <SideDrawer />

      <div className="grain" />
      <div className="vignette" />

      {/* keyboard hint */}
      <div className="pointer-events-none fixed bottom-3 right-3 z-[100] hidden md:flex items-center gap-2 text-paper/30 font-mono text-[0.55rem] tracking-[0.25em]">
        ↑↓ NAVIGATE · 1-0 JUMP · R RESET · M MUTE · F FULLSCREEN
      </div>

      {/* floor indicator dots */}
      <div className="pointer-events-none fixed right-4 top-1/2 -translate-y-1/2 z-[99] hidden lg:flex flex-col items-end gap-2">
        {EXHIBITS.map((e) => (
          <button
            key={e.id}
            onClick={() => setActive(e.id)}
            className={`group flex items-center gap-3 transition-opacity duration-700 ${
              e.id === active ? 'opacity-100' : 'opacity-30 hover:opacity-80'
            }`}
            data-cursor="hover"
            aria-label={e.title}
          >
            <span className="font-mono text-[0.55rem] tracking-widest text-paper/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {e.index}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                e.id === active
                  ? 'h-1.5 w-6 bg-gilt'
                  : 'h-1 w-3 bg-paper/40 group-hover:bg-gilt'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
