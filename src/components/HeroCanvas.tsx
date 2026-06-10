import { useEffect, useRef, useState } from 'react'
import { FaceSilhouette } from '@/components/FaceSilhouette'
import { NoiseLayer } from '@/components/NoiseLayer'
import { character } from '@/data/character'

/**
 * 主视觉区 — 占据首屏 70% 高度,
 * 中央为半面色反差的大头像,
 * 背景为渐变 + 噪点 + 三道高斯光斑。
 * 鼠标移动时,光斑产生 ±8px 视差。
 */
export function HeroCanvas() {
  const ref = useRef<HTMLElement | null>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = (e.clientX - cx) / r.width
      const dy = (e.clientY - cy) / r.height
      setParallax({ x: dx * 8, y: dy * 8 })
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  const front = character.views[0]

  return (
    <section
      ref={ref}
      aria-label="主视觉:角色大头像"
      className="relative isolate h-[78vh] min-h-[640px] w-full overflow-hidden grain hairline-bone"
    >
      {/* gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 30%, rgba(234,230,221,0.10), transparent 60%),' +
            'radial-gradient(50% 50% at 75% 65%, rgba(176,58,46,0.10), transparent 60%),' +
            'linear-gradient(180deg, #15151A 0%, #0E0E10 50%, #08080A 100%)',
        }}
      />

      {/* gaussian light blobs (parallax) */}
      <div
        aria-hidden
        className="light-blob"
        style={{
          width: 540, height: 540,
          left: `${12 + parallax.x * 0.4}%`, top: `${18 + parallax.y * 0.4}%`,
          background: 'radial-gradient(closest-side, rgba(255,225,180,0.32), rgba(255,225,180,0))',
        }}
      />
      <div
        aria-hidden
        className="light-blob"
        style={{
          width: 620, height: 620,
          left: `${62 - parallax.x * 0.3}%`, top: `${40 - parallax.y * 0.3}%`,
          background: 'radial-gradient(closest-side, rgba(140,160,200,0.22), rgba(140,160,200,0))',
        }}
      />
      <div
        aria-hidden
        className="light-blob"
        style={{
          width: 380, height: 380,
          left: `${45 + parallax.x * 0.6}%`, top: `${65 + parallax.y * 0.6}%`,
          background: 'radial-gradient(closest-side, rgba(176,58,46,0.18), rgba(176,58,46,0))',
        }}
      />

      {/* hairline crosshair guides */}
      <div className="crosshair absolute inset-6" aria-hidden />

      {/* corner ticks */}
      <span className="tick tl" /><span className="tick tr" />
      <span className="tick bl" /><span className="tick br" />

      {/* gaussian scatter lines (高斯散爆) */}
      <span className="gauss-line" style={{ left: '6%', right: '6%', top: '18%' }} aria-hidden />
      <span className="gauss-line" style={{ left: '6%', right: '6%', top: '82%' }} aria-hidden />

      {/* main figure container: stacked for split color */}
      <div
        className="absolute left-1/2 top-1/2 h-[88%] w-[58%] max-w-[560px] -translate-x-1/2 -translate-y-[52%] animate-fade-up"
        style={{ animationDelay: '120ms' }}
      >
        {/* color half (left) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
          }}
        >
          <div className="hard-edge h-full w-full">
            <FaceSilhouette view={front.id} pose={front.pose} yawDeg={front.yawDeg} seed={11} />
          </div>
        </div>

        {/* mono half (right) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
            filter: 'grayscale(1) contrast(1.15) brightness(0.92)',
          }}
        >
          <div className="hard-edge h-full w-full">
            <FaceSilhouette view={front.id} pose={front.pose} yawDeg={front.yawDeg} seed={11} />
          </div>
        </div>

        {/* split line */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(234,230,221,0.45) 30%, rgba(234,230,221,0.45) 70%, transparent)' }}
        />

        {/* noise on top of figure for grain */}
        <NoiseLayer variant="a" opacity={0.16} blendMode="overlay" />
      </div>

      {/* vignette */}
      <div className="vignette" />

      {/* header overlay (typographic frame) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* top-left meta */}
        <div className="absolute left-8 top-8 flex flex-col gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <span className="tag">{character.serial} · {character.classification}</span>
          <h1 className="display text-bone-50 text-[44px] leading-[0.95] tracking-tightest">
            {character.codename.split('//')[0]}
            <span className="text-coolgray"> // </span>
            <span className="italic font-light">{character.codename.split('//')[1]?.trim()}</span>
          </h1>
        </div>

        {/* top-right build tag */}
        <div className="absolute right-8 top-8 flex flex-col items-end gap-1 animate-fade-in" style={{ animationDelay: '320ms' }}>
          <span className="tag">{character.buildVersion}</span>
          <span className="tag">{character.buildDate}</span>
        </div>

        {/* bottom-left big type */}
        <div className="absolute left-8 bottom-8 max-w-[420px] animate-fade-up" style={{ animationDelay: '600ms' }}>
          <p className="font-serif text-bone-100 text-[22px] leading-[1.18] italic">
            一面本色,<br />
            一面反色。<br />
            <span className="text-coolgray not-italic font-mono text-[11px] tracking-wideish uppercase">
              half · color · reverse · restore
            </span>
          </p>
        </div>

        {/* bottom-right tag list */}
        <div className="absolute right-8 bottom-8 flex flex-col items-end gap-1 animate-fade-in" style={{ animationDelay: '720ms' }}>
          {character.rigTags.slice(0, 4).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
