import { useState, useCallback, useRef } from 'react'
import { MOCK_FILE_SYSTEM, ICON_MAP } from '@/utils/apps'
import { useUploadStore } from '@/stores/useUploadStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import type { FileItem } from '@/types'
import { Folder, ChevronRight, LayoutGrid, List, HardDrive, Upload, CloudUpload } from 'lucide-react'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function FileManager() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadedFiles = useUploadStore((s) => s.uploadedFiles)
  const addFile = useUploadStore((s) => s.addFile)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const uploadedFileItems: FileItem[] = uploadedFiles.map((f) => ({
    name: f.name,
    type: 'file' as const,
    size: formatFileSize(f.size),
    modified: new Date(f.uploadedAt).toLocaleDateString('zh-CN'),
    icon: 'upload',
    isUploaded: true,
  }))

  const displayItems = currentPath.length === 0 ? [...items, ...uploadedFileItems] : items

  const navigateTo = (name: string) => {
    setCurrentPath([...currentPath, name])
  }

  const navigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
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
          content: `已上传 ${files.length} 个文件到文件管理器`,
        })
      }
      e.target.value = ''
    },
    [addFile, addNotification]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
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
    },
    [addFile, addNotification]
  )

  const quickLinks = [
    { label: '主目录', icon: HardDrive, path: [] },
    { label: '文档', icon: Folder, path: ['文档'] },
    { label: '下载', icon: Folder, path: ['下载'] },
    { label: '图片', icon: Folder, path: ['图片'] },
  ]

  return (
    <div
      className="flex h-full"
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setIsDragOver(false) }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-44 shrink-0 border-r border-white/[0.06] py-2 px-1.5">
        <div className="text-[10px] text-white/25 uppercase tracking-wider px-2 mb-1">
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
                  : 'text-white/45 hover:bg-white/[0.04] hover:text-white/65'
                }`}
              onClick={() => setCurrentPath(link.path)}
            >
              <LinkIcon size={14} />
              {link.label}
            </button>
          )
        })}

        {uploadedFiles.length > 0 && (
          <>
            <div className="text-[10px] text-white/25 uppercase tracking-wider px-2 mt-4 mb-1">
              已上传
            </div>
            <div className="text-xs text-white/30 px-2">
              {uploadedFiles.length} 个文件
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/45 flex-1 min-w-0">
            <button
              className="hover:text-white/70 transition-colors"
              onClick={() => setCurrentPath([])}
            >
              主目录
            </button>
            {currentPath.map((dir, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={10} className="text-white/15" />
                <button
                  className="hover:text-white/70 transition-colors"
                  onClick={() => navigateUp(i)}
                >
                  {dir}
                </button>
              </span>
            ))}
          </div>

          <button
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]
              bg-blue-500/[0.08] text-blue-400/70 hover:bg-blue-500/[0.14] hover:text-blue-400
              transition-colors border border-blue-400/10"
            onClick={handleUpload}
          >
            <Upload size={12} />
            上传
          </button>

          <div className="flex items-center gap-0.5">
            <button
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white/70' : 'text-white/25 hover:text-white/50'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
            <button
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white/70' : 'text-white/25 hover:text-white/50'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {viewMode === 'list' ? (
            <div className="space-y-0.5">
              <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1 text-[10px] text-white/20 uppercase tracking-wider">
                <span>名称</span>
                <span>大小</span>
                <span>修改时间</span>
              </div>
              {displayItems.map((item) => {
                const ItemIcon = ICON_MAP[item.icon]
                return (
                  <div
                    key={item.name}
                    className={`grid grid-cols-[1fr_80px_100px] gap-2 px-2 py-1.5 rounded-lg
                      text-xs hover:bg-white/[0.04] transition-colors cursor-pointer
                      ${item.type === 'folder' ? 'text-white/65' : 'text-white/45'}
                      ${item.isUploaded ? 'border-l-2 border-blue-400/30' : ''}`}
                    onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ItemIcon && <ItemIcon size={14} className={`shrink-0 ${item.isUploaded ? 'text-blue-400/70' : 'text-blue-400/50'}`} />}
                      <span className="truncate">{item.name}</span>
                      {item.isUploaded && (
                        <span className="text-[9px] text-blue-400/40 bg-blue-400/[0.06] px-1 rounded">新</span>
                      )}
                    </div>
                    <span className="text-white/25">{item.size || '--'}</span>
                    <span className="text-white/25">{item.modified || '--'}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {displayItems.map((item) => {
                const ItemIcon = ICON_MAP[item.icon]
                return (
                  <div
                    key={item.name}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl
                      hover:bg-white/[0.04] transition-colors cursor-pointer
                      ${item.isUploaded ? 'ring-1 ring-blue-400/15' : ''}`}
                    onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                  >
                    {ItemIcon && <ItemIcon size={28} className={item.isUploaded ? 'text-blue-400/70' : 'text-blue-400/50'} />}
                    <span className="text-[11px] text-white/55 text-center truncate w-full">
                      {item.name}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/[0.04] backdrop-blur-sm flex items-center justify-center z-10
            border-2 border-dashed border-blue-400/20 rounded-lg m-1">
            <div className="flex flex-col items-center gap-2">
              <CloudUpload size={28} className="text-blue-400/50" />
              <span className="text-xs text-blue-300/60">拖放文件上传</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
