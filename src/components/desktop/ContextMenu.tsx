import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ContextMenuItem } from '@/types'

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const adjustedX = Math.min(x, window.innerWidth - 220)
  const adjustedY = Math.min(y, window.innerHeight - 350)

  return (
    <motion.div
      ref={menuRef}
      className="fixed z-[9999] min-w-[200px] py-1.5 rounded-xl border border-white/[0.08]
        bg-[#0a0a14]/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{ left: adjustedX, top: adjustedY }}
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.12, ease: [0.32, 0.72, 0, 1] }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.separator && <div className="my-1 h-px bg-white/[0.06] mx-2" />}
          <button
            className="w-full px-3 py-1.5 text-left text-[13px] text-white/70
              hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-2.5"
            onClick={() => {
              item.action()
              onClose()
            }}
          >
            {item.icon && <span className="text-white/40 text-xs w-5 text-center">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        </div>
      ))}
    </motion.div>
  )
}

export function useContextMenu() {
  const [menuState, setMenuState] = useState<{
    x: number
    y: number
    items: ContextMenuItem[]
  } | null>(null)

  const showContextMenu = useCallback(
    (e: React.MouseEvent, items: ContextMenuItem[]) => {
      e.preventDefault()
      setMenuState({ x: e.clientX, y: e.clientY, items })
    },
    []
  )

  const hideContextMenu = useCallback(() => {
    setMenuState(null)
  }, [])

  return { menuState, showContextMenu, hideContextMenu }
}
