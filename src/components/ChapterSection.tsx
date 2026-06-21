import { motion } from "framer-motion";
import type { Chapter } from "@/data/chapters";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const accentMap = {
  ember: {
    text: "text-star-ember",
    glow: "text-glow-ember",
    border: "border-star-ember/30",
    dot: "bg-star-ember",
  },
  blue: {
    text: "text-star-blue",
    glow: "text-glow-blue",
    border: "border-star-blue/30",
    dot: "bg-star-blue",
  },
  flare: {
    text: "text-star-flare",
    glow: "text-glow-ember",
    border: "border-star-flare/30",
    dot: "bg-star-flare",
  },
} as const;

interface ChapterSectionProps {
  chapter: Chapter;
  children?: React.ReactNode;
}

export default function ChapterSection({ chapter, children }: ChapterSectionProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const accent = accentMap[chapter.accent];

  return (
    <section
      ref={ref}
      className={`relative flex min-h-screen items-center overflow-hidden px-6 py-24 md:px-16 ${chapter.bgClass}`}
    >
      {/* 章节序号水印 */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 0.06 } : {}}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-display text-[40vmin] font-light leading-none text-star-white md:right-16"
      >
        {chapter.roman}
      </motion.span>

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* 章节标识 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className={`h-px w-12 ${accent.dot}`} />
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-star-white/50">
            Chapter {chapter.index}
          </span>
          <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
        </motion.div>

        {/* 标题 */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className={`font-display text-5xl font-light ${accent.text} ${accent.glow} md:text-7xl`}
        >
          {chapter.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-3 font-serif text-lg text-star-white/70 md:text-xl"
        >
          {chapter.subtitle}
        </motion.p>

        {/* 正文 */}
        <div className="mt-10 space-y-6">
          {chapter.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 + i * 0.25 }}
              className={`font-serif leading-loose ${
                para.emphasis
                  ? "border-l-2 pl-5 text-lg text-star-white/90 md:text-xl"
                  : "text-base text-star-white/65 md:text-lg"
              } ${para.emphasis ? accent.border : ""}`}
            >
              {para.text}
            </motion.p>
          ))}
        </div>

        {/* 章节专属动画 */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-12"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
