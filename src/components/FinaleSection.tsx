import { motion } from "framer-motion";
import { finaleParagraphs } from "@/data/chapters";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import MagmaSea from "./MagmaSea";

export default function FinaleSection() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="bg-finale relative flex min-h-screen items-center overflow-hidden px-6 py-24 md:px-16"
    >
      <MagmaSea />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-magma-flow" />
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-star-white/50">
            Finale · 终章
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-display text-5xl font-light text-magma-glow text-glow-ember md:text-7xl"
        >
          最终结局
        </motion.h2>

        <div className="mt-10 space-y-6">
          {finaleParagraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.3 }}
              className={`font-serif leading-loose ${
                para.emphasis
                  ? "border-l-2 border-magma-flow/50 pl-5 text-xl text-magma-glow md:text-2xl"
                  : "text-base text-star-white/70 md:text-lg"
              }`}
            >
              {para.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
