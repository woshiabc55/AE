import { useState } from 'react'
import {
  Bell,
  Database,
  Key,
  Moon,
  Palette,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Field, TextInput } from '../components/ui/Field'
import { useUserStore, useRunsStore } from '../stores/userStore'
import { useTemplateStore } from '../stores/templateStore'
import { Toast } from '../components/ui/Toast'

export function Me() {
  const author = useUserStore((s) => s.author)
  const setName = useUserStore((s) => s.setName)
  const setOnboarded = useUserStore((s) => s.setOnboarded)
  const quota = useUserStore((s) => s.quota)
  const resetSeed = useTemplateStore((s) => s.resetSeed)
  const clearRuns = useRunsStore((s) => s.clear)
  const [name, setNameLocal] = useState(author.name)
  const [toast, setToast] = useState<string | null>(null)

  return (
    <div className="px-8 py-8 max-w-[1100px] mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-2 text-[10px] font-mono-ui tracking-widest text-amber-500 uppercase">
          <User className="w-3 h-3" /> Account · 个人中心
        </div>
        <h1 className="mt-2 font-display text-[48px] text-bone-50">账户 · 偏好</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-6">
          <SectionHeader icon={<User className="w-4 h-4" />} title="个人资料" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="显示名">
              <TextInput value={name} onChange={(e) => setNameLocal(e.target.value)} />
            </Field>
            <Field label="邮箱">
              <TextInput value="curator@muse.studio" disabled />
            </Field>
            <Field label="角色" hint="展示在模板上">
              <TextInput value={author.bio ?? ''} placeholder="一句话介绍自己…" />
            </Field>
            <Field label="语言">
              <select className="w-full bg-ink-950 border border-ink-700 text-bone-50 rounded px-3 py-2 font-mono-ui text-[13px]">
                <option>简体中文</option>
                <option>English</option>
                <option>繁體中文</option>
              </select>
            </Field>
          </div>
          <div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setName(name)
                setToast('个人资料已更新')
              }}
            >
              保存修改
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader icon={<Sparkles className="w-4 h-4" />} title="订阅" />
          <div className="mt-4 p-5 rounded-[8px] bg-gradient-to-br from-amber-500/20 to-curtain-500/10 border border-amber-500/30">
            <div className="text-[10px] font-mono-ui text-amber-400 tracking-widest uppercase">
              Current · FREE
            </div>
            <div className="mt-2 font-display text-[24px] text-bone-50">免费版</div>
            <ul className="mt-3 space-y-1.5 text-[12px] text-bone-200">
              <li>· 本地无限模板</li>
              <li>· 每月 {quota.total} 次试写配额</li>
              <li>· 单模型对比</li>
            </ul>
            <Button variant="primary" size="md" className="mt-4 w-full">
              升级 PRO · 9.9/月
            </Button>
          </div>
          <div className="mt-4 text-[11px] font-mono-ui text-bone-400">
            配额已使用 <span className="text-amber-400">{quota.used}</span> / {quota.total}
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <SectionHeader icon={<Palette className="w-4 h-4" />} title="主题 · 偏好" />
          <Row
            icon={<Moon className="w-3.5 h-3.5 text-bone-300" />}
            label="夜场放映厅"
            hint="当前主题"
            right={<Chip size="sm" active>启用中</Chip>}
          />
          <Row
            icon={<Bell className="w-3.5 h-3.5 text-bone-300" />}
            label="生成完成通知"
            right={
              <label className="inline-flex items-center gap-2 text-[12px] text-bone-300">
                <input type="checkbox" defaultChecked className="accent-amber-500" />
                浏览器
              </label>
            }
          />
          <Row
            icon={<Settings className="w-3.5 h-3.5 text-bone-300" />}
            label="默认模型权重"
            right={<span className="font-mono-ui text-[11px] text-bone-400">银幕 / 墨韵 / 新浪潮</span>}
          />
        </Card>

        <Card className="p-6 space-y-5">
          <SectionHeader icon={<Key className="w-4 h-4" />} title="API Key" />
          <p className="text-[12px] text-bone-300">
            配置你自己的模型 API Key，即可调用真实模型（演示版不消耗真实配额）。
          </p>
          <Field label="OpenAI Key">
            <TextInput type="password" placeholder="sk-..." />
          </Field>
          <Field label="Claude Key">
            <TextInput type="password" placeholder="sk-ant-..." />
          </Field>
          <Button variant="outline" size="sm">
            保存密钥
          </Button>
        </Card>

        <Card className="p-6 space-y-5">
          <SectionHeader icon={<Database className="w-4 h-4" />} title="数据" />
          <Row
            label="本地数据全部存储在浏览器"
            hint="云端同步功能开发中"
            right={<Chip size="sm">本地</Chip>}
          />
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (!confirm('清空所有试写历史？')) return
              clearRuns()
              setToast('试写历史已清空')
            }}
          >
            清空试写历史
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (!confirm('恢复 12 个内置种子模板？这会覆盖你创建的内容。')) return
              resetSeed()
              setToast('已重置为种子模板')
            }}
          >
            恢复种子模板
          </Button>
        </Card>

        <Card className="p-6 space-y-5">
          <SectionHeader icon={<Shield className="w-4 h-4" />} title="安全" />
          <Row label="二次验证" hint="未开启" right={<Button size="sm" variant="outline">开启</Button>} />
          <Row label="活跃会话" hint="1 个浏览器" />
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setOnboarded(false)
              setToast('已退出登录（演示）')
            }}
          >
            退出登录
          </Button>
        </Card>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-amber-500">
      {icon}
      <h2 className="font-display text-[20px] text-bone-50">{title}</h2>
    </div>
  )
}

function Row({
  icon,
  label,
  hint,
  right,
}: {
  icon?: React.ReactNode
  label: string
  hint?: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded border border-ink-700 bg-ink-950/60">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-bone-50">{label}</div>
        {hint && <div className="text-[10px] font-mono-ui text-bone-400">{hint}</div>}
      </div>
      {right}
    </div>
  )
}
