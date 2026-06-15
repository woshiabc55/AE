import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { studio } from '@/data/studio'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export default function Studio() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.1, once: true })

  return (
    <section
      id="studio"
      ref={ref}
      className="relative py-32 md:py-40 border-t border-line"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className={cn('reveal', inView && 'is-in')}>
          <SectionLabel index="04" label="Studio / 团队" />
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-12 gap-6">
          <h2
            className={cn(
              'reveal col-span-12 md:col-span-9 font-display text-h2 md:text-display font-medium leading-[1.04] tracking-crunch',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '120ms' }}
          >
            四个人,
            <br />
            一把<span className="italic text-accent">尺子</span>。
          </h2>
        </div>

        <div
          className={cn(
            'reveal mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '280ms' }}
        >
          {studio.map((m, i) => (
            <article
              key={m.name}
              className="group relative bg-bg p-6 md:p-8 transition-colors duration-500 hover:bg-fg/[0.02]"
            >
              {/* 编号 */}
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
                  0{i + 1} / 0{studio.length}
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-fg/30 group-hover:text-accent group-hover:rotate-[-15deg] transition-all duration-300"
                />
              </div>

              {/* 头像占位:几何字符 */}
              <div
                className="mt-10 mb-12 aspect-square w-full flex items-center justify-center border border-line"
                style={{ background: `${m.accent}10` }}
              >
                <span
                  className="font-display italic text-[7rem] font-light leading-none transition-colors duration-500"
                  style={{ color: m.accent }}
                >
                  {m.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl md:text-[28px] font-medium leading-tight tracking-crunch">
                  {m.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {m.role}
                </p>
                <p
                  className="mt-6 font-display italic text-xl transition-colors duration-300"
                  style={{ color: m.accent }}
                >
                  &ldquo;{m.signature}&rdquo;
                </p>
                <p className="mt-4 font-mono text-[12px] leading-relaxed text-fg/70">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
