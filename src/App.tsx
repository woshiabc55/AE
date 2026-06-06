import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TopBar } from './components/layout/TopBar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { Favorites } from './pages/Favorites'
import { Compare } from './pages/Compare'
import { DetailDrawer } from './components/detail/DetailDrawer'
import { useLibraryStore } from './store/useLibraryStore'

export default function App() {
  const openDetailId = useLibraryStore((s) => s.openDetailId)
  const openDetail = useLibraryStore((s) => s.openDetail)

  return (
    <div className="relative min-h-screen bg-ink text-bone">
      {/* Background layers */}
      <div className="fixed inset-0 bg-noise opacity-50 pointer-events-none" />
      <div className="vignette" />
      <div className="scanline-overlay" />
      <div className="scanline-bar" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {openDetailId && (
          <DetailDrawer id={openDetailId} onClose={() => openDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
