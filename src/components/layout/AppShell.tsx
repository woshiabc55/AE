import { Link, NavLink, useLocation } from 'react-router-dom'
import { Compass, FileText, Film, Sparkles, Users, User, Plus, Search } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { useTemplateStore } from '../../stores/templateStore'
import { useUserStore } from '../../stores/userStore'

const navItems = [
  { to: '/', label: '工坊', icon: Film, end: true },
  { to: '/explore', label: '广场', icon: Compass },
  { to: '/team', label: '团队', icon: Users },
  { to: '/me', label: '我的', icon: User },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const createBlank = useTemplateStore((s) => s.createBlank)
  const author = useUserStore((s) => s.author)
  const quota = useUserStore((s) => s.quota)
  const location = useLocation()

  function handleNew() {
    const t = createBlank(author.id, author.name)
    window.location.href = `/editor/${t.id}`
  }

  return (
    <div className="min-h-screen flex bg-ink-950 text-bone-50">
      {/* 左侧边栏 */}
      <aside className="w-[240px] shrink-0 border-r border-ink-700 bg-ink-950/80 backdrop-blur flex flex-col">
        <div className="px-5 pt-6 pb-5">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <nav className="px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[6px] font-mono-ui text-[13px] transition-colors ${
                    isActive
                      ? 'bg-ink-800 text-amber-400 border-l-2 border-amber-500'
                      : 'text-bone-200 hover:bg-ink-800/60 hover:text-bone-50 border-l-2 border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.6} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-3 mt-6">
          <Button
            variant="primary"
            size="md"
            onClick={handleNew}
            iconLeft={<Plus className="w-4 h-4" />}
            className="w-full"
          >
            新建模板
          </Button>
        </div>

        <div className="px-3 mt-6">
          <div className="px-3 py-2 text-[10px] font-mono-ui tracking-widest text-bone-400 uppercase">
            试写配额
          </div>
          <div className="px-3 py-3 rounded-[6px] bg-ink-900 border border-ink-700">
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl text-amber-500 leading-none">
                {quota.used}
              </span>
              <span className="font-mono-ui text-[11px] text-bone-400">
                / {quota.total}
              </span>
            </div>
            <div className="mt-2 h-1 bg-ink-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${Math.min(100, (quota.used / quota.total) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] font-mono-ui text-bone-400">
              本月已生成 {quota.used} 次
            </div>
          </div>
        </div>

        <div className="mt-auto px-4 py-4 border-t border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-curtain-500 flex items-center justify-center font-display text-ink-950 text-[16px]">
              {author.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-bone-50 truncate">{author.name}</div>
              <div className="text-[10px] text-bone-400 truncate font-mono-ui">
                {author.bio}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* 顶部条 */}
        <header className="h-16 px-8 flex items-center gap-4 border-b border-ink-700 bg-ink-950/60 backdrop-blur sticky top-0 z-30">
          <Breadcrumb pathname={location.pathname} />
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-ink-700 bg-ink-900 text-bone-400">
              <Search className="w-3.5 h-3.5" />
              <input
                placeholder="搜索模板 / 变量 / 标签…"
                className="bg-transparent outline-none text-[12px] font-mono-ui w-56 placeholder:text-bone-400"
              />
              <kbd className="hidden lg:inline text-[10px] font-mono-ui text-bone-400 border border-ink-700 px-1.5 rounded">
                ⌘K
              </kbd>
            </div>
            <Button variant="ghost" size="sm" iconLeft={<Sparkles className="w-3.5 h-3.5" />}>
              升级 PRO
            </Button>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const map: Record<string, string> = {
    '/': '工坊仪表盘',
    '/explore': '模板广场',
    '/editor': '编辑器',
    '/stage': '试写舞台',
    '/team': '团队空间',
    '/me': '个人中心',
  }
  const root = pathname.split('/').filter(Boolean)[0] || '/'
  const label = map['/' + (root === 'editor' || root === 'stage' ? root : root)]
  return (
    <div className="flex items-center gap-2 text-[12px] font-mono-ui text-bone-400">
      <span>MUSE</span>
      <span className="text-ink-600">/</span>
      <span className="text-bone-50">{label || '工坊'}</span>
    </div>
  )
}
