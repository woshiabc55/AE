import { useWindowStore } from '@/stores/useWindowStore'
import { Minus, Square, X } from 'lucide-react'
import { ICON_MAP } from '@/utils/apps'

interface WindowTitleBarProps {
  windowId: string
  title: string
  icon: string
  isMaximized: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

export function WindowTitleBar({
  windowId,
  title,
  icon,
  isMaximized,
  onMouseDown,
  onMinimize,
  onMaximize,
  onClose,
}: WindowTitleBarProps) {
  const activeWindowId = useWindowStore((s) => s.activeWindowId)
  const isActive = windowId === activeWindowId
  const IconComponent = ICON_MAP[icon]

  return (
    <div
      className={`flex items-center h-9 px-3 rounded-t-xl select-none shrink-0
        ${isActive ? 'bg-white/[0.06]' : 'bg-white/[0.03]'}`}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {IconComponent && (
          <IconComponent size={14} className={`shrink-0 ${isActive ? 'text-white/70' : 'text-white/40'}`} />
        )}
        <span className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-white/40'}`}>
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <button
          className="w-6 h-6 rounded-md flex items-center justify-center
            hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onMinimize()
          }}
        >
          <Minus size={12} />
        </button>
        <button
          className="w-6 h-6 rounded-md flex items-center justify-center
            hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onMaximize()
          }}
        >
          <Square size={10} />
        </button>
        <button
          className="w-6 h-6 rounded-md flex items-center justify-center
            hover:bg-red-500/80 text-white/40 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
