import { motion } from 'framer-motion'
import { useWindowStore } from '@/stores/useWindowStore'
import { ICON_MAP } from '@/utils/apps'

export function RunningApps() {
  const windows = useWindowStore((s) => s.windows)
  const activeWindowId = useWindowStore((s) => s.activeWindowId)
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize)

  if (windows.length === 0) return null

  return (
    <div className="flex items-center gap-1 px-1">
      {windows.map((win) => {
        const IconComponent = ICON_MAP[win.icon]
        const isActive = win.id === activeWindowId && !win.isMinimized

        return (
          <motion.button
            key={win.id}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150
              ${isActive
                ? 'bg-white/[0.12] text-white'
                : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
              }
              ${win.isMinimized ? 'opacity-40' : ''}`}
            onClick={() => toggleMinimize(win.id)}
            title={win.title}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {IconComponent && <IconComponent size={18} />}
            {isActive && (
              <motion.div
                className="absolute bottom-0.5 w-4 h-[2px] rounded-full bg-blue-400"
                layoutId="active-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            {!isActive && !win.isMinimized && (
              <div className="absolute bottom-0.5 w-1.5 h-[2px] rounded-full bg-white/20" />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
