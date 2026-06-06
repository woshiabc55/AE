import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'

export function Hero({ totalDerivatives, totalIPs, typeCount, yearSpan }: {
  totalDerivatives: number
  totalIPs: number
  typeCount: number
  yearSpan: [number, number]
}) {
  return (
    <section className="relative overflow-hidden border-b border-bone/10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-arcane"
          >
            <Sparkles className="h-4 w-4" />
            <span className="label-pixel">v2026.06.08 · 全球游戏 IP 衍生生态</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="pixel-h mt-6 text-3xl leading-tight text-bone md:text-5xl lg:text-6xl"
          >
            把每一部<span className="glow-text">游戏改编动画</span><br />
            每一只<span className="glow-text-blue">手办</span>，<br />
            每一场<span className="glow-text-green">主题展</span><br />
            收进一座<span className="text-neon">像素档案馆</span>。
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="serif-cn mt-6 max-w-2xl text-base leading-relaxed text-bone/75 md:text-lg"
          >
            <b>次元典藏 IP-CODEX</b> 是一份面向玩家与藏家的可视化资料库，覆盖 {totalIPs}+ 个游戏 IP、{typeCount} 种衍生形式、共 {totalDerivatives.toLocaleString()} 项可检索作品，年份跨度 {yearSpan[0]}–{yearSpan[1]}。支持搜索、筛选、对比、收藏与本地导出。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/library" className="btn-pixel accent">
              进入资料库
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/favorites" className="btn-pixel ghost">我的收藏</Link>
            <Link to="/compare" className="btn-pixel azure">对比模式</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <Kbd hint="搜索">⌘K</Kbd>
            <Kbd hint="收藏">F</Kbd>
            <Kbd hint="对比">C</Kbd>
            <Kbd hint="详情">空格</Kbd>
          </motion.div>
        </div>

        {/* Visual: gradient mesh with badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative hidden min-h-[420px] lg:block"
        >
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2">
            {HERO_TILES.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="tile flex flex-col justify-between p-3"
                style={{ background: `linear-gradient(160deg, hsla(${t.hue}, 70%, 50%, 0.15), hsla(${(t.hue + 60) % 360}, 70%, 30%, 0.18))` }}
              >
                <div className="flex items-center justify-between text-bone/80">
                  <span className="text-2xl">{t.glyph}</span>
                  <span className="font-pixel text-[8px] tracking-widest text-bone/55">{t.year}</span>
                </div>
                <div>
                  <div className="font-pixel text-[10px] leading-tight text-bone">{t.label}</div>
                  <div className="vt-text text-[12px] text-bone/65">{t.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Kbd({ hint, children }: { hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <kbd className="grid h-7 min-w-7 place-items-center border border-bone/35 bg-ink px-2 font-pixel text-[10px] text-bone">
        {children}
      </kbd>
      <span className="font-mono text-[10px] uppercase tracking-widest text-bone/55">{hint}</span>
    </div>
  )
}

const HERO_TILES = [
  { label: 'TV动画', sub: '漫长的陪伴', year: 1997, hue: 28, glyph: 'TV' },
  { label: '剧场版', sub: '年度盛事', year: 1998, hue: 220, glyph: '🎬' },
  { label: '手办', sub: '触手可及', year: 2003, hue: 320, glyph: '🗿' },
  { label: '主题咖啡', sub: '线下圣地', year: 2014, hue: 56, glyph: '☕' },
  { label: '交响乐', sub: '声音巡礼', year: 2018, hue: 188, glyph: '🎼' },
  { label: '联动', sub: '打破次元', year: 2021, hue: 12, glyph: '🤝' },
  { label: '舞台剧', sub: '2.5次元的魅力', year: 2017, hue: 0, glyph: '🎭' },
  { label: '小说', sub: '另一种叙事', year: 2009, hue: 270, glyph: '📕' },
  { label: 'TCG', sub: '集换的乐趣', year: 1996, hue: 80, glyph: '🃏' },
]
