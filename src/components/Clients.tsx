import Marquee from './Marquee'
import { useReveal } from '@/hooks/useReveal'
import { clients } from '@/data/clients'
import { cn } from '@/lib/utils'

function ClientLogo({ name }: { name: string }) {
  return (
    <div className="flex items-baseline gap-2 shrink-0 group">
      <span className="font-display text-3xl md:text-5xl font-light tracking-crunch text-fg/30 transition-colors duration-300 group-hover:text-accent">
        {name}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted">
        ®
      </span>
    </div>
  )
}

export default function Clients() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.2, once: true })

  // 把客户平分成两行
  const half = Math.ceil(clients.length / 2)
  const row1 = clients.slice(0, half)
  const row2 = clients.slice(half)

  return (
    <section
      id="clients"
      ref={ref}
      className="relative py-32 md:py-40 border-t border-line overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div
          className={cn(
            'reveal flex items-end justify-between gap-6 flex-wrap',
            inView && 'is-in',
          )}
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
              § 05 · Clients
            </div>
            <h2 className="mt-6 font-display text-h2 md:text-display font-medium leading-[1.04] tracking-crunch">
              信任<span className="italic text-accent">过</span>我们的
            </h2>
          </div>
          <p
            className={cn(
              'font-mono text-[12px] text-fg/65 max-w-md leading-relaxed',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '180ms' }}
          >
            从独立咖啡馆到国际香水品牌,
            从本土音乐节到物流上市公司。
          </p>
        </div>
      </div>

      <div
        className={cn(
          'reveal mt-16 md:mt-20 space-y-8',
          inView && 'is-in',
        )}
        style={{ transitionDelay: '280ms' }}
      >
        <Marquee speed="normal">
          {row1.map((c) => (
            <ClientLogo key={c.name} name={c.name} />
          ))}
        </Marquee>
        <Marquee speed="slow" reverse>
          {row2.map((c) => (
            <ClientLogo key={c.name} name={c.name} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
