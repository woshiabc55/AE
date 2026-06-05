import React from 'react'

export const Seal: React.FC<{ char: string; size?: number; rotate?: number; className?: string }> = ({ char, size = 36, rotate = -6, className = '' }) => (
  <span className={`seal-stamp ${className}`} style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, fontSize: size * 0.45 }}>
    {char}
  </span>
)

export const MountainRange: React.FC<{ className?: string; tone?: string }> = ({ className, tone = '#3D5A5A' }) => (
  <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className={className} aria-hidden>
    {[0, 1, 2, 3].map((i) => {
      const yBase = 200 + i * 50
      const amp = 30 - i * 4
      return (
        <path key={i} d={`M0,${yBase} L120,${yBase - amp} L240,${yBase - amp * 0.5} L360,${yBase - amp * 1.5} L520,${yBase - amp * 0.7} L680,${yBase - amp * 1.6} L820,${yBase - amp * 0.6} L960,${yBase - amp * 1.8} L1120,${yBase - amp * 0.6} L1280,${yBase - amp * 1.5} L1440,${yBase - amp * 0.5} L1600,${yBase - amp * 1.2} L1600,400 L0,400 Z`} fill={tone} opacity={0.15 + i * 0.15} />
      )
    })}
  </svg>
)

export const Birds: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 600 100" className={className} aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M${30 + i * 90},${30 + (i % 2) * 12} q10,-10 20,0 q10,-10 20,0`} fill="none" stroke="#C9A14A" strokeWidth="1.2" opacity="0.6" />
    ))}
  </svg>
)

export const ScrollCaps: React.FC<{ className?: string; position: 'top' | 'bottom' }> = ({ className, position }) => (
  <div className={`${className} pointer-events-none`} aria-hidden style={{ position: 'absolute', [position]: 0, left: 0, right: 0, height: 14, background: 'linear-gradient(180deg, #7A5A22, #C9A14A 30%, #E5D8BD 50%, #C9A14A 70%, #7A5A22)', boxShadow: '0 4px 18px rgba(0,0,0,0.6)' }} />
)
