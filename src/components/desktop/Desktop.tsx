import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallpaper } from './Wallpaper'
import { DesktopIcon } from './DesktopIcon'
import { ContextMenu, useContextMenu } from './ContextMenu'
import { DESKTOP_ICONS, WALLPAPERS } from '@/utils/apps'
import { useWindowStore } from '@/stores/useWindowStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useUploadStore } from '@/stores/useUploadStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { Upload, CloudUpload } from 'lucide-react'
import type { ContextMenuItem } from '@/types'

export function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const wallpaper = useSettingsStore((s) => s.settings.wallpaper)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const addFile = useUploadStore((s) => s.addFile)
  const isDragOver = useUploadStore((s) => s.isDragOver)
  const setDragOver = useUploadStore((s) => s.setDragOver)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { menuState, showContextMenu, hideContextMenu } = useContextMenu()

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        const uploadedFile = {
          id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: URL.createObjectURL(file),
          uploadedAt: Date.now(),
        }
        addFile(uploadedFile)
      })

      if (files.length > 0) {
        addNotification({
          title: '文件上传完成',
          content: `已成功上传 ${files.length} 个文件: ${files.map((f) => f.name).join(', ')}`,
        })
      }
    },
    [addFile, setDragOver, addNotification]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(true)
    },
    [setDragOver]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.currentTarget === e.target) {
        setDragOver(false)
      }
    },
    [setDragOver]
  )

  const handleDesktopContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const items: ContextMenuItem[] = [
        { label: '🔄 刷新桌面', icon: '🔄', action: () => {} },
        { label: '🖼️ 更换壁纸', icon: '🖼️', action: () => {
          const currentIdx = WALLPAPERS.indexOf(wallpaper)
          const nextIdx = (currentIdx + 1) % WALLPAPERS.length
          updateSettings({ wallpaper: WALLPAPERS[nextIdx] })
        }, separator: true },
        { label: '📁 新建文件夹', icon: '📁', action: () => {} },
        { label: '📤 上传文件', icon: '📤', action: () => {
          const input = document.createElement('input')
          input.type = 'file'
          input.multiple = true
          input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || [])
            files.forEach((file) => {
              addFile({
                id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                url: URL.createObjectURL(file),
                uploadedAt: Date.now(),
              })
            })
            if (files.length > 0) {
              addNotification({
                title: '文件上传完成',
                content: `已上传 ${files.length} 个文件`,
              })
            }
          }
          input.click()
        }},
        { label: '↕️ 排序方式', icon: '↕️', action: () => {}, separator: true },
        { label: '🖥️ 显示设置', icon: '🖥️', action: () => openWindow('system-settings') },
      ]
      showContextMenu(e, items)
    },
    [showContextMenu, wallpaper, updateSettings, openWindow, addFile, addNotification]
  )

  return (
    <div
      className="absolute inset-0 pb-16"
      onContextMenu={handleDesktopContextMenu}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Wallpaper gradient={wallpaper} />

      <div className="absolute inset-0 p-4 pt-4">
        <div className="flex flex-col flex-wrap gap-1 h-[calc(100%-16px)] content-start">
          {DESKTOP_ICONS.map((item) => (
            <DesktopIcon
              key={item.id}
              item={item}
              onDoubleClick={openWindow}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isDragOver && (
          <motion.div
            className="absolute inset-0 z-[8000] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-[400px] h-[250px] rounded-3xl border-2 border-dashed border-blue-400/40
              bg-blue-500/[0.06] backdrop-blur-xl flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-400/10 flex items-center justify-center">
                <CloudUpload size={32} className="text-blue-400/60" />
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-300/80 font-medium">拖放文件到此处上传</p>
                <p className="text-xs text-white/30 mt-1">支持任意文件类型</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {menuState && (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          items={menuState.items}
          onClose={hideContextMenu}
        />
      )}
    </div>
  )
}
