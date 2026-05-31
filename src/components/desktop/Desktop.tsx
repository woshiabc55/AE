import { useCallback } from 'react'
import { Wallpaper } from './Wallpaper'
import { DesktopIcon } from './DesktopIcon'
import { ContextMenu, useContextMenu } from './ContextMenu'
import { DESKTOP_ICONS, WALLPAPERS } from '@/utils/apps'
import { useWindowStore } from '@/stores/useWindowStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { RefreshCw, Image, Monitor, FolderPlus, ArrowUpDown } from 'lucide-react'
import type { ContextMenuItem } from '@/types'

export function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const wallpaper = useSettingsStore((s) => s.settings.wallpaper)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const { menuState, showContextMenu, hideContextMenu } = useContextMenu()

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
        { label: '↕️ 排序方式', icon: '↕️', action: () => {}, separator: true },
        { label: '🖥️ 显示设置', icon: '🖥️', action: () => openWindow('system-settings') },
      ]
      showContextMenu(e, items)
    },
    [showContextMenu, wallpaper, updateSettings, openWindow]
  )

  return (
    <div
      className="absolute inset-0 pb-16"
      onContextMenu={handleDesktopContextMenu}
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
