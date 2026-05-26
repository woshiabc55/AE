import { useCallback, useRef, useState } from 'react'
import { Upload, FileArchive, AlertCircle } from 'lucide-react'
import { useFileStore } from '@/store/fileStore'
import { formatFileSize, isCompressedFile } from '@/utils/file'
import { cn } from '@/lib/utils'

export default function DataStorage() {
  const { files, addFile, transferFile, removeFile } = useFileStore()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList) => {
      setError(null)
      const compressedFiles = Array.from(fileList).filter((f) =>
        isCompressedFile(f.name)
      )
      if (compressedFiles.length === 0) {
        setError('仅支持压缩文件格式（.zip / .rar / .7z / .tar.gz）')
        return
      }
      if (compressedFiles.length < fileList.length) {
        setError(
          `已过滤 ${fileList.length - compressedFiles.length} 个非压缩文件`
        )
      }
      compressedFiles.forEach((f) => {
        addFile({ name: f.name, size: f.size, type: f.type || 'unknown' })
      })
    },
    [addFile]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        e.target.value = ''
      }
    },
    [handleFiles]
  )

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f9b8e]/15">
          <FileArchive className="h-4 w-4 text-[#0f9b8e]" />
        </div>
        <h2 className="text-base font-medium tracking-wide text-[#e8e8f0]">
          数据-存储
        </h2>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-300',
          isDragging
            ? 'border-[#0f9b8e] bg-[#0f9b8e]/10 shadow-[0_0_30px_rgba(15,155,142,0.15)]'
            : 'border-[#2a2a45] bg-[#1a1a2e]/50 hover:border-[#0f9b8e]/60 hover:bg-[#1a1a2e]/80'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,.rar,.7z,.tar.gz,.tar,.gz,.bz2,.xz"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
        <div
          className={cn(
            'mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
            isDragging
              ? 'bg-[#0f9b8e]/20 text-[#0f9b8e]'
              : 'bg-[#2a2a45]/60 text-[#8888a0] group-hover:bg-[#0f9b8e]/15 group-hover:text-[#0f9b8e]'
          )}
        >
          <Upload className="h-5 w-5" />
        </div>
        <p className="mb-1 text-sm font-medium text-[#e8e8f0]">
          {isDragging ? '释放以上传文件' : '拖拽压缩文件至此处'}
        </p>
        <p className="text-xs text-[#8888a0]">
          或点击选择文件 · 支持 .zip .rar .7z .tar.gz
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-[#e74c6f]/10 px-4 py-2.5 text-xs text-[#e74c6f]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2 overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[#8888a0]">
              已上传 {files.length} 个文件
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {files.map((file) => (
              <div
                key={file.id}
                className="group flex items-center gap-3 rounded-lg bg-[#1a1a2e]/70 px-4 py-3 transition-all duration-200 hover:bg-[#1a1a2e]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2a2a45]">
                  <FileArchive className="h-3.5 w-3.5 text-[#0f9b8e]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[#e8e8f0]">{file.name}</p>
                  <p className="text-xs text-[#8888a0]">
                    {formatFileSize(file.size)} · {file.uploadedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'uploaded' ? (
                    <button
                      onClick={() => transferFile(file.id)}
                      className="rounded-md bg-[#0f9b8e]/15 px-3 py-1.5 text-xs font-medium text-[#0f9b8e] transition-all duration-200 hover:bg-[#0f9b8e]/25 hover:shadow-[0_0_12px_rgba(15,155,142,0.2)]"
                    >
                      移交
                    </button>
                  ) : (
                    <span className="rounded-md bg-[#0f9b8e]/20 px-3 py-1.5 text-xs font-medium text-[#0f9b8e]">
                      已移交
                    </span>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="rounded-md px-2 py-1.5 text-xs text-[#8888a0] opacity-0 transition-all duration-200 hover:bg-[#e74c6f]/10 hover:text-[#e74c6f] group-hover:opacity-100"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
