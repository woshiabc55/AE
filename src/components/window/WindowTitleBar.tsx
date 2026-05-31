import { useWindowStore } from '@/stores/useWindowStore'
import { Minus, Square, X, Copy } from 'lucide-react'
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
      className={`flex items-center h-10 px-3 select-none shrink-0
        ${isActive ? 'bg-white/[0.04]' : 'bg-white/[0.02]'}`}
      onMouseDown={onMouseDown}
      onDoubleClick={onMaximize}
    >
      <div className="flex items-center gap-1.5 mr-3">
        <button
          className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center
            group/btn hover:brightness-110 transition-all"
          onClick={(e) => { e.stopPropagation(); onClose() }}
        >
          <X size={7} className="text-transparent group-hover/btn:text-[#4a0002] transition-colors" />
        </button>
        <button
          className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center
            group/btn hover:brightness-110 transition-all"
          onClick={(e) => { e.stopPropagation(); onMinimize() }}
        >
          <Minus size={7} className="text-transparent group-hover/btn:text-[#6a4a00] transition-colors" />
        </button>
        <button
          className="w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center
            group/btn hover:brightness-110 transition-all"
          onClick={(e) => { e.stopPropagation(); onMaximize() }}
        >
          {isMaximized ? (
            <Copy size={6} className="text-transparent group-hover/btn:text-[#0a4a14] transition-colors" />
          ) : (
            <Square size={6} className="text-transparent group-hover/btn:text-[#0a4a14] transition-colors" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
        {IconComponent && (
          <IconComponent size={13} className={`shrink-0 ${isActive ? 'text-white/50' : 'text-white/25'}`} />
        )}
        <span className={`text-[12px] truncate ${isActive ? 'text-white/60' : 'text-white/25'}`}>
          {title}
        </span>
      </div>

      <div className="w-[52px] shrink-0" />
    </div>
  )
}
