/**
 * Shot 02 — 远景 · 农夫种地 · 出拳
 * 周围年轻人围观，瞬间出拳连续5拳
 */
import { motion } from 'framer-motion'

export default function Shot02({ progress }) {
  // 5拳时间点
  const punches = [0.3, 0.45, 0.6, 0.75, 0.9]
  return (
    <div className="shot-layer" style={{
      background: 'linear-gradient(to bottom, #c8a464 0%, #a8512a 50%, #2a1810 100%)'
    }}>
      {/* 远景农场 */}
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 土地纹理 */}
        <path d="M 0 30 L 100 30 L 100 56 L 0 56 Z" fill="#5a3a1c" />
        <path d="M 0 30 L 100 30 L 100 35 L 0 35 Z" fill="#7a4f24" />
        {/* 庄稼行 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={i * 8.5} y1="35" x2={i * 8.5} y2="56" stroke="#3a2412" strokeWidth="0.15" />
        ))}
        {/* 农夫 — 中心 */}
        <g transform="translate(50, 25)">
          {/* 草帽 */}
          <ellipse cx="0" cy="-8" rx="3.5" ry="1" fill="#5a3a1c" />
          <path d="M -2 -8 L -1.5 -11 L 1.5 -11 L 2 -8 Z" fill="#5a3a1c" />
          {/* 头 */}
          <circle cx="0" cy="-6" r="1.5" fill="#c89c6c" />
          {/* 身躯 */}
          <path d="M -2 -5 L -3 5 L 3 5 L 2 -5 Z" fill="#3a2412" />
          {/* 腿 */}
          <rect x="-1.5" y="5" width="1" height="3" fill="#1a1208" />
          <rect x="0.5" y="5" width="1" height="3" fill="#1a1208" />
          {/* 锄头 */}
          <line x1="3" y1="-2" x2="6" y2="-5" stroke="#3a2412" strokeWidth="0.2" />
          <rect x="5.5" y="-6" width="1.5" height="2" fill="#5a4630" />
        </g>
        {/* 周围人剪影 */}
        {[
          { x: 20, y: 28 }, { x: 25, y: 30 }, { x: 30, y: 28 },
          { x: 70, y: 30 }, { x: 75, y: 28 }, { x: 80, y: 30 }
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <ellipse cx="0" cy="0" rx="1.2" ry="0.5" fill="#1a1208" />
            <circle cx="0" cy="-2" r="1" fill="#1a1208" />
            <path d="M -1.2 -1 L -1.5 3 L 1.5 3 L 1.2 -1 Z" fill="#1a1208" />
          </g>
        ))}
      </svg>

      {/* 拳风白线 - 5拳 */}
      {punches.map((t, i) => {
        const localP = (progress - t) / 0.05
        if (localP < 0 || localP > 1) return null
        const direction = i % 2 === 0 ? 1 : -1
        return (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 - localP }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '45%',
              width: `${200 + localP * 300}px`,
              height: '3px',
              background: 'linear-gradient(to right, transparent 0%, #fff 50%, transparent 100%)',
              transformOrigin: 'left center',
              transform: `scaleX(${localP}) translateY(${(i - 2) * 8}px) scaleX(${direction})`,
              boxShadow: '0 0 20px #fff, 0 0 40px #c8a464',
              mixBlendMode: 'screen'
            }}
          />
        )
      })}

      {/* 被打飞的人 - 后期 */}
      {progress > 0.6 && (() => {
        const flyP = (progress - 0.6) / 0.4
        return (
          <motion.div
            animate={{
              x: 200 * flyP,
              y: -100 * flyP,
              rotate: 360 * flyP
            }}
            style={{
              position: 'absolute',
              left: '25%', top: '50%',
              fontSize: 10,
              color: '#1a1208',
              textShadow: '0 0 2px #000'
            }}
          >
            <div style={{
              width: 14, height: 14,
              background: '#1a1208',
              borderRadius: '50%'
            }} />
          </motion.div>
        )
      })()}

      {/* 字幕 "此界有如此人" */}
      {progress > 0.7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '20%', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--f-serif)',
            fontSize: 24,
            color: '#c8a464',
            textShadow: '0 0 10px #000, 0 0 20px #c8a464',
            letterSpacing: '0.3em',
            writingMode: 'vertical-rl'
          }}
        >
          此界有如此人
        </motion.div>
      )}
    </div>
  )
}
