export interface WindowState {
  id: string
  appId: string
  title: string
  icon: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

export interface SystemSettings {
  theme: 'light' | 'dark'
  wallpaper: string
  scale: number
  volume: number
  brightness: number
  doNotDisturb: boolean
}

export interface AppNotification {
  id: string
  title: string
  content: string
  timestamp: number
  read: boolean
}

export interface AppDefinition {
  id: string
  name: string
  icon: string
  category: 'system' | 'utility' | 'productivity'
  defaultSize: { width: number; height: number }
  minSize: { width: number; height: number }
}

export interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: string
  modified?: string
  icon: string
  children?: FileItem[]
  isUploaded?: boolean
}

export interface DesktopIconItem {
  id: string
  appId: string
  label: string
  icon: string
  position: { x: number; y: number }
}

export interface ContextMenuItem {
  label: string
  icon?: string
  action: () => void
  separator?: boolean
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: number
}
