import { useLocation } from 'react-router-dom'
import { Bell, Search, User } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/': '秒哒平台',
  '/promotion': '推广中心',
  '/resources': '资源中心',
}

export default function TopBar() {
  const location = useLocation()
  const currentLabel = routeLabels[location.pathname] || '秒哒推广助手'

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-zinc-800">{currentLabel}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索功能..."
            className="w-48 h-8 pl-9 pr-3 text-sm bg-zinc-100 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors">
          <Bell className="w-4 h-4 text-zinc-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors">
          <User className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </header>
  )
}
