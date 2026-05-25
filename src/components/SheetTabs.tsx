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
    <div className="flex items-end gap-0.5 px-2 pt-1 bg-[#f0f4f0] border-t border-[#d4d4d4] overflow-x-auto">
      {workbook.sheets.map((sheet, index) => {
        const isActive = index === workbook.activeSheetIndex
        const isEditing = editingId === sheet.id

        return (
          <div
            key={sheet.id}
            className={`group flex items-center gap-1 px-3 py-1.5 text-xs rounded-t-md cursor-pointer transition-all select-none ${
              isActive
                ? 'bg-white text-[#1B4332] font-semibold border-t-2 border-[#52B788] shadow-sm'
                : 'bg-[#e8ede8] text-[#666] hover:bg-[#dce8dc] border-t-2 border-transparent'
            }`}
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
                  className="w-20 text-xs bg-white border border-[#52B788] rounded px-1 py-0 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRename(sheet.id)
                  }}
                  className="text-[#52B788] hover:text-[#1B4332]"
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
                    className="opacity-0 group-hover:opacity-100 text-[#999] hover:text-[#c0392b] transition-all ml-1"
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
                    className="opacity-0 group-hover:opacity-100 text-[#999] hover:text-[#1B4332] transition-all"
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
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#52B788] hover:text-[#1B4332] hover:bg-[#e8f5e9] rounded-t-md transition-colors"
        title="新建工作表"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
