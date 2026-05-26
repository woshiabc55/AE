import { Star, TrendingDown, ExternalLink, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product, Platform } from '@/types'
import { PLATFORM_CONFIG } from '@/types'

interface ProductTableProps {
  products: Product[]
  filterPlatform: Platform | 'all'
  onFilterChange: (p: Platform | 'all') => void
}

function formatPrice(price: number): string {
  return price.toFixed(2)
}

function formatSales(sales: number): string {
  if (sales >= 10000) return `${(sales / 10000).toFixed(1)}万`
  if (sales >= 1000) return `${(sales / 1000).toFixed(1)}千`
  return String(sales)
}

function getDiscountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round((1 - price / originalPrice) * 100)
}

const FILTER_OPTIONS: { value: Platform | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'jd', label: '京东' },
  { value: 'tb', label: '淘宝' },
  { value: 'pdd', label: '拼多多' },
]

export default function ProductTable({ products, filterPlatform, onFilterChange }: ProductTableProps) {
  const filtered = filterPlatform === 'all'
    ? products
    : products.filter((p) => p.platform === filterPlatform)

  const sorted = [...filtered].sort((a, b) => a.price - b.price)

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-cyan-400" />
        <div className="flex gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const config = opt.value !== 'all' ? PLATFORM_CONFIG[opt.value] : null
            return (
              <button
                key={opt.value}
                onClick={() => onFilterChange(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  filterPlatform === opt.value
                    ? 'text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                )}
                style={
                  filterPlatform === opt.value && config
                    ? { backgroundColor: config.color, boxShadow: `0 0 12px ${config.color}40` }
                    : filterPlatform === opt.value && !config
                      ? { backgroundColor: '#22D3EE', boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)' }
                      : undefined
                }
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <span className="text-slate-500 text-sm ml-auto">{sorted.length} 件商品</span>
      </div>

      <div className="hidden md:block rounded-xl border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/80">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">商品</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">价格</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">折扣</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">销量</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">店铺</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">平台</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">评分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {sorted.map((product) => {
              const config = PLATFORM_CONFIG[product.platform]
              const discount = getDiscountPercent(product.price, product.originalPrice)
              return (
                <tr
                  key={product.id}
                  className="bg-slate-900/50 hover:bg-slate-800/60 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-700 flex-shrink-0"
                      />
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-200 hover:text-cyan-400 transition-colors line-clamp-2 max-w-[240px]"
                      >
                        {product.name}
                        <ExternalLink className="inline w-3 h-3 ml-1 opacity-40" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-cyan-400 font-bold text-base">¥{formatPrice(product.price)}</div>
                    <div className="text-slate-500 text-xs line-through">¥{formatPrice(product.originalPrice)}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {discount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <TrendingDown className="w-3 h-3" />
                        -{discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-300">
                    {formatSales(product.sales)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-300">{product.storeName}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-400">{product.storeRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md"
                      style={{
                        color: config.color,
                        backgroundColor: config.bgColor,
                      }}
                    >
                      {config.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {product.score != null && (
                      <span className={cn(
                        'text-sm font-semibold',
                        product.score >= 80 ? 'text-cyan-400' :
                        product.score >= 60 ? 'text-emerald-400' :
                        product.score >= 40 ? 'text-amber-400' : 'text-slate-400'
                      )}>
                        {product.score}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">暂无商品数据</div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {sorted.map((product) => {
          const config = PLATFORM_CONFIG[product.platform]
          const discount = getDiscountPercent(product.price, product.originalPrice)
          return (
            <div
              key={product.id}
              className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4"
            >
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-200 hover:text-cyan-400 transition-colors line-clamp-2"
                  >
                    {product.name}
                    <ExternalLink className="inline w-3 h-3 ml-1 opacity-40" />
                  </a>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ color: config.color, backgroundColor: config.bgColor }}
                    >
                      {config.name}
                    </span>
                    {discount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                        <TrendingDown className="w-3 h-3" />
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between mt-3">
                <div>
                  <span className="text-cyan-400 font-bold text-lg">¥{formatPrice(product.price)}</span>
                  <span className="text-slate-500 text-xs line-through ml-2">¥{formatPrice(product.originalPrice)}</span>
                </div>
                {product.score != null && (
                  <span className={cn(
                    'text-sm font-semibold',
                    product.score >= 80 ? 'text-cyan-400' :
                    product.score >= 60 ? 'text-emerald-400' :
                    product.score >= 40 ? 'text-amber-400' : 'text-slate-400'
                  )}>
                    {product.score}分
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{product.storeRating.toFixed(1)}</span>
                  <span className="mx-1">·</span>
                  <span>{product.storeName}</span>
                </div>
                <span>销量 {formatSales(product.sales)}</span>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">暂无商品数据</div>
        )}
      </div>
    </div>
  )
}
