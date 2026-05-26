export interface ColorBlock {
  hex: string
  rgb: [number, number, number]
  percentage: number
}

export interface ExtractedFrame {
  timestamp: number
  colorBlocks: ColorBlock[]
  thumbnail: string
}

export interface SkillItem {
  id: string
  name: string
  description: string
  tags: string[]
  code: string
  category: 'toolchain' | 'template' | 'snippet'
}

export interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'video'
  url: string
  file: File
}
