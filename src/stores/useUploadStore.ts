import { create } from 'zustand'
import type { UploadedFile } from '@/types'

interface UploadStore {
  uploadedFiles: UploadedFile[]
  isDragOver: boolean
  addFile: (file: UploadedFile) => void
  removeFile: (id: string) => void
  setDragOver: (over: boolean) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploadedFiles: [],
  isDragOver: false,

  addFile: (file) => {
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, file],
    }))
  },

  removeFile: (id) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
    }))
  },

  setDragOver: (over) => {
    set({ isDragOver: over })
  },
}))
