import React from 'react'

export const Seal: React.FC<{
  char: string
  size?: number
  rotate?: number
  className?: string
}> = ({ char, size = 36, rotate = -6, className = '' }) => (
  <span
    className={`seal-stamp ${className}`}
    style={{
      width: size,
      height: size,
      transform: `rotate(${rotate}deg)`,
      fontSize: size * 0.45,
    }}
  >
    {char}
  </span>
)

/** 卷轴侧栏装饰 */
export const ScrollRailOrnament: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 400"
    className={className}
    preserveAspectRatio="none"
    aria-hidden
  >
    <defs>
      <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7A5A22" stopOpacity="0.0" />
        <stop offset="0.2" stopColor="#C9A14A" stopOpacity="0.5" />
        <stop offset="0.8" stopColor="#C9A14A" stopOpacity="0.5" />
        <stop offset="1" stopColor="#7A5A22" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <line x1="12" y1="0" x2="12" y2="400" stroke="url(#rail)" strokeWidth="1" />
    <circle cx="12" cy="80" r="3" fill="#C9A14A" />
    <circle cx="12" cy="200" r="3" fill="#A22B1F" />
    <circle cx="12" cy="320" r="3" fill="#C9A14A" />
  </svg>
)

/** 卷轴上下轴头 */
export const ScrollCaps: React.FC<{ className?: string; position: 'top' | 'bottom' }> = ({
  className,
  position,
}) => (
  <div
    className={`${className} pointer-events-none`}
    aria-hidden
    style={{
      position: 'absolute',
      [position]: 0,
      left: 0,
      right: 0,
      height: 14,
      background:
        'linear-gradient(180deg, #7A5A22, #C9A14A 30%, #E5D8BD 50%, #C9A14A 70%, #7A5A22)',
      boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
      borderTop: position === 'top' ? '1px solid rgba(0,0,0,0.4)' : 'none',
      borderBottom: position === 'bottom' ? '1px solid rgba(0,0,0,0.4)' : 'none',
    }}
  />
)

/** 远山层次 SVG */
export const MountainRange: React.FC<{ className?: string; layers?: number; tone?: string }> = ({
  className,
  layers = 4,
  tone = '#3D5A5A',
}) => (
  <svg
    viewBox="0 0 1600 400"
    preserveAspectRatio="none"
    className={className}
    aria-hidden
  >
    {Array.from({ length: layers }).map((_, i) => {
      const offset = i * 14
      const opacity = 0.15 + i * 0.15
      const path = `M0,${300 - offset} L120,${220 - offset} L240,${260 - offset} L360,${180 - offset} L520,${250 - offset} L680,${170 - offset} L820,${230 - offset} L960,${150 - offset} L1120,${220 - offset} L1280,${170 - offset} L1440,${240 - offset} L1600,${210 - offset} L1600,400 L0,400 Z`
      return (
        <path
          key={i}
          d={path}
          fill={tone}
          opacity={opacity}
        />
      )
    })}
  </svg>
)

/** 卷云/飞鸟剪影 */
export const Birds: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 600 100" className={className} aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <path
        key={i}
        d={`M${30 + i * 90},${30 + (i % 2) * 12} q10,-10 20,0 q10,-10 20,0`}
        fill="none"
        stroke="#C9A14A"
        strokeWidth="1.2"
        opacity={0.6}
      />
    ))}
  </svg>
)

/** 卷首题字 (SVG 描线动画) */
export const BrushTitle: React.FC<{ text: string; size?: number; color?: string }> = ({
  text,
  size = 96,
  color = '#F2E9D8',
}) => (
  <svg viewBox="0 0 600 200" width="100%" height="100%" aria-hidden>
    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fontFamily='"Ma Shan Zheng", "ZCOOL XiaoWei", "Noto Serif SC", serif'
      fontSize={size}
      fill={color}
      style={{ filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.6))' }}
    >
      {text}
    </text>
  </svg>
)
