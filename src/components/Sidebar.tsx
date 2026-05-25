import { useAppStore } from '@/store/appStore'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Megaphone, FolderOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

const navItems = [
  { path: '/', label: '秒哒平台', icon: LayoutDashboard },
  { path: '/promotion', label: '推广中心', icon: Megaphone },
  { path: '/resources', label: '资源中心', icon: FolderOpen },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside
      className={`h-screen flex flex-col bg-zinc-900 text-zinc-100 transition-all duration-300 ease-in-out relative ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold tracking-wide whitespace-nowrap">秒哒推广助手</span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              {!sidebarCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors z-10"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className="px-4 py-3 border-t border-zinc-800">
        {!sidebarCollapsed && (
          <div className="text-xs text-zinc-600">v1.0.0</div>
        )}
      </div>
    </aside>
  )
}
