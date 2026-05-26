import { useCallback, useRef } from 'react'
import { Upload, Image, Film, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { UploadedFile } from '@/types'

export default function FileUploader() {
  const { uploadedFiles, addUploadedFile, removeUploadedFile, selectFile, selectedFileId } =
    useAppStore()
  const dragRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList) => {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return
        const uploaded: UploadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          file,
        }
        addUploadedFile(uploaded)
      })
    },
    [addUploadedFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <div className="flex flex-col gap-3 h-full">
      <div
        ref={dragRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#00ff88]/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:border-[#00ff88]/70 hover:bg-[#00ff88]/5 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]"
      >
        <Upload className="w-8 h-8 text-[#00ff88]/60" />
        <span className="text-sm text-[#00ff88]/60 font-mono">拖拽上传素材</span>
        <span className="text-xs text-zinc-600 font-mono">图片 / 视频</span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {uploadedFiles.map((f) => (
          <div
            key={f.id}
            onClick={() => selectFile(f.id)}
            className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedFileId === f.id
                ? 'bg-[#00ff88]/10 border border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {f.type === 'image' ? (
              <Image className="w-4 h-4 text-[#00ff88] shrink-0" />
            ) : (
              <Film className="w-4 h-4 text-[#ff0066] shrink-0" />
            )}
            <span className="text-xs text-zinc-400 truncate flex-1 font-mono">{f.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeUploadedFile(f.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-zinc-500 hover:text-[#ff0066]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
