/**
 * Shot 05 — 中景 · 士兵跌倒
 * 水墨线条迸发
 */
import { motion } from 'framer-motion'

export default function Shot05({ progress }) {
  return (
    <div className="shot-layer" style={{
      background: 'radial-gradient(ellipse at center, #2a1810 0%, #0a0402 100%)'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
        {/* 地面 */}
        <path d="M 0 38 L 100 38 L 100 56 L 0 56 Z" fill="#1a0a05" />
        {/* 士兵 - 跌倒中 */}
        <g transform="translate(30, 38)">
          {/* 身躯 - 倾斜 */}
          <g transform={`rotate(${15 - progress * 30})`}>
            <ellipse cx="0" cy="-3" rx="3" ry="6" fill="#2a1810" />
            {/* 头盔 */}
            <ellipse cx="0" cy="-7" rx="2.5" ry="2" fill="#5a4630" />
            <rect x="-2.5" y="-7" width="5" height="1" fill="#3a2412" />
            {/* 铠甲纹 */}
            <line x1="-2" y1="-3" x2="2" y2="-3" stroke="#5a4630" strokeWidth="0.2" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#5a4630" strokeWidth="0.2" />
            {/* 武器 */}
            <line x1="-3" y1="-2" x2="-5" y2="3" stroke="#5a4630" strokeWidth="0.3" />
          </g>
        </g>
        {/* 老头 - 站立前方 */}
        <g transform="translate(70, 30)">
          {/* 草帽 */}
          <ellipse cx="0" cy="-12" rx="6" ry="1.5" fill="#3a2412" />
          <path d="M -3 -12 L -2 -16 L 2 -16 L 3 -12 Z" fill="#3a2412" />
          {/* 头 */}
          <circle cx="0" cy="-9" r="2.5" fill="#8a5a3a" />
          {/* 身躯 */}
          <path d="M -4 -7 L -5 6 L 5 6 L 4 -7 Z" fill="#3a2412" />
          {/* 衣服纹 */}
          <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#1a0a05" strokeWidth="0.2" />
          <line x1="-4" y1="2" x2="4" y2="2" stroke="#1a0a05" strokeWidth="0.2" />
          {/* 腿 */}
          <rect x="-2" y="6" width="1.5" height="5" fill="#1a0a05" />
          <rect x="0.5" y="6" width="1.5" height="5" fill="#1a0a05" />
        </g>
        {/* 水墨线条迸发 - 从老头身上 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const len = 5 + progress * 25
          return (
            <line
              key={i}
              x1={70 + Math.cos(angle) * 3}
              y1={30 + Math.sin(angle) * 3}
              x2={70 + Math.cos(angle) * (3 + len)}
              y2={30 + Math.sin(angle) * (3 + len)}
              stroke="#1a1611"
              strokeWidth={0.4 - i * 0.03}
              opacity={progress * 0.8}
              style={{ mixBlendMode: 'multiply' }}
            />
          )
        })}
        {/* 镜头模糊过渡 */}
        {progress < 0.3 && (
          <rect width="100" height="56" fill="#1a0a05" opacity={1 - progress * 3} style={{ filter: 'blur(2px)' }} />
        )}
      </svg>
    </div>
  )
}
