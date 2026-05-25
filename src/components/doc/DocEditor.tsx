import { useDocumentStore } from '@/store/document'
import { useCallback, useRef, useEffect } from 'react'
import type { DocBlock } from '@/types'

function BlockItem({ block, index }: { block: DocBlock; index: number }) {
  const {
    activeBlockId,
    setActiveBlock,
    updateBlockContent,
    addBlockAfter,
    removeBlock,
  } = useDocumentStore()

  const isActive = activeBlockId === block.id
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus()
    }
  }, [isActive])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        addBlockAfter(block.id)
      } else if (e.key === 'Backspace' && block.content === '') {
        e.preventDefault()
        removeBlock(block.id)
      }
    },
    [block.id, block.content, addBlockAfter, removeBlock]
  )

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const text = (e.target as HTMLDivElement).textContent || ''
      updateBlockContent(block.id, text)
    },
    [block.id, updateBlockContent]
  )

  const getBlockStyle = (): string => {
    const base = 'outline-none min-h-[1.5em] w-full'
    switch (block.type) {
      case 'heading1':
        return `${base} text-2xl font-bold`
      case 'heading2':
        return `${base} text-xl font-bold`
      case 'heading3':
        return `${base} text-lg font-semibold`
      case 'bullet':
        return `${base} pl-6 relative before:content-['•'] before:absolute before:left-2 before:top-0`
      case 'numbered':
        return `${base} pl-6 relative before:content-['${index + 1}.'] before:absolute before:left-0 before:top-0 before:text-[#999]`
      case 'quote':
        return `${base} pl-4 border-l-3 border-[#1E40AF] text-[#555] italic`
      default:
        return base
    }
  }

  const formatStyle: React.CSSProperties = {
    fontWeight: block.format.bold ? 'bold' : 'normal',
    fontStyle: block.format.italic ? 'italic' : 'normal',
    textDecoration: [
      block.format.underline ? 'underline' : '',
      block.format.strikethrough ? 'line-through' : '',
    ]
      .filter(Boolean)
      .join(' ') || 'none',
    textAlign: block.format.align,
    color: block.format.color || '#2D3436',
    backgroundColor: block.format.highlight || 'transparent',
  }

  return (
    <div
      className={`group relative py-1 px-2 rounded-md transition-colors ${
        isActive ? 'bg-[#EFF6FF]/60' : 'hover:bg-[#f8faf8]'
      }`}
      onClick={() => setActiveBlock(block.id)}
    >
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={getBlockStyle()}
        style={formatStyle}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setActiveBlock(block.id)}
        data-placeholder={
          block.type === 'heading1'
            ? '标题 1'
            : block.type === 'heading2'
              ? '标题 2'
              : block.type === 'heading3'
                ? '标题 3'
                : block.type === 'quote'
                  ? '引用内容...'
                  : '输入内容...'
        }
      >
        {block.content}
      </div>
    </div>
  )
}

export default function DocEditor() {
  const { document, getWordCount } = useDocumentStore()

  return (
    <div className="flex-1 overflow-auto bg-[#f0f4f0]">
      <div className="max-w-[780px] mx-auto my-8">
        <div className="bg-white shadow-lg rounded-lg min-h-[900px] p-12 border border-[#e5e5e5]">
          <div
            className="text-3xl font-bold text-[#2D3436] mb-6 outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              useDocumentStore
                .getState()
                .setDocumentName(e.currentTarget.textContent || '未命名文档')
            }}
          >
            {document.name}
          </div>
          <div className="border-b border-[#f0f0f0] mb-6" />
          {document.blocks.map((block, i) => (
            <BlockItem key={block.id} block={block} index={i} />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-[#1E40AF] text-[#bfdbfe] text-xs py-1.5 px-4 flex justify-end gap-4">
        <span>字数: <strong className="text-white">{getWordCount()}</strong></span>
        <span>段落: <strong className="text-white">{document.blocks.length}</strong></span>
      </div>
    </div>
  )
}
