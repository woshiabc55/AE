import { useEffect, useState } from 'react'
import KilnFireCanvas from '@/components/canvas/KilnFireCanvas'
import { useInView } from '@/hooks/useScrollProgress'

export default function IntroSection() {
  const { ref, isInView } = useInView(0.1)
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const t1 = setTimeout(() => setShowTitle(true), 800)
    const t2 = setTimeout(() => setShowSubtitle(true), 2200)
    const t3 = setTimeout(() => setShowHint(true), 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [isInView])

  return (
    <section ref={ref} className="section-container flex items-center justify-center bg-iron-950">
      <KilnFireCanvas intensity={1.2} colorScheme="warm" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div
          className={`transition-all duration-[2000ms] ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="story-title text-5xl md:text-7xl text-glaze-50 glow-text mb-6">
            裂痕生光
          </h1>
          <h1 className="story-title text-5xl md:text-7xl text-celadon-200 celadon-glow mb-10">
            慢火传灯
          </h1>
        </div>

        <div
          className={`transition-all duration-[2000ms] ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="story-subtitle text-xl md:text-2xl text-glaze-50/70 tracking-[0.3em] mb-4">
            龙泉青瓷 · 双线故事
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-kiln-400/60" />
            <span className="text-kiln-400/80 text-sm tracking-[0.5em] font-serif">窑火千年</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-kiln-400/60" />
          </div>
        </div>

        <div
          className={`transition-all duration-[1500ms] ${
            showHint ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <p className="mt-20 text-glaze-50/40 text-sm tracking-widest animate-float">
            ↓ 向下滚动，开启千年窑火之旅
          </p>
        </div>
      </div>
    </section>
  )
}
