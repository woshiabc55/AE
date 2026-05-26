import { Award, Shield, Flame, BadgeDollarSign, Star, ExternalLink } from 'lucide-react'
import { type Recommendation, PLATFORM_CONFIG, BADGE_CONFIG } from '@/types'

const BADGE_ICONS: Record<string, React.ReactNode> = {
  best_value: <Award className="w-4 h-4" />,
  best_quality: <Shield className="w-4 h-4" />,
  best_seller: <Flame className="w-4 h-4" />,
  good_deal: <BadgeDollarSign className="w-4 h-4" />,
}

interface RecommendationCardsProps {
  recommendations: Recommendation[]
}

export default function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  if (!recommendations.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((rec) => {
        const badge = BADGE_CONFIG[rec.badge]
        const platform = PLATFORM_CONFIG[rec.product.platform]

        return (
          <div
            key={rec.product.id}
            className="relative rounded-lg bg-[#0F172A] border border-slate-700/50 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(100,116,139,0.15)] hover:border-slate-600/60"
            style={{ borderLeftWidth: '3px', borderLeftColor: badge.color }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${badge.color}20`,
                    color: badge.color,
                  }}
                >
                  {BADGE_ICONS[rec.badge]}
                  <span>{badge.label}</span>
                </div>

                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: platform.bgColor,
                    color: platform.color,
                  }}
                >
                  {platform.name}
                </span>
              </div>

              <h3 className="text-slate-100 text-sm font-medium leading-snug mb-2 line-clamp-2">
                {rec.product.name}
              </h3>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold" style={{ color: badge.color }}>
                  ¥{rec.product.price.toFixed(2)}
                </span>
                {rec.product.originalPrice > rec.product.price && (
                  <span className="text-slate-500 text-sm line-through">
                    ¥{rec.product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="truncate">{rec.product.storeName}</span>
                <span className="inline-flex items-center gap-0.5 shrink-0">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {rec.product.storeRating}
                </span>
                <span className="shrink-0">{rec.product.sales.toLocaleString()}已售</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-3">{rec.reason}</p>

              <a
                href={rec.product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs transition-colors"
                style={{ color: badge.color }}
              >
                <span>去购买</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
