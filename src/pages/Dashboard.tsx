import { useNavigate } from 'react-router-dom'
import type { AppType } from '@/types'
import {
  FileText,
  Table2,
  Presentation,
  Plus,
  Clock,
  ArrowRight,
} from 'lucide-react'

const APPS: {
  type: AppType
  name: string
  desc: string
  icon: typeof FileText
  accent: string
  accentDim: string
  glow: string
  path: string
}[] = [
  {
    type: 'doc',
    name: 'TabDoc',
    desc: '文档编辑器',
    icon: FileText,
    accent: 'var(--accent-doc)',
    accentDim: 'var(--accent-doc-dim)',
    glow: 'var(--glow-doc)',
    path: '/doc',
  },
  {
    type: 'sheet',
    name: 'TabSheet',
    desc: '电子表格',
    icon: Table2,
    accent: 'var(--accent-sheet)',
    accentDim: 'var(--accent-sheet-dim)',
    glow: 'var(--glow-sheet)',
    path: '/sheet',
  },
  {
    type: 'slide',
    name: 'TabSlide',
    desc: '演示文稿',
    icon: Presentation,
    accent: 'var(--accent-slide)',
    accentDim: 'var(--accent-slide-dim)',
    glow: 'var(--glow-slide)',
    path: '/slide',
  },
]

const TEMPLATES = [
  { name: '空白文档', type: 'doc' as AppType },
  { name: '空白表格', type: 'sheet' as AppType },
  { name: '空白演示', type: 'slide' as AppType },
  { name: '会议纪要', type: 'doc' as AppType },
  { name: '项目计划', type: 'sheet' as AppType },
  { name: '产品介绍', type: 'slide' as AppType },
]

const RECENT_FILES = [
  { name: '项目周报', type: 'doc' as AppType, time: '今天 14:30' },
  { name: '财务报表 Q4', type: 'sheet' as AppType, time: '今天 10:15' },
  { name: '产品发布会', type: 'slide' as AppType, time: '昨天 16:45' },
  { name: '需求文档 v2', type: 'doc' as AppType, time: '昨天 09:20' },
  { name: '数据分析', type: 'sheet' as AppType, time: '3天前' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const goToApp = (type: AppType) => {
    const app = APPS.find((a) => a.type === type)
    if (app) navigate(app.path)
  }

  return (
    <div className="h-full overflow-auto noise-bg" style={{ background: 'var(--bg-base)' }}>
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10">
        <section className="mb-14 animate-fade-up">
          <div className="flex items-baseline gap-4 mb-2">
            <h1
              className="font-display text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              TabOffice
            </h1>
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Suite
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            轻量办公，即刻开始
          </p>
        </section>

        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={14} style={{ color: 'var(--text-muted)' }} />
            <h2
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              新建
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {APPS.map((app, i) => {
              const Icon = app.icon
              return (
                <button
                  key={app.type}
                  onClick={() => goToApp(app.type)}
                  className="group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 animate-fade-up"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    animationDelay: `${i * 80}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${app.accentDim}88`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 32px ${app.glow}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${app.accentDim}44, ${app.accent}22)`,
                      border: `1px solid ${app.accentDim}44`,
                    }}
                  >
                    <Icon size={24} style={{ color: app.accent }} />
                  </div>
                  <h3
                    className="font-display text-base font-bold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {app.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {app.desc}
                  </p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to right, transparent, ${app.accent}, transparent)`,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
            <h2
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              快速开始
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map((tpl, i) => {
              const app = APPS.find((a) => a.type === tpl.type)!
              const Icon = app.icon
              return (
                <button
                  key={i}
                  onClick={() => goToApp(tpl.type)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group animate-fade-up"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    animationDelay: `${300 + i * 60}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${app.accentDim}66`
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.background = 'var(--bg-surface)'
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: `${app.accentDim}22`,
                    }}
                  >
                    <Icon size={14} style={{ color: app.accent }} />
                  </div>
                  <span
                    className="text-sm font-medium group-hover:translate-x-0.5 transition-transform"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {tpl.name}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-5">
            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
            <h2
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              最近文件
            </h2>
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="px-5 py-3 flex items-center text-[10px] font-mono tracking-wider uppercase"
              style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              <span className="flex-1">文件名</span>
              <span className="w-20 text-center">类型</span>
              <span className="w-28 text-right">最近打开</span>
            </div>
            {RECENT_FILES.map((file, i) => {
              const app = APPS.find((a) => a.type === file.type)!
              const Icon = app.icon
              return (
                <button
                  key={i}
                  onClick={() => goToApp(file.type)}
                  className="w-full px-5 py-2.5 flex items-center transition-all duration-150 group"
                  style={{
                    borderBottom: i < RECENT_FILES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span className="flex-1 flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${app.accentDim}22` }}
                    >
                      <Icon size={12} style={{ color: app.accent }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {file.name}
                    </span>
                  </span>
                  <span
                    className="w-20 text-center text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: `${app.accentDim}22`,
                      color: app.accent,
                    }}
                  >
                    {app.desc}
                  </span>
                  <span className="w-28 text-right text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {file.time}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <footer className="mt-16 mb-8 text-center">
          <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>
            TABOFFICE · PRODUCTIVITY SUITE
          </span>
        </footer>
      </div>
    </div>
  )
}
