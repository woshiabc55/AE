import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { works } from '@/data/works'
import { buildImageUrl } from '@/lib/images'
import Tag from './ui/Tag'

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const work = works.find((w) => w.slug === slug) ?? null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [navigate])

  if (!work) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-6 text-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted">
            404 / Not Found
          </div>
          <h2 className="mt-4 font-display text-4xl">没有这个项目</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] text-accent"
          >
            <ArrowLeft size={14} /> 返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-bg overflow-y-auto noise" role="dialog">
      <div className="absolute inset-0 bg-mesh-accent opacity-50 pointer-events-none" aria-hidden />

      {/* 顶部条 */}
      <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-fg/70 hover:text-accent"
          >
            <ArrowLeft size={14} /> Back / 返回
          </button>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted hidden md:block">
            Case Study · {work.index} / {works.length}
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-fg/70 hover:text-accent"
            aria-label="close"
          >
            Close <X size={14} />
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-12 md:py-20">
        {/* 标题区 */}
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              <span className="text-accent">{work.index}</span>
              <span>/</span>
              <span>{work.category}</span>
              <span>/</span>
              <span>{work.year}</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.95] tracking-tightest">
              {work.title}
            </h1>
            <p className="mt-6 max-w-2xl font-mono text-[14px] md:text-[15px] leading-relaxed text-fg/80">
              {work.summary}
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:border-l md:border-line md:pl-10 space-y-6 self-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Client</div>
              <div className="mt-1 font-display text-2xl">{work.client}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Year</div>
              <div className="mt-1 font-display text-2xl">{work.year}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Scope</div>
              <ul className="mt-2 space-y-1">
                {work.scope.map((s) => (
                  <li
                    key={s}
                    className="font-mono text-[12px] text-fg/80 flex items-center gap-2"
                  >
                    <span className="text-accent">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {work.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 大图 */}
        <div className="mt-16 md:mt-24 aspect-[16/9] overflow-hidden border border-line">
          <img
            src={buildImageUrl(work.coverPrompt, 'cover')}
            alt={work.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 副图组 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['concept still', 'detail close-up', 'in context'].map((sub) => (
            <div
              key={sub}
              className="aspect-[4/3] overflow-hidden border border-line bg-line/30"
            >
              <img
                src={buildImageUrl(
                  `${work.coverPrompt}, ${sub} shot, editorial composition`,
                  'portrait',
                )}
                alt={`${work.title} - ${sub}`}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* 案例引文 */}
        <div className="mt-16 md:mt-24 max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
            Approach / 方法
          </div>
          <p className="mt-4 font-display italic text-2xl md:text-4xl leading-snug text-fg">
            &ldquo;把客户最想藏起来的那一面,做成它最想被看见的样子。&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
