import { create } from 'zustand'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  status: 'uploaded' | 'transferred'
  uploadedAt: string
}

interface FileStore {
  files: FileItem[]
  addFile: (file: Omit<FileItem, 'id' | 'status' | 'uploadedAt'>) => void
  transferFile: (id: string) => void
  removeFile: (id: string) => void
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file) =>
    set((state) => ({
      files: [
        ...state.files,
        {
          ...file,
          id: crypto.randomUUID(),
          status: 'uploaded',
          uploadedAt: new Date().toLocaleString('zh-CN'),
        },
      ],
    })),
  transferFile: (id) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status: 'transferred' as const } : f
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
}))
