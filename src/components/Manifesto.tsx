import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const paragraphs = [
  '我们相信,设计的价值不在于被注意到,而在于被记住。',
  '在一个所有东西都在尖叫的时代,克制本身就是一种力量。',
  '我们不接不能署名的项目。我们不为不能信任的客户工作。',
  '如果你也这样想,那我们已经聊得来了。',
]

export default function Manifesto() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.2, once: true })

  return (
    <section
      id="manifesto"
      ref={ref}
      className="relative py-32 md:py-48 border-t border-line overflow-hidden"
    >
      <div className="absolute inset-0 grid-paper opacity-40" aria-hidden />
      <div className="absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-accent/5 blur-3xl" aria-hidden />
      <div className="absolute -left-20 bottom-20 h-[320px] w-[320px] rounded-full bg-alert/5 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <div className={cn('reveal flex justify-center', inView && 'is-in')}>
          <SectionLabel index="03" label="Manifesto / 宣言" />
        </div>

        <div className="mt-12 md:mt-20 space-y-8 md:space-y-10">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={cn(
                'reveal font-display italic font-light leading-[1.25] text-fg',
                'text-3xl md:text-5xl lg:text-6xl tracking-crunch',
                inView && 'is-in',
              )}
              style={{
                transitionDelay: `${200 + i * 180}ms`,
                textIndent: i % 2 === 1 ? '2em' : '0',
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <div
          className={cn(
            'reveal mt-20 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted',
            inView && 'is-in',
          )}
          style={{ transitionDelay: `${200 + paragraphs.length * 180 + 200}ms` }}
        >
          <span className="inline-block h-px w-10 bg-fg/40" />
          <span>— Aiko Mori, Founding Partner</span>
          <span className="inline-block h-px w-10 bg-fg/40" />
        </div>
      </div>
    </section>
  )
}
