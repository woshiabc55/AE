import { useWorkbookStore } from '@/store/workbook'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const BG_COLORS = [
  null,
  '#DCFCE7',
  '#DBEAFE',
  '#FEF9C3',
  '#FCE7F3',
  '#F3E8FF',
  '#FED7AA',
  '#E7E5E4',
  '#CCFBF1',
]

const TEXT_COLORS = [
  null,
  '#1B4332',
  '#1E40AF',
  '#92400E',
  '#9F1239',
  '#6D28D9',
  '#C2410C',
  '#374151',
  '#0F766E',
]

export default function Toolbar() {
  const { activeCell, getCellFormat, setSelectionFormat } = useWorkbookStore()
  const [showBgPicker, setShowBgPicker] = useState(false)
  const [showTextPicker, setShowTextPicker] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const format = activeCell ? getCellFormat(activeCell.row, activeCell.col) : null

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bgRef.current && !bgRef.current.contains(e.target as Node)) {
        setShowBgPicker(false)
      }
      if (textRef.current && !textRef.current.contains(e.target as Node)) {
        setShowTextPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div
      className="flex items-center gap-1 px-3 py-1.5"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setSelectionFormat({ bold: !format?.bold })}
          className="toolbar-btn"
          style={
            format?.bold
              ? { background: 'var(--accent-sheet)18', color: 'var(--accent-sheet)' }
              : undefined
          }
          title="加粗"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => setSelectionFormat({ italic: !format?.italic })}
          className="toolbar-btn"
          style={
            format?.italic
              ? { background: 'var(--accent-sheet)18', color: 'var(--accent-sheet)' }
              : undefined
          }
          title="斜体"
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setSelectionFormat({ align: 'left' })}
          className="toolbar-btn"
          style={
            format?.align === 'left'
              ? { background: 'var(--accent-sheet)18', color: 'var(--accent-sheet)' }
              : undefined
          }
          title="左对齐"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => setSelectionFormat({ align: 'center' })}
          className="toolbar-btn"
          style={
            format?.align === 'center'
              ? { background: 'var(--accent-sheet)18', color: 'var(--accent-sheet)' }
              : undefined
          }
          title="居中"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => setSelectionFormat({ align: 'right' })}
          className="toolbar-btn"
          style={
            format?.align === 'right'
              ? { background: 'var(--accent-sheet)18', color: 'var(--accent-sheet)' }
              : undefined
          }
          title="右对齐"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5 relative" ref={bgRef}>
        <button
          onClick={() => {
            setShowBgPicker(!showBgPicker)
            setShowTextPicker(false)
          }}
          className="toolbar-btn"
          style={{ gap: '4px' }}
          title="背景色"
        >
          <Palette size={16} />
          <span
            className="w-3.5 h-3.5 rounded-sm"
            style={{
              backgroundColor: format?.bgColor || '#ffffff',
              border: '1px solid var(--border-default)',
            }}
          />
        </button>
        {showBgPicker && (
          <div
            className="absolute top-full left-0 mt-1 rounded-lg shadow-xl p-2 z-50 flex gap-1 flex-wrap w-[180px]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {BG_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectionFormat({ bgColor: color })
                  setShowBgPicker(false)
                }}
                className="w-6 h-6 rounded hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color || '#ffffff',
                  border: '1px solid var(--border-default)',
                }}
                title={color ? color : '无背景'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-0.5 relative" ref={textRef}>
        <button
          onClick={() => {
            setShowTextPicker(!showTextPicker)
            setShowBgPicker(false)
          }}
          className="toolbar-btn"
          style={{ gap: '4px' }}
          title="文字颜色"
        >
          <Type size={16} />
          <span
            className="w-3.5 h-3.5 rounded-sm"
            style={{
              backgroundColor: format?.textColor || '#E8EDE6',
              border: '1px solid var(--border-default)',
            }}
          />
        </button>
        {showTextPicker && (
          <div
            className="absolute top-full left-0 mt-1 rounded-lg shadow-xl p-2 z-50 flex gap-1 flex-wrap w-[180px]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {TEXT_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectionFormat({ textColor: color })
                  setShowTextPicker(false)
                }}
                className="w-6 h-6 rounded hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color || '#E8EDE6',
                  border: '1px solid var(--border-default)',
                }}
                title={color ? color : '默认'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
