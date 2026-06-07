import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const PARAGRAPH = `万象天文台 · 一座由一百四十一千枚微元素建成的活体图腾。
在这片长卷之中，每一个字符都在等候被点亮。
鼠标经过之处，文字会从纸面浮起，发出淡金色的微光。
你可以选择读它，或只是凝视它。
我们相信：被缓慢看到的文字，比被快速读过的文字更值得记忆。
因此，请慢一点。
请允许自己被一行文字拦下，被一个标点绊住。
这是一封写给所有还在凝视的人的邀请。
你不需要做任何事，只需要继续往下走。
在这座观测台里，光标与时间是仅有的两把钥匙。
按下任意字符，整篇会从此处开始朗读。
请闭上眼睛，让文字自己发出声音。
这不是效率的工具，而是一份允许你停顿的礼物。
当最后一粒光点熄灭时，落幕会自动到来。
在那之前——继续凝视。
` // ~ 350 chars

const REPEATS = Math.ceil(12_000 / PARAGRAPH.length)
const TEXT = PARAGRAPH.repeat(REPEATS).slice(0, 12_000)

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [reading, setReading] = useState(false)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const r = ref.current
      if (!r) return
      const ratio = (r.scrollTop) / (r.scrollHeight - r.clientHeight)
      setProgress(Math.max(0, Math.min(1, ratio)))
    }
    const el = ref.current
    if (el) el.addEventListener('scroll', onScroll)
    return () => el?.removeEventListener('scroll', onScroll)
  }, [])

  const toggleRead = () => {
    if (!('speechSynthesis' in window)) return
    if (reading) {
      window.speechSynthesis.cancel()
      setReading(false)
    } else {
      const u = new SpeechSynthesisUtterance(PARAGRAPH.slice(0, 600))
      u.lang = 'zh-CN'
      u.rate = 0.85
      u.onend = () => setReading(false)
      window.speechSynthesis.speak(u)
      setReading(true)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-mist">
      <div
        ref={ref}
        onMouseMove={(e) => {
          // find nearest span to mouse for hover effect
          const t = e.target as HTMLElement
          if (t.tagName === 'SPAN' && t.dataset.idx) {
            setHoverIdx(Number(t.dataset.idx))
          } else {
            setHoverIdx(null)
          }
        }}
        onMouseLeave={() => setHoverIdx(null)}
        className="absolute inset-0 overflow-y-auto px-6 md:px-16 lg:px-32 py-32 md:py-40"
      >
        <div className="max-w-3xl mx-auto">
          <div className="section-meta">
            <span className="num">10</span>
            <span>MANIFESTO · 宣言</span>
          </div>
          <h2 className="font-display section-title mt-3 gilt-text">
            慢慢<br />读
          </h2>
          <div className="gilt-line mt-6" />

          <p
            className="font-han text-base md:text-lg leading-loose text-paper/85 mt-12 whitespace-pre-wrap"
            style={{ wordBreak: 'break-word' }}
          >
            {TEXT.split('').map((ch, i) => {
              const distance = hoverIdx !== null ? Math.abs(i - hoverIdx) : Infinity
              const intensity = hoverIdx !== null ? Math.max(0, 1 - distance / 8) : 0
              return (
                <span
                  key={i}
                  data-idx={i}
                  className="inline-block"
                  style={{
                    color: intensity > 0
                      ? `rgba(232, 228, 216, ${0.85 + intensity * 0.15})`
                      : 'rgba(232, 228, 216, 0.85)',
                    textShadow: intensity > 0.3
                      ? `0 0 ${intensity * 14}px rgba(212,175,55,${intensity * 0.8})`
                      : 'none',
                    transition: 'color 0.4s var(--ease-soft), text-shadow 0.4s var(--ease-soft)',
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </p>

          <div className="mt-24 mb-12 gilt-line" />
          <p className="font-mono text-[0.65rem] tracking-[0.3em] text-paper/40 text-center">
            — END OF MANIFESTO · 12,000 CHARACTERS —
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 top-32 bottom-32 w-px bg-paper/10">
        <div
          className="absolute inset-x-0 top-0 bg-gilt"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right">
        <div className="section-meta justify-end">
          <span>MANIFESTO</span>
          <span className="num">10</span>
        </div>
        <div className="mt-3 font-mono text-[0.7rem] tracking-widest text-paper/60">
          {(progress * 100).toFixed(1)}%
        </div>
        <button
          onClick={toggleRead}
          className="mt-3 btn-capsule"
          data-cursor="hover"
        >
          {reading ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          <span>{reading ? '停止朗读' : '朗读首段'}</span>
        </button>
      </div>
    </div>
  )
}
