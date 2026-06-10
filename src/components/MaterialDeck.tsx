import { NoiseLayer } from '@/components/NoiseLayer'
import { character } from '@/data/character'

/**
 * 材质细节卡 — 2×2 网格,显示 4 种材质的局部纹理与参数。
 * 缩略图区域使用程序化噪点 + 细线条表示纹理差异。
 */
export function MaterialDeck() {
  return (
    <section
      aria-label="材质细节"
      className="relative w-full cv-auto"
    >
      <div className="mx-auto max-w-[1440px] px-8 pt-20 pb-10">
        <div className="flex items-end justify-between gap-8">
          <div>
            <span className="tag">03 · MATERIAL DECK</span>
            <h2 className="display text-bone-50 mt-3 text-[36px] leading-[1.05]">
              表面 · 粗糙度 · 颗粒
              <span className="text-coolgray font-light italic"> — sub-surface, anisotropy, weave</span>
            </h2>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 max-w-[320px] text-right">
            <span className="tag">PBR · DISPLACEMENT</span>
            <p className="font-mono text-[11px] text-coolgray leading-relaxed">
              procedural noise · 5400K · sRGB linear
            </p>
          </div>
        </div>
        <div className="rule mt-8" />
      </div>

      <div className="mx-auto max-w-[1440px] px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-bone/10">
          {character.materials.map((m, i) => (
            <article
              key={m.id}
              className="relative bg-ink-800 overflow-hidden"
              style={{ aspectRatio: '3 / 4' }}
            >
              {/* texture plate */}
              <div
                className="absolute inset-0 grain"
                style={{
                  background:
                    i === 0
                      ? 'radial-gradient(60% 60% at 50% 50%, rgba(234,210,180,0.18), rgba(20,20,22,1) 70%)'
                      : i === 1
                        ? 'linear-gradient(180deg, #1A1410 0%, #050505 100%)'
                        : i === 2
                          ? 'linear-gradient(180deg, #20242A 0%, #0A0C10 100%)'
                          : 'linear-gradient(180deg, #2A2E33 0%, #0A0C10 100%)',
                }}
              >
                <TextureSwatch variant={(['a','b','c','d'] as const)[i % 4]} />
                <NoiseLayer variant={(['b','c','a','d'] as const)[i % 4]} opacity={0.22} blendMode="overlay" />
              </div>

              {/* corner ticks */}
              <span className="tick tl" /><span className="tick tr" />
              <span className="tick bl" /><span className="tick br" />

              {/* caption */}
              <div className="absolute left-5 top-5 right-5 flex items-start justify-between">
                <div>
                  <span className="tag">{m.index} / 04</span>
                  <h3 className="display text-bone-50 mt-2 text-[24px] leading-[1]">
                    {m.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-wideish uppercase text-coolgray mt-1">
                    {m.subtitle}
                  </p>
                </div>
              </div>

              {/* params */}
              <div className="absolute left-5 right-5 bottom-5 space-y-2">
                {m.params.map((p) => (
                  <div key={p.name} className="grid grid-cols-2 gap-2 items-baseline border-t border-bone/15 pt-1.5">
                    <span className="tag">{p.name}</span>
                    <span className="font-mono text-[11px] text-bone-100 text-right tracking-wideish uppercase">
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TextureSwatch({ variant }: { variant: 'a' | 'b' | 'c' | 'd' }) {
  if (variant === 'a') {
    // skin-like freckle swatch
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="swA" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="rgba(234,210,180,0.55)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(#swA)" />
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 17) % 200
          const y = ((i * 53) % 200)
          return <circle key={i} cx={x} cy={y} r={(i % 4) * 0.4 + 0.6} fill="rgba(80,50,30,0.6)" />
        })}
      </svg>
    )
  }
  if (variant === 'b') {
    // hair strand swatch
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: 80 }).map((_, i) => (
          <path
            key={i}
            d={`M ${i * 2.5} 0 Q ${i * 2.5 + 4} 100, ${i * 2.5 - 2} 200`}
            stroke={`rgba(${20 + (i % 3) * 6},${16 + (i % 4) * 4},${10 + (i % 5) * 2},${0.35 + (i % 3) * 0.15})`}
            strokeWidth={0.5 + (i % 4) * 0.2}
            fill="none"
          />
        ))}
      </svg>
    )
  }
  if (variant === 'c') {
    // cloth weave swatch
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="rgba(40,44,52,0.5)" />
            <path d="M 0 4 L 8 4" stroke="rgba(200,200,210,0.18)" strokeWidth="0.6" />
            <path d="M 4 0 L 4 8" stroke="rgba(200,200,210,0.10)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#weave)" />
      </svg>
    )
  }
  // d - brushed metal
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="brushed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(60,64,70,0.6)" />
          <stop offset="50%" stopColor="rgba(180,184,190,0.6)" />
          <stop offset="100%" stopColor="rgba(60,64,70,0.6)" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#brushed)" />
      {Array.from({ length: 120 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 1.7} x2="200" y2={i * 1.7 + (i % 5) * 0.3} stroke="rgba(220,220,225,0.10)" strokeWidth="0.4" />
      ))}
    </svg>
  )
}
