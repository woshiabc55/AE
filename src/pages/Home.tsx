import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Hero } from '../components/home/Hero'
import { StatBoard } from '../components/home/StatBoard'
import { TopIPs } from '../components/home/TopIPs'
import { TypeRadar } from '../components/home/TypeRadar'
import { Featured } from '../components/home/Featured'
import { DERIVATIVES } from '../data/derivatives'
import { IPS } from '../data/ips'
import { computeStats } from '../lib/stats'

export function Home() {
  const stats = useMemo(() => computeStats(DERIVATIVES, IPS), [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero
        totalDerivatives={stats.totalDerivatives}
        totalIPs={stats.totalIPs}
        typeCount={stats.totalTypes}
        yearSpan={stats.yearSpan}
      />
      <StatBoard
        totalDerivatives={stats.totalDerivatives}
        totalIPs={stats.totalIPs}
        typeCount={stats.totalTypes}
        yearSpan={stats.yearSpan}
        regionCount={stats.regionDist.length}
      />
      <TypeRadar typeDist={stats.typeDist} />
      <TopIPs
        topIps={stats.topIPs}
        max={Math.max(...stats.topIPs.map(i => i.count))}
      />
      <Featured items={stats.topRated} title="编辑精选 · 评分 Top 8" hint="基于社区评分" />
      <Featured items={stats.newest} title="近期更新 · 最新 8 项" hint="按发售日期" />
    </motion.div>
  )
}
