import { ArrowDownRight } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { useReveal } from '@/hooks/useReveal'

const titleTop = 'AE'
const titleBottom = 'Studio'

function CharReveal({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <span className="char-reveal inline-block whitespace-pre">
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          style={{ animationDelay: `${baseDelay + i * 28}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const { ref, inView } = useReveal<HTMLDivElement>({ threshold: 0.05, once: true })

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden noise"
    >
      {/* 背景渐变 mesh */}
      <div className="absolute inset-0 bg-mesh-accent animate-mesh-drift" aria-hidden />
      <div className="absolute inset-0 grid-paper opacity-60" aria-hidden />

      {/* 装饰圆环 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-40 h-[640px] w-[640px] rounded-full border border-fg/10 animate-spin-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-60 h-[440px] w-[440px] rounded-full border border-fg/5"
      />

      {/* 顶部元信息 */}
      <div className="relative z-10 pt-32 md:pt-36">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex items-start justify-between">
            <SectionLabel index="00" label="Index / 索引" />
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-alert animate-pulse" />
              Currently booking · Q3 2026
            </div>
          </div>
        </div>
      </div>

      {/* 主体 */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24">
        <h1 className="font-display font-medium leading-[0.85] tracking-tightest text-fg">
          <span className="block text-hero md:text-[clamp(7rem,15vw,15rem)] italic">
            {inView ? <CharReveal text={titleTop} baseDelay={120} /> : titleTop}
          </span>
          <span className="mt-2 block text-hero md:text-[clamp(7rem,15vw,15rem)] text-gradient-accent">
            {inView ? <CharReveal text={titleBottom} baseDelay={420} /> : titleBottom}
            <span className="ml-2 inline-block h-[0.85em] w-[0.18em] -mb-[0.05em] bg-accent align-baseline animate-cursor-blink" />
          </span>
        </h1>

        {/* 副标 / 元数据栏 */}
        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5 md:col-start-2">
            <p
              className={`font-mono text-[13px] md:text-[15px] leading-relaxed text-fg/85 ${
                inView ? 'animate-rise' : 'opacity-0'
              }`}
              style={{ animationDelay: '900ms' }}
            >
              AE 是一家位于上海与东京的双城创意工作室。
              <br />
              我们为有性格的品牌设计
              <span className="text-accent"> 动态视觉 </span>
              与
              <span className="text-alert"> 编辑式排版 </span>。
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-8 self-end">
            <div
              className={`font-mono text-[11px] uppercase tracking-[0.22em] text-muted space-y-2 ${
                inView ? 'animate-rise' : 'opacity-0'
              }`}
              style={{ animationDelay: '1050ms' }}
            >
              <div className="flex justify-between border-b border-line pb-1.5">
                <span>Founded</span>
                <span className="text-fg">2019</span>
              </div>
              <div className="flex justify-between border-b border-line pb-1.5">
                <span>Location</span>
                <span className="text-fg">SHA · TYO</span>
              </div>
              <div className="flex justify-between border-b border-line pb-1.5">
                <span>Projects</span>
                <span className="text-fg">142 +</span>
              </div>
            </div>
          </div>
          <div
            className={`col-span-6 md:col-span-2 self-end flex md:justify-end ${
              inView ? 'animate-rise' : 'opacity-0'
            }`}
            style={{ animationDelay: '1200ms' }}
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-fg hover:text-accent"
            >
              <span>作品</span>
              <ArrowDownRight
                size={18}
                className="transition-transform group-hover:rotate-[-45deg] group-hover:text-accent"
              />
            </a>
          </div>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-end justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted flex items-center gap-3">
            <span className="block h-8 w-px bg-fg/30" />
            Scroll
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted hidden md:flex items-center gap-3">
            <span>© 2026 AE Studio</span>
            <span className="block h-8 w-px bg-fg/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
