import { motion, AnimatePresence } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext.jsx'
import ShotRenderer from './ShotRenderer.jsx'

function formatTC(ms) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  const cs = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export default function ImaxStage() {
  const { currentShot, isPlaying, globalTime, totalDuration, currentShotIndex } = usePlayer()

  return (
    <div className="imax-stage">
      <div className="imax-frame">
        <div className="imax-canvas">
          <ShotRenderer />
          {/* 镜头暗角 */}
          <div className="vignette" />
          {/* 颗粒感 */}
          <div className="grain" />
          {/* IMAX 上下黑边 */}
          <div className="imax-letterbox top" />
          <div className="imax-letterbox bot" />
          {/* IMAX 角标 */}
          <div className="imax-mark">
            <span className="dot" />
            <span className="rec">● REC</span>
            <span>IMAX · 3D</span>
            <span>RENDER: IMS</span>
          </div>
          {/* 时间码 */}
          <div className="imax-tc">
            <span className="shot-id">镜 {String(currentShotIndex + 1).padStart(2, '0')}/{currentShot.id}</span>
            <span>TC {formatTC(globalTime)}</span>
          </div>
          {/* 镜头元信息条 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentShot.id}
              className="shot-meta show"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <div className="meta-act">ACT {String(currentShot.act).padStart(2, '0')} · {currentShot.shotSize}</div>
                <div className="meta-title">镜 {String(currentShot.no).padStart(2, '0')} · {currentShot.movement}</div>
                <div className="meta-desc">{currentShot.description}</div>
              </div>
              <div />
              <div className="meta-right">
                <div>FX · <span className="v">{currentShot.fx}</span></div>
                <div>AUDIO · <span className="v">{currentShot.audioCue}</span></div>
                <div>DUR · <span className="v">{(currentShot.duration / 1000).toFixed(1)}s</span></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
