export interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  sales: number
  storeName: string
  storeRating: number
  platform: 'jd' | 'tb' | 'pdd'
  url: string
  imageUrl: string
  score?: number
}

export interface ComparisonResult {
  cheapest: Product
  highestRated: Product
  bestSeller: Product
  priceRange: { min: number; max: number; avg: number }
  platformAvgPrices: Record<string, number>
}

export interface Recommendation {
  product: Product
  score: number
  badge: 'best_value' | 'best_quality' | 'best_seller' | 'good_deal'
  reason: string
}

export interface SearchResult {
  keyword: string
  timestamp: string
  products: Product[]
  comparison: ComparisonResult
  recommendations: Recommendation[]
}

export type Platform = 'jd' | 'tb' | 'pdd'

export const PLATFORM_CONFIG: Record<Platform, { name: string; color: string; bgColor: string }> = {
  jd: { name: '京东', color: '#E4393C', bgColor: 'rgba(228, 57, 60, 0.15)' },
  tb: { name: '淘宝', color: '#FF5000', bgColor: 'rgba(255, 80, 0, 0.15)' },
  pdd: { name: '拼多多', color: '#E02E24', bgColor: 'rgba(224, 46, 36, 0.15)' },
}

export const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  best_value: { label: '最佳性价比', icon: '🏆', color: '#22D3EE' },
  best_quality: { label: '品质之选', icon: '⭐', color: '#F59E0B' },
  best_seller: { label: '销量冠军', icon: '🔥', color: '#EF4444' },
  good_deal: { label: '超值好价', icon: '💰', color: '#10B981' },
}
