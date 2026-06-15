import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { services } from '@/data/services'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export default function Services() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.15, once: true })

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-32 md:py-40 border-t border-line"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className={cn('reveal', inView && 'is-in')}>
          <SectionLabel index="02" label="Services / 服务" />
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-12 gap-6">
          <h2
            className={cn(
              'reveal col-span-12 md:col-span-8 font-display text-h2 md:text-display font-medium leading-[1.04] tracking-crunch',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '120ms' }}
          >
            四个<span className="italic text-accent">动词</span>,
            <br />
            一种<span className="text-alert">语调</span>。
          </h2>
          <p
            className={cn(
              'reveal col-span-12 md:col-span-4 self-end font-mono text-[12px] md:text-[13px] text-fg/70 leading-relaxed',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '260ms' }}
          >
            我们不做全链路营销,只做视觉。
            四年只做了四件事,做到了自己也挑不出毛病的程度。
          </p>
        </div>

        {/* 服务列表 */}
        <div className="mt-20 md:mt-28 border-t border-line">
          {services.map((s, i) => (
            <div
              key={s.index}
              className={cn(
                'reveal group relative grid grid-cols-12 gap-6 border-b border-line py-10 md:py-14',
                'transition-colors duration-500 hover:bg-fg/[0.02]',
                inView && 'is-in',
              )}
              style={{ transitionDelay: `${300 + i * 120}ms` }}
            >
              {/* 编号 */}
              <div className="col-span-2 md:col-span-1 font-display text-3xl md:text-5xl font-light text-muted group-hover:text-accent transition-colors duration-500">
                {s.index}
              </div>
              {/* 标题 */}
              <h3 className="col-span-10 md:col-span-4 font-display text-2xl md:text-4xl font-medium leading-[1.1] tracking-crunch">
                {s.title}
              </h3>
              {/* 描述 */}
              <p className="col-span-12 md:col-span-4 font-mono text-[12px] md:text-[13px] leading-relaxed text-fg/75">
                {s.description}
              </p>
              {/* 交付物 */}
              <ul className="col-span-12 md:col-span-3 space-y-1.5 self-start">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg/65 flex items-center gap-2"
                  >
                    <span className="inline-block h-1 w-1 bg-accent" /> {d}
                  </li>
                ))}
              </ul>

              {/* 右侧箭头 */}
              <ArrowUpRight
                size={22}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fg/0 group-hover:text-accent group-hover:translate-x-2 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
