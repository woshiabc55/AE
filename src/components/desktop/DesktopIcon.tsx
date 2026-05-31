import { useState } from 'react'
import { motion } from 'framer-motion'
import { ICON_MAP } from '@/utils/apps'
import type { DesktopIconItem } from '@/types'

interface DesktopIconProps {
  item: DesktopIconItem
  onDoubleClick: (appId: string) => void
}

export function DesktopIcon({ item, onDoubleClick }: DesktopIconProps) {
  const IconComponent = ICON_MAP[item.icon]
  const [isSelected, setIsSelected] = useState(false)

  return (
    <motion.div
      className={`flex flex-col items-center justify-center w-[76px] h-[84px] rounded-xl cursor-pointer
        select-none group relative`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation()
        setIsSelected(!isSelected)
      }}
      onDoubleClick={() => onDoubleClick(item.appId)}
    >
      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-blue-400/10 border border-blue-400/20" />
      )}

      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200
        ${isSelected
          ? 'bg-blue-400/15 shadow-lg shadow-blue-500/10'
          : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
        }`}>
        {IconComponent && (
          <IconComponent
            size={26}
            className={`transition-colors duration-200
              ${isSelected ? 'text-blue-300' : 'text-white/80 group-hover:text-white'}`}
          />
        )}
      </div>
      <span className={`mt-1.5 text-[11px] text-center leading-tight max-w-[72px] truncate
        drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-colors duration-200
        ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
        {item.label}
      </span>
    </motion.div>
  )
}
