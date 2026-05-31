import { useWindowStore } from '@/stores/useWindowStore'
import { Hexagon } from 'lucide-react'

interface StartButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function StartButton({ onClick, isOpen }: StartButtonProps) {
  return (
    <button
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200
        ${isOpen
          ? 'bg-blue-500/30 shadow-lg shadow-blue-500/20 scale-95'
          : 'bg-white/5 hover:bg-white/15 hover:scale-105'
        }`}
      onClick={onClick}
    >
      <Hexagon
        size={22}
        className={`transition-colors duration-200 ${isOpen ? 'text-blue-400' : 'text-white/70'}`}
      />
    </button>
  )
}
