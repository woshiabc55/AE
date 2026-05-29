import type { CharacterId, Expression } from '@/engine/types'
import { characters } from '@/engine/types'

interface CharacterLayerProps {
  visibleCharacters: CharacterId[]
  expressions: Record<CharacterId, Expression>
}

const characterSilhouettes: Record<CharacterId, { shape: string; accent: string; detail: string }> = {
  zhangCunGen: {
    shape: 'M50 15 C50 15 35 25 35 45 L35 70 L30 95 L70 95 L65 70 L65 45 C65 25 50 15 50 15Z',
    accent: '#5C3A21',
    detail: 'M42 35 L58 35 M45 50 L55 50',
  },
  zhangShengYi: {
    shape: 'M50 10 C50 10 30 22 30 48 L28 75 L25 95 L75 95 L72 75 L70 48 C70 22 50 10 50 10Z',
    accent: '#D4622B',
    detail: 'M40 32 L60 32 M42 48 L58 48',
  },
  zhangShengEr: {
    shape: 'M50 12 C50 12 32 24 32 46 L30 72 L27 95 L73 95 L70 72 L68 46 C68 24 50 12 50 12Z',
    accent: '#4A7C59',
    detail: 'M42 34 L58 34 M44 48 L56 48',
  },
  zhangJi: {
    shape: 'M50 10 C50 10 28 20 28 50 L26 78 L22 95 L78 95 L74 78 L72 50 C72 20 50 10 50 10Z',
    accent: '#C9A84C',
    detail: 'M38 30 L62 30 M40 46 L60 46',
  },
  zhangShengYuan: {
    shape: 'M50 12 C50 12 30 22 30 48 L28 75 L25 95 L75 95 L72 75 L70 48 C70 22 50 12 50 12Z',
    accent: '#B0C4B1',
    detail: 'M42 32 L58 32 M44 48 L56 48',
  },
  student: {
    shape: 'M50 20 C50 20 38 28 38 45 L36 68 L33 95 L67 95 L64 68 L62 45 C62 28 50 20 50 20Z',
    accent: '#8aab8c',
    detail: 'M43 35 L57 35 M45 48 L55 48',
  },
  master: {
    shape: 'M50 8 C50 8 26 18 26 52 L24 80 L20 95 L80 95 L76 80 L74 52 C74 18 50 8 50 8Z',
    accent: '#5C3A21',
    detail: 'M38 28 L62 28 M40 44 L60 44',
  },
  narrator: {
    shape: '',
    accent: '#F5F0E8',
    detail: '',
  },
}

function getExpressionPath(expr: Expression): string {
  switch (expr) {
    case 'angry':
      return 'M40 58 L48 55 M52 55 L60 58'
    case 'sad':
      return 'M42 56 Q50 52 58 56'
    case 'happy':
      return 'M42 54 Q50 62 58 54'
    case 'determined':
      return 'M42 56 L58 56'
    case 'surprised':
      return 'M44 54 Q47 50 50 54 Q53 50 56 54'
    case 'guilty':
      return 'M42 58 Q50 54 58 58'
    default:
      return 'M42 56 Q50 58 58 56'
  }
}

export default function CharacterLayer({ visibleCharacters, expressions }: CharacterLayerProps) {
  const positionMap: Record<string, number> = {}
  const leftChars = visibleCharacters.filter((id) => characters[id]?.side === 'left')
  const centerChars = visibleCharacters.filter((id) => characters[id]?.side === 'center')
  const rightChars = visibleCharacters.filter((id) => characters[id]?.side === 'right')

  leftChars.forEach((id, i) => {
    positionMap[id] = 20 + i * 15
  })
  centerChars.forEach((id) => {
    positionMap[id] = 50
  })
  rightChars.forEach((id, i) => {
    positionMap[id] = 80 - i * 15
  })

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {visibleCharacters.map((id) => {
        if (id === 'narrator') return null
        const char = characters[id]
        const silhouette = characterSilhouettes[id]
        if (!silhouette.shape) return null

        const xPos = positionMap[id] ?? 50
        const expr = expressions[id] || 'neutral'

        return (
          <div
            key={id}
            className="absolute bottom-0 transition-all duration-700 ease-out"
            style={{
              left: `${xPos}%`,
              transform: 'translateX(-50%)',
              width: '180px',
              height: '70%',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="xMidYMax meet"
            >
              <defs>
                <linearGradient id={`charGrad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={silhouette.accent} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={silhouette.accent} stopOpacity="0.15" />
                </linearGradient>
                <filter id={`charGlow-${id}`}>
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={silhouette.shape}
                fill={`url(#charGrad-${id})`}
                stroke={silhouette.accent}
                strokeWidth="0.5"
                filter={`url(#charGlow-${id})`}
              />

              <path
                d={silhouette.detail}
                fill="none"
                stroke={silhouette.accent}
                strokeWidth="0.8"
                opacity="0.5"
              />

              <path
                d={getExpressionPath(expr)}
                fill="none"
                stroke={silhouette.accent}
                strokeWidth="1"
                opacity="0.8"
              />

              <circle cx="43" cy="42" r="2" fill={silhouette.accent} opacity="0.6" />
              <circle cx="57" cy="42" r="2" fill={silhouette.accent} opacity="0.6" />
            </svg>

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
              style={{ color: char.color }}
            >
              <span className="text-sm font-serif tracking-widest opacity-80">
                {char.name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
