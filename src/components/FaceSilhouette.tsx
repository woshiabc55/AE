import { memo, useMemo } from 'react'
import type { Pose, ViewId } from '@/data/character'

interface Props {
  view: ViewId
  pose: Pose
  yawDeg: number
  /** draw only outline strokes (line-art mode) */
  lineArt?: boolean
  /** accent seed for procedural variation */
  seed?: number
}

/**
 * 程序化生成的角色轮廓。 不引用任何第三方版权素材。
 * 通过 view/pose/yawDeg 参数控制视角与姿态,
 * 通过 lineArt 切换「实色面」与「线稿」两种表现。
 */
function FaceSilhouetteBase({ view, pose, yawDeg, lineArt = false, seed = 0 }: Props) {
  const transform = `rotate(${yawDeg} 200 240)`
  const skinFill = lineArt ? 'transparent' : 'url(#skinGradient)'
  const stroke = lineArt ? 'rgba(234,230,221,0.85)' : 'rgba(234,230,221,0.95)'
  const strokeW = lineArt ? 1.1 : 0.6

  // procedural noise dots for freckles / pores
  const freckles = useMemo(() => {
    const out: { cx: number; cy: number; r: number; o: number }[] = []
    const rnd = mulberry32(seed * 9301 + 49297)
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2
      const r = 38 + rnd() * 38
      out.push({
        cx: 200 + Math.cos(a) * r,
        cy: 250 + Math.sin(a) * r * 0.95,
        r: 0.5 + rnd() * 1.2,
        o: 0.18 + rnd() * 0.32,
      })
    }
    return out
  }, [seed])

  // procedural hair strands
  const strands = useMemo(() => {
    const out: { d: string }[] = []
    const rnd = mulberry32(seed * 1664525 + 1013904223)
    for (let i = 0; i < 64; i++) {
      const t = i / 64
      const x0 = 80 + t * 240
      const x1 = x0 + (rnd() - 0.5) * 4
      const x2 = x1 + (rnd() - 0.5) * 6
      const x3 = x2 + (rnd() - 0.5) * 10
      const y0 = 110 + (rnd() - 0.5) * 8
      const y1 = 200 + rnd() * 30
      const y2 = 330 + rnd() * 60
      const y3 = 430 + rnd() * 80
      out.push({ d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${x1.toFixed(1)} ${y1.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}, ${x3.toFixed(1)} ${y3.toFixed(1)}` })
    }
    return out
  }, [seed])

  // collar / shoulders silhouette, posture-aware
  const shouldersD = pose === 'curious'
    ? 'M 60 460 C 100 420, 140 410, 200 410 C 260 410, 300 420, 340 460 L 340 520 L 60 520 Z'
    : pose === 'rest'
      ? 'M 50 480 C 100 430, 140 425, 200 425 C 260 425, 300 430, 350 480 L 350 540 L 50 540 Z'
      : 'M 70 470 C 110 425, 150 415, 200 415 C 250 415, 290 425, 330 470 L 330 530 L 70 530 Z'

  return (
    <svg
      viewBox="0 0 400 560"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="skinGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6DCC8" />
          <stop offset="55%" stopColor="#C9B89A" />
          <stop offset="100%" stopColor="#7A6B53" />
        </linearGradient>
        <linearGradient id="hairGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1612" />
          <stop offset="60%" stopColor="#0F0C0A" />
          <stop offset="100%" stopColor="#070506" />
        </linearGradient>
        <linearGradient id="clothGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2724" />
          <stop offset="100%" stopColor="#0B0A09" />
        </linearGradient>
        <radialGradient id="rimLight" cx="0.7" cy="0.25" r="0.8">
          <stop offset="0%" stopColor="rgba(255,235,200,0.55)" />
          <stop offset="100%" stopColor="rgba(255,235,200,0)" />
        </radialGradient>
        <radialGradient id="shadowVignette" cx="0.5" cy="0.5" r="0.6">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <clipPath id="faceClip">
          <path d="M 200 130 C 260 130, 290 175, 290 240 C 290 310, 260 380, 200 400 C 140 380, 110 310, 110 240 C 110 175, 140 130, 200 130 Z" />
        </clipPath>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <g transform={transform}>
        {/* shoulders / clothing */}
        <path d={shouldersD} fill="url(#clothGradient)" stroke={stroke} strokeWidth={strokeW} />
        <path d={shouldersD} fill="none" stroke="rgba(176,58,46,0.55)" strokeWidth={0.5} />

        {/* neck */}
        <path d="M 175 380 L 175 430 L 225 430 L 225 380 Z" fill={skinFill} stroke={stroke} strokeWidth={strokeW} />

        {/* hair back */}
        <path
          d="M 95 220 C 85 140, 140 80, 200 80 C 260 80, 315 140, 305 220 C 305 280, 300 340, 290 400 L 260 410 C 270 340, 280 280, 280 220 C 280 180, 245 150, 200 150 C 155 150, 120 180, 120 220 C 120 280, 130 340, 140 410 L 110 400 C 100 340, 95 280, 95 220 Z"
          fill="url(#hairGradient)"
          stroke={stroke}
          strokeWidth={strokeW}
        />

        {/* face */}
        <path
          d="M 200 130 C 260 130, 290 175, 290 240 C 290 310, 260 380, 200 400 C 140 380, 110 310, 110 240 C 110 175, 140 130, 200 130 Z"
          fill={skinFill}
          stroke={stroke}
          strokeWidth={strokeW}
        />

        {/* inner face features (clipped) */}
        <g clipPath="url(#faceClip)">
          {/* cheekbone shading */}
          <ellipse cx="150" cy="270" rx="34" ry="22" fill="rgba(0,0,0,0.10)" />
          <ellipse cx="250" cy="270" rx="34" ry="22" fill="rgba(0,0,0,0.10)" />

          {/* eyes (slightly closed for the 'curious' pose) */}
          {view !== 'back' && (
            <g>
              <ellipse cx="170" cy="240" rx="9" ry={pose === 'curious' ? 4 : 3.2} fill="rgba(15,12,10,0.92)" className="origin-center animate-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              <ellipse cx="230" cy="240" rx="9" ry={pose === 'curious' ? 4 : 3.2} fill="rgba(15,12,10,0.92)" className="origin-center animate-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              {/* eyebrows */}
              <path d="M 152 220 Q 170 213, 188 220" fill="none" stroke="rgba(15,12,10,0.85)" strokeWidth="1.4" />
              <path d="M 212 220 Q 230 213, 248 220" fill="none" stroke="rgba(15,12,10,0.85)" strokeWidth="1.4" />
            </g>
          )}

          {/* nose */}
          {view !== 'back' && (
            <path d="M 200 252 L 196 290 Q 200 296, 204 290 Z" fill="rgba(0,0,0,0.18)" stroke="rgba(15,12,10,0.55)" strokeWidth="0.6" />
          )}

          {/* mouth */}
          {view !== 'back' && (
            <path d="M 184 332 Q 200 340, 216 332" fill="none" stroke="rgba(15,12,10,0.85)" strokeWidth="1.4" strokeLinecap="round" />
          )}

          {/* hair front fringe */}
          <path
            d="M 120 195 C 140 150, 180 138, 200 138 C 220 138, 260 150, 280 195 C 270 180, 240 168, 200 168 C 160 168, 130 180, 120 195 Z"
            fill="url(#hairGradient)"
          />

          {/* hair strands overlay (procedural) */}
          <g stroke="rgba(20,16,12,0.55)" strokeWidth="0.5" fill="none" opacity="0.7">
            {strands.map((s, i) => <path key={i} d={s.d} />)}
          </g>

          {/* freckles (procedural) */}
          <g fill="rgba(80,50,30,0.85)">
            {freckles.map((f, i) => <circle key={i} cx={f.cx} cy={f.cy} r={f.r} opacity={f.o} />)}
          </g>

          {/* rim light */}
          <rect x="0" y="0" width="400" height="560" fill="url(#rimLight)" />

          {/* shadow vignette */}
          <rect x="0" y="0" width="400" height="560" fill="url(#shadowVignette)" />
        </g>

        {/* ear (front/side only) */}
        {view !== 'back' && (
          <path
            d="M 290 250 C 305 250, 312 270, 308 295 C 304 315, 295 320, 290 318 Z"
            fill={skinFill}
            stroke={stroke}
            strokeWidth={strokeW}
          />
        )}

        {/* collar accent line */}
        <path d="M 160 440 L 240 440" stroke="rgba(234,230,221,0.45)" strokeWidth="0.6" />
      </g>

      {/* film grain layer (subtle) */}
      {!lineArt && <rect x="0" y="0" width="400" height="560" filter="url(#grain)" opacity="0.08" />}
    </svg>
  )
}

export const FaceSilhouette = memo(FaceSilhouetteBase)

/* deterministic PRNG */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
