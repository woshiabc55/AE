import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Cpu, Copy, Check, ArrowLeft, Tag, Code2, Wrench, FileCode } from 'lucide-react'
import { useAppStore, SKILLS_DATA } from '@/store/useAppStore'
import type { SkillItem } from '@/types'

const CATEGORY_CONFIG: Record<SkillItem['category'], { label: string; icon: typeof Wrench; color: string }> = {
  toolchain: { label: '工具链', icon: Wrench, color: '#00ff88' },
  template: { label: '模板', icon: FileCode, color: '#ff0066' },
  snippet: { label: '代码片段', icon: Code2, color: '#ffaa00' },
}

export default function SkillsPage() {
  const { skillsQuery, setSkillsQuery, setScriptCode } = useAppStore()
  const [activeCategory, setActiveCategory] = useState<SkillItem['category'] | 'all'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return SKILLS_DATA.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory
      const matchQuery =
        !skillsQuery ||
        item.name.toLowerCase().includes(skillsQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(skillsQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(skillsQuery.toLowerCase()))
      return matchCategory && matchQuery
    })
  }, [skillsQuery, activeCategory])

  const handleImport = (item: SkillItem) => {
    setScriptCode(item.code)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-200">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-[#0d0d14]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-zinc-500 hover:text-[#00ff88] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-mono">工作台</span>
            </Link>
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00ff88]" />
              <span className="text-lg font-bold tracking-wider font-mono text-[#00ff88]">
                技能库
              </span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono">
            {SKILLS_DATA.length} 开源工具
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={skillsQuery}
            onChange={(e) => setSkillsQuery(e.target.value)}
            placeholder="搜索技能、工具链、脚本模板..."
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 font-mono focus:outline-none focus:border-[#00ff88]/50 focus:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'toolchain', 'template', 'snippet'] as const).map((cat) => {
            const config = cat === 'all' ? null : CATEGORY_CONFIG[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 shadow-[0_0_12px_rgba(0,255,136,0.1)]'
                    : 'bg-zinc-900/40 text-zinc-500 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {config && <config.icon className="w-3 h-3" />}
                {cat === 'all' ? '全部' : config?.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const config = CATEGORY_CONFIG[item.category]
            return (
              <div
                key={item.id}
                className="group bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
                    >
                      <config.icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-mono text-zinc-200">{item.name}</h3>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleImport(item)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all duration-300 ${
                      copiedId === item.id
                        ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30'
                        : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700 hover:text-[#00ff88] hover:border-[#00ff88]/30'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        已导入
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        导入
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 font-mono mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-0.5 text-[10px] text-zinc-600 font-mono bg-zinc-800/40 px-1.5 py-0.5 rounded"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-[#0a0a0f] rounded-lg border border-zinc-800/60 p-3 max-h-32 overflow-hidden relative">
                  <pre className="text-[10px] text-zinc-600 font-mono leading-relaxed overflow-hidden">
                    <code>{item.code.slice(0, 200)}...</code>
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Search className="w-10 h-10 text-zinc-800 mx-auto" />
            <p className="text-sm text-zinc-600 font-mono">未找到匹配的技能</p>
            <p className="text-xs text-zinc-700 font-mono">尝试其他关键词或分类</p>
          </div>
        )}
      </div>
    </div>
  )
}
