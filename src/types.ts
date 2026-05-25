export interface CellFormat {
  bold: boolean
  italic: boolean
  align: 'left' | 'center' | 'right'
  bgColor: string | null
  textColor: string | null
}

export interface CellData {
  id: string
  row: number
  col: number
  value: string
  formula: string | null
  format: CellFormat
}

export interface SheetData {
  id: string
  name: string
  order: number
  cells: Record<string, CellData>
  rowCount: number
  colCount: number
}

export interface WorkbookData {
  id: string
  name: string
  sheets: SheetData[]
  activeSheetIndex: number
  createdAt: number
  updatedAt: number
}

export interface CellSelection {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export const DEFAULT_FORMAT: CellFormat = {
  bold: false,
  italic: false,
  align: 'left',
  bgColor: null,
  textColor: null,
}

export const DEFAULT_ROW_COUNT = 50
export const DEFAULT_COL_COUNT = 26

export function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

export function colLabel(col: number): string {
  let label = ''
  let c = col
  while (c >= 0) {
    label = String.fromCharCode(65 + (c % 26)) + label
    c = Math.floor(c / 26) - 1
  }
  return label
}

export function cellLabel(row: number, col: number): string {
  return `${colLabel(col)}${row + 1}`
}

export function parseCellRef(ref: string): { row: number; col: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/)
  if (!match) return null
  const colStr = match[1]
  const rowStr = match[2]
  let col = 0
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64)
  }
  col -= 1
  const row = parseInt(rowStr, 10) - 1
  if (row < 0 || col < 0) return null
  return { row, col }
}

export function createDefaultSheet(name: string, order: number): SheetData {
  return {
    id: crypto.randomUUID(),
    name,
    order,
    cells: {},
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  }
}

export function createDefaultWorkbook(): WorkbookData {
  return {
    id: crypto.randomUUID(),
    name: '未命名工作簿',
    sheets: [createDefaultSheet('工作表1', 0)],
    activeSheetIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
