import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { SECTION_DEFS, type PromptSection } from '../../lib/types'
import { Textarea } from '../ui/Field'
import { wordCount } from '../../lib/variableParser'

interface SectionBlockProps {
  section: PromptSection
  onChange: (patch: Partial<PromptSection>) => void
  onTitleChange: (title: string) => void
  isActive: boolean
  onActivate: () => void
  sectionIndex: number
}

export function SectionBlock({
  section,
  onChange,
  isActive,
  onActivate,
  sectionIndex,
}: SectionBlockProps) {
  const meta = SECTION_DEFS.find((d) => d.key === section.key)
  const wc = useMemo(() => wordCount(section.body), [section.body])

  return (
    <div
      className={`rounded-[8px] border transition-colors ${
        isActive
          ? 'border-amber-500/60 bg-ink-900 shadow-spotlight'
          : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
      }`}
    >
      <button
        type="button"
        onClick={onActivate}
        className="w-full px-5 py-3 flex items-center gap-3 text-left"
      >
        <span className="font-mono-ui text-[10px] text-bone-400 tracking-widest">
          0{sectionIndex + 1}
        </span>
        <span className="font-display text-[20px] text-bone-50">{section.title}</span>
        <span className="text-[11px] font-mono-ui text-bone-400">— {meta?.hint}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="text-[10px] font-mono-ui text-bone-400">{wc} 字</span>
          {section.collapsed ? (
            <ChevronRight className="w-4 h-4 text-bone-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bone-300" />
          )}
        </span>
      </button>

      {!section.collapsed && (
        <div className="px-5 pb-5 pt-1 space-y-3">
          <Textarea
            value={section.body}
            onChange={(e) => onChange({ body: e.target.value })}
            onFocus={onActivate}
            placeholder={meta?.placeholder}
            rows={5}
            className="min-h-[120px]"
          />
          <div className="flex items-center gap-2 text-[10px] font-mono-ui text-bone-400">
            <Sparkles className="w-3 h-3 text-amber-500" />
            用 <code className="text-amber-400">{'{{变量}}'}</code> 标记动态内容，自动加入变量面板
          </div>
        </div>
      )}
    </div>
  )
}
