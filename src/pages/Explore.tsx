import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDownUp, Copy, Filter, PlayCircle, Search, Star, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { useTemplateStore } from '../stores/templateStore'
import { useUserStore } from '../stores/userStore'
import { CATEGORY_LABEL, type Category } from '../lib/types'

const CATEGORIES: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'short_drama', label: '短剧' },
  { key: 'short_video', label: '短视频' },
  { key: 'ad', label: '广告' },
  { key: 'mv', label: 'MV' },
  { key: 'anime', label: '动漫' },
  { key: 'game', label: '游戏' },
  { key: 'custom', label: '其他' },
]

const SORTS = [
  { key: 'rating', label: '评分优先' },
  { key: 'clones', label: '克隆最多' },
  { key: 'newest', label: '最新发布' },
] as const

type SortKey = (typeof SORTS)[number]['key']

export function Explore() {
  const navigate = useNavigate()
  const templates = useTemplateStore((s) => s.templates)
  const clone = useTemplateStore((s) => s.clone)
  const author = useUserStore((s) => s.author)
  const incrementQuota = useUserStore((s) => s.incrementQuota)

  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('rating')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const s = new Set<string>()
    templates.forEach((t) => t.tags.forEach((tag) => s.add(tag)))
    return Array.from(s)
  }, [templates])

  const filtered = useMemo(() => {
    let list = templates.filter((t) => t.visibility === 'public')
    if (activeCat !== 'all') list = list.filter((t) => t.category === activeCat)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }
    if (activeTags.length) {
      list = list.filter((t) => activeTags.every((tag) => t.tags.includes(tag)))
    }
    list = [...list]
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'clones') list.sort((a, b) => b.cloneCount - a.cloneCount)
    if (sort === 'newest') list.sort((a, b) => b.updatedAt - a.updatedAt)
    return list
  }, [templates, activeCat, query, activeTags, sort])

  function handleClone(id: string) {
    const copy = clone(id, author.id, author.name)
    navigate(`/editor/${copy.id}`)
  }
  function handleTry(id: string) {
    incrementQuota()
    navigate(`/stage/${id}`)
  }
  function toggleTag(t: string) {
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )
  }

  return (
    <div className="px-8 py-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-ui tracking-widest text-amber-500 uppercase">
            <span className="marquee-dot" /> Public · Library
          </div>
          <h1 className="mt-3 font-display text-[52px] leading-tight text-bone-50">
            模板广场
          </h1>
          <p className="mt-2 text-bone-300 max-w-xl">
            从 {templates.length} 份精选模板中寻找灵感。点击克隆即可复制到自己的工作区二次创作。
          </p>
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-ink-700 bg-ink-900 text-bone-400 min-w-[280px]">
            <Search className="w-3.5 h-3.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题、标签、描述…"
              className="bg-transparent outline-none text-[12px] font-mono-ui flex-1 placeholder:text-bone-400"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="w-3 h-3 hover:text-amber-400" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-ink-700 bg-ink-900">
            <ArrowDownUp className="w-3.5 h-3.5 text-bone-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent text-[12px] font-mono-ui text-bone-200 outline-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-ink-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono-ui text-bone-400 uppercase tracking-widest mr-2">
          <Filter className="w-3 h-3" /> 类型
        </div>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} active={activeCat === c.key} onClick={() => setActiveCat(c.key)}>
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono-ui text-bone-400 uppercase tracking-widest mr-2">
          # 标签
        </div>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            size="sm"
            active={activeTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Chip>
        ))}
        {activeTags.length > 0 && (
          <button
            onClick={() => setActiveTags([])}
            className="text-[11px] font-mono-ui text-bone-400 hover:text-amber-400 ml-2"
          >
            清空 ({activeTags.length})
          </button>
        )}
      </div>

      {/* 卡片网格 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] font-mono-ui text-bone-400">
            共 <span className="text-amber-400">{filtered.length}</span> 份模板
          </div>
        </div>
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-display text-[24px] text-bone-50">没有匹配的模板</p>
            <p className="text-[12px] text-bone-400 mt-2">
              尝试更换关键词、清空标签，或切换到"全部"分类。
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <Card
                key={t.id}
                hoverable
                className="overflow-hidden flex flex-col animate-floatUp"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="aspect-[16/9] relative bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-4 border-b border-ink-700">
                  <div className="absolute top-3 left-3">
                    <Chip size="sm" active>
                      {CATEGORY_LABEL[t.category]}
                    </Chip>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono-ui text-amber-400">
                    <Star className="w-3 h-3" /> {t.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display text-bone-100 text-[15px] leading-snug line-clamp-3">
                      {t.sections[0]?.body || '暂无摘要'}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display text-[22px] text-bone-50 leading-tight">
                    {t.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] text-bone-300 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono-ui text-bone-400 border border-ink-700 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/80 to-curtain-500/60 flex items-center justify-center text-[10px] text-ink-950 font-display">
                        {t.author.name.slice(0, 1)}
                      </div>
                      <span className="text-[11px] font-mono-ui text-bone-300 truncate">
                        {t.author.name}
                      </span>
                      <span className="text-[10px] text-bone-400 font-mono-ui">· {t.cloneCount}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        iconLeft={<Copy className="w-3 h-3" />}
                        onClick={() => handleClone(t.id)}
                      >
                        克隆
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        iconLeft={<PlayCircle className="w-3 h-3" />}
                        onClick={() => handleTry(t.id)}
                      >
                        试写
                      </Button>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/editor/${t.id}`}
                  className="block px-5 py-2 text-center text-[10px] font-mono-ui text-bone-400 hover:text-amber-400 border-t border-ink-700 uppercase tracking-widest"
                >
                  查看模板详情 →
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
