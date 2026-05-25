import { parseCellRef, cellKey } from '@/types'
import type { SheetData } from '@/types'

type FormulaFn = (...args: number[]) => number

const FUNCTIONS: Record<string, FormulaFn> = {
  SUM: (...args) => args.reduce((a, b) => a + b, 0),
  AVERAGE: (...args) => {
    if (args.length === 0) return 0
    return args.reduce((a, b) => a + b, 0) / args.length
  },
  MIN: (...args) => Math.min(...args),
  MAX: (...args) => Math.max(...args),
  COUNT: (...args) => args.length,
}

function resolveRange(
  rangeStr: string,
  sheet: SheetData
): number[] {
  const parts = rangeStr.split(':')
  if (parts.length !== 2) return []

  const start = parseCellRef(parts[0].trim())
  const end = parseCellRef(parts[1].trim())
  if (!start || !end) return []

  const values: number[] = []
  const minRow = Math.min(start.row, end.row)
  const maxRow = Math.max(start.row, end.row)
  const minCol = Math.min(start.col, end.col)
  const maxCol = Math.max(start.col, end.col)

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const cell = sheet.cells[cellKey(r, c)]
      if (cell && cell.value !== '') {
        const num = Number(cell.value)
        if (!isNaN(num)) {
          values.push(num)
        }
      }
    }
  }
  return values
}

function resolveCellRef(
  refStr: string,
  sheet: SheetData
): number {
  const ref = parseCellRef(refStr.trim())
  if (!ref) return 0
  const cell = sheet.cells[cellKey(ref.row, ref.col)]
  if (!cell || cell.value === '') return 0
  const num = Number(cell.value)
  return isNaN(num) ? 0 : num
}

export function evaluateFormula(
  formula: string,
  sheet: SheetData
): string {
  if (!formula.startsWith('=')) return formula

  const expr = formula.slice(1).trim()

  const funcMatch = expr.match(/^([A-Z]+)\((.+)\)$/i)
  if (funcMatch) {
    const funcName = funcMatch[1].toUpperCase()
    const fn = FUNCTIONS[funcName]
    if (!fn) return '#NAME?'

    const argsStr = funcMatch[2]
    const args: number[] = []

    const parts = argsStr.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes(':')) {
        args.push(...resolveRange(trimmed, sheet))
      } else if (/^[A-Z]+\d+$/i.test(trimmed)) {
        args.push(resolveCellRef(trimmed, sheet))
      } else {
        const num = Number(trimmed)
        if (!isNaN(num)) args.push(num)
      }
    }

    const result = fn(...args)
    if (funcName === 'COUNT') return String(Math.round(result))
    return Number.isInteger(result) ? String(result) : result.toFixed(2)
  }

  const simpleRef = expr.match(/^([A-Z]+\d+)$/i)
  if (simpleRef) {
    return String(resolveCellRef(simpleRef[1], sheet))
  }

  const simpleRange = expr.match(/^([A-Z]+\d+):([A-Z]+\d+)$/i)
  if (simpleRange) {
    const values = resolveRange(expr, sheet)
    return String(values.reduce((a, b) => a + b, 0))
  }

  try {
    let calcExpr = expr
    const refs = calcExpr.match(/[A-Z]+\d+/gi)
    if (refs) {
      for (const ref of refs) {
        const val = resolveCellRef(ref, sheet)
        calcExpr = calcExpr.replace(ref, String(val))
      }
    }
    const fn = new Function(`return ${calcExpr}`)
    const result = fn()
    if (typeof result === 'number') {
      return Number.isInteger(result) ? String(result) : result.toFixed(2)
    }
    return String(result)
  } catch {
    return '#ERROR!'
  }
}
