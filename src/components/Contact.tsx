import { ArrowUpRight, Copy } from 'lucide-react'
import { useState } from 'react'
import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const EMAIL = 'hello@ae-studio.work'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'Are.na', href: 'https://are.na' },
  { label: 'WeChat', href: '#' },
]

export default function Contact() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.1, once: true })
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 md:py-48 border-t border-line overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-accent opacity-60" aria-hidden />
      <div className="absolute inset-0 grid-paper opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className={cn('reveal', inView && 'is-in')}>
          <SectionLabel index="06" label="Contact / 联系" />
        </div>

        <h2
          className={cn(
            'reveal mt-12 md:mt-16 font-display font-medium leading-[0.95] tracking-tightest text-fg',
            'text-[clamp(3.5rem,12vw,12rem)]',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '150ms' }}
        >
          开始<span className="italic text-accent">聊</span>
        </h2>

        {/* 邮箱大号展示 */}
        <div
          className={cn(
            'reveal mt-8 md:mt-12 flex flex-wrap items-center gap-4 md:gap-6',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '280ms' }}
        >
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-2xl md:text-5xl lg:text-6xl tracking-crunch link-draw hover:text-accent transition-colors break-all"
          >
            {EMAIL}
          </a>
          <button
            onClick={copy}
            className={cn(
              'inline-flex h-12 items-center gap-2 border px-4 font-mono text-[11px] uppercase tracking-[0.22em] transition-all',
              copied
                ? 'border-accent text-accent'
                : 'border-fg/40 text-fg/70 hover:border-accent hover:text-accent',
            )}
            aria-label="copy email"
          >
            {copied ? (
              <>
                <span>已复制</span>
                <span className="text-accent">✓</span>
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>

        {/* 副信息 */}
        <div
          className={cn(
            'reveal mt-20 md:mt-32 grid grid-cols-12 gap-6 md:gap-10',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="col-span-12 md:col-span-5 space-y-1 font-mono text-[12px] text-fg/70 leading-relaxed">
            <div className="text-muted text-[10px] uppercase tracking-[0.32em] mb-2">
              Studio
            </div>
            <div>上海市 黄浦区 南苏州路 1295 号</div>
            <div>东京都 港区 南青山 3-6-18</div>
            <div className="pt-2 text-muted">Mon — Fri · 10:00 – 19:00 JST</div>
          </div>
          <div className="col-span-12 md:col-span-4 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted mb-2">
              Social
            </div>
            <ul className="space-y-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[13px] text-fg/80 hover:text-accent transition-colors link-draw"
                  >
                    {s.label}
                    <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted mb-2">
              Currently
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-fg/80">
              <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
              Booking Q3 2026
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-fg/55">
              每月只接 2 个新项目。
              简单的需求会直接告诉你不适合我们。
            </p>
          </div>
        </div>

        {/* 巨号结尾 */}
        <div
          className={cn(
            'reveal mt-24 md:mt-40 text-center',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '520ms' }}
        >
          <div className="font-display italic text-[clamp(4rem,18vw,18rem)] font-light leading-none tracking-tightest text-fg/10 select-none">
            AE.
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            © 2026 AE Studio · All works are property of their respective owners
          </div>
        </div>
      </div>
    </section>
  )
}
