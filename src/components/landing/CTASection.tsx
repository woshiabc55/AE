import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-deep-black">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-orange/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6"
        >
          开始你的
          <span className="text-neon-cyan text-glow-cyan">AI编程之旅</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-muted text-lg mb-10 max-w-xl mx-auto"
        >
          加入 NexusCode，体验 AI 驱动的下一代开发方式。从想法到代码，只需一步。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 px-10 py-4 bg-neon-cyan text-deep-black font-display font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,240,181,0.4)] hover:scale-105"
          >
            立即开始
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
