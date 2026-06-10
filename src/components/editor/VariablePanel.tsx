import { Hash, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { PromptVariable } from '../../lib/types'
import { Button } from '../ui/Button'
import { Field, Select, TextInput } from '../ui/Field'

interface VariablePanelProps {
  variables: PromptVariable[]
  onChange: (key: string, patch: Partial<PromptVariable>) => void
  onAdd: () => void
  onRemove: (key: string) => void
  activeKey?: string
  onJump: (key: string) => void
}

export function VariablePanel({
  variables,
  onChange,
  onAdd,
  onRemove,
  activeKey,
  onJump,
}: VariablePanelProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())

  function toggle(k: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <div className="rounded-[8px] border border-ink-700 bg-ink-900/70">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-700">
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-display text-[18px] text-bone-50">变量工作室</span>
        </div>
        <Button size="sm" iconLeft={<Plus className="w-3 h-3" />} onClick={onAdd}>
          新增
        </Button>
      </div>

      <div className="p-3 space-y-2 max-h-[640px] overflow-y-auto">
        {variables.length === 0 && (
          <div className="py-10 text-center text-[12px] font-mono-ui text-bone-400">
            暂无变量。在正文中用
            <code className="mx-1 text-amber-400">{'{{name}}'}</code>
            即可自动出现。
          </div>
        )}

        {variables.map((v) => {
          const isOpen = open.has(v.key) || activeKey === v.key
          return (
            <div
              key={v.key}
              className={`rounded-[6px] border transition-colors ${
                activeKey === v.key
                  ? 'border-amber-500/60 bg-ink-800'
                  : 'border-ink-700 bg-ink-950/60'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(v.key)}
                className="w-full px-3 py-2 flex items-center gap-2 text-left"
              >
                <span className="font-mono-ui text-[12px] text-amber-400">
                  {`{{${v.key}}}`}
                </span>
                <span className="text-[11px] text-bone-300 truncate flex-1">
                  {v.label}
                </span>
                <span className="text-[10px] font-mono-ui text-bone-400 uppercase">
                  {v.type}
                </span>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 space-y-2.5">
                  <Field label="标签">
                    <TextInput
                      value={v.label}
                      onChange={(e) => onChange(v.key, { label: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="类型">
                      <Select
                        value={v.type}
                        onChange={(e) =>
                          onChange(v.key, { type: e.target.value as PromptVariable['type'] })
                        }
                      >
                        <option value="text">短文本</option>
                        <option value="longtext">长文本</option>
                        <option value="number">数字</option>
                        <option value="enum">枚举</option>
                      </Select>
                    </Field>
                    <Field label="默认值">
                      <TextInput
                        value={v.defaultValue ?? ''}
                        onChange={(e) => onChange(v.key, { defaultValue: e.target.value })}
                      />
                    </Field>
                  </div>
                  {v.type === 'enum' && (
                    <Field label="可选项（用 / 分隔）">
                      <TextInput
                        value={(v.options ?? []).join(' / ')}
                        onChange={(e) =>
                          onChange(v.key, {
                            options: e.target.value
                              .split('/')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="如：悬疑 / 甜宠 / 都市"
                      />
                    </Field>
                  )}
                  <Field label="说明">
                    <TextInput
                      value={v.description ?? ''}
                      onChange={(e) => onChange(v.key, { description: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onJump(v.key)}
                      className="text-[11px] font-mono-ui text-amber-400 hover:text-amber-300"
                    >
                      定位到正文 →
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(v.key)}
                      className="text-bone-400 hover:text-curtain-400 p-1"
                      aria-label="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
