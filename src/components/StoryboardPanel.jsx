import { useMemo, useRef } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { ACTS, SHOTS } from '../data/storyboard.js'

export default function StoryboardPanel() {
  const { currentShotIndex, seekToShot } = usePlayer()
  const listRef = useRef(null)

  // 按幕分组
  const grouped = useMemo(() => {
    const map = new Map()
    SHOTS.forEach(s => {
      if (!map.has(s.act)) map.set(s.act, [])
      map.get(s.act).push(s)
    })
    return map
  }, [])

  return (
    <aside className="storyboard-panel">
      <div className="panel-head">
        <div className="brand">觉 醒 · AWAKENING</div>
        <div className="sub">IMAX 6幕18镜 · 整合分镜框架</div>
      </div>
      <div className="panel-list" ref={listRef}>
        {ACTS.map(act => {
          const shots = grouped.get(act.id) || []
          return (
            <div key={act.id}>
              <div className="act-head">
                <span className="num">ACT {String(act.id).padStart(2, '0')}</span>
                <span>{act.name}</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--c-text-faint)', letterSpacing: '0.2em' }}>· {act.en}</span>
                <div className="bar" />
              </div>
              {shots.map(shot => {
                const isActive = SHOTS[currentShotIndex]?.id === shot.id
                return (
                  <div
                    key={shot.id}
                    className={`shot-card ${isActive ? 'active' : ''}`}
                    onClick={() => seekToShot(SHOTS.findIndex(s => s.id === shot.id))}
                  >
                    <div className="id">{shot.id}</div>
                    <div className="body">
                      <div className="row1">
                        <span className="tag">{shot.shotSize}</span>
                        <span className="tag">{(shot.duration / 1000).toFixed(1)}s</span>
                      </div>
                      <div className="desc">{shot.description}</div>
                      <div className="fx">FX · {shot.fx}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
