import type { AppDefinition, FileItem, DesktopIconItem } from '@/types'
import {
  Folder,
  Terminal,
  FileText,
  Settings,
  Calculator,
  HardDrive,
  File,
  Image,
  Music,
  Video,
  Archive,
  Code,
  FileSpreadsheet,
} from 'lucide-react'

export const APP_DEFINITIONS: AppDefinition[] = [
  {
    id: 'file-manager',
    name: '文件管理器',
    icon: 'folder',
    category: 'system',
    defaultSize: { width: 800, height: 500 },
    minSize: { width: 500, height: 350 },
  },
  {
    id: 'terminal',
    name: '终端',
    icon: 'terminal',
    category: 'utility',
    defaultSize: { width: 700, height: 450 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: 'text-editor',
    name: '文本编辑器',
    icon: 'file-text',
    category: 'productivity',
    defaultSize: { width: 750, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: 'system-settings',
    name: '系统设置',
    icon: 'settings',
    category: 'system',
    defaultSize: { width: 700, height: 480 },
    minSize: { width: 500, height: 350 },
  },
  {
    id: 'calculator',
    name: '计算器',
    icon: 'calculator',
    category: 'utility',
    defaultSize: { width: 340, height: 480 },
    minSize: { width: 280, height: 400 },
  },
]

export const DESKTOP_ICONS: DesktopIconItem[] = [
  { id: 'di-1', appId: 'file-manager', label: '文件管理器', icon: 'folder', position: { x: 0, y: 0 } },
  { id: 'di-2', appId: 'terminal', label: '终端', icon: 'terminal', position: { x: 0, y: 1 } },
  { id: 'di-3', appId: 'text-editor', label: '文本编辑器', icon: 'file-text', position: { x: 0, y: 2 } },
  { id: 'di-4', appId: 'system-settings', label: '系统设置', icon: 'settings', position: { x: 0, y: 3 } },
  { id: 'di-5', appId: 'calculator', label: '计算器', icon: 'calculator', position: { x: 0, y: 4 } },
]

export const MOCK_FILE_SYSTEM: FileItem[] = [
  {
    name: '文档',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: '项目计划.txt', type: 'file', size: '2.4 KB', modified: '2026-05-28', icon: 'file-text' },
      { name: '会议记录.md', type: 'file', size: '5.1 KB', modified: '2026-05-30', icon: 'file-text' },
      { name: '需求文档.pdf', type: 'file', size: '1.2 MB', modified: '2026-05-25', icon: 'file' },
    ],
  },
  {
    name: '下载',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: '安装包.zip', type: 'file', size: '45.2 MB', modified: '2026-05-29', icon: 'archive' },
      { name: '壁纸.jpg', type: 'file', size: '3.8 MB', modified: '2026-05-27', icon: 'image' },
    ],
  },
  {
    name: '图片',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: '截图_01.png', type: 'file', size: '856 KB', modified: '2026-05-30', icon: 'image' },
      { name: '头像.jpg', type: 'file', size: '2.1 MB', modified: '2026-05-20', icon: 'image' },
    ],
  },
  {
    name: '音乐',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: 'playlist.m3u', type: 'file', size: '1.2 KB', modified: '2026-05-15', icon: 'music' },
    ],
  },
  {
    name: '视频',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: '教程.mp4', type: 'file', size: '256 MB', modified: '2026-05-22', icon: 'video' },
    ],
  },
  {
    name: '代码',
    type: 'folder',
    icon: 'folder',
    children: [
      { name: 'index.tsx', type: 'file', size: '4.2 KB', modified: '2026-05-31', icon: 'code' },
      { name: 'styles.css', type: 'file', size: '1.8 KB', modified: '2026-05-31', icon: 'code' },
      { name: 'data.json', type: 'file', size: '12.5 KB', modified: '2026-05-30', icon: 'file-spreadsheet' },
    ],
  },
  {
    name: '系统日志.log',
    type: 'file',
    size: '128 KB',
    modified: '2026-05-31',
    icon: 'file-text',
  },
]

export const WALLPAPERS = [
  'linear-gradient(135deg, #0a0e27 0%, #1a1a4e 30%, #2d1b69 60%, #0a0e27 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #1a0533 0%, #3a0647 30%, #6b1d5e 60%, #c94b4b 100%)',
  'linear-gradient(135deg, #0c0c1d 0%, #1b2838 40%, #2a4858 70%, #0c0c1d 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)',
]

export const TERMINAL_COMMANDS: Record<string, (args: string[]) => string> = {
  help: () =>
    '可用命令: ls, cd, pwd, clear, help, date, echo, whoami, cat, uname',
  ls: () => '文档  下载  图片  音乐  视频  代码  系统日志.log',
  pwd: () => '/home/user',
  whoami: () => 'user',
  date: () => new Date().toLocaleString('zh-CN'),
  echo: (args) => args.join(' '),
  uname: () => 'ConceptOS 1.0.0 (Web/x86_64)',
  cat: (args) => {
    if (args.length === 0) return '用法: cat <文件名>'
    return `cat: ${args[0]}: 文件内容加载中...`
  },
  cd: () => '',
}

export const ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  folder: Folder,
  terminal: Terminal,
  'file-text': FileText,
  settings: Settings,
  calculator: Calculator,
  'hard-drive': HardDrive,
  file: File,
  image: Image,
  music: Music,
  video: Video,
  archive: Archive,
  code: Code,
  'file-spreadsheet': FileSpreadsheet,
}
