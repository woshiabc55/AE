import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Trophy } from 'lucide-react'

interface TopIPsProps {
  topIps: Array<{ ip: string; count: number; hue: number }>
  max: number
}

export function TopIPs({ topIps, max }: TopIPsProps) {
  return (
    <section className="border-b border-bone/10">
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-neon" />
            <h2 className="pixel-h text-xl glow-text">衍生最多 · IP 排行</h2>
          </div>
          <Link to="/library" className="font-mono text-xs text-bone/65 hover:text-bone">
            查看全部 → 
          </Link>
        </div>
        <ol className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {topIps.map((it, i) => (
            <motion.li
              key={it.ip}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="tile flex items-center gap-4 p-3"
            >
              <div
                className="grid h-10 w-10 place-items-center font-pixel text-xs text-ink"
                style={{ background: `hsl(${it.hue} 80% 60%)` }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="font-pixel text-sm text-bone">{it.ip}</div>
                <div className="mt-1 h-1.5 bg-bone/10">
                  <div
                    className="h-full"
                    style={{ width: `${(it.count / max) * 100}%`, background: `hsl(${it.hue} 80% 60%)` }}
                  />
                </div>
              </div>
              <div className="font-pixel text-base text-bone" style={{ color: `hsl(${it.hue} 80% 70%)` }}>
                {it.count}
              </div>
              <ChevronRight className="h-4 w-4 text-bone/35" />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
