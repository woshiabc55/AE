import MandelboxCanvas from '@/components/MandelboxCanvas'
import PosterOverlay from '@/components/PosterOverlay'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <MandelboxCanvas />
      <PosterOverlay />
      <Link
        to="/concept-art"
        className="absolute pointer-events-auto transition-all hover:bg-gray-800"
        style={{
          bottom: 24,
          right: 24,
          zIndex: 30,
          padding: '8px 16px',
          background: 'rgba(26, 26, 26, 0.85)',
          color: '#fff',
          fontSize: '9px',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.1em',
          border: '1px solid rgba(255,255,255,0.1)',
          textDecoration: 'none',
        }}
      >
        影视化概念图工具 →
      </Link>
    </div>
  )
}
