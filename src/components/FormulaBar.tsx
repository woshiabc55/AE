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
    <div
      className="flex items-center px-3 py-1 gap-2"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="w-16 text-center text-xs font-mono rounded px-2 py-0.5 font-semibold shrink-0"
        style={{
          color: 'var(--accent-sheet)',
          background: 'var(--accent-sheet-dim)33',
          border: '1px solid var(--accent-sheet-dim)44',
        }}
      >
        {cellRef || '—'}
      </div>
      <div style={{ color: 'var(--border-default)' }} className="text-sm">|</div>
      <div
        className="text-xs font-mono shrink-0"
        style={{ color: 'var(--accent-sheet)' }}
      >
        fx
      </div>
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
        className="flex-1 text-sm font-mono rounded px-2 py-0.5 transition-colors"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1px solid var(--accent-sheet)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1px solid var(--border-subtle)'
        }}
        placeholder="输入内容或公式（以 = 开头）"
      />
    </div>
  )
}
