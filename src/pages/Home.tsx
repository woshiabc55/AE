import { useEffect, useState } from 'react'
import GameContainer from '@/components/game/GameContainer'

export default function Home() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!started) {
    return (
      <div
        className="w-full h-screen bg-iron-950 flex items-center justify-center overflow-hidden relative"
        onClick={() => setStarted(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-iron-950 via-kiln-900/20 to-iron-950" />

        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <div className="w-full h-full bg-gradient-to-t from-kiln-400/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="story-title text-4xl md:text-6xl text-glaze-50 glow-text mb-4">
            裂痕生光
          </h1>
          <h1 className="story-title text-4xl md:text-6xl text-celadon-200 celadon-glow mb-8">
            慢火传灯
          </h1>
          <p className="story-subtitle text-lg md:text-xl text-glaze-50/50 tracking-[0.3em] mb-3">
            龙泉青瓷 · 对话式故事
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 mb-12">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-kiln-400/40" />
            <span className="text-kiln-400/60 text-xs tracking-[0.5em] font-serif">千年窑火</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-kiln-400/40" />
          </div>
          <p className="text-glaze-50/30 text-sm tracking-widest animate-pulse mt-8">
            点击任意处开始
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full overflow-hidden bg-iron-950"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <GameContainer />
    </div>
  )
}
