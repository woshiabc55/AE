import { useRef } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { ACTS, SHOTS } from '../data/storyboard.js'

function formatTC(ms) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  const cs = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export default function Timeline() {
  const {
    isPlaying, toggle, globalTime, totalDuration, currentShotIndex, seek, prev, next
  } = usePlayer()
  const barRef = useRef(null)

  // 累计每个镜头的开始时间
  const starts = []
  let acc = 0
  SHOTS.forEach(s => { starts.push(acc); acc += s.duration })

  const onBarClick = (e) => {
    const r = barRef.current.getBoundingClientRect()
    const t = ((e.clientX - r.left) / r.width) * totalDuration
    seek(t)
  }

  const progress = globalTime / totalDuration

  return (
    <div className="timeline">
      <div className="timeline-bar" ref={barRef} onClick={onBarClick}>
        {SHOTS.map((s, i) => {
          const left = (starts[i] / totalDuration) * 100
          const width = (s.duration / totalDuration) * 100
          const passed = globalTime >= starts[i] + s.duration
          const active = !passed && globalTime >= starts[i]
          return (
            <div
              key={s.id}
              className={`seg ${active ? 'active' : ''} ${passed ? 'passed' : ''}`}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          )
        })}
        <div className="timeline-cursor" style={{ left: `${progress * 100}%` }} />
      </div>
      <div className="timeline-ticks">
        {ACTS.map(act => {
          const firstShot = SHOTS.find(s => s.act === act.id)
          if (!firstShot) return null
          const idx = SHOTS.indexOf(firstShot)
          const left = (starts[idx] / totalDuration) * 100
          return (
            <div key={act.id} className="tick act" style={{ left: `${left}%` }}>
              A{act.id}
            </div>
          )
        })}
        <div className="tick" style={{ left: '100%', transform: 'translateX(-100%)' }}>END</div>
      </div>
    </div>
  )
}
