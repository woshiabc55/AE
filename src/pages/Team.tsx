import { Mail, MoreHorizontal, Plus, Shield, UserPlus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'

const members = [
  { name: '林暮白', role: 'owner', email: 'lin@muse.studio', last: '2 小时前' },
  { name: '齐夜舟', role: 'editor', email: 'qi@muse.studio', last: '昨天' },
  { name: '殷鹿鸣', email: 'ying@muse.studio', role: 'editor', last: '3 天前' },
  { name: '苏无因', email: 'su@muse.studio', role: 'viewer', last: '1 周前' },
  { name: '周以墨', email: 'zhou@muse.studio', role: 'editor', last: '2 周前' },
]

const sharedFolders = [
  { name: '春节 Campaign 2026', count: 12, color: 'from-curtain-500/40 to-amber-500/20' },
  { name: '短剧厂牌·林暮白', count: 47, color: 'from-amber-500/40 to-amber-300/10' },
  { name: '游戏剧情沉淀', count: 9, color: 'from-blue-500/30 to-amber-500/10' },
  { name: '广告创意合集', count: 23, color: 'from-curtain-400/30 to-amber-500/10' },
]

export function Team() {
  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto space-y-8">
      <header className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-ui tracking-widest text-amber-500 uppercase">
            <span className="marquee-dot" /> Studio · 林暮白工作室
          </div>
          <h1 className="mt-2 font-display text-[48px] text-bone-50">团队空间</h1>
          <p className="mt-1 text-bone-300">
            共享模板库 · 成员权限 · 用量统计。本页面为预览版，后续将接入真实协作。
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" iconLeft={<Mail className="w-3.5 h-3.5" />}>
            发送邀请
          </Button>
          <Button variant="primary" size="md" iconLeft={<UserPlus className="w-3.5 h-3.5" />}>
            邀请成员
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[24px] text-bone-50">成员 ({members.length})</h2>
            <Chip size="sm">本月活跃 4 人</Chip>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-mono-ui text-bone-400 uppercase tracking-widest">
                  <th className="pb-3">成员</th>
                  <th className="pb-3">角色</th>
                  <th className="pb-3">邮箱</th>
                  <th className="pb-3">最近活动</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr
                    key={m.email}
                    className="border-t border-ink-700/60 hover:bg-ink-800/40 transition-colors"
                  >
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-curtain-500 flex items-center justify-center font-display text-ink-950 text-[14px]">
                        {m.name.slice(0, 1)}
                      </div>
                      <span className="text-[13px] text-bone-50">{m.name}</span>
                    </td>
                    <td className="py-3">
                      {m.role === 'owner' ? (
                        <Chip size="sm" active>
                          <Shield className="w-3 h-3" /> 管理员
                        </Chip>
                      ) : m.role === 'editor' ? (
                        <Chip size="sm">编辑者</Chip>
                      ) : (
                        <Chip size="sm">观察者</Chip>
                      )}
                    </td>
                    <td className="py-3 text-[12px] font-mono-ui text-bone-300">
                      {m.email}
                    </td>
                    <td className="py-3 text-[12px] font-mono-ui text-bone-400">
                      {m.last}
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-bone-400 hover:text-amber-400 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-[24px] text-bone-50">本月用量</h2>
          <div className="mt-4 space-y-4">
            <Stat label="试写次数" value="423" sub="较上月 +18%" />
            <Stat label="生成字符" value="126k" sub="较上月 +6%" />
            <Stat label="活跃模板" value="37" sub="较上月 +4" />
            <Stat label="新版本" value="58" sub="较上月 +22" />
          </div>
          <div className="mt-5 pt-4 border-t border-ink-700">
            <div className="flex items-center justify-between text-[11px] font-mono-ui text-bone-400">
              <span>本月配额</span>
              <span>423 / 2000</span>
            </div>
            <div className="mt-2 h-1.5 bg-ink-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-curtain-500" style={{ width: '21%' }} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[24px] text-bone-50">共享库</h2>
          <Button size="sm" variant="ghost" iconLeft={<Plus className="w-3 h-3" />}>
            新建文件夹
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sharedFolders.map((f) => (
            <div
              key={f.name}
              className={`rounded-[8px] p-5 border border-ink-700 bg-gradient-to-br ${f.color} hover:border-amber-500/60 transition-colors cursor-pointer`}
            >
              <div className="text-[10px] font-mono-ui text-bone-300 tracking-widest uppercase">
                FOLDER
              </div>
              <div className="mt-2 font-display text-[20px] text-bone-50 leading-snug">
                {f.name}
              </div>
              <div className="mt-4 text-[11px] font-mono-ui text-bone-300">
                {f.count} 份模板
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[10px] font-mono-ui text-bone-400 tracking-widest uppercase">
          {label}
        </div>
        <div className="mt-1 font-display text-[28px] text-amber-500 leading-none">
          {value}
        </div>
      </div>
      <div className="text-[10px] font-mono-ui text-bone-300">{sub}</div>
    </div>
  )
}
