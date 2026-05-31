import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

const codeLines = [
  'import React, { useState } from "react";',
  "",
  "interface CounterProps {",
  '  initialValue?: number;',
  "}",
  "",
  "export default function Counter({ initialValue = 0 }: CounterProps) {",
  "  const [count, setCount] = useState(initialValue);",
  "",
  "  return (",
  '    <div className="flex items-center gap-4">',
  '      <button onClick={() => setCount(count - 1)}>-</button>',
  "      <span className=\"font-mono text-2xl\">{count}</span>",
  '      <button onClick={() => setCount(count + 1)}>+</button>',
  "    </div>",
  "  );",
  "}",
];

export default function CodeDemoSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (visibleLines >= codeLines.length) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= codeLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [started, visibleLines]);

  return (
    <section className="relative py-32 px-6 bg-deep-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI 代码生成演示
          </h2>
          <p className="font-body text-muted text-lg">
            描述需求，AI 为你编写代码
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-neon-cyan/30 overflow-hidden shadow-[0_0_40px_rgba(0,240,181,0.08)]"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-panel-gray/80 border-b border-border-gray">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 ml-3 text-muted text-sm font-mono">
              <Code2 className="w-4 h-4 text-neon-cyan" />
              Counter.tsx
            </div>
          </div>

          <div className="bg-deep-black p-6 font-mono text-sm leading-7 min-h-[400px]">
            {codeLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 text-right mr-6 text-muted/50 select-none">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{line || "\u00A0"}</span>
              </div>
            ))}
            {visibleLines < codeLines.length && (
              <div className="flex">
                <span className="w-8 text-right mr-6 text-muted/50 select-none">
                  {visibleLines + 1}
                </span>
                <span className="animate-typing-cursor text-neon-cyan">▎</span>
              </div>
            )}
            {visibleLines >= codeLines.length && (
              <div className="flex">
                <span className="w-8 text-right mr-6 text-muted/50 select-none">
                  {codeLines.length + 1}
                </span>
                <span className="animate-typing-cursor text-neon-cyan">▎</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
