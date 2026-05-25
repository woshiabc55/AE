import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  FileText,
  Table2,
  Presentation,
  ChevronLeft,
} from 'lucide-react'
import type { AppType } from '@/types'

const NAV_ITEMS: {
  type: AppType | 'home'
  name: string
  icon: typeof LayoutGrid
  path: string
}[] = [
  { type: 'home', name: '启动台', icon: LayoutGrid, path: '/' },
  { type: 'doc', name: '文档', icon: FileText, path: '/doc' },
  { type: 'sheet', name: '表格', icon: Table2, path: '/sheet' },
  { type: 'slide', name: '演示', icon: Presentation, path: '/slide' },
]

interface AppShellProps {
  children: React.ReactNode
  appType?: AppType | 'home'
  appName?: string
}

export default function AppShell({ children, appType = 'home', appName }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="flex h-screen bg-[#FAFAF5] overflow-hidden">
      <nav className="w-14 bg-[#1B4332] flex flex-col items-center py-3 shrink-0 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.type === 'home'
              ? isHome
              : location.pathname.startsWith(item.path)

          return (
            <button
              key={item.type}
              onClick={() => navigate(item.path)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#52B788] text-white shadow-lg shadow-[#52B788]/30'
                  : 'text-[#b7e4c7] hover:bg-[#2D6A4F] hover:text-white'
              }`}
              title={item.name}
            >
              <Icon size={18} />
              <div className="absolute left-12 bg-[#2D3436] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {item.name}
              </div>
            </button>
          )
        })}
      </nav>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isHome && (
          <div className="h-10 bg-white border-b border-[#e5e5e5] flex items-center px-3 gap-2 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-xs text-[#999] hover:text-[#1B4332] transition-colors"
            >
              <ChevronLeft size={14} />
              启动台
            </button>
            <span className="text-xs text-[#d4d4d4]">/</span>
            <span className="text-xs text-[#1B4332] font-medium">{appName || ''}</span>
          </div>
        )}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
