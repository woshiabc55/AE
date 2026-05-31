import { useState } from 'react'
import { MOCK_FILE_SYSTEM, ICON_MAP } from '@/utils/apps'
import type { FileItem } from '@/types'
import { Folder, ChevronRight, LayoutGrid, List, HardDrive } from 'lucide-react'

export function FileManager() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const getCurrentItems = (): FileItem[] => {
    let items = MOCK_FILE_SYSTEM
    for (const dir of currentPath) {
      const found = items.find((i) => i.name === dir && i.type === 'folder')
      if (found?.children) {
        items = found.children
      } else {
        break
      }
    }
    return items
  }

  const items = getCurrentItems()

  const navigateTo = (name: string) => {
    setCurrentPath([...currentPath, name])
  }

  const navigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const quickLinks = [
    { label: '主目录', icon: HardDrive, path: [] },
    { label: '文档', icon: Folder, path: ['文档'] },
    { label: '下载', icon: Folder, path: ['下载'] },
    { label: '图片', icon: Folder, path: ['图片'] },
  ]

  return (
    <div className="flex h-full">
      <div className="w-44 shrink-0 border-r border-white/[0.06] py-2 px-1.5">
        <div className="text-[10px] text-white/30 uppercase tracking-wider px-2 mb-1">
          快速访问
        </div>
        {quickLinks.map((link) => {
          const LinkIcon = link.icon
          return (
            <button
              key={link.label}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors
                ${JSON.stringify(currentPath) === JSON.stringify(link.path)
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
                }`}
              onClick={() => setCurrentPath(link.path)}
            >
              <LinkIcon size={14} />
              {link.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/50 flex-1 min-w-0">
            <button
              className="hover:text-white/70 transition-colors"
              onClick={() => setCurrentPath([])}
            >
              主目录
            </button>
            {currentPath.map((dir, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={10} className="text-white/20" />
                <button
                  className="hover:text-white/70 transition-colors"
                  onClick={() => navigateUp(i)}
                >
                  {dir}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
            <button
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {viewMode === 'list' ? (
            <div className="space-y-0.5">
              <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1 text-[10px] text-white/25 uppercase tracking-wider">
                <span>名称</span>
                <span>大小</span>
                <span>修改时间</span>
              </div>
              {items.map((item) => {
                const ItemIcon = ICON_MAP[item.icon]
                return (
                  <div
                    key={item.name}
                    className={`grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1.5 rounded-lg
                      text-xs hover:bg-white/[0.04] transition-colors cursor-pointer
                      ${item.type === 'folder' ? 'text-white/70' : 'text-white/50'}`}
                    onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ItemIcon && <ItemIcon size={14} className="shrink-0 text-blue-400/70" />}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="text-white/30">{item.size || '--'}</span>
                    <span className="text-white/30">{item.modified || '--'}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {items.map((item) => {
                const ItemIcon = ICON_MAP[item.icon]
                return (
                  <div
                    key={item.name}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                      hover:bg-white/[0.04] transition-colors cursor-pointer"
                    onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                  >
                    {ItemIcon && <ItemIcon size={28} className="text-blue-400/70" />}
                    <span className="text-[11px] text-white/60 text-center truncate w-full">
                      {item.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
