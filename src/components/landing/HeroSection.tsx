import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ParticleBackground from "@/components/landing/ParticleBackground";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-black">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-deep-black/40 via-transparent to-deep-black z-[1]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={item}
          className="font-display text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-glow-cyan text-neon-cyan mb-6"
        >
          NexusCode
        </motion.h1>

        <motion.p
          variants={item}
          className="font-body text-2xl md:text-3xl text-foreground mb-4"
        >
          AI驱动的下一代编程平台
        </motion.p>

        <motion.p
          variants={item}
          className="font-body text-lg text-muted max-w-2xl mx-auto mb-10"
        >
          用自然语言描述需求，AI 即刻生成高质量代码。智能补全、实时诊断、一键部署——重新定义你的开发工作流。
        </motion.p>

        <motion.div variants={item}>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-neon-cyan text-neon-cyan font-display font-semibold text-lg rounded-lg transition-all duration-300 hover:bg-neon-cyan/10 hover:shadow-[0_0_30px_rgba(0,240,181,0.3)] hover:scale-105"
          >
            进入工作台
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-black to-transparent z-10" />
    </section>
  );
}
