import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta } from "@/data/shots";
import DotNumber from "./DotNumber";

interface HeroProps {
  onEnter: () => void;
}

export default function Hero({ onEnter }: HeroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* 全屏点阵背景 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-60" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/40 to-transparent" />

      {/* 角落定位标记 */}
      <CornerMarks />

      {/* 左上 — 场次号 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
        transition={{ duration: 0.8 }}
        className="absolute top-12 left-12 z-10"
      >
        <div className="label">A FILM ABOUT</div>
        <div className="numeral text-bone text-3xl mt-1">SINKING</div>
      </motion.div>

      {/* 右上 — 时长 + 格式 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-12 right-12 z-10 text-right"
      >
        <div className="label">DURATION</div>
        <div className="mt-1">
          <DotNumber num="3:15" size={5} onColor="#E63946" />
        </div>
        <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
          {projectMeta.format}
        </div>
      </motion.div>

      {/* 主内容 — 12 栏布局 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-12 gap-8 items-end">
          {/* 左侧 — 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 30 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="col-span-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-blood" />
              <div className="label">深渊恐惧</div>
            </div>

            <h1 className="font-serif text-bone text-[140px] md:text-[200px] leading-[0.9] tracking-tight">
              深渊
              <br />
              <span className="text-blood glow-blood">恐惧</span>
            </h1>

            <div className="flex items-center gap-4 mt-6">
              <div className="font-mono text-fog text-xs tracking-[0.4em]">
                {projectMeta.titleEn} · {projectMeta.subtitleEn}
              </div>
              <div className="flex-1 h-px bg-bone/15" />
              <div className="font-mono text-bone text-xs tracking-widest">
                {projectMeta.sequence}
              </div>
            </div>
          </motion.div>

          {/* 右侧 — 诗意引文 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-4 border-l border-bone/15 pl-6 pb-4"
          >
            <p className="font-serif text-bone/80 text-lg leading-relaxed italic">
              "海面给出一个物体。<br />
              海沟收走一具身体。<br />
              中间是水。"
            </p>
            <div className="font-mono text-fog/60 text-[10px] tracking-widest mt-4">
              — SCREENPLAY EXCERPT
            </div>
          </motion.div>
        </div>

        {/* 底部信息条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-12 gap-8 border-t border-bone/15 pt-6"
        >
          <div className="col-span-3">
            <div className="label">SCENE</div>
            <div className="font-mono text-bone text-sm tracking-widest mt-1">
              {projectMeta.timecode}
            </div>
            <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
              PACIFIC OCEAN · MARIANA TRENCH
            </div>
          </div>

          <div className="col-span-3">
            <div className="label">SHOTS</div>
            <div className="font-mono text-bone text-sm tracking-widest mt-1">05</div>
            <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
              SEQUENCE · 21 — 25
            </div>
          </div>

          <div className="col-span-3">
            <div className="label">DEPTH</div>
            <div className="font-mono text-bone text-sm tracking-widest mt-1">
              0 → -3800M
            </div>
            <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
              VERTICAL · 3.8 KILOMETERS
            </div>
          </div>

          <div className="col-span-3 text-right">
            <div className="label">FORMAT</div>
            <div className="font-mono text-bone text-sm tracking-widest mt-1">
              IMAX 3D
            </div>
            <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
              65mm · 5 PERF · 1.43:1
            </div>
          </div>
        </motion.div>

        {/* 入口按钮 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={onEnter}
          className="mt-12 group flex items-center gap-4 font-mono text-xs tracking-[0.4em] text-bone hover:text-blood transition-colors"
        >
          <span className="w-12 h-px bg-bone/40 group-hover:bg-blood group-hover:w-20 transition-all" />
          DESCEND · 开始下沉
          <span className="w-12 h-px bg-bone/40 group-hover:bg-blood group-hover:w-20 transition-all" />
        </motion.button>
      </div>

      {/* 底部场次编号 */}
      <div className="absolute right-12 bottom-12 z-10 font-mono text-[10px] text-fog/60 tracking-widest text-right">
        <div>SCRIPT DRAFT</div>
        <div className="text-bone/60 mt-1">REV 0.1 · INTERNAL</div>
      </div>

      {/* 底部 REC 标记 */}
      <div className="absolute left-12 bottom-12 z-10 flex items-center gap-3">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-blood"
        />
        <span className="font-mono text-[10px] text-bone tracking-widest">REC</span>
      </div>
    </section>
  );
}

function CornerMarks() {
  const cls = "absolute w-3 h-3 border-bone/30";
  return (
    <>
      <div className={`${cls} top-6 left-6 border-l border-t`} />
      <div className={`${cls} top-6 right-6 border-r border-t`} />
      <div className={`${cls} bottom-6 left-6 border-l border-b`} />
      <div className={`${cls} bottom-6 right-6 border-r border-b`} />
    </>
  );
}
