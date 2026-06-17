export type HeroRole = 'tank' | 'warrior' | 'assassin' | 'mage' | 'marksman' | 'support'
export type HeroGender = 'male' | 'female' | 'other'

export interface Hero {
  id: number
  name: string
  title: string
  role: HeroRole
  gender: HeroGender
  faction: string
  releaseYear: number
  skinCount: number
  popularity: number
}

export type SkinTier = 'common' | 'epic' | 'legend' | 'glory'

export interface SkinTierCount {
  common: number
  epic: number
  legend: number
  glory: number
}

export interface SkinYearly {
  year: number
  count: number
}

export interface SkinSeries {
  series: string
  count: number
}

export interface SkinSummary {
  totalSkins: number
  tierDistribution: SkinTierCount
  yearlyTrend: SkinYearly[]
  topSeries: SkinSeries[]
}

export type GamePlatform = 'mobile' | 'pc' | 'console'
export type GameRegion = 'cn' | 'global' | 'both'

export interface Game {
  id: number
  name: string
  category: string
  platform: GamePlatform
  region: GameRegion
  rating: number
  peakCCU: number
  releaseYear: number
}
