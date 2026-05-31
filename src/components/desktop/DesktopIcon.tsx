import { ICON_MAP } from '@/utils/apps'
import type { DesktopIconItem } from '@/types'

interface DesktopIconProps {
  item: DesktopIconItem
  onDoubleClick: (appId: string) => void
}

export function DesktopIcon({ item, onDoubleClick }: DesktopIconProps) {
  const IconComponent = ICON_MAP[item.icon]

  return (
    <div
      className="flex flex-col items-center justify-center w-20 h-20 rounded-xl cursor-pointer
        hover:bg-white/10 transition-all duration-150 select-none group"
      onDoubleClick={() => onDoubleClick(item.appId)}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
        {IconComponent && <IconComponent size={28} className="text-white/90" />}
      </div>
      <span className="mt-1 text-[11px] text-white/80 text-center leading-tight max-w-[72px] truncate drop-shadow-md">
        {item.label}
      </span>
    </div>
  )
}
