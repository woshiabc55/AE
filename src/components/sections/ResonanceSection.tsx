import { useRef, useCallback } from 'react'
import { resonancePairs } from '@/data/storyData'
import { useScrollProgress, useInView } from '@/hooks/useScrollProgress'
import KilnFireCanvas from '@/components/canvas/KilnFireCanvas'

export default function ResonanceSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progress } = useScrollProgress(sectionRef)
  const { ref: viewRef, isInView } = useInView(0.05)

  const titleProgress = Math.max(0, Math.min(1, progress * 3))

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      ;(viewRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    },
    [viewRef]
  )

  return (
    <section
      ref={setRefs}
      className="section-container bg-iron-950"
    >
      <KilnFireCanvas config={{ intensity: 0.6, colorScheme: 'mixed', direction: 'up', speed: 0.6, sizeRange: [2, 6], glowRadius: 300, glowColor: '#B46E32' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div
          className={`text-center mb-20 transition-all duration-[1500ms] ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="story-subtitle text-glaze-50/50 text-lg tracking-[0.4em] mb-3">
            千年窑火 · 古今共振
          </p>
          <h2 className="story-title text-4xl md:text-6xl text-glaze-50 mb-4">
            双线共振
          </h2>
          <div className="flex items-center justify-center gap-6 mt-6">
            <span className="text-kiln-400/80 story-subtitle text-lg">裂痕生光</span>
            <div className="w-px h-6 bg-glaze-50/30" />
            <span className="text-celadon-300/80 story-subtitle text-lg">慢火传灯</span>
          </div>
        </div>

        <div className="space-y-20">
          {resonancePairs.map((pair, index) => {
            const pairProgress = Math.max(
              0,
              Math.min(1, (progress - 0.1 - index * 0.15) * 3.5)
            )
            const isVisible = pairProgress > 0

            return (
              <div
                key={index}
                className={`transition-all duration-[1500ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                <div className="text-center mb-8">
                  <span
                    className="inline-block px-4 py-1 rounded-full text-sm tracking-[0.3em] font-serif"
                    style={{
                      backgroundColor: 'rgba(201, 168, 76, 0.15)',
                      color: '#C9A84C',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                    }}
                  >
                    {pair.theme}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div
                    className="relative p-6 md:p-8 rounded-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(92, 58, 33, 0.15), rgba(26, 20, 16, 0.8))',
                      borderLeft: '3px solid #5C3A21',
                    }}
                  >
                    <p className="text-kiln-400/60 text-xs tracking-[0.3em] mb-2 font-serif">
                      古线
                    </p>
                    <h4 className="story-title text-2xl text-glaze-50 mb-2">
                      {pair.ancient.title}·{pair.ancient.subtitle}
                    </h4>
                    <p className="story-body text-glaze-50/60 text-sm leading-relaxed">
                      {pair.ancient.description}
                    </p>
                    {pair.ancient.quote && (
                      <p className="story-quote text-xs mt-3 text-kiln-400/70">
                        「{pair.ancient.quote}」
                      </p>
                    )}
                  </div>

                  <div
                    className="relative p-6 md:p-8 rounded-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(74, 124, 89, 0.15), rgba(26, 20, 16, 0.8))',
                      borderRight: '3px solid #4A7C59',
                    }}
                  >
                    <p className="text-celadon-400/60 text-xs tracking-[0.3em] mb-2 font-serif">
                      今线
                    </p>
                    <h4 className="story-title text-2xl text-glaze-50 mb-2">
                      {pair.modern.title}·{pair.modern.subtitle}
                    </h4>
                    <p className="story-body text-glaze-50/60 text-sm leading-relaxed">
                      {pair.modern.description}
                    </p>
                    {pair.modern.quote && (
                      <p className="story-quote text-xs mt-3 text-celadon-300/70">
                        「{pair.modern.quote}」
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="story-body text-glaze-50/40 text-sm italic tracking-wide">
                    {pair.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="mt-24 text-center transition-all duration-[2000ms]"
          style={{ opacity: titleProgress }}
        >
          <div className="relative inline-block">
            <h3 className="story-title text-4xl md:text-6xl text-glaze-50 glow-text mb-2">
              裂痕生光
            </h3>
            <h3 className="story-title text-4xl md:text-6xl text-celadon-200 celadon-glow">
              慢火传灯
            </h3>
            <div className="absolute -inset-8 bg-gradient-radial from-kiln-400/10 via-transparent to-transparent rounded-full pointer-events-none" />
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <p className="story-body text-glaze-50/50 text-base leading-loose">
              美生于裂痕。弟之嫉妒是破坏，破坏却催生开片之美；兄弟决裂是断裂，断裂却催生两种绝世之釉。
              传承不在器物而在人心。守窑是传技，育人是传心；窑火再旺，无人添柴终将熄灭。
            </p>
            <p className="story-body text-glaze-50/50 text-base leading-loose mt-4">
              裂而不断，和而不同——裂隙不是终结，而是新生的起点。
              千年窑火不灭，非因火不曾熄，乃因总有人重新点燃。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
