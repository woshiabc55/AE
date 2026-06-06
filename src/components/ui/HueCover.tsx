import { useMemo } from 'react'
import { TYPE_LABEL, TYPE_GLYPH, type DerivativeType } from '../../data/derivatives'
import { hueToGradient } from '../../lib/stats'

interface HueCoverProps {
  hue: number
  title: string
  type: DerivativeType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PATTERNS = [
  'pixel-stripes',
  'pixel-circles',
  'pixel-grid',
  'pixel-corner',
] as const

const PATTERN_BG: Record<typeof PATTERNS[number], (h: number) => string> = {
  'pixel-stripes': (h) => `repeating-linear-gradient(135deg, hsla(${h}, 70%, 60%, 0.0) 0 8px, hsla(${h}, 70%, 70%, 0.18) 8px 9px)`,
  'pixel-circles': (h) => `radial-gradient(hsla(${h}, 80%, 75%, 0.22) 1.5px, transparent 1.6px)`,
  'pixel-grid': (h) => `linear-gradient(hsla(${h}, 60%, 70%, 0.18) 1px, transparent 1px), linear-gradient(90deg, hsla(${h}, 60%, 70%, 0.18) 1px, transparent 1px)`,
  'pixel-corner': (h) => `radial-gradient(circle at 100% 0%, hsla(${h}, 80%, 70%, 0.35), transparent 60%)`,
}

export function HueCover({ hue, title, type, size = 'md', className = '' }: HueCoverProps) {
  const sizes = {
    sm: 'h-24 text-[10px]',
    md: 'h-36 text-sm',
    lg: 'h-64 text-base',
  }
  const pattern = useMemo(() => PATTERNS[title.length % PATTERNS.length], [title])
  const label = TYPE_LABEL[type] ?? type
  const glyph = TYPE_GLYPH[type] ?? '✨'

  return (
    <div
      className={`relative w-full overflow-hidden ${sizes[size]} ${className}`}
      style={{ background: hueToGradient(hue) }}
    >
      <div className="absolute inset-0" style={{ background: PATTERN_BG[pattern](hue), backgroundSize: pattern.includes('circles') ? '14px 14px' : pattern.includes('grid') ? '12px 12px' : undefined }} />
      {/* corner glyph */}
      <div className="absolute right-2 top-2 flex items-center gap-1 bg-ink/65 px-1.5 py-0.5 font-pixel text-[8px] tracking-widest text-bone/85">
        <span>{glyph}</span>
        <span>{label}</span>
      </div>
      {/* big symbol */}
      <div className="absolute left-2 bottom-2 font-pixel text-[10px] text-bone/70">
        {title.slice(0, 1)}
      </div>
      <div className="absolute -bottom-1 -right-1 font-pixel text-3xl text-bone/15">
        {glyph}
      </div>
    </div>
  )
}
