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
    <div
      className="flex items-center gap-1 px-3 py-1.5 flex-wrap"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => slide && addTextElement(slide.id)}
          className="toolbar-btn flex items-center gap-1"
          title="添加文本"
        >
          <Type size={16} />
          <span className="text-xs">文本</span>
        </button>
        <button
          onClick={() => slide && addShapeElement(slide.id)}
          className="toolbar-btn flex items-center gap-1"
          title="添加形状"
        >
          <Square size={16} />
          <span className="text-xs">形状</span>
        </button>
      </div>

      <div className="toolbar-sep" />

      {selectedElement && (
        <>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => applyFormat({ bold: !selectedElement.format.bold })}
              className={`toolbar-btn ${selectedElement.format.bold ? 'active' : ''}`}
              title="加粗"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => applyFormat({ italic: !selectedElement.format.italic })}
              className={`toolbar-btn ${selectedElement.format.italic ? 'active' : ''}`}
              title="斜体"
            >
              <Italic size={16} />
            </button>
          </div>

          <div className="toolbar-sep" />

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => applyFormat({ align: 'left' })}
              className={`toolbar-btn ${selectedElement.format.align === 'left' ? 'active' : ''}`}
              title="左对齐"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => applyFormat({ align: 'center' })}
              className={`toolbar-btn ${selectedElement.format.align === 'center' ? 'active' : ''}`}
              title="居中"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => applyFormat({ align: 'right' })}
              className={`toolbar-btn ${selectedElement.format.align === 'right' ? 'active' : ''}`}
              title="右对齐"
            >
              <AlignRight size={16} />
            </button>
          </div>

          <div className="toolbar-sep" />

          <div className="flex items-center gap-1">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>字号</label>
            <input
              type="number"
              value={selectedElement.format.fontSize}
              onChange={(e) =>
                applyFormat({ fontSize: Math.max(8, Math.min(120, Number(e.target.value))) })
              }
              className="font-mono w-12 text-xs rounded px-1 py-0.5 text-center"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              min={8}
              max={120}
            />
          </div>

          <div className="toolbar-sep" />

          <button
            onClick={() => {
              if (slide && selectedElementId) deleteElement(slide.id, selectedElementId)
            }}
            className="toolbar-btn"
            style={{ color: '#ff6b6b' }}
            title="删除元素"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}

      <div className="ml-auto flex items-center gap-0.5 relative" ref={bgRef}>
        <button
          onClick={() => setShowBgPicker(!showBgPicker)}
          className="toolbar-btn flex items-center gap-1"
          title="幻灯片背景"
        >
          <Palette size={16} />
          <span className="text-xs">背景</span>
        </button>
        {showBgPicker && slide && (
          <div
            className="absolute top-full right-0 mt-1 rounded-lg shadow-xl p-2 z-50 flex gap-1 flex-wrap w-[180px]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {SLIDE_BACKGROUNDS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlideBackground(slide.id, color)
                  setShowBgPicker(false)
                }}
                className={`w-6 h-6 rounded hover:scale-110 transition-transform ${
                  slide.background === color ? 'border-2' : ''
                }`}
                style={{
                  backgroundColor: color,
                  border: slide.background === color
                    ? '2px solid var(--accent-slide)'
                    : '1px solid var(--border-default)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
