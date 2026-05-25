import { useNavigate } from 'react-router-dom'
import type { AppType } from '@/types'
import {
  FileText,
  Table2,
  Presentation,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react'

const APPS: {
  type: AppType
  name: string
  desc: string
  icon: typeof FileText
  color: string
  bg: string
  path: string
  gradient: string
}[] = [
  {
    type: 'doc',
    name: 'TabDoc',
    desc: '文档编辑器',
    icon: FileText,
    color: '#1E40AF',
    bg: '#DBEAFE',
    path: '/doc',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    type: 'sheet',
    name: 'TabSheet',
    desc: '电子表格',
    icon: Table2,
    color: '#1B4332',
    bg: '#DCFCE7',
    path: '/sheet',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    type: 'slide',
    name: 'TabSlide',
    desc: '演示文稿',
    icon: Presentation,
    color: '#9F1239',
    bg: '#FCE7F3',
    path: '/slide',
    gradient: 'from-rose-600 to-pink-700',
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

export default function Dashboard() {
  const navigate = useNavigate()

  const goToApp = (type: AppType) => {
    const app = APPS.find((a) => a.type === type)
    if (app) navigate(app.path)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <header className="bg-[#1B4332] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52B788] to-[#2D6A4F] flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">TabOffice</h1>
            <p className="text-[10px] text-[#b7e4c7] tracking-widest uppercase">Productivity Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#b7e4c7]">轻量办公，即刻开始</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Plus size={18} className="text-[#1B4332]" />
            <h2 className="text-lg font-bold text-[#1B4332]">新建</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {APPS.map((app) => {
              const Icon = app.icon
              return (
                <button
                  key={app.type}
                  onClick={() => goToApp(app.type)}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-[#e5e5e5] p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-[#1B4332]/8 hover:-translate-y-1 hover:border-[#52B788]/30"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: app.bg }}
                  >
                    <Icon size={28} style={{ color: app.color }} />
                  </div>
                  <h3 className="text-base font-bold text-[#2D3436] mb-1">{app.name}</h3>
                  <p className="text-sm text-[#999]">{app.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${app.color}, ${app.color}88)`,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-[#1B4332]" />
            <h2 className="text-lg font-bold text-[#1B4332]">快速开始</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((tpl, i) => {
              const app = APPS.find((a) => a.type === tpl.type)!
              const Icon = app.icon
              return (
                <button
                  key={i}
                  onClick={() => goToApp(tpl.type)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#52B788]/40 hover:bg-[#f0fdf4] transition-all duration-200 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: app.bg }}
                  >
                    <Icon size={16} style={{ color: app.color }} />
                  </div>
                  <span className="text-sm text-[#2D3436] group-hover:text-[#1B4332] font-medium">
                    {tpl.name}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-[#1B4332]" />
            <h2 className="text-lg font-bold text-[#1B4332]">最近文件</h2>
          </div>
          <div className="rounded-2xl bg-white border border-[#e5e5e5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center text-xs text-[#999] font-medium">
              <span className="flex-1">文件名</span>
              <span className="w-24 text-center">类型</span>
              <span className="w-32 text-right">最近打开</span>
            </div>
            {[
              { name: '项目周报', type: 'doc' as AppType, time: '今天 14:30' },
              { name: '财务报表 Q4', type: 'sheet' as AppType, time: '今天 10:15' },
              { name: '产品发布会', type: 'slide' as AppType, time: '昨天 16:45' },
              { name: '需求文档 v2', type: 'doc' as AppType, time: '昨天 09:20' },
              { name: '数据分析', type: 'sheet' as AppType, time: '3天前' },
            ].map((file, i) => {
              const app = APPS.find((a) => a.type === file.type)!
              const Icon = app.icon
              return (
                <button
                  key={i}
                  onClick={() => goToApp(file.type)}
                  className="w-full px-6 py-3 flex items-center hover:bg-[#f0fdf4] transition-colors duration-150 group"
                >
                  <span className="flex-1 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: app.bg }}
                    >
                      <Icon size={14} style={{ color: app.color }} />
                    </div>
                    <span className="text-sm text-[#2D3436] group-hover:text-[#1B4332] font-medium">
                      {file.name}
                    </span>
                  </span>
                  <span
                    className="w-24 text-center text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: app.bg, color: app.color }}
                  >
                    {app.desc}
                  </span>
                  <span className="w-32 text-right text-xs text-[#999]">{file.time}</span>
                </button>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-[#bbb]">
        TabOffice Suite · 轻量级在线办公工具
      </footer>
    </div>
  )
}
