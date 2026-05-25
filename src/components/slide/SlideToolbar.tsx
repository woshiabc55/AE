import { usePresentationStore } from '@/store/presentation'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Square,
  Trash2,
  Plus,
  Palette,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const SLIDE_BACKGROUNDS = [
  '#ffffff',
  '#f8faf5',
  '#1B4332',
  '#1E40AF',
  '#9F1239',
  '#F3E8FF',
  '#FEF9C3',
  '#0F172A',
]

export default function SlideToolbar() {
  const {
    presentation,
    selectedElementId,
    getActiveSlide,
    addTextElement,
    addShapeElement,
    updateElementFormat,
    deleteElement,
    setSlideBackground,
  } = usePresentationStore()

  const [showBgPicker, setShowBgPicker] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)

  const slide = getActiveSlide()
  const selectedElement = selectedElementId
    ? slide?.elements.find((el) => el.id === selectedElementId)
    : null

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bgRef.current && !bgRef.current.contains(e.target as Node)) {
        setShowBgPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const applyFormat = (f: Record<string, unknown>) => {
    if (!selectedElementId || !slide) return
    updateElementFormat(slide.id, selectedElementId, f)
  }

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#d4d4d4] bg-[#f8faf8] flex-wrap">
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => slide && addTextElement(slide.id)}
          className="p-1.5 rounded hover:bg-[#FCE7F3] transition-colors text-[#555] flex items-center gap-1"
          title="添加文本"
        >
          <Type size={16} />
          <span className="text-xs">文本</span>
        </button>
        <button
          onClick={() => slide && addShapeElement(slide.id)}
          className="p-1.5 rounded hover:bg-[#FCE7F3] transition-colors text-[#555] flex items-center gap-1"
          title="添加形状"
        >
          <Square size={16} />
          <span className="text-xs">形状</span>
        </button>
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      {selectedElement && (
        <>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => applyFormat({ bold: !selectedElement.format.bold })}
              className={`p-1.5 rounded hover:bg-[#FCE7F3] transition-colors ${
                selectedElement.format.bold ? 'bg-[#FCE7F3] text-[#9F1239]' : 'text-[#555]'
              }`}
              title="加粗"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => applyFormat({ italic: !selectedElement.format.italic })}
              className={`p-1.5 rounded hover:bg-[#FCE7F3] transition-colors ${
                selectedElement.format.italic ? 'bg-[#FCE7F3] text-[#9F1239]' : 'text-[#555]'
              }`}
              title="斜体"
            >
              <Italic size={16} />
            </button>
          </div>

          <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => applyFormat({ align: 'left' })}
              className={`p-1.5 rounded hover:bg-[#FCE7F3] transition-colors ${
                selectedElement.format.align === 'left' ? 'bg-[#FCE7F3] text-[#9F1239]' : 'text-[#555]'
              }`}
              title="左对齐"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => applyFormat({ align: 'center' })}
              className={`p-1.5 rounded hover:bg-[#FCE7F3] transition-colors ${
                selectedElement.format.align === 'center' ? 'bg-[#FCE7F3] text-[#9F1239]' : 'text-[#555]'
              }`}
              title="居中"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => applyFormat({ align: 'right' })}
              className={`p-1.5 rounded hover:bg-[#FCE7F3] transition-colors ${
                selectedElement.format.align === 'right' ? 'bg-[#FCE7F3] text-[#9F1239]' : 'text-[#555]'
              }`}
              title="右对齐"
            >
              <AlignRight size={16} />
            </button>
          </div>

          <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

          <div className="flex items-center gap-1">
            <label className="text-xs text-[#999]">字号</label>
            <input
              type="number"
              value={selectedElement.format.fontSize}
              onChange={(e) =>
                applyFormat({ fontSize: Math.max(8, Math.min(120, Number(e.target.value))) })
              }
              className="w-12 text-xs border border-[#d4d4d4] rounded px-1 py-0.5 text-center"
              min={8}
              max={120}
            />
          </div>

          <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

          <button
            onClick={() => {
              if (slide && selectedElementId) deleteElement(slide.id, selectedElementId)
            }}
            className="p-1.5 rounded hover:bg-[#fde8e8] transition-colors text-[#c0392b]"
            title="删除元素"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}

      <div className="ml-auto flex items-center gap-0.5 relative" ref={bgRef}>
        <button
          onClick={() => setShowBgPicker(!showBgPicker)}
          className="p-1.5 rounded hover:bg-[#FCE7F3] transition-colors text-[#555] flex items-center gap-1"
          title="幻灯片背景"
        >
          <Palette size={16} />
          <span className="text-xs">背景</span>
        </button>
        {showBgPicker && slide && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-[#e0e0e0] p-2 z-50 flex gap-1 flex-wrap w-[180px]">
            {SLIDE_BACKGROUNDS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlideBackground(slide.id, color)
                  setShowBgPicker(false)
                }}
                className={`w-6 h-6 rounded border hover:scale-110 transition-transform ${
                  slide.background === color ? 'border-[#9F1239] border-2' : 'border-[#ddd]'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
