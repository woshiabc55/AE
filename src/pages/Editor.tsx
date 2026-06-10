import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Eye,
  GitBranch,
  PlayCircle,
  Save,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Field, Select, TextInput } from '../components/ui/Field'
import { SectionBlock } from '../components/editor/SectionBlock'
import { VariablePanel } from '../components/editor/VariablePanel'
import { useTemplateStore } from '../stores/templateStore'
import { CATEGORY_LABEL, VISIBILITY_LABEL, type SectionKey } from '../lib/types'
import { fillTemplate, extractVariables, wordCount } from '../lib/variableParser'
import { Toast } from '../components/ui/Toast'

export function Editor() {
  const { templateId = 'new' } = useParams()
  const navigate = useNavigate()
  const t = useTemplateStore((s) => s.getById(templateId))
  const update = useTemplateStore((s) => s.update)
  const updateSection = useTemplateStore((s) => s.updateSection)
  const updateVariable = useTemplateStore((s) => s.updateVariable)
  const syncVariables = useTemplateStore((s) => s.syncVariables)
  const addVersion = useTemplateStore((s) => s.addVersion)
  const remove = useTemplateStore((s) => s.remove)
  const setVisibility = useTemplateStore((s) => s.setVisibility)

  const [activeKey, setActiveKey] = useState<SectionKey | undefined>('premise')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  // 初始化预览值
  useEffect(() => {
    if (!t) return
    const v: Record<string, string> = {}
    t.variables.forEach((vr) => {
      v[vr.key] = vr.defaultValue ?? previewValues[vr.key] ?? ''
    })
    setPreviewValues(v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t?.id])

  // 自动同步变量
  useEffect(() => {
    if (!t) return
    const keys = extractVariables(t.sections).join('|')
    const declaredKeys = t.variables.map((v) => v.key).join('|')
    if (keys !== declaredKeys) {
      syncVariables(t.id)
      setDirty(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t?.sections.map((s) => s.body).join('|')])

  if (!t) {
    return (
      <div className="px-8 py-12">
        <Card className="p-10 text-center">
          <p className="font-display text-[24px] text-bone-50">模板不存在或已删除</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            返回工坊
          </Button>
        </Card>
      </div>
    )
  }

  const totalWords = wordCount(t.sections.map((s) => s.body).join(' '))
  const previewText = useMemo(
    () => fillTemplate(t.sections, previewValues),
    [t.sections, previewValues],
  )

  function jumpToSection(key: string) {
    const sec = t!.sections.find((s) => s.body.includes(`{{${key}}}`))
    if (sec) setActiveKey(sec.key)
  }

  function handleAddVariable() {
    const used = new Set(t!.variables.map((v) => v.key))
    let i = 1
    let name = `var_${i}`
    while (used.has(name)) {
      i++
      name = `var_${i}`
    }
    updateVariable(t!.id, name, {
      key: name,
      label: '新变量',
      type: 'text',
      defaultValue: '',
    })
  }

  function handleRemoveVariable(key: string) {
    // 同时从所有 section 中移除占位
    t!.sections.forEach((sec) => {
      if (sec.body.includes(`{{${key}}}`)) {
        updateSection(t!.id, sec.id, {
          body: sec.body
            .replace(new RegExp(`\\s*\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), '')
            .replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), ''),
        })
      }
    })
    syncVariables(t!.id)
  }

  function handleExport() {
    const blob = new Blob([previewText], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t!.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDelete() {
    if (!confirm('确定要删除这个模板？此操作不可撤销。')) return
    remove(t!.id)
    navigate('/')
  }

  function handleSnapshot() {
    addVersion(t!.id, '')
    setDirty(false)
    setToast('已保存为新版本')
  }

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="px-8 py-4 border-b border-ink-700 glass-pane sticky top-16 z-20 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate('/')}
        >
          返回
        </Button>
        <div className="flex-1 min-w-0">
          <input
            value={t.title}
            onChange={(e) => {
              update(t.id, { title: e.target.value })
              setDirty(true)
            }}
            className="w-full bg-transparent outline-none font-display text-[24px] text-bone-50 placeholder:text-bone-400"
            placeholder="未命名模板"
          />
          <div className="mt-0.5 flex items-center gap-3 text-[11px] font-mono-ui text-bone-400">
            <span className="flex items-center gap-1">
              <Chip size="sm" active>
                {CATEGORY_LABEL[t.category]}
              </Chip>
            </span>
            <span>{totalWords} 字</span>
            <span>· {t.variables.length} 变量</span>
            <span>· {t.sections.filter((s) => s.body.trim()).length}/6 段</span>
            {dirty && <span className="text-amber-400">· 未保存修改</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={t.visibility}
            onChange={(e) =>
              setVisibility(t.id, e.target.value as typeof t.visibility)
            }
            className="h-9 text-[12px] w-32"
          >
            <option value="private">{VISIBILITY_LABEL.private}</option>
            <option value="team">{VISIBILITY_LABEL.team}</option>
            <option value="public">{VISIBILITY_LABEL.public}</option>
          </Select>
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Eye className="w-3.5 h-3.5" />}
            onClick={() => setPreviewOpen((v) => !v)}
          >
            预览
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconLeft={<GitBranch className="w-3.5 h-3.5" />}
            onClick={handleSnapshot}
          >
            存为版本
          </Button>
          <Button variant="outline" size="sm" iconLeft={<Share2 className="w-3.5 h-3.5" />}>
            分享
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download className="w-3.5 h-3.5" />}
            onClick={handleExport}
          >
            导出
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Save className="w-3.5 h-3.5" />}
            onClick={() => {
              setDirty(false)
              setToast('已保存到本地')
            }}
          >
            保存
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<PlayCircle className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/stage/${t.id}`)}
          >
            试写
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6 px-8 py-6">
        {/* 左侧：6 段结构 */}
        <div className="col-span-12 lg:col-span-8 space-y-3 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-display text-[22px] text-bone-50">剧本结构</span>
            <span className="ml-auto text-[11px] font-mono-ui text-bone-400">
              6 段式结构化提示词
            </span>
          </div>
          {t.sections.map((sec, i) => (
            <SectionBlock
              key={sec.id}
              section={sec}
              sectionIndex={i}
              isActive={activeKey === sec.key}
              onActivate={() => setActiveKey(sec.key)}
              onChange={(patch) => {
                updateSection(t.id, sec.id, patch)
                setDirty(true)
              }}
              onTitleChange={(title) => updateSection(t.id, sec.id, { title })}
            />
          ))}

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Card className="p-4">
              <div className="text-[10px] font-mono-ui text-bone-400 tracking-widest uppercase">
                元信息
              </div>
              <div className="mt-3 space-y-3">
                <Field label="分类">
                  <Select
                    value={t.category}
                    onChange={(e) => {
                      update(t.id, { category: e.target.value as typeof t.category })
                      setDirty(true)
                    }}
                  >
                    {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="标签（逗号分隔）">
                  <TextInput
                    value={t.tags.join('，')}
                    onChange={(e) => {
                      update(t.id, {
                        tags: e.target.value
                          .split(/[，,]/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                      setDirty(true)
                    }}
                  />
                </Field>
                <Field label="简介">
                  <TextInput
                    value={t.description ?? ''}
                    onChange={(e) => {
                      update(t.id, { description: e.target.value })
                      setDirty(true)
                    }}
                    placeholder="一句话介绍这个模板…"
                  />
                </Field>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-[10px] font-mono-ui text-bone-400 tracking-widest uppercase">
                版本历史
              </div>
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {t.versions.length === 0 ? (
                  <p className="text-[11px] text-bone-400 font-mono-ui py-2">
                    还没有保存过版本。点击「存为版本」留档。
                  </p>
                ) : (
                  t.versions.map((v) => (
                    <div
                      key={v.id}
                      className="px-2.5 py-2 rounded border border-ink-700 hover:border-ink-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-bone-50 font-mono-ui">
                          {v.label}
                        </span>
                        <span className="text-[10px] text-bone-400 font-mono-ui">
                          {new Date(v.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="p-4 flex flex-col">
              <div className="text-[10px] font-mono-ui text-bone-400 tracking-widest uppercase">
                危险操作
              </div>
              <p className="mt-3 text-[11px] text-bone-300">
                删除后无法恢复。建议先「存为版本」再删除。
              </p>
              <div className="mt-auto pt-3">
                <Button
                  variant="danger"
                  size="sm"
                  iconLeft={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={handleDelete}
                  className="w-full"
                >
                  删除模板
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 右侧：变量工作室 */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <VariablePanel
            variables={t.variables}
            onChange={(k, p) => {
              updateVariable(t.id, k, p)
              setDirty(true)
            }}
            onAdd={handleAddVariable}
            onRemove={handleRemoveVariable}
            activeKey={
              activeKey
                ? t.sections.find((s) => s.key === activeKey)?.body.match(
                    /\{\{\s*([a-zA-Z0-9_一-龥]+)\s*\}\}/,
                  )?.[1]
                : undefined
            }
            onJump={jumpToSection}
          />

          {previewOpen && (
            <Card className="p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-display text-[18px] text-bone-50">实时预览</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {t.variables.map((v) => (
                  <Field key={v.key} label={v.label} hint={v.type}>
                    <TextInput
                      value={previewValues[v.key] ?? ''}
                      onChange={(e) =>
                        setPreviewValues((s) => ({ ...s, [v.key]: e.target.value }))
                      }
                      placeholder={v.description || v.label}
                    />
                  </Field>
                ))}
                {t.variables.length === 0 && (
                  <p className="text-[11px] text-bone-400 font-mono-ui py-2">
                    暂无可预览变量。
                  </p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-ink-700">
                <div className="text-[10px] font-mono-ui text-bone-400 tracking-widest uppercase">
                  渲染输出
                </div>
                <pre className="mt-2 text-[11px] font-mono-ui text-bone-200 bg-ink-950 border border-ink-700 rounded p-3 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {previewText}
                </pre>
              </div>
            </Card>
          )}
        </aside>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
