import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* 原恒星脉动光晕 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 animate-pulse-slow rounded-full bg-star-ember/20 blur-[80px]" />
        <div className="absolute inset-[20%] animate-flicker rounded-full bg-star-flare/30 blur-[50px]" />
        <div className="absolute inset-[40%] rounded-full bg-star-core/40 blur-[20px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.3 }}
        className="relative z-10"
      >
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.5em] text-star-blue/70">
          时间印记 · 约负46亿年
        </p>
        <h1 className="font-display text-7xl font-light leading-none text-star-white text-glow-ember md:text-9xl">
          地球诞生前
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mx-auto mt-8 max-w-xl font-serif text-base leading-relaxed text-star-white/60 md:text-lg"
        >
          一场穿越至时间之源的观察
          <br />
          坐标：原太阳星云内部
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-star-white/40">
          向下滚动
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-star-flare/70" />
      </motion.div>
    </section>
  );
}
