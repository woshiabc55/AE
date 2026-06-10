import { FaceSilhouette } from '@/components/FaceSilhouette'
import { NoiseLayer } from '@/components/NoiseLayer'
import { character } from '@/data/character'

/**
 * 三联视图 — 正面 / 侧面 / 背面。
 * 4-4-4 网格,非镜像,上下身用 1px 分割线。
 */
export function TriptychStage() {
  return (
    <section
      aria-label="三视图分屏"
      className="relative w-full cv-auto"
    >
      {/* section header */}
      <div className="mx-auto max-w-[1440px] px-8 pt-20 pb-10">
        <div className="flex items-end justify-between gap-8">
          <div>
            <span className="tag">02 · TRIPTYCH</span>
            <h2 className="display text-bone-50 mt-3 text-[36px] leading-[1.05]">
              正面 · 侧面 · 背面
              <span className="text-coolgray font-light italic"> — non-mirrored, posture-consistent</span>
            </h2>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 max-w-[320px] text-right">
            <span className="tag">RIG TAGS</span>
            <p className="font-mono text-[11px] text-coolgray leading-relaxed">
              upper/lower body · decoupled<br />
              yaw locked · focal plane at brow
            </p>
          </div>
        </div>
        <div className="rule mt-8" />
      </div>

      <div className="mx-auto max-w-[1440px] px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/10">
          {character.views.map((v, i) => (
            <article
              key={v.id}
              className="relative bg-ink-800 grain overflow-hidden"
              style={{ aspectRatio: '3 / 4.2' }}
            >
              {/* gradient per cell */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    i === 0
                      ? 'radial-gradient(60% 50% at 50% 35%, rgba(255,225,180,0.10), transparent 60%), linear-gradient(180deg, #15151A 0%, #0A0A0C 100%)'
                      : i === 1
                        ? 'radial-gradient(60% 50% at 35% 35%, rgba(140,160,200,0.12), transparent 60%), linear-gradient(180deg, #11131A 0%, #0A0A0C 100%)'
                        : 'radial-gradient(60% 50% at 50% 50%, rgba(176,58,46,0.08), transparent 60%), linear-gradient(180deg, #0F0E10 0%, #070708 100%)',
                }}
              />

              {/* figure */}
              <div className="absolute inset-0 flex items-end justify-center">
                <div
                  className={[
                    'relative',
                    v.split === 'left-color' ? 'w-[78%] h-[78%]' : 'w-[78%] h-[78%]',
                  ].join(' ')}
                  style={{ marginBottom: '6%' }}
                >
                  <div className="hard-edge h-full w-full">
                    <FaceSilhouette view={v.id} pose={v.pose} yawDeg={v.yawDeg} seed={i * 7 + 3} />
                  </div>
                  <NoiseLayer variant={(['a','b','c','d'] as const)[i % 4]} opacity={0.12} blendMode="overlay" />
                </div>
              </div>

              {/* upper/lower body separator */}
              <div
                aria-hidden
                className="absolute left-6 right-6"
                style={{ top: '52%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(234,230,221,0.35), transparent)' }}
              />
              <div className="absolute left-3 right-3 flex justify-between text-[9px] tracking-wideish uppercase text-coolgray" style={{ top: 'calc(52% + 4px)' }}>
                <span>UPPER · 上身</span>
                <span>LOWER · 下身</span>
              </div>

              {/* corner ticks */}
              <span className="tick tl" /><span className="tick tr" />
              <span className="tick bl" /><span className="tick br" />

              {/* caption */}
              <div className="absolute left-5 top-5 right-5 flex items-start justify-between">
                <div>
                  <span className="tag">0{i + 1} / 03</span>
                  <h3 className="font-mono text-[12px] tracking-wideish uppercase text-bone-100 mt-2">
                    {v.label}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="tag">POSE</span>
                  <p className="font-mono text-[11px] text-coolgray mt-1 uppercase">{v.pose}</p>
                </div>
              </div>

              {/* params footer */}
              <div className="absolute left-5 right-5 bottom-5 grid grid-cols-3 gap-3">
                <Param label="YAW" value={`${v.yawDeg}°`} />
                <Param label="SPLIT" value={v.split.replace('-', ' ')} />
                <Param label="VIEW" value={v.id.toUpperCase()} />
              </div>

              {/* vignette */}
              <div className="vignette" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-bone/15 pt-2">
      <div className="tag">{label}</div>
      <div className="font-mono text-[12px] text-bone-100 mt-1 uppercase tracking-wideish">{value}</div>
    </div>
  )
}
