import { create } from 'zustand'
import {
  type PresentationData,
  type SlideData,
  type SlideElement,
  type SlideElementFormat,
  DEFAULT_SLIDE_ELEMENT_FORMAT,
  createDefaultSlide,
  createDefaultPresentation,
} from '@/types'

const STORAGE_KEY = 'tab-slide-data'

function loadPresentation(): PresentationData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as PresentationData
      if (data.slides && data.slides.length > 0) return data
    }
  } catch { /* ignore */ }
  return createDefaultPresentation()
}

function savePresentation(data: PresentationData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

interface PresentationState {
  presentation: PresentationData
  selectedElementId: string | null

  getActiveSlide: () => SlideData
  addSlide: () => void
  deleteSlide: (slideId: string) => void
  setActiveSlide: (index: number) => void
  setSlideBackground: (slideId: string, bg: string) => void

  addTextElement: (slideId: string) => void
  addShapeElement: (slideId: string) => void
  updateElementContent: (slideId: string, elementId: string, content: string) => void
  updateElementFormat: (slideId: string, elementId: string, format: Partial<SlideElementFormat>) => void
  updateElementPosition: (slideId: string, elementId: string, x: number, y: number) => void
  updateElementSize: (slideId: string, elementId: string, width: number, height: number) => void
  deleteElement: (slideId: string, elementId: string) => void
  selectElement: (id: string | null) => void
  setPresentationName: (name: string) => void
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentation: loadPresentation(),
  selectedElementId: null,

  getActiveSlide: () => {
    const { presentation } = get()
    return presentation.slides[presentation.activeSlideIndex]
  },

  addSlide: () => {
    const { presentation } = get()
    const newSlide = createDefaultSlide()
    const newPres = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
      activeSlideIndex: presentation.slides.length,
      updatedAt: Date.now(),
    }
    savePresentation(newPres)
    set({ presentation: newPres, selectedElementId: null })
  },

  deleteSlide: (slideId) => {
    const { presentation } = get()
    if (presentation.slides.length <= 1) return
    const newSlides = presentation.slides.filter((s) => s.id !== slideId)
    const newPres = {
      ...presentation,
      slides: newSlides,
      activeSlideIndex: Math.min(presentation.activeSlideIndex, newSlides.length - 1),
      updatedAt: Date.now(),
    }
    savePresentation(newPres)
    set({ presentation: newPres, selectedElementId: null })
  },

  setActiveSlide: (index) => {
    const { presentation } = get()
    if (index < 0 || index >= presentation.slides.length) return
    const newPres = { ...presentation, activeSlideIndex: index, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres, selectedElementId: null })
  },

  setSlideBackground: (slideId, bg) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) =>
      s.id === slideId ? { ...s, background: bg } : s
    )
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  addTextElement: (slideId) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      const el: SlideElement = {
        id: crypto.randomUUID(),
        type: 'text',
        x: 100,
        y: 150,
        width: 400,
        height: 40,
        content: '新文本',
        format: { ...DEFAULT_SLIDE_ELEMENT_FORMAT },
      }
      return { ...s, elements: [...s.elements, el] }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  addShapeElement: (slideId) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      const el: SlideElement = {
        id: crypto.randomUUID(),
        type: 'shape',
        x: 200,
        y: 200,
        width: 120,
        height: 120,
        content: '',
        format: { ...DEFAULT_SLIDE_ELEMENT_FORMAT, bgColor: '#52B788', borderRadius: 8 },
      }
      return { ...s, elements: [...s.elements, el] }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  updateElementContent: (slideId, elementId, content) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      return {
        ...s,
        elements: s.elements.map((el) =>
          el.id === elementId ? { ...el, content } : el
        ),
      }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  updateElementFormat: (slideId, elementId, format) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      return {
        ...s,
        elements: s.elements.map((el) =>
          el.id === elementId ? { ...el, format: { ...el.format, ...format } } : el
        ),
      }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  updateElementPosition: (slideId, elementId, x, y) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      return {
        ...s,
        elements: s.elements.map((el) =>
          el.id === elementId ? { ...el, x, y } : el
        ),
      }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  updateElementSize: (slideId, elementId, width, height) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      return {
        ...s,
        elements: s.elements.map((el) =>
          el.id === elementId ? { ...el, width, height } : el
        ),
      }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },

  deleteElement: (slideId, elementId) => {
    const { presentation } = get()
    const newSlides = presentation.slides.map((s) => {
      if (s.id !== slideId) return s
      return {
        ...s,
        elements: s.elements.filter((el) => el.id !== elementId),
      }
    })
    const newPres = { ...presentation, slides: newSlides, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres, selectedElementId: null })
  },

  selectElement: (id) => set({ selectedElementId: id }),

  setPresentationName: (name) => {
    const { presentation } = get()
    const newPres = { ...presentation, name, updatedAt: Date.now() }
    savePresentation(newPres)
    set({ presentation: newPres })
  },
}))
