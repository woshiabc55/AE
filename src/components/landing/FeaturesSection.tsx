import { motion } from "framer-motion";
import { Sparkles, Brain, Bug } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI 代码生成",
    description:
      "用自然语言描述你的需求，AI 即刻生成高质量、可运行的代码。支持多种语言与框架，大幅提升开发效率。",
  },
  {
    icon: Brain,
    title: "智能补全",
    description:
      "基于上下文的 AI 驱动自动补全，理解你的代码意图，提供精准的代码建议，让编码如行云流水。",
  },
  {
    icon: Bug,
    title: "实时诊断",
    description:
      "毫秒级错误检测与智能修复建议。在编码的同时发现潜在问题，AI 提供修复方案，告别繁琐调试。",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

export default function FeaturesSection() {
  return (
    <section className="relative py-32 px-6 bg-deep-black">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl font-bold text-center text-foreground mb-4"
        >
          核心能力
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-muted text-center text-lg mb-16 max-w-2xl mx-auto"
        >
          三大 AI 引擎，全方位赋能你的开发流程
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-8 group cursor-default transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,240,181,0.15)]"
              >
                <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,240,181,0.3)] transition-shadow duration-300">
                  <Icon className="w-7 h-7 text-neon-cyan" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
