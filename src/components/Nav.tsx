import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui'
import { Menu, X } from 'lucide-react'

const sections = [
  { id: 'work', label: 'Work', zh: '作品' },
  { id: 'services', label: 'Services', zh: '服务' },
  { id: 'manifesto', label: 'Manifesto', zh: '宣言' },
  { id: 'studio', label: 'Studio', zh: '团队' },
  { id: 'clients', label: 'Clients', zh: '客户' },
  { id: 'contact', label: 'Contact', zh: '联系' },
] as const

export default function Nav() {
  const active = useUIStore((s) => s.activeSection)
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          condensed
            ? 'bg-bg/85 backdrop-blur-md border-b border-line'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-300',
              condensed ? 'h-14' : 'h-20',
            )}
          >
            {/* Logo */}
            <a
              href="#hero"
              className="group flex items-center gap-2"
              aria-label="AE Studio"
            >
              <span className="relative inline-block h-6 w-6 border border-fg group-hover:border-accent transition-colors">
                <span className="absolute inset-1 bg-accent" />
                <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 bg-alert" />
              </span>
              <span className="font-display text-[22px] font-semibold tracking-crunch">
                AE<span className="text-accent">.</span>
              </span>
              <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.32em] text-muted ml-3">
                Creative Studio / Est. 2019
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {sections.map((s) => {
                const isActive = active === s.id
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={cn(
                      'group relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors',
                      isActive ? 'text-accent' : 'text-fg/70 hover:text-fg',
                    )}
                  >
                    <span className="mr-2 text-muted group-hover:text-accent transition-colors">
                      {s.label}
                    </span>
                    <span>{s.zh}</span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-4 right-4 h-px bg-accent" />
                    )}
                  </a>
                )
              })}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#contact"
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg/70 hover:text-accent transition-colors link-draw"
              >
                让我们聊聊 →
              </a>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center border border-fg/30"
              aria-label="menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full screen menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden bg-bg transition-opacity duration-300',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setOpen(false)}
      >
        <div
          className="flex flex-col gap-6 pt-32 px-8"
          onClick={(e) => e.stopPropagation()}
        >
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 font-display text-5xl font-medium hover:text-accent transition-colors"
            >
              <span className="font-mono text-xs text-muted">
                0{i + 1}
              </span>
              {s.zh}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex h-14 items-center justify-center bg-accent text-bg font-mono uppercase tracking-[0.18em] text-xs"
          >
            开始合作
          </a>
        </div>
      </div>
    </>
  )
}
