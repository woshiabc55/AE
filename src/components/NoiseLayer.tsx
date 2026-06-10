import { memo } from 'react'

interface Props {
  variant?: 'a' | 'b' | 'c' | 'd'
  opacity?: number
  blendMode?: React.CSSProperties['mixBlendMode']
}

/**
 * 程序化噪点层,使用 SVG <feTurbulence> 生成。
 * variant 改变 baseFrequency / numOctaves,以打破明显重复。
 */
function NoiseLayerBase({ variant = 'a', opacity = 0.18, blendMode = 'overlay' }: Props) {
  const params = {
    a: { freq: 0.9, oct: 2 },
    b: { freq: 1.4, oct: 3 },
    c: { freq: 0.6, oct: 2 },
    d: { freq: 2.2, oct: 1 },
  }[variant]

  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${params.freq}' numOctaves='${params.oct}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundSize: '220px 220px',
        mixBlendMode: blendMode,
        opacity,
      }}
    />
  )
}

export const NoiseLayer = memo(NoiseLayerBase)
