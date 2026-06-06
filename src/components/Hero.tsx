import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta } from "@/data/shots";

interface HeroProps {
  onEnter: () => void;
}

export default function Hero({ onEnter }: HeroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Faint scan line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent animate-scan" />
      </div>

      {/* Corner registration marks */}
      <CornerMarks />

      <div className="relative z-10 text-center px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
          transition={{ duration: 0.8 }}
          className="label mb-6"
        >
          ⌬ PRODUCTION STORYBOARD — INTERNAL DRAFT
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: phase >= 2 ? 1 : 0, letterSpacing: phase >= 2 ? "0.04em" : "0.6em" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="numeral text-[120px] md:text-[200px] text-bone glow-cyan"
        >
          {projectMeta.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-mono text-fog text-sm tracking-[0.3em] mt-2"
        >
          {projectMeta.titleEn} · {projectMeta.format}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 8 }}
          transition={{ duration: 0.8 }}
          className="mt-12 flex items-center justify-center gap-6 font-mono text-fog"
        >
          <span className="text-blood tracking-widest">{projectMeta.sequence}</span>
          <span className="w-12 h-px bg-fog/30" />
          <span className="tracking-widest">{projectMeta.timecode}</span>
          <span className="w-12 h-px bg-fog/30" />
          <span className="tracking-widest">DURATION · {projectMeta.duration}s</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={onEnter}
          className="mt-16 group relative inline-flex items-center gap-3 font-mono text-xs tracking-[0.4em] text-bone/80 hover:text-bone transition-colors"
        >
          <span className="w-8 h-px bg-bone/40 group-hover:bg-blood group-hover:w-12 transition-all" />
          ENTER THE SEQUENCE
          <span className="w-8 h-px bg-bone/40 group-hover:bg-blood group-hover:w-12 transition-all" />
        </motion.button>
      </div>

      {/* Bottom TC strip */}
      <div className="absolute bottom-8 left-0 right-0 px-12 flex justify-between font-mono text-[10px] text-fog/60 tracking-widest">
        <span>REC ●</span>
        <span>{projectMeta.timecode} / TC</span>
        <span>{projectMeta.format}</span>
      </div>
    </section>
  );
}

function CornerMarks() {
  const m = "absolute w-4 h-4 border-bone/30";
  return (
    <>
      <div className={`${m} top-8 left-8 border-l border-t`} />
      <div className={`${m} top-8 right-8 border-r border-t`} />
      <div className={`${m} bottom-8 left-8 border-l border-b`} />
      <div className={`${m} bottom-8 right-8 border-r border-b`} />
    </>
  );
}
