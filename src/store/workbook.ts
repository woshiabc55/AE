import { create } from 'zustand'
import {
  type WorkbookData,
  type SheetData,
  type CellData,
  type CellFormat,
  type CellSelection,
  DEFAULT_FORMAT,
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  cellKey,
  createDefaultWorkbook,
  createDefaultSheet,
} from '@/types'
import { evaluateFormula } from '@/utils/formula'

const STORAGE_KEY = 'tab-workbook-data'

function loadWorkbook(): WorkbookData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as WorkbookData
      if (data.sheets && data.sheets.length > 0) return data
    }
  } catch { /* ignore */ }
  return createDefaultWorkbook()
}

function saveWorkbook(data: WorkbookData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

interface WorkbookState {
  workbook: WorkbookData
  activeCell: { row: number; col: number } | null
  selection: CellSelection | null
  editingCell: { row: number; col: number } | null
  editingValue: string

  getActiveSheet: () => SheetData
  getCell: (row: number, col: number) => CellData | null
  getCellValue: (row: number, col: number) => string
  getCellFormat: (row: number, col: number) => CellFormat

  setActiveCell: (row: number, col: number) => void
  setSelection: (sel: CellSelection) => void
  startEditing: (row: number, col: number, initialValue?: string) => void
  stopEditing: () => void
  setEditingValue: (val: string) => void
  commitEdit: () => void

  setCellValue: (row: number, col: number, value: string) => void
  setCellFormat: (row: number, col: number, format: Partial<CellFormat>) => void
  setSelectionFormat: (format: Partial<CellFormat>) => void

  addSheet: () => void
  deleteSheet: (sheetId: string) => void
  renameSheet: (sheetId: string, name: string) => void
  setActiveSheet: (index: number) => void

  addRow: () => void
  addColumn: () => void
  deleteRow: (rowIndex: number) => void
  deleteColumn: (colIndex: number) => void
  insertRow: (rowIndex: number) => void
  insertColumn: (colIndex: number) => void
}

export const useWorkbookStore = create<WorkbookState>((set, get) => ({
  workbook: loadWorkbook(),
  activeCell: null,
  selection: null,
  editingCell: null,
  editingValue: '',

  getActiveSheet: () => {
    const { workbook } = get()
    return workbook.sheets[workbook.activeSheetIndex]
  },

  getCell: (row, col) => {
    const sheet = get().getActiveSheet()
    return sheet.cells[cellKey(row, col)] || null
  },

  getCellValue: (row, col) => {
    const sheet = get().getActiveSheet()
    const cell = sheet.cells[cellKey(row, col)]
    if (!cell) return ''
    if (cell.formula) {
      return evaluateFormula(cell.formula, sheet)
    }
    return cell.value
  },

  getCellFormat: (row, col) => {
    const cell = get().getCell(row, col)
    return cell ? cell.format : { ...DEFAULT_FORMAT }
  },

  setActiveCell: (row, col) => {
    set({
      activeCell: { row, col },
      selection: { startRow: row, startCol: col, endRow: row, endCol: col },
    })
  },

  setSelection: (sel) => set({ selection: sel }),

  startEditing: (row, col, initialValue) => {
    const cell = get().getCell(row, col)
    set({
      editingCell: { row, col },
      editingValue: initialValue !== undefined ? initialValue : (cell?.formula || cell?.value || ''),
    })
  },

  stopEditing: () => {
    set({ editingCell: null, editingValue: '' })
  },

  setEditingValue: (val) => set({ editingValue: val }),

  commitEdit: () => {
    const { editingCell, editingValue, workbook } = get()
    if (!editingCell) return

    const { row, col } = editingCell
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const key = cellKey(row, col)
    const existingCell = sheet.cells[key]

    const isFormula = editingValue.startsWith('=')

    const newCell: CellData = {
      id: existingCell?.id || crypto.randomUUID(),
      row,
      col,
      value: isFormula ? '' : editingValue,
      formula: isFormula ? editingValue : null,
      format: existingCell?.format || { ...DEFAULT_FORMAT },
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: { ...sheet.cells, [key]: newCell },
    }

    const newWorkbook = {
      ...workbook,
      sheets: newSheets,
      updatedAt: Date.now(),
    }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook, editingCell: null, editingValue: '' })
  },

  setCellValue: (row, col, value) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const key = cellKey(row, col)
    const existingCell = sheet.cells[key]

    const isFormula = value.startsWith('=')
    const newCell: CellData = {
      id: existingCell?.id || crypto.randomUUID(),
      row,
      col,
      value: isFormula ? '' : value,
      formula: isFormula ? value : null,
      format: existingCell?.format || { ...DEFAULT_FORMAT },
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: { ...sheet.cells, [key]: newCell },
    }

    const newWorkbook = {
      ...workbook,
      sheets: newSheets,
      updatedAt: Date.now(),
    }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  setCellFormat: (row, col, format) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const key = cellKey(row, col)
    const existingCell = sheet.cells[key]

    const newCell: CellData = {
      id: existingCell?.id || crypto.randomUUID(),
      row,
      col,
      value: existingCell?.value || '',
      formula: existingCell?.formula || null,
      format: { ...(existingCell?.format || DEFAULT_FORMAT), ...format },
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: { ...sheet.cells, [key]: newCell },
    }

    const newWorkbook = {
      ...workbook,
      sheets: newSheets,
      updatedAt: Date.now(),
    }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  setSelectionFormat: (format) => {
    const { workbook, selection } = get()
    if (!selection) return

    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newCells = { ...sheet.cells }

    const minRow = Math.min(selection.startRow, selection.endRow)
    const maxRow = Math.max(selection.startRow, selection.endRow)
    const minCol = Math.min(selection.startCol, selection.endCol)
    const maxCol = Math.max(selection.startCol, selection.endCol)

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const key = cellKey(r, c)
        const existing = newCells[key]
        newCells[key] = {
          id: existing?.id || crypto.randomUUID(),
          row: r,
          col: c,
          value: existing?.value || '',
          formula: existing?.formula || null,
          format: { ...(existing?.format || DEFAULT_FORMAT), ...format },
        }
      }
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = { ...sheet, cells: newCells }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  addSheet: () => {
    const { workbook } = get()
    const newSheet = createDefaultSheet(
      `工作表${workbook.sheets.length + 1}`,
      workbook.sheets.length
    )
    const newWorkbook = {
      ...workbook,
      sheets: [...workbook.sheets, newSheet],
      activeSheetIndex: workbook.sheets.length,
      updatedAt: Date.now(),
    }
    saveWorkbook(newWorkbook)
    set({
      workbook: newWorkbook,
      activeCell: null,
      selection: null,
      editingCell: null,
    })
  },

  deleteSheet: (sheetId) => {
    const { workbook } = get()
    if (workbook.sheets.length <= 1) return

    const newSheets = workbook.sheets.filter((s) => s.id !== sheetId)
    const newWorkbook = {
      ...workbook,
      sheets: newSheets,
      activeSheetIndex: Math.min(workbook.activeSheetIndex, newSheets.length - 1),
      updatedAt: Date.now(),
    }
    saveWorkbook(newWorkbook)
    set({
      workbook: newWorkbook,
      activeCell: null,
      selection: null,
      editingCell: null,
    })
  },

  renameSheet: (sheetId, name) => {
    const { workbook } = get()
    const newSheets = workbook.sheets.map((s) =>
      s.id === sheetId ? { ...s, name } : s
    )
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  setActiveSheet: (index) => {
    const { workbook } = get()
    if (index < 0 || index >= workbook.sheets.length) return
    const newWorkbook = { ...workbook, activeSheetIndex: index, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({
      workbook: newWorkbook,
      activeCell: null,
      selection: null,
      editingCell: null,
    })
  },

  addRow: () => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = { ...sheet, rowCount: sheet.rowCount + 1 }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  addColumn: () => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = { ...sheet, colCount: sheet.colCount + 1 }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  deleteRow: (rowIndex) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newCells: Record<string, CellData> = {}

    for (const [key, cell] of Object.entries(sheet.cells)) {
      if (cell.row === rowIndex) continue
      if (cell.row > rowIndex) {
        newCells[cellKey(cell.row - 1, cell.col)] = { ...cell, row: cell.row - 1 }
      } else {
        newCells[key] = cell
      }
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: newCells,
      rowCount: Math.max(DEFAULT_ROW_COUNT, sheet.rowCount - 1),
    }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  deleteColumn: (colIndex) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newCells: Record<string, CellData> = {}

    for (const [key, cell] of Object.entries(sheet.cells)) {
      if (cell.col === colIndex) continue
      if (cell.col > colIndex) {
        newCells[cellKey(cell.row, cell.col - 1)] = { ...cell, col: cell.col - 1 }
      } else {
        newCells[key] = cell
      }
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: newCells,
      colCount: Math.max(DEFAULT_COL_COUNT, sheet.colCount - 1),
    }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  insertRow: (rowIndex) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newCells: Record<string, CellData> = {}

    for (const [key, cell] of Object.entries(sheet.cells)) {
      if (cell.row >= rowIndex) {
        newCells[cellKey(cell.row + 1, cell.col)] = { ...cell, row: cell.row + 1 }
      } else {
        newCells[key] = cell
      }
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: newCells,
      rowCount: sheet.rowCount + 1,
    }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },

  insertColumn: (colIndex) => {
    const { workbook } = get()
    const sheetIndex = workbook.activeSheetIndex
    const sheet = workbook.sheets[sheetIndex]
    const newCells: Record<string, CellData> = {}

    for (const [key, cell] of Object.entries(sheet.cells)) {
      if (cell.col >= colIndex) {
        newCells[cellKey(cell.row, cell.col + 1)] = { ...cell, col: cell.col + 1 }
      } else {
        newCells[key] = cell
      }
    }

    const newSheets = [...workbook.sheets]
    newSheets[sheetIndex] = {
      ...sheet,
      cells: newCells,
      colCount: sheet.colCount + 1,
    }
    const newWorkbook = { ...workbook, sheets: newSheets, updatedAt: Date.now() }
    saveWorkbook(newWorkbook)
    set({ workbook: newWorkbook })
  },
}))
