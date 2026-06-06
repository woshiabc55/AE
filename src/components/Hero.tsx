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
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* 全屏点阵背景 — 暗角 + 漂移 */}
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-60" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/40 to-transparent" />

      {/* 角落定位标记 */}
      <CornerMarks />

      {/* 左上 — 序列号 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
        transition={{ duration: 0.8 }}
        className="absolute top-12 left-12 z-10"
      >
        <div className="label">SEQ.</div>
        <div className="numeral text-bone text-4xl mt-1">{projectMeta.sequence.replace("SEQ ", "")}</div>
      </motion.div>

      {/* 右上 — 项目编号 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-12 right-12 z-10 text-right"
      >
        <div className="label">TC IN / OUT</div>
        <div className="font-mono text-bone text-sm tracking-widest mt-1">
          {projectMeta.timecode}
        </div>
        <div className="font-mono text-fog text-[10px] tracking-widest mt-1">
          {projectMeta.duration} SEC
        </div>
      </motion.div>

      {/* 主内容区 — 居中略偏左 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 grid grid-cols-12 gap-8 items-center">
        {/* 左侧 — 标题区 */}
        <div className="col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -30 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="label mb-3">PRODUCTION STORYBOARD</div>
            <h1 className="numeral text-bone text-[160px] md:text-[220px] leading-none glow-cyan">
              {projectMeta.title}
            </h1>
            <div className="font-mono text-fog text-sm tracking-[0.4em] mt-2">
              {projectMeta.titleEn} · {projectMeta.format}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border-t border-bone/15 pt-6 max-w-2xl"
          >
            <p className="font-serif text-bone/80 text-lg leading-relaxed">
              一个下沉的死亡现场。十五秒，五镜头，垂直穿越三千八百米。
            </p>
            <p className="font-mono text-fog/80 text-xs tracking-widest mt-3">
              FROM OCEAN SURFACE TO TRENCH FLOOR — A VERTICAL DESCENT OF FORGETTING.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={onEnter}
            className="group flex items-center gap-4 font-mono text-xs tracking-[0.4em] text-bone hover:text-blood transition-colors"
          >
            <span className="w-10 h-px bg-bone/40 group-hover:bg-blood group-hover:w-16 transition-all" />
            BEGIN SEQUENCE
            <span className="w-10 h-px bg-bone/40 group-hover:bg-blood group-hover:w-16 transition-all" />
          </motion.button>
        </div>

        {/* 右侧 — 点阵巨字时间码 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="col-span-5 flex flex-col items-end gap-6"
        >
          {/* 主时间码 — 巨号点阵 */}
          <div className="flex flex-col items-end">
            <div className="label mb-3">DURATION</div>
            <DotNumber num="3:15" size={12} onColor="#E63946" />
            <div className="font-mono text-fog text-[10px] tracking-widest mt-2">
              15.00 SEC · 24FPS · 360 FRAMES
            </div>
          </div>

          {/* 深度数字 */}
          <div className="flex flex-col items-end">
            <div className="label mb-2">DEPTH RANGE</div>
            <DotNumber num="0/-3800M" size={7} onColor="#7A8B99" />
          </div>

          {/* 场次标记 */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blood animate-pulse" />
            <span className="font-mono text-[10px] text-bone tracking-widest">RECORDING</span>
          </div>
        </motion.div>
      </div>

      {/* 底部导航提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-fog tracking-widest">SCROLL · OR USE ARROW KEYS</span>
        <div className="w-px h-8 bg-gradient-to-b from-fog/60 to-transparent" />
      </motion.div>

      {/* 右侧场次编号 */}
      <div className="absolute right-12 bottom-12 z-10 font-mono text-[10px] text-fog/60 tracking-widest text-right">
        <div>SCRIPT DRAFT</div>
        <div className="text-bone/60 mt-1">REV 0.1 · INTERNAL</div>
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
