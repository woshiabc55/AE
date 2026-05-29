import { useRef, useCallback } from 'react'
import { modernStory } from '@/data/storyData'
import { useScrollProgress, useInView } from '@/hooks/useScrollProgress'
import ShardCanvas from '@/components/canvas/ShardCanvas'
import SmokeTextCanvas from '@/components/canvas/SmokeTextCanvas'

export default function ModernSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progress } = useScrollProgress(sectionRef)
  const { ref: viewRef, isInView } = useInView(0.05)

  const shardProgress = Math.max(0, Math.min(1, (progress - 0.5) * 3))
  const smokeProgress = Math.max(0, Math.min(1, (progress - 0.15) * 2))

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
      className="section-container bg-gradient-to-b from-iron-950 via-celadon-900/10 to-iron-950"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div
          className={`text-center mb-20 transition-all duration-[1500ms] ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="story-subtitle text-celadon-400/80 text-lg tracking-[0.4em] mb-3">
            当代 · 龙泉
          </p>
          <h2 className="story-title text-4xl md:text-6xl text-glaze-50 mb-4">
            今线·张氏兄弟
          </h2>
          <p className="story-quote text-celadon-200/60 text-lg tracking-[0.3em] celadon-glow">
            慢火传心
          </p>
        </div>

        <div className="relative h-[30vh] mb-16 flex items-center justify-center">
          <SmokeTextCanvas
            text="你守的是窑，我守的是人"
            progress={smokeProgress}
            color="#B0C4B1"
          />
        </div>

        <div className="relative">
          <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-celadon-400/40 via-celadon-200/20 to-transparent" />

          {modernStory.nodes.map((node, index) => {
            const nodeProgress = Math.max(
              0,
              Math.min(1, (progress - 0.1 - index * 0.12) * 4)
            )
            const isRight = index % 2 === 0
            const isVisible = nodeProgress > 0

            return (
              <div
                key={node.id}
                className={`relative mb-24 last:mb-0 transition-all duration-[1200ms] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                <div
                  className="absolute right-8 md:right-1/2 w-4 h-4 rounded-full border-2 translate-x-1/2 transition-all duration-700"
                  style={{
                    top: '8px',
                    borderColor: node.color,
                    backgroundColor: isVisible ? node.color : 'transparent',
                    boxShadow: isVisible ? `0 0 12px ${node.color}60` : 'none',
                  }}
                />

                <div
                  className={`mr-16 md:mr-0 md:w-[45%] ${
                    isRight
                      ? 'md:ml-auto md:pl-12 md:text-left'
                      : 'md:mr-auto md:pr-12 md:text-right'
                  }`}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-sm mb-3 text-xs tracking-[0.3em] font-serif"
                    style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                      borderRight: `2px solid ${node.color}`,
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
          <ShardCanvas progress={shardProgress} />
          {shardProgress > 0.5 && (
            <div
              className="relative z-10 text-center transition-all duration-[2000ms]"
              style={{ opacity: Math.min(1, (shardProgress - 0.5) * 4) }}
            >
              <p className="story-title text-3xl md:text-5xl text-celadon-200 celadon-glow">
                残片拼合
              </p>
              <p className="story-subtitle text-glaze-50/50 mt-4 tracking-[0.3em]">
                不完美却发光
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
