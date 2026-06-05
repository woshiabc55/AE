import { motion } from 'framer-motion'
import { Seal, ScrollCaps, Birds, MountainRange } from '../lib/svg'

interface Props {
  onStart: () => void
}

export const HeroOpening: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <MountainRange className="absolute inset-x-0 bottom-0 w-full h-2/3 opacity-90" tone="#3D5A5A" />
        <Birds className="absolute top-1/3 left-0 w-full opacity-60" />
      </div>
      <div className="absolute right-[20%] top-[34%] w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,161,74,0.65), rgba(162,43,31,0.2) 60%, transparent 70%)', filter: 'blur(2px)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, ease: 'easeOut' }} className="text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <span className="h-px w-16 bg-gold-500/40" />
            <span className="lens-tag">PROLOGUE · 卷首</span>
            <span className="h-px w-16 bg-gold-500/40" />
          </div>
          <h1 className="font-brush text-silk-100 text-[14vw] md:text-[10rem] leading-none tracking-wide">
            <span className="text-stroke-gold">卷</span>
            <span className="mx-4 text-cinnabar">一</span>
            <span className="text-stroke-gold">·</span>
            <span className="ml-4">江</span>
            <span>湖</span>
          </h1>
          <p className="mt-6 text-silk-300/80 max-w-2xl mx-auto leading-8 font-serif">
            「墨卷为屏，江湖为幕」。四段长镜头徐徐展开，文房雅物与江湖典籍，悉列卷上。客官可自卷首下卷，览尽一段旖旎古意。
          </p>
        </motion.div>
        <motion.button onClick={onStart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-12 group flex flex-col items-center gap-3">
          <span className="btn-seal">向下卷展</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-gold-500/80 text-sm tracking-[0.4em] font-seal">↓</motion.span>
        </motion.button>
      </div>
      <div className="absolute top-24 right-12 hidden md:flex flex-col items-end gap-1 opacity-80">
        <Seal char="首" size={44} rotate={4} />
        <div className="text-[11px] font-seal tracking-[0.4em] text-silk-300/50">HRNMLJ · MMXXVI</div>
      </div>
      <div className="absolute bottom-12 left-12 hidden md:block">
        <div className="font-brush text-silk-300/70 text-lg leading-relaxed">
          <div>客官入卷</div>
          <div>请先观影</div>
        </div>
      </div>
      <ScrollCaps position="top" />
      <ScrollCaps position="bottom" />
      <div className="absolute inset-0 vignette pointer-events-none" />
    </div>
  )
}
