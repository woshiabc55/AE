import { useWorkbookStore } from '@/store/workbook'
import { colLabel, cellKey, DEFAULT_FORMAT } from '@/types'
import { Plus, Minus } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'

export default function Spreadsheet() {
  const {
    workbook,
    activeCell,
    selection,
    editingCell,
    editingValue,
    getCell,
    getCellValue,
    getCellFormat,
    setActiveCell,
    setSelection,
    startEditing,
    stopEditing,
    setEditingValue,
    commitEdit,
    insertRow,
    insertColumn,
    deleteRow,
    deleteColumn,
  } = useWorkbookStore()

  const sheet = workbook.sheets[workbook.activeSheetIndex]
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    row: number
    col: number
  } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const editingRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCell && editingRef.current) {
      editingRef.current.focus()
    }
  }, [editingCell])

  const handleMouseDown = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      if (e.button === 2) return
      if (editingCell) commitEdit()

      if (e.shiftKey && activeCell) {
        setSelection({
          startRow: activeCell.row,
          startCol: activeCell.col,
          endRow: row,
          endCol: col,
        })
      } else {
        setActiveCell(row, col)
      }
    },
    [editingCell, activeCell, commitEdit, setActiveCell, setSelection]
  )

  const handleMouseMove = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      if (e.buttons !== 1 || !activeCell) return
      setSelection({
        startRow: activeCell.row,
        startCol: activeCell.col,
        endRow: row,
        endCol: col,
      })
    },
    [activeCell, setSelection]
  )

  const handleDoubleClick = useCallback(
    (row: number, col: number) => {
      startEditing(row, col)
    },
    [startEditing]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editingCell) {
        if (e.key === 'Enter') {
          e.preventDefault()
          commitEdit()
          if (activeCell) {
            const newRow = Math.min(activeCell.row + 1, sheet.rowCount - 1)
            setActiveCell(newRow, activeCell.col)
          }
        } else if (e.key === 'Tab') {
          e.preventDefault()
          commitEdit()
          if (activeCell) {
            const newCol = Math.min(activeCell.col + 1, sheet.colCount - 1)
            setActiveCell(activeCell.row, newCol)
          }
        } else if (e.key === 'Escape') {
          stopEditing()
        }
        return
      }

      if (!activeCell) return

      const { row, col } = activeCell

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (row > 0) setActiveCell(row - 1, col)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (row < sheet.rowCount - 1) setActiveCell(row + 1, col)
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (col > 0) setActiveCell(row, col - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          if (col < sheet.colCount - 1) setActiveCell(row, col + 1)
          break
        case 'Enter':
          e.preventDefault()
          startEditing(row, col)
          break
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          useWorkbookStore.getState().setCellValue(row, col, '')
          break
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            startEditing(row, col, e.key)
          }
      }
    },
    [editingCell, activeCell, sheet, commitEdit, setActiveCell, startEditing, stopEditing]
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, row, col })
    },
    []
  )

  useEffect(() => {
    function handleClick() {
      setContextMenu(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const isInSelection = (row: number, col: number) => {
    if (!selection) return false
    const minRow = Math.min(selection.startRow, selection.endRow)
    const maxRow = Math.max(selection.startRow, selection.endRow)
    const minCol = Math.min(selection.startCol, selection.endCol)
    const maxCol = Math.max(selection.startCol, selection.endCol)
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol
  }

  const isActive = (row: number, col: number) => {
    return activeCell?.row === row && activeCell?.col === col
  }

  return (
    <div
      className="flex-1 overflow-auto relative"
      style={{ background: 'var(--bg-base)' }}
      ref={tableRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <table className="border-collapse w-max">
        <thead>
          <tr>
            <th
              className="sticky top-0 left-0 z-30 w-12 min-w-12 h-7 text-white text-xs font-semibold"
              style={{
                background: 'linear-gradient(180deg, var(--accent-sheet-dim), #1a3a28)',
                border: '1px solid var(--accent-sheet-dim)44',
              }}
            />
            {Array.from({ length: sheet.colCount }, (_, c) => (
              <th
                key={c}
                className="sticky top-0 z-20 min-w-[100px] h-7 text-white text-xs font-semibold px-2 select-none"
                style={{
                  background: 'linear-gradient(180deg, var(--accent-sheet-dim), #1a3a28)',
                  border: '1px solid var(--accent-sheet-dim)44',
                }}
              >
                {colLabel(c)}
              </th>
            ))}
            <th
              className="sticky top-0 z-20 w-8 min-w-8 h-7"
              style={{
                background: 'linear-gradient(180deg, var(--accent-sheet-dim), #1a3a28)',
                border: '1px solid var(--accent-sheet-dim)44',
              }}
            >
              <button
                onClick={() => useWorkbookStore.getState().addColumn()}
                className="w-full h-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--accent-sheet)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.background = 'var(--bg-overlay)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--accent-sheet)'
                  e.currentTarget.style.background = 'transparent'
                }}
                title="添加列"
              >
                <Plus size={14} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: sheet.rowCount }, (_, r) => (
            <tr key={r}>
              <td
                className="sticky left-0 z-10 w-12 min-w-12 h-7 text-xs text-center font-mono font-semibold select-none"
                style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {r + 1}
              </td>
              {Array.from({ length: sheet.colCount }, (_, c) => {
                const cell = getCell(r, c)
                const value = getCellValue(r, c)
                const fmt = cell?.format || DEFAULT_FORMAT
                const isEditing = editingCell?.row === r && editingCell?.col === c
                const selected = isInSelection(r, c)
                const active = isActive(r, c)

                return (
                  <td
                    key={c}
                    className="h-7 px-1 relative text-sm font-mono"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      color: fmt.textColor || 'var(--text-primary)',
                      fontWeight: fmt.bold ? 'bold' : 'normal',
                      fontStyle: fmt.italic ? 'italic' : 'normal',
                      textAlign: fmt.align,
                      backgroundColor: fmt.bgColor || (selected ? 'var(--accent-sheet)0D' : undefined),
                      outline: active ? '2px solid var(--accent-sheet)' : undefined,
                      outlineOffset: active ? '-1px' : undefined,
                      zIndex: active ? 10 : undefined,
                      boxShadow: active ? '0 0 8px var(--glow-sheet)' : undefined,
                    }}
                    onMouseDown={(e) => handleMouseDown(r, c, e)}
                    onMouseMove={(e) => handleMouseMove(r, c, e)}
                    onDoubleClick={() => handleDoubleClick(r, c)}
                    onContextMenu={(e) => handleContextMenu(e, r, c)}
                  >
                    {isEditing ? (
                      <input
                        ref={editingRef}
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="absolute inset-0 w-full h-full px-1 border-none outline-none text-sm font-mono z-20"
                        style={{
                          background: 'var(--bg-elevated)',
                          color: fmt.textColor || 'var(--text-primary)',
                          fontWeight: fmt.bold ? 'bold' : 'normal',
                          fontStyle: fmt.italic ? 'italic' : 'normal',
                          textAlign: fmt.align,
                        }}
                      />
                    ) : (
                      <span className="block truncate leading-7">
                        {value}
                      </span>
                    )}
                  </td>
                )
              })}
              <td
                className="w-8 min-w-8 h-7"
                style={{
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                }}
              />
            </tr>
          ))}
          <tr>
            <td
              className="sticky left-0 z-10 w-12 min-w-8 h-7"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => useWorkbookStore.getState().addRow()}
                className="w-full h-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--accent-sheet)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.background = 'var(--bg-overlay)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--accent-sheet)'
                  e.currentTarget.style.background = 'transparent'
                }}
                title="添加行"
              >
                <Plus size={14} />
              </button>
            </td>
            <td
              colSpan={sheet.colCount + 1}
              className="h-7"
              style={{ background: 'var(--bg-surface)' }}
            />
          </tr>
        </tbody>
      </table>

      {contextMenu && (
        <div
          className="fixed rounded-lg shadow-xl py-1 z-50 min-w-[160px]"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-overlay)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => {
              insertRow(contextMenu.row)
              setContextMenu(null)
            }}
          >
            <Plus size={14} /> 在上方插入行
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-overlay)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => {
              insertColumn(contextMenu.col)
              setContextMenu(null)
            }}
          >
            <Plus size={14} /> 在左侧插入列
          </button>
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
          <button
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ color: '#ff6b6b' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff6b6b15'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => {
              deleteRow(contextMenu.row)
              setContextMenu(null)
            }}
          >
            <Minus size={14} /> 删除此行
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors"
            style={{ color: '#ff6b6b' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff6b6b15'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => {
              deleteColumn(contextMenu.col)
              setContextMenu(null)
            }}
          >
            <Minus size={14} /> 删除此列
          </button>
        </div>
      )}
    </div>
  )
}
