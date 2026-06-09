import { usePlayer } from '../context/PlayerContext.jsx'

function formatTC(ms) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  const cs = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export default function Transport() {
  const { isPlaying, toggle, globalTime, totalDuration, currentShotIndex, prev, next } = usePlayer()

  return (
    <div className="transport">
      <div className="row1">
        <button className="btn-play" onClick={toggle} title="播放/暂停 (Space)">
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button className="btn-icon" onClick={prev} title="上一镜 (←)">⟨</button>
        <button className="btn-icon" onClick={next} title="下一镜 (→)">⟩</button>
        <div className="tc-block">
          <span className="v">{formatTC(globalTime)}</span>
          <span style={{ margin: '0 8px', color: 'var(--c-text-faint)' }}>/</span>
          <span>{formatTC(totalDuration)}</span>
          <span style={{ margin: '0 12px', color: 'var(--c-text-faint)' }}>·</span>
          <span>镜 {String(currentShotIndex + 1).padStart(2, '0')}/18</span>
        </div>
      </div>
    </div>
  )
}
