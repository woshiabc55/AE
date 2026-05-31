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
          <button
            key={win.id}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150
              ${isActive
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
              }
              ${win.isMinimized ? 'opacity-50' : ''}`}
            onClick={() => toggleMinimize(win.id)}
            title={win.title}
          >
            {IconComponent && <IconComponent size={20} />}
            {isActive && (
              <div className="absolute bottom-0.5 w-4 h-0.5 rounded-full bg-blue-400" />
            )}
            {!isActive && !win.isMinimized && (
              <div className="absolute bottom-0.5 w-2 h-0.5 rounded-full bg-white/30" />
            )}
          </button>
        )
      })}
    </div>
  )
}
