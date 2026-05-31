import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from './SearchBar'
import { AppGrid } from './AppGrid'
import { APP_DEFINITIONS } from '@/utils/apps'
import { useWindowStore } from '@/stores/useWindowStore'
import { X } from 'lucide-react'

interface AppLauncherProps {
  onClose: () => void
}

export function AppLauncher({ onClose }: AppLauncherProps) {
  const [search, setSearch] = useState('')
  const openWindow = useWindowStore((s) => s.openWindow)

  const filteredApps = APP_DEFINITIONS.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleLaunch = (appId: string) => {
    openWindow(appId)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9500] flex flex-col items-center pt-[12vh]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-3xl"
          onClick={onClose}
        />

        <div className="relative z-10 flex flex-col items-center gap-8 w-full px-6">
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10
              text-white/40 hover:text-white/70 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-light text-white/90 tracking-wide">
              ConceptOS
            </h1>
            <p className="text-sm text-white/30 mt-1">应用启动器</p>
          </div>

          <SearchBar value={search} onChange={setSearch} />

          <AppGrid apps={filteredApps} onLaunch={handleLaunch} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
