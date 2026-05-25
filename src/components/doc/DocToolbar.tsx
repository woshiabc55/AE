import { useDocumentStore } from '@/store/document'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Palette,
  Undo2,
  Redo2,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { DocBlock } from '@/types'

const HIGHLIGHT_COLORS = [
  null,
  '#4B4520',
  '#1E3A22',
  '#1E2D4A',
  '#3E1A2E',
  '#2E1A42',
  '#3E2A18',
]

export default function DocToolbar() {
  const { activeBlockId, getActiveBlock, updateBlockFormat, setBlockType } =
    useDocumentStore()
  const [showHighlight, setShowHighlight] = useState(false)
  const hlRef = useRef<HTMLDivElement>(null)

  const block = activeBlockId ? getActiveBlock() : null
  const format = block?.format

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (hlRef.current && !hlRef.current.contains(e.target as Node)) {
        setShowHighlight(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const applyFormat = (f: Record<string, unknown>) => {
    if (!activeBlockId) return
    updateBlockFormat(activeBlockId, f)
  }

  const applyType = (type: DocBlock['type']) => {
    if (!activeBlockId) return
    setBlockType(activeBlockId, type)
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    ...(active
      ? { background: 'rgba(108, 156, 255, 0.09)', color: 'var(--accent-doc)' }
      : { color: 'var(--text-secondary)' }),
  })

  const isTypeActive = (type: DocBlock['type']) => block?.type === type
  const isFormatActive = (key: keyof typeof format) => !!format?.[key]
  const isAlignActive = (align: string) => format?.align === align

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
          onClick={() => applyType('heading1')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('heading1'))}
          title="标题1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => applyType('heading2')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('heading2'))}
          title="标题2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => applyType('heading3')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('heading3'))}
          title="标题3"
        >
          <Heading3 size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyFormat({ bold: !format?.bold })}
          className="toolbar-btn"
          style={btnStyle(isFormatActive('bold'))}
          title="加粗"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => applyFormat({ italic: !format?.italic })}
          className="toolbar-btn"
          style={btnStyle(isFormatActive('italic'))}
          title="斜体"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => applyFormat({ underline: !format?.underline })}
          className="toolbar-btn"
          style={btnStyle(isFormatActive('underline'))}
          title="下划线"
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => applyFormat({ strikethrough: !format?.strikethrough })}
          className="toolbar-btn"
          style={btnStyle(isFormatActive('strikethrough'))}
          title="删除线"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyFormat({ align: 'left' })}
          className="toolbar-btn"
          style={btnStyle(isAlignActive('left'))}
          title="左对齐"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => applyFormat({ align: 'center' })}
          className="toolbar-btn"
          style={btnStyle(isAlignActive('center'))}
          title="居中"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => applyFormat({ align: 'right' })}
          className="toolbar-btn"
          style={btnStyle(isAlignActive('right'))}
          title="右对齐"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyType('bullet')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('bullet'))}
          title="无序列表"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => applyType('numbered')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('numbered'))}
          title="有序列表"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => applyType('quote')}
          className="toolbar-btn"
          style={btnStyle(isTypeActive('quote'))}
          title="引用"
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5 relative" ref={hlRef}>
        <button
          onClick={() => setShowHighlight(!showHighlight)}
          className="toolbar-btn"
          style={{
            color: 'var(--text-secondary)',
            gap: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title="高亮"
        >
          <Palette size={16} />
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              border: '1px solid var(--border-default)',
              backgroundColor: format?.highlight || 'transparent',
            }}
          />
        </button>
        {showHighlight && (
          <div
            className="absolute top-full left-0 mt-1 p-2 z-50 flex gap-1 flex-wrap"
            style={{
              width: 180,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {HIGHLIGHT_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  applyFormat({ highlight: color })
                  setShowHighlight(false)
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: color
                    ? '1px solid var(--border-default)'
                    : '1px dashed var(--border-default)',
                  backgroundColor: color || 'transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
                title={color ? color : '无高亮'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-sep" />

      <div className="flex items-center gap-0.5">
        <button className="toolbar-btn" style={{ color: 'var(--text-secondary)' }} title="撤销">
          <Undo2 size={16} />
        </button>
        <button className="toolbar-btn" style={{ color: 'var(--text-secondary)' }} title="重做">
          <Redo2 size={16} />
        </button>
      </div>
    </div>
  )
}
