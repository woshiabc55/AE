import { AnimatePresence, motion } from 'framer-motion'
import type { Chapter } from '../data/chapters'

interface Props {
  chapter: Chapter
}

/** 底部影院字幕条：随章节切换自动滚动 */
export const CinemaBar: React.FC<Props> = ({ chapter }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="px-6 py-2 bg-ink-950/70 border border-gold-700/30 backdrop-blur-md flex items-center gap-4 text-silk-300/80 font-seal tracking-widest text-xs"
        >
          <span className="text-cinnabar animate-flicker">●</span>
          <span>REC</span>
          <span className="text-silk-300/30">|</span>
          <span>{chapter.title}</span>
          <span className="text-silk-300/30">|</span>
          <span className="text-gold-500/80">{chapter.kind.toUpperCase()}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
