import type { Hero, Game, HeroRole, GamePlatform } from '../types'

export const ROLE_LABELS: Record<HeroRole, string> = {
  tank:     '坦克',
  warrior:  '战士',
  assassin: '刺客',
  mage:     '法师',
  marksman: '射手',
  support:  '游走'
}

export const ROLE_COLORS: Record<HeroRole, string> = {
  tank:     '#00E5FF',
  warrior:  '#FF2E63',
  assassin: '#A78BFA',
  mage:     '#FFD460',
  marksman: '#4ADE80',
  support:  '#60A5FA'
}

export const PLATFORM_LABELS: Record<GamePlatform, string> = {
  mobile:  '手游',
  pc:      '端游',
  console: '主机'
}

export const PLATFORM_COLORS: Record<GamePlatform, string> = {
  mobile:  '#00E5FF',
  pc:      '#FFD460',
  console: '#FF2E63'
}

export const CATEGORY_COLORS = [
  '#00E5FF', '#FF2E63', '#FFD460', '#A78BFA',
  '#4ADE80', '#60A5FA', '#F472B6', '#FB923C',
  '#34D399', '#22D3EE'
] as const

export function groupBy<T, K extends string | number>(arr: T[], key: (t: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function countBy<T, K extends string | number>(arr: T[], key: (t: T) => K): Record<K, number> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<K, number>)
}

export function topHeroesByPopularity(heroes: Hero[], n = 15): Hero[] {
  return [...heroes].sort((a, b) => b.popularity - a.popularity).slice(0, n)
}

export function avgRating(games: Game[]): number {
  if (games.length === 0) return 0
  return Number((games.reduce((s, g) => s + g.rating, 0) / games.length).toFixed(2))
}
