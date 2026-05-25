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
  Type,
  Palette,
  Undo2,
  Redo2,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { DocBlock } from '@/types'

const HIGHLIGHT_COLORS = [
  null,
  '#FEF9C3',
  '#DCFCE7',
  '#DBEAFE',
  '#FCE7F3',
  '#F3E8FF',
  '#FED7AA',
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

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#d4d4d4] bg-[#f8faf8] flex-wrap">
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyType('heading1')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'heading1' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="标题1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => applyType('heading2')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'heading2' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="标题2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => applyType('heading3')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'heading3' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="标题3"
        >
          <Heading3 size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyFormat({ bold: !format?.bold })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.bold ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="加粗"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => applyFormat({ italic: !format?.italic })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.italic ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="斜体"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => applyFormat({ underline: !format?.underline })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.underline ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="下划线"
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => applyFormat({ strikethrough: !format?.strikethrough })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.strikethrough ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="删除线"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyFormat({ align: 'left' })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.align === 'left' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="左对齐"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => applyFormat({ align: 'center' })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.align === 'center' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="居中"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => applyFormat({ align: 'right' })}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            format?.align === 'right' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="右对齐"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => applyType('bullet')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'bullet' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="无序列表"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => applyType('numbered')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'numbered' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="有序列表"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => applyType('quote')}
          className={`p-1.5 rounded hover:bg-[#DBEAFE] transition-colors ${
            block?.type === 'quote' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'text-[#555]'
          }`}
          title="引用"
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      <div className="flex items-center gap-0.5 relative" ref={hlRef}>
        <button
          onClick={() => setShowHighlight(!showHighlight)}
          className="p-1.5 rounded hover:bg-[#DBEAFE] transition-colors text-[#555] flex items-center gap-1"
          title="高亮"
        >
          <Palette size={16} />
          <span
            className="w-3.5 h-3.5 rounded-sm border border-[#ccc]"
            style={{ backgroundColor: format?.highlight || '#ffffff' }}
          />
        </button>
        {showHighlight && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-[#e0e0e0] p-2 z-50 flex gap-1 flex-wrap w-[180px]">
            {HIGHLIGHT_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => {
                  applyFormat({ highlight: color })
                  setShowHighlight(false)
                }}
                className="w-6 h-6 rounded border border-[#ddd] hover:scale-110 transition-transform"
                style={{ backgroundColor: color || '#ffffff' }}
                title={color ? color : '无高亮'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#d4d4d4] mx-1" />

      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded hover:bg-[#DBEAFE] transition-colors text-[#555]" title="撤销">
          <Undo2 size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-[#DBEAFE] transition-colors text-[#555]" title="重做">
          <Redo2 size={16} />
        </button>
      </div>
    </div>
  )
}
