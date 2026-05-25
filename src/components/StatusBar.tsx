import { useWorkbookStore } from '@/store/workbook'

export default function StatusBar() {
  const { selection, getCellValue } = useWorkbookStore()

  if (!selection) {
    return (
      <div className="flex items-center justify-end px-3 py-1 bg-[#1B4332] text-[#b7e4c7] text-xs border-t border-[#14532d]">
        <span>就绪</span>
      </div>
    )
  }

  const minRow = Math.min(selection.startRow, selection.endRow)
  const maxRow = Math.max(selection.startRow, selection.endRow)
  const minCol = Math.min(selection.startCol, selection.endCol)
  const maxCol = Math.max(selection.startCol, selection.endCol)

  const isSingleCell = minRow === maxRow && minCol === maxCol

  if (isSingleCell) {
    return (
      <div className="flex items-center justify-end px-3 py-1 bg-[#1B4332] text-[#b7e4c7] text-xs border-t border-[#14532d]">
        <span>就绪</span>
      </div>
    )
  }

  const values: number[] = []
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const val = getCellValue(r, c)
      if (val !== '') {
        const num = Number(val)
        if (!isNaN(num)) values.push(num)
      }
    }
  }

  const sum = values.reduce((a, b) => a + b, 0)
  const avg = values.length > 0 ? sum / values.length : 0
  const count = (maxRow - minRow + 1) * (maxCol - minCol + 1)

  return (
    <div className="flex items-center justify-end gap-4 px-3 py-1 bg-[#1B4332] text-[#b7e4c7] text-xs border-t border-[#14532d]">
      <span>求和: <strong className="text-white">{values.length > 0 ? sum.toFixed(2) : '—'}</strong></span>
      <span>平均值: <strong className="text-white">{values.length > 0 ? avg.toFixed(2) : '—'}</strong></span>
      <span>计数: <strong className="text-white">{count}</strong></span>
    </div>
  )
}
