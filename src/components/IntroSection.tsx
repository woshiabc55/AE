import { motion } from "framer-motion";
import { introParagraphs } from "@/data/chapters";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function IntroSection() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="mx-auto mb-12 h-px w-16 bg-gradient-to-r from-transparent via-star-flare to-transparent"
        />
        <div className="space-y-8">
          {introParagraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.5 }}
              className={`font-serif leading-loose ${
                i === 0
                  ? "text-xl text-star-white/85 md:text-2xl"
                  : "text-base text-star-white/55 md:text-lg"
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
