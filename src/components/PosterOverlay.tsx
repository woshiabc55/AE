import { useEffect, useState } from 'react'

function CornerBracket({ position, size = 28 }: { position: 'tl' | 'tr' | 'bl' | 'br'; size?: number }) {
  const transforms: Record<string, string> = {
    tl: '', tr: 'scaleX(-1)', bl: 'scaleY(-1)', br: 'scale(-1)',
  }
  const posMap: Record<string, React.CSSProperties> = {
    tl: { top: 14, left: 14 },
    tr: { top: 14, right: 14 },
    bl: { bottom: 14, left: 14 },
    br: { bottom: 14, right: 14 },
  }
  return (
    <svg
      width={size} height={size}
      style={{ transform: transforms[position], ...posMap[position] }}
      className="absolute pointer-events-none"
    >
      <path d={`M0,${size} L0,0 L${size},0`} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={`M0,${size - 6} L0,6 L${size - 6},6`} fill="none" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
      <circle cx="0" cy="0" r="2" fill="#1a1a1a" />
    </svg>
  )
}

function PaperLabel({ children, x, y, rotate = 0, delay = 0, width }: {
  children: React.ReactNode; x: string; y: string; rotate?: number; delay?: number; width?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800 + delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className="absolute pointer-events-none transition-all duration-700"
      style={{
        left: x, top: y,
        transform: `rotate(${rotate}deg) translateY(${visible ? 0 : 8}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="border shadow-md relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,246,242,0.92) 100%)',
          borderColor: 'rgba(0,0,0,0.12)',
          padding: '5px 10px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.05em',
          width: width || 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.008) 3px,
              rgba(0,0,0,0.008) 4px
            )`,
          }}
        />
        <div className="relative" style={{ color: '#444' }}>{children}</div>
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
          }}
        />
      </div>
    </div>
  )
}

function UIFragment({ x, y, width, height, rotate = 0, delay = 0, variant = 0 }: {
  x: string; y: string; width: number; height: number; rotate?: number; delay?: number; variant?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200 + delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className="absolute pointer-events-none transition-all duration-700"
      style={{
        left: x, top: y, width, height,
        transform: `rotate(${rotate}deg) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 0.88 : 0,
      }}
    >
      <div
        className="w-full h-full border relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(245,243,238,0.85) 100%)',
          borderColor: 'rgba(0,0,0,0.08)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.03)',
          padding: '6px 8px',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.005) 2px,
              rgba(0,0,0,0.005) 3px
            )`,
          }}
        />
        <div className="flex gap-1 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ccc' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ddd' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#e5e5e5' }} />
        </div>
        {variant === 0 && (
          <div className="space-y-1">
            <div className="h-1 rounded-full" style={{ background: '#e0e0e0', width: '70%' }} />
            <div className="h-1 rounded-full" style={{ background: '#d5d5d5', width: '45%' }} />
            <div className="h-1 rounded-full" style={{ background: '#e0e0e0', width: '60%' }} />
            <div className="mt-2 flex gap-1">
              <div className="h-4 flex-1 border rounded-sm" style={{ background: '#f5f5f5', borderColor: '#e0e0e0' }} />
              <div className="h-4 w-8 rounded-sm" style={{ background: '#d0d0d0' }} />
            </div>
          </div>
        )}
        {variant === 1 && (
          <div>
            <div className="flex gap-1 mb-1">
              <div className="h-3 w-3 border" style={{ background: '#f8f8f8', borderColor: '#ddd' }} />
              <div className="h-3 flex-1 rounded-sm" style={{ background: '#e8e8e8' }} />
            </div>
            <div className="h-1 rounded-full" style={{ background: '#e0e0e0', width: '80%' }} />
            <div className="h-1 rounded-full mt-1" style={{ background: '#e8e8e8', width: '55%' }} />
          </div>
        )}
        {variant === 2 && (
          <div className="space-y-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 flex-1" style={{ background: i < 3 ? '#e8e8e8' : '#f0f0f0', border: '0.5px solid #ddd' }} />
              ))}
            </div>
            <div className="h-1 rounded-full" style={{ background: '#e0e0e0', width: '90%' }} />
          </div>
        )}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)',
          }}
        />
      </div>
    </div>
  )
}

function SidePanel({ side, delay = 0 }: { side: 'left' | 'right'; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600 + delay)
    return () => clearTimeout(t)
  }, [delay])

  const leftItems = [
    { key: 'FRAC', val: 'MBX-2.0' },
    { key: 'SCALE', val: '2.000' },
    { key: 'ITER', val: '12' },
    { key: 'DE', val: '0.001' },
    { key: 'AO', val: '5s' },
    { key: 'SSS', val: 'ON' },
    { key: 'FOLD', val: 'BOX' },
    { key: 'TRAP', val: 'MIN' },
  ]
  const rightItems = [
    { key: 'PATTERN', val: 'QH-FLRL' },
    { key: 'COLOR', val: 'BW-35%' },
    { key: 'DEPTH', val: '80' },
    { key: 'RES', val: 'NATIVE' },
    { key: 'MODE', val: 'RM' },
    { key: 'SPEC', val: '80' },
    { key: 'STATUS', val: 'OK' },
    { key: 'FRAME', val: '001' },
  ]
  const items = side === 'left' ? leftItems : rightItems

  return (
    <div
      className="absolute top-1/2 pointer-events-none transition-all duration-700"
      style={{
        [side]: 18,
        transform: `translateY(-50%) translateX(${visible ? 0 : (side === 'left' ? -16 : 16)}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="border relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,242,0.88) 100%)',
          borderColor: 'rgba(0,0,0,0.1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: '8px 6px',
          width: 52,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 5px,
              rgba(0,0,0,0.006) 5px,
              rgba(0,0,0,0.006) 6px
            )`,
          }}
        />
        <div className="space-y-2.5 relative">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', letterSpacing: '0.05em' }}>
                {item.key}
              </div>
              <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#555', fontWeight: 500 }}>
                {item.val}
              </div>
              {i < items.length - 1 && (
                <div className="mx-1 mt-2" style={{ height: 0.5, background: 'rgba(0,0,0,0.05)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconToolbar({ side, delay = 0 }: { side: 'left' | 'right'; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900 + delay)
    return () => clearTimeout(t)
  }, [delay])

  const offset = side === 'left' ? 80 : -72

  return (
    <div
      className="absolute top-1/2 pointer-events-none transition-all duration-700"
      style={{
        [side]: offset,
        transform: `translateY(-50%)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="flex flex-col gap-1.5 items-center">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="border flex items-center justify-center"
            style={{
              width: 18, height: 18,
              background: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              {i === 0 && <rect x="2" y="2" width="6" height="6" fill="none" stroke="#999" strokeWidth="0.5" />}
              {i === 1 && <circle cx="5" cy="5" r="3" fill="none" stroke="#999" strokeWidth="0.5" />}
              {i === 2 && <line x1="1" y1="5" x2="9" y2="5" stroke="#999" strokeWidth="0.5" />}
              {i === 3 && <line x1="5" y1="1" x2="5" y2="9" stroke="#999" strokeWidth="0.5" />}
              {i === 4 && <polygon points="5,1 9,8 1,8" fill="none" stroke="#999" strokeWidth="0.5" />}
              {i === 5 && <path d="M2,8 L5,2 L8,8" fill="none" stroke="#999" strokeWidth="0.5" />}
              {i === 6 && <rect x="3" y="3" width="4" height="4" fill="#bbb" />}
              {i === 7 && <line x1="2" y1="2" x2="8" y2="8" stroke="#999" strokeWidth="0.5" />}
              {i === 8 && <path d="M2,5 Q5,2 8,5 Q5,8 2,5" fill="none" stroke="#999" strokeWidth="0.5" />}
              {i === 9 && <g><circle cx="5" cy="5" r="1.5" fill="none" stroke="#999" strokeWidth="0.5" /><circle cx="5" cy="5" r="0.5" fill="#999" /></g>}
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeometricAnnotation({ x, y, width, height, label, delay = 0 }: {
  x: string; y: string; width: number; height: number; label: string; delay?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500 + delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className="absolute pointer-events-none transition-all duration-700"
      style={{ left: x, top: y, width, height, opacity: visible ? 0.65 : 0 }}
    >
      <svg width={width} height={height} className="absolute inset-0">
        <rect x="0" y="0" width={width} height={height} fill="none" stroke="#1a1a1a" strokeWidth="0.5" strokeDasharray="4 2" />
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#1a1a1a" strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1a1a1a" strokeWidth="0.3" strokeDasharray="2 2" />
        <circle cx={width / 2} cy={height / 2} r="3" fill="none" stroke="#1a1a1a" strokeWidth="0.3" />
      </svg>
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5"
        style={{ fontSize: '6px', fontFamily: "'JetBrains Mono', monospace", color: '#777', background: 'rgba(255,255,255,0.8)' }}
      >
        {label}
      </div>
    </div>
  )
}

function DotPattern({ x, y, cols, rows }: { x: string; y: string; cols: number; rows: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {[...Array(cols * rows)].map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 2, height: 2, background: 'rgba(0,0,0,0.15)' }} />
        ))}
      </div>
    </div>
  )
}

function ThinBorder() {
  return (
    <div className="absolute pointer-events-none" style={{ inset: 28 }}>
      <div className="w-full h-full border" style={{ borderColor: 'rgba(0,0,0,0.08)' }} />
    </div>
  )
}

function RegistrationMark({ x, y }: { x: string; y: string }) {
  return (
    <svg className="absolute pointer-events-none" style={{ left: x, top: y }} width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#aaa" strokeWidth="0.4" />
      <circle cx="10" cy="10" r="5" fill="none" stroke="#bbb" strokeWidth="0.3" />
      <line x1="10" y1="0" x2="10" y2="20" stroke="#aaa" strokeWidth="0.3" />
      <line x1="0" y1="10" x2="20" y2="10" stroke="#aaa" strokeWidth="0.3" />
      <circle cx="10" cy="10" r="2" fill="#aaa" />
    </svg>
  )
}

function PaperTextureOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.003) 1px, rgba(0,0,0,0.003) 2px),
          repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.002) 1px, rgba(0,0,0,0.002) 2px)
        `,
        mixBlendMode: 'multiply',
      }}
    />
  )
}

function ChengduWatermark() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: '12%',
        right: '8%',
        zIndex: 12,
        opacity: 0.06,
        transform: 'rotate(-90deg)',
      }}
    >
      <div
        style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: '72px',
          fontWeight: 900,
          color: '#1a1a1a',
          letterSpacing: '0.3em',
          whiteSpace: 'nowrap',
        }}
      >
        成都
      </div>
    </div>
  )
}

function ChengduSeal() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: '18%',
        right: '6%',
        zIndex: 12,
        opacity: 0.12,
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect x="1" y="1" width="34" height="34" fill="none" stroke="#c23a2a" strokeWidth="1.5" rx="2" />
        <text x="18" y="15" textAnchor="middle" style={{ fontSize: '8px', fontFamily: "'Noto Serif SC', serif", fill: '#c23a2a', fontWeight: 700 }}>蜀</text>
        <text x="18" y="28" textAnchor="middle" style={{ fontSize: '7px', fontFamily: "'Noto Serif SC', serif", fill: '#c23a2a' }}>锦城</text>
      </svg>
    </div>
  )
}

function ScaleBar() {
  return (
    <svg className="absolute pointer-events-none" style={{ left: '18%', top: '88%' }} width="240" height="24" viewBox="0 0 240 24">
      <line x1="0" y1="12" x2="240" y2="12" stroke="#bbb" strokeWidth="0.5" />
      <line x1="0" y1="8" x2="0" y2="16" stroke="#999" strokeWidth="0.5" />
      <line x1="60" y1="9" x2="60" y2="15" stroke="#aaa" strokeWidth="0.3" />
      <line x1="120" y1="8" x2="120" y2="16" stroke="#999" strokeWidth="0.5" />
      <line x1="180" y1="9" x2="180" y2="15" stroke="#aaa" strokeWidth="0.3" />
      <line x1="240" y1="8" x2="240" y2="16" stroke="#999" strokeWidth="0.5" />
      <text x="0" y="6" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#aaa' }}>0</text>
      <text x="112" y="6" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#aaa' }}>50</text>
      <text x="232" y="6" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#aaa' }}>100</text>
      <rect x="0" y="12" width="60" height="3" fill="#ddd" />
      <rect x="120" y="12" width="60" height="3" fill="#ddd" />
    </svg>
  )
}

function CompassRose() {
  return (
    <svg className="absolute pointer-events-none" style={{ right: '18%', top: '8%' }} width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="24" fill="none" stroke="#ddd" strokeWidth="0.4" />
      <circle cx="28" cy="28" r="17" fill="none" stroke="#ddd" strokeWidth="0.3" />
      <circle cx="28" cy="28" r="10" fill="none" stroke="#e0e0e0" strokeWidth="0.2" />
      <line x1="28" y1="2" x2="28" y2="54" stroke="#ddd" strokeWidth="0.3" />
      <line x1="2" y1="28" x2="54" y2="28" stroke="#ddd" strokeWidth="0.3" />
      <line x1="9" y1="9" x2="47" y2="47" stroke="#eee" strokeWidth="0.2" />
      <line x1="47" y1="9" x2="9" y2="47" stroke="#eee" strokeWidth="0.2" />
      <text x="28" y="1" textAnchor="middle" style={{ fontSize: '5px', fill: '#bbb', fontFamily: "'JetBrains Mono', monospace" }}>N</text>
      <text x="28" y="56" textAnchor="middle" style={{ fontSize: '5px', fill: '#ccc', fontFamily: "'JetBrains Mono', monospace" }}>S</text>
      <text x="55" y="30" textAnchor="middle" style={{ fontSize: '5px', fill: '#ccc', fontFamily: "'JetBrains Mono', monospace" }}>E</text>
      <text x="1" y="30" textAnchor="middle" style={{ fontSize: '5px', fill: '#ccc', fontFamily: "'JetBrains Mono', monospace" }}>W</text>
    </svg>
  )
}

function CrosshairCenter() {
  return (
    <svg className="absolute pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} width="320" height="320" viewBox="0 0 320 320">
      <line x1="160" y1="0" x2="160" y2="320" stroke="#ccc" strokeWidth="0.3" strokeDasharray="4 4" />
      <line x1="0" y1="160" x2="320" y2="160" stroke="#ccc" strokeWidth="0.3" strokeDasharray="4 4" />
      <circle cx="160" cy="160" r="60" fill="none" stroke="#ddd" strokeWidth="0.3" strokeDasharray="3 3" />
      <circle cx="160" cy="160" r="100" fill="none" stroke="#e5e5e5" strokeWidth="0.2" strokeDasharray="2 4" />
      <circle cx="160" cy="160" r="140" fill="none" stroke="#eee" strokeWidth="0.15" strokeDasharray="1 5" />
      <line x1="155" y1="160" x2="165" y2="160" stroke="#bbb" strokeWidth="0.3" />
      <line x1="160" y1="155" x2="160" y2="165" stroke="#bbb" strokeWidth="0.3" />
    </svg>
  )
}

function LayerStack() {
  return (
    <div className="absolute pointer-events-none" style={{ left: '5%', bottom: '35%' }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 32,
            height: 24,
            background: `rgba(255,255,255,${0.6 - i * 0.1})`,
            border: '0.5px solid rgba(0,0,0,0.08)',
            marginLeft: i * 3,
            marginTop: i === 0 ? 0 : -20,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        />
      ))}
    </div>
  )
}

export default function PosterOverlay() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
      <PaperTextureOverlay />

      <CornerBracket position="tl" size={30} />
      <CornerBracket position="tr" size={30} />
      <CornerBracket position="bl" size={30} />
      <CornerBracket position="br" size={30} />

      <ThinBorder />

      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          top: '5%',
          left: '50%',
          transform: `translateX(-50%) translateY(${loaded ? 0 : -20}px)`,
          opacity: loaded ? 1 : 0,
        }}
      >
        <h1
          className="text-center tracking-widest"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 'clamp(40px, 5.5vw, 80px)',
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '0.18em',
            lineHeight: 1.05,
            textShadow: '0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          瓷器设计
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-px" style={{ width: 60, background: 'linear-gradient(90deg, transparent, #bbb)' }} />
          <span style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', letterSpacing: '0.15em' }}>
            PORCELAIN DESIGN
          </span>
          <div className="h-px" style={{ width: 60, background: 'linear-gradient(90deg, #bbb, transparent)' }} />
        </div>
      </div>

      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          bottom: '7%',
          left: '50%',
          transform: `translateX(-50%) translateY(${loaded ? 0 : 20}px)`,
          opacity: loaded ? 1 : 0,
          transitionDelay: '250ms',
        }}
      >
        <h2
          className="text-center tracking-widest"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 'clamp(22px, 3.2vw, 44px)',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '0.25em',
            lineHeight: 1.1,
          }}
        >
          青 花 瓷
        </h2>
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <div className="h-px" style={{ width: 50, background: 'linear-gradient(90deg, transparent, #bbb)' }} />
          <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#999', letterSpacing: '0.12em' }}>
            BLUE & WHITE PORCELAIN
          </span>
          <div className="h-px" style={{ width: 50, background: 'linear-gradient(90deg, #bbb, transparent)' }} />
        </div>
      </div>

      <PaperLabel x="10%" y="17%" rotate={-2} delay={0} width={160}>
        <span className="text-gray-500">MANDELBOX // SCALE 2.0 // ITER 12</span>
      </PaperLabel>
      <PaperLabel x="70%" y="14%" rotate={1.5} delay={200} width={130}>
        <span className="text-gray-500">FRACTAL SURFACE</span>
      </PaperLabel>
      <PaperLabel x="8%" y="73%" rotate={-1} delay={400} width={170}>
        <span className="text-gray-500">QINGHUA PATTERN v2.4 // FLORAL</span>
      </PaperLabel>
      <PaperLabel x="66%" y="76%" rotate={2} delay={300} width={155}>
        <span className="text-gray-500">OFFLINE ARCHIVE // 2026 // CD</span>
      </PaperLabel>
      <PaperLabel x="35%" y="12%" rotate={0.5} delay={500} width={120}>
        <span className="text-gray-500">RAYMARCH 80s</span>
      </PaperLabel>

      <UIFragment x="7%" y="28%" width={105} height={72} rotate={-3} delay={0} variant={0} />
      <UIFragment x="76%" y="32%" width={95} height={62} rotate={2} delay={200} variant={1} />
      <UIFragment x="9%" y="58%" width={85} height={58} rotate={1} delay={400} variant={2} />
      <UIFragment x="78%" y="60%" width={100} height={68} rotate={-2} delay={300} variant={0} />
      <UIFragment x="40%" y="82%" width={90} height={50} rotate={0.5} delay={500} variant={1} />

      <SidePanel side="left" delay={0} />
      <SidePanel side="right" delay={200} />

      <IconToolbar side="left" delay={100} />
      <IconToolbar side="right" delay={300} />

      <GeometricAnnotation x="28%" y="20%" width={130} height={90} label="DETAIL A · QINGHUA FLORAL · 1:1" delay={0} />
      <GeometricAnnotation x="56%" y="66%" width={110} height={75} label="SECTION B-B · SSS PASS" delay={200} />
      <GeometricAnnotation x="50%" y="38%" width={80} height={60} label="TRAP MAP" delay={400} />

      <DotPattern x="4%" y="44%" cols={4} rows={6} />
      <DotPattern x="93%" y="48%" cols={3} rows={5} />
      <DotPattern x="45%" y="4%" cols={8} rows={2} />

      <RegistrationMark x="2.5%" y="2.5%" />
      <RegistrationMark x="95.5%" y="2.5%" />
      <RegistrationMark x="2.5%" y="95.5%" />
      <RegistrationMark x="95.5%" y="95.5%" />

      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          bottom: 22, left: 22,
          opacity: loaded ? 1 : 0,
          transitionDelay: '400ms',
        }}
      >
        <div style={{ fontSize: '6.5px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', lineHeight: 1.8 }}>
          <div>OFFLINE ARCHIVE SERIES</div>
          <div>DOC: QH-2026-MB001</div>
          <div>REV: 03 // CLASS: RESTRICTED</div>
          <div>TEXTURE: QINGHUA FLORAL + VORONOI</div>
        </div>
      </div>

      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          bottom: 22, right: 22, textAlign: 'right',
          opacity: loaded ? 1 : 0,
          transitionDelay: '500ms',
        }}
      >
        <div style={{ fontSize: '6.5px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', lineHeight: 1.8 }}>
          <div>CHENGDU · CN // 蜀</div>
          <div>LAT: 30.5728° N</div>
          <div>LON: 104.0668° E</div>
          <div>ELEV: 500m // BASIN</div>
        </div>
      </div>

      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          top: 22, right: 22, textAlign: 'right',
          opacity: loaded ? 1 : 0,
          transitionDelay: '300ms',
        }}
      >
        <div style={{ fontSize: '6.5px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', lineHeight: 1.8 }}>
          <div>PORCELAIN DESIGN LAB</div>
          <div>RENDER: REAL-TIME WEBGL</div>
          <div>SHADER: RAYMARCH + SSS</div>
          <div>GRAY MIX: 35%</div>
        </div>
      </div>

      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          top: 22, left: 22,
          opacity: loaded ? 1 : 0,
          transitionDelay: '350ms',
        }}
      >
        <div style={{ fontSize: '6.5px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa', lineHeight: 1.8 }}>
          <div>■ MANDELBOX FRACTAL</div>
          <div>■ QINGHUA TEXTURE</div>
          <div>■ VORONOI EDGE MAP</div>
          <div>■ SUBSURFACE SCATTER</div>
        </div>
      </div>

      <ScaleBar />
      <CompassRose />
      <CrosshairCenter />
      <LayerStack />

      <ChengduWatermark />
      <ChengduSeal />

      <svg className="absolute pointer-events-none" style={{ left: '6%', top: '88%' }} width="16" height="16" viewBox="0 0 16 16">
        <rect x="0" y="0" width="16" height="16" fill="none" stroke="#ccc" strokeWidth="0.3" />
        <line x1="0" y1="8" x2="16" y2="8" stroke="#ccc" strokeWidth="0.2" />
        <line x1="8" y1="0" x2="8" y2="16" stroke="#ccc" strokeWidth="0.2" />
      </svg>

      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '55%', height: '60%',
          border: '0.5px solid rgba(0,0,0,0.03)',
          zIndex: 1,
        }}
      />
    </div>
  )
}
