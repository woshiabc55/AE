import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { works, type Work } from '@/data/works'
import { buildImageUrl } from '@/lib/images'
import { cn } from '@/lib/utils'

const sizeClass: Record<Work['size'], string> = {
  wide: 'md:col-span-8 md:row-span-2 aspect-[16/10]',
  tall: 'md:col-span-4 md:row-span-2 aspect-[4/5]',
  square: 'md:col-span-4 aspect-square',
}

function WorkCard({ work, onOpen }: { work: Work; onOpen: (w: Work) => void }) {
  return (
    <button
      onClick={() => onOpen(work)}
      className={cn(
        'group relative block w-full text-left overflow-hidden border border-line bg-line/40',
        'transition-all duration-500 hover:border-accent',
        sizeClass[work.size],
      )}
    >
      {/* 封面图 */}
      <img
        src={buildImageUrl(work.coverPrompt, work.size === 'tall' ? 'portrait' : 'cover')}
        alt={work.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />
      {/* 底色叠加,统一观感 */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-50"
        style={{ background: work.accent }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"
        aria-hidden
      />

      {/* 编号 */}
      <div className="absolute left-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-fg/80">
        {work.index} <span className="text-accent">/</span> {work.category}
      </div>

      {/* 标签 */}
      <div className="absolute right-4 top-4 z-10 flex flex-wrap gap-1.5 justify-end max-w-[60%]">
        {work.tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.22em] border border-fg/40 text-fg/80 bg-bg/40"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 信息 */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
              {work.client} · {work.year}
            </div>
            <h3 className="mt-1 font-display text-2xl md:text-3xl font-medium leading-[1.05] text-fg">
              {work.title}
            </h3>
          </div>
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-fg/50 text-fg transition-all duration-300 group-hover:bg-accent group-hover:text-bg group-hover:border-accent group-hover:rotate-[-15deg]"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
        <div
          className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500"
        >
          <p className="mt-3 text-[12px] leading-relaxed text-fg/80 line-clamp-3">
            {work.summary}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function Work() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.1, once: true })
  const navigate = useNavigate()

  const openCase = (w: Work) => {
    navigate(`/work/${w.slug}`)
  }

  return (
    <section id="work" ref={ref} className="relative py-32 md:py-40 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div
          className={cn('reveal', inView && 'is-in')}
          style={{ transitionDelay: '0ms' }}
        >
          <SectionLabel index="01" label="Selected Works / 近期作品" />
        </div>

        <div className="mt-10 md:mt-14 flex items-end justify-between gap-6 flex-wrap">
          <h2
            className={cn(
              'reveal font-display text-h2 md:text-display font-medium leading-[1.02] tracking-crunch max-w-3xl',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '120ms' }}
          >
            九个项目,
            <br className="hidden md:block" />
            <span className="italic text-accent">九种</span>关于品牌的
            <span className="text-alert">回答</span>。
          </h2>
          <p
            className={cn(
              'reveal font-mono text-[12px] md:text-[13px] text-fg/70 max-w-md leading-relaxed',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '260ms' }}
          >
            点击任意项目进入案例详情。
            我们用作品集本身回答:&quot;你们能做什么&quot;。
          </p>
        </div>

        {/* 网格 */}
        <div
          className={cn(
            'reveal mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4',
            inView && 'is-in',
          )}
          style={{ transitionDelay: '380ms' }}
        >
          {works.map((w) => (
            <WorkCard key={w.slug} work={w} onOpen={openCase} />
          ))}
        </div>
      </div>
    </section>
  )
}
