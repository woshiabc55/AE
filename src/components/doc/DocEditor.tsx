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

  const getBlockStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      outline: 'none',
      minHeight: '1.5em',
      width: '100%',
    }
    switch (block.type) {
      case 'heading1':
        return { ...base, fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 700 }
      case 'heading2':
        return { ...base, fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 700 }
      case 'heading3':
        return { ...base, fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: 600 }
      case 'bullet':
        return { ...base, paddingLeft: 24, position: 'relative' }
      case 'numbered':
        return {
          ...base,
          paddingLeft: 24,
          position: 'relative',
        }
      case 'quote':
        return {
          ...base,
          paddingLeft: 16,
          borderLeft: '3px solid var(--accent-doc)',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
        }
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
    color: block.format.color || 'var(--text-primary)',
    backgroundColor: block.format.highlight || 'transparent',
  }

  const bulletMarker = block.type === 'bullet' ? (
    <span
      style={{
        position: 'absolute',
        left: 8,
        top: 0,
        color: 'var(--text-muted)',
        pointerEvents: 'none',
      }}
    >
      •
    </span>
  ) : null

  const numberedMarker = block.type === 'numbered' ? (
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        color: 'var(--text-muted)',
        pointerEvents: 'none',
      }}
    >
      {index + 1}.
    </span>
  ) : null

  return (
    <div
      className="group relative py-1 px-2 rounded-md transition-colors"
      style={{
        background: isActive
          ? 'rgba(108, 156, 255, 0.04)'
          : undefined,
        cursor: 'text',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--bg-elevated)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
      onClick={() => setActiveBlock(block.id)}
    >
      {bulletMarker}
      {numberedMarker}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        style={{ ...getBlockStyle(), ...formatStyle }}
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
    <div
      className="flex-1 overflow-auto"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-[780px] mx-auto my-8">
        <div
          className="rounded-xl min-h-[900px] p-12"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className="font-display text-3xl font-bold mb-6 outline-none"
            style={{ color: 'var(--text-primary)' }}
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
          <div
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: 24,
            }}
          />
          {document.blocks.map((block, i) => (
            <BlockItem key={block.id} block={block} index={i} />
          ))}
        </div>
      </div>
      <div
        className="sticky bottom-0 text-xs py-1.5 px-4 flex justify-end gap-4"
        style={{
          background: 'var(--accent-doc-dim)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <span>字数: <strong style={{ color: '#fff' }}>{getWordCount()}</strong></span>
        <span>段落: <strong style={{ color: '#fff' }}>{document.blocks.length}</strong></span>
      </div>
    </div>
  )
}
