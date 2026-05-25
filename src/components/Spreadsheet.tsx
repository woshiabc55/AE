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
      className="flex-1 overflow-auto relative bg-white"
      ref={tableRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <table className="border-collapse w-max">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-30 w-12 min-w-12 h-7 bg-[#1B4332] text-white text-xs border border-[#14532d] font-semibold" />
            {Array.from({ length: sheet.colCount }, (_, c) => (
              <th
                key={c}
                className="sticky top-0 z-20 min-w-[100px] h-7 bg-[#1B4332] text-white text-xs border border-[#14532d] font-semibold px-2 select-none"
              >
                {colLabel(c)}
              </th>
            ))}
            <th className="sticky top-0 z-20 w-8 min-w-8 h-7 bg-[#1B4332] border border-[#14532d]">
              <button
                onClick={() => useWorkbookStore.getState().addColumn()}
                className="w-full h-full flex items-center justify-center text-[#52B788] hover:text-white transition-colors"
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
              <td className="sticky left-0 z-10 w-12 min-w-12 h-7 bg-[#e8f5e9] text-[#1B4332] text-xs border border-[#d4d4d4] text-center font-mono font-semibold select-none">
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
                    className={`h-7 border border-[#e5e5e5] px-1 relative text-sm font-mono ${
                      active
                        ? 'outline outline-2 outline-[#52B788] outline-offset-[-1px] z-10'
                        : selected
                          ? 'bg-[#e8f5e9]/60'
                          : ''
                    }`}
                    style={{
                      backgroundColor: fmt.bgColor || (selected ? undefined : undefined),
                      color: fmt.textColor || '#2D3436',
                      fontWeight: fmt.bold ? 'bold' : 'normal',
                      fontStyle: fmt.italic ? 'italic' : 'normal',
                      textAlign: fmt.align,
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
                        className="absolute inset-0 w-full h-full px-1 bg-white border-none outline-none text-sm font-mono z-20"
                        style={{
                          color: fmt.textColor || '#2D3436',
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
              <td className="w-8 min-w-8 h-7 border border-[#e5e5e5] bg-[#fafaf5]" />
            </tr>
          ))}
          <tr>
            <td className="sticky left-0 z-10 w-12 min-w-12 h-7 bg-[#e8f5e9] border border-[#d4d4d4]">
              <button
                onClick={() => useWorkbookStore.getState().addRow()}
                className="w-full h-full flex items-center justify-center text-[#52B788] hover:text-[#1B4332] transition-colors"
                title="添加行"
              >
                <Plus size={14} />
              </button>
            </td>
            <td colSpan={sheet.colCount + 1} className="h-7 bg-[#fafaf5]" />
          </tr>
        </tbody>
      </table>

      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-[#e0e0e0] py-1 z-50 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#e8f5e9] text-[#2D3436] flex items-center gap-2"
            onClick={() => {
              insertRow(contextMenu.row)
              setContextMenu(null)
            }}
          >
            <Plus size={14} /> 在上方插入行
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#e8f5e9] text-[#2D3436] flex items-center gap-2"
            onClick={() => {
              insertColumn(contextMenu.col)
              setContextMenu(null)
            }}
          >
            <Plus size={14} /> 在左侧插入列
          </button>
          <div className="border-t border-[#eee] my-1" />
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#fde8e8] text-[#c0392b] flex items-center gap-2"
            onClick={() => {
              deleteRow(contextMenu.row)
              setContextMenu(null)
            }}
          >
            <Minus size={14} /> 删除此行
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#fde8e8] text-[#c0392b] flex items-center gap-2"
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
