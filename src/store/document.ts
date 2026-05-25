import { create } from 'zustand'
import {
  type DocumentData,
  type DocBlock,
  type DocBlockFormat,
  DEFAULT_BLOCK_FORMAT,
  createDefaultDocument,
} from '@/types'

const STORAGE_KEY = 'tab-doc-data'

function loadDocument(): DocumentData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as DocumentData
      if (data.blocks && data.blocks.length > 0) return data
    }
  } catch { /* ignore */ }
  return createDefaultDocument()
}

function saveDocument(data: DocumentData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

interface DocumentState {
  document: DocumentData
  activeBlockId: string | null

  getActiveBlock: () => DocBlock | null
  setActiveBlock: (id: string | null) => void
  updateBlockContent: (id: string, content: string) => void
  updateBlockFormat: (id: string, format: Partial<DocBlockFormat>) => void
  setBlockType: (id: string, type: DocBlock['type']) => void
  addBlockAfter: (afterId: string, type?: DocBlock['type']) => string
  removeBlock: (id: string) => void
  setDocumentName: (name: string) => void
  getWordCount: () => number
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  document: loadDocument(),
  activeBlockId: null,

  getActiveBlock: () => {
    const { document, activeBlockId } = get()
    if (!activeBlockId) return null
    return document.blocks.find((b) => b.id === activeBlockId) || null
  },

  setActiveBlock: (id) => set({ activeBlockId: id }),

  updateBlockContent: (id, content) => {
    const { document } = get()
    const newBlocks = document.blocks.map((b) =>
      b.id === id ? { ...b, content } : b
    )
    const newDoc = { ...document, blocks: newBlocks, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc })
  },

  updateBlockFormat: (id, format) => {
    const { document } = get()
    const newBlocks = document.blocks.map((b) =>
      b.id === id ? { ...b, format: { ...b.format, ...format } } : b
    )
    const newDoc = { ...document, blocks: newBlocks, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc })
  },

  setBlockType: (id, type) => {
    const { document } = get()
    const newBlocks = document.blocks.map((b) =>
      b.id === id ? { ...b, type } : b
    )
    const newDoc = { ...document, blocks: newBlocks, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc })
  },

  addBlockAfter: (afterId, type = 'paragraph') => {
    const { document } = get()
    const index = document.blocks.findIndex((b) => b.id === afterId)
    if (index === -1) return afterId

    const newBlock: DocBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
      format: { ...DEFAULT_BLOCK_FORMAT },
    }

    const newBlocks = [...document.blocks]
    newBlocks.splice(index + 1, 0, newBlock)

    const newDoc = { ...document, blocks: newBlocks, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc, activeBlockId: newBlock.id })
    return newBlock.id
  },

  removeBlock: (id) => {
    const { document } = get()
    if (document.blocks.length <= 1) return

    const index = document.blocks.findIndex((b) => b.id === id)
    const newBlocks = document.blocks.filter((b) => b.id !== id)

    const newActiveId =
      index > 0
        ? newBlocks[index - 1]?.id || null
        : newBlocks[0]?.id || null

    const newDoc = { ...document, blocks: newBlocks, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc, activeBlockId: newActiveId })
  },

  setDocumentName: (name) => {
    const { document } = get()
    const newDoc = { ...document, name, updatedAt: Date.now() }
    saveDocument(newDoc)
    set({ document: newDoc })
  },

  getWordCount: () => {
    const { document } = get()
    return document.blocks.reduce((count, block) => {
      const words = block.content.trim().split(/\s+/).filter(Boolean)
      return count + (block.content.trim() === '' ? 0 : words.length)
    }, 0)
  },
}))
