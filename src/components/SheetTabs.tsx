import { useWorkbookStore } from '@/store/workbook'
import { Plus, X, Pencil, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function SheetTabs() {
  const { workbook, setActiveSheet, addSheet, deleteSheet, renameSheet } = useWorkbookStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const handleRename = (sheetId: string) => {
    if (editName.trim()) {
      renameSheet(sheetId, editName.trim())
    }
    setEditingId(null)
  }

  return (
    <div
      className="flex items-end gap-0.5 px-2 pt-1 overflow-x-auto"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {workbook.sheets.map((sheet, index) => {
        const isActive = index === workbook.activeSheetIndex
        const isEditing = editingId === sheet.id

        return (
          <div
            key={sheet.id}
            className="group flex items-center gap-1 px-3 py-1.5 text-xs rounded-t-md cursor-pointer transition-all select-none"
            style={{
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              color: isActive ? 'var(--accent-sheet)' : 'var(--text-muted)',
              fontWeight: isActive ? 600 : 400,
              borderTop: isActive ? '2px solid var(--accent-sheet)' : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-overlay)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
            onClick={() => setActiveSheet(index)}
            onDoubleClick={(e) => {
              e.stopPropagation()
              setEditingId(sheet.id)
              setEditName(sheet.name)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              setEditingId(sheet.id)
              setEditName(sheet.name)
            }}
          >
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(sheet.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onBlur={() => handleRename(sheet.id)}
                  className="w-20 text-xs rounded px-1 py-0 focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--accent-sheet)',
                    color: 'var(--text-primary)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRename(sheet.id)
                  }}
                  style={{ color: 'var(--accent-sheet)' }}
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <>
                <span>{sheet.name}</span>
                {isActive && workbook.sheets.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSheet(sheet.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all ml-1"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff6b6b'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                    }}
                    title="删除工作表"
                  >
                    <X size={12} />
                  </button>
                )}
                {!isEditing && isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(sheet.id)
                      setEditName(sheet.name)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent-sheet)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                    }}
                    title="重命名"
                  >
                    <Pencil size={10} />
                  </button>
                )}
              </>
            )}
          </div>
        )
      })}
      <button
        onClick={addSheet}
        className="flex items-center gap-1 px-2 py-1.5 text-xs rounded-t-md transition-colors"
        style={{ color: 'var(--accent-sheet)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-overlay)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
        title="新建工作表"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
