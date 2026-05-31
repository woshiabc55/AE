import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WindowTitleBar } from './WindowTitleBar'
import { useWindowStore } from '@/stores/useWindowStore'
import { useDrag } from '@/hooks/useDrag'
import { useResize } from '@/hooks/useResize'
import { APP_DEFINITIONS } from '@/utils/apps'
import { FileManager } from '@/components/apps/FileManager'
import { Terminal } from '@/components/apps/Terminal'
import { TextEditor } from '@/components/apps/TextEditor'
import { SystemSettings } from '@/components/apps/SystemSettings'
import { Calculator } from '@/components/apps/Calculator'
import type { WindowState } from '@/types'

interface WindowProps {
  window: WindowState
}

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  'file-manager': FileManager,
  'terminal': Terminal,
  'text-editor': TextEditor,
  'system-settings': SystemSettings,
  'calculator': Calculator,
}

export function Window({ window: win }: WindowProps) {
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const moveWindow = useWindowStore((s) => s.moveWindow)
  const resizeWindow = useWindowStore((s) => s.resizeWindow)
  const activeWindowId = useWindowStore((s) => s.activeWindowId)

  const appDef = APP_DEFINITIONS.find((a) => a.id === win.appId)
  const isActive = win.id === activeWindowId
  const preMaximizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  const { handleMouseDown: handleDragStart } = useDrag({
    onMove: (delta) => {
      moveWindow(win.id, {
        x: win.position.x + delta.x,
        y: win.position.y + delta.y,
      })
    },
  })

  const { handleMouseDown: handleResizeStart } = useResize({
    onResize: (delta) => {
      const newW = Math.max(appDef?.minSize.width || 300, win.size.width + delta.width)
      const newH = Math.max(appDef?.minSize.height || 200, win.size.height + delta.height)
      resizeWindow(win.id, { width: newW, height: newH })
    },
    minWidth: appDef?.minSize.width,
    minHeight: appDef?.minSize.height,
  })

  const handleMaximize = useCallback(() => {
    if (!win.isMaximized) {
      preMaximizeRef.current = {
        x: win.position.x,
        y: win.position.y,
        w: win.size.width,
        h: win.size.height,
      }
    }
    maximizeWindow(win.id)
  }, [win.isMaximized, win.position, win.size, maximizeWindow, win.id])

  const handleTitleBarDrag = useCallback(
    (e: React.MouseEvent) => {
      if (win.isMaximized) {
        maximizeWindow(win.id)
        if (preMaximizeRef.current) {
          moveWindow(win.id, { x: e.clientX - preMaximizeRef.current.w / 2, y: 0 })
        }
      }
      focusWindow(win.id)
      handleDragStart(e)
    },
    [win.isMaximized, win.id, maximizeWindow, moveWindow, focusWindow, handleDragStart]
  )

  const AppComponent = APP_COMPONENTS[win.appId]

  const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
  const cursorMap: Record<string, string> = {
    n: 'cursor-n-resize',
    s: 'cursor-s-resize',
    e: 'cursor-e-resize',
    w: 'cursor-w-resize',
    ne: 'cursor-ne-resize',
    nw: 'cursor-nw-resize',
    se: 'cursor-se-resize',
    sw: 'cursor-sw-resize',
  }

  if (win.isMinimized) return null

  return (
    <AnimatePresence>
      <motion.div
        className={`absolute flex flex-col rounded-xl overflow-hidden
          ${isActive
            ? 'shadow-2xl shadow-black/40 ring-1 ring-white/[0.08]'
            : 'shadow-xl shadow-black/30 ring-1 ring-white/[0.04]'
          }
          ${win.isMaximized ? 'rounded-none' : ''}`}
        style={
          win.isMaximized
            ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 76px)', zIndex: win.zIndex }
            : {
                left: win.position.x,
                top: win.position.y,
                width: win.size.width,
                height: win.size.height,
                zIndex: win.zIndex,
              }
        }
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
        onMouseDown={() => focusWindow(win.id)}
      >
        <div className="flex flex-col h-full bg-[#0d1117]/90 backdrop-blur-2xl">
          <WindowTitleBar
            windowId={win.id}
            title={win.title}
            icon={win.icon}
            isMaximized={win.isMaximized}
            onMouseDown={handleTitleBarDrag}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={handleMaximize}
            onClose={() => closeWindow(win.id)}
          />

          <div className="flex-1 overflow-auto">
            {AppComponent && <AppComponent />}
          </div>
        </div>

        {!win.isMaximized &&
          resizeHandles.map((dir) => (
            <div
              key={dir}
              className={`absolute ${cursorMap[dir]} z-10
                ${dir === 'n' ? 'top-0 left-2 right-2 h-1' : ''}
                ${dir === 's' ? 'bottom-0 left-2 right-2 h-1' : ''}
                ${dir === 'e' ? 'right-0 top-2 bottom-2 w-1' : ''}
                ${dir === 'w' ? 'left-0 top-2 bottom-2 w-1' : ''}
                ${dir === 'ne' ? 'top-0 right-0 w-3 h-3' : ''}
                ${dir === 'nw' ? 'top-0 left-0 w-3 h-3' : ''}
                ${dir === 'se' ? 'bottom-0 right-0 w-3 h-3' : ''}
                ${dir === 'sw' ? 'bottom-0 left-0 w-3 h-3' : ''}
              `}
              onMouseDown={(e) => handleResizeStart(e, dir)}
            />
          ))}
      </motion.div>
    </AnimatePresence>
  )
}
