import { motion } from 'framer-motion'
import { ChapterScene } from './chapters/ChapterScene'
import type { Chapter } from '../data/chapters'
import { Seal } from '../lib/svg'

interface Props {
  index: number
  chapter: Chapter
  active: boolean
  onPrev: () => void
  onNext: () => void
  progress: number
}

export const ChapterSection: React.FC<Props> = ({
  index,
  chapter,
  active,
  onPrev,
  onNext,
  progress,
}) => {
  return (
    <section
      id={`chapter-${chapter.id}`}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 分镜画布 */}
      <div className="absolute inset-0">
        <ChapterScene chapter={chapter} active={active} progress={progress} />
        <div className="absolute inset-0 scanline opacity-40 pointer-events-none" />
        <div className="absolute inset-0 vignette pointer-events-none" />
      </div>

      {/* 顶部章节头 */}
      <div className="absolute top-0 left-0 right-0 px-8 md:px-16 pt-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Seal char={chapter.seal} size={56} rotate={-6} />
            <div>
              <div className="lens-tag">CHAPTER {String(chapter.id).padStart(2, '0')}</div>
              <h2 className="font-brush text-silk-100 text-5xl md:text-6xl mt-1">
                {chapter.title}
              </h2>
              <div className="text-silk-300/70 tracking-[0.4em] text-xs mt-2 font-seal">
                {chapter.subtitle}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-silk-300/40 text-xs font-seal tracking-widest">
            <span>SHOT</span>
            <span className="text-gold-500/80">{String(index + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>04</span>
            <span className="ml-2">·</span>
            <span>{chapter.kind.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 底部字幕条（电影感） */}
      <div className="absolute bottom-0 left-0 right-0 caption-bar">
        <div className="max-w-5xl mx-auto px-8 py-8 flex items-end justify-between gap-6">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-brush text-silk-100/90 text-2xl md:text-3xl"
          >
            <ul className="space-y-2">
              {chapter.bgCaption.map((line, i) => (
                <li key={i} className="text-stroke-gold">
                  <span className="text-cinnabar mr-3 font-seal text-base">{String(i + 1).padStart(2, '0')}.</span>
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="w-9 h-9 grid place-items-center border border-gold-500/30 text-gold-500/80 hover:bg-gold-500/10 transition"
                aria-label="上一卷"
              >
                ←
              </button>
              <button
                onClick={onNext}
                className="w-9 h-9 grid place-items-center border border-gold-500/30 text-gold-500/80 hover:bg-gold-500/10 transition"
                aria-label="下一卷"
              >
                →
              </button>
            </div>
            <div className="text-[10px] text-silk-300/40 tracking-widest font-seal">
              ◀ PREV · NEXT ▶
            </div>
          </div>
        </div>
      </div>

      {/* 镜头元数据：左下角 */}
      <div className="absolute bottom-8 left-8 hidden md:flex flex-col gap-1 text-silk-300/40 text-[10px] tracking-widest font-seal">
        <div>ISO · 800</div>
        <div>SHUTTER · 1/120s</div>
        <div>LENS · 200mm</div>
        <div className="text-cinnabar/80">REC ● 00:{String(8 + index * 3).padStart(2, '0')}:14</div>
      </div>
    </section>
  )
}
