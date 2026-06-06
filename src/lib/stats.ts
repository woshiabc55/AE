import type { Derivative } from '../data/derivatives'
import { REGION_LABEL, STATUS_LABEL, TYPE_LABEL } from '../data/derivatives'

export function fmtRegion(r: string) { return REGION_LABEL[r as keyof typeof REGION_LABEL] ?? r }
export function fmtStatus(s: string) { return STATUS_LABEL[s as keyof typeof STATUS_LABEL] ?? s }
export function fmtType(t: string) { return TYPE_LABEL[t as keyof typeof TYPE_LABEL] ?? t }

export function fmtDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function hueToGradient(h: number, sat = 70, light = 50) {
  return `linear-gradient(135deg, hsl(${h} ${sat}% ${light}%) 0%, hsl(${(h + 40) % 360} ${sat}% ${Math.max(20, light - 12)}%) 100%)`
}

// Aggregate stats
export interface Stats {
  totalDerivatives: number
  totalIPs: number
  totalTypes: number
  yearSpan: [number, number]
  topIPs: Array<{ ip: string; count: number; hue: number }>
  typeDist: Array<{ type: string; label: string; count: number }>
  regionDist: Array<{ region: string; label: string; count: number }>
  yearDist: Array<{ year: number; count: number }>
  topRated: Derivative[]
  newest: Derivative[]
}

export function computeStats(data: Derivative[], ips: Array<{ key: string; name: string; hue: number }>): Stats {
  const byIp = new Map<string, { count: number; hue: number }>()
  const byType = new Map<string, number>()
  const byRegion = new Map<string, number>()
  const byYear = new Map<number, number>()
  let yMin = 9999, yMax = 0
  for (const d of data) {
    byIp.set(d.ip, { count: (byIp.get(d.ip)?.count ?? 0) + 1, hue: d.coverHue })
    byType.set(d.type, (byType.get(d.type) ?? 0) + 1)
    byRegion.set(d.region, (byRegion.get(d.region) ?? 0) + 1)
    byYear.set(d.year, (byYear.get(d.year) ?? 0) + 1)
    if (d.year < yMin) yMin = d.year
    if (d.year > yMax) yMax = d.year
  }
  const topIPs = [...byIp.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12)
    .map(([ip, v]) => ({ ip, count: v.count, hue: v.hue }))
  const typeDist = [...byType.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count, label: fmtType(type) }))
  const regionDist = [...byRegion.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({ region, count, label: fmtRegion(region) }))
  const yearDist = [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }))
  const topRated = [...data].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const newest = [...data].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 6)
  return {
    totalDerivatives: data.length,
    totalIPs: ips.length,
    totalTypes: typeDist.length,
    yearSpan: [yMin, yMax],
    topIPs,
    typeDist,
    regionDist,
    yearDist,
    topRated,
    newest,
  }
}
