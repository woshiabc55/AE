/**
 * Shot 03 — 特写 · 老头眼神
 * 瞳孔金光绽放
 */
import { motion } from 'framer-motion'

export default function Shot03({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #3a2412 0%, #1a0e05 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none" style={{ position: 'absolute' }}>
        {/* 脸部特写 */}
        <g transform="translate(50, 28)">
          {/* 脸部轮廓 */}
          <ellipse cx="0" cy="0" rx="18" ry="22" fill="#8a5a3a" />
          {/* 阴影 */}
          <ellipse cx="6" cy="3" rx="14" ry="18" fill="#000" opacity="0.4" />
          {/* 皱纹 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-10 + i * 3} -8 Q ${-9 + i * 3} -5 ${-10 + i * 3} -2`}
              stroke="#3a1a08"
              strokeWidth="0.2"
              fill="none"
              opacity="0.5"
            />
          ))}
          {/* 眉毛 */}
          <path d="M -8 -8 L -3 -10" stroke="#1a0a05" strokeWidth="0.8" />
          <path d="M 3 -10 L 8 -8" stroke="#1a0a05" strokeWidth="0.8" />
          {/* 眼睛 - 左 */}
          <g>
            <ellipse cx="-4" cy="-4" rx="2" ry="1.2" fill="#fff" />
            <motion.circle
              cx="-4" cy="-4"
              r={0.5 + progress * 1.5}
              fill="#f0c878"
              animate={{ r: 0.5 + progress * 1.5 }}
              style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 4px #f0c878)' }}
            />
            <circle cx="-4" cy="-4" r="0.4" fill="#000" />
          </g>
          {/* 眼睛 - 右 */}
          <g>
            <ellipse cx="4" cy="-4" rx="2" ry="1.2" fill="#fff" />
            <motion.circle
              cx="4" cy="-4"
              r={0.5 + progress * 1.5}
              fill="#f0c878"
              animate={{ r: 0.5 + progress * 1.5 }}
              style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 4px #f0c878)' }}
            />
            <circle cx="4" cy="-4" r="0.4" fill="#000" />
          </g>
          {/* 鼻子 */}
          <path d="M 0 -3 L -1 5 L 1 5 Z" fill="#5a3a1c" />
          {/* 嘴 - 狡黠笑容 */}
          <path
            d={`M -4 10 Q 0 ${10 + progress * 4} 4 10`}
            stroke="#1a0a05"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
        {/* 金光放射 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <line
              key={i}
              x1={50 + Math.cos(angle) * 8}
              y1={28 + Math.sin(angle) * 8}
              x2={50 + Math.cos(angle) * (8 + progress * 30)}
              y2={28 + Math.sin(angle) * (8 + progress * 30)}
              stroke="#f0c878"
              strokeWidth="0.3"
              opacity={progress * 0.6}
            />
          )
        })}
      </svg>
    </div>
  )
}
