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
  accent: string
  accentDim: string
}[] = [
  { type: 'home', name: '启动台', icon: LayoutGrid, path: '/', accent: 'var(--accent-home)', accentDim: 'var(--accent-sheet-dim)' },
  { type: 'doc', name: '文档', icon: FileText, path: '/doc', accent: 'var(--accent-doc)', accentDim: 'var(--accent-doc-dim)' },
  { type: 'sheet', name: '表格', icon: Table2, path: '/sheet', accent: 'var(--accent-sheet)', accentDim: 'var(--accent-sheet-dim)' },
  { type: 'slide', name: '演示', icon: Presentation, path: '/slide', accent: 'var(--accent-slide)', accentDim: 'var(--accent-slide-dim)' },
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

  const currentNav = NAV_ITEMS.find((n) =>
    n.type === 'home' ? isHome : location.pathname.startsWith(n.path)
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <nav
        className="w-[60px] flex flex-col items-center py-4 shrink-0 relative noise-bg"
        style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
      >
        <div className="absolute inset-0" style={{ zIndex: 0 }} />

        <div className="relative z-10 flex flex-col items-center gap-1 flex-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--accent-sheet-dim), var(--accent-sheet))',
            }}
            onClick={() => navigate('/')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0" y="0" width="6" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="8" y="0" width="6" height="6" rx="1" fill="white" opacity="0.5" />
              <rect x="0" y="8" width="6" height="6" rx="1" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="6" height="6" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>

          <div className="w-6 mb-2" style={{ height: '1px', background: 'var(--border-subtle)' }} />

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
                className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: isActive ? `${item.accent}18` : 'transparent',
                  color: isActive ? item.accent : 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-overlay)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
                title={item.name}
              >
                <Icon size={18} />
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full animate-pulse-glow"
                    style={{ background: item.accent }}
                  />
                )}
                <div
                  className="absolute left-[52px] px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{
                    background: 'var(--bg-overlay)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {item.name}
                </div>
              </button>
            )
          })}
        </div>

        <div className="relative z-10 text-[9px] font-mono" style={{ color: 'var(--text-muted)', writingMode: 'vertical-rl' }}>
          v1.0
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isHome && (
          <div
            className="h-9 flex items-center px-4 gap-2 shrink-0"
            style={{
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ChevronLeft size={12} />
              启动台
            </button>
            <span style={{ color: 'var(--border-default)' }}>/</span>
            <span className="text-xs font-medium" style={{ color: currentNav?.accent || 'var(--text-primary)' }}>
              {appName || ''}
            </span>
          </div>
        )}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
