import { useState, useCallback, useEffect, useRef } from 'react'
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

  const adjustedX = Math.min(x, window.innerWidth - 200)
  const adjustedY = Math.min(y, window.innerHeight - 300)

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[180px] py-1.5 rounded-xl border border-white/10
        bg-black/70 backdrop-blur-2xl shadow-2xl"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.separator && <div className="my-1 h-px bg-white/10" />}
          <button
            className="w-full px-3 py-1.5 text-left text-[13px] text-white/80
              hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
            onClick={() => {
              item.action()
              onClose()
            }}
          >
            {item.icon && <span className="text-white/50 text-xs">{item.icon}</span>}
            {item.label}
          </button>
        </div>
      ))}
    </div>
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
