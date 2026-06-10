import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Clapperboard,
  Flame,
  PlayCircle,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  Wand2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { MarqueeTitle } from '../components/ui/MarqueeTitle'
import { useTemplateStore } from '../stores/templateStore'
import { useUserStore } from '../stores/userStore'
import { CATEGORY_LABEL, type Category, type PromptTemplate } from '../lib/types'
import { wordCount } from '../lib/variableParser'

const QUOTES = [
  '写好提示词，是给 AI 写一份"给演员的剧本"。',
  '变量不是填空，是把灵感工程化。',
  '每一条好 prompt，都值得被版本化。',
  '先定角色，再定场景，AI 才有戏。',
  '风格基调，决定观众的情绪温度。',
]

export function Dashboard() {
  const navigate = useNavigate()
  const templates = useTemplateStore((s) => s.templates)
  const createBlank = useTemplateStore((s) => s.createBlank)
  const author = useUserStore((s) => s.author)
  const incrementQuota = useUserStore((s) => s.incrementQuota)

  const myTemplates = useMemo(
    () => templates.filter((t) => t.author.id === author.id).slice(0, 6),
    [templates, author.id],
  )
  const featured = useMemo(
    () =>
      templates
        .filter((t) => t.visibility === 'public')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [templates],
  )
  const trending = useMemo(
    () =>
      templates
        .filter((t) => t.visibility === 'public')
        .sort((a, b) => b.cloneCount - a.cloneCount)
        .slice(0, 5),
    [templates],
  )

  function handleNew() {
    const t = createBlank(author.id, author.name)
    navigate(`/editor/${t.id}`)
  }
  function handleQuickStart(t: PromptTemplate) {
    incrementQuota()
    navigate(`/stage/${t.id}`)
  }

  return (
    <div className="px-8 py-8 space-y-12 max-w-[1400px] mx-auto">
      {/* 灵感位 */}
      <section className="relative overflow-hidden rounded-[12px] border border-ink-700 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 p-10">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-10 w-96 h-96 bg-amber-500/20 blur-[120px] rounded-full animate-breath" />
          <div className="absolute -bottom-32 right-0 w-[28rem] h-[28rem] bg-curtain-500/15 blur-[140px] rounded-full" />
        </div>
        <div className="relative z-10 grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="marquee-dot" />
                <span className="marquee-dot" />
                <span className="marquee-dot" />
              </div>
              <span className="font-mono-ui text-[10px] tracking-[0.3em] text-amber-500 uppercase">
                Screening · Room · 02
              </span>
            </div>
            <h1 className="font-display text-[64px] leading-[1.05] text-bone-50 text-balance">
              <MarqueeTitle text="欢迎回来，" stagger delay={40} />
              <br />
              <MarqueeTitle
                text="今天给 AI 写一本怎样的剧本？"
                stagger
                delay={40}
                className="text-amber-500 italic"
              />
            </h1>
            <p className="text-bone-200 max-w-2xl text-[15px] leading-relaxed">
              在 <span className="text-amber-400 font-mono-ui">MUSE</span>，
              一条 prompt 不再是一次性指令，而是一份可复用、可参数化、可被剧组反复演出的"剧本模板"。
              把灵感沉淀为结构化资产，让 AI 真正读懂你的创作意图。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                iconLeft={<Plus className="w-4 h-4" />}
                onClick={handleNew}
              >
                新建空白模板
              </Button>
              <Link to="/explore">
                <Button variant="outline" size="lg" iconRight={<ArrowUpRight className="w-4 h-4" />}>
                  逛逛广场
                </Button>
              </Link>
              <span className="font-mono-ui text-[11px] text-bone-400 ml-2">
                <kbd className="border border-ink-700 px-1.5 py-0.5 rounded">⌘N</kbd> 新建
                · <kbd className="border border-ink-700 px-1.5 py-0.5 rounded">⌘E</kbd> 编辑
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-[8px] border border-ink-700 bg-ink-950/60 p-5">
              <div className="flex items-center gap-2 text-bone-400 text-[10px] font-mono-ui tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-amber-500" />
                今日金句
              </div>
              <p className="mt-3 font-display text-[22px] leading-snug text-bone-50 italic">
                "{QUOTES[new Date().getDate() % QUOTES.length]}"
              </p>
              <div className="mt-4 pt-4 border-t border-ink-700 text-[11px] font-mono-ui text-bone-400">
                —— 幕启编辑部
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速试写 / 精选 */}
      <section className="space-y-5">
        <SectionTitle
          icon={<Wand2 className="w-4 h-4 text-amber-500" />}
          title="精选模板 · 一键试写"
          action={
            <Link
              to="/explore"
              className="text-[12px] font-mono-ui text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              查看全部 <ArrowUpRight className="w-3 h-3" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((t) => (
            <Card key={t.id} hoverable className="p-6 flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-mono-ui tracking-widest text-amber-500 uppercase">
                <Flame className="w-3 h-3" />
                {CATEGORY_LABEL[t.category]}
                <span className="text-bone-400">·</span>
                <span className="text-bone-400 flex items-center gap-1">
                  <Star className="w-3 h-3" /> {t.rating}
                </span>
              </div>
              <h3 className="mt-3 font-display text-[24px] leading-tight text-bone-50">
                {t.title}
              </h3>
              <p className="mt-2 text-[12px] text-bone-300 line-clamp-2">{t.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.tags.slice(0, 3).map((tag) => (
                  <Chip key={tag} size="sm" disabled>
                    {tag}
                  </Chip>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-ink-700 flex items-center justify-between">
                <div className="text-[11px] font-mono-ui text-bone-400">
                  by {t.author.name} · {t.cloneCount} 克隆
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  iconLeft={<PlayCircle className="w-3.5 h-3.5" />}
                  onClick={() => handleQuickStart(t)}
                >
                  试写
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 我的模板 */}
      <section className="space-y-5">
        <SectionTitle
          icon={<Clapperboard className="w-4 h-4 text-amber-500" />}
          title="我的剧本库"
          action={
            <Button
              size="sm"
              variant="ghost"
              iconLeft={<Plus className="w-3 h-3" />}
              onClick={handleNew}
            >
              新建空白
            </Button>
          }
        />
        {myTemplates.length === 0 ? (
          <EmptyState onCreate={handleNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myTemplates.map((t) => (
              <Link key={t.id} to={`/editor/${t.id}`}>
                <Card hoverable className="overflow-hidden h-full flex flex-col">
                  <div className="aspect-[16/9] relative bg-gradient-to-br from-ink-800 to-ink-950 border-b border-ink-700 p-4">
                    <div className="absolute top-2 right-2">
                      <Chip size="sm" active>
                        {CATEGORY_LABEL[t.category]}
                      </Chip>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono-ui text-bone-400">
                      {wordCount(t.sections.map((s) => s.body).join(' '))} 字
                    </div>
                    <div className="font-display text-bone-100 text-[18px] leading-snug line-clamp-3">
                      {t.sections[0]?.body || '尚未填写'}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-display text-[18px] text-bone-50">{t.title}</div>
                    <div className="mt-1 text-[11px] font-mono-ui text-bone-400">
                      最后编辑：{timeAgo(t.updatedAt)}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Chip size="sm">{t.variables.length} 变量</Chip>
                      <Chip size="sm">{t.versions.length} 版本</Chip>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 热门趋势 */}
      <section className="space-y-5">
        <SectionTitle
          icon={<TrendingUp className="w-4 h-4 text-amber-500" />}
          title="广场 · 热门趋势"
        />
        <Card className="p-2">
          <ul>
            {trending.map((t, i) => (
              <li
                key={t.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-ink-800/50 rounded-[6px] transition-colors"
              >
                <span className="font-display text-2xl text-amber-500 w-8 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono-ui text-[13px] text-bone-50 truncate">
                    {t.title}
                  </div>
                  <div className="text-[11px] font-mono-ui text-bone-400">
                    by {t.author.name} · {CATEGORY_LABEL[t.category]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-amber-400 font-mono-ui">
                    {t.cloneCount}
                  </div>
                  <div className="text-[10px] text-bone-400 font-mono-ui uppercase">
                    clones
                  </div>
                </div>
                <Link to={`/editor/${t.id}`}>
                  <Button size="sm" variant="ghost">
                    查看
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="flex items-center gap-2.5 font-display text-[28px] text-bone-50">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-full border border-ink-700 flex items-center justify-center">
        <Clapperboard className="w-7 h-7 text-amber-500" />
      </div>
      <h3 className="mt-4 font-display text-[24px] text-bone-50">
        你的剧本库还是空的
      </h3>
      <p className="mt-2 text-[13px] text-bone-300 max-w-md mx-auto">
        灵感不必从空白开始——克隆一个广场模板，或从零新建一份。
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <Button variant="primary" iconLeft={<Plus className="w-4 h-4" />} onClick={onCreate}>
          新建空白模板
        </Button>
        <Link to="/explore">
          <Button variant="outline">去广场挑一个</Button>
        </Link>
      </div>
    </Card>
  )
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min} 分钟前`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} 小时前`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} 天前`
  return new Date(ts).toLocaleDateString()
}
