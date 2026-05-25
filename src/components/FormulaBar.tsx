import { useWorkbookStore } from '@/store/workbook'
import { cellLabel } from '@/types'

export default function FormulaBar() {
  const { activeCell, editingCell, editingValue, getCell, setEditingValue, commitEdit, startEditing } = useWorkbookStore()

  const cellRef = activeCell ? cellLabel(activeCell.row, activeCell.col) : ''
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : null
  const displayValue = editingCell
    ? editingValue
    : cell
      ? (cell.formula || cell.value)
      : ''

  return (
    <div className="flex items-center px-3 py-1 border-b border-[#d4d4d4] bg-[#f8faf8] gap-2">
      <div className="w-16 text-center text-xs font-mono text-[#1B4332] bg-[#e8f5e9] rounded px-2 py-0.5 border border-[#b7e4c7] font-semibold shrink-0">
        {cellRef || '—'}
      </div>
      <div className="text-[#999] text-sm">|</div>
      <div className="text-xs text-[#52B788] font-mono shrink-0">fx</div>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          if (!editingCell && activeCell) {
            startEditing(activeCell.row, activeCell.col, e.target.value)
          } else {
            setEditingValue(e.target.value)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitEdit()
          } else if (e.key === 'Escape') {
            const { stopEditing } = useWorkbookStore.getState()
            stopEditing()
          }
        }}
        className="flex-1 text-sm font-mono bg-white border border-[#d4d4d4] rounded px-2 py-0.5 focus:outline-none focus:border-[#52B788] focus:ring-1 focus:ring-[#52B788]/30 transition-colors"
        placeholder="输入内容或公式（以 = 开头）"
      />
    </div>
  )
}
