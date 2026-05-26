import { Router, type Request, type Response } from 'express'

const router = Router()

interface Product {
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

interface ComparisonResult {
  cheapest: Product
  highestRated: Product
  bestSeller: Product
  priceRange: { min: number; max: number; avg: number }
  platformAvgPrices: Record<string, number>
}

interface Recommendation {
  product: Product
  score: number
  badge: 'best_value' | 'best_quality' | 'best_seller' | 'good_deal'
  reason: string
}

interface SearchResult {
  keyword: string
  timestamp: string
  products: Product[]
  comparison: ComparisonResult
  recommendations: Recommendation[]
}

const tasks = new Map<string, SearchResult>()

function generateProducts(keyword: string, platform: string, count: number): Product[] {
  const priceRanges: Record<string, [number, number]> = {
    iphone: [4599, 8999],
    手机: [699, 6999],
    耳机: [49, 2999],
    笔记本: [2499, 12999],
    平板: [999, 8999],
    电视: [899, 9999],
    空调: [1299, 7999],
    洗衣机: [599, 5999],
  }

  let priceRange: [number, number] = [99, 9999]
  for (const [key, range] of Object.entries(priceRanges)) {
    if (keyword.toLowerCase().includes(key)) {
      priceRange = range
      break
    }
  }

  const storesByPlatform: Record<string, [string, number][]> = {
    jd: [
      ['京东自营旗舰店', 4.9],
      ['京东官方旗舰店', 4.8],
      ['京东数码专营店', 4.7],
      ['京东家电旗舰店', 4.8],
      ['京东品牌授权店', 4.6],
    ],
    tb: [
      ['天猫官方旗舰店', 4.9],
      ['品牌直营店', 4.8],
      ['天猫优品店', 4.7],
      ['淘宝精选店', 4.5],
      ['金牌卖家店', 4.6],
    ],
    pdd: [
      ['百亿补贴店', 4.9],
      ['品牌黑标店', 4.8],
      ['正品保障店', 4.6],
      ['万人团店', 4.5],
      ['拼购旗舰店', 4.7],
    ],
  }

  const suffixesByPlatform: Record<string, string[]> = {
    jd: ['旗舰版', '标准版', '尊享版', '高配版', '经典版'],
    tb: ['天猫正品', '官方授权', '爆款直降', '限时特惠', '新品首发'],
    pdd: ['百亿补贴', '万人团', '限时秒杀', '品牌特卖', '拼单特价'],
  }

  const stores = storesByPlatform[platform] || storesByPlatform.jd
  const suffixes = suffixesByPlatform[platform] || suffixesByPlatform.jd
  const products: Product[] = []

  for (let i = 0; i < count; i++) {
    const price = Math.round(
      (priceRange[0] + Math.random() * (priceRange[1] - priceRange[0])) * 100
    ) / 100
    const originalPrice = Math.round(price * (1.05 + Math.random() * 0.35) * 100) / 100
    const sales = Math.floor(500 + Math.random() * 450000)
    const store = stores[i % stores.length]
    const suffix = suffixes[i % suffixes.length]
    const hash = Math.random().toString(36).substring(2, 8)
    const productId = `${platform}-${String(i + 1).padStart(3, '0')}`

    let url = ''
    if (platform === 'jd') {
      url = `https://item.jd.com/1000${Math.floor(100000 + Math.random() * 900000)}.html`
    } else if (platform === 'tb') {
      url = `https://item.taobao.com/item.htm?id=${Math.floor(100000000 + Math.random() * 900000000)}`
    } else {
      url = `https://mobile.yangkeduo.com/goods.html?goods_id=${Math.floor(100000000 + Math.random() * 900000000)}`
    }

    products.push({
      id: productId,
      name: `${keyword} ${suffix} ${hash}`,
      price,
      originalPrice,
      sales,
      storeName: store[0],
      storeRating: Math.round((store[1] + (Math.random() * 0.4 - 0.3)) * 10) / 10,
      platform: platform as 'jd' | 'tb' | 'pdd',
      url,
      imageUrl: '',
    })
  }

  return products
}

function scoreProducts(products: Product[]): Product[] {
  if (!products.length) return products

  const prices = products.map((p) => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1
  const maxSales = Math.max(...products.map((p) => p.sales)) || 1

  return products.map((p) => {
    const priceScore = ((1 - (p.price - minPrice) / priceRange) * 40)
    const ratingScore = (p.storeRating / 5.0) * 30
    const salesScore = (p.sales / maxSales) * 20
    const discount = p.originalPrice > 0 ? (p.originalPrice - p.price) / p.originalPrice : 0
    const discountScore = Math.min(discount * 100, 10)

    return {
      ...p,
      score: Math.round((priceScore + ratingScore + salesScore + discountScore) * 10) / 10,
    }
  })
}

function getComparison(products: Product[]): ComparisonResult {
  const prices = products.map((p) => p.price)
  const platformProducts: Record<string, Product[]> = {}

  for (const p of products) {
    if (!platformProducts[p.platform]) platformProducts[p.platform] = []
    platformProducts[p.platform].push(p)
  }

  const platformAvgPrices: Record<string, number> = {}
  for (const [plat, prods] of Object.entries(platformProducts)) {
    const platPrices = prods.map((p) => p.price)
    platformAvgPrices[plat] = Math.round((platPrices.reduce((a, b) => a + b, 0) / platPrices.length) * 100) / 100
  }

  return {
    cheapest: products.reduce((a, b) => (a.price < b.price ? a : b)),
    highestRated: products.reduce((a, b) => (a.storeRating > b.storeRating ? a : b)),
    bestSeller: products.reduce((a, b) => (a.sales > b.sales ? a : b)),
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
    },
    platformAvgPrices,
  }
}

function getRecommendations(products: Product[]): Recommendation[] {
  const scored = scoreProducts(products)
  const sorted = [...scored].sort((a, b) => (b.score || 0) - (a.score || 0))
  const recommendations: Recommendation[] = []

  const bestValue = sorted[0]
  recommendations.push({
    product: bestValue,
    score: bestValue.score || 0,
    badge: 'best_value',
    reason: `综合性价比最高，评分${bestValue.score}分，价格¥${bestValue.price}`,
  })

  const highestRated = scored.reduce((a, b) => (a.storeRating > b.storeRating ? a : b))
  if (highestRated.id !== bestValue.id) {
    recommendations.push({
      product: highestRated,
      score: highestRated.score || 0,
      badge: 'best_quality',
      reason: `店铺评分最高${highestRated.storeRating}分，品质保障`,
    })
  }

  const bestSeller = scored.reduce((a, b) => (a.sales > b.sales ? a : b))
  if (bestSeller.id !== bestValue.id) {
    recommendations.push({
      product: bestSeller,
      score: bestSeller.score || 0,
      badge: 'best_seller',
      reason: `销量最高${bestSeller.sales}件，大众之选`,
    })
  }

  const cheapest = scored.reduce((a, b) => (a.price < b.price ? a : b))
  if (cheapest.id !== bestValue.id) {
    recommendations.push({
      product: cheapest,
      score: cheapest.score || 0,
      badge: 'good_deal',
      reason: `全网最低价¥${cheapest.price}，超值入手`,
    })
  }

  return recommendations.slice(0, 4)
}

router.post('/', (req: Request, res: Response) => {
  const { keyword, platforms } = req.body as { keyword: string; platforms?: string[] }

  if (!keyword) {
    res.status(400).json({ success: false, error: '关键词不能为空' })
    return
  }

  const targetPlatforms = platforms || ['jd', 'tb', 'pdd']
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

  const allProducts: Product[] = []
  for (const platform of targetPlatforms) {
    allProducts.push(...generateProducts(keyword, platform, 5))
  }

  const scored = scoreProducts(allProducts)
  const sorted = scored.sort((a, b) => a.price - b.price)
  const comparison = getComparison(sorted)
  const recommendations = getRecommendations(sorted)

  const result: SearchResult = {
    keyword,
    timestamp: new Date().toISOString(),
    products: sorted,
    comparison,
    recommendations,
  }

  tasks.set(taskId, result)

  res.json({ success: true, taskId, status: 'completed', result })
})

router.get('/demo', (_req: Request, res: Response) => {
  const keyword = 'iPhone 16'
  const allProducts: Product[] = [
    ...generateProducts(keyword, 'jd', 5),
    ...generateProducts(keyword, 'tb', 5),
    ...generateProducts(keyword, 'pdd', 5),
  ]

  const scored = scoreProducts(allProducts)
  const sorted = scored.sort((a, b) => a.price - b.price)
  const comparison = getComparison(sorted)
  const recommendations = getRecommendations(sorted)

  res.json({
    success: true,
    result: {
      keyword,
      timestamp: new Date().toISOString(),
      products: sorted,
      comparison,
      recommendations,
    },
  })
})

export default router
