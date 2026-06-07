import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projectMeta } from "@/data/shots";

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
      {/* 多层点阵背景 — 立体感 */}
      <div className="absolute inset-0 dot-grid-dense dot-drift-fast opacity-40" />
      <div className="absolute inset-0 dot-grid dot-drift-slow opacity-50" />
      <div className="absolute inset-0 dot-grid-vignette" />

      {/* 锈色光斑 — 从左上角向中心扩散 */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 90, 43, 0.15) 0%, rgba(201, 90, 43, 0.05) 30%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* 青色光斑 — 从右下角 */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(26, 77, 107, 0.2) 0%, rgba(26, 77, 107, 0.05) 30%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* 顶部血线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/60 to-transparent z-10" />

      {/* 角落标记 — 玻璃质感 */}
      <div className="absolute top-6 left-6 w-3 h-3 border-l border-t border-bone/40 z-10" />
      <div className="absolute top-6 right-6 w-3 h-3 border-r border-t border-bone/40 z-10" />
      <div className="absolute bottom-6 left-6 w-3 h-3 border-l border-b border-bone/40 z-10" />
      <div className="absolute bottom-6 right-6 w-3 h-3 border-r border-b border-bone/40 z-10" />

      {/* 主内容 — 透视舞台 */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-12" style={{ perspective: "2000px" }}>
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* 左侧 — 主标题（3D 立体） */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 40,
              rotateX: phase >= 2 ? 0 : 10,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-px bg-rust" />
              <div className="label text-rust/80">深渊恐惧 · 故事片分镜</div>
            </div>

            {/* 主标 — 3D 立体巨字 */}
            <h1
              className="text-3d-rust text-[180px] md:text-[240px] leading-[0.85] tracking-tight"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="block">深渊</span>
              <span
                className="block text-rust"
                style={{
                  textShadow:
                    "0 1px 0 #E8854D, 0 2px 0 #D6743A, 0 3px 0 #B85F2A, 0 4px 0 #8B4520, 0 6px 0 #5C2A0F, 0 8px 16px rgba(0,0,0,0.6), 0 16px 32px rgba(201,90,43,0.3)",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                }}
              >
                恐惧
              </span>
            </h1>

            {/* 副标 — 玻璃胶囊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-4 mt-8"
            >
              <div className="pill-3d rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="font-mono text-[10px] text-bone/70 tracking-[0.3em]">ABYSS</span>
                <span className="text-bone/30">/</span>
                <span className="font-mono text-[10px] text-rust tracking-[0.3em]">FEAR</span>
              </div>
              <div className="pill-3d rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="font-mono text-[10px] text-bone tracking-widest">{projectMeta.sequence}</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-bone/30 to-transparent" />
            </motion.div>
          </motion.div>

          {/* 右侧 — 立体玻璃面板（含诗意引文 + 数据） */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 8 }}
            animate={{
              opacity: phase >= 3 ? 1 : 0,
              x: phase >= 3 ? 0 : 30,
              rotateY: phase >= 3 ? 0 : 8,
            }}
            transition={{ duration: 1, delay: 0.4 }}
            className="col-span-4"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
          >
            <div className="glass-rust rounded-lg p-6 rust-texture" style={{ transformStyle: "preserve-3d" }}>
              {/* 顶部 — 标签条 */}
              <div className="flex items-center justify-between mb-4">
                <div className="label text-rust/80">SCENE 03:00-03:15</div>
                <div className="dot-3d active" style={{ width: "10px", height: "10px" }} />
              </div>

              {/* 诗意引文 */}
              <p className="font-serif text-bone text-base leading-relaxed italic mb-6">
                "海面给出一个物体。<br />
                海沟收走一具身体。<br />
                <span className="text-rust">中间是水。</span>"
              </p>

              <div className="border-t border-rust/20 pt-3 mb-4 font-mono text-[9px] text-fog/70 tracking-widest">
                — SCREENPLAY EXCERPT · DRAFT 0.1
              </div>

              {/* 数据网格 */}
              <div className="grid grid-cols-2 gap-3">
                <DataCell k="DURATION" v="3:15" large />
                <DataCell k="DEPTH" v="3800M" />
                <DataCell k="SHOTS" v="05" />
                <DataCell k="FORMAT" v="IMAX" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部信息条 — 玻璃 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 glass rounded-lg p-4 grid grid-cols-4 gap-8"
        >
          <InfoCol k="SCENE" v={`${projectMeta.timecode}`} sub="PACIFIC · MARIANA TRENCH" />
          <InfoCol k="SHOTS" v="05" sub="SEQUENCE 21-25" />
          <InfoCol k="DEPTH" v="0 → -3800M" sub="VERTICAL DESCENT 3.8 KM" />
          <InfoCol k="FORMAT" v="IMAX 3D" sub="65mm · 1.43:1 · 5 PERF" />
        </motion.div>

        {/* 入口按钮 — 3D 金属 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex items-center gap-6"
        >
          <button
            onClick={onEnter}
            className="btn-3d rounded-md px-6 py-3 font-mono text-[11px] tracking-[0.3em]"
          >
            DESCEND · 开始下沉
          </button>
          <div className="flex items-center gap-2 font-mono text-[10px] text-fog tracking-widest">
            <kbd className="pill-3d rounded px-2 py-0.5 text-bone">↓</kbd>
            <span>SCROLL OR USE ARROW KEYS</span>
          </div>
        </motion.div>
      </div>

      {/* 右侧场次编号 */}
      <div className="absolute right-12 bottom-12 z-10 font-mono text-[10px] text-fog/60 tracking-widest text-right">
        <div>SCRIPT DRAFT</div>
        <div className="text-bone/60 mt-1">REV 0.1 · INTERNAL</div>
      </div>

      {/* 左下 REC 标记 */}
      <div className="absolute left-12 bottom-12 z-10 flex items-center gap-3">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-blood shadow-[0_0_12px_rgba(230,57,70,0.8)]"
        />
        <span className="font-mono text-[10px] text-bone tracking-widest">REC</span>
      </div>
    </section>
  );
}

function DataCell({ k, v, large }: { k: string; v: string; large?: boolean }) {
  return (
    <div className="border-l border-rust/30 pl-2">
      <div className="label text-[8px] text-fog/60">{k}</div>
      <div className={`numeral text-bone ${large ? "text-2xl" : "text-base"} mt-0.5 tracking-wider`}>
        {v}
      </div>
    </div>
  );
}

function InfoCol({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div>
      <div className="label text-[9px]">{k}</div>
      <div className="numeral text-bone text-lg mt-1 tracking-wider">{v}</div>
      <div className="font-mono text-[9px] text-fog/60 tracking-widest mt-0.5">{sub}</div>
    </div>
  );
}
