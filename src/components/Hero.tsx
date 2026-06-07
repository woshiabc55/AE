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

      {/* 右下 REC 标记 */}
      <div className="absolute left-12 bottom-12 z-10 flex items-center gap-3">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-blood shadow-[0_0_12px_rgba(230,57,70,0.8)]"
        />
        <span className="font-mono text-[10px] text-bone tracking-widest">REC</span>
      </div>

      {/* ====== 大量技术标注 ====== */}
      <HeroAnnotations />
    </section>
  );
}

// ---------- Hero 标注层 ----------
function HeroAnnotations() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 左侧 — 垂直深度刻度（从海面到海沟） */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <div className="font-mono text-[7px] text-fog/50 tracking-widest">DEPTH</div>
        <div className="relative w-px h-64 bg-gradient-to-b from-sun/40 via-bone/20 to-trench/60">
          {[0, 200, 800, 2000, 3000, 3800].map((m, i) => (
            <div
              key={i}
              className="absolute -left-1 flex items-center gap-1"
              style={{ top: `${(i / 5) * 100}%` }}
            >
              <div className="w-2 h-px bg-bone/40" />
              <div className="font-mono text-[6px] text-fog/50 tabular-nums">
                {m === 0 ? "0" : m === 3800 ? "-3.8K" : `-${m}`}
              </div>
            </div>
          ))}
        </div>
        <div className="font-mono text-[6px] text-fog/40 tracking-widest">M</div>
      </div>

      {/* 右侧 — 摄像机参数盒 */}
      <div className="absolute right-4 top-24 w-36 glass rounded p-2">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-1 h-1 bg-blood rounded-full animate-glow" />
          <div className="font-mono text-[7px] text-rust/80 tracking-widest">CAM · MSM 9802</div>
        </div>
        <SpecRow k="FORMAT" v="IMAX 3D" />
        <SpecRow k="GAUGE" v="65MM" />
        <SpecRow k="ASPECT" v="1.43:1" />
        <SpecRow k="PERF" v="5 / FRAME" />
        <SpecRow k="FPS" v="24" />
        <SpecRow k="LENS" v="HAWK 40MM" />
      </div>

      {/* 顶部中心 — 场景牌 */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 font-mono text-[8px] text-fog/50 tracking-[0.4em]">
          <span className="w-8 h-px bg-fog/30" />
          <span>SCENE 14 · EXT · OCEAN · DAY → DUSK</span>
          <span className="w-8 h-px bg-fog/30" />
        </div>
        <div className="font-mono text-[7px] text-rust/40 tracking-widest">
          SLUG · "ABYSS · DESCENT TO TRENCH"
        </div>
      </div>

      {/* 主标题左侧 — 引线 + 注释 */}
      <div className="absolute left-72 top-1/3 pointer-events-none">
        <svg width="200" height="120" className="absolute">
          <line x1="0" y1="0" x2="80" y2="40" stroke="rgba(201,90,43,0.4)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="80" y1="40" x2="180" y2="40" stroke="rgba(201,90,43,0.4)" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="80" cy="40" r="2" fill="rgba(201,90,43,0.6)" />
        </svg>
        <div className="absolute" style={{ left: 184, top: 24 }}>
          <div className="font-mono text-[7px] text-rust/70 tracking-widest">TITLE · MAIN</div>
          <div className="font-mono text-[7px] text-fog/60 tracking-widest">FONT · BEBAS NEUE 240PX</div>
          <div className="font-mono text-[7px] text-fog/50 tracking-widest">DEPTH 7 / RUST GRAD</div>
        </div>
      </div>

      {/* 主标题右侧 — 颜色注解 */}
      <div className="absolute right-[34%] top-1/3 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-bone/20" style={{ background: "linear-gradient(180deg, #E8854D 0%, #C95A2B 50%, #5C1A08 100%)" }} />
            <div>
              <div className="font-mono text-[7px] text-rust/70 tracking-widest">C-01 · RUST</div>
              <div className="font-mono text-[6px] text-fog/50 tabular-nums">#C95A2B · HSL 18° 65% 48%</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-bone/20" style={{ background: "linear-gradient(180deg, #E63946 0%, #8B1A20 100%)" }} />
            <div>
              <div className="font-mono text-[7px] text-blood/70 tracking-widest">C-02 · BLOOD</div>
              <div className="font-mono text-[6px] text-fog/50 tabular-nums">#E63946 · HSL 354° 76% 58%</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-bone/20" style={{ background: "linear-gradient(180deg, #4A6741 0%, #2A3A24 100%)" }} />
            <div>
              <div className="font-mono text-[7px] text-patina tracking-widest">C-03 · PATINA</div>
              <div className="font-mono text-[6px] text-fog/50 tabular-nums">#4A6741 · HSL 99° 22% 33%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 右下 — 3D 轴标 */}
      <div className="absolute right-4 bottom-32 w-20 h-20 glass rounded-lg p-1.5">
        <div className="font-mono text-[6px] text-fog/60 tracking-widest mb-1">CAM AXIS</div>
        <svg className="w-full h-14" viewBox="0 0 60 56">
          <line x1="6" y1="28" x2="54" y2="28" stroke="#C95A2B" strokeWidth="1" />
          <polygon points="54,28 50,26 50,30" fill="#C95A2B" />
          <text x="46" y="24" fill="#C95A2B" fontSize="5" fontFamily="JetBrains Mono">X</text>
          <line x1="6" y1="28" x2="6" y2="2" stroke="#E63946" strokeWidth="1" />
          <polygon points="6,2 4,6 8,6" fill="#E63946" />
          <text x="9" y="6" fill="#E63946" fontSize="5" fontFamily="JetBrains Mono">Y</text>
          <line x1="6" y1="28" x2="22" y2="48" stroke="#4A6741" strokeWidth="1" />
          <polygon points="22,48 18,46 20,42" fill="#4A6741" />
          <text x="24" y="50" fill="#4A6741" fontSize="5" fontFamily="JetBrains Mono">Z</text>
          <circle cx="6" cy="28" r="1.5" fill="#E8E8E8" />
        </svg>
      </div>

      {/* 左下 — 帧计数器 */}
      <div className="absolute left-12 bottom-20 glass rounded p-2 w-32">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-1 h-1 bg-blood rounded-full" />
          <div className="font-mono text-[7px] text-rust/80 tracking-widest">FRAME · 0000 / 0720</div>
        </div>
        <div className="font-mono text-[7px] text-bone tabular-nums">@ 24.00 FPS</div>
        <div className="mt-1 flex gap-px">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 ${i % 4 === 0 ? "bg-rust/60" : "bg-bone/15"}`}
            />
          ))}
        </div>
      </div>

      {/* 中下 — 进度条 + 节拍标 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 w-96">
        <div className="font-mono text-[7px] text-fog/50 tracking-widest">PROGRESS</div>
        <div className="flex-1 h-px bg-gradient-to-r from-fog/30 via-rust/50 to-bone/30" />
        <div className="font-mono text-[7px] text-rust/70 tabular-nums">00:00:00:00</div>
      </div>

      {/* 4 边刻度点 */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={`tick-${i}`}>
            <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2={i % 5 === 0 ? "6" : "3"} stroke="rgba(232,232,232,0.15)" strokeWidth="0.5" />
            <line x1="0" y1={`${i * 10}%`} x2={i % 5 === 0 ? "6" : "3"} y2={`${i * 10}%`} stroke="rgba(232,232,232,0.15)" strokeWidth="0.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-bone/5 py-0.5">
      <span className="font-mono text-[6px] text-fog/60 tracking-widest">{k}</span>
      <span className="font-mono text-[7px] text-bone/80 tabular-nums">{v}</span>
    </div>
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
