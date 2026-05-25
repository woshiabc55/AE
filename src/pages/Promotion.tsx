import { useState } from 'react'
import { mockPromotionStats, mockInviteLinks } from '@/store/appStore'
import { Users, DollarSign, Trophy, TrendingUp, Copy, Check, Share2, QrCode, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function StatCard({ icon: Icon, label, value, trend, trendLabel, color }: {
  icon: React.ElementType
  label: string
  value: string
  trend: number
  trendLabel: string
  color: string
}) {
  const isPositive = trend > 0
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-zinc-900">{value}</div>
        <div className="text-xs text-zinc-500 mt-1">{label}</div>
      </div>
      <div className="mt-2 text-xs text-zinc-400">{trendLabel}</div>
    </div>
  )
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 200
  const height = 40
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InviteLinkCard() {
  const [copied, setCopied] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-800">邀请链接管理</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ 新建链接</button>
      </div>

      <div className="space-y-3">
        {mockInviteLinks.map((link) => (
          <div key={link.id} className="border border-zinc-100 rounded-lg p-4 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">创建于 {link.createdAt}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                  title="显示二维码"
                >
                  <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                </button>
                <button
                  onClick={() => handleCopy(link.url, link.id)}
                  className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                  title="复制链接"
                >
                  {copied === link.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>
                <button className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors" title="分享">
                  <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
            <div className="text-xs text-zinc-600 bg-zinc-50 rounded-md px-3 py-2 font-mono break-all">
              {link.url}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400">点击</span>
                <span className="text-xs font-semibold text-zinc-700">{link.clickCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400">注册</span>
                <span className="text-xs font-semibold text-zinc-700">{link.registerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-400">转化率</span>
                <span className="text-xs font-semibold text-blue-600">
                  {((link.registerCount / link.clickCount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showQr && (
        <div className="mt-4 flex flex-col items-center p-4 bg-zinc-50 rounded-lg">
          <div className="w-40 h-40 bg-white border-2 border-dashed border-zinc-300 rounded-lg flex items-center justify-center">
            <QrCode className="w-16 h-16 text-zinc-300" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">扫码注册享专属福利</p>
        </div>
      )}
    </div>
  )
}

function CommissionHistory() {
  const months = ['1月', '2月', '3月', '4月', '5月']
  const commissions = [320, 450, 580, 720, 890]

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-800">佣金记录</h3>
        <span className="text-xs text-zinc-400">近5个月</span>
      </div>
      <div className="space-y-3">
        {months.map((month, i) => (
          <div key={month} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-8">{month}</span>
            <div className="flex-1 h-6 bg-zinc-50 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-md transition-all duration-500"
                style={{ width: `${(commissions[i] / 900) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-zinc-700 w-16 text-right">¥{commissions[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-500">累计佣金</span>
        <span className="text-sm font-bold text-zinc-900">¥{commissions.reduce((a, b) => a + b, 0)}</span>
      </div>
    </div>
  )
}

export default function Promotion() {
  const stats = mockPromotionStats

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="累计拉新人数"
          value={stats.totalInvites.toLocaleString()}
          trend={12.5}
          trendLabel="较上月 +12.5%"
          color="bg-blue-500"
        />
        <StatCard
          icon={DollarSign}
          label="累计佣金收入"
          value={`¥${stats.totalRevenue.toLocaleString()}`}
          trend={8.3}
          trendLabel="较上月 +8.3%"
          color="bg-emerald-500"
        />
        <StatCard
          icon={TrendingUp}
          label="本月佣金"
          value={`¥${stats.monthlyRevenue.toLocaleString()}`}
          trend={15.2}
          trendLabel="较上月 +15.2%"
          color="bg-orange-500"
        />
        <StatCard
          icon={Trophy}
          label="推广排名"
          value={`#${stats.rank}`}
          trend={-3}
          trendLabel="较上月上升3名"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800">拉新趋势</h3>
            <BarChart3 className="w-4 h-4 text-zinc-400" />
          </div>
          <MiniChart data={stats.inviteTrend} color="#3b82f6" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-zinc-400">1月</span>
            <span className="text-xs text-zinc-400">12月</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800">佣金趋势</h3>
            <BarChart3 className="w-4 h-4 text-zinc-400" />
          </div>
          <MiniChart data={stats.revenueTrend} color="#f97316" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-zinc-400">1月</span>
            <span className="text-xs text-zinc-400">12月</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InviteLinkCard />
        <CommissionHistory />
      </div>
    </div>
  )
}
