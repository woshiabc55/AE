import { useEffect } from 'react'
import { useSearchStore } from '@/store/searchStore'
import SearchBar from '@/components/SearchBar'
import ProductTable from '@/components/ProductTable'
import PriceChart from '@/components/PriceChart'
import RecommendationCards from '@/components/RecommendationCards'
import { TrendingUp, Zap, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  const { result, demoResult, isSearching, filterPlatform, setFilterPlatform, loadDemo } = useSearchStore()

  useEffect(() => {
    loadDemo()
  }, [loadDemo])

  const displayResult = result || demoResult

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
              <Zap className="w-4 h-4" />
              跨平台智能比价
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 bg-clip-text text-transparent">
              价格猎手
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              从京东、淘宝、拼多多实时采集商品数据，智能对比分析，一键找到最优价格
            </p>
          </div>

          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
            </div>
            <p className="mt-6 text-slate-400 text-lg">正在采集各平台数据...</p>
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">京东</span>
              <span className="px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">淘宝</span>
              <span className="px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">拼多多</span>
            </div>
          </div>
        )}

        {!isSearching && !displayResult && (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">输入关键词开始比价</p>
          </div>
        )}

        {!isSearching && displayResult && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-slate-100">
                「{displayResult.keyword}」搜索结果
              </h2>
              <span className="text-sm text-slate-500">
                共 {displayResult.products.length} 件商品
              </span>
              {!result && demoResult && (
                <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  示例数据
                </span>
              )}
            </div>

            <RecommendationCards recommendations={displayResult.recommendations} />

            <ProductTable
              products={displayResult.products}
              filterPlatform={filterPlatform}
              onFilterChange={setFilterPlatform}
            />

            <PriceChart
              products={displayResult.products}
              comparison={displayResult.comparison}
            />

            <div className="flex items-center gap-3 pt-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-slate-100">横向对比摘要</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                label="最低价"
                value={`¥${displayResult.comparison.cheapest.price}`}
                sub={`${displayResult.comparison.cheapest.storeName}`}
                color="emerald"
              />
              <SummaryCard
                label="最高评分"
                value={`${displayResult.comparison.highestRated.storeRating}分`}
                sub={`${displayResult.comparison.highestRated.storeName}`}
                color="amber"
              />
              <SummaryCard
                label="最高销量"
                value={formatSales(displayResult.comparison.bestSeller.sales)}
                sub={`${displayResult.comparison.bestSeller.storeName}`}
                color="cyan"
              />
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 text-sm">
          价格猎手 — 电商商品价格自动化采集与对比工具
        </div>
      </footer>
    </div>
  )
}

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  }
  const cls = colorMap[color] || colorMap.cyan

  return (
    <div className={`bg-gradient-to-br ${cls} border rounded-xl p-5`}>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${cls.split(' ').pop()}`}>{value}</p>
      <p className="text-slate-500 text-sm mt-1">{sub}</p>
    </div>
  )
}

function formatSales(sales: number): string {
  if (sales >= 10000) return `${(sales / 10000).toFixed(1)}万`
  return String(sales)
}
