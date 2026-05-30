import { useEffect, useState } from 'react'

function CornerBracket({ position, size = 24 }: { position: 'tl' | 'tr' | 'bl' | 'br'; size?: number }) {
  const transforms: Record<string, string> = {
    tl: '',
    tr: 'scaleX(-1)',
    bl: 'scaleY(-1)',
    br: 'scale(-1)',
  }
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: transforms[position] }}
      className="absolute pointer-events-none"
      {...getPositionProps(position)}
    >
      <path d={`M0,${size} L0,0 L${size},0`} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="2" fill="#1a1a1a" />
    </svg>
  )
}

function getPositionProps(position: string) {
  switch (position) {
    case 'tl': return { style: { top: 16, left: 16 } }
    case 'tr': return { style: { top: 16, right: 16 } }
    case 'bl': return { style: { bottom: 16, left: 16 } }
    case 'br': return { style: { bottom: 16, right: 16 } }
    default: return {}
  }
}

function PaperLabel({ children, x, y, rotate = 0, delay = 0 }: {
  children: React.ReactNode; x: string; y: string; rotate?: number; delay?: number
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
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        opacity: visible ? 1 : 0,
        transformOrigin: 'center',
      }}
    >
      <div className="bg-white/90 border border-gray-300 px-3 py-1.5 shadow-sm backdrop-blur-sm"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.05em' }}>
        {children}
      </div>
    </div>
  )
}

function UIFragment({ x, y, width, height, rotate = 0, delay = 0 }: {
  x: string; y: string; width: number; height: number; rotate?: number; delay?: number
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
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotate}deg)`,
        opacity: visible ? 0.85 : 0,
      }}
    >
      <div className="w-full h-full bg-white/80 border border-gray-200 shadow-sm backdrop-blur-sm p-2">
        <div className="flex gap-1 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-gray-200 rounded-full" style={{ width: '70%' }} />
          <div className="h-1 bg-gray-300 rounded-full" style={{ width: '45%' }} />
          <div className="h-1 bg-gray-200 rounded-full" style={{ width: '60%' }} />
        </div>
        <div className="mt-2 flex gap-1">
          <div className="h-4 flex-1 bg-gray-100 border border-gray-200 rounded-sm" />
          <div className="h-4 w-8 bg-gray-300 rounded-sm" />
        </div>
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

  const items = side === 'left'
    ? ['FRACTAL.DEF', 'SCALE: 2.0', 'ITER: 10', 'DE: 0.002', 'AO: 4s', 'FOLD: BOX']
    : ['PATTERN: QH', 'COLOR: BW', 'DEPTH: 64', 'RES: NATIVE', 'MODE: RM', 'STATUS: OK']

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700"
      style={{
        [side]: 20,
        opacity: visible ? 1 : 0,
        transform: `translateY(-50%) translateX(${visible ? 0 : (side === 'left' ? -20 : 20)}px)`,
      }}
    >
      <div className="bg-white/85 border border-gray-200 shadow-sm backdrop-blur-sm px-2 py-3"
        style={{ width: 56 }}>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-gray-400 mb-0.5" style={{ fontSize: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                {item.split(':')[0]}
              </div>
              {item.includes(':') ? (
                <div className="text-gray-700 font-medium" style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.split(':')[1]}
                </div>
              ) : (
                <div className="w-3 h-3 mx-auto border border-gray-300 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
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

  const offset = side === 'left' ? 84 : -76

  return (
    <div
      className="absolute top-1/2 pointer-events-none transition-all duration-700"
      style={{
        [side]: offset,
        opacity: visible ? 1 : 0,
        transform: `translateY(-50%)`,
      }}
    >
      <div className="flex flex-col gap-2 items-center">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-5 h-5 border border-gray-300 bg-white/70 flex items-center justify-center">
            <div className="w-2 h-0.5 bg-gray-400" style={{ transform: `rotate(${i * 22.5}deg)` }} />
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
      style={{
        left: x,
        top: y,
        width,
        height,
        opacity: visible ? 0.7 : 0,
      }}
    >
      <svg width={width} height={height} className="absolute inset-0">
        <rect x="0" y="0" width={width} height={height} fill="none" stroke="#1a1a1a" strokeWidth="0.5" strokeDasharray="4 2" />
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#1a1a1a" strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1a1a1a" strokeWidth="0.3" strokeDasharray="2 2" />
      </svg>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#666' }}>
        {label}
      </div>
    </div>
  )
}

function DotPattern({ x, y, cols, rows }: { x: string; y: string; cols: number; rows: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {[...Array(cols * rows)].map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gray-400/50" />
        ))}
      </div>
    </div>
  )
}

function ThinBorder() {
  return (
    <div className="absolute inset-8 pointer-events-none">
      <div className="w-full h-full border border-gray-300/40" />
    </div>
  )
}

function RegistrationMark({ x, y }: { x: string; y: string }) {
  return (
    <svg className="absolute pointer-events-none" style={{ left: x, top: y }} width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" fill="none" stroke="#999" strokeWidth="0.5" />
      <line x1="8" y1="0" x2="8" y2="16" stroke="#999" strokeWidth="0.3" />
      <line x1="0" y1="8" x2="16" y2="8" stroke="#999" strokeWidth="0.3" />
      <circle cx="8" cy="8" r="2" fill="#999" />
    </svg>
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

      <CornerBracket position="tl" size={28} />
      <CornerBracket position="tr" size={28} />
      <CornerBracket position="bl" size={28} />
      <CornerBracket position="br" size={28} />

      <ThinBorder />

      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: loaded ? 1 : 0,
        }}
      >
        <h1 className="text-center tracking-widest"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: '0.15em',
            lineHeight: 1.1,
          }}>
          瓷器设计
        </h1>
      </div>

      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: loaded ? 1 : 0,
          transitionDelay: '200ms',
        }}
      >
        <h2 className="text-center tracking-widest"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 'clamp(20px, 3vw, 40px)',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '0.2em',
            lineHeight: 1.1,
          }}>
          青 花 瓷
        </h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px bg-gray-400" style={{ width: 40 }} />
          <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#888', letterSpacing: '0.1em' }}>
            BLUE & WHITE PORCELAIN
          </span>
          <div className="h-px bg-gray-400" style={{ width: 40 }} />
        </div>
      </div>

      <PaperLabel x="12%" y="18%" rotate={-2} delay={0}>
        <span className="text-gray-600">MANDELBOX // SCALE 2.0</span>
      </PaperLabel>

      <PaperLabel x="72%" y="15%" rotate={1.5} delay={200}>
        <span className="text-gray-600">FRACTAL SURFACE</span>
      </PaperLabel>

      <PaperLabel x="15%" y="75%" rotate={-1} delay={400}>
        <span className="text-gray-600">QINGHUA PATTERN v2.4</span>
      </PaperLabel>

      <PaperLabel x="68%" y="78%" rotate={2} delay={300}>
        <span className="text-gray-600">OFFLINE ARCHIVE // 2026</span>
      </PaperLabel>

      <UIFragment x="8%" y="30%" width={100} height={70} rotate={-3} delay={0} />
      <UIFragment x="78%" y="35%" width={90} height={60} rotate={2} delay={200} />
      <UIFragment x="10%" y="60%" width={80} height={55} rotate={1} delay={400} />
      <UIFragment x="80%" y="62%" width={95} height={65} rotate={-2} delay={300} />

      <SidePanel side="left" delay={0} />
      <SidePanel side="right" delay={200} />

      <IconToolbar side="left" delay={100} />
      <IconToolbar side="right" delay={300} />

      <GeometricAnnotation x="30%" y="22%" width={120} height={80} label="DETAIL A · SCALE 1:1" delay={0} />
      <GeometricAnnotation x="58%" y="68%" width={100} height={70} label="SECTION B-B" delay={200} />

      <DotPattern x="5%" y="45%" cols={3} rows={5} />
      <DotPattern x="92%" y="50%" cols={3} rows={4} />

      <RegistrationMark x="3%" y="3%" />
      <RegistrationMark x="95%" y="3%" />
      <RegistrationMark x="3%" y="95%" />
      <RegistrationMark x="95%" y="95%" />

      <div className="absolute pointer-events-none" style={{ bottom: 24, left: 24 }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#999', lineHeight: 1.6 }}>
          <div>OFFLINE ARCHIVE SERIES</div>
          <div>DOC: QH-2026-MB001</div>
          <div>REV: 03 // CLASS: RESTRICTED</div>
        </div>
      </div>

      <div className="absolute pointer-events-none" style={{ bottom: 24, right: 24, textAlign: 'right' }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#999', lineHeight: 1.6 }}>
          <div>CHENGDU · CN</div>
          <div>LAT: 30.5728° N</div>
          <div>LON: 104.0668° E</div>
        </div>
      </div>

      <div className="absolute pointer-events-none" style={{ top: 24, right: 24 }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#999', lineHeight: 1.6, textAlign: 'right' }}>
          <div>PORCELAIN DESIGN LAB</div>
          <div>RENDER: REAL-TIME</div>
          <div>ENGINE: WEBGL2</div>
        </div>
      </div>

      <div className="absolute pointer-events-none" style={{ top: 24, left: 24 }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#999', lineHeight: 1.6 }}>
          <div>■ MANDELBOX FRACTAL</div>
          <div>■ QINGHUA TEXTURE</div>
          <div>■ RAYMARCHED</div>
        </div>
      </div>

      <svg className="absolute pointer-events-none" style={{ left: '20%', top: '85%' }} width="200" height="20">
        <line x1="0" y1="10" x2="200" y2="10" stroke="#ccc" strokeWidth="0.5" />
        <line x1="0" y1="7" x2="0" y2="13" stroke="#999" strokeWidth="0.5" />
        <line x1="100" y1="7" x2="100" y2="13" stroke="#999" strokeWidth="0.5" />
        <line x1="200" y1="7" x2="200" y2="13" stroke="#999" strokeWidth="0.5" />
        <text x="0" y="5" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#999' }}>0</text>
        <text x="95" y="5" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#999' }}>50</text>
        <text x="192" y="5" style={{ fontSize: '5px', fontFamily: "'JetBrains Mono', monospace", fill: '#999' }}>100</text>
      </svg>

      <svg className="absolute pointer-events-none" style={{ right: '20%', top: '10%' }} width="60" height="60">
        <circle cx="30" cy="30" r="25" fill="none" stroke="#ddd" strokeWidth="0.5" />
        <circle cx="30" cy="30" r="18" fill="none" stroke="#ddd" strokeWidth="0.3" />
        <circle cx="30" cy="30" r="11" fill="none" stroke="#ddd" strokeWidth="0.3" />
        <line x1="30" y1="2" x2="30" y2="58" stroke="#ddd" strokeWidth="0.3" />
        <line x1="2" y1="30" x2="58" y2="30" stroke="#ddd" strokeWidth="0.3" />
      </svg>

      <div className="absolute pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          <rect x="0" y="0" width="300" height="300" fill="none" stroke="none" />
          <line x1="150" y1="0" x2="150" y2="300" stroke="#ccc" strokeWidth="0.3" strokeDasharray="4 4" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#ccc" strokeWidth="0.3" strokeDasharray="4 4" />
          <circle cx="150" cy="150" r="80" fill="none" stroke="#ddd" strokeWidth="0.3" strokeDasharray="3 3" />
          <circle cx="150" cy="150" r="120" fill="none" stroke="#eee" strokeWidth="0.2" strokeDasharray="2 4" />
        </svg>
      </div>
    </div>
  )
}
