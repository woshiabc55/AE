import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts'
import { BarChart3, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type { Product, ComparisonResult } from '@/types'
import { PLATFORM_CONFIG } from '@/types'
import { cn } from '@/lib/utils'

const PLATFORM_COLORS: Record<string, string> = {
  jd: '#E4393C',
  tb: '#FF5000',
  pdd: '#E02E24',
}

interface PriceChartProps {
  products: Product[]
  comparison: ComparisonResult
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color, fontSize: 13 }}>
          {entry.name}: ¥{entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

function ProductTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload
  if (!data) return null

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        maxWidth: 240,
      }}
    >
      <p style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {data.name}
      </p>
      <p style={{ color: PLATFORM_COLORS[data.platform] ?? '#94A3B8', fontSize: 13 }}>
        ¥{data.price.toFixed(2)}
      </p>
      <p style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
        {PLATFORM_CONFIG[data.platform as keyof typeof PLATFORM_CONFIG]?.name ?? data.platform} · {data.storeName}
      </p>
    </div>
  )
}

export default function PriceChart({ products, comparison }: PriceChartProps) {
  const { priceRange, platformAvgPrices } = comparison

  const platformData = Object.entries(platformAvgPrices).map(([platform, avg]) => ({
    platform: PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]?.name ?? platform,
    avgPrice: Number(avg.toFixed(2)),
    platformKey: platform,
  }))

  const productData = [...products]
    .sort((a, b) => a.price - b.price)
    .map((p) => ({
      name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name,
      fullName: p.name,
      price: p.price,
      platform: p.platform,
      storeName: p.storeName,
    }))

  return (
    <div className={cn('rounded-xl p-6')} style={{ background: '#1E293B' }}>
      <div className={cn('flex items-center gap-3 mb-6')}>
        <BarChart3 size={22} style={{ color: '#22D3EE' }} />
        <h3 className={cn('text-lg font-semibold')} style={{ color: '#E2E8F0' }}>
          价格分析
        </h3>
      </div>

      <div className={cn('grid grid-cols-3 gap-4 mb-6')}>
        <div
          className={cn('rounded-lg p-4 flex items-center gap-3')}
          style={{ background: '#0F172A' }}
        >
          <div
            className={cn('rounded-full p-2')}
            style={{ background: 'rgba(16, 185, 129, 0.15)' }}
          >
            <TrendingDown size={18} style={{ color: '#10B981' }} />
          </div>
          <div>
            <p style={{ color: '#64748B', fontSize: 12 }}>最低价</p>
            <p style={{ color: '#10B981', fontWeight: 700, fontSize: 18 }}>
              ¥{priceRange.min.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          className={cn('rounded-lg p-4 flex items-center gap-3')}
          style={{ background: '#0F172A' }}
        >
          <div
            className={cn('rounded-full p-2')}
            style={{ background: 'rgba(239, 68, 68, 0.15)' }}
          >
            <TrendingUp size={18} style={{ color: '#EF4444' }} />
          </div>
          <div>
            <p style={{ color: '#64748B', fontSize: 12 }}>最高价</p>
            <p style={{ color: '#EF4444', fontWeight: 700, fontSize: 18 }}>
              ¥{priceRange.max.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          className={cn('rounded-lg p-4 flex items-center gap-3')}
          style={{ background: '#0F172A' }}
        >
          <div
            className={cn('rounded-full p-2')}
            style={{ background: 'rgba(34, 211, 238, 0.15)' }}
          >
            <Minus size={18} style={{ color: '#22D3EE' }} />
          </div>
          <div>
            <p style={{ color: '#64748B', fontSize: 12 }}>平均价</p>
            <p style={{ color: '#22D3EE', fontWeight: 700, fontSize: 18 }}>
              ¥{priceRange.avg.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className={cn('mb-8')}>
        <h4 className={cn('text-sm font-medium mb-3')} style={{ color: '#94A3B8' }}>
          平台均价对比
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={platformData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="platform"
              tick={{ fill: '#94A3B8', fontSize: 13 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
            <Legend
              formatter={(value: string) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>}
            />
            <Bar dataKey="avgPrice" name="均价" radius={[6, 6, 0, 0]}>
              {platformData.map((entry, index) => (
                <Cell key={index} fill={PLATFORM_COLORS[entry.platformKey] ?? '#94A3B8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className={cn('text-sm font-medium mb-3')} style={{ color: '#94A3B8' }}>
          商品价格排行
        </h4>
        <ResponsiveContainer width="100%" height={Math.max(200, productData.length * 36)}>
          <BarChart data={productData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              width={120}
            />
            <Tooltip content={<ProductTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
            <Bar dataKey="price" name="价格" radius={[0, 6, 6, 0]}>
              {productData.map((entry, index) => (
                <Cell key={index} fill={PLATFORM_COLORS[entry.platform] ?? '#94A3B8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
