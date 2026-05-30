import { useState, useEffect } from 'react'
import { useConceptArtStore } from '@/store/conceptArtStore'

const STYLE_LABELS: Record<string, string> = {
  noir: 'NOIR',
  cyberpunk: 'CYBERPUNK',
  fantasy: 'FANTASY',
  wasteland: 'WASTELAND',
  ocean: 'DEEP OCEAN',
  forest: 'DARK FOREST',
  space: 'COSMOS',
  ancient: 'ANCIENT RUINS',
}

const MOOD_LABELS: Record<string, string> = {
  dramatic: 'DRAMATIC',
  serene: 'SERENE',
  mysterious: 'MYSTERIOUS',
  melancholic: 'MELANCHOLIC',
  epic: 'EPIC',
  eerie: 'EERIE',
}

export default function ConceptOverlay() {
  const scene = useConceptArtStore((s) => s.scene)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  const styleLabel = STYLE_LABELS[scene.style] || 'UNKNOWN'
  const moodLabel = MOOD_LABELS[scene.mood] || 'UNKNOWN'

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      <svg className="absolute" style={{ top: 20, left: 20 }} width="24" height="24">
        <path d="M0,24 L0,0 L24,0" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      </svg>
      <svg className="absolute" style={{ top: 20, right: 280 }} width="24" height="24">
        <path d="M24,0 L24,24 L0,24" fill="none" stroke="#1a1a1a" strokeWidth="1" transform="scaleX(-1) translate(-24,0)" />
        <path d="M0,0 L24,0 L24,24" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      </svg>
      <svg className="absolute" style={{ bottom: 20, left: 20 }} width="24" height="24">
        <path d="M0,0 L0,24 L24,24" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      </svg>
      <svg className="absolute" style={{ bottom: 20, right: 280 }} width="24" height="24">
        <path d="M24,24 L24,0 L0,0" fill="none" stroke="#1a1a1a" strokeWidth="1" />
      </svg>

      <div className="absolute" style={{ top: 28, left: 32 }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#666', lineHeight: 1.8 }}>
          <div>CINEMATIC CONCEPT</div>
          <div>STYLE: {styleLabel}</div>
          <div>MOOD: {moodLabel}</div>
        </div>
      </div>

      <div className="absolute" style={{ bottom: 28, left: 32 }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#666', lineHeight: 1.8 }}>
          <div>FRAME {String(Math.floor(scene.timeOfDay * 24)).padStart(2, '0')}:{String(Math.floor((scene.timeOfDay * 24 % 1) * 60)).padStart(2, '0')}</div>
          <div>FOG: {(scene.fogDensity * 100).toFixed(0)}% | GRAIN: {(scene.grainAmount * 100).toFixed(0)}%</div>
          <div>CONCEPT ART TOOL v1.0</div>
        </div>
      </div>

      <div className="absolute" style={{ bottom: 28, right: 292, textAlign: 'right' }}>
        <div style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#666', lineHeight: 1.8 }}>
          <div>COLOR: {(scene.colorIntensity * 100).toFixed(0)}%</div>
          <div>VIGNETTE: {(scene.vignetteStrength * 100).toFixed(0)}%</div>
          <div>DOF: {(scene.depthOfField * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="absolute" style={{ top: '50%', left: 32, transform: 'translateY(-50%)' }}>
        <div
          className="writing-vertical"
          style={{
            fontSize: '9px',
            fontFamily: "'Noto Serif SC', serif",
            color: '#999',
            letterSpacing: '0.3em',
            writingMode: 'vertical-rl',
          }}
        >
          影视概念图
        </div>
      </div>

      <svg className="absolute" style={{ top: 28, right: 292 }} width="40" height="40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#ccc" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#ddd" strokeWidth="0.3" />
        <line x1="20" y1="2" x2="20" y2="38" stroke="#ddd" strokeWidth="0.3" />
        <line x1="2" y1="20" x2="38" y2="20" stroke="#ddd" strokeWidth="0.3" />
      </svg>

      <svg className="absolute" style={{ left: 32, bottom: 80 }} width="120" height="12">
        <line x1="0" y1="6" x2="120" y2="6" stroke="#ccc" strokeWidth="0.5" />
        <line x1="0" y1="3" x2="0" y2="9" stroke="#999" strokeWidth="0.5" />
        <line x1="60" y1="3" x2="60" y2="9" stroke="#999" strokeWidth="0.5" />
        <line x1="120" y1="3" x2="120" y2="9" stroke="#999" strokeWidth="0.5" />
      </svg>

      <div className="absolute" style={{ top: 28, left: '50%', transform: 'translateX(-50%)' }}>
        <div
          className="text-center tracking-widest"
          style={{
            fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#888',
            letterSpacing: '0.2em',
          }}
        >
          CINEMATIC CONCEPT ART
        </div>
      </div>
    </div>
  )
}
