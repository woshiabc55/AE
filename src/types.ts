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

export interface DocBlock {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'numbered' | 'quote'
  content: string
  format: DocBlockFormat
}

export interface DocBlockFormat {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  align: 'left' | 'center' | 'right'
  color: string | null
  highlight: string | null
}

export const DEFAULT_BLOCK_FORMAT: DocBlockFormat = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  align: 'left',
  color: null,
  highlight: null,
}

export interface DocumentData {
  id: string
  name: string
  blocks: DocBlock[]
  createdAt: number
  updatedAt: number
}

export function createDefaultDocument(): DocumentData {
  return {
    id: crypto.randomUUID(),
    name: '未命名文档',
    blocks: [
      {
        id: crypto.randomUUID(),
        type: 'paragraph',
        content: '',
        format: { ...DEFAULT_BLOCK_FORMAT },
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export interface SlideElement {
  id: string
  type: 'text' | 'shape'
  x: number
  y: number
  width: number
  height: number
  content: string
  format: SlideElementFormat
}

export interface SlideElementFormat {
  fontSize: number
  bold: boolean
  italic: boolean
  color: string
  align: 'left' | 'center' | 'right'
  bgColor: string | null
  borderRadius: number
}

export const DEFAULT_SLIDE_ELEMENT_FORMAT: SlideElementFormat = {
  fontSize: 18,
  bold: false,
  italic: false,
  color: '#2D3436',
  align: 'center',
  bgColor: null,
  borderRadius: 0,
}

export interface SlideData {
  id: string
  background: string
  elements: SlideElement[]
}

export interface PresentationData {
  id: string
  name: string
  slides: SlideData[]
  activeSlideIndex: number
  createdAt: number
  updatedAt: number
}

export function createDefaultSlide(): SlideData {
  return {
    id: crypto.randomUUID(),
    background: '#ffffff',
    elements: [
      {
        id: crypto.randomUUID(),
        type: 'text',
        x: 60,
        y: 80,
        width: 620,
        height: 60,
        content: '点击输入标题',
        format: { ...DEFAULT_SLIDE_ELEMENT_FORMAT, fontSize: 36, bold: true },
      },
      {
        id: crypto.randomUUID(),
        type: 'text',
        x: 60,
        y: 180,
        width: 620,
        height: 40,
        content: '点击输入副标题',
        format: { ...DEFAULT_SLIDE_ELEMENT_FORMAT, fontSize: 20, color: '#636e72' },
      },
    ],
  }
}

export function createDefaultPresentation(): PresentationData {
  return {
    id: crypto.randomUUID(),
    name: '未命名演示文稿',
    slides: [createDefaultSlide()],
    activeSlideIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export type AppType = 'doc' | 'sheet' | 'slide'

export interface RecentFile {
  id: string
  name: string
  type: AppType
  updatedAt: number
}
