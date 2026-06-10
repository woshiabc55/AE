import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Copy,
  History,
  LayoutGrid,
  List,
  Play,
  Save,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Field, Select, TextInput, Textarea } from '../components/ui/Field'
import { useTemplateStore } from '../stores/templateStore'
import { useRunsStore, useUserStore } from '../stores/userStore'
import { fillTemplate, getMissingKeys } from '../lib/variableParser'
import { MODEL_OPTIONS, runStage } from '../lib/mockLLM'
import type { StageOutput } from '../lib/types'
import { Toast } from '../components/ui/Toast'

const RANDOM_POOL: Record<string, string[]> = {
  text: ['雨夜废弃工厂', '沈墨，28 岁', '凌晨两点', '一封旧信', '霓虹灯下的便利店'],
  longtext: ['她在雾里站了很久，直到第一束光穿透玻璃。', '时间像被按了暂停键，雨水在屋檐下结成珠串。'],
  number: ['1', '2', '3', '4', '5', '6', '8', '10', '12'],
  enum: [],
}

export function Stage() {
  const { templateId = '' } = useParams()
  const navigate = useNavigate()
  const t = useTemplateStore((s) => s.getById(templateId))
  const runs = useRunsStore((s) => s.runs)
  const addRun = useRunsStore((s) => s.addRun)
  const incrementQuota = useUserStore((s) => s.incrementQuota)

  const [values, setValues] = useState<Record<string, string>>({})
  const [outputs, setOutputs] = useState<StageOutput[] | null>(null)
  const [running, setRunning] = useState(false)
  const [selectedModels, setSelectedModels] = useState<string[]>(
    MODEL_OPTIONS.map((m) => m.id),
  )
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [toast, setToast] = useState<string | null>(null)
  const [abortCtl, setAbortCtl] = useState<AbortController | null>(null)

  useEffect(() => {
    if (!t) return
    const v: Record<string, string> = {}
    t.variables.forEach((vr) => {
      v[vr.key] = vr.defaultValue ?? ''
    })
    setValues(v)
  }, [t?.id]) // eslint-disable-line

  const prompt = useMemo(() => {
    if (!t) return ''
    return fillTemplate(t.sections, values)
  }, [t, values])

  const missing = useMemo(() => (t ? getMissingKeys(t.sections, values) : []), [
    t,
    values,
  ])

  if (!t) {
    return (
      <div className="px-8 py-12">
        <Card className="p-10 text-center">
          <p className="font-display text-[24px] text-bone-50">模板不存在</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            返回工坊
          </Button>
        </Card>
      </div>
    )
  }

  function setVal(k: string, v: string) {
    setValues((s) => ({ ...s, [k]: v }))
  }

  function shuffle(key: string) {
    const def = t!.variables.find((v) => v.key === key)
    if (!def) return
    if (def.type === 'enum' && def.options?.length) {
      const pick = def.options[Math.floor(Math.random() * def.options.length)]
      setVal(key, pick)
      return
    }
    const pool = RANDOM_POOL[def.type] ?? RANDOM_POOL.text
    setVal(key, pool[Math.floor(Math.random() * pool.length)])
  }

  async function handleRun() {
    if (missing.length > 0) {
      setToast(`还有 ${missing.length} 个变量未填`)
      return
    }
    setRunning(true)
    setOutputs(null)
    const ctl = new AbortController()
    setAbortCtl(ctl)
    incrementQuota()
    const template = t!
    try {
      const result = await runStage({ prompt, signal: ctl.signal })
      const filtered = result.filter((r) => selectedModels.includes(r.model))
      setOutputs(filtered)
      addRun({
        id: Math.random().toString(36).slice(2),
        templateId: template.id,
        values,
        outputs: filtered,
        createdAt: Date.now(),
      })
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        setToast('已中止生成')
      } else {
        setToast('生成失败，请重试')
      }
    } finally {
      setRunning(false)
      setAbortCtl(null)
    }
  }

  function handleAbort() {
    abortCtl?.abort()
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setToast('已复制到剪贴板')
  }

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    )
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<ArrowLeft className="w-3.5 h-3.5" />}
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
        <div className="flex-1">
          <div className="text-[10px] font-mono-ui tracking-widest text-amber-500 uppercase">
            Stage · 试写舞台
          </div>
          <h1 className="font-display text-[36px] text-bone-50 leading-tight">
            {t.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-ui text-bone-400 mr-2">对比视图</span>
          <Chip size="sm" active={view === 'grid'} onClick={() => setView('grid')}>
            <LayoutGrid className="w-3 h-3" /> 并排
          </Chip>
          <Chip size="sm" active={view === 'list'} onClick={() => setView('list')}>
            <List className="w-3 h-3" /> 串行
          </Chip>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：参数表单 */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-amber-500" />
              <span className="font-display text-[20px] text-bone-50">填入参数</span>
              <Chip size="sm" className="ml-auto">
                {t.variables.length} 项
              </Chip>
            </div>
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {t.variables.map((v) => {
                const isMissing = !values[v.key]?.trim()
                return (
                  <Field key={v.key} label={v.label} required={!values[v.key]?.trim()}>
                    {v.type === 'longtext' ? (
                      <Textarea
                        value={values[v.key] ?? ''}
                        onChange={(e) => setVal(v.key, e.target.value)}
                        placeholder={v.description || v.label}
                        rows={3}
                        className={isMissing ? 'border-curtain-500/50' : ''}
                      />
                    ) : v.type === 'enum' ? (
                      <Select
                        value={values[v.key] ?? ''}
                        onChange={(e) => setVal(v.key, e.target.value)}
                      >
                        <option value="" className="bg-ink-900">
                          —— 请选择 ——
                        </option>
                        {v.options?.map((o) => (
                          <option key={o} value={o} className="bg-ink-900">
                            {o}
                          </option>
                        ))}
                      </Select>
                    ) : v.type === 'number' ? (
                      <TextInput
                        type="number"
                        value={values[v.key] ?? ''}
                        onChange={(e) => setVal(v.key, e.target.value)}
                        onShuffle={() => shuffle(v.key)}
                      />
                    ) : (
                      <TextInput
                        value={values[v.key] ?? ''}
                        onChange={(e) => setVal(v.key, e.target.value)}
                        onShuffle={() => shuffle(v.key)}
                        placeholder={v.description || v.label}
                        className={isMissing ? 'border-curtain-500/50' : ''}
                      />
                    )}
                  </Field>
                )
              })}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-display text-[20px] text-bone-50">选择模型</span>
            </div>
            <div className="space-y-2">
              {MODEL_OPTIONS.map((m) => {
                const on = selectedModels.includes(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModel(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded border transition-colors ${
                      on
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300'
                        : 'bg-ink-950 border-ink-700 text-bone-300 hover:border-ink-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                        on ? 'bg-amber-500 border-amber-400' : 'border-ink-600'
                      }`}
                    >
                      {on && <Check className="w-3 h-3 text-ink-950" />}
                    </div>
                    <span className="text-[12px] font-mono-ui">{m.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-ink-700">
              {!running ? (
                <Button
                  variant="primary"
                  size="lg"
                  iconLeft={<Play className="w-4 h-4" />}
                  onClick={handleRun}
                  className="w-full"
                  disabled={selectedModels.length === 0}
                >
                  开始试写
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleAbort}
                  className="w-full"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 bg-curtain-400 rounded-full animate-pulse" />
                    正在生成 · 点此中止
                  </span>
                </Button>
              )}
              {missing.length > 0 && !running && (
                <p className="mt-2 text-[10px] text-curtain-400 font-mono-ui">
                  未填字段：{missing.slice(0, 3).join('、')}
                  {missing.length > 3 && ` 等 ${missing.length} 项`}
                </p>
              )}
            </div>
          </Card>
        </aside>

        {/* 右侧：结果区 */}
        <section className="col-span-12 lg:col-span-8 space-y-4">
          {!outputs && !running && (
            <Card className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full border border-ink-700 flex items-center justify-center animate-breath">
                <Sparkles className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="mt-4 font-display text-[24px] text-bone-50">
                准备好开演了吗？
              </h3>
              <p className="mt-2 text-[13px] text-bone-300 max-w-md mx-auto">
                填写左侧变量，点击「开始试写」，3 个 AI 模型会同时演出你的剧本。
              </p>
            </Card>
          )}

          {running && (
            <Card className="p-10 text-center">
              <div className="mx-auto w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full border border-amber-500/20 animate-breath" />
                <Sparkles className="w-9 h-9 text-amber-500 animate-flicker" />
              </div>
              <h3 className="mt-5 font-display text-[24px] text-amber-400">
                正在剧组排练中…
              </h3>
              <p className="mt-2 text-[12px] font-mono-ui text-bone-400">
                {selectedModels.length} 个模型同时在跑，预计 1-2 秒
              </p>
              <div className="mt-4 mx-auto max-w-md h-1 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-1/3 animate-[sweep_1.2s_ease-in-out_infinite]" />
              </div>
            </Card>
          )}

          {outputs && outputs.length > 0 && (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                  : 'flex flex-col gap-4'
              }
            >
              {outputs.map((o, i) => (
                <Card
                  key={o.model}
                  className="p-5 animate-floatUp"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500/30 to-curtain-500/20 border border-amber-500/40 flex items-center justify-center font-display text-amber-400 text-sm">
                        {o.modelLabel.slice(0, 1)}
                      </div>
                      <span className="font-mono-ui text-[13px] text-bone-50">
                        {o.modelLabel}
                      </span>
                      <span className="text-[10px] font-mono-ui text-bone-400">
                        {(o.durationMs / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 text-[12px] font-mono-ui">
                      <Star className="w-3 h-3" /> {o.score}
                    </div>
                  </div>
                  <p className="text-bone-100 text-[14px] leading-relaxed whitespace-pre-wrap">
                    {o.text}
                  </p>
                  <div className="mt-4 pt-3 border-t border-ink-700 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      iconLeft={<Copy className="w-3 h-3" />}
                      onClick={() => handleCopy(o.text)}
                    >
                      复制
                    </Button>
                    <Button size="sm" variant="ghost" iconLeft={<Save className="w-3 h-3" />}>
                      收藏
                    </Button>
                    <span className="ml-auto text-[10px] font-mono-ui text-bone-400">
                      模型权重：演示版
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {runs.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-amber-500" />
                <span className="font-display text-[18px] text-bone-50">历史回放</span>
                <span className="ml-auto text-[10px] font-mono-ui text-bone-400">
                  最近 {runs.length} 次
                </span>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {runs.slice(0, 6).map((r) => (
                  <li
                    key={r.id}
                    className="text-[11px] font-mono-ui text-bone-300 border border-ink-700 rounded px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-bone-50">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                      <span className="text-bone-400">
                        {r.outputs.length} 个模型输出
                      </span>
                    </div>
                    <div className="mt-1 truncate text-bone-400">
                      {Object.entries(r.values)
                        .slice(0, 3)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(' · ')}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
