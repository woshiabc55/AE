import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'
import { works } from '@/data/works'
import { buildImageUrl } from '@/lib/images'
import { cn } from '@/lib/utils'

// 在所有作品中选出一件"特制"代表作,这里取最新一件 Visual 类别作品
const featured =
  works.find((w) => w.category === 'Visual' && w.slug === 'pivot-index') ?? works[0]

export default function Featured() {
  const { ref, inView } = useReveal<HTMLElement>({ threshold: 0.15, once: true })
  const navigate = useNavigate()

  return (
    <section
      ref={ref}
      aria-label="特制视觉作品"
      className="relative border-t border-line overflow-hidden noise"
    >
      {/* 左侧大图 */}
      <div className="grid grid-cols-12">
        <div className="relative col-span-12 md:col-span-7 aspect-[16/10] md:aspect-auto md:min-h-[640px] overflow-hidden bg-line/30">
          <img
            src={buildImageUrl(featured.coverPrompt, 'cover')}
            alt={featured.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 主色叠加,与其他作品保持视觉一致 */}
          <div
            className="absolute inset-0 mix-blend-multiply opacity-40"
            style={{ background: featured.accent }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg"
            aria-hidden
          />
          {/* 左下角数字角标 */}
          <div className="absolute left-6 bottom-6 font-display text-[clamp(3rem,8vw,7rem)] font-light leading-none text-fg/80 mix-blend-difference">
            № 01
          </div>
        </div>

        {/* 右侧排版信息 */}
        <div className="col-span-12 md:col-span-5 relative px-6 md:px-12 py-12 md:py-20 flex flex-col">
          <div className={cn('reveal', inView && 'is-in')}>
            <SectionLabel index="★" label="Featured / 特制" />
          </div>

          <div className="mt-10 md:mt-16 flex-1">
            <div
              className={cn(
                'reveal font-mono text-[11px] uppercase tracking-[0.28em] text-accent',
                inView && 'is-in',
              )}
              style={{ transitionDelay: '120ms' }}
            >
              ★ Signature Piece · {featured.year}
            </div>

            <h2
              className={cn(
                'reveal mt-4 font-display font-medium leading-[0.9] tracking-tightest',
                'text-[clamp(3rem,7vw,6.5rem)]',
                inView && 'is-in',
              )}
              style={{ transitionDelay: '240ms' }}
            >
              {featured.title.split(' ').map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className={i === 1 ? 'italic text-accent block' : 'block'}
                >
                  {word}
                </span>
              ))}
            </h2>

            <p
              className={cn(
                'reveal mt-8 max-w-md font-mono text-[13px] md:text-[14px] leading-relaxed text-fg/80',
                inView && 'is-in',
              )}
              style={{ transitionDelay: '380ms' }}
            >
              {featured.summary}
            </p>

            {/* 元数据表 */}
            <dl
              className={cn(
                'reveal mt-10 grid grid-cols-2 gap-y-4 gap-x-6 font-mono text-[12px]',
                inView && 'is-in',
              )}
              style={{ transitionDelay: '500ms' }}
            >
              <div>
                <dt className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  Client
                </dt>
                <dd className="mt-1 text-fg">{featured.client}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  Category
                </dt>
                <dd className="mt-1 text-fg">{featured.category}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  Year
                </dt>
                <dd className="mt-1 text-fg">{featured.year}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  Scope
                </dt>
                <dd className="mt-1 text-fg">{featured.scope.length} 项交付</dd>
              </div>
            </dl>
          </div>

          {/* CTA */}
          <div
            className={cn(
              'reveal mt-12 flex items-center justify-between gap-4 border-t border-line pt-6',
              inView && 'is-in',
            )}
            style={{ transitionDelay: '620ms' }}
          >
            <button
              onClick={() => navigate(`/work/${featured.slug}`)}
              className="group inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-fg hover:text-accent transition-colors"
            >
              <span>查看完整案例</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:rotate-[-15deg] group-hover:text-accent"
              />
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted hidden md:block">
              AE · Signature Series
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
