import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Footer() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <footer
      ref={ref}
      className="relative border-t border-star-white/10 px-6 py-16 md:px-16"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="mx-auto max-w-3xl"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-star-blue/60">
              时间印记
            </p>
            <p className="font-display text-2xl text-star-white/80">约 -4,600,000,000 年</p>
            <p className="mt-1 font-serif text-sm text-star-white/40">地球诞生前 · 太阳星云</p>
          </div>
          <div className="md:text-right">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-star-ember/60">
              坐标
            </p>
            <p className="font-mono text-sm text-star-white/60">原太阳星云内部</p>
            <p className="mt-1 font-mono text-xs text-star-white/30">RA: 未知 / Dec: 未知</p>
          </div>
        </div>

        <div className="mt-12 border-t border-star-white/5 pt-6">
          <p className="font-serif text-xs leading-relaxed text-star-white/30">
            本内容由 AI 生成，仅供参考，请仔细甄别。
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-star-white/20">
            穿越至时间之源 · A Cosmic Narrative
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
