import { motion } from 'framer-motion'
import { fmtType } from '../../lib/stats'
import type { DerivativeType } from '../../data/derivatives'

interface TypeRadarProps {
  typeDist: Array<{ type: string; label: string; count: number }>
}

export function TypeRadar({ typeDist }: TypeRadarProps) {
  const max = Math.max(...typeDist.map(t => t.count))
  return (
    <section className="border-b border-bone/10">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="pixel-h text-xl glow-text-blue">衍生形式 · 分布雷达</h2>
          <span className="label-pixel opacity-70">点击查看</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {typeDist.map((t, i) => {
            const v = t.count / max
            const hue = (i * 37) % 360
            return (
              <motion.button
                key={t.type}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="tile flex flex-col items-start gap-2 p-3 text-left"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="label-pixel opacity-80">{t.type}</span>
                  <span className="font-pixel text-[10px] text-bone/55">№{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="font-pixel text-sm text-bone">{fmtType(t.type)}</div>
                <div className="flex w-full items-end gap-1">
                  <div className="font-pixel text-2xl" style={{ color: `hsl(${hue} 80% 65%)` }}>
                    {t.count}
                  </div>
                  <div className="flex-1 pb-1.5">
                    <div className="h-2 bg-bone/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${v * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.02 }}
                        className="h-full"
                        style={{ background: `hsl(${hue} 80% 60%)` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
