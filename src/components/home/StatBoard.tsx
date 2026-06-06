import { CountUp } from '../ui/CountUp'
import { motion } from 'framer-motion'

interface StatBoardProps {
  totalDerivatives: number
  totalIPs: number
  typeCount: number
  yearSpan: [number, number]
  regionCount: number
}

export function StatBoard({ totalDerivatives, totalIPs, typeCount, yearSpan, regionCount }: StatBoardProps) {
  const items = [
    { label: '衍生作品总数', value: totalDerivatives, hue: 28, glow: 'glow-text' },
    { label: '覆盖游戏 IP', value: totalIPs, hue: 188, glow: 'glow-text-blue' },
    { label: '衍生形式', value: typeCount, hue: 130, glow: 'glow-text-green' },
    { label: '首发地区', value: regionCount, hue: 280, glow: 'glow-text' },
    { label: '最早记录', value: yearSpan[0], hue: 220, glow: 'glow-text-blue' },
    { label: '最新记录', value: yearSpan[1], hue: 0, glow: 'glow-text' },
  ]
  return (
    <section className="border-b border-bone/10">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="pixel-h text-xl glow-text">数据看板</h2>
          <span className="label-pixel opacity-70">截至 2026.06.08</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="tile relative p-4"
              style={{ borderTop: `3px solid hsl(${it.hue} 80% 60%)` }}
            >
              <div className={`font-pixel text-2xl ${it.glow}`}>
                <CountUp value={it.value} />
              </div>
              <div className="mt-2 label-pixel opacity-80">{it.label}</div>
              <div className="mt-3 h-1 bg-bone/10">
                <div className="h-full" style={{ width: '60%', background: `hsl(${it.hue} 80% 60%)` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
