import { Database, HardDrive, Settings, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

const navItems = [
  { id: 'data-storage', label: '数据-存储', icon: Database },
  { id: 'disk', label: '磁盘', icon: HardDrive },
  { id: 'settings', label: '设置', icon: Settings },
]

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-56 flex-col border-r border-[#2a2a45] bg-[#0d0d1a]/80">
      <div className="flex h-12 items-center gap-2.5 border-b border-[#2a2a45] px-5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#0f9b8e] shadow-[0_0_8px_rgba(15,155,142,0.5)]" />
        <span className="text-sm font-medium tracking-wider text-[#e8e8f0]">
          STORAGE
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200',
                isActive
                  ? 'bg-[#0f9b8e]/10 text-[#0f9b8e]'
                  : 'text-[#8888a0] hover:bg-[#1a1a2e] hover:text-[#e8e8f0]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-200',
                  isActive
                    ? 'translate-x-0 text-[#0f9b8e]'
                    : '-translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-[#8888a0]'
                )}
              />
            </button>
          )
        })}
      </nav>
      <div className="border-t border-[#2a2a45] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#0f9b8e]" />
          <span className="text-xs text-[#8888a0]">本地存储模式</span>
        </div>
      </div>
    </aside>
  )
}
