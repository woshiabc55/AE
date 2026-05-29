import { useRef, useCallback } from 'react'
import { ancientStory } from '@/data/storyData'
import { useScrollProgress, useInView } from '@/hooks/useScrollProgress'
import CrackCanvas from '@/components/canvas/CrackCanvas'

export default function AncientSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progress } = useScrollProgress(sectionRef)
  const { ref: viewRef, isInView } = useInView(0.05)

  const crackProgress = Math.max(0, Math.min(1, (progress - 0.3) * 2))

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
      className="section-container bg-gradient-to-b from-iron-950 via-kiln-900/10 to-iron-950"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div
          className={`text-center mb-20 transition-all duration-[1500ms] ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="story-subtitle text-kiln-400/80 text-lg tracking-[0.4em] mb-3">
            南宋 · 龙泉
          </p>
          <h2 className="story-title text-4xl md:text-6xl text-glaze-50 mb-4">
            古线·章氏兄弟
          </h2>
          <p className="story-quote text-gold-400/60 text-lg tracking-[0.3em] gold-glow">
            裂痕生美
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-kiln-400/40 via-gold-400/30 to-transparent" />

          {ancientStory.nodes.map((node, index) => {
            const nodeProgress = Math.max(
              0,
              Math.min(1, (progress - index * 0.12) * 4)
            )
            const isLeft = index % 2 === 0
            const isVisible = nodeProgress > 0

            return (
              <div
                key={node.id}
                className={`relative mb-24 last:mb-0 transition-all duration-[1200ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                <div
                  className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 transition-all duration-700`}
                  style={{
                    top: '8px',
                    borderColor: node.color,
                    backgroundColor: isVisible ? node.color : 'transparent',
                    boxShadow: isVisible ? `0 0 12px ${node.color}60` : 'none',
                  }}
                />

                <div
                  className={`ml-16 md:ml-0 md:w-[45%] ${
                    isLeft ? 'md:mr-auto md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:text-left'
                  }`}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-sm mb-3 text-xs tracking-[0.3em] font-serif"
                    style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                      borderLeft: `2px solid ${node.color}`,
                    }}
                  >
                    {node.subtitle}
                  </div>

                  <h3
                    className="story-title text-3xl md:text-4xl mb-4"
                    style={{ color: node.accentColor }}
                  >
                    {node.title}
                  </h3>

                  <p className="story-body text-glaze-50/70 text-base md:text-lg leading-relaxed mb-4">
                    {node.description}
                  </p>

                  {node.quote && (
                    <p
                      className="story-quote text-sm md:text-base tracking-[0.2em]"
                      style={{ color: `${node.color}CC` }}
                    >
                      「{node.quote}」
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="relative mt-16 h-[50vh] flex items-center justify-center">
          <CrackCanvas progress={crackProgress} />
          {crackProgress > 0.5 && (
            <div
              className="relative z-10 text-center transition-all duration-[2000ms]"
              style={{ opacity: Math.min(1, (crackProgress - 0.5) * 4) }}
            >
              <p className="story-title text-3xl md:text-5xl text-gold-400 gold-glow">
                金丝铁线
              </p>
              <p className="story-subtitle text-glaze-50/50 mt-4 tracking-[0.3em]">
                破坏催生至美
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
